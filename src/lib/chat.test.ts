import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { json, mockApi, sse } from "@/test-utils";

import { chat } from "./chat.svelte";
import { conversations } from "./conversations.svelte";

const created = { id: "c1", title: "", createdAt: "", updatedAt: "" };
const done = { messageId: 2, title: "Eggs", stopReason: "end_turn" };

beforeEach(() => {
	[conversations.list, conversations.activeId] = [[], null];
	[chat.messages, chat.error, chat.notice] = [[], null, null];
});
afterEach(() => vi.unstubAllGlobals());

describe("chat.send", () => {
	it("creates a conversation, streams the answer in and titles it", async () => {
		mockApi({
			"POST /conversations": () => json(created, 201),
			"POST /conversations/c1/messages": () =>
				sse([
					["delta", { text: "Make an " }],
					["delta", { text: "omelette." }],
					["done", done],
				]),
		});

		expect(await chat.send("I have eggs", [])).toBe(true);

		expect(chat.messages.map((m) => [m.role, m.text])).toEqual([
			["user", "I have eggs"],
			["assistant", "Make an omelette."],
		]);
		expect(conversations.activeId).toBe("c1");
		expect(conversations.list[0]?.title).toBe("Eggs");
		expect(chat.busy).toBe(false);
	});
	it("reuses the open conversation", async () => {
		conversations.activeId = "c1";
		const fetchMock = mockApi({
			"POST /conversations/c1/messages": () => sse([["done", done]]),
		});

		await chat.send("more", []);

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
	it("says so when an answer was cut off", async () => {
		conversations.activeId = "c1";
		mockApi({
			"POST /conversations/c1/messages": () =>
				sse([["done", { ...done, stopReason: "max_tokens" }]]),
		});

		await chat.send("a very long recipe", []);

		expect(chat.notice).toBe("The answer was cut off.");
	});
});

describe("chat.open", () => {
	it("shows a stored conversation, photos by id", async () => {
		conversations.activeId = "c1";
		mockApi({
			"GET /conversations/c1/messages": () =>
				json([
					{
						id: 1,
						role: "user",
						text: "hi",
						images: [{ id: 9, mediaType: "image/jpeg" }],
						createdAt: "",
					},
				]),
		});

		await chat.open("c1");

		expect(chat.messages).toMatchObject([{ role: "user", text: "hi", images: [{ id: 9 }] }]);
	});

	it("clears the page for a new conversation", async () => {
		chat.messages = [{ key: "x", role: "user", text: "old", images: [] }];
		await chat.open(null);
		expect(chat.messages).toEqual([]);
	});
});
