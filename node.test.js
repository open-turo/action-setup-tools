import { jest } from "@jest/globals"
import fs from "fs"

import {
    runAction,
    runActionExpectError,
    ignoreInstalled,
    cleanPath,
    Cleaner,
    Mute,
} from "./testutil"

Mute.all()

// Jest has issues when mocking entire modules in the ESM world
// This is a workaround for that. See https://github.com/facebook/jest/issues/10025#issuecomment-1147776145
const Node = (await import("./node.js")).default

describe("runAction node", () => {
    const cleaner = new Cleaner(Node)
    afterEach(cleaner.clean)

    it("works", async () => {
        const desiredVersion = "16.13.2"
        const env = {
            INPUT_NODE: desiredVersion,
            ...ignoreInstalled(),
        }
        return runAction("index", env).then((proc) => {
            expect(proc.stderr.toString()).toBe("")
            expect(proc.stdout).toContain(`node --version: ${desiredVersion}`)
            expect(proc.stdout).toContain("nodenv update-version-defs")
            expect(proc.stdout).toContain("node success!")
        })
    })

    it("fails with bad NODENV_ROOT", () => {
        let env = {
            INPUT_NODE: "16.13.2",
            NODENV_ROOT: "/tmp/.nodenv",
            PATH: cleanPath("nodenv"),
            ...ignoreInstalled(),
        }
        return expect(
            runActionExpectError("index", env).catch((err) => {
                throw new Error(err.stdout)
            }),
        ).rejects.toThrow(/::error::NODENV_ROOT misconfigured/)
    })
})

describe("install", () => {
    const cleaner = new Cleaner(Node)
    afterEach(cleaner.clean)

    it("works", async () => {
        cleaner.root = await new Node().install(Node.tempRoot())
        expect(cleaner.root).toMatch(/\/\.node/)
    })
})

describe("setup", () => {
    const cleaner = new Cleaner(Node)

    afterEach(() => {
        jest.resetAllMocks()
        jest.clearAllMocks()
        jest.restoreAllMocks()
        cleaner.clean()
    })

    /**
     * Mock the filesystem when trying to read a node version file
     * @param fileName File that is being mocked
     * @param version Content of the file, aka the node version
     */
    const mockNodeVersionFile = (fileName, version) => {
        // TODO This should not be done like this but mocking an ESM module is a bit more complicated
        // Also mocking FS like this breaks inline snapshots
        const exists = jest.fn().mockImplementation((file) => file === fileName)
        const readFile = jest.fn().mockReturnValue(version)
        jest.spyOn(fs, "existsSync").mockImplementation(exists)
        jest.spyOn(fs, "readFileSync").mockImplementation(readFile)
    }

    it.each([
        {
            fileName: ".node-version",
            content: "55.4.0",
            expectedVersion: "55.4.0",
        },
        { fileName: ".nvmrc", content: "lts/*", expectedVersion: "54.0.0" },
        { fileName: ".node-version", content: "51", expectedVersion: "51.3.1" },
        {
            fileName: ".node-version",
            content: "lts/test",
            expectedVersion: "52.0.0",
        },
    ])(
        `parses node versions correctly for: %o`,
        async ({ fileName, content, expectedVersion }) => {
            mockNodeVersionFile(fileName, content)
            // Can't call setup here yet, as the fs mock breaks other inner calls
            const [version] = await new Node().getNodeVersion()
            expect(version).toEqual(expectedVersion)
        },
    )

    it("throws an error when the version cannot be parsed", () => {
        mockNodeVersionFile(".node-version", "invalid")
        expect(new Node().setup()).rejects.toThrow(
            /Could not parse Node version/,
        )
    })

    it("works with an override version", async () => {
        return new Node().setup("16.13.2")
    })

    it("is harmless if there's no versions", async () => {
        return new Node().setup()
    })
})
