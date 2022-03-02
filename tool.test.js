import fs from "fs"

import { jest } from "@jest/globals"

import Tool from "./tool"

describe("getVersion", () => {
    const repoToolVersionFilename = ".go-version"

    afterEach(() => {
        fs.rmSync(repoToolVersionFilename, { force: true })
    })

    it("works when action desired version present", () => {
        const underTest = new Tool()
        const [checkVersion, isVersionOverridden] = underTest.getVersion(
            "1.2.1",
            null,
        )
        expect(checkVersion).toBe("1.2.1")
        expect(isVersionOverridden).toBe(true)
    })

    it("works when desired version present in dot file", () => {
        fs.writeFileSync(repoToolVersionFilename, "1.2.2")
        const underTest = new Tool()
        const [checkVersion, isVersionOverridden] = underTest.getVersion(
            null,
            repoToolVersionFilename,
        )
        expect(checkVersion).toBe("1.2.2")
        expect(isVersionOverridden).toBe(false)
    })

    it("works when action desired version and desired version present in dot file", () => {
        fs.writeFileSync(repoToolVersionFilename, "1.1.2")
        const underTest = new Tool()
        const [checkVersion, isVersionOverridden] = underTest.getVersion(
            "1.2.3",
            repoToolVersionFilename,
        )
        expect(checkVersion).toBe("1.2.3")
        expect(isVersionOverridden).toBe(true)
    })

    it("works when empty version present in dot file", () => {
        fs.writeFileSync(repoToolVersionFilename, "")
        const underTest = new Tool()
        const [checkVersion, isVersionOverridden] = underTest.getVersion(
            null,
            repoToolVersionFilename,
        )
        expect(checkVersion).toBe(null)
        expect(isVersionOverridden).toBe(null)
    })

    it("works when no desired version present", () => {
        const underTest = new Tool()
        const [checkVersion, isVersionOverridden] = underTest.getVersion(
            null,
            null,
        )
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
        const underTest = new Tool()
        const version = await underTest.version("tfenv --version")
        expect(version).toMatch(/2\.2\.2/)
    })

    // Skipping this test because it makes tests look like they fail
    it.skip("errors sensibly if a thing isn't found", () => {
        const underTest = new Tool()
        return expect(underTest.version("exit 1")).rejects.toThrow(
            /process.exit.1/,
        )
    })

    it("handles java 1.8.0 output (regression)", () => {
        const tool = new Tool()
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
        const tool = new Tool()
        const found = await tool.findRoot("nodenv")
        expect(found).toContain("nodenv")
    })

    it("throws if there's a bad tool root", () => {
        const tool = new Tool()
        tool.tool = "nodenv"
        process.env.NODENV_ROOT = "/tmp/nonexistent"
        return expect(tool.findRoot(tool.tool)).rejects.toThrow(
            /NODENV_ROOT misconfigured:/,
        )
    })
})

describe("all", () => {
    it("gives us no tools when nothing is registered", () => {
        const all = Tool.all()
        expect(all).toHaveLength(0)
    })

    it("gives us all the self-registered tools", () => {
        return import("./golang").then((module) => {
            // The dynamic import doesn't name the default export,
            // interestingly
            module.default.register()
            const all = Tool.all()
            expect(all).toHaveLength(1)
        })
    })
})
