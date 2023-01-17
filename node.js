import path from "path"
import assert from "assert"
import fsPromises from "fs/promises"
import nodeVersionData from "node-version-data"
import util from "util"

import core from "@actions/core"
import findVersions from "find-versions"

import Tool from "./tool.js"

const getVersionData = util.promisify(nodeVersionData)

export default class Node extends Tool {
    static tool = "node"
    static envVar = "NODENV_ROOT"
    static envPaths = ["bin", "shims"]
    static installer = "nodenv"

    constructor() {
        super(Node.tool)
    }

    /**
     * The entry point to request that Node be installed. The version of Node that is desired to be installed can
     * be specified directly as an input to the action, or can be housed in the .node-version or .nvmrc file.
     * Assumes nodenv is already installed on the self-hosted runner, is a failure condition otherwise.
     * @param {string} desiredVersion - This is the identifier of the desired version of Node as presented directly
     * to the action, if a desired version has been presented directly to the action. e.g. "18".
     * @returns {string} - The actual version of Node that has been installed, or did not need to be installed since
     * it is already installed.
     */
    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = await this.getNodeVersion(
            desiredVersion,
        )
        if (!(await this.haveVersion(checkVersion))) {
            if (checkVersion) {
                // Ensure yarn is present as well, but don't error if it breaks
                await this.installYarn().catch(() => {})
            }
            return checkVersion
        }

        // Check if nodenv exists and can be run, and capture the version info while
        // we're at it, should be pre-installed on self-hosted runners.
        await this.findInstaller()

        // Update nodeenv versions in case the user is requesting a node version
        // that did not exist when nodenenv was installed
        const updateVersionsCommand = `${this.installer} update-version-defs`
        // Remove NODENV related vars from the environment, as when running
        // nodenv it will pick them and try to use the specified node version
        // which can lead into issues if that node version does not exist
        // eslint-disable-next-line no-unused-vars
        const { NODENV_VERSION, ...envWithoutNodenv } = process.env
        await this.subprocessShell(updateVersionsCommand, {
            // Run the cmd in a tmp file so that nodenv doesn't pick any .node-version file in the repo with an unknown
            // node version
            cwd: process.env.RUNNER_TEMP,
            env: { ...envWithoutNodenv, ...this.getEnv() },
        }).catch((error) => {
            this.warning(
                `Failed to update nodenv version refs, install may fail`,
            )
            if (error.stderr) {
                this.debug(error.stderr)
            }
        })

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("NODENV_VERSION", checkVersion)
        }

        // Install the desired version as it was not in the system
        const installCommand = `${this.installer} install -s ${checkVersion}`
        await this.subprocessShell(installCommand).catch(
            this.logAndExit(`failed to install node version ${checkVersion}`),
        )

        // Sanity check that the node command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion(checkVersion)

        // Could make this conditional? But for right now we always install `yarn`
        await this.installYarn()

        // If we got this far, we have successfully configured node.
        this.outputInstalledToolVersion(Node.tool, checkVersion)
        this.info("node success!")
        return checkVersion
    }

    /**
     * Given an nvmrc node version spec, convert it to a SemVer node version
     * @param {String} fileName File where to look for the node version
     * @returns {Promise<string | undefined>} Parsed version
     */
    async parseNvmrcVersion(fileName) {
        const nodeVersion = this.getVersion(null, fileName)[0]
        if (!nodeVersion) {
            return undefined
        }
        // Versions are sorted from newest to oldest
        const versionData = await getVersionData()
        let version
        if (/^lts\/.*/i.test(nodeVersion)) {
            if (nodeVersion === "lts/*") {
                // We just want the latest LTS
                version = versionData.find((v) => v.lts !== false)?.version
            } else {
                version = versionData.find(
                    (v) =>
                        nodeVersion.substring(4).toLowerCase() ===
                        (v.lts || "").toLowerCase(),
                )?.version
            }
        } else if (nodeVersion === "node") {
            // We need the latest version
            version = versionData[0].version
        } else {
            // This could be a full or a partial version, so use partial matching
            version = versionData.find((v) =>
                v.version.startsWith(`v${nodeVersion}`),
            )?.version
        }
        if (version !== undefined) {
            return findVersions(version)[0]
        }
        throw new Error(`Could not parse Node version "${nodeVersion}"`)
    }

    /**
     * Return a [version, override] pair where version is the SemVer string
     * and the override is a boolean indicating the version must be manually set
     * for installs.
     *
     * If a desired version is specified the function returns this one. If not,
     * it will look for a .node-version or a .nvmrc file (in this order) to extract
     * the desired node version
     *
     * It is expected that these files follow the NVM spec: https://github.com/nvm-sh/nvm#nvmrc
     * @param [desiredVersion] Desired node version
     * @returns {Promise<[string | null, boolean | null]>} Resolved node version
     */
    async getNodeVersion(desiredVersion) {
        // If we're given a version, it's the one we want
        if (desiredVersion) return [desiredVersion, true]

        // If .node-version is present, it's the one we want, and it's not
        // considered an override
        const nodeVersion = await this.parseNvmrcVersion(".node-version")
        if (nodeVersion) {
            return [nodeVersion, false]
        }

        // If .nvmrc is present, we fall back to it
        const nvmrcVersion = await this.parseNvmrcVersion(".nvmrc")
        if (nvmrcVersion) {
            // In this case we want to override the version, as nodenv is not aware of this file
            // and we want to use it
            return [nvmrcVersion, true]
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

    /**
     * Run `npm install -g yarn` and `nodenv rehash` to ensure `yarn` is on the CLI.
     */
    async installYarn() {
        // Check for an existing version
        let yarnVersion = await this.version("yarn --version", {
            soft: true,
        }).catch(() => {})
        if (yarnVersion) {
            this.debug(`yarn is already installed (${yarnVersion})`)
            return
        }

        // Installing yarn with npm, which if this errors means ... things are
        // badly broken?
        this.info("Installing yarn")
        await this.subprocessShell("npm install -g yarn")

        // Just run `nodenv rehash` always and ignore errors because we might be
        // in a setup-node environment that doesn't have nodenv
        this.info("Rehashing node shims")
        await this.subprocessShell("nodenv rehash").catch(() => {})
    }
}

Node.register()
