import fs from "fs"
import os from "os"
import path from "path"
import process from "process"

import core from "@actions/core"

import Tool from "./tool.js"

export default class Java extends Tool {
    static tool = "java"
    constructor() {
        super(Java.tool)
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
        this.debug(`Found .sdkman entries ${JSON.stringify(found)}`)
        return found["java"]
    }

    // stripJavaVersionSuffix returns the normalized version without suffix strings
    stripJavaVersionSuffix(versionIdentifier, suffixIdentifier) {
        const suffixStartIndex = versionIdentifier.indexOf(suffixIdentifier)
        return suffixStartIndex >= 0
            ? versionIdentifier.substring(0, suffixStartIndex)
            : versionIdentifier
    }

    // Sets the default java version to use via sdkman to desiredVersion
    async setDefaultVersion(desiredVersion) {
        const defaultVersionCommand = `sdk default java ${desiredVersion}`
        this.debug(`Using default version command '${defaultVersionCommand}`)
        return this.subprocess(defaultVersionCommand).catch(
            this.logAndExit(
                `failed to set default java version ${desiredVersion}`,
            ),
        )
    }

    // desiredVersion : The identifier for the specific desired version of java as
    // known to sdkman such as "11.0.2-open" for version 11.0.2 from java.net.
    // assumes sdkman is already installed on the self-hosted runner, is a failure
    // condition otherwise.
    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] =
            this.getJavaVersion(desiredVersion)
        if (!checkVersion) {
            // Neither version was given nor did we find the auto configuration, so
            // we don't even attempt to configure java.
            this.debug("skipping java")
            return
        }

        // Construct the execution environment for sdkman for java
        this.env = this.makeEnv()

        // If we're overriding the version, make sure we set it in the environment
        // now, and downstream so sdkman knows it
        if (isVersionOverridden) {
            this.env.JAVA_VERSION = checkVersion
        }

        // If sdkman is requested to install the same version of java more than once,
        // all subsequent attempts will be a no-op and sdkman will report a message of the
        // form "java 11.0.2-open is already installed". sdk install does not pick up the
        // environment variable JAVA_VERSION unlike tfenv, so we specify it here as an
        // argument explicitly, if it's set
        const installCommand = `sdk install java ${checkVersion}`
        await this.subprocess(installCommand).catch(
            this.logAndExit(`failed to install java version ${checkVersion}`),
        )

        // Now that the appropriate version is available, we must declare that that is
        // the version we wish to be using.
        await this.setDefaultVersion(checkVersion)

        // Augment path so that the current version of java according to sdkman will be
        // the version found.
        core.addPath(`${this.env.SDKMAN_DIR}/candidates/java/current/bin`)

        // Sanity check that the java command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion(
            "java -version",
            this.stripJavaVersionSuffix(checkVersion, "-"),
            (version) => this.stripJavaVersionSuffix(version, "+"),
        )

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("JAVA_VERSION", checkVersion)
        }

        // If we got this far, we have successfully configured java.
        core.setOutput(Java.tool, checkVersion)
        this.info("java success!")
    }

    makeEnv() {
        let env = {}
        let sdkmanDir =
            process.env.SDKMAN_DIR || path.join(os.homedir(), ".sdkman")

        // Only set this if it exists
        if (!fs.existsSync(sdkmanDir)) {
            const err = `SDKMAN_DIR misconfigured: ${sdkmanDir} does not exist`
            this.error(err)
            throw new Error(err)
        }

        this.info(`Using SDKMAN_DIR ${sdkmanDir}`)
        env.SDKMAN_DIR = sdkmanDir
        core.exportVariable("SDKMAN_DIR", env.SDKMAN_DIR)

        return env
    }
}

// Register the subclass in our tool list
Java.register()
