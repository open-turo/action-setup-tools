import fs from "fs"
import os from "os"
import path from "path"
import process from "process"

import core from "@actions/core"

import Tool from "./tool.js"
import findVersions from "find-versions"

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
        this.debug(`Found .sdkmanrc entries ${JSON.stringify(found)}`)
        return found["java"]
    }

    // parseJavaVersionString specially handles version string extraction
    // because we have to map strings like 1.8.0_282 to 8.0.282 for the actual
    // SemVer comparison
    parseJavaVersionString(expected, version) {
        // Default case for 11.x or 17.x it should match and we're ok
        let versions = findVersions(version, { loose: true })
        if (versions && versions[0] == expected) return versions

        // This parsing is to match the version string for 1.8.0_282 (or
        // similar) which is what the java binary puts out, however `sdkman`
        // uses the updated naming of `8.0.282` which is what we want to check
        // against, so we're going to hard parse against X.Y.Z_W to rewrite it
        // to Y.Z.W
        const parser = /1\.([0-9]+\.[0-9]+_[0-9]+)/
        const matched = parser.exec(version)
        if (!matched) return []
        return [matched[1].replace("_", ".")]
    }

    // Sets the default java version to use via sdkman to desiredVersion
    async setDefaultVersion(version) {
        const cmd = `sdk default java ${version}`
        return this.subprocess(cmd).catch(this.logAndExit(` ${version}`))
    }

    // desiredVersion : The identifier for the specific desired version of java as
    // known to sdkman such as "11.0.2-open" for version 11.0.2 from java.net.
    // assumes sdkman is already installed on the self-hosted runner, is a failure
    // condition otherwise.
    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] =
            this.getJavaVersion(desiredVersion)
        if (!this.haveVersion(checkVersion)) return

        // Construct the execution environment for sdkman for java
        this.env = this.makeEnv()

        // This doesn't fail hard, but it probably should
        this.checkSdkmanSettings()

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("JAVA_VERSION", checkVersion)
        }

        // If sdkman is requested to install the same version of java more than once,
        // all subsequent attempts will be a no-op and sdkman will report a message of the
        // form "java 11.0.2-open is already installed". sdk install does not pick up the
        // environment variable JAVA_VERSION unlike tfenv, so we specify it here as an
        // argument explicitly, if it's set
        await this.subprocess(`sdk install java ${checkVersion}`).catch(
            this.logAndExit(`failed to install: ${checkVersion}`),
        )

        // Set the "current" default Java version to the desired version
        await this.subprocess(`sdk default java ${checkVersion}`).catch(
            this.logAndExit(`failed to set default: ${checkVersion}`),
        )

        // export JAVA_HOME to force using the correct version of java
        const javaHome = `${this.env.SDKMAN_DIR}/candidates/java/current`
        core.exportVariable("JAVA_HOME", javaHome)

        // Augment path so that the current version of java according to sdkman will be
        // the version found.
        core.addPath(`${javaHome}/bin`)

        // Remove the trailing -blah from the Java version string
        const expectedVersion = checkVersion.replace(/[-_][^-_]+$/, "")

        // Sanity check that the java command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion(
            "java -version",
            expectedVersion,
            (version) => this.parseJavaVersionString(expectedVersion, version),
        )

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

        // Set the configFile so we can use it later
        this.configFile = `${env.SDKMAN_DIR}/etc/config`

        return env
    }

    checkSdkmanSettings() {
        // Easy case, no file, make sure the directory exists and write config
        if (!fs.existsSync(this.configFile)) {
            this.debug("writing sdkman config")
            const configPath = path.dirname(this.configFile)
            fs.mkdirSync(configPath, { recursive: true })
            // This config is taken from the packer repo
            fs.writeFileSync(
                this.configFile,
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
        let data = fs.readFileSync(this.configFile, "utf8")
        if (/sdkman_auto_answer=true/.test(data)) {
            // We're good
            this.debug("sdkman config okay")
            return
        }

        this.debug("sdkman config misconfigured, maybe")
        this.debug(fs.readFileSync(this.configFile, "utf8"))

        this.debug("overwriting it because otherwise this tool won't work")
        data = data.replace(
            /sdkman_auto_answer=false/,
            "sdkman_auto_answer=true",
        )
        data = data.replace(
            /sdkman_selfupdate_enable=true/,
            "sdkman_selfupdate_enable=true",
        )
        fs.writeFileSync(this.configFile, data)
    }
}

// Register the subclass in our tool list
Java.register()
