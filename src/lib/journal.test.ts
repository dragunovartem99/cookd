import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { json, mockApi } from "@/test-utils";

import { journal } from "./journal.svelte";

const entry = (id: number, cookedOn: string) => ({
	id,
	dish: `dish ${id}`,
	cookedOn,
	taste: 4,
	minutes: null,
	note: "",
	createdAt: "",
});

beforeEach(() => {
	journal.entries = [entry(1, "2026-09-14")];
	journal.error = null;
});
afterEach(() => vi.unstubAllGlobals());

describe("journal", () => {
	it("slots a back-dated entry in by the day it was cooked", async () => {
		mockApi({ "POST /journal": () => json(entry(2, "2026-09-10"), 201) });

		expect(await journal.add({ dish: "dish 2", taste: 4, cookedOn: "2026-09-10" })).toBe(true);

		expect(journal.entries.map((e) => e.id)).toEqual([1, 2]);
	});

	it("shows the server's reason when an entry is refused", async () => {
		mockApi({ "POST /journal": () => json({ error: "taste must be from 1 to 5" }, 400) });

		expect(await journal.add({ dish: "x", taste: 9 })).toBe(false);

		expect(journal.error).toBe("taste must be from 1 to 5");
		expect(journal.entries).toHaveLength(1);
	});

	it("removes an entry", async () => {
		mockApi({ "DELETE /journal/1": () => json(null, 204) });
		await journal.remove(1);
		expect(journal.entries).toEqual([]);
	});
});
