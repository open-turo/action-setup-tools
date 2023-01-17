import path from "path"

import Java from "./java.js"
import SdkmanTool from "./sdkmantool.js"

export default class Kotlin extends SdkmanTool {
    static tool = "kotlin"
    static toolVersion = "kotlin -version"

    constructor() {
        super(Kotlin.tool, Java.tool)
    }

    /**
     * The entry point to request that Kotlin be installed. The version of Kotlin that is desired to be installed can
     * be specified directly as an input to the action, or can be housed in the .sdkmanrc file.
     * Assumes sdkman is already installed on the self-hosted runner, is a failure condition otherwise.
     * @param {string} desiredVersion - This is the identifier of the desired version of kotlin as presented directly
     * to the action, if a desired version has been presented directly to the action. e.g. "1.6.21"
     * @returns {string} - The actual version of Kotlin that has been installed, or did not need to be installed since
     * it is already installed.
     */
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

        // Augment path so that the current version of kotlin according to sdkman will be the version found.
        this.prependSdkmanToolToPath(Kotlin.tool)

        // Sanity check that the kotlin command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion(checkVersion, false)

        // If we got this far, we have successfully configured kotlin.
        this.outputInstalledToolVersion(Kotlin.tool, checkVersion)
        this.info("kotlin success!")
        return checkVersion
    }

    /**
     * Determines the desired version of kotlin that is being requested. if the desired version
     * presented to the action is present, that version is honored rather than the version
     * presented in the .sdkmanrc file that can be optionally present in the checked out repo itself.
     * Second value returned indicates whether or not the version returned has overridden
     * the version from the .sdkmanrc file.
     * @param {string} actionDesiredVersion - This is the desired version of kotlin as presented directly to the
     * action.
     * @returns {[string, boolean]} - The overall desired version of kotlin that has been found, and the boolean
     * indicates whether or not that version is overriding the value found in the .sdkmanrc file.
     */
    getKotlinVersion(actionDesiredVersion) {
        // Check if we have any version passed in to the action (can be null/empty string)
        if (actionDesiredVersion) return [actionDesiredVersion, true]

        const readKotlinVersion = this.parseSdkmanrc()
        if (readKotlinVersion) {
            this.debug(
                `Found kotlin version ${readKotlinVersion} in ${Kotlin.configFile}`,
            )
            return [readKotlinVersion, false]
        }
        // No version has been specified
        return [null, null]
    }

    parseSdkmanrc(filename) {
        let entries = this.parseSdkmanrcEntries(filename)
        return entries ? entries["kotlin"] : null
    }

    /**
     * versionParser specifically handles parsing of the possible version identifiers found when running
     * "kotlin -version".
     * is compared against the expected value given
     * @param {string} text - Of the form "Kotlin version 1.7.21-release-272 (JRE 1.8.0_282-b08)"
     * @returns {[]} - An array of the actual parsed version string that was found. e.g. ["1.7.21"].
     */
    versionParser(text) {
        // Default case for standard semantic versioning (i.e. major.minor.patch) in kotlin reported versions
        let versions = super.versionParser(text)
        this.debug(`versionParser: ${versions}`)
        if (versions) {
            // The version[0] houses the actual version number we seek.
            const versionSource = versions[0]
            const dashIndex = versionSource.indexOf("-")
            if (dashIndex > 0) {
                return [versionSource.substring(0, dashIndex)]
            }
            return versions
        }
        return [""]
    }
}

// Register the subclass in our tool list
Kotlin.register()
