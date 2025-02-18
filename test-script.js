import Node from "./node.js"

async function test() {
    const node = new Node()
    try {
        // Test major version
        console.log('Testing major version "20"...')
        const [version20, override20] = await node.getNodeVersion("20")
        console.log(`Resolved version: ${version20}, override: ${override20}`)

        // Test specific version
        console.log('\nTesting specific version "20.18.1"...')
        const [version2018, override2018] = await node.getNodeVersion("20.18.1")
        console.log(
            `Resolved version: ${version2018}, override: ${override2018}`,
        )

        // Test invalid version
        console.log('\nTesting invalid version "99"...')
        try {
            await node.getNodeVersion("99")
        } catch (error) {
            console.log("Got expected error:", error.message)
        }
    } catch (error) {
        console.error("Test failed:", error)
    }
}

test()
