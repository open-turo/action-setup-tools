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

    it("errors sensibly if a thing isn't found", () => {
        const underTest = new Tool()
        return expect(underTest.version("tffoo --version")).rejects.toThrow(
            /process.exit/,
        )
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
})
