import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { json, mockApi } from "@/test-utils";

import { pantry } from "./pantry.svelte";

const eggs = { id: 1, name: "eggs", inStock: true };
const milk = { id: 2, name: "milk", inStock: false };

beforeEach(() => {
	pantry.items = [{ ...eggs }, { ...milk }];
	pantry.error = null;
});
afterEach(() => vi.unstubAllGlobals());

describe("pantry", () => {
	it("splits the list into in stock and out", () => {
		expect(pantry.inStock.map((i) => i.name)).toEqual(["eggs"]);
		expect(pantry.out.map((i) => i.name)).toEqual(["milk"]);
	});

	it("moves an item at once and tells the server", async () => {
		const fetchMock = mockApi({
			"PATCH /ingredients/2": () => json({ ...milk, inStock: true }),
		});

		await pantry.toggle(pantry.items[1]!);

		expect(pantry.out).toEqual([]);
		expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({ inStock: true });
	});

	it("puts the switch back when the server refuses", async () => {
		mockApi({ "PATCH /ingredients/2": () => json({ error: "Not found" }, 404) });

		await pantry.toggle(pantry.items[1]!);

		expect(pantry.items[1]?.inStock).toBe(false);
		expect(pantry.error).toBe("Not found");
	});

	it("replaces the list with what the server answers after an add", async () => {
		const all = [eggs, milk, { id: 3, name: "rice", inStock: true }];
		mockApi({ "POST /ingredients": () => json(all) });

		expect(await pantry.add("rice")).toBe(true);

		expect(pantry.items).toHaveLength(3);
	});

	it("keeps the item when a delete fails", async () => {
		mockApi({ "DELETE /ingredients/1": () => json({ error: "Internal server error" }, 500) });

		await pantry.remove(pantry.items[0]!);

		expect(pantry.items).toHaveLength(2);
		expect(pantry.error).toBe("Internal server error");
	});
});
