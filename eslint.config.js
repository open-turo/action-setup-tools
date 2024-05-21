import babelParser from "@babel/eslint-parser"
import globals from "globals"
import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"

export default [
    {
        ignores: ["coverage/**", "dist/**"],
    },
    js.configs.recommended,
    eslintConfigPrettier,
    {
        languageOptions: {
            ecmaVersion: 12,
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
                Atomics: "readonly",
                SharedArrayBuffer: "readonly",
            },
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
            },
            sourceType: "module",
        },
        rules: {
            indent: ["error", 4, { SwitchCase: 1 }],
        },
    },
]
