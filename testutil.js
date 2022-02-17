import fs from 'fs';
import os from 'os';
import path from 'path';
import process from 'process';

import Tool from './tool';

// runAction returns a promise that wraps the subprocess action execution and
// allows for capturing error output if DEBUG is enabled
export async function runAction(name, env) {
    // const index = path.join(__dirname, name + '.js')
    const index = `${name}.js`;
    env = env || {};
    let tool = new Tool('test');
    return tool
        .subprocess(`node ${index}`, env, { silent: true })
        .catch((err) => {
            throw new Error(
                `subprocess failed code ${err.exitCode}\n${err.stdout}\n${err.stderr}`
            );
        });
}

// runActionExpectError returns a promise that wraps the subprocess action
// execution and allows for capturing error output if DEBUG is enabled
export async function runActionExpectError(name, env) {
    // const index = path.join(__dirname, name + '.js')
    const index = `${name}.js`;
    env = env || {};
    let tool = new Tool('test');
    return tool.subprocess(`node ${index}`, env, { silent: true });
}

// shimSdkman checks if sdk is present on the PATH and if not, creates a shim
// for the test suite to use
export async function shimSdkman() {
    let tool = new Tool('sdkman');
    return tool.subprocess('sdk version', {}, { silent: true }).catch(() => {
        // If we're here, then we need to install a shim for sdk
        const sdkmanDir =
            process.env.SDKMAN_DIR || path.join(os.homedir(), '.sdkman');
        if (!/shim-sdkman/.test(process.env.PATH)) {
            // Update the PATH to include our sdk shim
            process.env.PATH = `/tmp/shim-sdkman:${process.env.PATH}`;
        }
        // Create our temp shim directory
        if (!fs.existsSync('/tmp/shim-sdkman')) {
            fs.mkdirSync('/tmp/shim-sdkman');
        }
        // Always overwrite the shim ensuring we have the current version of it
        const shim = `#!/bin/bash
export SDKMAN_DIR="${sdkmanDir}"
SDKMAN_INIT_FILE="$SDKMAN_DIR/bin/sdkman-init.sh"
if [[ ! -s "$SDKMAN_INIT_FILE" ]]; then exit 13; fi
if [[ -z "$SDKMAN_AVAILABLE" ]]; then source "$SDKMAN_INIT_FILE" >/dev/null; fi
export -f
sdk "$@"
        `;
        fs.writeFileSync('/tmp/shim-sdkman/sdk', shim, { mode: 0o755 });
    });
}

export function cleanPath(name) {
    let path = process.env.PATH;
    path = path.split(':');
    path = path.filter((i) => !i.includes(name));
    path = Array.from(new Set(path));
    path = path.join(':');
    return path;
}
