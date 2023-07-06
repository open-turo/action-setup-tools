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
export default async function run() {
    const runAsync = (process.env.RUN_ASYNC || "true").toLowerCase() != "false"
    // Create a list of setup() promises from all the tools
    // Wait for all the setup() promises to resolve
    if (runAsync) {
        core.info("Running setups in parallel")
        const setups = Tool.all().map(async (tool) => {
            try {
                await tool.setup(core.getInput(tool.name))
            } catch (error) {
                core.error(`caught error in ${tool.name} setup: ${error}`)
                throw error
            }
        })
        return Promise.all(setups)
    } else {
        core.info("Running setups sequentially")
        let errs = []
        const errHandler = (err) => {
            core.error(`caught error in setup: ${err}`)
            errs.push(err)
        }
        for (let tool of Tool.all()) {
            try {
                // For some reason this catch call isn't working the way I expect,
                // but I can't figure it out, so we double down with try/catch
                await tool.setup(core.getInput(tool.name)).catch(errHandler)
            } catch (err) {
                errHandler(err)
            }
        }
        // Escalate errors to make em someone else's problem
        core.debug(`errors caught: ${JSON.stringify(errs)}`)
        if (errs.length == 1) throw errs[0]
        if (errs.length > 1) {
            throw new Error(
                `multiple errors:\n${errs
                    .map((err) => err.message)
                    .join("\n")}`,
            )
        }
    }
}

// runner is a thin wrapper around our main run function so that we can output
// errors before the process exits
export async function runner() {
    return run().catch((error) => {
        core.setFailed(error.message)
        return error.message
    })
}

await (async function main() {
    const runAuto = (process.env.RUN_AUTO || "true").toLowerCase() != "false"
    // Don't invoke the main script if we're being imported
    if (!runAuto) return
    // Run it yay
    await runner()
})()
