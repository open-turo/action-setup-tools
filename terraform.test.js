import Terraform from './terraform';

describe('findRoot', () => {
    it('works', () => {
        const tool = new Terraform();
        // This is a garbage test since this will move around depending on
        // environment, but at least it'll fail if there's an actual error
        return expect(tool.findRoot('tfenv')).resolves.toContain('tfenv');
    });
});
