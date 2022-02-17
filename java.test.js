import fs from 'fs';
import Java from './java';

describe('getJavaVersion', () => {
    const sdkmanRcFilename = '.sdkmanrc';

    afterEach(() => {
        fs.rmSync(sdkmanRcFilename, { force: true });
    });

    it('works when action desired version present', () => {
        const underTest = new Java();
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            '1.2.1',
            null
        );
        expect(checkVersion).toBe('1.2.1');
        expect(isVersionOverridden).toBe(true);
    });

    it('works when desired version present in dot file', () => {
        const desiredVersion = '17.0.2-tem';
        const fileContents =
            '# Enable auto-env through the sdkman_auto_env config\n' +
            '# Add key=value pairs of SDKs to use below\n' +
            `java=${desiredVersion}`;
        fs.writeFileSync(sdkmanRcFilename, fileContents);
        const underTest = new Java();
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            null,
            sdkmanRcFilename
        );
        expect(checkVersion).toBe('17.0.2-tem');
        expect(isVersionOverridden).toBe(false);
    });

    it('works when action desired version and desired version present in dot file', () => {
        const desiredVersion = '17.0.3-tem';
        const fileContents =
            '# Enable auto-env through the sdkman_auto_env config\n' +
            '# Add key=value pairs of SDKs to use below\n' +
            `java=${desiredVersion}`;
        fs.writeFileSync(sdkmanRcFilename, fileContents);
        const underTest = new Java();
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            '1.2.3',
            sdkmanRcFilename
        );
        expect(checkVersion).toBe('1.2.3');
        expect(isVersionOverridden).toBe(true);
    });

    it('works when empty version present in dot file', () => {
        fs.writeFileSync(sdkmanRcFilename, '');
        const underTest = new Java();
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            null,
            sdkmanRcFilename
        );
        expect(checkVersion).toBe(null);
        expect(isVersionOverridden).toBe(null);
    });

    it('works when no desired version present', () => {
        const underTest = new Java();
        const [checkVersion, isVersionOverridden] = underTest.getJavaVersion(
            null,
            null
        );
        expect(checkVersion).toBe(null);
        expect(isVersionOverridden).toBe(null);
    });
});
