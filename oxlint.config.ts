import baseConfig from "@dragunovartem99/oxlint-config";
import { defineConfig } from "oxlint";

// A file may hold at most 100 lines of real code: blank lines and comments don't count, so
// documenting a file never eats into its budget. Unlike chessdocs (`warn`), this is an error —
// the pre-commit hook and CI both run `lint:check`, and a limit that only warns limits nothing.
export default defineConfig({
	extends: [baseConfig],
	rules: {
		"max-lines": ["error", { max: 100, skipBlankLines: true, skipComments: true }],
	},
});
