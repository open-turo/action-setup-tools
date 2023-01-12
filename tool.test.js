import fs from "fs"

import { jest } from "@jest/globals"

import Tool from "./tool"

import { Cleaner, TestTool, Mute } from "./testutil"

Mute.all()

describe("getVersion", () => {
    const repoToolVersionFilename = ".go-version"

    afterEach(() => {
        fs.rmSync(repoToolVersionFilename, { force: true })
    })

    it("works when action desired version present", () => {
        const tool = new TestTool()
        const [checkVersion, isVersionOverridden] = tool.getVersion(
            "1.2.1",
            null,
        )
        expect(checkVersion).toBe("1.2.1")
        expect(isVersionOverridden).toBe(true)
    })

    it("works when desired version present in dot file", () => {
        fs.writeFileSync(repoToolVersionFilename, "1.2.2")
        const tool = new TestTool()
        const [checkVersion, isVersionOverridden] = tool.getVersion(
            null,
            repoToolVersionFilename,
        )
        expect(checkVersion).toBe("1.2.2")
        expect(isVersionOverridden).toBe(false)
    })

    it("works when action desired version and desired version present in dot file", () => {
        fs.writeFileSync(repoToolVersionFilename, "1.1.2")
        const tool = new TestTool()
        const [checkVersion, isVersionOverridden] = tool.getVersion(
            "1.2.3",
            repoToolVersionFilename,
        )
        expect(checkVersion).toBe("1.2.3")
        expect(isVersionOverridden).toBe(true)
    })

    it("works when empty version present in dot file", () => {
        fs.writeFileSync(repoToolVersionFilename, "")
        const tool = new TestTool()
        const [checkVersion, isVersionOverridden] = tool.getVersion(
            null,
            repoToolVersionFilename,
        )
        expect(checkVersion).toBe(null)
        expect(isVersionOverridden).toBe(null)
    })

    it("works when no desired version present", () => {
        const tool = new TestTool()
        const [checkVersion, isVersionOverridden] = tool.getVersion(null, null)
        expect(checkVersion).toBe(null)
        expect(isVersionOverridden).toBe(null)
    })
})

describe("version", () => {
    const mockProcessExit = jest
        .spyOn(process, "exit")
        .mockImplementation((code) => {
            throw new Error(`process.exit(${code})`)
        })

    beforeEach(() => {
        mockProcessExit.mockClear()
    })

    it("works", async () => {
        const tool = new TestTool()
        const version = await tool.version("bash --version")
        expect(version).toMatch(/^\d+\.\d+\.\d+$/)
    })

    // Skipping this test because it makes tests look like they fail
    it("errors sensibly if a thing isn't found", () => {
        const tool = new TestTool()
        return expect(tool.version("fake-version")).rejects.toThrow(
            /Unable to locate executable file: fake-version/,
        )
    })

    it("handles java 1.8.0 output (regression)", () => {
        const tool = new TestTool()
        return expect(
            tool.version(
                `sh -c "echo -e 'openjdk version 1.8.0_282\\nOpenJDK Runtime Environment (build 1.8.0_282-b08)\\nOpenJDK 64-Bit Server VM (build 25.282-b08, mixed mode)'"`,
            ),
        ).resolves.toMatch(/1\.8\.0/)
    })
})

describe("findRoot", () => {
    beforeEach(() => {
        for (let k of Object.keys(process.env)) {
            if (/_ROOT$/.test(k)) {
                delete process.env[k]
            }
        }
    })

    it("works", async () => {
        const tool = new TestTool()
        const found = await tool.findRoot()
        expect(found).toContain(tool.installerPath)
    })

    it("throws if there's a bad tool root", () => {
        const tool = new TestTool()
        process.env.TESTENV_ROOT = "/tmp/nonexistent"
        return expect(tool.findRoot()).rejects.toThrow(
            /TESTENV_ROOT misconfigured:/,
        )
    })
})

describe("tempRoot", () => {
    const cleaner = new Cleaner(TestTool, "testenv")
    afterEach(cleaner.clean)

    it("creates a temporary directory", () => {
        const tool = new TestTool()
        const temp = tool.tempRoot
        cleaner.root = temp
        expect(temp).toContain(tool.defaults.RUNNER_TEMP)
        expect(temp).toContain("/.test")
        expect(fs.existsSync(temp)).toBe(true)
    })

    it("works as a static method", () => {
        const temp = TestTool.tempRoot()
        cleaner.root = temp
        expect(temp).toContain(TestTool.defaults.RUNNER_TEMP)
        expect(temp).toContain("/.test")
        expect(fs.existsSync(temp)).toBe(true)
    })
})

describe("subprocessShell", () => {
    const tool = new TestTool()
    it("works", async () => {
        const proc = await tool.subprocessShell("echo hello")
        expect(proc.stdout).toBe("hello\n")
    })

    it("actually uses the PATH we give it", async () => {
        const env = { env: { PATH: "/bin:/usr/bin" } }
        const proc = await tool.subprocessShell('echo "PATH=${PATH}"', env)
        expect(proc.stdout).toMatch(new RegExp(`^PATH=.*${env.env.PATH}.*\n$`))
    })
})

describe("tokenizeArgs", () => {
    const tool = new TestTool()
    it("works", () => {
        const cmd = "echo arg1 arg2 arg3"
        const args = tool.tokenizeArgs(cmd)
        expect(args).toEqual(["echo", "arg1", "arg2", "arg3"])
    })

    it("handles escaped spaces", () => {
        const cmd = "echo arg1 arg2\\ arg3"
        const args = tool.tokenizeArgs(cmd)
        expect(args).toEqual(["echo", "arg1", "arg2 arg3"])
    })

    it("handles single quotes", () => {
        const cmd = "echo arg1 'arg2 arg3'"
        const args = tool.tokenizeArgs(cmd)
        expect(args).toEqual(["echo", "arg1", "arg2 arg3"])
    })

    it("handles nested quotes", () => {
        const cmd = "echo \"arg1 'arg2' arg3\""
        const args = tool.tokenizeArgs(cmd)
        expect(args).toEqual(["echo", "arg1 'arg2' arg3"])
    })

    it("handles nested quotes 2", () => {
        const cmd = "echo 'arg1 \"arg2\" arg3'"
        const args = tool.tokenizeArgs(cmd)
        expect(args).toEqual(["echo", 'arg1 "arg2" arg3'])
    })

    it("handles smushy quotes", () => {
        const cmd = `echo "arg 1"'arg 2'"arg 3"`
        const args = tool.tokenizeArgs(cmd)
        expect(args).toEqual(["echo", "arg 1arg 2arg 3"])
    })

    it("handles escaped quotes", () => {
        const cmd = 'echo \\"arg1\\" arg2 arg3'
        const args = tool.tokenizeArgs(cmd)
        expect(args).toEqual(["echo", '\\"arg1\\"', "arg2", "arg3"])
    })

    it("handles escaped nested quotes", () => {
        const cmd = 'echo "arg1 \\"arg2\\" arg3"'
        const args = tool.tokenizeArgs(cmd)
        expect(args).toEqual(["echo", 'arg1 "arg2" arg3'])
    })

    it("handles backtick quotes", () => {
        const cmd = "echo `whoami` arg2 arg3"
        const args = tool.tokenizeArgs(cmd)
        expect(args).toEqual(["echo", "`whoami`", "arg2", "arg3"])
    })

    it("handles bash wrapped commands", () => {
        const cmd = 'bash -c "echo \\"PATH=$PATH\\""'
        const args = tool.tokenizeArgs(cmd)
        expect(args).toEqual(["bash", "-c", 'echo "PATH=$PATH"'])
    })
})

describe("all", () => {
    it("gives us no tools when nothing is registered", () => {
        const allTier1 = Tool.allTier1()
        expect(allTier1).toHaveLength(0)
    })

    it("gives us all the self-registered tools", () => {
        return import("./golang").then((module) => {
            // The dynamic import doesn't name the default export,
            // interestingly
            module.default.registerTier1()
            const allTier1 = Tool.allTier1()
            expect(allTier1).toHaveLength(1)
        })
    })
})
