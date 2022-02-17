import Golang from './golang';

describe('setup', () => {
    it('works with an override version', () => {
        return new Golang().setup('1.17.6');
    });

    it("is harmless if there's no versions", () => {
        return new Golang().setup();
    });
});
