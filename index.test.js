import {
    shimSdkman,
    runAction,
    runActionExpectError,
    cleanPath,
} from './testutil';

beforeAll(shimSdkman);

describe('run', () => {
    it('skips all tools if INPUT env empty', () => {
        return runAction('index', {}).then((proc) => {
            expect(proc.stderr.toString()).toBe('');
            expect(proc.stdout).toContain('skipping golang');
            expect(proc.stdout).toContain('skipping java');
            expect(proc.stdout).toContain('skipping python');
            expect(proc.stdout).toContain('skipping terraform');
        });
    });

    it('works with all tools', () => {
        const goVersion = '1.17.6';
        const desiredJavaVersion = '17.0.2';
        const sdkmanJavaVersionIdentifier = `${desiredJavaVersion}-tem`;
        const pyVersion = '3.10.2';
        const tfVersion = '1.1.2';
        const nodeVersion = '16.13.2';
        return runAction('index', {
            INPUT_GO: goVersion,
            INPUT_JAVA: sdkmanJavaVersionIdentifier,
            INPUT_NODE: nodeVersion,
            INPUT_PYTHON: pyVersion,
            INPUT_TERRAFORM: tfVersion,
        }).then((proc) => {
            expect(proc.stderr.toString()).toBe('');
            expect(proc.stdout).toContain(`go version: ${goVersion}`);
            expect(proc.stdout).toContain('golang success!');
            expect(proc.stdout).toContain(
                `java -version: ${desiredJavaVersion}`
            );
            expect(proc.stdout).toContain('java success!');
            expect(proc.stdout).toContain(`node --version: ${nodeVersion}`);
            expect(proc.stdout).toContain('node success!');
            expect(proc.stdout).toContain(`python --version: ${pyVersion}`);
            expect(proc.stdout).toContain('python success!');
            expect(proc.stdout).toContain(`terraform --version: ${tfVersion}`);
            expect(proc.stdout).toContain('terraform success!');
        });
    });
});

describe('golang', () => {
    it('works', () => {
        const desiredVersion = '1.17.6';
        return runAction('index', { INPUT_GO: desiredVersion }).then((proc) => {
            expect(proc.stderr.toString()).toBe('');
            expect(proc.stdout).toContain(`go version: ${desiredVersion}`);
            expect(proc.stdout).toContain('golang success!');
        });
    });

    it('fails with bad GOENV_ROOT', () => {
        let env = {
            INPUT_GO: '1.17.3',
            GOENV_ROOT: '/tmp/.goenv',
            PATH: cleanPath('shims'),
        };
        return expect(
            runActionExpectError('index', env).catch((err) => {
                throw new Error(`${err.stdout}\n${err.stderr}`);
            })
        ).rejects.toThrow(/::error::GOENV_ROOT misconfigured/);
    });
});

describe('java', () => {
    const desiredVersion = '17.0.2';
    const sdkmanVersionIdentifier = `${desiredVersion}-tem`;

    it('works', () => {
        return runAction('index', { INPUT_JAVA: sdkmanVersionIdentifier }).then(
            (proc) => {
                expect(proc.stderr.toString()).toBe('');
                expect(proc.stdout).toContain(
                    `java -version: ${desiredVersion}`
                );
                expect(proc.stdout).toContain('java success!');
            }
        );
    });

    it('fails with bad SDKMAN_DIR', () => {
        let env = {
            INPUT_JAVA: sdkmanVersionIdentifier,
            SDKMAN_DIR: '/tmp/.sdkman',
            PATH: cleanPath('sdkman'),
        };
        return expect(
            runActionExpectError('index', env).catch((err) => {
                throw new Error(`${err.stdout}\n${err.stderr}`);
            })
        ).rejects.toThrow(/::error::SDKMAN_DIR misconfigured/);
    });
});

describe('node', () => {
    it('works', () => {
        const desiredVersion = '16.13.2';
        return runAction('index', { INPUT_NODE: desiredVersion }).then(
            (proc) => {
                expect(proc.stderr.toString()).toBe('');
                expect(proc.stdout).toContain(
                    `node --version: ${desiredVersion}`
                );
                expect(proc.stdout).toContain('node success!');
            }
        );
    });

    it('fails with bad NODENV_ROOT', () => {
        let env = {
            INPUT_NODE: '16.13.2',
            NODENV_ROOT: '/tmp/.nodenv',
            PATH: cleanPath('nodenv'),
        };
        return expect(
            runActionExpectError('index', env).catch((err) => {
                throw new Error(err.stdout);
            })
        ).rejects.toThrow(/::error::NODENV_ROOT misconfigured/);
    });
});

describe('python', () => {
    it('works', () => {
        const desiredVersion = '3.10.2';
        return runAction('index', { INPUT_PYTHON: desiredVersion }).then(
            (proc) => {
                expect(proc.stderr.toString()).toBe('');
                expect(proc.stdout).toContain(
                    `python --version: ${desiredVersion}`
                );
                expect(proc.stdout).toContain('python success!');
            }
        );
    });

    it('fails with bad PYENV_ROOT', () => {
        // This nonsense is to filter out pyenv if it's already on the path
        let env = {
            INPUT_PYTHON: '3.10.2',
            PYENV_ROOT: '/tmp/.pyenv',
            PATH: cleanPath('pyenv'),
        };
        return expect(
            runActionExpectError('index', env).catch((err) => {
                throw new Error(err.stdout);
            })
        ).rejects.toThrow(/::error::PYENV_ROOT misconfigured/);
    });
});

describe('terraform', () => {
    it('works with terraform', () => {
        const version = '1.1.2';
        return runAction('index', { INPUT_TERRAFORM: version }).then((proc) => {
            expect(proc.stderr.toString()).toBe('');
            expect(proc.stdout).toContain(`terraform --version: ${version}`);
            expect(proc.stdout).toContain('terraform success!');
        });
    });

    it('fails with bad TFENV_ROOT', () => {
        let env = {
            INPUT_TERRAFORM: '1.1.2',
            TFENV_ROOT: '/tmp/.tfenv',
            PATH: cleanPath('tfenv'),
        };
        return expect(
            runActionExpectError('index', env).catch((err) => {
                throw new Error(err.stdout);
            })
        ).rejects.toThrow(/::error::TFENV_ROOT misconfigured/);
    });
});
