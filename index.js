import core from "@actions/core"

// Import all our tools to register them
import "./golang.js"
import "./java.js"
import "./kotlin.js"
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
        return setupToolsInParallel()
    } else {
        core.info("Running setups sequentially")
        let errs = []
        const errHandler = (err) => {
            core.error(`caught error in setup: ${err}`)
            errs.push(err)
        }
        await setupToolsSequentially(errHandler)
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

function setupToolsInParallel() {
    const setups = Tool.all().map((tool) =>
        // TODO: Once all tools implement findVersion/findCheckVersion calls we
        // can remove core.getInput from here
        tool.setup(core.getInput(tool.name)),
    )
    return Promise.all(setups)
}

//function getDependentToolMap() {
//    let result = {}
//    for (let tool of Tool.all()) {
//        if (typeof tool.dependsOnName === "undefined") {
//            core.debug(`!!! Tool ${tool.name} has no dependencies`)
//        } else {
//            // e.g. key of java, value of kotlin to indicate that java must be setup
//            // before kotlin can be attempted.
//            result[tool.dependsOnName] = tool.name
//        }
//    }
//    return result
//}
//
//function getToolMap() {
//    let result = {}
//    for (let tool of Tool.all()) {
//        result[tool.name] = tool
//    }
//    return result
//}
//
//async function setupToolsInParallel1() {
//    const dependentToolMap = getDependentToolMap()
//    core.debug("Dependent tool map : " + JSON.stringify(dependentToolMap))
//    const toolMap = getToolMap()
//    let result = []
//    let setupPromise = null
//    for (let tool of Tool.all()) {
//        core.debug(`Considering tool ${tool.name} installation in parallel`)
//        let dependentToolName = dependentToolMap[tool.name]
//        core.debug(`Tool ${tool.name} is depended upon by ${dependentToolName}`)
//        if (tool.dependsOnName) {
//            core.debug(
//                `Tool ${tool.name} depends on ${tool.dependsOnName} so skip parallel installation`,
//            )
//            continue
//        }
//        if (dependentToolName) {
//            core.debug(
//                `Must install ${tool.name} dependency before ${dependentToolName}`,
//            )
//            // Here we have found a dependency. We need to install this tool, await for that installation to complete
//            // then kickoff the setup of the dependent tool.
//            let toolVersionInstalled = await tool.setup(
//                core.getInput(tool.name),
//            )
//            if (toolVersionInstalled) {
//                core.debug(
//                    `${tool.name} dependency installed, can now install ${dependentToolName}`,
//                )
//                let dependentTool = toolMap[dependentToolName]
//                setupPromise = dependentTool.setup(
//                    core.getInput(dependentTool.name),
//                )
//            }
//        } else {
//            // No tool dependency here, run setup asynchronously.
//            core.debug(`Install ${tool.name} in parallel`)
//            setupPromise = tool.setup(core.getInput(tool.name))
//        }
//        result.push(setupPromise)
//    }
//
//    return result
//}

async function setupToolsSequentially(errorHandler) {
    let toolSetupStatus = {}
    const tools = Tool.all()
    let numToolsRemainingToBeInstalled = tools.length
    while (numToolsRemainingToBeInstalled > 0) {
        core.debug(
            `Number of tools yet to be installed ${numToolsRemainingToBeInstalled}`,
        )
        for (let tool of tools) {
            core.debug(`Considering tool ${tool.name} for installation`)
            try {
                if (tool.dependsOnName) {
                    core.debug(
                        `Tool ${tool.name} depends on ${tool.dependsOnName}`,
                    )
                    if (
                        typeof toolSetupStatus[tool.dependsOnName] !==
                        "undefined"
                    ) {
                        core.debug(
                            `Tool ${tool.name} setup execution now that dependency ${tool.dependsOnName} has been resolved`,
                        )
                    } else {
                        core.debug(
                            `Tool ${tool.name} setup deferred due to dependency on ${tool.dependsOnName}`,
                        )
                        // Will have to try this tool on the next loop
                        continue
                    }
                }
                let result = await tool
                    .setup(core.getInput(tool.name))
                    .catch(errorHandler)
                toolSetupStatus[tool.name] = result
            } catch (err) {
                toolSetupStatus[tool.name] = err
                errorHandler(err)
            }
            // One less tool remaining to be attempted to be installed
            numToolsRemainingToBeInstalled--
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
