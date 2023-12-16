import fs from "fs"
import path from "path"
import util from "util"
import process from "process"
import child_process from "child_process"

import { jest } from "@jest/globals"

import Tool from "./tool"

const execAsync = util.promisify(child_process.exec)

export class TestTool extends Tool {
    static tool = "test"
    static envVar = "TESTENV_ROOT"
    static installer = "testenv"
}

export const testCwd = "tests-cwd"

// runAction returns a promise that wraps the subprocess action execution and
// allows for capturing error output if DEBUG is enabled
export async function runAction(name, env) {
    // const index = path.join(__dirname, name + '.js')
    const index = `${name}.js`
    let tool = new TestTool()
    env = env ? { ...process.env, ...env } : env
    return tool
        .subprocess(`node ../${index}`, {
            env: env,
            cwd: path.resolve(testCwd),
            silent: true,
        })
        .catch((err) => {
            throw new Error(
                `subprocess failed code ${err.exitCode}\n${err.stdout}\n${err.stderr}`,
            )
        })
}

/**
 * Run `name`.js in a subprocess using `env` as its environment.
 *
 * @param {String} name
 * @param {Object} env
 * @returns
 */
export async function runJS(name, env) {
    const index = `${name}.js`
    env = env ? { ...process.env, ...env } : env
    const opts = {
        env: env,
        cwd: path.resolve(testCwd),
        timeout: 5000,
    }
    return execAsync(`node ../${index}`, opts)
}

// runActionExpectError returns a promise that wraps the subprocess action
// execution and allows for capturing error output if DEBUG is enabled
export async function runActionExpectError(name, env) {
    // const index = path.join(__dirname, name + '.js')
    const index = `${name}.js`
    let tool = new TestTool()
    env = env ? { ...process.env, ...env } : env
    return tool.subprocess(`node ${index}`, { env: env, silent: true })
}

/**
 * Return an object with IGNORE_INSTALLED set based on the TEST_PRE_INSTALL
 * environment variable to allow testing against pre-installed versions.
 */
export function ignoreInstalled() {
    if (process.env.TEST_PRE_INSTALL) {
        return {}
    }
    process.env.IGNORE_INSTALLED = "true"
    return { IGNORE_INSTALLED: "true" }
}

/**
 * Removes any path containing *name* from the PATH parts.
 *
 * @param {string} name - Name to search for in the PATH parts.
 * @returns Cleaned path.
 */
export function cleanPath(name) {
    if (!name) return process.env.PATH
    let path = process.env.PATH
    path = path.split(":")
    path = path.filter((i) => !i.includes(name))
    path = Array.from(new Set(path))
    path = path.join(":")
    return path
}

/**
 * Create a Node.js version information. Every property but the version
 * and the LTS info is statically set.
 * @param {object} options
 * @param {string} [options.lts] LTS version name
 * @param {string} options.version Node.js version
 * @returns {object} Node.js version information
 */
export function createNodeVersion({ lts, version }) {
    return {
        date: "2022-06-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        modules: "108",
        name: "Node.js",
        npm: "8.12.1",
        openssl: "3.0.3+quic",
        security: false,
        url: `https://nodejs.org/download/release/${version}/`,
        uv: "1.43.0",
        v8: "10.2.154.4",
        zlib: "1.2.11",
        lts: lts || false,
        version,
    }
}

/**
 * Helper to clean up automatically installed tools during test suites so we
 * don't have collisions and false positives.
 */
const startupEnv = { ...process.env }

export class Cleaner {
    constructor(tool, name, files = []) {
        this.tool = tool
        this._name = name
        this.files = files
        this.roots = []
        this.origEnv = { ...startupEnv }
        // this.origEnv = {...process.env}
    }

    get name() {
        return this._name ?? this.tool?.installer
    }

    get envVar() {
        return this.tool.envVar
    }

    get root() {
        if (this._root) return this._root
        this._root = this.tool.tempRoot()
        this.roots.push(this._root)
        return this._root
    }

    set root(val) {
        this.roots.push(val)
        this._root = val
    }

    captureRoot(out) {
        if (!out) return
        const re = new RegExp(`::set-env name=${this.tool.envVar}::(.*)`)
        const found = out.match(re)
        if (!found) return
        if (found.length > 1) this._root = found[1]
    }

    get clean() {
        return this._clean.bind(this)
    }

    _clean() {
        for (const name of this.files) {
            this.rmSafe(name)
        }
        while (this.roots.length) {
            this.cleanRoot(this.roots.pop())
        }
        if (this._root) {
            this.cleanRoot(this._root)
            delete this._root
        }
    }

    cleanRoot(root) {
        if (!root) return
        this.rmSafe(root)
        this.rmSafe(path.dirname(root))

        if (root?.startsWith(process.env.RUNNER_TEMP)) {
            this.rmSafe(root)
        }

        // Restore our original environment
        process.env = this.origEnv
    }

    rmSafe(dir) {
        const re = new RegExp(`${this.tool.tool}|${this.tool.installer}`)
        if (!re.test(dir)) return
        if (fs.existsSync(dir)) {
            try {
                fs.rmSync(dir, { recursive: true })
            } catch (e) {
                // no errors for me
            }
        }
    }
}

/**
 * Helper to silence stdout and stderr when we don't care about the output.
 *
 * This is necessary because the GitHub Actions toolkit functions use
 * `stdout.write` directly for most of the output, and jest does not capture
 * that output.
 */
export class Mute {
    static all() {
        // Don't mute if debug is enabled
        if (process.env.RUNNER_DEBUG) return
        global.beforeAll?.(Mute.std)
        global.afterAll?.(Mute.reset)
    }

    static stdout() {
        jest.spyOn(process.stdout, "write").mockImplementation(() => {})
    }

    static stderr() {
        jest.spyOn(process.stderr, "write").mockImplementation(() => {})
    }

    static get std() {
        return () => {
            this.stdout()
            this.stderr()
        }
    }

    static get reset() {
        return jest.resetModules.bind(jest)
    }
}
