import { describe, expect, it } from "vitest";

import { formatDay, today } from "./date";

describe("today", () => {
	it("is the local calendar date, zero-padded", () => {
		expect(today(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
	});
});

describe("formatDay", () => {
	const now = new Date(2026, 8, 20);

	it("leaves out the year for this year", () => {
		expect(formatDay("2026-09-14", now)).not.toContain("2026");
	});

	it("shows the year for other years", () => {
		expect(formatDay("2025-09-14", now)).toContain("2025");
	});
});
