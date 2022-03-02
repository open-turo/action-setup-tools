import Node from "./node"

describe("setup", () => {
    it("works with an override version", () => {
        return new Node().setup("16.13.2")
    })

    it("is harmless if there's no versions", () => {
        return new Node().setup()
    })
})
