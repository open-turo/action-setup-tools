import path from "path"

import Python from "./python"

import {
    runAction,
    runActionExpectError,
    cleanPath,
    Cleaner,
    Mute,
    ignoreInstalled,
} from "./testutil"

Mute.all()

function getEnv(env) {
    return {
        ...env,
        ...ignoreInstalled(),
        GITHUB_WORKSPACE: path.dirname(Python.tempRoot()),
    }
}

describe("skipping slow tests", () => {
    if (process.env.TEST_FAST) {
        it.only("all python tests skipped", () => {})
    }
})

describe("runAction python", () => {
    const cleaner = new Cleaner(Python)
    afterEach(cleaner.clean)

    it("works", async () => {
        const desiredVersion = "3.10.2"
        const env = getEnv({
            INPUT_PYTHON: desiredVersion,
        })
        return runAction("index", env).then((proc) => {
            expect(proc.stderr.toString()).toBe("")
            expect(proc.stdout).toContain(`python --version: ${desiredVersion}`)
            expect(proc.stdout).toContain("python success!")
        })
    })

    it("fails with bad PYENV_ROOT", () => {
        // This nonsense is to filter out pyenv if it's already on the path
        const env = getEnv({
            INPUT_PYTHON: "3.10.2",
            PYENV_ROOT: "/tmp/.pyenv",
            PATH: cleanPath("pyenv"),
        })
        return expect(
            runActionExpectError("index", env).catch((err) => {
                throw new Error(err.stdout)
            }),
        ).rejects.toThrow(/::error::PYENV_ROOT misconfigured/)
    })
})

describe("install", () => {
    const cleaner = new Cleaner(Python)
    afterEach(cleaner.clean)

    it("works", async () => {
        const root = Python.tempRoot()
        cleaner.root = await new Python().install(root)
        expect(cleaner.root).toMatch(/\/\.pyenv/)
    })
})

describe("setup", () => {
    const cleaner = new Cleaner(Python)
    afterEach(cleaner.clean)
    beforeEach(() => {
        process.env.GITHUB_WORKSPACE = path.dirname(Python.tempRoot())
    })
    afterAll(() => {
        delete process.env.GITHUB_WORKSPACE
    })

    it("works with an override version", () => {
        return new Python().setup("3.10.2")
    })

    it("is harmless if there's no versions", () => {
        return new Python().setup()
    })
})
