import { jest } from "@jest/globals"
import fs from "fs"
import nock from "nock"

import {
    createNodeVersion,
    runAction,
    runActionExpectError,
    ignoreInstalled,
    cleanPath,
    Cleaner,
    Mute,
} from "./testutil"

Mute.all()

const nodeVersions = [
    createNodeVersion({ version: "v55.4.0" }),
    createNodeVersion({ version: "v54.0.0", lts: "latest" }),
    createNodeVersion({ version: "v52.0.0", lts: "test" }),
    createNodeVersion({ version: "v51.3.1" }),
    createNodeVersion({ version: "v51.0.0" }),
]

// Mock the node-version-data library so we can play with a controlled set of node versions
// and write predictable expectations in the tests
jest.unstable_mockModule("./node-version-data.js", () => {
    return {
        nodeVersions: [
            ...nodeVersions,
            createNodeVersion({ version: "v49.0.0" }),
        ],
    }
})

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

// Move mockNodeVersionsApiCall outside of any describe block
const mockNodeVersionsApiCall = (shouldThrowError) => {
    const api = nock("https://nodejs.org")
    const method = api.get("/download/release/index.json")
    if (shouldThrowError) {
        method.reply(500)
    } else {
        method.reply(200, [
            { version: "v54.0.0", lts: "latest" },
            { version: "v20.18.1" },
            { version: "v20.18.0" },
            { version: "v20.17.0" },
            ...nodeVersions
        ])
    }
    return api
}

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
            const api = mockNodeVersionsApiCall()
            mockNodeVersionFile(fileName, content)
            // Can't call setup here yet, as the fs mock breaks other inner calls
            const [version] = await new Node().getNodeVersion()
            expect(api.isDone()).toBeTruthy()
            expect(version).toEqual(expectedVersion)
        },
    )

    it("falls back to local node version cache when it fails to fetch it", async () => {
        mockNodeVersionsApiCall(true)
        mockNodeVersionFile(".node-version", "49")
        const [version] = await new Node().getNodeVersion()
        expect(version).toEqual("49.0.0")
    })

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
        const exists = jest.fn().mockImplementation(() => false)
        jest.spyOn(fs, "existsSync").mockImplementation(exists)
        return new Node().setup()
    })
})

describe("getNodeVersion", () => {
    const cleaner = new Cleaner(Node)
    afterEach(cleaner.clean)

    it("resolves major version number", async () => {
        const api = mockNodeVersionsApiCall()
        const [version, override] = await new Node().getNodeVersion("20")
        expect(api.isDone()).toBeTruthy()
        expect(version).toMatch(/^20\.\d+\.\d+$/)
        expect(override).toBeTruthy()
    })

    it("handles specific version", async () => {
        const [version, override] = await new Node().getNodeVersion("20.18.1")
        expect(version).toBe("20.18.1")
        expect(override).toBeTruthy()
    })

    it("throws on invalid major version", async () => {
        const api = mockNodeVersionsApiCall()
        await expect(new Node().getNodeVersion("99"))
            .rejects.toThrow(/No stable version found matching Node.js 99.x/)
        expect(api.isDone()).toBeTruthy()
    })
})
