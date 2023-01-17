import fs from "fs"
import fsPromises from "fs/promises"
import os from "os"
import path from "path"

import core from "@actions/core"

import Java from "./java"
import Kotlin from "./kotlin"

import { runActionExpectError, cleanPath, Cleaner, Mute } from "./testutil"

Mute.all()
const rcfile = Kotlin.configFile

describe("runAction kotlin", () => {
    const desiredKotlinVersion = "1.6.10"
    const cleaner = new Cleaner(Kotlin, "sdkman", [rcfile])

    afterEach(cleaner.clean)

    it("fails without a Java installation", async () => {
        const env = {
            INPUT_KOTLIN: desiredKotlinVersion,
            IGNORE_INSTALLED: true,
            // DEBUG: true,
        }
        return expect(
            runActionExpectError("index", env).catch((err) => {
                throw new Error(`${err.stdout}\n${err.stderr}`)
            }),
        ).rejects.toThrow(/::error::Java is required for Kotlin/)
    })
})

describe("Kotlin", () => {
    const javaCleaner = new Cleaner(Java, "sdkman", [rcfile])
    afterEach(javaCleaner.clean)
    const kotlinCleaner = new Cleaner(Kotlin, "sdkman", [rcfile])
    afterEach(kotlinCleaner.clean)

    it("works when kotlin isn't wanted", async () => {
        const tool = new Kotlin()
        return tool.setup()
    })
})

describe("install", () => {
    const cleaner = new Cleaner(Kotlin, "sdkman", [rcfile])
    afterEach(cleaner.clean)

    it("works", async () => {
        const root = Kotlin.tempRoot()
        cleaner.root = await new Kotlin().install(root)
        expect(cleaner.root).toMatch(/\/\.sdkman/)
    })
})

describe("parseSdkmanrc", () => {
    const cleaner = new Cleaner(Kotlin, "sdkman", [rcfile])
    afterEach(cleaner.clean)

    it("parses a simple .sdkmanrc with no java property", () => {
        fs.writeFileSync(rcfile, "kotlin=1.6.21\n")
        const tool = new Kotlin()
        const found = tool.parseSdkmanrc()
        expect(found).toBe("1.6.21")
    })

    it("parses a minimal .sdkmanrc with java property", () => {
        fs.writeFileSync(rcfile, "java=17.0.2-tem\nkotlin=1.7.21\n")
        const tool = new Kotlin()
        const found = tool.parseSdkmanrc()
        expect(found).toBe("1.7.21")
    })

    it("returns nothing if there's no rc file", () => {
        const tool = new Kotlin()
        const found = tool.parseSdkmanrc()
        expect(found).toBeFalsy()
    })

    it("parses a more complex .sdkmanrc", () => {
        fs.writeFileSync(rcfile, "java=1.8.1\nkotlin=1.2.3\npython=2.7.2\n")
        const tool = new Kotlin()
        const found = tool.parseSdkmanrc()
        expect(found).toBe("1.2.3")
    })

    /*
    // Debugging/testing locally only don't uncomment
    it("works against the real dunlop .sdkmanrc", () => {
        const tool = new Kotlin()
        const found = tool.parseSdkmanrc("../../turo/dunlop/.sdkmanrc")
        expect(found).toBe('8.0.282-librca')
    })
    */
})

describe("checkSdkmanSettings", () => {
    const target = "/tmp/action-setup-tools.sdkman.config"
    const cleaner = new Cleaner(Kotlin, "sdkman", [rcfile])
    afterEach(cleaner.clean)
    afterEach(() => fs.rmSync(target, { force: true }))

    it("writes a fresh config file", () => {
        const tool = new Kotlin()
        tool.configFile = target
        tool.checkSdkmanSettings(target)
        expect(fs.existsSync(target)).toBe(true)
        expect(fs.readFileSync(target, "utf8")).toMatch(
            /sdkman_auto_answer=true/,
        )
    })

    it("overwrites bad settings", () => {
        fs.writeFileSync(target, "sdkman_auto_answer=false")
        const tool = new Kotlin()
        tool.configFile = target
        tool.checkSdkmanSettings(target)
        expect(fs.existsSync(target)).toBe(true)
        expect(fs.readFileSync(target, "utf8")).toMatch(
            /sdkman_auto_answer=true/,
        )
    })
})

describe("getKotlinVersion", () => {
    const cleaner = new Cleaner(Kotlin, "sdkman", [rcfile])
    afterEach(cleaner.clean)

    it("works with action input", () => {
        const underTest = new Kotlin()
        const [checkVersion, isVersionOverridden] = underTest.getKotlinVersion(
            "1.2.1",
            null,
        )
        expect(checkVersion).toBe("1.2.1")
        expect(isVersionOverridden).toBe(true)
    })

    it("works with .sdkmanrc", () => {
        const desiredVersion = "1.7.20"
        const fileContents =
            "# Enable auto-env through the sdkman_auto_env config\n" +
            "# Add key=value pairs of SDKs to use below\n" +
            `kotlin=${desiredVersion}\n`
        fs.writeFileSync(rcfile, fileContents)
        const underTest = new Kotlin()
        const [checkVersion, isVersionOverridden] = underTest.getKotlinVersion(
            null,
            rcfile,
        )
        expect(checkVersion).toBe("1.7.20")
        expect(isVersionOverridden).toBe(false)
    })

    it("works when action desired version and desired version present in dot file", () => {
        const desiredVersion = "1.7.21"
        const fileContents =
            "# Enable auto-env through the sdkman_auto_env config\n" +
            "# Add key=value pairs of SDKs to use below\n" +
            `kotlin=${desiredVersion}`
        fs.writeFileSync(rcfile, fileContents)
        const underTest = new Kotlin()
        const [checkVersion, isVersionOverridden] = underTest.getKotlinVersion(
            "1.2.3",
            rcfile,
        )
        expect(checkVersion).toBe("1.2.3")
        expect(isVersionOverridden).toBe(true)
    })

    it("works when empty version present in dot file", () => {
        fs.writeFileSync(rcfile, "")
        const underTest = new Kotlin()
        const [checkVersion, isVersionOverridden] = underTest.getKotlinVersion(
            null,
            rcfile,
        )
        expect(checkVersion).toBe(null)
        expect(isVersionOverridden).toBe(null)
    })

    it("works when no desired version present", () => {
        const underTest = new Kotlin()
        const [checkVersion, isVersionOverridden] = underTest.getKotlinVersion(
            null,
            null,
        )
        expect(checkVersion).toBe(null)
        expect(isVersionOverridden).toBe(null)
    })
})

describe("versionParser", () => {
    it("handles expected versions", () => {
        const tool = new Kotlin()
        const version = tool.versionParser(
            "Kotlin version 1.7.21-release-272 (JRE 1.8.0_282-b08)",
        )
        expect(version[0]).toBe("1.7.21")
    })
})

describe("haveVersion", () => {
    let tmpdir
    let tmpcmd
    let tool

    beforeAll(() => {
        tool = new Kotlin()
        tool.ignore_installed = false
        tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), "kotlin.test.js"))
        tmpcmd = path.join(tmpdir, "kotlin")
        core.addPath(tmpdir)
    })

    afterAll(async () => {
        cleanPath(tmpdir)
        await fsPromises.rm(tmpdir, { recursive: true, force: true })
    })

    it("works", async () => {
        const found = await tool.haveVersion("99.99.99")
        // We expect there to be NO matching Kotlin version cause v99 isn't
        // real, therefore haveVersion should return `true`, indicating it needs
        // installed
        expect(found).toBe(true)
    })

    describe("works with faked kotlin", () => {
        beforeAll(async () => {
            // fake kotlin has to properly impersonate real kotlin when the "kotlin -version"
            // command is invoked, and release 1.7.21 would report something like
            // Kotlin version 1.7.21-release-272 (JRE 17.0.5+8)
            await tool.subprocessShell(
                `echo "echo 'Kotlin version 1.7.21-release-272 (JRE 17.0.5+8)'" > ${tmpcmd}`,
                {
                    check: false,
                },
            )
            await tool.subprocessShell(`chmod a+x ${tmpcmd}`, { check: false })
        })

        it("finds exact matching version", async () => {
            const found = await tool.haveVersion("1.7.21")
            // We created a mock exact match Kotlin, so haveVersion returns false,
            // indicating we don't need to install the tool
            expect(found).toBe(false)
        })

        it("finds patch floated version", async () => {
            const floated = await tool.haveVersion("1.7.22")
            // The current behavior is to allow floated versions so this should be
            // allowed
            expect(floated).toBe(false)
        })

        it("does not minor floated version", async () => {
            const minorFloat = await tool.haveVersion("1.8.0")
            // We don't allow minor floated versions
            expect(minorFloat).toBe(true)
        })
    })
})
