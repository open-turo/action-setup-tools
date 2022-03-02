import path from "path"

import core from "@actions/core"
import findVersions from "find-versions"

import Tool from "./tool.js"

export default class Node extends Tool {
    static tool = "node"
    constructor() {
        super(Node.tool)
    }

    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] =
            this.getNodeVersion(desiredVersion)
        if (!this.haveVersion(checkVersion)) return

        // Construct the execution environment for nodenv
        this.env = await this.makeEnv()

        // Check if nodenv exists and can be run, and capture the version info while
        // we're at it, should be pre-installed on self-hosted runners.
        await this.version("nodenv --version")

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("NODENV_VERSION", checkVersion)
        }

        // using -s option to skip the install and become a no-op if the
        // version requested to be installed is already installed according to nodenv.
        let installCommand = "nodenv install -s"
        if (isVersionOverridden)
            installCommand = `${installCommand} ${checkVersion}`

        await this.subprocess(installCommand).catch(
            this.logAndExit(`failed to install node version ${checkVersion}`),
        )

        // Sanity check that the node command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion("node --version", checkVersion)

        // If we got this far, we have successfully configured node.
        this.info("node success!")
    }

    // getNodeVersion returns a [version, override] pair where version is the SemVer
    // string and the override is a boolean indicating the version must be manually
    // set for installs.
    getNodeVersion(desiredVersion) {
        // If we're given a version, it's the one we want
        if (desiredVersion) return [desiredVersion, true]

        // If .node-version is present, it's the one we want, and it's not
        // considered an override
        let nodenvVersion
        nodenvVersion = this.getVersion(null, ".node-version")[0]
        if (nodenvVersion) {
            return [nodenvVersion, false]
        }

        // If .nvmrc is present, we fall back to it, but parse away the leading "v"
        let nvmVersion
        nvmVersion = this.getVersion(null, ".nvmrc")[0]
        if (nvmVersion) {
            nvmVersion = findVersions(nvmVersion)[0]
            return [nvmVersion, true]
        }

        // Otherwise we have no node
        return [null, null]
    }

    async makeEnv() {
        let env = {}
        let nodenvRoot = await this.findRoot("nodenv")
        env.NODENV_ROOT = nodenvRoot

        // nodenv/shims must be be placed on the path so that the node command itself
        // can be located at runtime.
        // Add it to our path explicitly since the nodenv command is not likely
        // on the default PATH
        const nodenvBin = path.join(nodenvRoot, "bin")
        const nodenvShims = path.join(nodenvRoot, "shims")
        this.debug(`Adding ${nodenvBin} and ${nodenvShims} to PATH`)
        core.exportVariable("NODENV_ROOT", env.NODENV_ROOT)
        core.addPath(nodenvBin)
        core.addPath(nodenvShims)

        return env
    }
}

Node.register()
