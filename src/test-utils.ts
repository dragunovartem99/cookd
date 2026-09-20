import { vi } from "vitest";

export const json = (body: unknown, status = 200) =>
	new Response(status === 204 ? null : JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

// A Server-Sent Events response as the API writes it, delivered in one chunk.
export const sse = (events: [string, object][]) => {
	const text = events.map(([name, data]) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`);
	return new Response(
		new ReadableStream({
			start(controller) {
				controller.enqueue(new TextEncoder().encode(text.join("")));
				controller.close();
			},
		}),
		{ headers: { "Content-Type": "text/event-stream" } }
	);
};

type Handler = (init: RequestInit) => Response | Promise<Response>;

// Replaces fetch with routes keyed "METHOD /path"; anything else fails the test.
export function mockApi(routes: Record<string, Handler>) {
	const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
		(url, init = {}) => {
			const key = `${init.method ?? "GET"} ${new URL(url).pathname}`;
			const handler = routes[key];
			if (!handler) return Promise.reject(new Error(`unexpected request: ${key}`));
			return Promise.resolve(handler(init));
		}
	);
	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
}
