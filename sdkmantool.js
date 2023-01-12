import fs from "fs"
import path from "path"
import assert from "assert"
import process from "process"
import fsPromises from "fs/promises"

import Tool from "./tool.js"

// abstract class
export default class SdkmanTool extends Tool {
    static tool = "sdkman"
    static installer = "sdk"
    static installerPath = ".sdkman"
    static installerVersion = "sdk version"

    constructor() {
        super(SdkmanTool.tool)
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
