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

    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = this.getVersion(
            desiredVersion,
            ".terraform-version",
        )
        if (!(await this.haveVersion(checkVersion))) return

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
        core.setOutput(Terraform.tool, checkVersion)
        this.info("terraform success!")
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
