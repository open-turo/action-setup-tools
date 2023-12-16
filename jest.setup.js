import fs from "fs"
import { testCwd } from "./testutil.js"

beforeAll(() => {
    fs.mkdirSync(testCwd)
})

afterAll(() => {
    try {
        fs.rmdirSync(testCwd)
    } catch (ignored) {
        // If the folder doesn't exist it's ok
    }
})
