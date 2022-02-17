import path from 'path';

import core from '@actions/core';

import Tool from './tool.js';

export default class Python extends Tool {
    static tool = 'python';
    constructor() {
        super(Python.tool);
    }

    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = this.getVersion(
            desiredVersion,
            '.python-version'
        );
        if (!checkVersion) {
            // Neither version was given nor did we find the auto configuration, so
            // we don't even attempt to configure terraform.
            this.debug('skipping python');
            return;
        }

        // Construct the execution environment for pyenv
        this.env = await this.makeEnv();

        // Check if pyenv exists and can be run, and capture the version info while
        // we're at it
        await this.version('pyenv --version');

        // If we're overriding the version, make sure we set it in the environment
        // now, and downstream so pyenv knows it
        if (isVersionOverridden) {
            this.env.PYENV_VERSION = checkVersion;
        }

        // using -s option to skip the install and become a no-op if the
        // version requested to be installed is already installed according to pyenv.
        let installCommand = `pyenv install -s`;
        // pyenv install does not pick up the environment variable PYENV_VERSION
        // unlike tfenv, so we specify it here as an argument explicitly, if it's set
        if (isVersionOverridden) installCommand += ` ${checkVersion}`;

        await this.subprocess(installCommand).catch(
            this.logAndExit(`failed to install python version ${checkVersion}`)
        );

        // Sanity check the python command works, and output its version
        await this.validateVersion('python --version', checkVersion);

        // Sanity check the pip command works, and output its version
        await this.version('pip --version');

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable('PYENV_VERSION', checkVersion);
        }

        // If we got this far, we have successfully configured python.
        core.setOutput(Python.tool, checkVersion);
        this.info('python success!');
    }

    async makeEnv() {
        let env = {};
        let pyenvRoot = await this.findRoot('pyenv');
        env.PYENV_ROOT = pyenvRoot;

        // Add it to our path explicitly since the pyenv command is not likely
        // on the default PATH
        const pyenvBin = path.join(pyenvRoot, 'bin');
        const pyenvShims = path.join(pyenvRoot, 'shims');
        const pyenvVenvShims = path.join(
            pyenvRoot,
            'plugins/pyenv-virtualenv/shims'
        );
        this.debug(
            `Adding ${pyenvBin} and ${pyenvShims} and ${pyenvVenvShims} to PATH`
        );
        core.exportVariable('PYENV_ROOT', env.PYENV_ROOT);
        core.exportVariable('PYENV_VIRTUALENV_INIT', 1);
        core.addPath(pyenvBin);
        core.addPath(pyenvShims);
        core.addPath(pyenvVenvShims);

        return env;
    }
}

// Register the subclass in our tool list
Python.register();
