import fs from "fs"
import path from "path"
import process from "process"

import core from "@actions/core"

import SdkmanTool from "./sdkmantool.js"

export default class Kotlin extends SdkmanTool {
    static tool = "kotlin"
    static toolVersion = "kotlin -version"
    static envVar = "SDKMAN_DIR"
    static installer = "sdk"
    static installerPath = ".sdkman"
    static installerVersion = "sdk version"

    constructor() {
        super(Kotlin.tool)
    }

    // desiredVersion : The identifier for the specific desired version of kotlin as
    // known to sdkman such as "16.21". assumes sdkman is already installed on the
    // self-hosted runner, is a failure condition otherwise.
    async setup(desiredVersion) {
        const [checkVersion] = this.getKotlinVersion(desiredVersion)
        if (!(await this.haveVersion(checkVersion))) {
            return checkVersion
        }

        // Make sure that sdkman is installed
        await this.findInstaller()

        // This doesn't fail hard, but it probably should
        this.checkSdkmanSettings(
            path.join(`${await this.findRoot()}`, "etc/config"),
        )

        // If sdkman is requested to install the same version of kotlin more than once,
        // all subsequent attempts will be a no-op and sdkman will report a message of the
        // form "kotlin 1.6.21 is already installed".
        await this.subprocessShell(`sdk install kotlin ${checkVersion}`).catch(
            this.logAndExit(`failed to install: ${checkVersion}`),
        )

        // Set the "current" default Kotlin version to the desired version
        await this.subprocessShell(`sdk default kotlin ${checkVersion}`).catch(
            this.logAndExit(`failed to set default: ${checkVersion}`),
        )

        // Sanity check that the kotlin command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion(checkVersion)

        // If we got this far, we have successfully configured kotlin.
        core.setOutput(Kotlin.tool, checkVersion)
        this.info("kotlin success!")
        return checkVersion
    }

    // determines the desired version of kotlin that is being requested. if the desired version
    // presented to the action is present, that version is honored rather than the version
    // presented in the .sdkmanrc file that can be optionally present in the checked out repo itself.
    // Second value returned indicates whether or not the version returned has overridden
    // the version from the .sdkmanrc file.
    getKotlinVersion(actionDesiredVersion) {
        // Check if we have any version passed in to the action (can be null/empty string)
        if (actionDesiredVersion) return [actionDesiredVersion, true]

        const readKotlinVersion = this.parseSdkmanrc()
        if (readKotlinVersion) {
            this.debug(`Found kotlin version ${readKotlinVersion} in .sdkmanrc`)
            return [readKotlinVersion, false]
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
        return found["kotlin"]
    }
}

// Register the subclass in our tool list. Kotlin depends upon Java being installed first, and as such is
// relegated to the second registry tier.
Kotlin.registerTier2()
