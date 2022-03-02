import Python from "./python"

describe("setup", () => {
    it("works with an override version", () => {
        return new Python().setup("3.10.2")
    })

    it("is harmless if there's no versions", () => {
        return new Python().setup()
    })
})
