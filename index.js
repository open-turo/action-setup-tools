import core from "@actions/core"
// Import all our tools to register them
import "./golang.js"
import "./java.js"
import "./node.js"
import "./python.js"
import "./terraform.js"

// Get our Tool class registry
import Tool from "./tool.js"

// run executes the main function of the Action
async function run() {
    // Create a list of setup() promises from all the tools
    const setups = Tool.all().map((tool) =>
        tool.setup(core.getInput(tool.name)),
    )
    // Wait for all the setup() promises to resolve
    if (process.env.RUN_ASYNC == "true") {
        return Promise.all(setups)
    } else {
        for (let setup of setups) {
            await setup
        }
    }
}

run().catch((error) => core.setFailed(error.message))
