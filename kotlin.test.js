import fs from "fs"

import Java from "./java"
import Kotlin from "./kotlin"

import {
    runAction,
    runActionExpectError,
    cleanPath,
    Cleaner,
    Mute,
    ignoreInstalled,
} from "./testutil"

Mute.all()
const rcfile = ".sdkmanrc"

describe("runAction java", () => {
    const desiredJavaVersion = "17.0.2"
    const desiredKotlinVersion = "1.6.21"
    const sdkmanJavaVersionIdentifier = `${desiredJavaVersion}-tem`
    const javaCleaner = new Cleaner(Java, "sdkman", [rcfile])
    const kotlinCleaner = new Cleaner(Kotlin, "sdkman", [rcfile])

    afterEach(kotlinCleaner.clean)
    afterEach(javaCleaner.clean)

    it.slow = process.env.TEST_FAST ? it.skip : it

    it.slow("works", async () => {
        const env = {
            INPUT_JAVA: sdkmanJavaVersionIdentifier,
            INPUT_KOTLIN: desiredKotlinVersion,
            ...ignoreInstalled(),
        }
        return runAction("index", env).then((proc) => {
            expect(proc.stderr.toString()).toBe("")
            expect(proc.stdout).toContain(
                `java -version: ${desiredJavaVersion}`,
            )
            expect(proc.stdout).toContain(
                `kotlin -version: ${desiredKotlinVersion}`,
            )
            expect(proc.stdout).toContain("java success!")
            expect(proc.stdout).toContain("kotlin success!")
        })
    })

    it("fails with bad SDKMAN_DIR", () => {
        const env = {
            INPUT_JAVA: sdkmanJavaVersionIdentifier,
            INPUT_KOTLIN: desiredKotlinVersion,
            SDKMAN_DIR: "/tmp/.sdkman",
            PATH: cleanPath("sdkman"),
            ...ignoreInstalled(),
        }
        javaCleaner.root = env.SDKMAN_DIR
        kotlinCleaner.root = env.SDKMAN_DIR
        return expect(
            runActionExpectError("index", env).catch((err) => {
                javaCleaner.captureRoot(err.stdout ?? err.stderr)
                kotlinCleaner.captureRoot(err.stdout ?? err.stderr)
                throw new Error(`${err.stdout}\n${err.stderr}`)
            }),
        ).rejects.toThrow(/::error::SDKMAN_DIR misconfigured/)
    })
})

describe("Kotlin", () => {
    const javaCleaner = new Cleaner(Java, "sdkman", [rcfile])
    const kotlinCleaner = new Cleaner(Kotlin, "sdkman", [rcfile])
    afterEach(kotlinCleaner.clean)
    afterEach(javaCleaner.clean)

    it("works when kotlin isn't wanted", async () => {
        ignoreInstalled()
        const tool = new Kotlin()
        return tool.setup()
    })

    // This case is well covered by the parseSdkmanrc suite below
    it.skip("parses a simple .sdkmanrc", async () => {
        fs.writeFileSync(rcfile, "java=17.0.2-tem\n")
        fs.writeFileSync(rcfile, "kotlin=1.6.21\n")
        const java = new Java()
        const kotlin = new Kotlin()
        javaCleaner.root = await java.findRoot()
        kotlinCleaner.root = await kotlin.findRoot()
        await java.setup()
        return kotlin.setup()
    })

    // This case is well covered by the validateVersion suite below
    it.skip("works with java 1.8 nonsense", async () => {
        const java = new Java()
        const kotlin = new Kotlin()
        javaCleaner.root = await java.findRoot()
        kotlinCleaner.root = await kotlin.findRoot()
        await java.setup("8.0.282-librca")
        return kotlin.setup("1.6.21")
    })

    it("works if sdkman already is installed on the default", async () => {
        const java = new Java()
        const kotlin = new Kotlin()
        java.info("-- Initialized")
        kotlin.info("-- Initialized")
        // Install to our defaultRoot if it doesn't exist
        if (!fs.existsSync(java.defaultRoot)) {
            java.info("-- Installing")
            // Install without the shim
            java.install(java.defaultRoot, true)
            javaCleaner.root = java.defaultRoot
        }
        java.info("-- Setup")
        kotlin.info("-- Setup")
        await java.setup("8.0.282-librca")
        await kotlin.setup("1.6.21")
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

    it("parses a simple .sdkmanrc", () => {
        fs.writeFileSync(rcfile, "kotlin=1.2.3\n")
        const tool = new Kotlin()
        const found = tool.parseSdkmanrc()
        expect(found).toBe("1.2.3")
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
        const tool = new Java()
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
        const desiredVersion = "1.6.21"
        const fileContents =
            "# Enable auto-env through the sdkman_auto_env config\n" +
            "# Add key=value pairs of SDKs to use below\n" +
            `java=${desiredVersion}\n`
        fs.writeFileSync(rcfile, fileContents)
        const underTest = new Kotlin()
        const [checkVersion, isVersionOverridden] = underTest.getKotlinVersion(
            null,
            rcfile,
        )
        expect(checkVersion).toBe("1.6.21")
        expect(isVersionOverridden).toBe(false)
    })

    it("works when action desired version and desired version present in dot file", () => {
        const desiredVersion = "1.6.21"
        const fileContents =
            "# Enable auto-env through the sdkman_auto_env config\n" +
            "# Add key=value pairs of SDKs to use below\n" +
            `java=${desiredVersion}`
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
    const versionString = `Kotlin version 1.6.21-release-334 (JRE 1.8.0_282-b08)`

    it("handles versions", () => {
        const tool = new Kotlin()
        const version = tool.versionParser(versionString)
        expect(version[0]).toBe("1.6.21")
    })
})
