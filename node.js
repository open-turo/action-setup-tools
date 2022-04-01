import path from "path"
import assert from "assert"
import fsPromises from "fs/promises"

import core from "@actions/core"
import findVersions from "find-versions"

import Tool from "./tool.js"

export default class Node extends Tool {
    static tool = "node"
    static envVar = "NODENV_ROOT"
    static envPaths = ["bin", "shims"]
    static installer = "nodenv"

    constructor() {
        super(Node.tool)
    }

    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] =
            this.getNodeVersion(desiredVersion)
        if (!(await this.haveVersion(checkVersion))) return

        // Check if nodenv exists and can be run, and capture the version info while
        // we're at it, should be pre-installed on self-hosted runners.
        await this.findInstaller()

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("NODENV_VERSION", checkVersion)
        }

        // using -s option to skip the install and become a no-op if the
        // version requested to be installed is already installed according to nodenv.
        let installCommand = "nodenv install -s"
        if (isVersionOverridden)
            installCommand = `${installCommand} ${checkVersion}`

        await this.subprocessShell(installCommand).catch(
            this.logAndExit(`failed to install node version ${checkVersion}`),
        )

        // Sanity check that the node command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion(checkVersion)

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

    /**
     * Download and configures nodenv.
     *
     * @param  {string} root - Directory to install nodenv into (NODENV_ROOT).
     * @return {string} The value of NODENV_ROOT.
     */
    async install(root) {
        assert(root, "root is required")
        // Build our URLs
        const gh = `https://${process.env.GITHUB_SERVER || "github.com"}/nodenv`
        const url = {}
        url.nodenv = `${gh}/nodenv/archive/refs/heads/master.tar.gz`
        url.nodebulid = `${gh}/node-build/archive/refs/heads/master.tar.gz`
        url.nodedoctor = `${gh}/nodenv-installer/raw/master/bin/nodenv-doctor`

        root = await this.downloadTool(url.nodenv, { dest: root, strip: 1 })
        this.info(`Downloaded nodenv to ${root}`)

        await this.downloadTool(url.nodebulid, path.join(root, "plugins"))
        this.info(`Downloaded node-build to ${root}/plugins`)

        const doctor = await this.downloadTool(url.nodedoctor)
        this.info(`Downloaded node-doctor to ${doctor}`)

        // Create environment for running node-doctor
        await this.setEnv(root)
        await this.subprocessShell(`bash ${doctor}`)

        // Asynchronously clean up the downloaded doctor script
        fsPromises.rm(doctor, { recursive: true }).catch(() => {})

        return root
    }
}

Node.register()
