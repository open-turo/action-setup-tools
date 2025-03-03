import { expect } from "chai"
import Node from "../node.js"

describe("Node version resolution", () => {
    let node

    beforeEach(() => {
        node = new Node()
    })

    it("should resolve major version number", async () => {
        const [version, override] = await node.getNodeVersion("20")
        expect(version).to.match(/^20\.\d+\.\d+$/)
        expect(override).to.be.true
    })

    it("should handle specific version", async () => {
        const [version, override] = await node.getNodeVersion("20.18.1")
        expect(version).to.equal("20.18.1")
        expect(override).to.be.true
    })

    it("should throw on invalid major version", async () => {
        try {
            await node.getNodeVersion("99")
            expect.fail("Should have thrown")
        } catch (error) {
            expect(error.message).to.include("No stable version found")
        }
    })
})
