import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { json, mockApi } from "@/test-utils";

import { session } from "../session.svelte";
import { ApiError, request } from "./client";

beforeEach(() => session.end());
afterEach(() => vi.unstubAllGlobals());

describe("request", () => {
	it("sends the session token and a JSON body", async () => {
		const fetchMock = mockApi({ "POST /x": () => json({ ok: true }) });
		session.start("tok");

		await request("/x", { method: "POST", body: { a: 1 } });

		const [, init] = fetchMock.mock.calls[0]!;
		expect(init?.headers).toMatchObject({
			"Authorization": "Bearer tok",
			"Content-Type": "application/json",
		});
		expect(init?.body).toBe('{"a":1}');
	});

	it("resolves undefined for a 204", async () => {
		mockApi({ "DELETE /x": () => json(null, 204) });
		expect(await request("/x", { method: "DELETE" })).toBeUndefined();
	});

	it("throws the server's own message", async () => {
		mockApi({ "GET /x": () => json({ error: "Rate limit exceeded" }, 429) });
		await expect(request("/x")).rejects.toMatchObject({
			status: 429,
			message: "Rate limit exceeded",
		});
	});

	it("ends the session on a 401", async () => {
		mockApi({ "GET /x": () => json({ error: "Sign in required" }, 401) });
		session.start("stale");

		await expect(request("/x")).rejects.toBeInstanceOf(ApiError);
		expect(session.token).toBeNull();
	});

	it("leaves no session behind after a wrong password", async () => {
		mockApi({ "POST /auth/login": () => json({ error: "Sign in required" }, 401) });
		await expect(request("/auth/login", { method: "POST", body: {} })).rejects.toThrow(
			"Sign in required"
		);
		expect(session.token).toBeNull();
	});
});

describe("request failures", () => {
	it("turns a network failure into a friendly error", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
		await expect(request("/x")).rejects.toMatchObject({ status: 0 });
	});

	it("survives an error body that is not JSON", async () => {
		mockApi({ "GET /x": () => new Response("<html>bad gateway</html>", { status: 502 }) });
		await expect(request("/x")).rejects.toMatchObject({
			status: 502,
			message: "Request failed (502)",
		});
	});
});
