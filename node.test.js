import Node from "./node"

import {
    runAction,
    runActionExpectError,
    ignoreInstalled,
    cleanPath,
    Cleaner,
    Mute,
} from "./testutil"

Mute.all()

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
    afterEach(cleaner.clean)

    it("works with an override version", async () => {
        return new Node().setup("16.13.2")
    })

    it("is harmless if there's no versions", async () => {
        return new Node().setup()
    })
})
