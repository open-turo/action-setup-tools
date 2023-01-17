import assert from "assert"

import core from "@actions/core"

import Tool from "./tool.js"

export default class Golang extends Tool {
    static tool = "go"
    static toolVersion = "go version"
    static envVar = "GOENV_ROOT"
    static envPaths = ["bin", "shims", "plugins/go-build/bin"]
    static installer = "goenv"

    constructor() {
        super(Golang.tool)
    }

    /**
     * The entry point to request that Golang be installed. The version of Golang that is desired to be installed can
     * be specified directly as an input to the action, or can be housed in the .go-version file.
     * Assumes goenv is already installed on the self-hosted runner, is a failure condition otherwise.
     * @param {string} desiredVersion - This is the identifier of the desired version of Golang as presented directly
     * to the action, if a desired version has been presented directly to the action. e.g. "1.16.4".
     * @returns {string} - The actual version of Golang that has been installed, or did not need to be installed since
     * it is already installed.
     */
    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = this.getVersion(
            desiredVersion,
            ".go-version",
        )
        if (!(await this.haveVersion(checkVersion))) {
            return checkVersion
        }

        // Check if goenv exists and can be run, and capture the version info while
        // we're at it, should be pre-installed on self-hosted runners.
        await this.findInstaller()

        /*
        if (!io.which("go")) {
            // This has to be invoked otherwise it just returns a function
            this.logAndExit(`${this.envVar} misconfigured`)()
        }
        */

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("GOENV_VERSION", checkVersion)
        }

        // using -s option to skip the install and become a no-op if the
        // version requested to be installed is already installed according to goenv.
        let installCommand = `goenv install -s`
        // goenv install does not pick up the environment variable GOENV_VERSION
        // unlike tfenv, so we specify it here as an argument explicitly, if it's set
        if (isVersionOverridden) installCommand += ` ${checkVersion}`

        await this.subprocessShell(installCommand).catch(
            this.logAndExit(`failed to install golang version ${checkVersion}`),
        )

        // Sanity check that the go command works and its reported version
        // matches what we have requested to be in place.
        await this.validateVersion(checkVersion)

        // If we got this far, we have successfully configured golang.
        this.outputInstalledToolVersion(Golang.tool, checkVersion)
        this.info("golang success!")
        return checkVersion
    }

    async setEnv() {
        core.exportVariable("GOENV_SHELL", "bash")
        return super.setEnv()
    }

    /**
     * Download and configures goenv.
     *
     * @param  {string} root - Directory to install goenv into (GOENV_ROOT).
     * @return {string} The value of GOENV_ROOT.
     */
    async install(root) {
        assert(root, "root is required")
        const gh = `https://${process.env.GITHUB_SERVER || "github.com"}/syndbg`
        const url = `${gh}/goenv/archive/refs/heads/master.tar.gz`

        root = await this.downloadTool(url, { dest: root, strip: 1 })
        this.info(`Downloaded goenv to ${root}`)

        return root
    }
}

// Register the subclass in our tool list
Golang.register()
