import { jest } from "@jest/globals"

import { runAction, Mute, runJS, ignoreInstalled } from "./testutil"

Mute.all()

beforeAll(() => {
    process.env.RUN_ASYNC = "false"
})

describe("skipping slow tests", () => {
    if (process.env.TEST_FAST) {
        it.only("", () => {})
    }
})

describe("run", () => {
    it("skips all tools if INPUT env empty", async () => {
        // this runJS is just a sanity check for invoking the subprocess
        // directly without using Tool.subprocess
        return runJS("index", {}).then((proc) => {
            expect(proc.stderr.toString()).toBe("")
            expect(proc.stdout).toMatch(/go.*skipping/)
            expect(proc.stdout).toMatch(/java.*skipping/)
            expect(proc.stdout).toMatch(/node.*skipping/)
            expect(proc.stdout).toMatch(/python.*skipping/)
            expect(proc.stdout).toMatch(/terraform.*skipping/)
        })
    })

    it("skips asynchronously", async () => {
        return runAction("index", { RUN_ASYNC: "true" }).then((proc) => {
            expect(proc.stderr.toString()).toBe("")
            expect(proc.stdout).toMatch(/go.*skipping/)
            expect(proc.stdout).toMatch(/java.*skipping/)
            expect(proc.stdout).toMatch(/node.*skipping/)
            expect(proc.stdout).toMatch(/python.*skipping/)
            expect(proc.stdout).toMatch(/terraform.*skipping/)
        })
    })

    it("works with all tools", async () => {
        const goVersion = "1.17.6"
        const desiredJavaVersion = "17.0.2"
        const sdkmanJavaVersionIdentifier = `${desiredJavaVersion}-tem`
        const tfVersion = "1.1.2"
        const nodeVersion = "16.13.2"
        const pyVersion = process.env.TEST_SLOW ? "3.10.2" : ""
        return runAction("index", {
            INPUT_GO: goVersion,
            INPUT_JAVA: sdkmanJavaVersionIdentifier,
            INPUT_NODE: nodeVersion,
            INPUT_TERRAFORM: tfVersion,
            INPUT_PYTHON: pyVersion,
            ...ignoreInstalled(),
        }).then((proc) => {
            expect(proc.stderr.toString()).toBe("")
            expect(proc.stdout).toContain(`go version: ${goVersion}`)
            expect(proc.stdout).toContain("golang success!")
            expect(proc.stdout).toContain(
                `java -version: ${desiredJavaVersion}`,
            )
            expect(proc.stdout).toContain("java success!")
            expect(proc.stdout).toContain(`node --version: ${nodeVersion}`)
            expect(proc.stdout).toContain("node success!")
            expect(proc.stdout).toContain(`terraform --version: ${tfVersion}`)
            expect(proc.stdout).toContain("terraform success!")
            if (process.env.SLOW_TEST) {
                expect(proc.stdout).toContain(`python --version: ${pyVersion}`)
                expect(proc.stdout).toContain("python success!")
            } else {
                expect(proc.stdout).toMatch(/python.*skipping/)
            }
        })
    })
})

describe("inline", () => {
    var run
    var runner
    var origEnv = { ...process.env }
    const mockProcessExit = jest
        .spyOn(process, "exit")
        .mockImplementation((code) => {
            throw new Error(`process.exit(${code})`)
        })

    beforeAll(async () =>
        import("./index").then((m) => {
            run = m.default
            runner = m.runner
        }),
    )
    beforeEach(() => mockProcessExit.mockClear())
    beforeEach(() => {
        process.env.RUN_AUTO = "false"
        ignoreInstalled()
    })
    afterEach(() => {
        process.env = { ...origEnv }
        jest.resetModules()
    })

    it("doesn't error if there's nothing to run", async () => {
        return run()
    })

    it("doesn't error if there's nothing to run in parallel", async () => {
        process.env.RUN_ASYNC = "true"
        return run()
    })

    it("doesn't error if there's nothing to run in serial", async () => {
        process.env.RUN_ASYNC = "false"
        return run()
    })

    it("works in parallel when there's actually tools", async () => {
        process.env.RUN_ASYNC = "true"
        process.env.INPUT_GO = "1.17.6"
        return run()
    })

    it("works in serial when there's actually tools", async () => {
        process.env.RUN_ASYNC = "false"
        process.env.INPUT_GO = "1.17.6"
        return run()
    })

    it("handles an error in serial", async () => {
        process.env.RUN_ASYNC = "false"
        process.env.INPUT_GO = "8.0.123" // deliberately bad version
        return expect(run()).rejects.toThrow(
            "subprocess exited with non-zero code: goenv",
        )
    })

    it("handles multiple errors in parallel", async () => {
        process.env.INPUT_GO = "8.0.123" // deliberately bad version
        process.env.INPUT_NODE = "8.0.234" // deliberately bad version
        return expect(run()).rejects.toThrow(
            /subprocess exited with non-zero code: .*/,
        )
    })

    it("handles an error wrapped in runner", async () => {
        process.env.RUN_AUTO = "true"
        process.env.INPUT_GO = "8.0.123" // deliberately bad version
        return expect(runner()).resolves.toMatch(
            /subprocess exited with non-zero code: goenv/,
        )
    })
})
