import Terraform from "./terraform"

import {
    runAction,
    runActionExpectError,
    cleanPath,
    Cleaner,
    Mute,
    ignoreInstalled,
} from "./testutil"

Mute.all()

describe("runAction terraform", () => {
    const cleaner = new Cleaner(Terraform, "tfenv")
    afterEach(cleaner.clean)

    it("works with terraform", async () => {
        const version = "1.1.2"
        const env = {
            INPUT_TERRAFORM: version,
            ...ignoreInstalled(),
        }
        return runAction("index", env).then((proc) => {
            expect(proc.stderr.toString()).toBe("")
            expect(proc.stdout).toContain(`terraform --version: ${version}`)
            expect(proc.stdout).toContain("terraform success!")
        })
    })

    it("fails with bad TFENV_ROOT", () => {
        const env = {
            INPUT_TERRAFORM: "1.1.2",
            TFENV_ROOT: "/tmp/.tfenv",
            PATH: cleanPath("tfenv"),
            ...ignoreInstalled(),
        }
        return expect(
            runActionExpectError("index", env).catch((err) => {
                throw new Error(err.stdout)
            }),
        ).rejects.toThrow(/::error::TFENV_ROOT misconfigured/)
    })
})

describe("install", () => {
    const cleaner = new Cleaner(Terraform, "tfenv")
    afterEach(cleaner.clean)

    it("works", async () => {
        const root = Terraform.tempRoot()
        cleaner.root = await new Terraform().install(root)
        expect(cleaner.root).toMatch(/\/\.tfenv/)
    })
})

describe("findRoot", () => {
    const cleaner = new Cleaner(Terraform, "tfenv")
    afterEach(cleaner.clean)

    it("works", () => {
        const tool = new Terraform()
        // This is a garbage test since this will move around depending on
        // environment, but at least it'll fail if there's an actual error
        return expect(tool.findRoot()).resolves.toContain(tool.installer)
    })
})

describe("setup", () => {
    const cleaner = new Cleaner(Terraform, "tfenv")
    afterEach(cleaner.clean)

    it("works to install and find itself", async () => {
        ignoreInstalled()
        const tool = new Terraform()
        const check = await tool
            .subprocessShell("terraform --version")
            .catch((err) => err)
        if (check?.stdout?.includes(" 1.1.")) {
            // This means we have terraform on the PATH and it won't install
            // tfenv by default
            return // success-ish
        }

        await tool.setup("1.1.2")
        const proc = await tool.subprocessShell("tfenv --version")
        expect(proc.stdout).toEqual("tfenv 2.2.3\n")
    })

    it("works with an override version", () => {
        return new Terraform().setup("1.1.2")
    })

    it("is harmless if there's no versions", () => {
        return new Terraform().setup()
    })
})
