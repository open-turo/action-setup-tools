import fs from "fs"

import Java from "./java"
import { shimSdkman } from "./testutil"

describe("Java", () => {
    const rcfile = ".sdkmanrc"

    beforeAll(shimSdkman)

    afterEach(() => {
        fs.rmSync(rcfile, { force: true })
    })

    it("works when java isn't wanted", () => {
        const tool = new Java()
        return tool.setup()
    })

    it("parses a simple .sdkmanrc", () => {
        fs.writeFileSync(rcfile, "java=17.0.2-tem\n")
        const tool = new Java()
        return tool.setup()
    })

    it("works with java 1.8 nonsense", () => {
        const tool = new Java()
        return tool.setup("8.0.282-librca")
    })

    it("sets a sensible JAVA_HOME", () => {
        const tool = new Java()
        return tool.setup("8.0.282-librca").then(() => {
            expect(process.env.JAVA_HOME).toBe(
                `${process.env.SDKMAN_DIR}/candidates/java/current`,
            )
        })
    })
})

describe("parseSdkmanrc", () => {
    const rcfile = ".sdkmanrc"

    afterEach(() => {
        fs.rmSync(rcfile, { force: true })
    })

    it("parses a simple .sdkmanrc", () => {
        fs.writeFileSync(rcfile, "java=17.0.2-tem\n")
        const tool = new Java()
        const found = tool.parseSdkmanrc()
        expect(found).toBe("17.0.2-tem")
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

    afterEach(() => {
        fs.rmSync(target, { force: true })
    })

    it("writes a fresh config file", () => {
        const tool = new Java()
        tool.configFile = target
        tool.checkSdkmanSettings()
        expect(fs.existsSync(target)).toBe(true)
        expect(fs.readFileSync(target, "utf8")).toMatch(
            /sdkman_auto_answer=true/,
        )
    })

    it("overwrites bad settings", () => {
        fs.writeFileSync(target, "sdkman_auto_answer=false")
        const tool = new Java()
        tool.configFile = target
        tool.checkSdkmanSettings()
        expect(fs.existsSync(target)).toBe(true)
        expect(fs.readFileSync(target, "utf8")).toMatch(
            /sdkman_auto_answer=true/,
        )
    })
})

describe("getJavaVersion", () => {
    const sdkmanRcFilename = ".sdkmanrc"

    afterEach(() => {
        fs.rmSync(sdkmanRcFilename, { force: true })
    })

    it("works when action desired version present", () => {
        const underTest = new Java()
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            "1.2.1",
            null,
        )
        expect(checkVersion).toBe("1.2.1")
        expect(isVersionOverridden).toBe(true)
    })

    it("works when desired version present in dot file", () => {
        const desiredVersion = "17.0.2-tem"
        const fileContents =
            "# Enable auto-env through the sdkman_auto_env config\n" +
            "# Add key=value pairs of SDKs to use below\n" +
            `java=${desiredVersion}\n`
        fs.writeFileSync(sdkmanRcFilename, fileContents)
        const underTest = new Java()
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            null,
            sdkmanRcFilename,
        )
        expect(checkVersion).toBe("17.0.2-tem")
        expect(isVersionOverridden).toBe(false)
    })

    it("works when action desired version and desired version present in dot file", () => {
        const desiredVersion = "17.0.3-tem"
        const fileContents =
            "# Enable auto-env through the sdkman_auto_env config\n" +
            "# Add key=value pairs of SDKs to use below\n" +
            `java=${desiredVersion}`
        fs.writeFileSync(sdkmanRcFilename, fileContents)
        const underTest = new Java()
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            "1.2.3",
            sdkmanRcFilename,
        )
        expect(checkVersion).toBe("1.2.3")
        expect(isVersionOverridden).toBe(true)
    })

    it("works when empty version present in dot file", () => {
        fs.writeFileSync(sdkmanRcFilename, "")
        const underTest = new Java()
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            null,
            sdkmanRcFilename,
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

describe("validateVersion", () => {
    const versionString =
        `sh -c "echo -e 'openjdk version "1.8.0_282"\\n` +
        `OpenJDK Runtime Environment (build 1.8.0_282-b08)\\n` +
        `OpenJDK 64-Bit Server VM (build 25.282-b08, mixed mode)'"`
    const expected = "8.0.282"

    it("handles java 8/1.8 nonsense output", () => {
        const tool = new Java()
        return expect(
            tool
                .validateVersion(versionString, expected, (version) =>
                    tool.parseJavaVersionString(expected, version),
                )
                .catch((err) => err),
        ).resolves.toMatch(/8\.0\.282/)
    })
})
