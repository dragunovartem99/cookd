import { describe, expect, it } from "vitest";

import { renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
	it("renders lists and emphasis", () => {
		const html = renderMarkdown("**Eggs**\n\n- one\n- two");
		expect(html).toContain("<strong>Eggs</strong>");
		expect(html).toContain("<li>two</li>");
	});

	it("strips scripts and event handlers from model output", () => {
		const html = renderMarkdown('hi <script>alert(1)</script><img src=x onerror="alert(2)">');
		expect(html).not.toContain("<script");
		expect(html).not.toContain("onerror");
	});
});
