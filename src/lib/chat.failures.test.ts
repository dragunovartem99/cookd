import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { json, mockApi, sse } from "@/test-utils";

import { chat } from "./chat.svelte";
import { conversations } from "./conversations.svelte";

beforeEach(() => {
	[conversations.list, conversations.activeId] = [[], null];
	[chat.messages, chat.error, chat.notice] = [[], null, null];
});
afterEach(() => vi.unstubAllGlobals());

describe("chat.send failures", () => {
	it("keeps nothing and reports the error when the model fails", async () => {
		conversations.activeId = "c1";
		mockApi({
			"POST /conversations/c1/messages": () =>
				sse([
					["delta", { text: "Half an" }],
					["error", { error: "The model could not answer right now" }],
				]),
		});

		expect(await chat.send("dinner?", [])).toBe(false);

		expect(chat.messages).toEqual([]);
		expect(chat.error).toBe("The model could not answer right now");
	});
	it("shows the server's message for a rate limit", async () => {
		conversations.activeId = "c1";
		mockApi({
			"POST /conversations/c1/messages": () => json({ error: "Rate limit exceeded" }, 429),
		});

		expect(await chat.send("dinner?", [])).toBe(false);

		expect(chat.error).toBe("Rate limit exceeded");
		expect(chat.messages).toEqual([]);
	});
	it("drops the exchange quietly when the user presses stop", async () => {
		conversations.activeId = "c1";
		mockApi({
			"POST /conversations/c1/messages": (init) =>
				new Promise((_, reject) => {
					init.signal?.addEventListener("abort", () =>
						reject(new DOMException("Aborted", "AbortError"))
					);
				}),
		});

		const sending = chat.send("dinner?", []);
		chat.stop();

		expect(await sending).toBe(false);
		expect(chat.messages).toEqual([]);
		expect(chat.error).toBeNull();
		expect(chat.busy).toBe(false);
	});
});
