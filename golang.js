import path from 'path';

import io from '@actions/io';
import core from '@actions/core';

import Tool from './tool.js';

export default class Golang extends Tool {
    static tool = 'go';
    constructor() {
        super(Golang.tool);
    }

    // desiredVersion : The desired version of golang, e.g. "1.16.4"
    // assumes goenv is already installed on the self-hosted runner, is a failure
    // condition otherwise.
    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = this.getVersion(
            desiredVersion,
            '.go-version'
        );
        if (!checkVersion) {
            // Neither version was given nor did we find the auto configuration, so
            // we don't even attempt to configure golang.
            this.debug('skipping golang');
            return;
        }

        // Construct the execution environment for goenv
        this.env = await this.makeEnv();

        // Check if goenv exists and can be run, and capture the version info while
        // we're at it, should be pre-installed on self-hosted runners.
        // core.debug("Attempting to obtain current golang version via goenv")
        await this.version('goenv --version');

        if (!io.which('go')) {
            this.logAndExit('GOENV_ROOT misconfigured')();
        }

        // If we're overriding the version, make sure we set it in the environment
        // now, and downstream so tfenv knows it
        if (isVersionOverridden) {
            this.env.GOENV_VERSION = checkVersion;
        }

        // using -s option to skip the install and become a no-op if the
        // version requested to be installed is already installed according to goenv.
        let installCommand = `goenv install -s`;
        // goenv install does not pick up the environment variable GOENV_VERSION
        // unlike tfenv, so we specify it here as an argument explicitly, if it's set
        if (isVersionOverridden) installCommand += ` ${checkVersion}`;

        await this.subprocess(installCommand).catch(
            this.logAndExit(`failed to install golang version ${checkVersion}`)
        );

        // Sanity check that the go command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion('go version', checkVersion);

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable('GOENV_VERSION', checkVersion);
        }

        // If we got this far, we have successfully configured golang.
        core.setOutput(Golang.tool, checkVersion);
        this.info('golang success!');
    }

    async makeEnv() {
        let env = {};
        const goenvRoot = await this.findRoot('goenv');
        env.GOENV_ROOT = goenvRoot;

        // goenv/shims must be be placed on the path so that the go command itself
        // can be located at runtime.
        // Add it to our path explicitly since the goenv command is not likely
        // on the default PATH
        const goenvBin = path.join(goenvRoot, 'bin');
        const goenvShims = path.join(goenvRoot, 'shims');
        this.debug(`Adding ${goenvBin} and ${goenvShims} to PATH`);
        core.exportVariable('GOENV_ROOT', env.GOENV_ROOT);
        core.exportVariable('GOENV_SHELL', 'bash');
        core.addPath(goenvBin);
        core.addPath(goenvShims);

        return env;
    }
}

// Register the subclass in our tool list
Golang.register();
