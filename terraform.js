import path from "path"

import core from "@actions/core"

import Tool from "./tool.js"

export default class Terraform extends Tool {
    static tool = "terraform"
    constructor() {
        super(Terraform.tool)
    }

    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = this.getVersion(
            desiredVersion,
            ".terraform-version",
        )
        if (!checkVersion) {
            // Neither version was given nor did we find the auto configuration, so
            // we don't even attempt to configure terraform.
            this.debug("skipping terraform")
            return
        }

        // Construct the execution environment for tfenv
        this.env = await this.makeEnv()

        // Check if tfenv exists and can be run, and capture the version info while
        // we're at it
        await this.version("tfenv --version")

        // If we're overriding the version, make sure we set it in the environment
        // now, and downstream so tfenv knows it
        if (isVersionOverridden) {
            this.env.TFENV_TERRAFORM_VERSION = checkVersion
        }

        // Make sure we have the desired terraform version installed (may be
        // pre-installed on self-hosted runners)
        await this.subprocess("tfenv install").catch(
            this.logAndExit("failed to install terraform"),
        )

        // Sanity check the terraform command works, and output its version
        await this.validateVersion("terraform --version", checkVersion)

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("TFENV_TERRAFORM_VERSION", checkVersion)
        }

        // If we got this far, we have successfully configured terraform.
        core.setOutput(Terraform.tool, checkVersion)
        this.info("terraform success!")
    }

    async makeEnv() {
        let env = {}
        const tfenvRoot = await this.findRoot("tfenv")
        env.TFENV_ROOT = tfenvRoot

        // Add it to our path explicitly since the tfenv command is not likely
        // on the default PATH
        const tfenvBin = path.join(tfenvRoot, "bin")
        this.debug(`Adding ${tfenvBin} to PATH`)
        core.exportVariable("TFENV_ROOT", env.TFENV_ROOT)
        core.addPath(tfenvBin)

        return env
    }
}

// Register the subclass in our tool list
Terraform.register()
