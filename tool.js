import fs from 'fs';
import os from 'os';
import path from 'path';
import process from 'process';
import fsPromises from 'fs/promises';

import core from '@actions/core';
import { getExecOutput } from '@actions/exec';
import findVersions from 'find-versions';

// Superclass for all supported tools
export default class Tool {
    static registry = {};

    constructor(name) {
        this.name = name;
        this.env = {};

        // Create logger wrapper functions for this tool
        const loggers = ['debug', 'info', 'warning', 'notice', 'error'];
        loggers.forEach((logger) => {
            this[logger] = (...msg) => this.log(logger, msg);
        });
    }

    // Log a message using method from core and msg prepended with the name
    log(method, msg) {
        if (Array.isArray(msg)) {
            if (this.name) msg = `[${this.name}]\t${msg.join(' ')}`;
            else msg = msg.join(' ');
        }
        core[method](msg);
    }

    // determines the desired version of the tool (e.g. terraform) that is being requested.
    // if the desired version presented to the action is present, that version is
    // honored rather than the version presented in the version file (e.g. .terraform-version)
    // that can be optionally present in the checked out repo itself.
    // Second value returned indicates whether or not the version returned has overridden
    // the version from the repositories tool version file.
    getVersion(actionDesiredVersion, repoToolVersionFilename) {
        // Check if we have any version passed in to the action (can be null/empty string)
        if (actionDesiredVersion) return [actionDesiredVersion, true];

        if (fs.existsSync(repoToolVersionFilename)) {
            let textRead = fs.readFileSync(repoToolVersionFilename, {
                encoding: 'utf8',
                flag: 'r',
            });
            const readToolVersionNumber = textRead ? textRead.trim() : textRead;
            this.debug(
                `Found version ${readToolVersionNumber} in ${repoToolVersionFilename}`
            );
            if (readToolVersionNumber && readToolVersionNumber.length > 0)
                return [readToolVersionNumber, false];
        }
        // No version has been specified
        return [null, null];
    }

    // version runs `cmd` with environment `env` and resolves the promise with any
    // parsable version strings in an array. provide true for useLooseVersionFinding
    // when the expected version string contains non-version appearing values such
    // as go1.16.8
    async version(cmd, useLooseVersionFinding = true) {
        return this.subprocess(cmd, null, { silent: true })
            .then((proc) => {
                if (proc.stdout) {
                    let stdoutVersions = findVersions(proc.stdout, {
                        loose: useLooseVersionFinding,
                    });
                    if (stdoutVersions) return stdoutVersions;
                }
                if (proc.stderr) {
                    return findVersions(proc.stderr);
                }
            })
            .then((versions) => {
                this.info(`${cmd}: ${versions[0]}`);
                return versions[0];
            })
            .catch(this.logAndExit(`failed to get version: ${cmd}`));
    }

    // validateVersion returns the found current version from a subprocess which
    // is compared against the expected value given
    async validateVersion(command, expected, mutator = null) {
        mutator = mutator || ((v) => v);
        let version = await this.version(command);
        version = mutator(version);
        if (expected != version) {
            this.logAndExit(`version mismatch ${expected} != ${version}`)();
        }
        return version;
    }

    // subprocess invokes `cmd` with environment `env` and resolves the promise with
    // an object containing the output and any error that was caught
    async subprocess(cmd, env, opts = { silent: false }) {
        let proc = {
            stdout: '',
            stderr: '',
            err: null,
            exitCode: 0,
        };

        // Always merge the passed environment on top of the process environment so
        // we don't lose execution context
        env = env || this.env || {};
        opts.env = { ...process.env, ...env };

        // This lets us inspect the process output, otherwise an error is thrown and
        // it is lost
        opts.ignoreReturnCode =
            opts.ignoreReturnCode != undefined ? opts.ignoreReturnCode : true;

        return new Promise((resolve, reject) => {
            getExecOutput(cmd, [], opts)
                .then((result) => {
                    if (result.exitCode > 0) {
                        let err = new Error(
                            'subprocess exited with non-zero code'
                        );
                        err.exitCode = result.exitCode;
                        err.stdout = result.stdout;
                        err.stderr = result.stderr;
                        reject(err);
                        return;
                    }

                    proc.exitCode = result.exitCode;
                    proc.stdout = result.stdout;
                    proc.stderr = result.stderr;
                    resolve(proc);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    // logAndExit logs the error message from a subprocess and sets the failure
    // message for the Action and exits the process entirely
    logAndExit(msg) {
        return (err) => {
            if (err) this.error(err);
            core.setFailed(msg);
            process.exit(1);
        };
    }

    // findRoot tries to find the root directory of the tool.
    async findRoot(tool) {
        // Env name are like TFENV_ROOT or NODENV_ROOT
        const toolEnv = `${tool.toUpperCase()}_ROOT`;
        let toolPath = process.env[toolEnv];
        // Return whatever's currently set if we have it
        if (toolPath) {
            this.info(`${toolEnv} set from environment: ${toolPath}`);
            if (!fs.existsSync(toolPath)) {
                throw new Error(
                    `${toolEnv} misconfigured: ${toolPath} does not exist`
                );
            }
            return toolPath;
        }

        // Default path is ~/.<tool>/ since that's what our CI uses
        const defaultPath = path.join(os.homedir(), `.${tool}`);

        // Use a subshell get the command path or function name and
        // differentiate in a sane way
        const check = `bash -c "command -v ${tool}"`;
        const proc = await this.subprocess(check, {}, { silent: true }).catch(
            (err) => {
                this.error(err);
                return defaultPath;
            }
        );
        toolPath = proc.stdout.trim();
        if (toolPath == tool) {
            // This means it's a function from the subshell profile
            // somewhere, so we just have to use the default
            this.debug('Found tool path as function name');
            return defaultPath;
        }
        if (!fs.existsSync(toolPath)) {
            // This is a weird error case
            this.error('tool path does not exit');
            return defaultPath;
        }

        // Walk down symbolic links until we find the real path
        while (toolPath) {
            const stat = await fsPromises.lstat(toolPath).catch((err) => {
                this.error(err);
                return defaultPath;
            });
            if (!stat.isSymbolicLink()) break;

            let link = await fsPromises.readlink(toolPath).catch((err) => {
                this.error(err);
                return defaultPath;
            });
            // Make sure we can resolve relative symlinks which Homebrew uses
            toolPath = path.resolve(path.dirname(toolPath), link);
        }

        const re = new RegExp(`/(bin|libexec)/${tool}$`);
        toolPath = toolPath.replace(re, '');
        if (fs.existsSync(toolPath)) return toolPath;

        let err = `${toolEnv} misconfigured: ${toolPath} does not exist`;
        this.error(err);
        throw new Error(err);
    }

    // register adds name : subclass to the tool registry
    static register() {
        this.registry[this.tool] = this;
    }

    // all returns an array of objects containing the tool name and the bound
    // setup function of a tool instance
    static all() {
        return Object.keys(this.registry).map((k) => {
            let tool = new this.registry[k]();
            return { name: k, setup: tool.setup.bind(tool) };
        });
    }
}
