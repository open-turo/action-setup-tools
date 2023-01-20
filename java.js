import path from "path"

import core from "@actions/core"

import SdkmanTool from "./sdkmantool.js"

export default class Java extends SdkmanTool {
    static tool = "java"
    static toolVersion = "java -version"

    constructor() {
        super(Java.tool)
    }

    /**
     * The entry point to request that Java be installed. The version of Java that is desired to be installed can
     * be specified directly as an input to the action, or can be housed in the .sdkmanrc file.
     * Assumes sdkman is already installed on the self-hosted runner, is a failure condition otherwise.
     * @param {string} desiredVersion - This is the identifier of the desired version of java as presented directly
     * to the action, if a desired version has been presented directly to the action. e.g. "11.0.2-open".
     * @returns {string} - The actual version of Java that has been installed, or did not need to be installed since
     * it is already installed.
     */
    async setup(desiredVersion) {
        const [needInstall, checkVersion, isVersionOverridden] =
            await this.findVersion(desiredVersion)
        // If we don't desire this tool or it's already present with a matching version
        if (!needInstall) return checkVersion

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
        core.exportVariable("JAVA_HOME", this.getSdkmanToolPath(Java.tool))

        // Augment path so that the current version of java according to sdkman will be the version found.
        this.prependSdkmanToolToPath(Java.tool)

        // Remove the trailing -blah from the Java version string
        const expectedVersion = checkVersion.replace(/[-_][^-_]+$/, "")

        // Sanity check that the java command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion(expectedVersion)

        // If we got this far, we have successfully configured java.
        this.outputInstalledToolVersion(Java.tool, checkVersion)
        this.info("java success!")
        return checkVersion
    }

    /**
     * Determines the desired version of java that is being requested. if the desired version
     * presented to the action is present, that version is honored rather than the version
     * presented in the .sdkmanrc file that can be optionally present in the checked out repo itself.
     * Second value returned indicates whether or not the version returned has overridden
     * the version from the .sdkmanrc file.
     * @param {string} actionDesiredVersion - This is the desired version of java as presented directly to the
     * action.
     * @returns {[string, boolean]} - The overall desired version of java that has been found, and the boolean
     * indicates whether or not that version is overriding the value found in the .sdkmanrc file.
     */
    getJavaVersion(actionDesiredVersion) {
        // Check if we have any version passed in to the action (can be null/empty string)
        if (actionDesiredVersion) return [actionDesiredVersion, true]

        const readJavaVersion = this.parseSdkmanrc()
        if (readJavaVersion) {
            this.debug(
                `Found java version ${readJavaVersion} in ${Java.configFile}`,
            )
            return [readJavaVersion, false]
        }
        // No version has been specified
        return [null, null]
    }

    /**
     * Return [checkVersion, isVersionOverridden] specific to this Tool subclass.
     *
     * @param {string} desiredVersion
     */
    async findCheckVersion(desiredVersion) {
        return this.getJavaVersion(desiredVersion)
    }

    parseSdkmanrc(filename) {
        let entries = this.parseSdkmanrcEntries(filename)
        return entries ? entries["java"] : null
    }

    // versionParser specially handles version string extraction
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
}

// Register the subclass in our tool list
Java.register()
