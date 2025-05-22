import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["src/**/*.ts"],
        plugins: { js, import: importPlugin },
        extends: ["js/recommended"],
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true
                }
            ],
            "import/extensions": [
                "error",
                "always",
                {
                    ts: "always",
                    mts: "always",
                    cts: "always"
                }
            ],
            "@typescript-eslint/consistent-type-imports": "error"
        },
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module"
            }
        }
    },
    tseslint.configs.recommended
]);
