import { describe, expect, it } from "vitest";

import { countCodeLines } from "./check-lines.ts";

describe("countCodeLines", () => {
	it("counts real lines and skips blanks", () => {
		expect(countCodeLines("<p>a</p>\n\n<p>b</p>\n")).toBe(2);
	});

	it("skips line comments, block comments and HTML comments, even across lines", () => {
		const source =
			"// note\n<!-- one\ntwo -->\n/* three\nfour */\n<p>kept</p>\nconst x = 1; // trailing";
		expect(countCodeLines(source)).toBe(2);
	});
});
