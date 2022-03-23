import Golang from "./golang"

import {
    runAction,
    runActionExpectError,
    cleanPath,
    Cleaner,
    Mute,
} from "./testutil"

Mute.all()

describe("runAction golang", () => {
    const cleaner = new Cleaner(Golang, "goenv")
    afterEach(cleaner.clean)

    it("works", async () => {
        const desiredVersion = "1.17.6"
        return runAction("index", { INPUT_GO: desiredVersion }).then((proc) => {
            expect(proc.stderr.toString()).toBe("")
            expect(proc.stdout).toContain(`go version: ${desiredVersion}`)
            expect(proc.stdout).toContain("golang success!")
        })
    })

    it("fails with bad GOENV_ROOT", () => {
        let env = {
            INPUT_GO: "1.17.3",
            GOENV_ROOT: "/tmp/.goenv",
            PATH: cleanPath("shims"),
        }
        return expect(
            runActionExpectError("index", env).catch((err) => {
                throw new Error(`${err.stdout}\n${err.stderr}`)
            }),
        ).rejects.toThrow(/::error::GOENV_ROOT misconfigured/)
    })
})

describe("install", () => {
    const cleaner = new Cleaner(Golang, "goenv")
    afterEach(cleaner.clean)

    it("works", async () => {
        cleaner.root = await new Golang().install(Golang.tempRoot())
        expect(cleaner.root).toMatch(/\/\.goenv/)
    })
})

describe("setup", () => {
    const cleaner = new Cleaner(Golang, "goenv")
    afterEach(cleaner.clean)

    it("works with an override version", () => {
        return new Golang().setup("1.17.6")
    })

    it("is harmless if there's no versions", () => {
        return new Golang().setup()
    })
})
