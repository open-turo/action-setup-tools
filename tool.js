import fs from "fs"
import os from "os"
import path from "path"
import crypto from "crypto"
import process from "process"
import fsPromises from "fs/promises"

import io from "@actions/io"
import core from "@actions/core"
import toolCache from "@actions/tool-cache"
import { getExecOutput } from "@actions/exec"
import findVersions from "find-versions"
import semver from "semver"

// Superclass for all supported tools
export default class Tool {
    static registry = {}

    /** Default values that we don't want to bury in the code. */
    static defaults = {
        RUNNER_TEMP: process.env.RUNNER_TEMP ?? "/tmp/runner",
    }
    get defaults() {
        return this.constructor.defaults
    }

    /** Accessors for the statics declared on subclasses. */
    get tool() {
        return this.constructor.tool
    }
    get toolVersion() {
        return (
            this.constructor.toolVersion ?? `${this.constructor.tool} --version`
        )
    }
    get envVar() {
        return this.constructor.envVar
    }
    get envPaths() {
        const paths = this.constructor.envPaths ?? ["bin"]
        return Array.isArray(paths) ? paths : [paths]
    }
    get installer() {
        return this.constructor.installer
    }
    get installerPath() {
        return this.constructor.installerPath ?? `.${this.installer}`
    }
    get installerVersion() {
        return (
            this.constructor.installerVersion ?? `${this.installer} --version`
        )
    }

    /**
     * Make a new Tool instance.
     * @param {string} name - Tool name passed from subclass.
     */
    constructor(name) {
        this.name = name

        const required = ["tool", "envVar", "installer"]
        for (const member of required) {
            if ((this.constructor[member] ?? null) == null) {
                throw new Error(
                    `${this.constructor.name}: missing required member '${member}'`,
                )
            }
        }

        // Create logger wrapper functions for this tool
        const loggers = ["debug", "info", "warning", "notice", "error"]
        loggers.forEach((logger) => {
            this[logger] = (...msg) => this.log(logger, msg)
        })

        // Only create the this.silly logger once so it's a fast passthrough that the
        // runtime can optimize away
        this.silly = process.env.SILLY_LOGGING
            ? (...msg) => this.debug(`SILLY ${msg.join(" ")}`)
            : () => {}
    }

    // Log a message using method from core and msg prepended with the name
    log(method, msg) {
        if (Array.isArray(msg)) {
            if (this.name) msg = `[${this.name}]\t${msg.join(" ")}`
            else msg = msg.join(" ")
        }
        core[method](msg)
    }

    // determines the desired version of the tool (e.g. terraform) that is being requested.
    // if the desired version presented to the action is present, that version is
    // honored rather than the version presented in the version file (e.g. .terraform-version)
    // that can be optionally present in the checked out repo itself.
    // Second value returned indicates whether or not the version returned has overridden
    // the version from the repositories tool version file.
    getVersion(actionDesiredVersion, repoToolVersionFilename) {
        this.debug(`getVersion: ${repoToolVersionFilename}`)
        // Check if we have any version passed in to the action (can be null/empty string)
        if (actionDesiredVersion) return [actionDesiredVersion, true]

        if (fs.existsSync(repoToolVersionFilename)) {
            let textRead = fs.readFileSync(repoToolVersionFilename, {
                encoding: "utf8",
                flag: "r",
            })
            const readToolVersionNumber = textRead ? textRead.trim() : textRead
            this.debug(
                `Found version ${readToolVersionNumber} in ${repoToolVersionFilename}`,
            )
            if (readToolVersionNumber && readToolVersionNumber.length > 0)
                return [readToolVersionNumber, false]
        }
        // No version has been specified
        return [null, null]
    }

    /**
     * Return an array of the found version strings in `text`.
     * @param {string} text - Text to parse looking for versions.
     * @returns {Array} - Found version strings.
     */
    versionParser(text) {
        return findVersions(text, { loose: true })
    }

    /**
     * Run `cmd` with environment `env` and resolves the promise with any
     * parsable version strings in an array. provide true for
     * useLooseVersionFinding when the expected version string contains
     * non-version appearing values such as go1.16.8.
     * @param {string} cmd - Command to run to find version output.
     * @param {boolean} soft - Set to a truthy value to skip hard failure.
     * @returns {string} - The version string that was found.
     */
    async version(cmd, soft) {
        this.silly(`version cmd: ${cmd}`)
        let check = this.subprocessShell(cmd, { silent: true })
            .then((proc) => {
                if (proc.stdout) {
                    let stdoutVersions = this.versionParser(proc.stdout)
                    if (stdoutVersions) return stdoutVersions
                }
                if (proc.stderr) {
                    return this.versionParser(proc.stderr)
                }
                this.debug("version: no output parsed")
                return []
            })
            .then((versions) => {
                if (!versions || versions.length < 1) {
                    throw new Error(`${cmd}: no version found`)
                }
                this.info(`${cmd}: ${versions[0]}`)
                return versions[0]
            })

        // This is a hard check and will fail the action
        if (!soft) {
            return check.catch(this.logAndExit(`failed to get version: ${cmd}`))
        }

        return check.catch((err) => {
            this.silly(`version error: ${err}`)
            // Return a soft/empty version here
            if (/Unable to locate executable file:/.test(err.message)) {
                return null
            }
            // Otherwise re-throw
            throw err
        })
    }

    // validateVersion returns the found current version from a subprocess which
    // is compared against the expected value given
    async validateVersion(expected) {
        const command = this.toolVersion
        this.debug(`validateVersion: ${expected}: ${command}`)
        let actual = await this.version(command)
        if (expected != actual) {
            this.debug(`found command ${io.which(command.split(" ")[0])}`)
            // this.debug(process.env.PATH)
            this.logAndExit(`version mismatch ${expected} != ${actual}`)(
                new Error("version mismatch"),
            )
        }
        return actual
    }

    /**
     * Return true if `version` is not satisfied by existing tooling, is an
     * empty string, or IGNORE_INSTALLED is set. Return `false` if we have found
     * a matching SemVer compatible tool on the PATH.
     *
     * @param {string} version
     * @returns
     */
    async haveVersion(version) {
        if (!version || version.length < 1) {
            this.debug("skipping setup, no version found")
            return false
        }
        this.info(`Desired version: ${version}`)
        if (process.env.IGNORE_INSTALLED) {
            this.info("    not checking for installed tools")
            return true
        }
        this.debug("checking for installed version")
        const found = await this.version(this.toolVersion, true).catch(
            (err) => {
                if (
                    /^subprocess exited with non-zero code:/.test(err.message)
                ) {
                    // This can happen if there's no default version, so we
                    // don't want to hard error here
                    return null
                }
                throw err
            },
        )

        // this.debug(`found version: ${found}`)
        if (!found) return true

        const semantic = `^${version.replace(/\.\d+$/, ".x")}`
        const ok = semver.satisfies(found, semantic)
        if (!ok) {
            // If we haven't found an existing, matching version on the PATH, we
            // set our environment so we can actually install the one we want
            this.setEnv()
            this.info(
                `Installed tool version ${found} does not satisfy ` +
                    `${semantic}...`,
            )
            return true
        }

        this.info(
            `Found installed tool version ${found} that satisfies ${semantic},` +
                ` skipping setup...`,
        )
        return false
    }

    /**
     * Invokes `cmd` with environment `env` and resolves the promise with
     * an object containing the output and any error that was caught
     * @param {string} cmd - Command to run.
     * @param {Object} opts - Subprocess options.
     */
    async subprocess(cmd, opts = { silent: false }) {
        let proc = {
            stdout: "",
            stderr: "",
            err: null,
            exitCode: 0,
        }

        this.silly(`subprocess env exists?: ${!!opts.env}`)
        // Always merge the passed environment on top of the process environment so
        // we don't lose execution context
        // opts.env = opts.env ?? { ...process.env, ...(await this.getEnv()) }
        // opts.env = opts.env ?? { ...process.env }

        // this.debug("subprocess got env")

        // This lets us inspect the process output, otherwise an error is thrown
        // and it is lost
        opts.ignoreReturnCode = opts.ignoreReturnCode ?? true

        // this.debug(`subprocess cmd: ${cmd}`)
        // let args = shellQuote.parse(cmd)
        let args = this.tokenizeArgs(cmd)
        // this.debug(`subprocess args: ${args}`)
        cmd = args.shift()

        return new Promise((resolve, reject) => {
            getExecOutput(cmd, args, opts)
                .then((result) => {
                    if (result.exitCode > 0) {
                        let err = new Error(
                            `subprocess exited with non-zero code: ${cmd}`,
                        )
                        err.exitCode = result.exitCode
                        err.stdout = result.stdout
                        err.stderr = result.stderr
                        err.env = { ...opts.env }
                        reject(err)
                        return
                    }

                    proc.exitCode = result.exitCode
                    proc.stdout = result.stdout
                    proc.stderr = result.stderr
                    proc.env = { ...opts.env }
                    resolve(proc)
                })
                .catch((err) => {
                    if (/^Unable to locate executable file/.test(err.message)) {
                        this.debug(`'${cmd.split(" ")[0]}' not on PATH`)
                        this.silly(`PATH = ${opts.env.PATH}`)
                    }
                    reject(err)
                })
        })
    }

    /**
     * Run `cmd` with options `opts` in a bash subshell to ensure the PATH
     * environment is set.
     * @param {String} cmd - Command to run.
     * @param {Object} opts - Subprocess options.
     * @returns
     */
    async subprocessShell(cmd, opts) {
        opts = opts ?? {}
        const escaped = cmd.replace(/"/g, '\\"')
        const cmdName = this.tokenizeArgs(cmd).shift()
        const shell = `bash -c "` + escaped + `"`
        const name = opts.check ? "\tcheckExecutableExists" : "subprocessShell"

        this.silly(`${name} running: ${cmd}`)

        this.silly(`${name} env exists? ${!!opts.env}`)
        opts.env = opts.env ?? { ...process.env, ...(await this.getEnv()) }

        if (process.env.SILLY_LOGGING) {
            let paths = (opts.env.PATH || "")
                .split(":")
                .filter((i) => i.includes(this.installer))
            if (!paths) this.silly(`${name} no matching PATH`)
            else this.silly(`${name} matching PATH=`)
            paths.forEach((p) => this.silly(`${name} \t${p}`))
        }

        let cmdExists
        if (!opts.check) {
            this.silly(`subprocessShell: ${shell}`)
            const checkOpts = { ...opts, silent: true, check: true }
            cmdExists = await this.subprocessShell(
                `command -v ${cmdName}`,
                checkOpts,
            )
                .then((proc) => {
                    this.silly(`\tcommand exists: ${proc.stdout.trim()}`)
                    return true
                })
                .catch(() => {
                    this.silly(`\tcommand does not exist: ${cmdName}}`)
                    return false
                })
        } else {
            this.silly(`${name} checking: ${shell}`)
        }
        delete opts.check

        const proc = await this.subprocess(shell, opts).catch((err) => {
            this.silly(`${name} caught error: ${err}`)
            if (
                /^subprocess exited with non-zero code: bash/.test(err.message)
            ) {
                if (cmdExists) {
                    this.silly(`${name} command exists: ${cmd}, but failed`)
                    this.silly(`\t${err.stderr}`)
                    err.message = `subprocess exited with non-zero code: ${cmd}`
                    // this.debug(`subprocessShell error: ${err.stderr}`)
                } else {
                    this.silly(`${name} command does not exist`)
                    err.message = `Unable to locate executable file: ${cmdName}`
                }
            }
            this.silly(`${name} throwing...`)
            throw err
        })
        return proc
    }

    /**
     * Return `cmd` split into arguments using basic quoting.
     *
     * This has only limited token parsing powers, so full Bash quoting and
     * variables and newlines or line continuations will break things.
     *
     * @param {string} cmd
     * @returns
     */
    tokenizeArgs(cmd) {
        let last = 0
        let peek = last
        const tokens = []
        let escaped = false
        let quoted = null
        let quote = 0

        const tokenize = () => {
            // Empty string, skip it
            if (last == peek) return
            // Grab the token
            let token = cmd.slice(last, peek)
            // Replace escaped whitespace with a space
            token = token.replace(/\\ /g, " ")
            tokens.push(token)
        }

        while (peek < cmd.length) {
            let char = cmd[peek]
            // this.debug(`  ${char}  ${!!quoted}\t${escaped}`)
            switch (char) {
                case "'":
                case '"':
                    // Escaped quotes aren't handled lexographically
                    if (escaped && quoted != char) break
                    else if (escaped) {
                        // If it's escaped and the char we're escaping is the
                        // same as our quote, remove the escaping since it won't
                        // be needed in the final token
                        cmd =
                            cmd.slice(0, peek - 1) + cmd.slice(peek, cmd.length)
                        peek--
                        break
                    }
                    // If we have an open quote and we're hitting the same one,
                    // and we're not escaped, that will close the quote and the
                    // next whitespace character will signify the token end
                    if (quoted && quoted == char) {
                        // Here we have to strip the quotes from the original
                        // string(!) so they are processed correctly
                        // (e.g. "foo"bar"baz" -> foo"bar"baz)
                        cmd =
                            cmd.slice(0, quote) +
                            cmd.slice(quote + 1, peek) +
                            cmd.slice(peek + 1, cmd.length)
                        peek -= 2 // Removed quote length
                        quoted = null
                        quote = 0
                    } else if (!quoted) {
                        quoted = char
                        quote = peek
                    }
                    break
                case "`":
                    // Backticks are handled separately because they should not
                    // be removed from the tokens
                    if (escaped) break
                    if (quoted && quoted == char) {
                        quoted = null
                        quote = 0
                    } else if (!quoted) {
                        quoted = char
                        quote = peek
                    }
                    break
                case `\\`:
                    escaped = true
                    peek++
                    continue
                case `\n`:
                case ` `:
                    if (quoted) break
                    if (escaped) break
                    // If we're not quoting or escaping this whitespace, then we
                    // found a token
                    tokenize()
                    last = peek + 1
                    break
            }
            escaped = false
            peek++
        }
        tokenize()
        return tokens
    }

    // logAndExit logs the error message from a subprocess and sets the failure
    // message for the Action and exits the process entirely
    logAndExit(msg) {
        return (err) => {
            if (err) this.error(err)
            core.setFailed(msg)
            throw err
        }
    }

    /**
     * This checks if the installer tool, e.g. nodenv, is present and
     * functional, otherwise it will run the install() method to install it.
     */
    async findInstaller() {
        this.info(`Finding installer: ${this.installerVersion}`)
        const found = await this.version(this.installerVersion, true)
        if (found) {
            this.info("Installer found, setting environment")
            await this.setEnv()
            return
        }

        this.info("Installer not found... attempting to install")
        let root = await this.findRoot()
        root = await this.install(root)

        this.info("Install finished, setting environment")
        await this.setEnv(root)

        this.info("Checking version")
        return this.version(this.installerVersion).catch((err) => {
            this.debug(`version check failed: ${err.exitCode}`)
            this.debug(`  stdout: ${err.stdout}`)
            this.debug(`  stderr: ${err.stderr}`)
            throw err
        })
    }

    /**
     * Return a temporary directory suitable for installing our tool within.
     * @returns {string} - Temporary directory path.
     */
    get tempRoot() {
        if (this._tempRoot) return this._tempRoot
        this._tempRoot = this.constructor.tempRoot()
        return this._tempRoot
    }

    /**
     * Create and return a new temporary directory for installing our tool.
     * @returns {string} - Temporary directory path.
     */
    static tempRoot() {
        const root = path.join(
            this.defaults.RUNNER_TEMP,
            this.tool,
            crypto.randomUUID(),
            this.installerPath ?? `.${this.installer}`,
        )
        core.debug(`[${this.tool}]\tCreating temp root: ${root}`)
        fs.mkdirSync(root, { recursive: true })
        return root
    }

    /**
     * Return the default root path to where the tool likes to be installed.
     */
    get defaultRoot() {
        return path.join(os.homedir(), this.installerPath)
    }

    /**
     * Return the path to the tool installation directory, if found, otherwise
     * return the default path to the tool.
     *
     * @returns {String} - Path to the root folder of the tool.
     */
    async findRoot() {
        const tool = this.installer
        const toolEnv = this.envVar
        let toolPath = process.env[toolEnv]
        // Return whatever's currently set if we have it
        if (toolPath) {
            this.debug(`${toolEnv} set from environment: ${toolPath}`)
            if (!fs.existsSync(toolPath)) {
                throw new Error(
                    `${toolEnv} misconfigured: ${toolPath} does not exist`,
                )
            }
            return toolPath
        }

        // Default path is ~/.<dir>/ since that's what our CI uses and most of
        // the tools install there too
        const defaultPath = this.defaultRoot

        // Use a subshell get the command path or function name and
        // differentiate in a sane way
        const defaultEnv = {
            ...process.env,
            ...(await this.getEnv(defaultPath)),
        }
        const check = `sh -c "command -v ${tool}"`
        const proc = await this.subprocess(check, {
            env: defaultEnv,
            silent: true,
        }).catch(() => {
            this.debug("command -v failed, using default path")
            return { stdout: defaultPath }
        })
        toolPath = proc.stdout ? proc.stdout.trim() : ""
        if (toolPath == tool) {
            // This means it's a function from the subshell profile
            // somewhere, so we just have to use the default
            this.debug("Found tool path as function name")
            return defaultPath
        }
        if (!fs.existsSync(toolPath)) {
            // This is a weird error case
            this.debug(`tool root does not exist: ${toolPath}`)
            this.debug(`using temp root: ${this.tempRoot}`)
            return this.tempRoot
        }

        // Walk down symbolic links until we find the real path
        while (toolPath) {
            const stat = await fsPromises.lstat(toolPath).catch((err) => {
                this.error(err)
                return defaultPath
            })
            if (!stat.isSymbolicLink()) break

            let link = await fsPromises.readlink(toolPath).catch((err) => {
                this.error(err)
                return defaultPath
            })
            // Make sure we can resolve relative symlinks which Homebrew uses
            toolPath = path.resolve(path.dirname(toolPath), link)
        }

        const re = new RegExp(`/(bin|libexec)/${tool}$`)
        toolPath = toolPath.replace(re, "")
        if (fs.existsSync(toolPath)) return toolPath

        let err = `${toolEnv} misconfigured: ${toolPath} does not exist`
        this.error(err)
        throw new Error(err)
    }

    /**
     * Subclasses should implement install to install our installer tools.
     * @param {string} root - The root install directory for the tool.
     */
    async install(root) {
        const err = "install not implemented"
        this.debug(`attempting to install to ${root}`)
        this.error(err)
        throw new Error(err)
    }

    /**
     * Downloads a url and optionally untars it
     * @param  {string} url - The url to download.
     * @param  {(string|{dest: string, strip: number})} tar - Path to extract
     *         tarball to, or tar options.
     * @returns {string} The path to the downloaded or extracted file.
     */
    async downloadTool(url, tar) {
        this.debug(`downloadTool: ${url}`)
        // This is really only used to support the test environment...
        if (!process.env.RUNNER_TEMP) {
            this.debug(
                "RUNNER_TEMP required by tool-cache, setting a sane default",
            )
            process.env.RUNNER_TEMP = this.defaults.RUNNER_TEMP
        }
        const download = await toolCache.downloadTool(url)
        // Straightforward download to temp directory
        if (!tar) return download

        // Extract the downloaded tarball
        tar = tar ?? {}
        // Allow simple destination extract string
        if (typeof tar === "string") tar = { dest: tar }
        // Match default args for tool-cache
        tar.args = tar.args ?? ["-xz"]
        // Allow stripping directories
        if (tar.strip) tar.args.push(`--strip-components=${tar.strip}`)
        // Extract the tarball
        const dir = await toolCache.extractTar(download, tar.dest, tar.args)
        // Try to remove the downloaded file now that we have extracted it, but
        // allow it to happen async and in the background, and we don't care if
        // it fails
        await fsPromises.rm(download, { recursive: true }).catch(() => {})
        // Return the extracted directory
        return dir
    }

    /**
     * Build and return an environment object suitable for calling subprocesses
     * consistently.
     * @param {string} root - Root directory of this tool.
     * @returns {Object} - Environment object for use in subprocesses.
     */
    async getEnv(root) {
        this.silly(`getEnv: ${root}`)
        root = root ?? (await this.findRoot())
        const env = {}
        let envPath = process.env.PATH ?? ""
        const testPath = `:${envPath}:`
        for (let dir of this.envPaths) {
            dir = path.join(root, dir)
            if (testPath.includes(`:${dir}:`)) continue
            envPath = this.addPath(dir, envPath)
        }
        env.PATH = envPath
        env[this.envVar] = root
        return env
    }

    /**
     * Export the environment settings for this tool to work correctly.
     * @param {string} root - The root installer directory for our tool.
     */
    async setEnv(root) {
        root = root ?? (await this.findRoot())
        core.exportVariable(this.envVar, root)
        for (const dir of this.envPaths) {
            core.addPath(path.join(root, dir))
        }
    }

    /**
     * Modifies and de-duplicates PATH strings.
     * @param {string} newPath - Path to add to exising PATH.
     * @param {string} path - PATH string from environment.
     * @returns {string} - New PATH value.
     */
    addPath(newPath, path = process.env.PATH) {
        path = path.split(":").filter((p) => p != "")
        path.push(newPath)
        path = [...new Set(path)]
        path = path.join(":")
        return path
    }

    // register adds name : subclass to the tool registry
    static register() {
        this.registry[this.tool] = this
    }

    // all returns an array of objects containing the tool name and the bound
    // setup function of a tool instance
    static all() {
        return Object.keys(this.registry).map((k) => {
            let tool = new this.registry[k]()
            return { name: k, setup: tool.setup.bind(tool) }
        })
    }
}
