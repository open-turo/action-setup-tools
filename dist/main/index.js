import './sourcemap-register.cjs';import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(8974);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 8974:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(1595));

var _v2 = _interopRequireDefault(__nccwpck_require__(6993));

var _v3 = _interopRequireDefault(__nccwpck_require__(1472));

var _v4 = _interopRequireDefault(__nccwpck_require__(6217));

var _nil = _interopRequireDefault(__nccwpck_require__(2381));

var _version = _interopRequireDefault(__nccwpck_require__(427));

var _validate = _interopRequireDefault(__nccwpck_require__(2609));

var _stringify = _interopRequireDefault(__nccwpck_require__(1458));

var _parse = _interopRequireDefault(__nccwpck_require__(6385));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 5842:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 2381:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 6385:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(2609));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 6230:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 9784:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 8844:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 1458:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(2609));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(9784));

var _stringify = _interopRequireDefault(__nccwpck_require__(1458));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6993:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5920));

var _md = _interopRequireDefault(__nccwpck_require__(5842));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5920:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(1458));

var _parse = _interopRequireDefault(__nccwpck_require__(6385));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 1472:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(9784));

var _stringify = _interopRequireDefault(__nccwpck_require__(1458));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 6217:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5920));

var _sha = _interopRequireDefault(__nccwpck_require__(8844));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 2609:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(6230));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 427:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(2609));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 1514:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExecOutput = exports.exec = void 0;
const string_decoder_1 = __nccwpck_require__(1576);
const tr = __importStar(__nccwpck_require__(8159));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 8159:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.argStringToArray = exports.ToolRunner = void 0;
const os = __importStar(__nccwpck_require__(2037));
const events = __importStar(__nccwpck_require__(2361));
const child = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const io = __importStar(__nccwpck_require__(7436));
const ioUtil = __importStar(__nccwpck_require__(1962));
const timers_1 = __nccwpck_require__(9512);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 1962:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.READONLY = exports.UV_FS_O_EXLOCK = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rm = exports.rename = exports.readlink = exports.readdir = exports.open = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
const fs = __importStar(__nccwpck_require__(7147));
const path = __importStar(__nccwpck_require__(1017));
_a = fs.promises
// export const {open} = 'fs'
, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.open = _a.open, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rm = _a.rm, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
// export const {open} = 'fs'
exports.IS_WINDOWS = process.platform === 'win32';
// See https://github.com/nodejs/node/blob/d0153aee367422d0858105abec186da4dff0a0c5/deps/uv/include/uv/win.h#L691
exports.UV_FS_O_EXLOCK = 0x10000000;
exports.READONLY = fs.constants.O_RDONLY;
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 7436:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
const assert_1 = __nccwpck_require__(9491);
const path = __importStar(__nccwpck_require__(1017));
const ioUtil = __importStar(__nccwpck_require__(1962));
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
        }
        try {
            // note if path does not exist, error is silent
            yield ioUtil.rm(inputPath, {
                force: true,
                maxRetries: 3,
                recursive: true,
                retryDelay: 300
            });
        }
        catch (err) {
            throw new Error(`File was unable to be removed ${err}`);
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 2473:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._readLinuxVersionFile = exports._getOsVersion = exports._findMatch = void 0;
const semver = __importStar(__nccwpck_require__(562));
const core_1 = __nccwpck_require__(2186);
// needs to be require for core node modules to be mocked
/* eslint @typescript-eslint/no-require-imports: 0 */
const os = __nccwpck_require__(2037);
const cp = __nccwpck_require__(2081);
const fs = __nccwpck_require__(7147);
function _findMatch(versionSpec, stable, candidates, archFilter) {
    return __awaiter(this, void 0, void 0, function* () {
        const platFilter = os.platform();
        let result;
        let match;
        let file;
        for (const candidate of candidates) {
            const version = candidate.version;
            core_1.debug(`check ${version} satisfies ${versionSpec}`);
            if (semver.satisfies(version, versionSpec) &&
                (!stable || candidate.stable === stable)) {
                file = candidate.files.find(item => {
                    core_1.debug(`${item.arch}===${archFilter} && ${item.platform}===${platFilter}`);
                    let chk = item.arch === archFilter && item.platform === platFilter;
                    if (chk && item.platform_version) {
                        const osVersion = module.exports._getOsVersion();
                        if (osVersion === item.platform_version) {
                            chk = true;
                        }
                        else {
                            chk = semver.satisfies(osVersion, item.platform_version);
                        }
                    }
                    return chk;
                });
                if (file) {
                    core_1.debug(`matched ${candidate.version}`);
                    match = candidate;
                    break;
                }
            }
        }
        if (match && file) {
            // clone since we're mutating the file list to be only the file that matches
            result = Object.assign({}, match);
            result.files = [file];
        }
        return result;
    });
}
exports._findMatch = _findMatch;
function _getOsVersion() {
    // TODO: add windows and other linux, arm variants
    // right now filtering on version is only an ubuntu and macos scenario for tools we build for hosted (python)
    const plat = os.platform();
    let version = '';
    if (plat === 'darwin') {
        version = cp.execSync('sw_vers -productVersion').toString();
    }
    else if (plat === 'linux') {
        // lsb_release process not in some containers, readfile
        // Run cat /etc/lsb-release
        // DISTRIB_ID=Ubuntu
        // DISTRIB_RELEASE=18.04
        // DISTRIB_CODENAME=bionic
        // DISTRIB_DESCRIPTION="Ubuntu 18.04.4 LTS"
        const lsbContents = module.exports._readLinuxVersionFile();
        if (lsbContents) {
            const lines = lsbContents.split('\n');
            for (const line of lines) {
                const parts = line.split('=');
                if (parts.length === 2 &&
                    (parts[0].trim() === 'VERSION_ID' ||
                        parts[0].trim() === 'DISTRIB_RELEASE')) {
                    version = parts[1]
                        .trim()
                        .replace(/^"/, '')
                        .replace(/"$/, '');
                    break;
                }
            }
        }
    }
    return version;
}
exports._getOsVersion = _getOsVersion;
function _readLinuxVersionFile() {
    const lsbReleaseFile = '/etc/lsb-release';
    const osReleaseFile = '/etc/os-release';
    let contents = '';
    if (fs.existsSync(lsbReleaseFile)) {
        contents = fs.readFileSync(lsbReleaseFile).toString();
    }
    else if (fs.existsSync(osReleaseFile)) {
        contents = fs.readFileSync(osReleaseFile).toString();
    }
    return contents;
}
exports._readLinuxVersionFile = _readLinuxVersionFile;
//# sourceMappingURL=manifest.js.map

/***/ }),

/***/ 8279:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RetryHelper = void 0;
const core = __importStar(__nccwpck_require__(2186));
/**
 * Internal class for retries
 */
class RetryHelper {
    constructor(maxAttempts, minSeconds, maxSeconds) {
        if (maxAttempts < 1) {
            throw new Error('max attempts should be greater than or equal to 1');
        }
        this.maxAttempts = maxAttempts;
        this.minSeconds = Math.floor(minSeconds);
        this.maxSeconds = Math.floor(maxSeconds);
        if (this.minSeconds > this.maxSeconds) {
            throw new Error('min seconds should be less than or equal to max seconds');
        }
    }
    execute(action, isRetryable) {
        return __awaiter(this, void 0, void 0, function* () {
            let attempt = 1;
            while (attempt < this.maxAttempts) {
                // Try
                try {
                    return yield action();
                }
                catch (err) {
                    if (isRetryable && !isRetryable(err)) {
                        throw err;
                    }
                    core.info(err.message);
                }
                // Sleep
                const seconds = this.getSleepAmount();
                core.info(`Waiting ${seconds} seconds before trying again`);
                yield this.sleep(seconds);
                attempt++;
            }
            // Last attempt
            return yield action();
        });
    }
    getSleepAmount() {
        return (Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) +
            this.minSeconds);
    }
    sleep(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, seconds * 1000));
        });
    }
}
exports.RetryHelper = RetryHelper;
//# sourceMappingURL=retry-helper.js.map

/***/ }),

/***/ 7784:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateVersions = exports.isExplicitVersion = exports.findFromManifest = exports.getManifestFromRepo = exports.findAllVersions = exports.find = exports.cacheFile = exports.cacheDir = exports.extractZip = exports.extractXar = exports.extractTar = exports.extract7z = exports.downloadTool = exports.HTTPError = void 0;
const core = __importStar(__nccwpck_require__(2186));
const io = __importStar(__nccwpck_require__(7436));
const fs = __importStar(__nccwpck_require__(7147));
const mm = __importStar(__nccwpck_require__(2473));
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const httpm = __importStar(__nccwpck_require__(6255));
const semver = __importStar(__nccwpck_require__(562));
const stream = __importStar(__nccwpck_require__(2781));
const util = __importStar(__nccwpck_require__(3837));
const assert_1 = __nccwpck_require__(9491);
const v4_1 = __importDefault(__nccwpck_require__(824));
const exec_1 = __nccwpck_require__(1514);
const retry_helper_1 = __nccwpck_require__(8279);
class HTTPError extends Error {
    constructor(httpStatusCode) {
        super(`Unexpected HTTP response: ${httpStatusCode}`);
        this.httpStatusCode = httpStatusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.HTTPError = HTTPError;
const IS_WINDOWS = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';
const userAgent = 'actions/tool-cache';
/**
 * Download a tool from an url and stream it into a file
 *
 * @param url       url of tool to download
 * @param dest      path to download tool
 * @param auth      authorization header
 * @param headers   other headers
 * @returns         path to downloaded tool
 */
function downloadTool(url, dest, auth, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        dest = dest || path.join(_getTempDirectory(), v4_1.default());
        yield io.mkdirP(path.dirname(dest));
        core.debug(`Downloading ${url}`);
        core.debug(`Destination ${dest}`);
        const maxAttempts = 3;
        const minSeconds = _getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS', 10);
        const maxSeconds = _getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS', 20);
        const retryHelper = new retry_helper_1.RetryHelper(maxAttempts, minSeconds, maxSeconds);
        return yield retryHelper.execute(() => __awaiter(this, void 0, void 0, function* () {
            return yield downloadToolAttempt(url, dest || '', auth, headers);
        }), (err) => {
            if (err instanceof HTTPError && err.httpStatusCode) {
                // Don't retry anything less than 500, except 408 Request Timeout and 429 Too Many Requests
                if (err.httpStatusCode < 500 &&
                    err.httpStatusCode !== 408 &&
                    err.httpStatusCode !== 429) {
                    return false;
                }
            }
            // Otherwise retry
            return true;
        });
    });
}
exports.downloadTool = downloadTool;
function downloadToolAttempt(url, dest, auth, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync(dest)) {
            throw new Error(`Destination file path ${dest} already exists`);
        }
        // Get the response headers
        const http = new httpm.HttpClient(userAgent, [], {
            allowRetries: false
        });
        if (auth) {
            core.debug('set auth');
            if (headers === undefined) {
                headers = {};
            }
            headers.authorization = auth;
        }
        const response = yield http.get(url, headers);
        if (response.message.statusCode !== 200) {
            const err = new HTTPError(response.message.statusCode);
            core.debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
            throw err;
        }
        // Download the response body
        const pipeline = util.promisify(stream.pipeline);
        const responseMessageFactory = _getGlobal('TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY', () => response.message);
        const readStream = responseMessageFactory();
        let succeeded = false;
        try {
            yield pipeline(readStream, fs.createWriteStream(dest));
            core.debug('download complete');
            succeeded = true;
            return dest;
        }
        finally {
            // Error, delete dest before retry
            if (!succeeded) {
                core.debug('download failed');
                try {
                    yield io.rmRF(dest);
                }
                catch (err) {
                    core.debug(`Failed to delete '${dest}'. ${err.message}`);
                }
            }
        }
    });
}
/**
 * Extract a .7z file
 *
 * @param file     path to the .7z file
 * @param dest     destination directory. Optional.
 * @param _7zPath  path to 7zr.exe. Optional, for long path support. Most .7z archives do not have this
 * problem. If your .7z archive contains very long paths, you can pass the path to 7zr.exe which will
 * gracefully handle long paths. By default 7zdec.exe is used because it is a very small program and is
 * bundled with the tool lib. However it does not support long paths. 7zr.exe is the reduced command line
 * interface, it is smaller than the full command line interface, and it does support long paths. At the
 * time of this writing, it is freely available from the LZMA SDK that is available on the 7zip website.
 * Be sure to check the current license agreement. If 7zr.exe is bundled with your action, then the path
 * to 7zr.exe can be pass to this function.
 * @returns        path to the destination directory
 */
function extract7z(file, dest, _7zPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_WINDOWS, 'extract7z() not supported on current OS');
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        const originalCwd = process.cwd();
        process.chdir(dest);
        if (_7zPath) {
            try {
                const logLevel = core.isDebug() ? '-bb1' : '-bb0';
                const args = [
                    'x',
                    logLevel,
                    '-bd',
                    '-sccUTF-8',
                    file
                ];
                const options = {
                    silent: true
                };
                yield exec_1.exec(`"${_7zPath}"`, args, options);
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        else {
            const escapedScript = path
                .join(__dirname, '..', 'scripts', 'Invoke-7zdec.ps1')
                .replace(/'/g, "''")
                .replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
            const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, '');
            const escapedTarget = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
            const command = `& '${escapedScript}' -Source '${escapedFile}' -Target '${escapedTarget}'`;
            const args = [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                command
            ];
            const options = {
                silent: true
            };
            try {
                const powershellPath = yield io.which('powershell', true);
                yield exec_1.exec(`"${powershellPath}"`, args, options);
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        return dest;
    });
}
exports.extract7z = extract7z;
/**
 * Extract a compressed tar archive
 *
 * @param file     path to the tar
 * @param dest     destination directory. Optional.
 * @param flags    flags for the tar command to use for extraction. Defaults to 'xz' (extracting gzipped tars). Optional.
 * @returns        path to the destination directory
 */
function extractTar(file, dest, flags = 'xz') {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new Error("parameter 'file' is required");
        }
        // Create dest
        dest = yield _createExtractFolder(dest);
        // Determine whether GNU tar
        core.debug('Checking tar --version');
        let versionOutput = '';
        yield exec_1.exec('tar --version', [], {
            ignoreReturnCode: true,
            silent: true,
            listeners: {
                stdout: (data) => (versionOutput += data.toString()),
                stderr: (data) => (versionOutput += data.toString())
            }
        });
        core.debug(versionOutput.trim());
        const isGnuTar = versionOutput.toUpperCase().includes('GNU TAR');
        // Initialize args
        let args;
        if (flags instanceof Array) {
            args = flags;
        }
        else {
            args = [flags];
        }
        if (core.isDebug() && !flags.includes('v')) {
            args.push('-v');
        }
        let destArg = dest;
        let fileArg = file;
        if (IS_WINDOWS && isGnuTar) {
            args.push('--force-local');
            destArg = dest.replace(/\\/g, '/');
            // Technically only the dest needs to have `/` but for aesthetic consistency
            // convert slashes in the file arg too.
            fileArg = file.replace(/\\/g, '/');
        }
        if (isGnuTar) {
            // Suppress warnings when using GNU tar to extract archives created by BSD tar
            args.push('--warning=no-unknown-keyword');
            args.push('--overwrite');
        }
        args.push('-C', destArg, '-f', fileArg);
        yield exec_1.exec(`tar`, args);
        return dest;
    });
}
exports.extractTar = extractTar;
/**
 * Extract a xar compatible archive
 *
 * @param file     path to the archive
 * @param dest     destination directory. Optional.
 * @param flags    flags for the xar. Optional.
 * @returns        path to the destination directory
 */
function extractXar(file, dest, flags = []) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_MAC, 'extractXar() not supported on current OS');
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        let args;
        if (flags instanceof Array) {
            args = flags;
        }
        else {
            args = [flags];
        }
        args.push('-x', '-C', dest, '-f', file);
        if (core.isDebug()) {
            args.push('-v');
        }
        const xarPath = yield io.which('xar', true);
        yield exec_1.exec(`"${xarPath}"`, _unique(args));
        return dest;
    });
}
exports.extractXar = extractXar;
/**
 * Extract a zip
 *
 * @param file     path to the zip
 * @param dest     destination directory. Optional.
 * @returns        path to the destination directory
 */
function extractZip(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new Error("parameter 'file' is required");
        }
        dest = yield _createExtractFolder(dest);
        if (IS_WINDOWS) {
            yield extractZipWin(file, dest);
        }
        else {
            yield extractZipNix(file, dest);
        }
        return dest;
    });
}
exports.extractZip = extractZip;
function extractZipWin(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        // build the powershell command
        const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
        const escapedDest = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
        const pwshPath = yield io.which('pwsh', false);
        //To match the file overwrite behavior on nix systems, we use the overwrite = true flag for ExtractToDirectory
        //and the -Force flag for Expand-Archive as a fallback
        if (pwshPath) {
            //attempt to use pwsh with ExtractToDirectory, if this fails attempt Expand-Archive
            const pwshCommand = [
                `$ErrorActionPreference = 'Stop' ;`,
                `try { Add-Type -AssemblyName System.IO.Compression.ZipFile } catch { } ;`,
                `try { [System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`,
                `catch { if (($_.Exception.GetType().FullName -eq 'System.Management.Automation.MethodException') -or ($_.Exception.GetType().FullName -eq 'System.Management.Automation.RuntimeException') ){ Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force } else { throw $_ } } ;`
            ].join(' ');
            const args = [
                '-NoLogo',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                pwshCommand
            ];
            core.debug(`Using pwsh at path: ${pwshPath}`);
            yield exec_1.exec(`"${pwshPath}"`, args);
        }
        else {
            const powershellCommand = [
                `$ErrorActionPreference = 'Stop' ;`,
                `try { Add-Type -AssemblyName System.IO.Compression.FileSystem } catch { } ;`,
                `if ((Get-Command -Name Expand-Archive -Module Microsoft.PowerShell.Archive -ErrorAction Ignore)) { Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force }`,
                `else {[System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`
            ].join(' ');
            const args = [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                powershellCommand
            ];
            const powershellPath = yield io.which('powershell', true);
            core.debug(`Using powershell at path: ${powershellPath}`);
            yield exec_1.exec(`"${powershellPath}"`, args);
        }
    });
}
function extractZipNix(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        const unzipPath = yield io.which('unzip', true);
        const args = [file];
        if (!core.isDebug()) {
            args.unshift('-q');
        }
        args.unshift('-o'); //overwrite with -o, otherwise a prompt is shown which freezes the run
        yield exec_1.exec(`"${unzipPath}"`, args, { cwd: dest });
    });
}
/**
 * Caches a directory and installs it into the tool cacheDir
 *
 * @param sourceDir    the directory to cache into tools
 * @param tool          tool name
 * @param version       version of the tool.  semver format
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */
function cacheDir(sourceDir, tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        version = semver.clean(version) || version;
        arch = arch || os.arch();
        core.debug(`Caching tool ${tool} ${version} ${arch}`);
        core.debug(`source dir: ${sourceDir}`);
        if (!fs.statSync(sourceDir).isDirectory()) {
            throw new Error('sourceDir is not a directory');
        }
        // Create the tool dir
        const destPath = yield _createToolPath(tool, version, arch);
        // copy each child item. do not move. move can fail on Windows
        // due to anti-virus software having an open handle on a file.
        for (const itemName of fs.readdirSync(sourceDir)) {
            const s = path.join(sourceDir, itemName);
            yield io.cp(s, destPath, { recursive: true });
        }
        // write .complete
        _completeToolPath(tool, version, arch);
        return destPath;
    });
}
exports.cacheDir = cacheDir;
/**
 * Caches a downloaded file (GUID) and installs it
 * into the tool cache with a given targetName
 *
 * @param sourceFile    the file to cache into tools.  Typically a result of downloadTool which is a guid.
 * @param targetFile    the name of the file name in the tools directory
 * @param tool          tool name
 * @param version       version of the tool.  semver format
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */
function cacheFile(sourceFile, targetFile, tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        version = semver.clean(version) || version;
        arch = arch || os.arch();
        core.debug(`Caching tool ${tool} ${version} ${arch}`);
        core.debug(`source file: ${sourceFile}`);
        if (!fs.statSync(sourceFile).isFile()) {
            throw new Error('sourceFile is not a file');
        }
        // create the tool dir
        const destFolder = yield _createToolPath(tool, version, arch);
        // copy instead of move. move can fail on Windows due to
        // anti-virus software having an open handle on a file.
        const destPath = path.join(destFolder, targetFile);
        core.debug(`destination file ${destPath}`);
        yield io.cp(sourceFile, destPath);
        // write .complete
        _completeToolPath(tool, version, arch);
        return destFolder;
    });
}
exports.cacheFile = cacheFile;
/**
 * Finds the path to a tool version in the local installed tool cache
 *
 * @param toolName      name of the tool
 * @param versionSpec   version of the tool
 * @param arch          optional arch.  defaults to arch of computer
 */
function find(toolName, versionSpec, arch) {
    if (!toolName) {
        throw new Error('toolName parameter is required');
    }
    if (!versionSpec) {
        throw new Error('versionSpec parameter is required');
    }
    arch = arch || os.arch();
    // attempt to resolve an explicit version
    if (!isExplicitVersion(versionSpec)) {
        const localVersions = findAllVersions(toolName, arch);
        const match = evaluateVersions(localVersions, versionSpec);
        versionSpec = match;
    }
    // check for the explicit version in the cache
    let toolPath = '';
    if (versionSpec) {
        versionSpec = semver.clean(versionSpec) || '';
        const cachePath = path.join(_getCacheDirectory(), toolName, versionSpec, arch);
        core.debug(`checking cache: ${cachePath}`);
        if (fs.existsSync(cachePath) && fs.existsSync(`${cachePath}.complete`)) {
            core.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
            toolPath = cachePath;
        }
        else {
            core.debug('not found');
        }
    }
    return toolPath;
}
exports.find = find;
/**
 * Finds the paths to all versions of a tool that are installed in the local tool cache
 *
 * @param toolName  name of the tool
 * @param arch      optional arch.  defaults to arch of computer
 */
function findAllVersions(toolName, arch) {
    const versions = [];
    arch = arch || os.arch();
    const toolPath = path.join(_getCacheDirectory(), toolName);
    if (fs.existsSync(toolPath)) {
        const children = fs.readdirSync(toolPath);
        for (const child of children) {
            if (isExplicitVersion(child)) {
                const fullPath = path.join(toolPath, child, arch || '');
                if (fs.existsSync(fullPath) && fs.existsSync(`${fullPath}.complete`)) {
                    versions.push(child);
                }
            }
        }
    }
    return versions;
}
exports.findAllVersions = findAllVersions;
function getManifestFromRepo(owner, repo, auth, branch = 'master') {
    return __awaiter(this, void 0, void 0, function* () {
        let releases = [];
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`;
        const http = new httpm.HttpClient('tool-cache');
        const headers = {};
        if (auth) {
            core.debug('set auth');
            headers.authorization = auth;
        }
        const response = yield http.getJson(treeUrl, headers);
        if (!response.result) {
            return releases;
        }
        let manifestUrl = '';
        for (const item of response.result.tree) {
            if (item.path === 'versions-manifest.json') {
                manifestUrl = item.url;
                break;
            }
        }
        headers['accept'] = 'application/vnd.github.VERSION.raw';
        let versionsRaw = yield (yield http.get(manifestUrl, headers)).readBody();
        if (versionsRaw) {
            // shouldn't be needed but protects against invalid json saved with BOM
            versionsRaw = versionsRaw.replace(/^\uFEFF/, '');
            try {
                releases = JSON.parse(versionsRaw);
            }
            catch (_a) {
                core.debug('Invalid json');
            }
        }
        return releases;
    });
}
exports.getManifestFromRepo = getManifestFromRepo;
function findFromManifest(versionSpec, stable, manifest, archFilter = os.arch()) {
    return __awaiter(this, void 0, void 0, function* () {
        // wrap the internal impl
        const match = yield mm._findMatch(versionSpec, stable, manifest, archFilter);
        return match;
    });
}
exports.findFromManifest = findFromManifest;
function _createExtractFolder(dest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dest) {
            // create a temp dir
            dest = path.join(_getTempDirectory(), v4_1.default());
        }
        yield io.mkdirP(dest);
        return dest;
    });
}
function _createToolPath(tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || '');
        core.debug(`destination ${folderPath}`);
        const markerPath = `${folderPath}.complete`;
        yield io.rmRF(folderPath);
        yield io.rmRF(markerPath);
        yield io.mkdirP(folderPath);
        return folderPath;
    });
}
function _completeToolPath(tool, version, arch) {
    const folderPath = path.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || '');
    const markerPath = `${folderPath}.complete`;
    fs.writeFileSync(markerPath, '');
    core.debug('finished caching tool');
}
/**
 * Check if version string is explicit
 *
 * @param versionSpec      version string to check
 */
function isExplicitVersion(versionSpec) {
    const c = semver.clean(versionSpec) || '';
    core.debug(`isExplicit: ${c}`);
    const valid = semver.valid(c) != null;
    core.debug(`explicit? ${valid}`);
    return valid;
}
exports.isExplicitVersion = isExplicitVersion;
/**
 * Get the highest satisfiying semantic version in `versions` which satisfies `versionSpec`
 *
 * @param versions        array of versions to evaluate
 * @param versionSpec     semantic version spec to satisfy
 */
function evaluateVersions(versions, versionSpec) {
    let version = '';
    core.debug(`evaluating ${versions.length} versions`);
    versions = versions.sort((a, b) => {
        if (semver.gt(a, b)) {
            return 1;
        }
        return -1;
    });
    for (let i = versions.length - 1; i >= 0; i--) {
        const potential = versions[i];
        const satisfied = semver.satisfies(potential, versionSpec);
        if (satisfied) {
            version = potential;
            break;
        }
    }
    if (version) {
        core.debug(`matched: ${version}`);
    }
    else {
        core.debug('match not found');
    }
    return version;
}
exports.evaluateVersions = evaluateVersions;
/**
 * Gets RUNNER_TOOL_CACHE
 */
function _getCacheDirectory() {
    const cacheDirectory = process.env['RUNNER_TOOL_CACHE'] || '';
    assert_1.ok(cacheDirectory, 'Expected RUNNER_TOOL_CACHE to be defined');
    return cacheDirectory;
}
/**
 * Gets RUNNER_TEMP
 */
function _getTempDirectory() {
    const tempDirectory = process.env['RUNNER_TEMP'] || '';
    assert_1.ok(tempDirectory, 'Expected RUNNER_TEMP to be defined');
    return tempDirectory;
}
/**
 * Gets a global variable
 */
function _getGlobal(key, defaultValue) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const value = global[key];
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return value !== undefined ? value : defaultValue;
}
/**
 * Returns an array of unique values.
 * @param values Values to make unique.
 */
function _unique(values) {
    return Array.from(new Set(values));
}
//# sourceMappingURL=tool-cache.js.map

/***/ }),

/***/ 562:
/***/ ((module, exports) => {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var t = exports.tokens = {}
var R = 0

function tok (n) {
  t[n] = R++
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

tok('NUMERICIDENTIFIER')
src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*'
tok('NUMERICIDENTIFIERLOOSE')
src[t.NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

tok('NONNUMERICIDENTIFIER')
src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

tok('MAINVERSION')
src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')'

tok('MAINVERSIONLOOSE')
src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

tok('PRERELEASEIDENTIFIER')
src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] +
                            '|' + src[t.NONNUMERICIDENTIFIER] + ')'

tok('PRERELEASEIDENTIFIERLOOSE')
src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[t.NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

tok('PRERELEASE')
src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))'

tok('PRERELEASELOOSE')
src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

tok('BUILDIDENTIFIER')
src[t.BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

tok('BUILD')
src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] +
             '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

tok('FULL')
tok('FULLPLAIN')
src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] +
                  src[t.PRERELEASE] + '?' +
                  src[t.BUILD] + '?'

src[t.FULL] = '^' + src[t.FULLPLAIN] + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
tok('LOOSEPLAIN')
src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] +
                  src[t.PRERELEASELOOSE] + '?' +
                  src[t.BUILD] + '?'

tok('LOOSE')
src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$'

tok('GTLT')
src[t.GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
tok('XRANGEIDENTIFIERLOOSE')
src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
tok('XRANGEIDENTIFIER')
src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*'

tok('XRANGEPLAIN')
src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[t.PRERELEASE] + ')?' +
                   src[t.BUILD] + '?' +
                   ')?)?'

tok('XRANGEPLAINLOOSE')
src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[t.PRERELEASELOOSE] + ')?' +
                        src[t.BUILD] + '?' +
                        ')?)?'

tok('XRANGE')
src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$'
tok('XRANGELOOSE')
src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
tok('COERCE')
src[t.COERCE] = '(^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'
tok('COERCERTL')
re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g')

// Tilde ranges.
// Meaning is "reasonably at or greater than"
tok('LONETILDE')
src[t.LONETILDE] = '(?:~>?)'

tok('TILDETRIM')
src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+'
re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

tok('TILDE')
src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$'
tok('TILDELOOSE')
src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
tok('LONECARET')
src[t.LONECARET] = '(?:\\^)'

tok('CARETTRIM')
src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+'
re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g')
var caretTrimReplace = '$1^'

tok('CARET')
src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$'
tok('CARETLOOSE')
src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
tok('COMPARATORLOOSE')
src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$'
tok('COMPARATOR')
src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
tok('COMPARATORTRIM')
src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] +
                      '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
tok('HYPHENRANGE')
src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s*$'

tok('HYPHENRANGELOOSE')
src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
tok('STAR')
src[t.STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

SemVer.prototype.compareBuild = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  var i = 0
  do {
    var a = this.build[i]
    var b = other.build[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.compareBuild = compareBuild
function compareBuild (a, b, loose) {
  var versionA = new SemVer(a, loose)
  var versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(b, a, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1] !== undefined ? m[1] : ''
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY || version === ANY) {
    return true
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    if (this.value === '') {
      return true
    }
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    if (comp.value === '') {
      return true
    }
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[t.COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[t.CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return (
      isSatisfiable(thisComparators, options) &&
      range.set.some(function (rangeComparators) {
        return (
          isSatisfiable(rangeComparators, options) &&
          thisComparators.every(function (thisComparator) {
            return rangeComparators.every(function (rangeComparator) {
              return thisComparator.intersects(rangeComparator, options)
            })
          })
        )
      })
    )
  })
}

// take a set of comparators and determine whether there
// exists a version which can satisfy it
function isSatisfiable (comparators, options) {
  var result = true
  var remainingComparators = comparators.slice()
  var testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every(function (otherComparator) {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p + pr
    } else if (xm) {
      ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0' + pr +
        ' <' + M + '.' + (+m + 1) + '.0' + pr
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version, options) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  var match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    var next
    while ((next = re[t.COERCERTL].exec(version)) &&
      (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
          next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(match[2] +
    '.' + (match[3] || '0') +
    '.' + (match[4] || '0'), options)
}


/***/ }),

/***/ 7129:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



// A linked list to keep track of recently-used-ness
const Yallist = __nccwpck_require__(665)

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ 1532:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    comp = comp.trim().split(/\s+/).join(' ')
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    options = parseOptions(options)

    // Special cases where nothing can possibly be lower
    if (options.includePrerelease &&
      (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
      return false
    }
    if (!options.includePrerelease &&
      (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
      return false
    }

    // Same direction increasing (> or >=)
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }
    // Same direction decreasing (< or <=)
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }
    // same SemVer and both sides are inclusive (<= or >=)
    if (
      (this.semver.version === comp.semver.version) &&
      this.operator.includes('=') && comp.operator.includes('=')) {
      return true
    }
    // opposite directions less than
    if (cmp(this.semver, '<', comp.semver, options) &&
      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
      return true
    }
    // opposite directions greater than
    if (cmp(this.semver, '>', comp.semver, options) &&
      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
      return true
    }
    return false
  }
}

module.exports = Comparator

const parseOptions = __nccwpck_require__(785)
const { safeRe: re, t } = __nccwpck_require__(9523)
const cmp = __nccwpck_require__(5098)
const debug = __nccwpck_require__(106)
const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)


/***/ }),

/***/ 9828:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First reduce all whitespace as much as possible so we do not have to rely
    // on potentially slow regexes like \s*. This is then stored and used for
    // future error messages as well.
    this.raw = range
      .trim()
      .split(/\s+/)
      .join(' ')

    // First, split on ||
    this.set = this.raw
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${this.raw}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => comps.join(' ').trim())
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts =
      (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
      (this.options.loose && FLAG_LOOSE)
    const memoKey = memoOpts + ':' + range
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)

    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)
    debug('tilde trim', range)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)
    debug('caret trim', range)

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}

module.exports = Range

const LRU = __nccwpck_require__(7129)
const cache = new LRU({ max: 1000 })

const parseOptions = __nccwpck_require__(785)
const Comparator = __nccwpck_require__(1532)
const debug = __nccwpck_require__(106)
const SemVer = __nccwpck_require__(8088)
const {
  safeRe: re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __nccwpck_require__(9523)
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __nccwpck_require__(2293)

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceTilde(c, options))
    .join(' ')
}

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceCaret(c, options))
    .join(' ')
}

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp
    .split(/\s+/)
    .map((c) => replaceXRange(c, options))
    .join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp
    .trim()
    .replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp
    .trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return `${from} ${to}`.trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),

/***/ 8088:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const debug = __nccwpck_require__(106)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __nccwpck_require__(2293)
const { safeRe: re, t } = __nccwpck_require__(9523)

const parseOptions = __nccwpck_require__(785)
const { compareIdentifiers } = __nccwpck_require__(2463)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier, identifierBase) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier, identifierBase)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier, identifierBase)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier, identifierBase)
        this.inc('pre', identifier, identifierBase)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier, identifierBase)
        }
        this.inc('pre', identifier, identifierBase)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre': {
        const base = Number(identifierBase) ? 1 : 0

        if (!identifier && identifierBase === false) {
          throw new Error('invalid increment argument: identifier is empty')
        }

        if (this.prerelease.length === 0) {
          this.prerelease = [base]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            if (identifier === this.prerelease.join('.') && identifierBase === false) {
              throw new Error('invalid increment argument: identifier already exists')
            }
            this.prerelease.push(base)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          let prerelease = [identifier, base]
          if (identifierBase === false) {
            prerelease = [identifier]
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease
            }
          } else {
            this.prerelease = prerelease
          }
        }
        break
      }
      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.raw = this.format()
    if (this.build.length) {
      this.raw += `+${this.build.join('.')}`
    }
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ 8848:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),

/***/ 5098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const eq = __nccwpck_require__(1898)
const neq = __nccwpck_require__(6017)
const gt = __nccwpck_require__(4123)
const gte = __nccwpck_require__(5522)
const lt = __nccwpck_require__(194)
const lte = __nccwpck_require__(7520)

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),

/***/ 3466:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const parse = __nccwpck_require__(5925)
const { safeRe: re, t } = __nccwpck_require__(9523)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),

/***/ 2156:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),

/***/ 2804:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),

/***/ 4309:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 4297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)

const diff = (version1, version2) => {
  const v1 = parse(version1, null, true)
  const v2 = parse(version2, null, true)
  const comparison = v1.compare(v2)

  if (comparison === 0) {
    return null
  }

  const v1Higher = comparison > 0
  const highVersion = v1Higher ? v1 : v2
  const lowVersion = v1Higher ? v2 : v1
  const highHasPre = !!highVersion.prerelease.length
  const lowHasPre = !!lowVersion.prerelease.length

  if (lowHasPre && !highHasPre) {
    // Going from prerelease -> no prerelease requires some special casing

    // If the low version has only a major, then it will always be a major
    // Some examples:
    // 1.0.0-1 -> 1.0.0
    // 1.0.0-1 -> 1.1.1
    // 1.0.0-1 -> 2.0.0
    if (!lowVersion.patch && !lowVersion.minor) {
      return 'major'
    }

    // Otherwise it can be determined by checking the high version

    if (highVersion.patch) {
      // anything higher than a patch bump would result in the wrong version
      return 'patch'
    }

    if (highVersion.minor) {
      // anything higher than a minor bump would result in the wrong version
      return 'minor'
    }

    // bumping major/minor/patch all have same result
    return 'major'
  }

  // add the `pre` prefix if we are going to a prerelease version
  const prefix = highHasPre ? 'pre' : ''

  if (v1.major !== v2.major) {
    return prefix + 'major'
  }

  if (v1.minor !== v2.minor) {
    return prefix + 'minor'
  }

  if (v1.patch !== v2.patch) {
    return prefix + 'patch'
  }

  // high and low are preleases
  return 'prerelease'
}

module.exports = diff


/***/ }),

/***/ 1898:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ 4123:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 5522:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 900:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)

const inc = (version, release, options, identifier, identifierBase) => {
  if (typeof (options) === 'string') {
    identifierBase = identifier
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    ).inc(release, identifier, identifierBase).version
  } catch (er) {
    return null
  }
}
module.exports = inc


/***/ }),

/***/ 194:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ 7520:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ 6688:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),

/***/ 8447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),

/***/ 6017:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ 5925:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const parse = (version, options, throwErrors = false) => {
  if (version instanceof SemVer) {
    return version
  }
  try {
    return new SemVer(version, options)
  } catch (er) {
    if (!throwErrors) {
      return null
    }
    throw er
  }
}

module.exports = parse


/***/ }),

/***/ 2866:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),

/***/ 4016:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),

/***/ 6417:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),

/***/ 8701:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(2156)
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),

/***/ 6055:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),

/***/ 1426:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(2156)
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),

/***/ 9601:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),

/***/ 1383:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// just pre-load all the stuff that index.js lazily exports
const internalRe = __nccwpck_require__(9523)
const constants = __nccwpck_require__(2293)
const SemVer = __nccwpck_require__(8088)
const identifiers = __nccwpck_require__(2463)
const parse = __nccwpck_require__(5925)
const valid = __nccwpck_require__(9601)
const clean = __nccwpck_require__(8848)
const inc = __nccwpck_require__(900)
const diff = __nccwpck_require__(4297)
const major = __nccwpck_require__(6688)
const minor = __nccwpck_require__(8447)
const patch = __nccwpck_require__(2866)
const prerelease = __nccwpck_require__(4016)
const compare = __nccwpck_require__(4309)
const rcompare = __nccwpck_require__(6417)
const compareLoose = __nccwpck_require__(2804)
const compareBuild = __nccwpck_require__(2156)
const sort = __nccwpck_require__(1426)
const rsort = __nccwpck_require__(8701)
const gt = __nccwpck_require__(4123)
const lt = __nccwpck_require__(194)
const eq = __nccwpck_require__(1898)
const neq = __nccwpck_require__(6017)
const gte = __nccwpck_require__(5522)
const lte = __nccwpck_require__(7520)
const cmp = __nccwpck_require__(5098)
const coerce = __nccwpck_require__(3466)
const Comparator = __nccwpck_require__(1532)
const Range = __nccwpck_require__(9828)
const satisfies = __nccwpck_require__(6055)
const toComparators = __nccwpck_require__(2706)
const maxSatisfying = __nccwpck_require__(579)
const minSatisfying = __nccwpck_require__(832)
const minVersion = __nccwpck_require__(4179)
const validRange = __nccwpck_require__(2098)
const outside = __nccwpck_require__(420)
const gtr = __nccwpck_require__(9380)
const ltr = __nccwpck_require__(3323)
const intersects = __nccwpck_require__(7008)
const simplifyRange = __nccwpck_require__(5297)
const subset = __nccwpck_require__(7863)
module.exports = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: constants.RELEASE_TYPES,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
}


/***/ }),

/***/ 2293:
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
]

module.exports = {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
}


/***/ }),

/***/ 106:
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 2463:
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ 785:
/***/ ((module) => {

// parse out just the options we care about
const looseOption = Object.freeze({ loose: true })
const emptyOpts = Object.freeze({ })
const parseOptions = options => {
  if (!options) {
    return emptyOpts
  }

  if (typeof options !== 'object') {
    return looseOption
  }

  return options
}
module.exports = parseOptions


/***/ }),

/***/ 9523:
/***/ ((module, exports, __nccwpck_require__) => {

const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH } = __nccwpck_require__(2293)
const debug = __nccwpck_require__(106)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const safeRe = exports.safeRe = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const LETTERDASHNUMBER = '[a-zA-Z0-9-]'

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
  ['\\s', 1],
  ['\\d', MAX_SAFE_COMPONENT_LENGTH],
  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
]

const makeSafeRegex = (value) => {
  for (const [token, max] of safeRegexReplacements) {
    value = value
      .split(`${token}*`).join(`${token}{0,${max}}`)
      .split(`${token}+`).join(`${token}{1,${max}}`)
  }
  return value
}

const createToken = (name, value, isGlobal) => {
  const safe = makeSafeRegex(value)
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '\\d+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`)

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`)

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ 9380:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Determine if version is greater than all the versions possible in the range.
const outside = __nccwpck_require__(420)
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),

/***/ 7008:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2, options)
}
module.exports = intersects


/***/ }),

/***/ 3323:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const outside = __nccwpck_require__(420)
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),

/***/ 579:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying


/***/ }),

/***/ 832:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying


/***/ }),

/***/ 4179:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)
const gt = __nccwpck_require__(4123)

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion


/***/ }),

/***/ 420:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Comparator = __nccwpck_require__(1532)
const { ANY } = Comparator
const Range = __nccwpck_require__(9828)
const satisfies = __nccwpck_require__(6055)
const gt = __nccwpck_require__(4123)
const lt = __nccwpck_require__(194)
const lte = __nccwpck_require__(7520)
const gte = __nccwpck_require__(5522)

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside


/***/ }),

/***/ 5297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __nccwpck_require__(6055)
const compare = __nccwpck_require__(4309)
module.exports = (versions, range, options) => {
  const set = []
  let first = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!first) {
        first = version
      }
    } else {
      if (prev) {
        set.push([first, prev])
      }
      prev = null
      first = null
    }
  }
  if (first) {
    set.push([first, null])
  }

  const ranges = []
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min)
    } else if (!max && min === v[0]) {
      ranges.push('*')
    } else if (!max) {
      ranges.push(`>=${min}`)
    } else if (min === v[0]) {
      ranges.push(`<=${max}`)
    } else {
      ranges.push(`${min} - ${max}`)
    }
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}


/***/ }),

/***/ 7863:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const Comparator = __nccwpck_require__(1532)
const { ANY } = Comparator
const satisfies = __nccwpck_require__(6055)
const compare = __nccwpck_require__(4309)

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      return false
    }
  }
  return true
}

const minimumVersionWithPreRelease = [new Comparator('>=0.0.0-0')]
const minimumVersion = [new Comparator('>=0.0.0')]

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease
    } else {
      sub = minimumVersion
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = minimumVersion
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset


/***/ }),

/***/ 2706:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),

/***/ 2098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 2707:
/***/ ((module) => {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ 5859:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.

var crypto = __nccwpck_require__(6113);

module.exports = function nodeRNG() {
  return crypto.randomBytes(16);
};


/***/ }),

/***/ 824:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var rng = __nccwpck_require__(5859);
var bytesToUuid = __nccwpck_require__(2707);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ 4091:
/***/ ((module) => {


module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ 665:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __nccwpck_require__(4091)(Yallist)
} catch (er) {}


/***/ }),

/***/ 9491:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("assert");

/***/ }),

/***/ 2081:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");

/***/ }),

/***/ 3292:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs/promises");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ 7282:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("process");

/***/ }),

/***/ 2781:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("string_decoder");

/***/ }),

/***/ 9512:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("timers");

/***/ }),

/***/ 4404:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("util");

/***/ }),

/***/ 3127:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {

/* unused harmony export default */
/* harmony import */ var assert__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(9491);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(2186);
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(4067);






class Golang extends _tool_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z {
    static tool = "go"
    static toolVersion = "go version"
    static envVar = "GOENV_ROOT"
    static envPaths = ["bin", "shims", "plugins/go-build/bin"]
    static installer = "goenv"

    constructor() {
        super(Golang.tool)
    }

    // desiredVersion : The desired version of golang, e.g. "1.16.4"
    // assumes goenv is already installed on the self-hosted runner, is a failure
    // condition otherwise.
    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = this.getVersion(
            desiredVersion,
            ".go-version",
        )
        if (!(await this.haveVersion(checkVersion))) {
            return checkVersion
        }

        // Check if goenv exists and can be run, and capture the version info while
        // we're at it, should be pre-installed on self-hosted runners.
        await this.findInstaller()

        /*
        if (!io.which("go")) {
            // This has to be invoked otherwise it just returns a function
            this.logAndExit(`${this.envVar} misconfigured`)()
        }
        */

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            _actions_core__WEBPACK_IMPORTED_MODULE_1__.exportVariable("GOENV_VERSION", checkVersion)
        }

        // using -s option to skip the install and become a no-op if the
        // version requested to be installed is already installed according to goenv.
        let installCommand = `goenv install -s`
        // goenv install does not pick up the environment variable GOENV_VERSION
        // unlike tfenv, so we specify it here as an argument explicitly, if it's set
        if (isVersionOverridden) installCommand += ` ${checkVersion}`

        await this.subprocessShell(installCommand).catch(
            this.logAndExit(`failed to install golang version ${checkVersion}`),
        )

        // Sanity check that the go command works and its reported version
        // matches what we have requested to be in place.
        await this.validateVersion(checkVersion)

        // If we got this far, we have successfully configured golang.
        _actions_core__WEBPACK_IMPORTED_MODULE_1__.setOutput(Golang.tool, checkVersion)
        this.info("golang success!")
        return checkVersion
    }

    async setEnv() {
        _actions_core__WEBPACK_IMPORTED_MODULE_1__.exportVariable("GOENV_SHELL", "bash")
        return super.setEnv()
    }

    /**
     * Download and configures goenv.
     *
     * @param  {string} root - Directory to install goenv into (GOENV_ROOT).
     * @return {string} The value of GOENV_ROOT.
     */
    async install(root) {
        assert__WEBPACK_IMPORTED_MODULE_0__(root, "root is required")
        const gh = `https://${process.env.GITHUB_SERVER || "github.com"}/syndbg`
        const url = `${gh}/goenv/archive/refs/heads/master.tar.gz`

        root = await this.downloadTool(url, { dest: root, strip: 1 })
        this.info(`Downloaded goenv to ${root}`)

        return root
    }
}

// Register the subclass in our tool list
Golang.register()


/***/ }),

/***/ 1378:
/***/ ((__webpack_module__, __webpack_exports__, __nccwpck_require__) => {

__nccwpck_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __nccwpck_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ run),
/* harmony export */   "u": () => (/* binding */ runner)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(2186);
/* harmony import */ var _golang_js__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(3127);
/* harmony import */ var _java_js__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(3421);
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_3__ = __nccwpck_require__(6221);
/* harmony import */ var _python_js__WEBPACK_IMPORTED_MODULE_4__ = __nccwpck_require__(11);
/* harmony import */ var _terraform_js__WEBPACK_IMPORTED_MODULE_5__ = __nccwpck_require__(5105);
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_6__ = __nccwpck_require__(4067);


// Import all our tools to register them






// Get our Tool class registry


// run executes the main function of the Action
async function run() {
    const runAsync = (process.env.RUN_ASYNC || "true").toLowerCase() != "false"
    // Create a list of setup() promises from all the tools
    // Wait for all the setup() promises to resolve
    if (runAsync) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info("Running setups in parallel")
        const setups = _tool_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"].all */ .Z.all().map(async (tool) => {
            try {
                await tool.setup(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput(tool.name))
            } catch (error) {
                _actions_core__WEBPACK_IMPORTED_MODULE_0__.error(`caught error in ${tool.name} setup: ${error}`)
                throw error
            }
        })
        return Promise.all(setups)
    } else {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info("Running setups sequentially")
        let errs = []
        const errHandler = (err) => {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.error(`caught error in setup: ${err}`)
            errs.push(err)
        }
        for (let tool of _tool_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"].all */ .Z.all()) {
            try {
                // For some reason this catch call isn't working the way I expect,
                // but I can't figure it out, so we double down with try/catch
                await tool.setup(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput(tool.name)).catch(errHandler)
            } catch (err) {
                errHandler(err)
            }
        }
        // Escalate errors to make em someone else's problem
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.debug(`errors caught: ${JSON.stringify(errs)}`)
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
async function runner() {
    return run().catch((error) => {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(error.message)
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

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ 3421:
/***/ ((__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __nccwpck_require__) => {


// UNUSED EXPORTS: default

// EXTERNAL MODULE: external "fs"
var external_fs_ = __nccwpck_require__(7147);
// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(1017);
// EXTERNAL MODULE: external "process"
var external_process_ = __nccwpck_require__(7282);
// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(2186);
// EXTERNAL MODULE: external "assert"
var external_assert_ = __nccwpck_require__(9491);
// EXTERNAL MODULE: external "fs/promises"
var promises_ = __nccwpck_require__(3292);
// EXTERNAL MODULE: ./tool.js
var tool = __nccwpck_require__(4067);
;// CONCATENATED MODULE: ./sdkmantool.js








// abstract class
class SdkmanTool extends tool/* default */.Z {
    static tool = "sdkman"
    static envVar = "SDKMAN_DIR"
    static installer = "sdk"
    static installerPath = ".sdkman"
    static installerVersion = "sdk version"

    constructor(extendingTool) {
        super(extendingTool)
    }

    /**
     * Return the path to the tool installation directory, if found, otherwise
     * return the default path to the tool.
     *
     * @returns {String} - Path to the root folder of the tool.
     */
    async findRoot() {
        ;(function () {
            // Shortcut this
            if (this.sdkShimChecked) return

            // All of this is to check if we have a sdkman install that hasn't
            // been shimmed which won't be found correctly
            let check = this.defaultRoot
            this.debug(`checking with defaultRoot: ${check}`)

            if (!external_fs_.existsSync(check)) return
            this.debug("defaultRoot exists")

            check = external_path_.join(check, "bin", "sdkman-init.sh")
            if (!external_fs_.existsSync(check)) return
            this.debug("sdkman-init.sh exists")

            check = external_path_.join(this.defaultRoot, "bin", "sdk")
            if (external_fs_.existsSync(check)) {
                this.debug(`sdk shim found at: ${check}`)
                this.sdkShimChecked = true
                return
            }
            this.debug("sdk shim does not exist")

            this.shimSdk(this.defaultRoot)
        }.bind(this)())

        return super.findRoot()
    }

    /**
     * Download and configures sdkman.
     *
     * @param  {string} root - Directory to install sdkman into (SDKMAN_DIR).
     * @param  {string} noShim - Don't install the `sdk` shim.
     * @return {string} The value of SDKMAN_DIR.
     */
    async install(root, noShim = false) {
        external_assert_(root, "root is required")
        const url = "https://get.sdkman.io?rcupdate=false"
        const install = await this.downloadTool(url)

        // Export the SDKMAN_DIR for installation location
        await this.setEnv(root)

        // Create an env copy so we don't call findRoot during the install
        const env = { ...external_process_.env, ...(await this.getEnv(root)) }

        // Remove the root dir, because Sdkman will not install if it exists,
        // which is dumb, but that's what we got
        if (external_fs_.existsSync(root)) await promises_.rmdir(root)

        // Run the installer script
        await this.subprocessShell(`bash ${install}`, { env: env })

        // Shim the sdk cli function and add to the path
        if (!noShim) this.shimSdk(root)

        // Asynchronously clean up the downloaded installer script
        promises_.rm(install, { recursive: true }).catch(() => {})

        return root
    }

    /**
     * Create a shim for the `sdk` CLI functions that otherwise would require an
     * active shell.
     *
     * @param {string} root - The root directory of the sdkman installation.
     */
    shimSdk(root) {
        const shim = external_path_.join(root, "bin", "sdk")

        // This is our actual sdk shim script
        const shimTmpl = `\
#!/bin/bash
export SDKMAN_DIR="${root}"
SDKMAN_INIT_FILE="$SDKMAN_DIR/bin/sdkman-init.sh"
if [[ ! -s "$SDKMAN_INIT_FILE" ]]; then exit 13; fi
if [[ -z "$SDKMAN_AVAILABLE" ]]; then source "$SDKMAN_INIT_FILE" >/dev/null; fi
export -f
sdk "$@"
`
        this.info(`Creating sdk shim at ${shim}`)

        // Ensure we have a path to install the shim to, no matter what
        external_fs_.mkdirSync(external_path_.dirname(shim), { recursive: true })
        // Remove the shim if there's something there, it's probably bad
        if (external_fs_.existsSync(shim)) external_fs_.rmSync(shim)
        // Write our new shim
        external_fs_.writeFileSync(shim, shimTmpl, { mode: 0o755 })
    }

    /**
     * Ensure that the sdkman config file contains the settings necessary for
     * executing in a non-interactive CI environment.
     */
    checkSdkmanSettings(configFile) {
        // Easy case, no file, make sure the directory exists and write config
        if (!external_fs_.existsSync(configFile)) {
            this.debug("writing sdkman config")
            const configPath = external_path_.dirname(configFile)
            external_fs_.mkdirSync(configPath, { recursive: true })
            // This config is taken from the packer repo
            external_fs_.writeFileSync(
                configFile,
                `\
sdkman_auto_answer=true
sdkman_auto_complete=true
sdkman_auto_env=true
sdkman_beta_channel=false
sdkman_colour_enable=true
sdkman_curl_connect_timeout=7
sdkman_curl_max_time=10
sdkman_debug_mode=false
sdkman_insecure_ssl=false
sdkman_rosetta2_compatible=false
sdkman_selfupdate_enable=false`,
            )
            return
        }

        this.debug("sdkman config already present")
        // If we get here, the file exists, and we just hope it's configured right
        let data = external_fs_.readFileSync(configFile, "utf8")
        if (/sdkman_auto_answer=true/.test(data)) {
            // We're good
            this.debug("sdkman config okay")
            return
        }

        this.debug("sdkman config misconfigured, maybe")
        this.debug(external_fs_.readFileSync(configFile, "utf8"))

        this.debug("overwriting it because otherwise this tool won't work")
        data = data.replace(
            /sdkman_auto_answer=false/,
            "sdkman_auto_answer=true",
        )
        data = data.replace(
            /sdkman_selfupdate_enable=true/,
            "sdkman_selfupdate_enable=true",
        )
        external_fs_.writeFileSync(configFile, data)
    }
}

;// CONCATENATED MODULE: ./java.js








class Java extends SdkmanTool {
    static tool = "java"
    static toolVersion = "java -version"

    constructor() {
        super(Java.tool)
    }

    // desiredVersion : The identifier for the specific desired version of java as
    // known to sdkman such as "11.0.2-open" for version 11.0.2 from java.net.
    // assumes sdkman is already installed on the self-hosted runner, is a failure
    // condition otherwise.
    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] =
            this.getJavaVersion(desiredVersion)
        if (!(await this.haveVersion(checkVersion))) {
            return checkVersion
        }

        // Make sure that sdkman is installed
        await this.findInstaller()

        // This doesn't fail hard, but it probably should
        this.checkSdkmanSettings(
            external_path_.join(`${await this.findRoot()}`, "etc/config"),
        )

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("JAVA_VERSION", checkVersion)
        }

        // If sdkman is requested to install the same version of java more than once,
        // all subsequent attempts will be a no-op and sdkman will report a message of the
        // form "java 11.0.2-open is already installed". sdk install does not pick up the
        // environment variable JAVA_VERSION unlike tfenv, so we specify it here as an
        // argument explicitly, if it's set
        await this.subprocessShell(`sdk install java ${checkVersion}`).catch(
            this.logAndExit(`failed to install: ${checkVersion}`),
        )

        // Set the "current" default Java version to the desired version
        await this.subprocessShell(`sdk default java ${checkVersion}`).catch(
            this.logAndExit(`failed to set default: ${checkVersion}`),
        )

        // export JAVA_HOME to force using the correct version of java
        const javaHome = `${external_process_.env[this.envVar]}/candidates/java/current`
        core.exportVariable("JAVA_HOME", javaHome)

        // Augment path so that the current version of java according to sdkman will be
        // the version found.
        core.addPath(`${javaHome}/bin`)

        // Remove the trailing -blah from the Java version string
        const expectedVersion = checkVersion.replace(/[-_][^-_]+$/, "")

        // Sanity check that the java command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion(expectedVersion)

        // If we got this far, we have successfully configured java.
        core.setOutput(Java.tool, checkVersion)
        this.info("java success!")
        return checkVersion
    }

    // determines the desired version of java that is being requested. if the desired version
    // presented to the action is present, that version is honored rather than the version
    // presented in the .sdkmanrc file that can be optionally present in the checked out repo itself.
    // Second value returned indicates whether or not the version returned has overridden
    // the version from the .sdkmanrc file.
    getJavaVersion(actionDesiredVersion) {
        // Check if we have any version passed in to the action (can be null/empty string)
        if (actionDesiredVersion) return [actionDesiredVersion, true]

        const readJavaVersion = this.parseSdkmanrc()
        if (readJavaVersion) {
            this.debug(`Found java version ${readJavaVersion} in .sdkmanrc`)
            return [readJavaVersion, false]
        }
        // No version has been specified
        return [null, null]
    }

    parseSdkmanrc(filename) {
        filename = filename || ".sdkmanrc"
        filename = external_path_.resolve(external_path_.join(external_process_.cwd(), filename))
        // No file? We're done
        if (!external_fs_.existsSync(filename)) {
            this.debug(`No .sdkmanrc file found: ${filename}`)
            return
        }

        // Read our file and split it linewise
        let data = external_fs_.readFileSync(filename, { encoding: "utf8", flag: "r" })
        if (!data) return
        data = data.split("\n")

        // Iterate over each line and match against the regex
        const find = new RegExp("^([^#=]+)=([^# ]+)$")
        let found = {}
        for (let line of data) {
            const match = find.exec(line)
            if (!match) continue
            found[match[1]] = match[2]
        }
        this.debug(`Found .sdkmanrc entries ${JSON.stringify(found)}`)
        return found["java"]
    }

    // versionParser specially handles version string extraction
    // because we have to map strings like 1.8.0_282 to 8.0.282 for the actual
    // SemVer comparison
    versionParser(text) {
        // Default case for 11.x or 17.x it should match and we're ok
        let versions = super.versionParser(text)
        this.debug(`versionParser: ${versions}`)
        if (!versions.length) return versions

        // Fast check for 1.x versions that don't parse right
        const v = /^\d+\.\d+\.\d+/ // Check against X.Y.Z
        const v1x = /^1\.\d+\.\d+/ // Check against 1.Y.Z
        if (v.test(versions[0]) && !v1x.test(versions[0])) return versions

        // This parsing is to match the version string for 1.8.0_282 (or
        // similar) which is what the java binary puts out, however `sdkman`
        // uses the updated naming of `8.0.282` which is what we want to check
        // against, so we're going to hard parse against X.Y.Z_W to rewrite it
        // to Y.Z.W
        const parser = /1\.([0-9]+\.[0-9]+_[0-9]+)/
        const matched = parser.exec(text)
        this.debug(`versionParser: matched 1.x version: ${matched}`)
        if (!matched) return versions
        return [matched[1].replace("_", ".")]
    }
}

// Register the subclass in our tool list
Java.register()


/***/ }),

/***/ 6221:
/***/ ((__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __nccwpck_require__) => {


// UNUSED EXPORTS: default

// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(1017);
// EXTERNAL MODULE: external "assert"
var external_assert_ = __nccwpck_require__(9491);
// EXTERNAL MODULE: external "fs/promises"
var promises_ = __nccwpck_require__(3292);
// EXTERNAL MODULE: external "util"
var external_util_ = __nccwpck_require__(3837);
// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(2186);
// EXTERNAL MODULE: ./node_modules/find-versions/index.js + 1 modules
var find_versions = __nccwpck_require__(2564);
// EXTERNAL MODULE: ./tool.js
var tool = __nccwpck_require__(4067);
;// CONCATENATED MODULE: ./node-version-data.js
// Local cache with node version data in case requests using the node-version-data module fail
const versions = [
    {
        version: "v20.4.0",
        date: "2023-07-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-arm64-7z",
            "win-arm64-zip",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.7.2",
        v8: "11.3.244.8",
        uv: "1.46.0",
        zlib: "1.2.13.1-motley",
        openssl: "3.0.9+quic",
        modules: "115",
        lts: false,
        security: false,
    },
    {
        version: "v20.3.1",
        date: "2023-06-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-arm64-7z",
            "win-arm64-zip",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.6.7",
        v8: "11.3.244.8",
        uv: "1.45.0",
        zlib: "1.2.13.1-motley",
        openssl: "3.0.9+quic",
        modules: "115",
        lts: false,
        security: true,
    },
    {
        version: "v20.3.0",
        date: "2023-06-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-arm64-7z",
            "win-arm64-zip",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.6.7",
        v8: "11.3.244.8",
        uv: "1.45.0",
        zlib: "1.2.13.1-motley",
        openssl: "3.0.8+quic",
        modules: "115",
        lts: false,
        security: false,
    },
    {
        version: "v20.2.0",
        date: "2023-05-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-arm64-7z",
            "win-arm64-zip",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.6.6",
        v8: "11.3.244.8",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "115",
        lts: false,
        security: false,
    },
    {
        version: "v20.1.0",
        date: "2023-05-03",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-arm64-7z",
            "win-arm64-zip",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.6.4",
        v8: "11.3.244.8",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "115",
        lts: false,
        security: false,
    },
    {
        version: "v20.0.0",
        date: "2023-04-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-arm64-7z",
            "win-arm64-zip",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.6.4",
        v8: "11.3.244.4",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "115",
        lts: false,
        security: false,
    },
    {
        version: "v19.9.0",
        date: "2023-04-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-arm64-7z",
            "win-arm64-zip",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.6.3",
        v8: "10.8.168.25",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v19.8.1",
        date: "2023-03-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.5.1",
        v8: "10.8.168.25",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v19.8.0",
        date: "2023-03-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.5.1",
        v8: "10.8.168.25",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v19.7.0",
        date: "2023-02-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.5.0",
        v8: "10.8.168.25",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v19.6.1",
        date: "2023-02-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.4.0",
        v8: "10.8.168.25",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "111",
        lts: false,
        security: true,
    },
    {
        version: "v19.6.0",
        date: "2023-02-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.4.0",
        v8: "10.8.168.25",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.7+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v19.5.0",
        date: "2023-01-24",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.3.1",
        v8: "10.8.168.25",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.7+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v19.4.0",
        date: "2023-01-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.2.0",
        v8: "10.8.168.25",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.7+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v19.3.0",
        date: "2022-12-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.2.0",
        v8: "10.8.168.21",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.7+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v19.2.0",
        date: "2022-11-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.3",
        v8: "10.8.168.20",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.7+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v19.1.0",
        date: "2022-11-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.3",
        v8: "10.7.193.20",
        uv: "1.44.2",
        zlib: "1.2.11",
        openssl: "3.0.7+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v19.0.1",
        date: "2022-11-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.2",
        v8: "10.7.193.13",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.7+quic",
        modules: "111",
        lts: false,
        security: true,
    },
    {
        version: "v19.0.0",
        date: "2022-10-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.2",
        v8: "10.7.193.13",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.5+quic",
        modules: "111",
        lts: false,
        security: false,
    },
    {
        version: "v18.16.1",
        date: "2023-06-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.5.1",
        v8: "10.2.154.26",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.9+quic",
        modules: "108",
        lts: "Hydrogen",
        security: true,
    },
    {
        version: "v18.16.0",
        date: "2023-04-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.5.1",
        v8: "10.2.154.26",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "108",
        lts: "Hydrogen",
        security: false,
    },
    {
        version: "v18.15.0",
        date: "2023-03-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.5.0",
        v8: "10.2.154.26",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "108",
        lts: "Hydrogen",
        security: false,
    },
    {
        version: "v18.14.2",
        date: "2023-02-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.5.0",
        v8: "10.2.154.26",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "108",
        lts: "Hydrogen",
        security: false,
    },
    {
        version: "v18.14.1",
        date: "2023-02-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.3.1",
        v8: "10.2.154.23",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.8+quic",
        modules: "108",
        lts: "Hydrogen",
        security: true,
    },
    {
        version: "v18.14.0",
        date: "2023-02-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "9.3.1",
        v8: "10.2.154.23",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.7+quic",
        modules: "108",
        lts: "Hydrogen",
        security: false,
    },
    {
        version: "v18.13.0",
        date: "2023-01-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.3",
        v8: "10.2.154.23",
        uv: "1.44.2",
        zlib: "1.2.13",
        openssl: "3.0.7+quic",
        modules: "108",
        lts: "Hydrogen",
        security: false,
    },
    {
        version: "v18.12.1",
        date: "2022-11-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.2",
        v8: "10.2.154.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.7+quic",
        modules: "108",
        lts: "Hydrogen",
        security: true,
    },
    {
        version: "v18.12.0",
        date: "2022-10-25",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.2",
        v8: "10.2.154.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.5+quic",
        modules: "108",
        lts: "Hydrogen",
        security: false,
    },
    {
        version: "v18.11.0",
        date: "2022-10-13",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.2",
        v8: "10.2.154.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.5+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v18.10.0",
        date: "2022-09-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.2",
        v8: "10.2.154.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.5+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v18.9.1",
        date: "2022-09-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.1",
        v8: "10.2.154.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.5+quic",
        modules: "108",
        lts: false,
        security: true,
    },
    {
        version: "v18.9.0",
        date: "2022-09-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.1",
        v8: "10.2.154.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.5+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v18.8.0",
        date: "2022-08-24",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.18.0",
        v8: "10.2.154.13",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.5+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v18.7.0",
        date: "2022-07-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.15.0",
        v8: "10.2.154.13",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.5+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v18.6.0",
        date: "2022-07-13",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.13.2",
        v8: "10.2.154.13",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.5+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v18.5.0",
        date: "2022-07-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.12.1",
        v8: "10.2.154.4",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.5+quic",
        modules: "108",
        lts: false,
        security: true,
    },
    {
        version: "v18.4.0",
        date: "2022-06-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.12.1",
        v8: "10.2.154.4",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.3+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v18.3.0",
        date: "2022-06-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.11.0",
        v8: "10.2.154.4",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.3+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v18.2.0",
        date: "2022-05-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
        ],
        npm: "8.9.0",
        v8: "10.1.124.8",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.3+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v18.1.0",
        date: "2022-05-03",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
        ],
        npm: "8.8.0",
        v8: "10.1.124.8",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.2+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v18.0.0",
        date: "2022-04-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
        ],
        npm: "8.6.0",
        v8: "10.1.124.8",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.2+quic",
        modules: "108",
        lts: false,
        security: false,
    },
    {
        version: "v17.9.1",
        date: "2022-06-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.11.0",
        v8: "9.6.180.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.3+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.9.0",
        date: "2022-04-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.5.5",
        v8: "9.6.180.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.2+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.8.0",
        date: "2022-03-22",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.5.5",
        v8: "9.6.180.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.2+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.7.2",
        date: "2022-03-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.5.2",
        v8: "9.6.180.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.2+quic",
        modules: "102",
        lts: false,
        security: true,
    },
    {
        version: "v17.7.1",
        date: "2022-03-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.5.2",
        v8: "9.6.180.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.1+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.7.0",
        date: "2022-03-09",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.5.2",
        v8: "9.6.180.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.1+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.6.0",
        date: "2022-02-22",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.5.1",
        v8: "9.6.180.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.1+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.5.0",
        date: "2022-02-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.4.1",
        v8: "9.6.180.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.1+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.4.0",
        date: "2022-01-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.3.1",
        v8: "9.6.180.15",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "3.0.1+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.3.1",
        date: "2022-01-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.3.0",
        v8: "9.6.180.15",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "3.0.1+quic",
        modules: "102",
        lts: false,
        security: true,
    },
    {
        version: "v17.3.0",
        date: "2021-12-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.3.0",
        v8: "9.6.180.15",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "3.0.1+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.2.0",
        date: "2021-11-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.1.4",
        v8: "9.6.180.14",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "3.0.0+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.1.0",
        date: "2021-11-09",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.1.2",
        v8: "9.5.172.25",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "3.0.0+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.0.1",
        date: "2021-10-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.1.0",
        v8: "9.5.172.21",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "3.0.0+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v17.0.0",
        date: "2021-10-19",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.1.0",
        v8: "9.5.172.21",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "3.0.0+quic",
        modules: "102",
        lts: false,
        security: false,
    },
    {
        version: "v16.20.1",
        date: "2023-06-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.4",
        v8: "9.4.146.26",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1u+quic",
        modules: "93",
        lts: "Gallium",
        security: true,
    },
    {
        version: "v16.20.0",
        date: "2023-03-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.4",
        v8: "9.4.146.26",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1t+quic",
        modules: "93",
        lts: "Gallium",
        security: false,
    },
    {
        version: "v16.19.1",
        date: "2023-02-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.3",
        v8: "9.4.146.26",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1t+quic",
        modules: "93",
        lts: "Gallium",
        security: true,
    },
    {
        version: "v16.19.0",
        date: "2022-12-13",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.3",
        v8: "9.4.146.26",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1s+quic",
        modules: "93",
        lts: "Gallium",
        security: false,
    },
    {
        version: "v16.18.1",
        date: "2022-11-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.2",
        v8: "9.4.146.26",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1q+quic",
        modules: "93",
        lts: "Gallium",
        security: true,
    },
    {
        version: "v16.18.0",
        date: "2022-10-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.19.2",
        v8: "9.4.146.26",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1q+quic",
        modules: "93",
        lts: "Gallium",
        security: false,
    },
    {
        version: "v16.17.1",
        date: "2022-09-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.15.0",
        v8: "9.4.146.26",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1q+quic",
        modules: "93",
        lts: "Gallium",
        security: true,
    },
    {
        version: "v16.17.0",
        date: "2022-08-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.15.0",
        v8: "9.4.146.26",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1q+quic",
        modules: "93",
        lts: "Gallium",
        security: false,
    },
    {
        version: "v16.16.0",
        date: "2022-07-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.11.0",
        v8: "9.4.146.24",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1q+quic",
        modules: "93",
        lts: "Gallium",
        security: true,
    },
    {
        version: "v16.15.1",
        date: "2022-06-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.11.0",
        v8: "9.4.146.24",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1o+quic",
        modules: "93",
        lts: "Gallium",
        security: false,
    },
    {
        version: "v16.15.0",
        date: "2022-04-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.5.5",
        v8: "9.4.146.24",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1n+quic",
        modules: "93",
        lts: "Gallium",
        security: false,
    },
    {
        version: "v16.14.2",
        date: "2022-03-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.5.0",
        v8: "9.4.146.24",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1n+quic",
        modules: "93",
        lts: "Gallium",
        security: true,
    },
    {
        version: "v16.14.1",
        date: "2022-03-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.5.0",
        v8: "9.4.146.24",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1m+quic",
        modules: "93",
        lts: "Gallium",
        security: false,
    },
    {
        version: "v16.14.0",
        date: "2022-02-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.3.1",
        v8: "9.4.146.24",
        uv: "1.43.0",
        zlib: "1.2.11",
        openssl: "1.1.1m+quic",
        modules: "93",
        lts: "Gallium",
        security: false,
    },
    {
        version: "v16.13.2",
        date: "2022-01-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.1.2",
        v8: "9.4.146.24",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l+quic",
        modules: "93",
        lts: "Gallium",
        security: true,
    },
    {
        version: "v16.13.1",
        date: "2021-12-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.1.2",
        v8: "9.4.146.24",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l+quic",
        modules: "93",
        lts: "Gallium",
        security: false,
    },
    {
        version: "v16.13.0",
        date: "2021-10-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.1.0",
        v8: "9.4.146.19",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l+quic",
        modules: "93",
        lts: "Gallium",
        security: false,
    },
    {
        version: "v16.12.0",
        date: "2021-10-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.1.0",
        v8: "9.4.146.19",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.11.1",
        date: "2021-10-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.0.0",
        v8: "9.4.146.19",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l+quic",
        modules: "93",
        lts: false,
        security: true,
    },
    {
        version: "v16.11.0",
        date: "2021-10-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "8.0.0",
        v8: "9.4.146.19",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.10.0",
        date: "2021-09-22",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.24.0",
        v8: "9.3.345.19",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.9.1",
        date: "2021-09-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.21.1",
        v8: "9.3.345.16",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.9.0",
        date: "2021-09-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.21.1",
        v8: "9.3.345.16",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.8.0",
        date: "2021-08-25",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.21.0",
        v8: "9.2.230.21",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.7.0",
        date: "2021-08-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.20.3",
        v8: "9.2.230.21",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.6.2",
        date: "2021-08-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.20.3",
        v8: "9.2.230.21",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: true,
    },
    {
        version: "v16.6.1",
        date: "2021-08-03",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.20.3",
        v8: "9.2.230.21",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.6.0",
        date: "2021-07-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.19.1",
        v8: "9.2.230.21",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: true,
    },
    {
        version: "v16.5.0",
        date: "2021-07-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.19.1",
        v8: "9.1.269.38",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.4.2",
        date: "2021-07-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.18.1",
        v8: "9.1.269.36",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.4.1",
        date: "2021-07-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.18.1",
        v8: "9.1.269.36",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: true,
    },
    {
        version: "v16.4.0",
        date: "2021-06-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.18.1",
        v8: "9.1.269.36",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.3.0",
        date: "2021-06-03",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.15.1",
        v8: "9.0.257.25",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.2.0",
        date: "2021-05-19",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.13.0",
        v8: "9.0.257.25",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.1.0",
        date: "2021-05-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.11.2",
        v8: "9.0.257.24",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v16.0.0",
        date: "2021-04-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-arm64-tar",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.10.0",
        v8: "9.0.257.17",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "93",
        lts: false,
        security: false,
    },
    {
        version: "v15.14.0",
        date: "2021-04-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.7.6",
        v8: "8.6.395.17",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k+quic",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.13.0",
        date: "2021-03-31",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.7.6",
        v8: "8.6.395.17",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1j+quic",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.12.0",
        date: "2021-03-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.6.3",
        v8: "8.6.395.17",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1j+quic",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.11.0",
        date: "2021-03-03",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.6.0",
        v8: "8.6.395.17",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1j",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.10.0",
        date: "2021-02-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.5.3",
        v8: "8.6.395.17",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1j",
        modules: "88",
        lts: false,
        security: true,
    },
    {
        version: "v15.9.0",
        date: "2021-02-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.5.3",
        v8: "8.6.395.17",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.8.0",
        date: "2021-02-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.5.1",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.7.0",
        date: "2021-01-25",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.4.3",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.6.0",
        date: "2021-01-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.4.0",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.5.1",
        date: "2021-01-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.3.0",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "88",
        lts: false,
        security: true,
    },
    {
        version: "v15.5.0",
        date: "2020-12-22",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.3.0",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.4.0",
        date: "2020-12-09",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.0.15",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.3.0",
        date: "2020-11-24",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.0.14",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.2.1",
        date: "2020-11-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.0.8",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "88",
        lts: false,
        security: true,
    },
    {
        version: "v15.2.0",
        date: "2020-11-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.0.8",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.1.0",
        date: "2020-11-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.0.8",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.0.1",
        date: "2020-10-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.0.3",
        v8: "8.6.395.17",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v15.0.0",
        date: "2020-10-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "7.0.2",
        v8: "8.6.395.16",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "88",
        lts: false,
        security: false,
    },
    {
        version: "v14.21.3",
        date: "2023-02-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.18",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1t",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.21.2",
        date: "2022-12-13",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.17",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1s",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.21.1",
        date: "2022-11-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.17",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1q",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.21.0",
        date: "2022-11-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.17",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1q",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.20.1",
        date: "2022-09-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.17",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1q",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.20.0",
        date: "2022-07-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.17",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1q",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.19.3",
        date: "2022-05-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.17",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1o",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.19.2",
        date: "2022-05-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.17",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1n",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.19.1",
        date: "2022-03-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.16",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1n",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.19.0",
        date: "2022-02-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.16",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1m",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.18.3",
        date: "2022-01-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.15",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.18.2",
        date: "2021-11-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.15",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.18.1",
        date: "2021-10-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.15",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.18.0",
        date: "2021-09-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.15",
        v8: "8.4.371.23",
        uv: "1.42.0",
        zlib: "1.2.11",
        openssl: "1.1.1l",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.17.6",
        date: "2021-08-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.15",
        v8: "8.4.371.23",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1l",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.17.5",
        date: "2021-08-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.14",
        v8: "8.4.371.23",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.17.4",
        date: "2021-07-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.14",
        v8: "8.4.371.23",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.17.3",
        date: "2021-07-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.13",
        v8: "8.4.371.23",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.17.2",
        date: "2021-07-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.13",
        v8: "8.4.371.23",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.17.1",
        date: "2021-06-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.13",
        v8: "8.4.371.23",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.17.0",
        date: "2021-05-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.13",
        v8: "8.4.371.23",
        uv: "1.41.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.16.1",
        date: "2021-04-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.12",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.16.0",
        date: "2021-02-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.11",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1j",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.15.5",
        date: "2021-02-09",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.11",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.15.4",
        date: "2021-01-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.10",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.15.3",
        date: "2020-12-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.9",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.15.2",
        date: "2020-12-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.9",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.15.1",
        date: "2020-11-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: "Fermium",
        security: true,
    },
    {
        version: "v14.15.0",
        date: "2020-10-27",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: "Fermium",
        security: false,
    },
    {
        version: "v14.14.0",
        date: "2020-10-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.13.1",
        date: "2020-10-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.13.0",
        date: "2020-09-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "8.4.371.19",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.12.0",
        date: "2020-09-22",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "8.4.371.19",
        uv: "1.39.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.11.0",
        date: "2020-09-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "8.4.371.19",
        uv: "1.39.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: true,
    },
    {
        version: "v14.10.1",
        date: "2020-09-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "8.4.371.19",
        uv: "1.39.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.10.0",
        date: "2020-09-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "8.4.371.19",
        uv: "1.39.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.9.0",
        date: "2020-08-27",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "8.4.371.19",
        uv: "1.39.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.8.0",
        date: "2020-08-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.7",
        v8: "8.4.371.19",
        uv: "1.38.1",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.7.0",
        date: "2020-07-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.7",
        v8: "8.4.371.19",
        uv: "1.38.1",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.6.0",
        date: "2020-07-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.6",
        v8: "8.4.371.19",
        uv: "1.38.1",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.5.0",
        date: "2020-06-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.5",
        v8: "8.3.110.9",
        uv: "1.38.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.4.0",
        date: "2020-06-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.5",
        v8: "8.1.307.31",
        uv: "1.37.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: true,
    },
    {
        version: "v14.3.0",
        date: "2020-05-19",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.5",
        v8: "8.1.307.31",
        uv: "1.37.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.2.0",
        date: "2020-05-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "8.1.307.31",
        uv: "1.37.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.1.0",
        date: "2020-04-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "8.1.307.31",
        uv: "1.37.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v14.0.0",
        date: "2020-04-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "8.1.307.30",
        uv: "1.37.0",
        zlib: "1.2.11",
        openssl: "1.1.1f",
        modules: "83",
        lts: false,
        security: false,
    },
    {
        version: "v13.14.0",
        date: "2020-04-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "7.9.317.25",
        uv: "1.37.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.13.0",
        date: "2020-04-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "7.9.317.25",
        uv: "1.35.0",
        zlib: "1.2.11",
        openssl: "1.1.1f",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.12.0",
        date: "2020-03-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "7.9.317.25",
        uv: "1.35.0",
        zlib: "1.2.11",
        openssl: "1.1.1e",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.11.0",
        date: "2020-03-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.7",
        v8: "7.9.317.25",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.10.1",
        date: "2020-03-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.7",
        v8: "7.9.317.25",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.10.0",
        date: "2020-03-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.7",
        v8: "7.9.317.25",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.9.0",
        date: "2020-02-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.7",
        v8: "7.9.317.25",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.8.0",
        date: "2020-02-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.6",
        v8: "7.9.317.25",
        uv: "1.34.1",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: true,
    },
    {
        version: "v13.7.0",
        date: "2020-01-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.6",
        v8: "7.9.317.25",
        uv: "1.34.1",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.6.0",
        date: "2020-01-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "7.9.317.25",
        uv: "1.34.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.5.0",
        date: "2019-12-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "7.9.317.25",
        uv: "1.34.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.4.0",
        date: "2019-12-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "7.9.317.25",
        uv: "1.34.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: true,
    },
    {
        version: "v13.3.0",
        date: "2019-12-03",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.1",
        v8: "7.9.317.25",
        uv: "1.33.1",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.2.0",
        date: "2019-11-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.1",
        v8: "7.9.317.23",
        uv: "1.33.1",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.1.0",
        date: "2019-11-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.12.1",
        v8: "7.8.279.17",
        uv: "1.33.1",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.0.1",
        date: "2019-10-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.12.0",
        v8: "7.8.279.17",
        uv: "1.33.1",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v13.0.0",
        date: "2019-10-22",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.12.0",
        v8: "7.8.279.17",
        uv: "1.32.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "79",
        lts: false,
        security: false,
    },
    {
        version: "v12.22.12",
        date: "2022-04-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.16",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1n",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.22.11",
        date: "2022-03-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.16",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1n",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.22.10",
        date: "2022-02-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.16",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1m",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.22.9",
        date: "2022-01-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.15",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1m",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.22.8",
        date: "2021-12-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.15",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1m",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.22.7",
        date: "2021-10-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.15",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1l",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.22.6",
        date: "2021-08-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.15",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1l",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.22.5",
        date: "2021-08-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.14",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.22.4",
        date: "2021-07-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.14",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.22.3",
        date: "2021-07-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.13",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.22.2",
        date: "2021-07-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.13",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.22.1",
        date: "2021-04-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.12",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.22.0",
        date: "2021-03-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.11",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1j",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.21.0",
        date: "2021-02-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.11",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1j",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.20.2",
        date: "2021-02-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.11",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.20.1",
        date: "2021-01-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.10",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.20.0",
        date: "2020-11-24",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "7.8.279.23",
        uv: "1.40.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.19.1",
        date: "2020-11-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "7.8.279.23",
        uv: "1.39.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.19.0",
        date: "2020-10-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "7.8.279.23",
        uv: "1.39.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.18.4",
        date: "2020-09-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.6",
        v8: "7.8.279.23",
        uv: "1.38.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.18.3",
        date: "2020-07-22",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.6",
        v8: "7.8.279.23",
        uv: "1.38.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.18.2",
        date: "2020-06-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.5",
        v8: "7.8.279.23",
        uv: "1.38.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.18.1",
        date: "2020-06-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.5",
        v8: "7.8.279.23",
        uv: "1.38.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.18.0",
        date: "2020-06-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "7.8.279.23",
        uv: "1.37.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.17.0",
        date: "2020-05-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "7.8.279.23",
        uv: "1.37.0",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.16.3",
        date: "2020-04-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "7.8.279.23",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.16.2",
        date: "2020-04-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "7.8.279.23",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1e",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.16.1",
        date: "2020-02-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "7.8.279.23",
        uv: "1.34.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.16.0",
        date: "2020-02-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "7.8.279.23",
        uv: "1.34.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.15.0",
        date: "2020-02-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "7.7.299.13",
        uv: "1.33.1",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.14.1",
        date: "2020-01-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "7.7.299.13",
        uv: "1.33.1",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.14.0",
        date: "2019-12-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "7.7.299.13",
        uv: "1.33.1",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "72",
        lts: "Erbium",
        security: true,
    },
    {
        version: "v12.13.1",
        date: "2019-11-19",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.12.1",
        v8: "7.7.299.13",
        uv: "1.33.1",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.13.0",
        date: "2019-10-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.12.0",
        v8: "7.7.299.13",
        uv: "1.32.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "72",
        lts: "Erbium",
        security: false,
    },
    {
        version: "v12.12.0",
        date: "2019-10-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.11.3",
        v8: "7.7.299.13",
        uv: "1.32.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.11.1",
        date: "2019-10-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.11.3",
        v8: "7.7.299.11",
        uv: "1.32.0",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.11.0",
        date: "2019-09-25",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.11.3",
        v8: "7.7.299.11",
        uv: "1.32.0",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.10.0",
        date: "2019-09-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.10.3",
        v8: "7.6.303.29",
        uv: "1.31.0",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.9.1",
        date: "2019-08-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.10.2",
        v8: "7.6.303.29",
        uv: "1.31.0",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.9.0",
        date: "2019-08-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.10.2",
        v8: "7.6.303.29",
        uv: "1.31.0",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.8.1",
        date: "2019-08-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.10.2",
        v8: "7.5.288.22",
        uv: "1.30.1",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "72",
        lts: false,
        security: true,
    },
    {
        version: "v12.8.0",
        date: "2019-08-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.10.2",
        v8: "7.5.288.22",
        uv: "1.30.1",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.7.0",
        date: "2019-07-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.10.0",
        v8: "7.5.288.22",
        uv: "1.30.1",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.6.0",
        date: "2019-07-03",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "7.5.288.22",
        uv: "1.30.1",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.5.0",
        date: "2019-06-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "7.5.288.22",
        uv: "1.29.1",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.4.0",
        date: "2019-06-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "7.4.288.27",
        uv: "1.29.1",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.3.1",
        date: "2019-05-22",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "7.4.288.27",
        uv: "1.29.1",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.3.0",
        date: "2019-05-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "7.4.288.27",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.2.0",
        date: "2019-05-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "7.4.288.21",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.1.0",
        date: "2019-04-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "7.4.288.21",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v12.0.0",
        date: "2019-04-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "7.4.288.21",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "72",
        lts: false,
        security: false,
    },
    {
        version: "v11.15.0",
        date: "2019-04-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.7.0",
        v8: "7.0.276.38",
        uv: "1.27.0",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.14.0",
        date: "2019-04-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.7.0",
        v8: "7.0.276.38",
        uv: "1.27.0",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.13.0",
        date: "2019-03-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.7.0",
        v8: "7.0.276.38",
        uv: "1.27.0",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.12.0",
        date: "2019-03-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.7.0",
        v8: "7.0.276.38",
        uv: "1.26.0",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.11.0",
        date: "2019-03-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.7.0",
        v8: "7.0.276.38",
        uv: "1.26.0",
        zlib: "1.2.11",
        openssl: "1.1.1a",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.10.1",
        date: "2019-02-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.7.0",
        v8: "7.0.276.38",
        uv: "1.26.0",
        zlib: "1.2.11",
        openssl: "1.1.1a",
        modules: "67",
        lts: false,
        security: true,
    },
    {
        version: "v11.10.0",
        date: "2019-02-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.7.0",
        v8: "7.0.276.38",
        uv: "1.26.0",
        zlib: "1.2.11",
        openssl: "1.1.1a",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.9.0",
        date: "2019-01-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.5.0",
        v8: "7.0.276.38",
        uv: "1.25.0",
        zlib: "1.2.11",
        openssl: "1.1.1a",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.8.0",
        date: "2019-01-24",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.5.0",
        v8: "7.0.276.38",
        uv: "1.25.0",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.7.0",
        date: "2019-01-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.5.0",
        v8: "7.0.276.38",
        uv: "1.24.1",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.6.0",
        date: "2018-12-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.5.0-next.0",
        v8: "7.0.276.38",
        uv: "1.24.1",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.5.0",
        date: "2018-12-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "7.0.276.38",
        uv: "1.24.0",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.4.0",
        date: "2018-12-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "7.0.276.38",
        uv: "1.24.0",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.3.0",
        date: "2018-11-27",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "7.0.276.38",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "67",
        lts: false,
        security: true,
    },
    {
        version: "v11.2.0",
        date: "2018-11-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "7.0.276.38",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0i",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.1.0",
        date: "2018-10-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "7.0.276.32",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0i",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v11.0.0",
        date: "2018-10-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "7.0.276.28",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0i",
        modules: "67",
        lts: false,
        security: false,
    },
    {
        version: "v10.24.1",
        date: "2021-04-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.12",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1k",
        modules: "64",
        lts: "Dubnium",
        security: true,
    },
    {
        version: "v10.24.0",
        date: "2021-02-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.11",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1j",
        modules: "64",
        lts: "Dubnium",
        security: true,
    },
    {
        version: "v10.23.3",
        date: "2021-02-09",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.11",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.23.2",
        date: "2021-01-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.10",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.23.1",
        date: "2021-01-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.10",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1i",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.23.0",
        date: "2020-10-27",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.8",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.22.1",
        date: "2020-09-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.6",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "64",
        lts: "Dubnium",
        security: true,
    },
    {
        version: "v10.22.0",
        date: "2020-07-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.6",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1g",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.21.0",
        date: "2020-06-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1e",
        modules: "64",
        lts: "Dubnium",
        security: true,
    },
    {
        version: "v10.20.1",
        date: "2020-04-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1e",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.20.0",
        date: "2020-03-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.14.4",
        v8: "6.8.275.32",
        uv: "1.34.2",
        zlib: "1.2.11",
        openssl: "1.1.1e",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.19.0",
        date: "2020-02-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "6.8.275.32",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "64",
        lts: "Dubnium",
        security: true,
    },
    {
        version: "v10.18.1",
        date: "2020-01-09",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "6.8.275.32",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.18.0",
        date: "2019-12-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "6.8.275.32",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "64",
        lts: "Dubnium",
        security: true,
    },
    {
        version: "v10.17.0",
        date: "2019-10-22",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.11.3",
        v8: "6.8.275.32",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1d",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.16.3",
        date: "2019-08-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "6.8.275.32",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "64",
        lts: "Dubnium",
        security: true,
    },
    {
        version: "v10.16.2",
        date: "2019-08-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "6.8.275.32",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.16.1",
        date: "2019-07-31",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "6.8.275.32",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1c",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.16.0",
        date: "2019-05-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.9.0",
        v8: "6.8.275.32",
        uv: "1.28.0",
        zlib: "1.2.11",
        openssl: "1.1.1b",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.15.3",
        date: "2019-03-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.32",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.15.2",
        date: "2019-02-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.32",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "64",
        lts: "Dubnium",
        security: true,
    },
    {
        version: "v10.15.1",
        date: "2019-01-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.32",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.15.0",
        date: "2018-12-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.32",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.14.2",
        date: "2018-12-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.32",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.14.1",
        date: "2018-11-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.32",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.14.0",
        date: "2018-11-27",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.32",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0j",
        modules: "64",
        lts: "Dubnium",
        security: true,
    },
    {
        version: "v10.13.0",
        date: "2018-10-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.32",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0i",
        modules: "64",
        lts: "Dubnium",
        security: false,
    },
    {
        version: "v10.12.0",
        date: "2018-10-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.32",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.1.0i",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.11.0",
        date: "2018-09-19",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.32",
        uv: "1.23.0",
        zlib: "1.2.11",
        openssl: "1.1.0i",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.10.0",
        date: "2018-09-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.8.275.30",
        uv: "1.23.0",
        zlib: "1.2.11",
        openssl: "1.1.0i",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.9.0",
        date: "2018-08-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.2.0",
        v8: "6.8.275.24",
        uv: "1.22.0",
        zlib: "1.2.11",
        openssl: "1.1.0i",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.8.0",
        date: "2018-08-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.2.0",
        v8: "6.7.288.49",
        uv: "1.22.0",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.7.0",
        date: "2018-07-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.1.0",
        v8: "6.7.288.49",
        uv: "1.22.0",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.6.0",
        date: "2018-07-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.1.0",
        v8: "6.7.288.46",
        uv: "1.21.0",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.5.0",
        date: "2018-06-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.1.0",
        v8: "6.7.288.46",
        uv: "1.20.3",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.4.1",
        date: "2018-06-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.1.0",
        v8: "6.7.288.45",
        uv: "1.20.3",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.4.0",
        date: "2018-06-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.1.0",
        v8: "6.7.288.43",
        uv: "1.20.3",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.3.0",
        date: "2018-05-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.1.0",
        v8: "6.6.346.32",
        uv: "1.20.3",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.2.1",
        date: "2018-05-24",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.6.346.32",
        uv: "1.20.3",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.2.0",
        date: "2018-05-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.6.346.32",
        uv: "1.20.3",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.1.0",
        date: "2018-05-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.6.346.27",
        uv: "1.20.2",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v10.0.0",
        date: "2018-04-24",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.6.346.24",
        uv: "1.20.2",
        zlib: "1.2.11",
        openssl: "1.1.0h",
        modules: "64",
        lts: false,
        security: false,
    },
    {
        version: "v9.11.2",
        date: "2018-06-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.2",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.11.1",
        date: "2018-04-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.2",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.11.0",
        date: "2018-04-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.2",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.10.1",
        date: "2018-03-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.2",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.10.0",
        date: "2018-03-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.2",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "59",
        lts: false,
        security: true,
    },
    {
        version: "v9.9.0",
        date: "2018-03-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.2",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.8.0",
        date: "2018-03-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.2",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.7.1",
        date: "2018-03-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.2",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.7.0",
        date: "2018-03-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.2",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.6.1",
        date: "2018-02-23",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.1",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.6.0",
        date: "2018-02-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.1",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.5.0",
        date: "2018-01-31",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.19.1",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.4.0",
        date: "2018-01-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.46",
        uv: "1.18.0",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.3.0",
        date: "2017-12-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.5.1",
        v8: "6.2.414.46",
        uv: "1.18.0",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.2.1",
        date: "2017-12-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.5.1",
        v8: "6.2.414.44",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.2.0",
        date: "2017-11-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.5.1",
        v8: "6.2.414.44",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2m",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.1.0",
        date: "2017-11-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.5.1",
        v8: "6.2.414.32",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2m",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v9.0.0",
        date: "2017-10-31",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.5.1",
        v8: "6.2.414.32",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "59",
        lts: false,
        security: false,
    },
    {
        version: "v8.17.0",
        date: "2019-12-17",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.13.4",
        v8: "6.2.414.78",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.0.2s",
        modules: "57",
        lts: "Carbon",
        security: true,
    },
    {
        version: "v8.16.2",
        date: "2019-10-09",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.2.414.78",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.0.2s",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.16.1",
        date: "2019-08-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.2.414.77",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.0.2r",
        modules: "57",
        lts: "Carbon",
        security: true,
    },
    {
        version: "v8.16.0",
        date: "2019-04-16",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.2.414.77",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.0.2r",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.15.1",
        date: "2019-02-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.2.414.75",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.0.2r",
        modules: "57",
        lts: "Carbon",
        security: true,
    },
    {
        version: "v8.15.0",
        date: "2018-12-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.2.414.75",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.0.2q",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.14.1",
        date: "2018-12-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.2.414.75",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.0.2q",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.14.0",
        date: "2018-11-27",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.2.414.72",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.0.2q",
        modules: "57",
        lts: "Carbon",
        security: true,
    },
    {
        version: "v8.13.0",
        date: "2018-11-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.2.414.72",
        uv: "1.23.2",
        zlib: "1.2.11",
        openssl: "1.0.2p",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.12.0",
        date: "2018-09-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "6.4.1",
        v8: "6.2.414.66",
        uv: "1.19.2",
        zlib: "1.2.11",
        openssl: "1.0.2p",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.11.4",
        date: "2018-08-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.54",
        uv: "1.19.1",
        zlib: "1.2.11",
        openssl: "1.0.2p",
        modules: "57",
        lts: "Carbon",
        security: true,
    },
    {
        version: "v8.11.3",
        date: "2018-06-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.54",
        uv: "1.19.1",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.11.2",
        date: "2018-05-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.54",
        uv: "1.19.1",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.11.1",
        date: "2018-03-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.50",
        uv: "1.19.1",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.11.0",
        date: "2018-03-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.50",
        uv: "1.19.1",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "57",
        lts: "Carbon",
        security: true,
    },
    {
        version: "v8.10.0",
        date: "2018-03-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.2.414.50",
        uv: "1.19.1",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.9.4",
        date: "2018-01-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.6.0",
        v8: "6.1.534.50",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.9.3",
        date: "2017-12-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.5.1",
        v8: "6.1.534.48",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "57",
        lts: "Carbon",
        security: true,
    },
    {
        version: "v8.9.2",
        date: "2017-12-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.5.1",
        v8: "6.1.534.48",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2m",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.9.1",
        date: "2017-11-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.5.1",
        v8: "6.1.534.47",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2m",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.9.0",
        date: "2017-10-31",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.5.1",
        v8: "6.1.534.46",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: "Carbon",
        security: false,
    },
    {
        version: "v8.8.1",
        date: "2017-10-25",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.4.2",
        v8: "6.1.534.42",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.8.0",
        date: "2017-10-24",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.4.2",
        v8: "6.1.534.42",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.7.0",
        date: "2017-10-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.4.2",
        v8: "6.1.534.42",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.6.0",
        date: "2017-09-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.3.0",
        v8: "6.0.287.53",
        uv: "1.14.1",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.5.0",
        date: "2017-09-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.3.0",
        v8: "6.0.287.53",
        uv: "1.14.1",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.4.0",
        date: "2017-08-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.3.0",
        v8: "6.0.286.52",
        uv: "1.13.1",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.3.0",
        date: "2017-08-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.3.0",
        v8: "6.0.286.52",
        uv: "1.13.1",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.2.1",
        date: "2017-07-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.3.0",
        v8: "5.8.283.41",
        uv: "1.13.1",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.2.0",
        date: "2017-07-19",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.3.0",
        v8: "5.8.283.41",
        uv: "1.13.1",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.1.4",
        date: "2017-07-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.0.3",
        v8: "5.8.283.41",
        uv: "1.12.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: true,
    },
    {
        version: "v8.1.3",
        date: "2017-06-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.0.3",
        v8: "5.8.283.41",
        uv: "1.12.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.1.2",
        date: "2017-06-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.0.3",
        v8: "5.8.283.41",
        uv: "1.12.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.1.1",
        date: "2017-06-13",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.0.3",
        v8: "5.8.283.41",
        uv: "1.12.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.1.0",
        date: "2017-06-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.0.3",
        v8: "5.8.283.41",
        uv: "1.12.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v8.0.0",
        date: "2017-05-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "5.0.0",
        v8: "5.8.283.41",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "57",
        lts: false,
        security: false,
    },
    {
        version: "v7.10.1",
        date: "2017-07-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.2.0",
        v8: "5.5.372.43",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: true,
    },
    {
        version: "v7.10.0",
        date: "2017-05-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.2.0",
        v8: "5.5.372.43",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.9.0",
        date: "2017-04-11",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.2.0",
        v8: "5.5.372.43",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.8.0",
        date: "2017-03-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.2.0",
        v8: "5.5.372.43",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.7.4",
        date: "2017-03-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.1.2",
        v8: "5.5.372.42",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.7.3",
        date: "2017-03-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.1.2",
        v8: "5.5.372.41",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.7.2",
        date: "2017-03-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.1.2",
        v8: "5.5.372.41",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.7.1",
        date: "2017-03-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.1.2",
        v8: "5.5.372.41",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.7.0",
        date: "2017-02-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.1.2",
        v8: "5.5.372.41",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.6.0",
        date: "2017-02-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.1.2",
        v8: "5.5.372.40",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.5.0",
        date: "2017-01-31",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.1.2",
        v8: "5.4.500.48",
        uv: "1.10.2",
        zlib: "1.2.8",
        openssl: "1.0.2k",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.4.0",
        date: "2017-01-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "4.0.5",
        v8: "5.4.500.45",
        uv: "1.10.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.3.0",
        date: "2016-12-20",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.4.500.45",
        uv: "1.10.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.2.1",
        date: "2016-12-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.4.500.44",
        uv: "1.10.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.2.0",
        date: "2016-11-22",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.9",
        v8: "5.4.500.43",
        uv: "1.10.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.1.0",
        date: "2016-11-08",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.9",
        v8: "5.4.500.36",
        uv: "1.10.0",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v7.0.0",
        date: "2016-10-25",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.8",
        v8: "5.4.500.36",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "51",
        lts: false,
        security: false,
    },
    {
        version: "v6.17.1",
        date: "2019-04-03",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2r",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.17.0",
        date: "2019-02-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2r",
        modules: "48",
        lts: "Boron",
        security: true,
    },
    {
        version: "v6.16.0",
        date: "2018-12-26",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2q",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.15.1",
        date: "2018-12-03",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2q",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.15.0",
        date: "2018-11-27",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2q",
        modules: "48",
        lts: "Boron",
        security: true,
    },
    {
        version: "v6.14.4",
        date: "2018-08-15",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2p",
        modules: "48",
        lts: "Boron",
        security: true,
    },
    {
        version: "v6.14.3",
        date: "2018-06-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.14.2",
        date: "2018-04-30",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.14.1",
        date: "2018-03-29",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.14.0",
        date: "2018-03-28",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "48",
        lts: "Boron",
        security: true,
    },
    {
        version: "v6.13.1",
        date: "2018-03-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.13.0",
        date: "2018-02-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.16.1",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.12.3",
        date: "2018-01-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.111",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.12.2",
        date: "2017-12-07",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.109",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "48",
        lts: "Boron",
        security: true,
    },
    {
        version: "v6.12.1",
        date: "2017-12-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.109",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2m",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.12.0",
        date: "2017-11-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.108",
        uv: "1.15.0",
        zlib: "1.2.11",
        openssl: "1.0.2m",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.11.5",
        date: "2017-10-24",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.108",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "48",
        lts: "Boron",
        security: true,
    },
    {
        version: "v6.11.4",
        date: "2017-10-03",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.108",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.11.3",
        date: "2017-09-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.107",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.11.2",
        date: "2017-08-01",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.103",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2l",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.11.1",
        date: "2017-07-10",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.103",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "48",
        lts: "Boron",
        security: true,
    },
    {
        version: "v6.11.0",
        date: "2017-06-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.102",
        uv: "1.11.0",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.10.3",
        date: "2017-05-02",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.101",
        uv: "1.9.1",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.10.2",
        date: "2017-04-04",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.98",
        uv: "1.9.1",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.10.1",
        date: "2017-03-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.95",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2k",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.10.0",
        date: "2017-02-21",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.93",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2k",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.9.5",
        date: "2017-01-31",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.89",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2k",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.9.4",
        date: "2017-01-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.89",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.9.3",
        date: "2017-01-05",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.10",
        v8: "5.1.281.89",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.9.2",
        date: "2016-12-06",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.9",
        v8: "5.1.281.88",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.9.1",
        date: "2016-10-19",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.8",
        v8: "5.1.281.84",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.9.0",
        date: "2016-10-18",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.8",
        v8: "5.1.281.84",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "48",
        lts: "Boron",
        security: false,
    },
    {
        version: "v6.8.1",
        date: "2016-10-14",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.8",
        v8: "5.1.281.84",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.8.0",
        date: "2016-10-12",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.8",
        v8: "5.1.281.84",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.7.0",
        date: "2016-09-27",
        files: [
            "aix-ppc64",
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.3",
        v8: "5.1.281.83",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "48",
        lts: false,
        security: true,
    },
    {
        version: "v6.6.0",
        date: "2016-09-14",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-s390x",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.3",
        v8: "5.1.281.83",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.5.0",
        date: "2016-08-26",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.3",
        v8: "5.1.281.81",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.4.0",
        date: "2016-08-12",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.3",
        v8: "5.0.71.60",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.3.1",
        date: "2016-07-21",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.3",
        v8: "5.0.71.57",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.3.0",
        date: "2016-07-06",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.10.3",
        v8: "5.0.71.52",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.2.2",
        date: "2016-06-16",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.9.5",
        v8: "5.0.71.52",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.2.1",
        date: "2016-06-02",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "3.9.3",
        v8: "5.0.71.52",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.2.0",
        date: "2016-05-17",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.8.9",
        v8: "5.0.71.47",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.1.0",
        date: "2016-05-05",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.8.6",
        v8: "5.0.71.35",
        uv: "1.9.0",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v6.0.0",
        date: "2016-04-26",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.8.6",
        v8: "5.0.71.35",
        uv: "1.9.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "48",
        lts: false,
        security: false,
    },
    {
        version: "v5.12.0",
        date: "2016-06-23",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.8.6",
        v8: "4.6.85.32",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.11.1",
        date: "2016-05-05",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.8.6",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.11.0",
        date: "2016-04-21",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.8.6",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.10.1",
        date: "2016-04-05",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.8.3",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.10.0",
        date: "2016-04-01",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.8.3",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.9.1",
        date: "2016-03-22",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.7.3",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.9.0",
        date: "2016-03-16",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.7.3",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.8.0",
        date: "2016-03-09",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.7.3",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.7.1",
        date: "2016-03-02",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.6.0",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.7.0",
        date: "2016-02-23",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.6.0",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2f",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.6.0",
        date: "2016-02-09",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.6.0",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2f",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.5.0",
        date: "2016-01-21",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.3.12",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2e",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.4.1",
        date: "2016-01-12",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.3.12",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2e",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.4.0",
        date: "2016-01-06",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.3.12",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2e",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.3.0",
        date: "2015-12-15",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.3.12",
        v8: "4.6.85.31",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2e",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.2.0",
        date: "2015-12-09",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.3.12",
        v8: "4.6.85.31",
        uv: "1.7.5",
        zlib: "1.2.8",
        openssl: "1.0.2e",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.1.1",
        date: "2015-12-03",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.3.12",
        v8: "4.6.85.31",
        uv: "1.7.5",
        zlib: "1.2.8",
        openssl: "1.0.2e",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.1.0",
        date: "2015-11-17",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.3.12",
        v8: "4.6.85.31",
        uv: "1.7.5",
        zlib: "1.2.8",
        openssl: "1.0.2d",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v5.0.0",
        date: "2015-10-29",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "3.3.6",
        v8: "4.6.85.28",
        uv: "1.7.5",
        zlib: "1.2.8",
        openssl: "1.0.2d",
        modules: "47",
        lts: false,
        security: false,
    },
    {
        version: "v4.9.1",
        date: "2018-03-29",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.53",
        uv: "1.9.1",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.9.0",
        date: "2018-03-28",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.53",
        uv: "1.9.1",
        zlib: "1.2.11",
        openssl: "1.0.2o",
        modules: "46",
        lts: "Argon",
        security: true,
    },
    {
        version: "v4.8.7",
        date: "2017-12-07",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.53",
        uv: "1.9.1",
        zlib: "1.2.11",
        openssl: "1.0.2n",
        modules: "46",
        lts: "Argon",
        security: true,
    },
    {
        version: "v4.8.6",
        date: "2017-11-06",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.53",
        uv: "1.9.1",
        zlib: "1.2.11",
        openssl: "1.0.2m",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.8.5",
        date: "2017-10-24",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.47",
        uv: "1.9.1",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "46",
        lts: "Argon",
        security: true,
    },
    {
        version: "v4.8.4",
        date: "2017-07-11",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.47",
        uv: "1.9.1",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "46",
        lts: "Argon",
        security: true,
    },
    {
        version: "v4.8.3",
        date: "2017-05-02",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.47",
        uv: "1.9.1",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.8.2",
        date: "2017-04-04",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.46",
        uv: "1.9.1",
        zlib: "1.2.11",
        openssl: "1.0.2k",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.8.1",
        date: "2017-03-21",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.46",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2k",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.8.0",
        date: "2017-02-21",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.45",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2k",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.7.3",
        date: "2017-01-31",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.43",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2k",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.7.2",
        date: "2017-01-05",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.43",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.7.1",
        date: "2017-01-05",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.43",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.7.0",
        date: "2016-12-06",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.43",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.6.2",
        date: "2016-11-08",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.11",
        v8: "4.5.103.42",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.6.1",
        date: "2016-10-18",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.9",
        v8: "4.5.103.37",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "46",
        lts: "Argon",
        security: true,
    },
    {
        version: "v4.6.0",
        date: "2016-09-27",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.9",
        v8: "4.5.103.37",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2j",
        modules: "46",
        lts: "Argon",
        security: true,
    },
    {
        version: "v4.5.0",
        date: "2016-08-16",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-7z",
            "win-x64-exe",
            "win-x64-msi",
            "win-x64-zip",
            "win-x86-7z",
            "win-x86-exe",
            "win-x86-msi",
            "win-x86-zip",
        ],
        npm: "2.15.9",
        v8: "4.5.103.37",
        uv: "1.9.1",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.4.7",
        date: "2016-06-28",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.8",
        v8: "4.5.103.36",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.4.6",
        date: "2016-06-23",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.5",
        v8: "4.5.103.36",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.4.5",
        date: "2016-05-24",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.5",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.4.4",
        date: "2016-05-05",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.1",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2h",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.4.3",
        date: "2016-04-12",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.1",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.4.2",
        date: "2016-04-01",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.0",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.4.1",
        date: "2016-03-22",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.20",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.4.0",
        date: "2016-03-08",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.20",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.3.2",
        date: "2016-03-02",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-ppc64le",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.12",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2g",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.3.1",
        date: "2016-02-16",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.12",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2f",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.3.0",
        date: "2016-02-09",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.12",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2f",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.2.6",
        date: "2016-01-21",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.12",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2e",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.2.5",
        date: "2016-01-20",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.12",
        v8: "4.5.103.35",
        uv: "1.8.0",
        zlib: "1.2.8",
        openssl: "1.0.2e",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.2.4",
        date: "2015-12-23",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.12",
        v8: "4.5.103.35",
        uv: "1.7.5",
        zlib: "1.2.8",
        openssl: "1.0.2e",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.2.3",
        date: "2015-12-03",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.7",
        v8: "4.5.103.35",
        uv: "1.7.5",
        zlib: "1.2.8",
        openssl: "1.0.2e",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.2.2",
        date: "2015-11-03",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.7",
        v8: "4.5.103.35",
        uv: "1.7.5",
        zlib: "1.2.8",
        openssl: "1.0.2d",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.2.1",
        date: "2015-10-13",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.7",
        v8: "4.5.103.35",
        uv: "1.7.5",
        zlib: "1.2.8",
        openssl: "1.0.2d",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.2.0",
        date: "2015-10-12",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.7",
        v8: "4.5.103.35",
        uv: "1.7.5",
        zlib: "1.2.8",
        openssl: "1.0.2d",
        modules: "46",
        lts: "Argon",
        security: false,
    },
    {
        version: "v4.1.2",
        date: "2015-10-05",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.4",
        v8: "4.5.103.35",
        uv: "1.7.5",
        zlib: "1.2.8",
        openssl: "1.0.2d",
        modules: "46",
        lts: false,
        security: false,
    },
    {
        version: "v4.1.1",
        date: "2015-09-23",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.4",
        v8: "4.5.103.33",
        uv: "1.7.4",
        zlib: "1.2.8",
        openssl: "1.0.2d",
        modules: "46",
        lts: false,
        security: false,
    },
    {
        version: "v4.1.0",
        date: "2015-09-17",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.3",
        v8: "4.5.103.33",
        uv: "1.7.4",
        zlib: "1.2.8",
        openssl: "1.0.2d",
        modules: "46",
        lts: false,
        security: false,
    },
    {
        version: "v4.0.0",
        date: "2015-09-08",
        files: [
            "headers",
            "linux-arm64",
            "linux-armv6l",
            "linux-armv7l",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.2",
        v8: "4.5.103.30",
        uv: "1.7.3",
        zlib: "1.2.8",
        openssl: "1.0.2d",
        modules: "46",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.18",
        date: "2017-02-22",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.11",
        v8: "3.28.71.20",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1u",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.17",
        date: "2016-10-18",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.1",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1u",
        modules: "14",
        lts: false,
        security: true,
    },
    {
        version: "v0.12.16",
        date: "2016-09-27",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.1",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1u",
        modules: "14",
        lts: false,
        security: true,
    },
    {
        version: "v0.12.15",
        date: "2016-06-23",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.1",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1t",
        modules: "14",
        lts: false,
        security: true,
    },
    {
        version: "v0.12.14",
        date: "2016-05-06",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.1",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1t",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.13",
        date: "2016-03-31",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.0",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1s",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.12",
        date: "2016-03-08",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.9",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1s",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.11",
        date: "2016-03-03",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.9",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1s",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.10",
        date: "2016-02-09",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.9",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1r",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.9",
        date: "2015-12-03",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.9",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1q",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.8",
        date: "2015-11-24",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.14.9",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1p",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.7",
        date: "2015-07-09",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.11.3",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1p",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.6",
        date: "2015-07-04",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.11.2",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1o",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.5",
        date: "2015-06-22",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.11.2",
        v8: "3.28.71.19",
        uv: "1.6.1",
        zlib: "1.2.8",
        openssl: "1.0.1o",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.4",
        date: "2015-05-23",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.10.1",
        v8: "3.28.71.19",
        uv: "1.5.0",
        zlib: "1.2.8",
        openssl: "1.0.1m",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.3",
        date: "2015-05-14",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.9.1",
        v8: "3.28.71.19",
        uv: "1.5.0",
        zlib: "1.2.8",
        openssl: "1.0.1m",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.2",
        date: "2015-03-31",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.7.4",
        v8: "3.28.73.0",
        uv: "1.4.2",
        zlib: "1.2.8",
        openssl: "1.0.1m",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.1",
        date: "2015-03-24",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.5.1",
        v8: "3.28.73.0",
        uv: "1.0.2",
        zlib: "1.2.8",
        openssl: "1.0.1m",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.12.0",
        date: "2015-02-06",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.5.1",
        v8: "3.28.73.0",
        uv: "1.0.2",
        zlib: "1.2.8",
        openssl: "1.0.1l",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.16",
        date: "2015-01-30",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.3.0",
        v8: "3.28.73.0",
        uv: "1.0.2",
        zlib: "1.2.8",
        openssl: "1.0.1l",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.15",
        date: "2015-01-20",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.1.6",
        v8: "3.28.73.0",
        uv: "1.0.2",
        zlib: "1.2.8",
        openssl: "1.0.1j",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.14",
        date: "2014-08-19",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.0.0",
        v8: "3.26.33.0",
        uv: "1.0.0",
        zlib: "1.2.3",
        openssl: "1.0.1i",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.13",
        date: "2014-05-02",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.9",
        v8: "3.25.30.0",
        uv: "0.11.25",
        zlib: "1.2.3",
        openssl: "1.0.1g",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.12",
        date: "2014-03-11",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.3",
        v8: "3.22.24.19",
        uv: "0.11.22",
        zlib: "1.2.3",
        openssl: "1.0.1f",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.11",
        date: "2014-01-29",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.25",
        v8: "3.22.24.19",
        uv: "0.11.18",
        zlib: "1.2.3",
        openssl: "1.0.1f",
        modules: "14",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.10",
        date: "2013-12-31",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.22",
        v8: "3.22.24.10",
        uv: "0.11.17",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "13",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.9",
        date: "2013-11-21",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.15",
        v8: "3.22.24.5",
        uv: "0.11.15",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "13",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.8",
        date: "2013-10-30",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.13",
        v8: "3.21.18.3",
        uv: "0.11.14",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "13",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.7",
        date: "2013-09-04",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.8",
        v8: "3.20.17.0",
        uv: "0.11.13",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000C",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.6",
        date: "2013-08-21",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x86-msi",
        ],
        npm: "1.3.8",
        v8: "3.20.14.1",
        uv: "0.11.8",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000C",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.5",
        date: "2013-08-07",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.6",
        v8: "3.20.11.0",
        uv: "0.11.7",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000C",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.4",
        date: "2013-07-12",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x86-msi",
        ],
        npm: "1.3.4",
        v8: "3.20.2.0",
        uv: "0.11.5",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000C",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.3",
        date: "2013-06-26",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.25",
        v8: "3.19.13.0",
        uv: "0.11.5",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000C",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.2",
        date: "2013-05-13",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.21",
        v8: "3.19.0.0",
        uv: "0.11.2",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000C",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.1",
        date: "2013-04-19",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.18",
        v8: "3.18.0.0",
        uv: "0.11.1",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000C",
        lts: false,
        security: false,
    },
    {
        version: "v0.11.0",
        date: "2013-03-28",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.15",
        v8: "3.17.13.0",
        uv: "0.10.3",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000C",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.48",
        date: "2016-10-18",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.1",
        v8: "3.14.5.11",
        uv: "0.10.37",
        zlib: "1.2.8",
        openssl: "1.0.1u",
        modules: "11",
        lts: false,
        security: true,
    },
    {
        version: "v0.10.47",
        date: "2016-09-27",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.1",
        v8: "3.14.5.11",
        uv: "0.10.37",
        zlib: "1.2.8",
        openssl: "1.0.1u",
        modules: "11",
        lts: false,
        security: true,
    },
    {
        version: "v0.10.46",
        date: "2016-06-23",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.1",
        v8: "3.14.5.9",
        uv: "0.10.37",
        zlib: "1.2.8",
        openssl: "1.0.1t",
        modules: "11",
        lts: false,
        security: true,
    },
    {
        version: "v0.10.45",
        date: "2016-05-06",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.1",
        v8: "3.14.5.9",
        uv: "0.10.36",
        zlib: "1.2.8",
        openssl: "1.0.1t",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.44",
        date: "2016-03-31",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "2.15.0",
        v8: "3.14.5.9",
        uv: "0.10.36",
        zlib: "1.2.8",
        openssl: "1.0.1s",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.43",
        date: "2016-03-03",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.29",
        v8: "3.14.5.9",
        uv: "0.10.36",
        zlib: "1.2.8",
        openssl: "1.0.1s",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.42",
        date: "2016-02-09",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.29",
        v8: "3.14.5.9",
        uv: "0.10.36",
        zlib: "1.2.8",
        openssl: "1.0.1r",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.41",
        date: "2015-12-03",
        files: [
            "headers",
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.29",
        v8: "3.14.5.9",
        uv: "0.10.36",
        zlib: "1.2.8",
        openssl: "1.0.1q",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.40",
        date: "2015-07-09",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.28",
        v8: "3.14.5.9",
        uv: "0.10.36",
        zlib: "1.2.8",
        openssl: "1.0.1p",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.39",
        date: "2015-06-19",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.28",
        v8: "3.14.5.9",
        uv: "0.10.36",
        zlib: "1.2.8",
        openssl: "1.0.1o",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.38",
        date: "2015-03-23",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.28",
        v8: "3.14.5.9",
        uv: "0.10.36",
        zlib: "1.2.8",
        openssl: "1.0.1m",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.37",
        date: "2015-03-11",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.28",
        v8: "3.14.5.9",
        uv: "0.10.36",
        zlib: "1.2.8",
        openssl: "1.0.1l",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.36",
        date: "2015-01-26",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.28",
        v8: "3.14.5.9",
        uv: "0.10.30",
        zlib: "1.2.8",
        openssl: "1.0.1l",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.35",
        date: "2014-12-22",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.28",
        v8: "3.14.5.9",
        uv: "0.10.30",
        zlib: "1.2.8",
        openssl: "1.0.1j",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.34",
        date: "2014-12-17",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.28",
        v8: "3.14.5.9",
        uv: "0.10.30",
        zlib: "1.2.8",
        openssl: "1.0.1j",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.33",
        date: "2014-10-21",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.28",
        v8: "3.14.5.9",
        uv: "0.10.29",
        zlib: "1.2.3",
        openssl: "1.0.1j",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.32",
        date: "2014-09-16",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.28",
        v8: "3.14.5.9",
        uv: "0.10.28",
        zlib: "1.2.3",
        openssl: "1.0.1i",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.31",
        date: "2014-08-19",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.23",
        v8: "3.14.5.9",
        uv: "0.10.28",
        zlib: "1.2.3",
        openssl: "1.0.1i",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.30",
        date: "2014-07-31",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.21",
        v8: "3.14.5.9",
        uv: "0.10.28",
        zlib: "1.2.3",
        openssl: "1.0.1h",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.29",
        date: "2014-06-09",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.14",
        v8: "3.14.5.9",
        uv: "0.10.27",
        zlib: "1.2.3",
        openssl: "1.0.1h",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.28",
        date: "2014-05-02",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.9",
        v8: "3.14.5.9",
        uv: "0.10.27",
        zlib: "1.2.3",
        openssl: "1.0.1g",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.27",
        date: "2014-05-01",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.8",
        v8: "3.14.5.9",
        uv: "0.10.27",
        zlib: "1.2.3",
        openssl: "1.0.1g",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.26",
        date: "2014-02-18",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.4.3",
        v8: "3.14.5.9",
        uv: "0.10.25",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.25",
        date: "2014-01-23",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.24",
        v8: "3.14.5.9",
        uv: "0.10.23",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.24",
        date: "2013-12-19",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.21",
        v8: "3.14.5.9",
        uv: "0.10.21",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.23",
        date: "2013-12-12",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.17",
        v8: "3.14.5.9",
        uv: "0.10.20",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.22",
        date: "2013-11-12",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.14",
        v8: "3.14.5.9",
        uv: "0.10.19",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.21",
        date: "2013-10-18",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.11",
        v8: "3.14.5.9",
        uv: "0.10.18",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.20",
        date: "2013-09-30",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.11",
        v8: "3.14.5.9",
        uv: "0.10.17",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.19",
        date: "2013-09-24",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.11",
        v8: "3.14.5.9",
        uv: "0.10.17",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.18",
        date: "2013-09-04",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.8",
        v8: "3.14.5.9",
        uv: "0.10.15",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.17",
        date: "2013-08-21",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.8",
        v8: "3.14.5.9",
        uv: "0.10.14",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.16",
        date: "2013-08-16",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.8",
        v8: "3.14.5.9",
        uv: "0.10.13",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.15",
        date: "2013-07-25",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.5",
        v8: "3.14.5.9",
        uv: "0.10.13",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.14",
        date: "2013-07-25",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.5",
        v8: "3.14.5.9",
        uv: "0.10.13",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.13",
        date: "2013-07-09",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.3.2",
        v8: "3.14.5.9",
        uv: "0.10.12",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.12",
        date: "2013-06-18",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.32",
        v8: "3.14.5.9",
        uv: "0.10.11",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.11",
        date: "2013-06-13",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.30",
        v8: "3.14.5.9",
        uv: "0.10.11",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.10",
        date: "2013-06-04",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.25",
        v8: "3.14.5.9",
        uv: "0.10.10",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.9",
        date: "2013-05-30",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.24",
        v8: "3.14.5.9",
        uv: "0.10.9",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.8",
        date: "2013-05-24",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.23",
        v8: "3.14.5.9",
        uv: "0.10.8",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.7",
        date: "2013-05-17",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.21",
        v8: "3.14.5.8",
        uv: "0.10.7",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.6",
        date: "2013-05-14",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.18",
        v8: "3.14.5.8",
        uv: "0.10.5",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.5",
        date: "2013-04-23",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.18",
        v8: "3.14.5.8",
        uv: "0.10.5",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.4",
        date: "2013-04-11",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.18",
        v8: "3.14.5.8",
        uv: "0.10.4",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "11",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.3",
        date: "2013-04-03",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.17",
        v8: "3.14.5.8",
        uv: "0.10.3",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000B",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.2",
        date: "2013-03-28",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.15",
        v8: "3.14.5.8",
        uv: "0.10.3",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000B",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.1",
        date: "2013-03-21",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.15",
        v8: "3.14.5.8",
        uv: "0.10",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000B",
        lts: false,
        security: false,
    },
    {
        version: "v0.10.0",
        date: "2013-03-11",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.14",
        v8: "3.14.5.8",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000B",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.12",
        date: "2013-03-06",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.12",
        v8: "3.14.5.8",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000B",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.11",
        date: "2013-03-01",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.12",
        v8: "3.14.5.0",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1e",
        modules: "0x000B",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.10",
        date: "2013-02-19",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.12",
        v8: "3.15.11.15",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1c",
        modules: "0x000B",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.9",
        date: "2013-02-07",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.10",
        v8: "3.15.11.10",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1c",
        modules: "0x000B",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.8",
        date: "2013-01-24",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.3",
        v8: "3.15.11.10",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1c",
        modules: "0x000A",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.7",
        date: "2013-01-18",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.2",
        v8: "3.15.11.7",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1c",
        modules: "0x000A",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.6",
        date: "2013-01-11",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.0",
        v8: "3.15.11.5",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1c",
        modules: "0x000A",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.5",
        date: "2012-12-30",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.70",
        v8: "3.13.7.4",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1c",
        modules: "0x000A",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.4",
        date: "2012-12-21",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.70",
        v8: "3.13.7.4",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1c",
        modules: "0x000A",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.3",
        date: "2012-10-24",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.64",
        v8: "3.13.7.4",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1c",
        modules: "0x000A",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.2",
        date: "2012-09-17",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.61",
        v8: "3.11.10.22",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.1c",
        modules: "0x000A",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.1",
        date: "2012-08-28",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.59",
        v8: "3.11.10.19",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "0x000A",
        lts: false,
        security: false,
    },
    {
        version: "v0.9.0",
        date: "2012-07-20",
        files: [
            "osx-x64-pkg",
            "src",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.44",
        v8: "3.11.10.15",
        uv: "0.9",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.28",
        date: "2014-07-31",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.30",
        v8: "3.11.10.26",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.27",
        date: "2014-06-09",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x86-msi",
        ],
        npm: "1.2.30",
        v8: "3.11.10.26",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.26",
        date: "2013-10-18",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.30",
        v8: "3.11.10.26",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.25",
        date: "2013-06-13",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.30",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.24",
        date: "2013-06-03",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.24",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.23",
        date: "2013-04-09",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.18",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.22",
        date: "2013-03-06",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.14",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.21",
        date: "2013-02-25",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.11",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.20",
        date: "2013-02-15",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.11",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.19",
        date: "2013-02-06",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.10",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.18",
        date: "2013-01-18",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.2",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.17",
        date: "2013-01-10",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.2.0",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.16",
        date: "2012-12-12",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.69",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.15",
        date: "2012-11-26",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.66",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.14",
        date: "2012-10-25",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.65",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.13",
        date: "2012-10-25",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.65",
        v8: "3.11.10.25",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.12",
        date: "2012-10-11",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.63",
        v8: "3.11.10.22",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.11",
        date: "2012-09-27",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.62",
        v8: "3.11.10.22",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.10",
        date: "2012-09-25",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.62",
        v8: "3.11.10.22",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.9",
        date: "2012-09-11",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.61",
        v8: "3.11.10.22",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.8",
        date: "2012-08-22",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.59",
        v8: "3.11.10.19",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.7",
        date: "2012-08-15",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.49",
        v8: "3.11.10.17",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.6",
        date: "2012-08-06",
        files: [
            "linux-x64",
            "linux-x86",
            "osx-x64-pkg",
            "osx-x64-tar",
            "osx-x86-tar",
            "src",
            "sunos-x64",
            "sunos-x86",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.48",
        v8: "3.11.10.17",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.5",
        date: "2012-08-02",
        files: [
            "osx-x64-pkg",
            "src",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.46",
        v8: "3.11.10.17",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.4",
        date: "2012-07-24",
        files: [
            "osx-x64-pkg",
            "src",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.45",
        v8: "3.11.10.17",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.3",
        date: "2012-07-17",
        files: [
            "osx-x64-pkg",
            "src",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.43",
        v8: "3.11.10.15",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.2",
        date: "2012-07-09",
        files: [
            "osx-x64-pkg",
            "src",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.36",
        v8: "3.11.10.14",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.1",
        date: "2012-06-29",
        files: [
            "osx-x64-pkg",
            "src",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.33",
        v8: "3.11.10.12",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.8.0",
        date: "2012-06-22",
        files: [
            "osx-x64-pkg",
            "src",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.32",
        v8: "3.11.10.10",
        uv: "0.8",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.12",
        date: "2012-06-19",
        files: [
            "osx-x64-pkg",
            "src",
            "win-x64-exe",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.30",
        v8: "3.11.10.0",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.11",
        date: "2012-06-15",
        files: [
            "osx-x64-pkg",
            "src",
            "win-x64-exe",
            "win-x64-msi",
            "win-x86-exe",
            "win-x86-msi",
        ],
        npm: "1.1.26",
        v8: "3.11.10.0",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.10",
        date: "2012-06-11",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.25",
        v8: "3.9.24.31",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.9",
        date: "2012-05-29",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.23",
        v8: "3.11.1.0",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.8",
        date: "2012-04-18",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.18",
        v8: "3.9.24.9",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "1.0.0f",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.7",
        date: "2012-03-30",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.15",
        v8: "3.9.24.7",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.6",
        date: "2012-03-13",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.8",
        v8: "3.9.17.0",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.5",
        date: "2012-02-23",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.1",
        v8: "3.9.5.0",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.4",
        date: "2012-02-14",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.1",
        v8: "3.9.5.0",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.3",
        date: "2012-02-07",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-3",
        v8: "3.9.2.0",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.2",
        date: "2012-02-01",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-3",
        v8: "3.8.9.0",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.1",
        date: "2012-01-23",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-2",
        v8: "3.8.8.0",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.7.0",
        date: "2012-01-17",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-2",
        v8: "3.8.6.0",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.21",
        date: "2012-08-03",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.37",
        v8: "3.6.6.25",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.20",
        date: "2012-07-10",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.37",
        v8: "3.6.6.25",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.19",
        date: "2012-06-06",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.24",
        v8: "3.6.6.25",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.18",
        date: "2012-05-14",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.21",
        v8: "3.6.6.25",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.17",
        date: "2012-05-04",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.21",
        v8: "3.6.6.25",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.16",
        date: "2012-04-27",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.19",
        v8: "3.6.6.25",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.15",
        date: "2012-04-08",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.16",
        v8: "3.6.6.24",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.14",
        date: "2012-03-23",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.12",
        v8: "3.6.6.24",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.13",
        date: "2012-03-15",
        files: ["osx-x64-pkg", "src", "win-x64-exe", "win-x86-exe"],
        npm: "1.1.9",
        v8: "3.6.6.24",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.12",
        date: "2012-03-02",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.4",
        v8: "3.6.6.24",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.11",
        date: "2012-02-08",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.1",
        v8: "3.6.6.20",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.10",
        date: "2012-02-03",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-3",
        v8: "3.6.6.20",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.9",
        date: "2012-01-27",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-3",
        v8: "3.6.6.19",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.8",
        date: "2012-01-20",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-2",
        v8: "3.6.6.19",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.7",
        date: "2012-01-07",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-beta-10",
        v8: "3.6.6.15",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.6",
        date: "2011-12-15",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-beta-4",
        v8: "3.6.6.14",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.5",
        date: "2011-12-04",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-alpha-6",
        v8: "3.6.6.11",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.4",
        date: "2011-12-02",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-alpha-6",
        v8: "3.6.6.8",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.3",
        date: "2011-11-25",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        npm: "1.1.0-alpha-2",
        v8: "3.6.6.8",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.2",
        date: "2011-11-18",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        v8: "3.6.6.8",
        uv: "0.6",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.1",
        date: "2011-11-11",
        files: ["osx-x64-pkg", "src", "win-x86-exe"],
        v8: "3.6.6.7",
        uv: "0.1",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.6.0",
        date: "2011-11-04",
        files: ["src", "win-x86-exe"],
        v8: "3.6.6.6",
        uv: "0.1",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.10",
        date: "2011-10-22",
        files: ["src", "win-x86-exe"],
        v8: "3.7.0.0",
        uv: "0.1",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.9",
        date: "2011-10-11",
        files: ["src", "win-x86-exe"],
        v8: "3.6.4.0",
        uv: "0.1",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.8",
        date: "2011-09-30",
        files: ["src", "win-x86-exe"],
        v8: "3.6.4.0",
        uv: "0.1",
        zlib: "1.2.3",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.7",
        date: "2011-09-16",
        files: ["src", "win-x86-exe"],
        v8: "3.6.4.0",
        uv: "0.1",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.6",
        date: "2011-08-26",
        files: ["src", "win-x86-exe"],
        v8: "3.6.2.0",
        uv: "0.1",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.5",
        date: "2011-08-26",
        files: ["src", "win-x86-exe"],
        v8: "3.5.8.0",
        uv: "0.1",
        openssl: "0.9.8r",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.4",
        date: "2011-08-26",
        files: ["src", "win-x86-exe"],
        v8: "3.5.4.3",
        uv: "0.1",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.3",
        date: "2011-08-26",
        files: ["src", "win-x86-exe"],
        v8: "3.4.14.0",
        uv: "0.1",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.2",
        date: "2011-08-26",
        files: ["src", "win-x86-exe"],
        v8: "3.4.14.0",
        uv: "0.1",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.1",
        date: "2011-08-26",
        files: ["src", "win-x86-exe"],
        v8: "3.4.10.0",
        uv: "0.1",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.5.0",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.25",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.12",
        date: "2011-09-15",
        files: ["src"],
        v8: "3.1.8.26",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.11",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.26",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.10",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.26",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.9",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.25",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.8",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.16",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.7",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.10",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.6",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.10",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.5",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.8",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.4",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.5",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.3",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.3",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.2",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.8.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.1",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.5.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.4.0",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.2.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.3.8",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.1.1.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.3.7",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.0.10.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.3.6",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.0.9.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.3.5",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.0.4.1",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.3.4",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.0.4.1",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.3.3",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.0.4.1",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.3.2",
        date: "2011-08-26",
        files: ["src"],
        v8: "3.0.3.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.3.1",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.5.3.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.3.0",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.5.1.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.2.6",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.8.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.2.5",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.8.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.2.4",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.8.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.2.3",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.8.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.2.2",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.8.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.2.1",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.8.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.2.0",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.8.0",
        modules: "1",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.104",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.6.1",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.103",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.5.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.102",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.2.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.101",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.3.0.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.100",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.21.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.99",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.18.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.98",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.16.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.97",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.12.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.96",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.95",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.94",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.8.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.93",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.6.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.92",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.4.2",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.91",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.3.1",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.90",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.2.0.3",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.33",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.1.6.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.32",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.1.3.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.31",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.1.2.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.30",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.1.1.1",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.29",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.1.0.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.28",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.1.0.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.27",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.1.0.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.26",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.0.6.1",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.25",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.0.5.4",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.24",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.0.5.4",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.23",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.0.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.22",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.0.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.21",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.0.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.20",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.0.2.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.19",
        date: "2011-08-26",
        files: ["src"],
        v8: "2.0.2.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.18",
        date: "2011-08-26",
        files: ["src"],
        v8: "1.3.18.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.17",
        date: "2011-08-26",
        files: ["src"],
        v8: "1.3.18.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.16",
        date: "2011-08-26",
        files: ["src"],
        v8: "1.3.18.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.15",
        date: "2011-08-26",
        files: ["src"],
        v8: "1.3.16.0",
        lts: false,
        security: false,
    },
    {
        version: "v0.1.14",
        date: "2011-08-26",
        files: ["src"],
        v8: "1.3.15.0",
        lts: false,
        security: false,
    },
]

const nodeVersions = versions.map((version) => ({
    ...version,
    name: "Node.js",
    url: "https://nodejs.org/download/release/" + version.version + "/",
}))

;// CONCATENATED MODULE: ./node.js











class Node extends tool/* default */.Z {
    static tool = "node"
    static envVar = "NODENV_ROOT"
    static envPaths = ["bin", "shims"]
    static installer = "nodenv"

    constructor() {
        super(Node.tool)
    }

    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = await this.getNodeVersion(
            desiredVersion,
        )
        if (!(await this.haveVersion(checkVersion))) {
            if (checkVersion) {
                // Ensure yarn is present as well, but don't error if it breaks
                await this.installYarn().catch(() => {})
            }
            return checkVersion
        }

        // Check if nodenv exists and can be run, and capture the version info while
        // we're at it, should be pre-installed on self-hosted runners.
        await this.findInstaller()

        // Update nodeenv versions in case the user is requesting a node version
        // that did not exist when nodenenv was installed
        const updateVersionsCommand = `${this.installer} update-version-defs`
        // Remove NODENV related vars from the environment, as when running
        // nodenv it will pick them and try to use the specified node version
        // which can lead into issues if that node version does not exist
        // eslint-disable-next-line no-unused-vars
        const { NODENV_VERSION, ...envWithoutNodenv } = process.env
        await this.subprocessShell(updateVersionsCommand, {
            // Run the cmd in a tmp file so that nodenv doesn't pick any .node-version file in the repo with an unknown
            // node version
            cwd: process.env.RUNNER_TEMP,
            env: { ...envWithoutNodenv, ...this.getEnv() },
        }).catch((error) => {
            this.warning(
                `Failed to update nodenv version refs, install may fail`,
            )
            if (error.stderr) {
                this.debug(error.stderr)
            }
        })

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            core.exportVariable("NODENV_VERSION", checkVersion)
        }

        // Install the desired version as it was not in the system
        const installCommand = `${this.installer} install -s ${checkVersion}`
        await this.subprocessShell(installCommand).catch(
            this.logAndExit(`failed to install node version ${checkVersion}`),
        )

        // Sanity check that the node command works and its reported version matches what we have
        // requested to be in place.
        await this.validateVersion(checkVersion)

        // Could make this conditional? But for right now we always install `yarn`
        await this.installYarn()

        // If we got this far, we have successfully configured node.
        this.info("node success!")
        return checkVersion
    }

    /**
     * Download Node version data. If requests fail, use a local file
     * @returns {Promise<void>}
     */
    getVersionData() {
        // this is a temporary fix
        // TODO: find a way to fetch latest list of node-versions
        return nodeVersions
    }

    /**
     * Given an nvmrc node version spec, convert it to a SemVer node version
     * @param {String} fileName File where to look for the node version
     * @returns {Promise<string | undefined>} Parsed version
     */
    async parseNvmrcVersion(fileName) {
        const nodeVersion = this.getVersion(null, fileName)[0]
        if (!nodeVersion) {
            return undefined
        }
        // Versions are sorted from newest to oldest
        const versionData = this.getVersionData()
        let version
        if (/^lts\/.*/i.test(nodeVersion)) {
            if (nodeVersion === "lts/*") {
                // We just want the latest LTS
                version = versionData.find((v) => v.lts !== false)?.version
            } else {
                version = versionData.find(
                    (v) =>
                        nodeVersion.substring(4).toLowerCase() ===
                        (v.lts || "").toLowerCase(),
                )?.version
            }
        } else if (nodeVersion === "node") {
            // We need the latest version
            version = versionData[0].version
        } else {
            // This could be a full or a partial version, so use partial matching
            version = versionData.find((v) =>
                v.version.startsWith(`v${nodeVersion}`),
            )?.version
        }
        if (version !== undefined) {
            return (0,find_versions/* default */.Z)(version)[0]
        }
        throw new Error(`Could not parse Node version "${nodeVersion}"`)
    }

    /**
     * Return a [version, override] pair where version is the SemVer string
     * and the override is a boolean indicating the version must be manually set
     * for installs.
     *
     * If a desired version is specified the function returns this one. If not,
     * it will look for a .node-version or a .nvmrc file (in this order) to extract
     * the desired node version
     *
     * It is expected that these files follow the NVM spec: https://github.com/nvm-sh/nvm#nvmrc
     * @param [desiredVersion] Desired node version
     * @returns {Promise<[string | null, boolean | null]>} Resolved node version
     */
    async getNodeVersion(desiredVersion) {
        // If we're given a version, it's the one we want
        if (desiredVersion) return [desiredVersion, true]

        // If .node-version is present, it's the one we want, and it's not
        // considered an override
        const nodeVersion = await this.parseNvmrcVersion(".node-version")
        if (nodeVersion) {
            return [nodeVersion, false]
        }

        // If .nvmrc is present, we fall back to it
        const nvmrcVersion = await this.parseNvmrcVersion(".nvmrc")
        if (nvmrcVersion) {
            // In this case we want to override the version, as nodenv is not aware of this file
            // and we want to use it
            return [nvmrcVersion, true]
        }

        // Otherwise we have no node
        return [null, null]
    }

    /**
     * Download and configures nodenv.
     *
     * @param  {string} root - Directory to install nodenv into (NODENV_ROOT).
     * @return {string} The value of NODENV_ROOT.
     */
    async install(root) {
        external_assert_(root, "root is required")
        // Build our URLs
        const gh = `https://${process.env.GITHUB_SERVER || "github.com"}/nodenv`
        const url = {}
        url.nodenv = `${gh}/nodenv/archive/refs/heads/master.tar.gz`
        url.nodebulid = `${gh}/node-build/archive/refs/heads/master.tar.gz`
        url.nodedoctor = `${gh}/nodenv-installer/raw/master/bin/nodenv-doctor`

        root = await this.downloadTool(url.nodenv, { dest: root, strip: 1 })
        this.info(`Downloaded nodenv to ${root}`)

        await this.downloadTool(url.nodebulid, external_path_.join(root, "plugins"))
        this.info(`Downloaded node-build to ${root}/plugins`)

        const doctor = await this.downloadTool(url.nodedoctor)
        this.info(`Downloaded node-doctor to ${doctor}`)

        // Create environment for running node-doctor
        await this.setEnv(root)
        await this.subprocessShell(`bash ${doctor}`)

        // Asynchronously clean up the downloaded doctor script
        promises_.rm(doctor, { recursive: true }).catch(() => {})

        return root
    }

    /**
     * Run `npm install -g yarn` and `nodenv rehash` to ensure `yarn` is on the CLI.
     */
    async installYarn() {
        // Check for an existing version
        let yarnVersion = await this.version("yarn --version", {
            soft: true,
        }).catch(() => {})
        if (yarnVersion) {
            this.debug(`yarn is already installed (${yarnVersion})`)
            return
        }

        // Installing yarn with npm, which if this errors means ... things are
        // badly broken?
        this.info("Installing yarn")
        await this.subprocessShell("npm install -g yarn")

        // Just run `nodenv rehash` always and ignore errors because we might be
        // in a setup-node environment that doesn't have nodenv
        this.info("Rehashing node shims")
        await this.subprocessShell("nodenv rehash").catch(() => {})
    }
}

Node.register()


/***/ }),

/***/ 2564:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {


// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ findVersions)
});

;// CONCATENATED MODULE: ./node_modules/semver-regex/index.js
function semverRegex() {
	return /(?<=^v?|\sv?)(?:(?:0|[1-9]\d{0,9}?)\.){2}(?:0|[1-9]\d{0,9})(?:-(?:--+)?(?:0|[1-9]\d*|\d*[a-z]+\d*)){0,100}(?=$| |\+|\.)(?:(?<=-\S+)(?:\.(?:--?|[\da-z-]*[a-z-]\d*|0|[1-9]\d*)){1,100}?)?(?!\.)(?:\+(?:[\da-z]\.?-?){1,100}?(?!\w))?(?!\+)/gi;
}

;// CONCATENATED MODULE: ./node_modules/find-versions/index.js


function findVersions(stringWithVersions, {loose = false} = {}) {
	if (typeof stringWithVersions !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof stringWithVersions}`);
	}

	const regex = loose ? new RegExp(`(?:${semverRegex().source})|(?:v?(?:\\d+\\.\\d+)(?:\\.\\d+)?)`, 'g') : semverRegex();
	const matches = stringWithVersions.match(regex) || [];

	return [...new Set(matches.map(match => match.trim().replace(/^v/, '').replace(/^\d+\.\d+$/, '$&.0')))];
}


/***/ }),

/***/ 11:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {

/* unused harmony export default */
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(2037);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(1017);
/* harmony import */ var assert__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(9491);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_3__ = __nccwpck_require__(2186);
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_4__ = __nccwpck_require__(4067);








class Python extends _tool_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z {
    static tool = "python"
    static envVar = "PYENV_ROOT"
    static envPaths = ["bin", "shims", "plugins/pyenv-virtualenv/shims"]
    static installer = "pyenv"

    constructor() {
        super(Python.tool)
    }

    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = this.getVersion(
            desiredVersion,
            ".python-version",
        )
        if (!(await this.haveVersion(checkVersion))) {
            if (checkVersion) {
                // Ensure pip exists as well, but don't error if it breaks
                await this.installPip().catch(() => {})
            }
            return checkVersion
        }

        // Check if pyenv exists and can be run, and capture the version info while
        // we're at it
        await this.findInstaller()

        // Ensure we have the latest pyenv and python versions available
        await this.updatePyenv()

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            _actions_core__WEBPACK_IMPORTED_MODULE_3__.exportVariable("PYENV_VERSION", checkVersion)
        }

        // using -s option to skip the install and become a no-op if the
        // version requested to be installed is already installed according to pyenv.
        let installCommand = `pyenv install -s`
        // pyenv install does not pick up the environment variable PYENV_VERSION
        // unlike tfenv, so we specify it here as an argument explicitly, if it's set
        if (isVersionOverridden) installCommand += ` ${checkVersion}`

        await this.subprocessShell(installCommand).catch(
            this.logAndExit(`failed to install python version ${checkVersion}`),
        )

        // Sanity check the python command works, and output its version
        await this.validateVersion(checkVersion)

        // Sanity check the pip command works, and output its version
        await this.version("pip --version")

        // If we got this far, we have successfully configured python.
        _actions_core__WEBPACK_IMPORTED_MODULE_3__.setOutput(Python.tool, checkVersion)
        this.info("python success!")
        return checkVersion
    }

    /**
     * Update pyenv via the 'pyenv update' plugin command, if it's available.
     */
    async updatePyenv() {
        // Extract PYENV_VERSION to stop it complaining
        // eslint-disable-next-line no-unused-vars
        const { PYENV_VERSION, ...env } = process.env
        const cmd = `${this.installer} update`
        await this.subprocessShell(cmd, {
            // Run outside the repo root so we don't pick up defined version files
            cwd: process.env.RUNNER_TEMP,
            env: { ...env, ...this.getEnv() },
        }).catch((err) => {
            this.warning(
                `Failed to update pyenv, latest versions may not be supported`,
            )
            if (err.stderr) {
                this.debug(err.stderr)
            }
        })
    }

    async setEnv() {
        _actions_core__WEBPACK_IMPORTED_MODULE_3__.exportVariable("PYENV_VIRTUALENV_INIT", 1)
        return super.setEnv()
    }

    /**
     * Download and configures pyenv.
     *
     * @param  {string} root - Directory to install pyenv into (PYENV_ROOT).
     * @return {string} The value of PYENV_ROOT.
     */
    async install(root) {
        assert__WEBPACK_IMPORTED_MODULE_2__(root, "root is required")
        const gh = `https://${process.env.GITHUB_SERVER || "github.com"}/pyenv`
        const url = `${gh}/pyenv/archive/refs/heads/master.tar.gz`

        root = await this.downloadTool(url, { dest: root, strip: 1 })
        this.info(`Downloaded pyenv to ${root}`)

        return root
    }

    /**
     * Ensures pip is installed.
     */
    async installPip() {
        // Check for an existing version using whatever environment has been set
        const pipVersion = await this.version("pip --version", {
            soft: true,
            env: { ...process.env },
        }).catch(() => {})
        if (pipVersion) {
            this.debug(`pip is already installed (${pipVersion})`)
            return
        }

        this.info("Installing pip")
        const url = "https://bootstrap.pypa.io/get-pip.py"
        const download = await this.downloadTool(url)
        await this.subprocessShell(`python ${download}`, {
            env: { ...process.env },
        })

        // get-pip.py will install to $HOME/.local/bin for a system install, so
        // we add it to the PATH or things break
        _actions_core__WEBPACK_IMPORTED_MODULE_3__.addPath(path__WEBPACK_IMPORTED_MODULE_1__.join(os__WEBPACK_IMPORTED_MODULE_0__.homedir(), ".local/bin"))

        // Just run `pyenv rehash` always and ignore errors because we might be
        // in a setup-python environment that doesn't have it
        this.info("Rehashing pyenv shims")
        await this.subprocessShell("pyenv rehash", {
            env: { ...process.env },
        }).catch(() => {})

        // Sanity check the pip command works, and output its version
        await this.version("pip --version", { env: { ...process.env } })
    }
}

// Register the subclass in our tool list
Python.register()


/***/ }),

/***/ 5105:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {

/* unused harmony export default */
/* harmony import */ var assert__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(9491);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(2186);
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(4067);






class Terraform extends _tool_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z {
    static tool = "terraform"
    static envVar = "TFENV_ROOT"
    static installer = "tfenv"

    constructor() {
        super(Terraform.tool)
    }

    async setup(desiredVersion) {
        const [checkVersion, isVersionOverridden] = this.getVersion(
            desiredVersion,
            ".terraform-version",
        )
        if (!(await this.haveVersion(checkVersion))) {
            return checkVersion
        }

        // Check if tfenv exists and can be run, and capture the version info while
        // we're at it
        await this.findInstaller()

        // Set downstream environment variable for future steps in this Job
        if (isVersionOverridden) {
            _actions_core__WEBPACK_IMPORTED_MODULE_1__.exportVariable("TFENV_TERRAFORM_VERSION", checkVersion)
        }

        // Make sure we have the desired terraform version installed (may be
        // pre-installed on self-hosted runners)
        await this.subprocessShell("tfenv install").catch(
            this.logAndExit("install failed"),
        )

        // Sanity check the terraform command works, and output its version
        await this.validateVersion(checkVersion)

        // If we got this far, we have successfully configured terraform.
        _actions_core__WEBPACK_IMPORTED_MODULE_1__.setOutput(Terraform.tool, checkVersion)
        this.info("terraform success!")
        return checkVersion
    }

    /**
     * Download and configures tfenv.
     *
     * @param  {string} root - Directory to install tfenv into (TFENV_ROOT).
     * @return {string} The value of TFENV_ROOT.
     */
    async install(root) {
        assert__WEBPACK_IMPORTED_MODULE_0__(root, "root is required")
        const gh = `https://${
            process.env.GITHUB_SERVER ?? "github.com"
        }/tfutils`
        const url = `${gh}/tfenv/archive/refs/heads/master.tar.gz`

        root = await this.downloadTool(url, { dest: root, strip: 1 })
        this.info(`Downloaded tfenv to ${root}`)

        return root
    }
}

// Register the subclass in our tool list
Terraform.register()


/***/ }),

/***/ 4067:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {

/* harmony export */ __nccwpck_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Tool)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(7147);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(2037);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(1017);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_3__ = __nccwpck_require__(6113);
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_4__ = __nccwpck_require__(7282);
/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_5__ = __nccwpck_require__(3292);
/* harmony import */ var _actions_io__WEBPACK_IMPORTED_MODULE_6__ = __nccwpck_require__(7436);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_7__ = __nccwpck_require__(2186);
/* harmony import */ var _actions_tool_cache__WEBPACK_IMPORTED_MODULE_8__ = __nccwpck_require__(7784);
/* harmony import */ var _actions_exec__WEBPACK_IMPORTED_MODULE_9__ = __nccwpck_require__(1514);
/* harmony import */ var find_versions__WEBPACK_IMPORTED_MODULE_11__ = __nccwpck_require__(2564);
/* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_10__ = __nccwpck_require__(1383);














// Superclass for all supported tools
class Tool {
    static registry = {}

    /** Default values that we don't want to bury in the code. */
    static defaults = {
        RUNNER_TEMP: process__WEBPACK_IMPORTED_MODULE_4__.env.RUNNER_TEMP ?? "/tmp/runner",
    }
    get defaults() {
        return this.constructor.defaults
    }

    /** Accessors for the statics declared on subclasses. */
    get tool() {
        return this.constructor.tool
    }
    get toolVersion() {
        return (
            this.constructor.toolVersion ?? `${this.constructor.tool} --version`
        )
    }
    get envVar() {
        return this.constructor.envVar
    }
    get envPaths() {
        const paths = this.constructor.envPaths ?? ["bin"]
        return Array.isArray(paths) ? paths : [paths]
    }
    get installer() {
        return this.constructor.installer
    }
    get installerPath() {
        return this.constructor.installerPath ?? `.${this.installer}`
    }
    get installerVersion() {
        return (
            this.constructor.installerVersion ?? `${this.installer} --version`
        )
    }

    /**
     * Make a new Tool instance.
     * @param {string} name - Tool name passed from subclass.
     */
    constructor(name) {
        this.name = name

        const required = ["tool", "envVar", "installer"]
        for (const member of required) {
            if ((this.constructor[member] ?? null) == null) {
                throw new Error(
                    `${this.constructor.name}: missing required member '${member}'`,
                )
            }
        }

        // Create logger wrapper functions for this tool
        const loggers = ["debug", "info", "warning", "notice", "error"]
        loggers.forEach((logger) => {
            this[logger] = (...msg) => this.log(logger, msg)
        })

        // Only create the this.silly logger once so it's a fast passthrough that the
        // runtime can optimize away
        this.silly = process__WEBPACK_IMPORTED_MODULE_4__.env.SILLY_LOGGING
            ? (...msg) => this.debug(`SILLY ${msg.join(" ")}`)
            : () => {}
    }

    // Log a message using method from core and msg prepended with the name
    log(method, msg) {
        if (Array.isArray(msg)) {
            if (this.name) msg = `[${this.name}]\t${msg.join(" ")}`
            else msg = msg.join(" ")
        }
        _actions_core__WEBPACK_IMPORTED_MODULE_7__[method](msg)
    }

    // determines the desired version of the tool (e.g. terraform) that is being requested.
    // if the desired version presented to the action is present, that version is
    // honored rather than the version presented in the version file (e.g. .terraform-version)
    // that can be optionally present in the checked out repo itself.
    // Second value returned indicates whether or not the version returned has overridden
    // the version from the repositories tool version file.
    getVersion(actionDesiredVersion, repoToolVersionFilename) {
        this.debug(`getVersion: ${repoToolVersionFilename}`)
        // Check if we have any version passed in to the action (can be null/empty string)
        if (actionDesiredVersion) return [actionDesiredVersion, true]

        if (fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(repoToolVersionFilename)) {
            let textRead = fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync(repoToolVersionFilename, {
                encoding: "utf8",
                flag: "r",
            })
            const readToolVersionNumber = textRead ? textRead.trim() : textRead
            this.debug(
                `Found version ${readToolVersionNumber} in ${repoToolVersionFilename}`,
            )
            if (readToolVersionNumber && readToolVersionNumber.length > 0)
                return [readToolVersionNumber, false]
        }
        // No version has been specified
        return [null, null]
    }

    /**
     * Return an array of the found version strings in `text`.
     * @param {string} text - Text to parse looking for versions.
     * @returns {Array} - Found version strings.
     */
    versionParser(text) {
        return (0,find_versions__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(text, { loose: true })
    }

    /**
     * Run `cmd` with environment `env` and resolves the promise with any
     * parsable version strings in an array. provide true for
     * useLooseVersionFinding when the expected version string contains
     * non-version appearing values such as go1.16.8.
     *
     * ```
     * opts = {
     *   soft: false, // If true, don't exit the action if no version is found.
     *   env: {}, // Environment variables to set for the subprocess.
     * }
     * ```
     *
     * If `opts.env` is NOT set, then `this.getEnv()` will be invoked by
     * `this.subprocessShell(...)` to set PATH and tool root variables as
     * appropriate.
     *
     * @param {string} cmd - Command to run to find version output.
     * @param {Object} opts  - Options for handling different behaviors
     * @returns {string} - The version string that was found.
     */
    async version(cmd, opts) {
        opts = opts ?? { soft: false, env: undefined }
        const { soft, env } = opts
        this.silly(`version cmd: ${cmd}`)
        let check = this.subprocessShell(cmd, { silent: true, env: env })
            .then((proc) => {
                if (proc.stdout) {
                    let stdoutVersions = this.versionParser(proc.stdout)
                    if (stdoutVersions) return stdoutVersions
                }
                if (proc.stderr) {
                    return this.versionParser(proc.stderr)
                }
                this.debug("version: no output parsed")
                return []
            })
            .then((versions) => {
                if (!versions || versions.length < 1) {
                    throw new Error(`${cmd}: no version found`)
                }
                this.info(`${cmd}: ${versions[0]}`)
                return versions[0]
            })

        // This is a hard check and will fail the action
        if (!soft) {
            return check.catch(this.logAndExit(`failed to get version: ${cmd}`))
        }

        return check.catch((err) => {
            this.silly(`version error: ${err}`)
            // Return a soft/empty version here
            if (/Unable to locate executable file:/.test(err.message)) {
                return null
            }
            // Otherwise re-throw
            throw err
        })
    }

    // validateVersion returns the found current version from a subprocess which
    // is compared against the expected value given
    async validateVersion(expected) {
        const command = this.toolVersion
        this.debug(`validateVersion: ${expected}: ${command}`)
        let actual = await this.version(command)
        if (expected != actual) {
            this.debug(`found command ${_actions_io__WEBPACK_IMPORTED_MODULE_6__.which(command.split(" ")[0])}`)
            // this.debug(process.env.PATH)
            this.logAndExit(`version mismatch ${expected} != ${actual}`)(
                new Error("version mismatch"),
            )
        }
        return actual
    }

    /**
     * Return true if `version` is not satisfied by existing tooling, is an
     * empty string, or IGNORE_INSTALLED is set. Return `false` if we have found
     * a matching SemVer compatible tool on the PATH.
     *
     * @param {string} version
     * @returns
     */
    async haveVersion(version) {
        if (!version || version.length < 1) {
            this.debug("skipping setup, no version found")
            return false
        }
        this.info(`Desired version: ${version}`)
        if (process__WEBPACK_IMPORTED_MODULE_4__.env.IGNORE_INSTALLED) {
            this.info("    not checking for installed tools")
            return true
        }

        this.debug("checking for installed version on system without getEnv")
        const system = await this.version(this.toolVersion, {
            soft: true,
            env: { ...process__WEBPACK_IMPORTED_MODULE_4__.env },
        }).catch((err) => {
            if (/^subprocess exited with non-zero code:/.test(err.message)) {
                // This can happen if there's no default version, so we
                // don't want to hard error here
                return null
            }
            throw err
        })

        // We found a system version on the unmodified parent process PATH
        if (system) {
            this.info(`found system version: ${system}`)
            if (this.satifiesSemVer(version, system)) {
                this.debug(`system version ${system} satisfies SemVer`)
                // Exit indicating we do not need to install anything
                return false
            }
        }

        this.debug("checking for installed version, with getEnv")
        const found = await this.version(this.toolVersion, {
            soft: true,
        }).catch((err) => {
            if (/^subprocess exited with non-zero code:/.test(err.message)) {
                // This can happen if there's no default version, so we
                // don't want to hard error here
                return null
            }
            throw err
        })

        // this.debug(`found version: ${found}`)
        if (!found) return true

        // If the found version string satisifes semVer with our tool
        // environment, we want to set the environment, and return indicating we
        // don't need to install anything further
        if (this.satifiesSemVer(version, found)) {
            this.setEnv()
            this.info(
                `Found version ${found} that satisfies SemVer, skipping...`,
            )
            return false
        }

        this.info(
            `Found version ${found} does not satisfy SemVer, installing...`,
        )
        return true
    }

    /**
     * Return true if `found` version string satisifies `expected` according to
     * the SemVer constraints for this tool.
     *
     * TODO: Allow Tool subclasses to configure SemVer constraints.
     *
     * @param {string} expected
     * @param {string} found
     * @returns
     */
    satifiesSemVer(expected, found) {
        const semantic = `^${expected.replace(/\.\d+$/, ".x")}`
        return semver__WEBPACK_IMPORTED_MODULE_10__.satisfies(found, semantic)
    }

    /**
     * Invokes `cmd` with environment `env` and resolves the promise with
     * an object containing the output and any error that was caught
     * @param {string} cmd - Command to run.
     * @param {Object} opts - Subprocess options.
     */
    async subprocess(cmd, opts = { silent: false }) {
        let proc = {
            stdout: "",
            stderr: "",
            err: null,
            exitCode: 0,
        }

        this.silly(`subprocess env exists?: ${!!opts.env}`)
        // Always merge the passed environment on top of the process environment so
        // we don't lose execution context
        // opts.env = opts.env ?? { ...process.env, ...(await this.getEnv()) }
        // opts.env = opts.env ?? { ...process.env }

        // this.debug("subprocess got env")

        // This lets us inspect the process output, otherwise an error is thrown
        // and it is lost
        opts.ignoreReturnCode = opts.ignoreReturnCode ?? true

        // this.debug(`subprocess cmd: ${cmd}`)
        // let args = shellQuote.parse(cmd)
        let args = this.tokenizeArgs(cmd)
        // this.debug(`subprocess args: ${args}`)
        cmd = args.shift()

        return new Promise((resolve, reject) => {
            ;(0,_actions_exec__WEBPACK_IMPORTED_MODULE_9__.getExecOutput)(cmd, args, opts)
                .then((result) => {
                    if (result.exitCode > 0) {
                        let err = new Error(
                            `subprocess exited with non-zero code: ${cmd}`,
                        )
                        err.exitCode = result.exitCode
                        err.stdout = result.stdout
                        err.stderr = result.stderr
                        err.env = { ...opts.env }
                        reject(err)
                        return
                    }

                    proc.exitCode = result.exitCode
                    proc.stdout = result.stdout
                    proc.stderr = result.stderr
                    proc.env = { ...opts.env }
                    resolve(proc)
                })
                .catch((err) => {
                    if (/^Unable to locate executable file/.test(err.message)) {
                        this.debug(`'${cmd.split(" ")[0]}' not on PATH`)
                        this.silly(`PATH = ${opts.env.PATH}`)
                    }
                    reject(err)
                })
        })
    }

    /**
     * Run `cmd` with options `opts` in a bash subshell to ensure the PATH
     * environment is set.
     * @param {String} cmd - Command to run.
     * @param {Object} opts - Subprocess options.
     * @returns
     */
    async subprocessShell(cmd, opts) {
        opts = opts ?? {}
        const escaped = cmd.replace(/"/g, '\\"')
        const cmdName = this.tokenizeArgs(cmd).shift()
        const shell = `bash -c "` + escaped + `"`
        const name = opts.check ? "\tcheckExecutableExists" : "subprocessShell"

        this.silly(`${name} running: ${cmd}`)

        this.silly(`${name} env exists? ${!!opts.env}`)
        opts.env = opts.env ?? { ...process__WEBPACK_IMPORTED_MODULE_4__.env, ...(await this.getEnv()) }

        if (process__WEBPACK_IMPORTED_MODULE_4__.env.SILLY_LOGGING) {
            let paths = (opts.env.PATH || "")
                .split(":")
                .filter((i) => i.includes(this.installer))
            if (!paths) this.silly(`${name} no matching PATH`)
            else this.silly(`${name} matching PATH=`)
            paths.forEach((p) => this.silly(`${name} \t${p}`))
        }

        let cmdExists
        if (!opts.check) {
            this.silly(`subprocessShell: ${shell}`)
            const checkOpts = { ...opts, silent: true, check: true }
            cmdExists = await this.subprocessShell(
                `command -v ${cmdName}`,
                checkOpts,
            )
                .then((proc) => {
                    this.silly(`\tcommand exists: ${proc.stdout.trim()}`)
                    return true
                })
                .catch(() => {
                    this.silly(`\tcommand does not exist: ${cmdName}}`)
                    return false
                })
        } else {
            this.silly(`${name} checking: ${shell}`)
        }
        delete opts.check

        const proc = await this.subprocess(shell, opts).catch((err) => {
            this.silly(`${name} caught error: ${err}`)
            if (
                /^subprocess exited with non-zero code: bash/.test(err.message)
            ) {
                if (cmdExists) {
                    this.silly(`${name} command exists: ${cmd}, but failed`)
                    this.silly(`\t${err.stderr}`)
                    err.message = `subprocess exited with non-zero code: ${cmd}`
                    // this.debug(`subprocessShell error: ${err.stderr}`)
                } else {
                    this.silly(`${name} command does not exist`)
                    err.message = `Unable to locate executable file: ${cmdName}`
                }
            }
            this.silly(`${name} throwing...`)
            throw err
        })
        return proc
    }

    /**
     * Return `cmd` split into arguments using basic quoting.
     *
     * This has only limited token parsing powers, so full Bash quoting and
     * variables and newlines or line continuations will break things.
     *
     * @param {string} cmd
     * @returns
     */
    tokenizeArgs(cmd) {
        let last = 0
        let peek = last
        const tokens = []
        let escaped = false
        let quoted = null
        let quote = 0

        const tokenize = () => {
            // Empty string, skip it
            if (last == peek) return
            // Grab the token
            let token = cmd.slice(last, peek)
            // Replace escaped whitespace with a space
            token = token.replace(/\\ /g, " ")
            tokens.push(token)
        }

        while (peek < cmd.length) {
            let char = cmd[peek]
            // this.debug(`  ${char}  ${!!quoted}\t${escaped}`)
            switch (char) {
                case "'":
                case '"':
                    // Escaped quotes aren't handled lexographically
                    if (escaped && quoted != char) break
                    else if (escaped) {
                        // If it's escaped and the char we're escaping is the
                        // same as our quote, remove the escaping since it won't
                        // be needed in the final token
                        cmd =
                            cmd.slice(0, peek - 1) + cmd.slice(peek, cmd.length)
                        peek--
                        break
                    }
                    // If we have an open quote and we're hitting the same one,
                    // and we're not escaped, that will close the quote and the
                    // next whitespace character will signify the token end
                    if (quoted && quoted == char) {
                        // Here we have to strip the quotes from the original
                        // string(!) so they are processed correctly
                        // (e.g. "foo"bar"baz" -> foo"bar"baz)
                        cmd =
                            cmd.slice(0, quote) +
                            cmd.slice(quote + 1, peek) +
                            cmd.slice(peek + 1, cmd.length)
                        peek -= 2 // Removed quote length
                        quoted = null
                        quote = 0
                    } else if (!quoted) {
                        quoted = char
                        quote = peek
                    }
                    break
                case "`":
                    // Backticks are handled separately because they should not
                    // be removed from the tokens
                    if (escaped) break
                    if (quoted && quoted == char) {
                        quoted = null
                        quote = 0
                    } else if (!quoted) {
                        quoted = char
                        quote = peek
                    }
                    break
                case `\\`:
                    escaped = true
                    peek++
                    continue
                case `\n`:
                case ` `:
                    if (quoted) break
                    if (escaped) break
                    // If we're not quoting or escaping this whitespace, then we
                    // found a token
                    tokenize()
                    last = peek + 1
                    break
            }
            escaped = false
            peek++
        }
        tokenize()
        return tokens
    }

    // logAndExit logs the error message from a subprocess and sets the failure
    // message for the Action and exits the process entirely
    logAndExit(msg) {
        return (err) => {
            if (err) this.error(err)
            _actions_core__WEBPACK_IMPORTED_MODULE_7__.setFailed(msg)
            throw err
        }
    }

    /**
     * This checks if the installer tool, e.g. nodenv, is present and
     * functional, otherwise it will run the install() method to install it.
     */
    async findInstaller() {
        this.info(`Finding installer: ${this.installerVersion}`)
        const found = await this.version(this.installerVersion, { soft: true })
        if (found) {
            this.info("Installer found, setting environment")
            await this.setEnv()
            return
        }

        this.info("Installer not found... attempting to install")
        let root = await this.findRoot()
        root = await this.install(root)

        this.info("Install finished, setting environment")
        await this.setEnv(root)

        this.info("Checking version")
        return this.version(this.installerVersion).catch((err) => {
            this.debug(`version check failed: ${err.exitCode}`)
            this.debug(`  stdout: ${err.stdout}`)
            this.debug(`  stderr: ${err.stderr}`)
            throw err
        })
    }

    /**
     * Return a temporary directory suitable for installing our tool within.
     * @returns {string} - Temporary directory path.
     */
    get tempRoot() {
        if (this._tempRoot) return this._tempRoot
        this._tempRoot = this.constructor.tempRoot()
        return this._tempRoot
    }

    /**
     * Create and return a new temporary directory for installing our tool.
     * @returns {string} - Temporary directory path.
     */
    static tempRoot() {
        const root = path__WEBPACK_IMPORTED_MODULE_2__.join(
            this.defaults.RUNNER_TEMP,
            this.tool,
            crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID(),
            this.installerPath ?? `.${this.installer}`,
        )
        _actions_core__WEBPACK_IMPORTED_MODULE_7__.debug(`[${this.tool}]\tCreating temp root: ${root}`)
        fs__WEBPACK_IMPORTED_MODULE_0__.mkdirSync(root, { recursive: true })
        return root
    }

    /**
     * Return the default root path to where the tool likes to be installed.
     */
    get defaultRoot() {
        return path__WEBPACK_IMPORTED_MODULE_2__.join(os__WEBPACK_IMPORTED_MODULE_1__.homedir(), this.installerPath)
    }

    /**
     * Return the path to the tool installation directory, if found, otherwise
     * return the default path to the tool.
     *
     * @returns {String} - Path to the root folder of the tool.
     */
    async findRoot() {
        const tool = this.installer
        const toolEnv = this.envVar
        let toolPath = process__WEBPACK_IMPORTED_MODULE_4__.env[toolEnv]
        // Return whatever's currently set if we have it
        if (toolPath) {
            this.debug(`${toolEnv} set from environment: ${toolPath}`)
            if (!fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(toolPath)) {
                throw new Error(
                    `${toolEnv} misconfigured: ${toolPath} does not exist`,
                )
            }
            return toolPath
        }

        // Default path is ~/.<dir>/ since that's what our CI uses and most of
        // the tools install there too
        const defaultPath = this.defaultRoot

        // Use a subshell get the command path or function name and
        // differentiate in a sane way
        const defaultEnv = {
            ...process__WEBPACK_IMPORTED_MODULE_4__.env,
            ...(await this.getEnv(defaultPath)),
        }
        const check = `sh -c "command -v ${tool}"`
        const proc = await this.subprocess(check, {
            env: defaultEnv,
            silent: true,
        }).catch(() => {
            this.debug("command -v failed, using default path")
            return { stdout: defaultPath }
        })
        toolPath = proc.stdout ? proc.stdout.trim() : ""
        if (toolPath == tool) {
            // This means it's a function from the subshell profile
            // somewhere, so we just have to use the default
            this.debug("Found tool path as function name")
            return defaultPath
        }
        if (!fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(toolPath)) {
            // This is a weird error case
            this.debug(`tool root does not exist: ${toolPath}`)
            this.debug(`using temp root: ${this.tempRoot}`)
            return this.tempRoot
        }

        // Walk down symbolic links until we find the real path
        while (toolPath) {
            const stat = await fs_promises__WEBPACK_IMPORTED_MODULE_5__.lstat(toolPath).catch((err) => {
                this.error(err)
                return defaultPath
            })
            if (!stat.isSymbolicLink()) break

            let link = await fs_promises__WEBPACK_IMPORTED_MODULE_5__.readlink(toolPath).catch((err) => {
                this.error(err)
                return defaultPath
            })
            // Make sure we can resolve relative symlinks which Homebrew uses
            toolPath = path__WEBPACK_IMPORTED_MODULE_2__.resolve(path__WEBPACK_IMPORTED_MODULE_2__.dirname(toolPath), link)
        }

        const re = new RegExp(`/(bin|libexec)/${tool}$`)
        toolPath = toolPath.replace(re, "")
        if (fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(toolPath)) {
            this.debug(`Found tool root: ${toolPath}`)
            if (toolPath == "/usr/local") {
                this.debug("Using default path due to /usr/local install")
                return defaultPath
            }
            return toolPath
        }

        let err = `${toolEnv} misconfigured: ${toolPath} does not exist`
        this.error(err)
        throw new Error(err)
    }

    /**
     * Subclasses should implement install to install our installer tools.
     * @param {string} root - The root install directory for the tool.
     */
    async install(root) {
        const err = "install not implemented"
        this.debug(`attempting to install to ${root}`)
        this.error(err)
        throw new Error(err)
    }

    /**
     * Downloads a url and optionally untars it
     * @param  {string} url - The url to download.
     * @param  {(string|{dest: string, strip: number})} tar - Path to extract
     *         tarball to, or tar options.
     * @returns {string} The path to the downloaded or extracted file.
     */
    async downloadTool(url, tar) {
        this.debug(`downloadTool: ${url}`)
        // This is really only used to support the test environment...
        if (!process__WEBPACK_IMPORTED_MODULE_4__.env.RUNNER_TEMP) {
            this.debug(
                "RUNNER_TEMP required by tool-cache, setting a sane default",
            )
            process__WEBPACK_IMPORTED_MODULE_4__.env.RUNNER_TEMP = this.defaults.RUNNER_TEMP
        }
        const download = await _actions_tool_cache__WEBPACK_IMPORTED_MODULE_8__.downloadTool(url)
        // Straightforward download to temp directory
        if (!tar) return download

        // Extract the downloaded tarball
        tar = tar ?? {}
        // Allow simple destination extract string
        if (typeof tar === "string") tar = { dest: tar }
        // Match default args for tool-cache
        tar.args = tar.args ?? ["-xz"]
        // Allow stripping directories
        if (tar.strip) tar.args.push(`--strip-components=${tar.strip}`)

        // Toggle debug output 'cause it's super noisy during tar extraction
        const runner_debug = process__WEBPACK_IMPORTED_MODULE_4__.env.RUNNER_DEBUG
        process__WEBPACK_IMPORTED_MODULE_4__.env.RUNNER_DEBUG = undefined

        // Extract the tarball
        const dir = await _actions_tool_cache__WEBPACK_IMPORTED_MODULE_8__.extractTar(download, tar.dest, tar.args)

        // Restore the originals
        process__WEBPACK_IMPORTED_MODULE_4__.env.RUNNER_DEBUG = runner_debug

        // Try to remove the downloaded file now that we have extracted it, but
        // allow it to happen async and in the background, and we don't care if
        // it fails
        await fs_promises__WEBPACK_IMPORTED_MODULE_5__.rm(download, { recursive: true }).catch(() => {})
        // Return the extracted directory
        return dir
    }

    /**
     * Build and return an environment object suitable for calling subprocesses
     * consistently.
     * @param {string} root - Root directory of this tool.
     * @returns {Object} - Environment object for use in subprocesses.
     */
    async getEnv(root) {
        this.silly(`getEnv: ${root}`)
        root = root ?? (await this.findRoot())
        const env = {}
        let envPath = process__WEBPACK_IMPORTED_MODULE_4__.env.PATH ?? ""
        const testPath = `:${envPath}:`
        for (let dir of this.envPaths) {
            dir = path__WEBPACK_IMPORTED_MODULE_2__.join(root, dir)
            if (testPath.includes(`:${dir}:`)) continue
            envPath = this.addPath(dir, envPath)
        }
        env.PATH = envPath
        env[this.envVar] = root
        return env
    }

    /**
     * Export the environment settings for this tool to work correctly.
     * @param {string} root - The root installer directory for our tool.
     */
    async setEnv(root) {
        root = root ?? (await this.findRoot())
        _actions_core__WEBPACK_IMPORTED_MODULE_7__.exportVariable(this.envVar, root)
        for (const dir of this.envPaths) {
            _actions_core__WEBPACK_IMPORTED_MODULE_7__.addPath(path__WEBPACK_IMPORTED_MODULE_2__.join(root, dir))
        }
    }

    /**
     * Modifies and de-duplicates PATH strings.
     * @param {string} newPath - Path to add to exising PATH.
     * @param {string} path - PATH string from environment.
     * @returns {string} - New PATH value.
     */
    addPath(newPath, path = process__WEBPACK_IMPORTED_MODULE_4__.env.PATH) {
        path = path.split(":").filter((p) => p != "")
        path.push(newPath)
        path = [...new Set(path)]
        path = path.join(":")
        return path
    }

    // register adds name : subclass to the tool registry
    static register() {
        this.registry[this.tool] = this
    }

    // all returns an array of objects containing the tool name and the bound
    // setup function of a tool instance
    static all() {
        return Object.keys(this.registry).map((k) => {
            let tool = new this.registry[k]()
            return { name: k, setup: tool.setup.bind(tool) }
        })
    }
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && !queue.d) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__nccwpck_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = 1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 		queue && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __nccwpck_require__(1378);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ var __webpack_exports__default = __webpack_exports__.Z;
/******/ var __webpack_exports__runner = __webpack_exports__.u;
/******/ export { __webpack_exports__default as default, __webpack_exports__runner as runner };
/******/ 

//# sourceMappingURL=index.js.map