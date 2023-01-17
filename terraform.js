import assert from "assert"

import core from "@actions/core"

import Tool from "./tool.js"

export default class Terraform extends Tool {
    static tool = "terraform"
    static envVar = "TFENV_ROOT"
    static installer = "tfenv"

    constructor() {
        super(Terraform.tool)
    }

    /**
     * The entry point to request that Terraform be installed. The version of Terraform that is desired to be installed
     * can be specified directly as an input to the action, or can be housed in the .terraform-version file.
     * Assumes tfenv is already installed on the self-hosted runner, is a failure condition otherwise.
     * @param {string} desiredVersion - This is the identifier of the desired version of Terraform as presented directly
     * to the action, if a desired version has been presented directly to the action. e.g. "1.1.2".
     * @returns {string} - The actual version of Terraform that has been installed, or did not need to be installed
     * since it is already installed.
     */
    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = this.getVersion(
            desiredVersion,
            ".terraform-version",
        )
        if (!(await this.haveVersion(checkVersion))) {
            return checkVersion
        }

        // Check if tfenv exists and can be run, and capture the version info while
        // we're at it
        await this.findInstaller()

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("TFENV_TERRAFORM_VERSION", checkVersion)
        }

        // Make sure we have the desired terraform version installed (may be
        // pre-installed on self-hosted runners)
        await this.subprocessShell("tfenv install").catch(
            this.logAndExit("install failed"),
        )

        // Sanity check the terraform command works, and output its version
        await this.validateVersion(checkVersion)

        // If we got this far, we have successfully configured terraform.
        this.outputInstalledToolVersion(Terraform.tool, checkVersion)
        this.info("terraform success!")
        return checkVersion
    }

    /**
     * Download and configures tfenv.
     *
     * @param  {string} root - Directory to install tfenv into (TFENV_ROOT).
     * @return {string} The value of TFENV_ROOT.
     */
    async install(root) {
        assert(root, "root is required")
        const gh = `https://${
            process.env.GITHUB_SERVER ?? "github.com"
        }/tfutils`
        const url = `${gh}/tfenv/archive/refs/heads/master.tar.gz`

        root = await this.downloadTool(url, { dest: root, strip: 1 })
        this.info(`Downloaded tfenv to ${root}`)

        return root
    }
}

// Register the subclass in our tool list
Terraform.register()
