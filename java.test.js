import fs from "fs"

import Java from "./java"

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

// TODO: Remove the it.skip for java installs when sdkman works

describe("runAction java", () => {
    const desiredVersion = "17.0.5"
    const sdkmanVersionIdentifier = `${desiredVersion}-tem`
    const cleaner = new Cleaner(Java, "sdkman", [rcfile])

    afterEach(cleaner.clean)

    it.slow = process.env.TEST_FAST ? it.skip : it

    it.slow("works", async () => {
        const env = {
            INPUT_JAVA: sdkmanVersionIdentifier,
            ...ignoreInstalled(),
        }
        return runAction("index", env).then((proc) => {
            expect(proc.stderr.toString()).toBe("")
            expect(proc.stdout).toContain(`java -version: ${desiredVersion}`)
            expect(proc.stdout).toContain("java success!")
        })
    })

    it("fails with bad SDKMAN_DIR", () => {
        const env = {
            INPUT_JAVA: sdkmanVersionIdentifier,
            SDKMAN_DIR: "/tmp/.sdkman",
            PATH: cleanPath("sdkman"),
            ...ignoreInstalled(),
        }
        cleaner.root = env.SDKMAN_DIR
        return expect(
            runActionExpectError("index", env).catch((err) => {
                cleaner.captureRoot(err.stdout ?? err.stderr)
                throw new Error(`${err.stdout}\n${err.stderr}`)
            }),
        ).rejects.toThrow(/::error::SDKMAN_DIR misconfigured/)
    })
})

describe("Java", () => {
    const cleaner = new Cleaner(Java, "sdkman", [rcfile])
    afterEach(cleaner.clean)

    it("works when java isn't wanted", async () => {
        ignoreInstalled()
        const tool = new Java()
        return tool.setup()
    })

    // This case is well covered by the parseSdkmanrc suite below
    it.skip("parses a simple .sdkmanrc", async () => {
        fs.writeFileSync(rcfile, "java=17.0.5-tem\n")
        const tool = new Java()
        cleaner.root = await tool.findRoot()
        return tool.setup()
    })

    // This case is well covered by the validateVersion suite below
    it.skip("works with java 1.8 nonsense", async () => {
        const tool = new Java()
        cleaner.root = await tool.findRoot()
        return tool.setup("8.0.282-librca")
    })

    it.skip("works and sets a sensible JAVA_HOME", async () => {
        ignoreInstalled()
        const tool = new Java()
        return tool.setup("8.0.282-librca").then(() => {
            expect(process.env.JAVA_HOME).toBe(
                `${process.env.SDKMAN_DIR}/candidates/java/current`,
            )
        })
    })

    it.skip("works if sdkman already is installed on the default", async () => {
        const tool = new Java()
        tool.info("-- Initialized")
        // Install to our defaultRoot if it doesn't exist
        if (!fs.existsSync(tool.defaultRoot)) {
            tool.info("-- Installing")
            // Install without the shim
            await tool.install(tool.defaultRoot, true)
            cleaner.root = tool.defaultRoot
        }
        tool.info("-- Setup")
        await tool.setup("8.0.282-librca")
    })
})

describe("install", () => {
    const cleaner = new Cleaner(Java, "sdkman", [rcfile])
    afterEach(cleaner.clean)

    it.skip("works", async () => {
        const root = Java.tempRoot()
        cleaner.root = await new Java().install(root)
        expect(cleaner.root).toMatch(/\/\.sdkman/)
    })
})

describe("parseSdkmanrc", () => {
    const cleaner = new Cleaner(Java, "sdkman", [rcfile])
    afterEach(cleaner.clean)

    it("parses a simple .sdkmanrc", () => {
        fs.writeFileSync(rcfile, "java=17.0.5-tem\n")
        const tool = new Java()
        const found = tool.parseSdkmanrc()
        expect(found).toBe("17.0.5-tem")
    })

    it("returns nothing if there's no rc file", () => {
        const tool = new Java()
        const found = tool.parseSdkmanrc()
        expect(found).toBeFalsy()
    })

    it("parses a more complex .sdkmanrc", () => {
        fs.writeFileSync(rcfile, "java=1.8.1\nkotlin=1.2.3\npython=2.7.2\n")
        const tool = new Java()
        const found = tool.parseSdkmanrc()
        expect(found).toBe("1.8.1")
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
    const cleaner = new Cleaner(Java, "sdkman", [rcfile])
    afterEach(cleaner.clean)
    afterEach(() => fs.rmSync(target, { force: true }))

    it("writes a fresh config file", () => {
        const tool = new Java()
        tool.configFile = target
        tool.checkSdkmanSettings(target)
        expect(fs.existsSync(target)).toBe(true)
        expect(fs.readFileSync(target, "utf8")).toMatch(
            /sdkman_auto_answer=true/,
        )
    })

    it("overwrites bad settings", () => {
        fs.writeFileSync(target, "sdkman_auto_answer=false")
        const tool = new Java()
        tool.configFile = target
        tool.checkSdkmanSettings(target)
        expect(fs.existsSync(target)).toBe(true)
        expect(fs.readFileSync(target, "utf8")).toMatch(
            /sdkman_auto_answer=true/,
        )
    })
})

describe("getJavaVersion", () => {
    const cleaner = new Cleaner(Java, "sdkman", [rcfile])
    afterEach(cleaner.clean)

    it("works with action input", () => {
        const underTest = new Java()
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            "1.2.1",
            null,
        )
        expect(checkVersion).toBe("1.2.1")
        expect(isVersionOverridden).toBe(true)
    })

    it("works with .sdkmanrc", () => {
        const desiredVersion = "17.0.5-tem"
        const fileContents =
            "# Enable auto-env through the sdkman_auto_env config\n" +
            "# Add key=value pairs of SDKs to use below\n" +
            `java=${desiredVersion}\n`
        fs.writeFileSync(rcfile, fileContents)
        const underTest = new Java()
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            null,
            rcfile,
        )
        expect(checkVersion).toBe("17.0.5-tem")
        expect(isVersionOverridden).toBe(false)
    })

    it("works when action desired version and desired version present in dot file", () => {
        const desiredVersion = "17.0.3-tem"
        const fileContents =
            "# Enable auto-env through the sdkman_auto_env config\n" +
            "# Add key=value pairs of SDKs to use below\n" +
            `java=${desiredVersion}`
        fs.writeFileSync(rcfile, fileContents)
        const underTest = new Java()
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            "1.2.3",
            rcfile,
        )
        expect(checkVersion).toBe("1.2.3")
        expect(isVersionOverridden).toBe(true)
    })

    it("works when empty version present in dot file", () => {
        fs.writeFileSync(rcfile, "")
        const underTest = new Java()
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            null,
            rcfile,
        )
        expect(checkVersion).toBe(null)
        expect(isVersionOverridden).toBe(null)
    })

    it("works when no desired version present", () => {
        const underTest = new Java()
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            null,
            null,
        )
        expect(checkVersion).toBe(null)
        expect(isVersionOverridden).toBe(null)
    })
})

describe("versionParser", () => {
    const versionString =
        `openjdk version "1.8.0_282"\\n` +
        `OpenJDK Runtime Environment (build 1.8.0_282-b08)\\n` +
        `OpenJDK 64-Bit Server VM (build 25.282-b08, mixed mode)`

    it("handles java 8/1.8 nonsense output", () => {
        const tool = new Java()
        const version = tool.versionParser(versionString)
        expect(version[0]).toBe("8.0.282")
    })

    it("handles java 11+ versions", () => {
        const tool = new Java()
        const version = tool.versionParser(`openjdk version "17.0.5_temurin"`)
        expect(version[0]).toBe("17.0.5")
    })
})
