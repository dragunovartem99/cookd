import { mount, tick, unmount } from "svelte";
import { afterEach, describe, expect, it, vi } from "vitest";

import { json, mockApi } from "@/test-utils";

import Workspace from "./Workspace.svelte";

let app: ReturnType<typeof mount>;

afterEach(() => {
	unmount(app);
	document.body.innerHTML = "";
	vi.unstubAllGlobals();
});

const routes = {
	"GET /conversations": () =>
		json([{ id: "c1", title: "Omelette night", createdAt: "", updatedAt: "" }]),
	"GET /ingredients": () =>
		json([
			{ id: 1, name: "eggs", inStock: true },
			{ id: 2, name: "milk", inStock: false },
		]),
	"GET /journal": () => json([]),
};

describe("Workspace", () => {
	it("loads and shows conversations and the pantry", async () => {
		mockApi(routes);
		app = mount(Workspace, { target: document.body });

		await vi.waitFor(() => expect(document.body.textContent).toContain("Omelette night"));
		expect(document.body.textContent).toContain("In stock · 1");
		expect(document.body.textContent).toContain("Out · 1");
	});

	it("moves an ingredient to Out when its switch is flipped", async () => {
		const fetchMock = mockApi({
			...routes,
			"PATCH /ingredients/1": () => json({ id: 1, name: "eggs", inStock: false }),
		});
		app = mount(Workspace, { target: document.body });
		await vi.waitFor(() => expect(document.body.textContent).toContain("In stock · 1"));

		document.querySelector<HTMLInputElement>("input[role=switch]")!.click();
		await tick();

		expect(document.body.textContent).toContain("Out · 2");
		await vi.waitFor(() =>
			expect(fetchMock).toHaveBeenCalledWith(
				expect.stringContaining("/ingredients/1"),
				expect.anything()
			)
		);
	});
});
