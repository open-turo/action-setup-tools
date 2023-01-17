import path from "path"

import Java from "./java.js"
import SdkmanTool from "./sdkmantool.js"

export default class Kotlin extends SdkmanTool {
    static tool = "kotlin"
    static toolVersion = "kotlin -version"

    constructor() {
        super(Kotlin.tool)
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

        // Make sure we have Java requested, and by the time this succeeds we are guaranteed to have Java installed
        await this.waitForJavaInstallation()

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

    /**
     * Checks if we have Java or we're trying to install it.
     * @returns {string} - The installed Java version
     */
    async waitForJavaInstallation() {
        const _this = this
        const findJavaVersion = async () => {
            // Find if we have Java installed or we've specified a version to install
            const java_tool = new Java()
            // We can't ignore installed or we get stuck in a loop finding Java
            java_tool.ignore_installed = false
            // Find our version of Java if they exist
            const [needJavaInstalled, javaVersion] =
                await java_tool.findVersion()
            // If we don't have a version we've found or are installing, that's an error
            if (!javaVersion) {
                throw new Error("Java is required for Kotlin")
            }
            _this.debug(
                `Found Java '${javaVersion}' and need Java installed is ${needJavaInstalled}`,
            )
            // If don't need to install Java because it's already installed, we're done
            return !needJavaInstalled ? javaVersion : null
        }

        // JS style doesn't do caps constants in function scopes
        const MAX_WAIT_TIME_IN_SECONDS = 300
        let numberSecondsElapsed = 0
        this.debug("Waiting for Java installation to be found in place")
        for (
            let attempts = 0;
            numberSecondsElapsed < MAX_WAIT_TIME_IN_SECONDS;
            attempts++
        ) {
            // If we have Java, break the loop return success
            let javaVersion = await findJavaVersion()
            if (javaVersion) {
                this.info(`Found Java '${javaVersion}', continuing with Kotlin`)
                return
            }

            // If we desired Java, and we don't have a version found yet, sleep one second and retry
            let timestamp = new Date().toLocaleString()
            this.debug(
                `Wait for five seconds before retrying Java install @ ${timestamp}`,
            )
            await new Promise((r) => setTimeout(r, 5000))
            // No need to compute true wall time, close enough.
            numberSecondsElapsed += 5
        }
    }

    /**
     * This parse the .sdkmanrc file to determine the desired version of kotlin that is requested.
     * @param {string} filename
     * @returns
     */
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
