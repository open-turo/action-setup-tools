import fs from "fs"
import path from "path"
import assert from "assert"
import process from "process"
import fsPromises from "fs/promises"

import core from "@actions/core"

import Tool from "./tool.js"

export default class Java extends Tool {
    static tool = "java"
    static toolVersion = "java -version"
    static envVar = "SDKMAN_DIR"
    static installer = "sdk"
    static installerPath = ".sdkman"
    static installerVersion = "sdk version"

    constructor() {
        super(Java.tool)
    }

    // desiredVersion : The identifier for the specific desired version of java as
    // known to sdkman such as "11.0.2-open" for version 11.0.2 from java.net.
    // assumes sdkman is already installed on the self-hosted runner, is a failure
    // condition otherwise.
    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] =
            this.getJavaVersion(desiredVersion)
        if (!(await this.haveVersion(checkVersion))) return

        // Make sure that sdkman is installed
        await this.findInstaller()

        // This doesn't fail hard, but it probably should
        this.checkSdkmanSettings(
            path.join(`${await this.findRoot()}`, "etc/config"),
        )

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("JAVA_VERSION", checkVersion)
        }

        // If sdkman is requested to install the same version of java more than once,
        // all subsequent attempts will be a no-op and sdkman will report a message of the
        // form "java 11.0.2-open is already installed". sdk install does not pick up the
        // environment variable JAVA_VERSION unlike tfenv, so we specify it here as an
        // argument explicitly, if it's set
        await this.subprocessShell(`sdk install java ${checkVersion}`).catch(
            this.logAndExit(`failed to install: ${checkVersion}`),
        )

        // Set the "current" default Java version to the desired version
        await this.subprocessShell(`sdk default java ${checkVersion}`).catch(
            this.logAndExit(`failed to set default: ${checkVersion}`),
        )

        // export JAVA_HOME to force using the correct version of java
        const javaHome = `${process.env[this.envVar]}/candidates/java/current`
        core.exportVariable("JAVA_HOME", javaHome)

        // Augment path so that the current version of java according to sdkman will be
        // the version found.
        core.addPath(`${javaHome}/bin`)

        // Remove the trailing -blah from the Java version string
        const expectedVersion = checkVersion.replace(/[-_][^-_]+$/, "")

        // Sanity check that the java command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion(expectedVersion, (version) =>
            this.parseJavaVersionString(expectedVersion, version),
        )

        // If we got this far, we have successfully configured java.
        core.setOutput(Java.tool, checkVersion)
        this.info("java success!")
    }

    /**
     * Return the path to the tool installation directory, if found, otherwise
     * return the default path to the tool.
     *
     * @returns {String} - Path to the root folder of the tool.
     */
    async findRoot() {
        ;(function () {
            // All of this is to check if we have a sdkman install that hasn't
            // been shimmed which won't be found correctly
            let check = this.defaultRoot
            if (!fs.existsSync(check)) return
            this.debug("defaultRoot exists")

            check = path.join(check, "bin", "sdkman-init.sh")
            if (!fs.existsSync(check)) return
            this.debug("sdkman-init.sh exists")

            check = path.join(this.defaultRoot, "bin", "sdk")
            if (fs.existsSync(check)) return
            this.debug("sdk shim does not exist")

            this.shimSdk(this.defaultRoot)
        }.bind(this)())
        return super.findRoot()
    }

    /**
     * Download and configures sdkman.
     *
     * @param  {string} root - Directory to install sdkman into (SDKMAN_DIR).
     * @param  {string} noShim - Don't install the `sdk` shim.
     * @return {string} The value of SDKMAN_DIR.
     */
    async install(root, noShim = false) {
        assert(root, "root is required")
        const url = "https://get.sdkman.io?rcupdate=false"
        const install = await this.downloadTool(url)

        // Export the SDKMAN_DIR for installation location
        await this.setEnv(root)

        // Create an env copy so we don't call findRoot during the install
        const env = { ...process.env, ...(await this.getEnv(root)) }

        // Remove the root dir, because Sdkman will not install if it exists,
        // which is dumb, but that's what we got
        if (fs.existsSync(root)) await fsPromises.rmdir(root)

        // Run the installer script
        await this.subprocessShell(`bash ${install}`, { env: env })

        // Shim the sdk cli function and add to the path
        if (!noShim) this.shimSdk(root)

        // Asynchronously clean up the downloaded installer script
        fsPromises.rm(install, { recursive: true }).catch(() => {})

        return root
    }

    /**
     * Create a shim for the `sdk` CLI functions that otherwise would require an
     * active shell.
     *
     * @param {string} root - The root directory of the sdkman installation.
     */
    shimSdk(root) {
        const shim = path.join(root, "bin", "sdk")

        // This is our actual sdk shim script
        const shimTmpl = `\
#!/bin/bash
export SDKMAN_DIR="${root}"
SDKMAN_INIT_FILE="$SDKMAN_DIR/bin/sdkman-init.sh"
if [[ ! -s "$SDKMAN_INIT_FILE" ]]; then exit 13; fi
if [[ -z "$SDKMAN_AVAILABLE" ]]; then source "$SDKMAN_INIT_FILE" >/dev/null; fi
export -f
sdk "$@"
`
        this.info(`Creating sdk shim at ${shim}`)

        // Ensure we have a path to install the shim to, no matter what
        fs.mkdirSync(path.dirname(shim), { recursive: true })
        // Remove the shim if there's something there, it's probably bad
        if (fs.existsSync(shim)) fs.rmSync(shim)
        // Write our new shim
        fs.writeFileSync(shim, shimTmpl, { mode: 0o755 })
    }

    // determines the desired version of java that is being requested. if the desired version
    // presented to the action is present, that version is honored rather than the version
    // presented in the .sdkmanrc file that can be optionally present in the checked out repo itself.
    // Second value returned indicates whether or not the version returned has overridden
    // the version from the .sdkmanrc file.
    getJavaVersion(actionDesiredVersion) {
        // Check if we have any version passed in to the action (can be null/empty string)
        if (actionDesiredVersion) return [actionDesiredVersion, true]

        const readJavaVersion = this.parseSdkmanrc()
        if (readJavaVersion) {
            this.debug(`Found java version ${readJavaVersion} in .sdkmanrc`)
            return [readJavaVersion, false]
        }
        // No version has been specified
        return [null, null]
    }

    parseSdkmanrc(filename) {
        filename = filename || ".sdkmanrc"
        filename = path.resolve(path.join(process.cwd(), filename))
        // No file? We're done
        if (!fs.existsSync(filename)) {
            this.debug(`No .sdkmanrc file found: ${filename}`)
            return
        }

        // Read our file and split it linewise
        let data = fs.readFileSync(filename, { encoding: "utf8", flag: "r" })
        if (!data) return
        data = data.split("\n")

        // Iterate over each line and match against the regex
        const find = new RegExp("^([^#=]+)=([^# ]+)$")
        let found = {}
        for (let line of data) {
            const match = find.exec(line)
            if (!match) continue
            found[match[1]] = match[2]
        }
        this.debug(`Found .sdkmanrc entries ${JSON.stringify(found)}`)
        return found["java"]
    }

    // parseJavaVersionString specially handles version string extraction
    // because we have to map strings like 1.8.0_282 to 8.0.282 for the actual
    // SemVer comparison
    versionParser(text) {
        // Default case for 11.x or 17.x it should match and we're ok
        let versions = super.versionParser(text)
        this.debug(`versionParser: ${versions}`)
        if (!versions.length) return versions

        // Fast check for 1.x versions that don't parse right
        const v = /^\d+\.\d+\.\d+/ // Check against X.Y.Z
        const v1x = /^1\.\d+\.\d+/ // Check against 1.Y.Z
        if (v.test(versions[0]) && !v1x.test(versions[0])) return versions

        // This parsing is to match the version string for 1.8.0_282 (or
        // similar) which is what the java binary puts out, however `sdkman`
        // uses the updated naming of `8.0.282` which is what we want to check
        // against, so we're going to hard parse against X.Y.Z_W to rewrite it
        // to Y.Z.W
        const parser = /1\.([0-9]+\.[0-9]+_[0-9]+)/
        const matched = parser.exec(text)
        this.debug(`versionParser: matched 1.x version: ${matched}`)
        if (!matched) return versions
        return [matched[1].replace("_", ".")]
    }

    /**
     * Ensure that the sdkman config file contains the settings necessary for
     * executing in a non-interactive CI environment.
     */
    checkSdkmanSettings(configFile) {
        // Easy case, no file, make sure the directory exists and write config
        if (!fs.existsSync(configFile)) {
            this.debug("writing sdkman config")
            const configPath = path.dirname(configFile)
            fs.mkdirSync(configPath, { recursive: true })
            // This config is taken from the packer repo
            fs.writeFileSync(
                configFile,
                `\
sdkman_auto_answer=true
sdkman_auto_complete=true
sdkman_auto_env=true
sdkman_beta_channel=false
sdkman_colour_enable=true
sdkman_curl_connect_timeout=7
sdkman_curl_max_time=10
sdkman_debug_mode=false
sdkman_insecure_ssl=false
sdkman_rosetta2_compatible=false
sdkman_selfupdate_enable=false`,
            )
            return
        }

        this.debug("sdkman config already present")
        // If we get here, the file exists, and we just hope it's configured right
        let data = fs.readFileSync(configFile, "utf8")
        if (/sdkman_auto_answer=true/.test(data)) {
            // We're good
            this.debug("sdkman config okay")
            return
        }

        this.debug("sdkman config misconfigured, maybe")
        this.debug(fs.readFileSync(configFile, "utf8"))

        this.debug("overwriting it because otherwise this tool won't work")
        data = data.replace(
            /sdkman_auto_answer=false/,
            "sdkman_auto_answer=true",
        )
        data = data.replace(
            /sdkman_selfupdate_enable=true/,
            "sdkman_selfupdate_enable=true",
        )
        fs.writeFileSync(configFile, data)
    }
}

// Register the subclass in our tool list
Java.register()
