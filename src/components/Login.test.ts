import { mount, tick, unmount } from "svelte";
import { afterEach, describe, expect, it, vi } from "vitest";

import { session } from "@/lib/session.svelte";
import { json, mockApi } from "@/test-utils";

import Login from "./Login.svelte";

let app: ReturnType<typeof mount>;

afterEach(() => {
	unmount(app);
	session.end();
	document.body.innerHTML = "";
	vi.unstubAllGlobals();
});

async function signInWith(password: string) {
	app = mount(Login, { target: document.body });
	const input = document.querySelector("input")!;
	input.value = password;
	input.dispatchEvent(new Event("input", { bubbles: true }));
	await tick();
	document
		.querySelector("form")!
		.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
}

describe("Login", () => {
	it("starts a session with the token the API returns", async () => {
		mockApi({ "POST /auth/login": () => json({ token: "tok", email: "me@example.com" }) });

		await signInWith("correct horse");

		await vi.waitFor(() => expect(session.token).toBe("tok"));
	});

	it("shows the error and clears the field on a wrong password", async () => {
		mockApi({ "POST /auth/login": () => json({ error: "Sign in required" }, 401) });

		await signInWith("nope");

		await vi.waitFor(() =>
			expect(document.querySelector("[role=alert]")?.textContent).toBe("Sign in required")
		);
		expect(document.querySelector("input")!.value).toBe("");
		expect(session.token).toBeNull();
	});

	it("will not submit an empty password", async () => {
		app = mount(Login, { target: document.body });
		await tick();
		expect(document.querySelector("button")!.disabled).toBe(true);
	});
});
