import { describe, expect, it } from "vitest";

import { parseBlock, readEvents } from "./sse";

function bodyOf(...chunks: Uint8Array[]) {
	return new ReadableStream<Uint8Array>({
		start(controller) {
			for (const chunk of chunks) controller.enqueue(chunk);
			controller.close();
		},
	});
}

async function collect(body: ReadableStream<Uint8Array>) {
	const events = [];
	for await (const event of readEvents(body)) events.push(event);
	return events;
}

describe("parseBlock", () => {
	it("reads an event name and its data", () => {
		expect(parseBlock('event: delta\ndata: {"text":"hi"}')).toEqual({
			event: "delta",
			data: '{"text":"hi"}',
		});
	});

	it("defaults the name and joins several data lines", () => {
		expect(parseBlock("data: a\ndata: b")).toEqual({ event: "message", data: "a\nb" });
	});

	it("ignores a block with no data", () => {
		expect(parseBlock(": keep-alive")).toBeNull();
	});
});

const encode = (text: string) => new TextEncoder().encode(text);

describe("readEvents", () => {
	it("yields each event in order", async () => {
		const events = await collect(bodyOf(encode("event: a\ndata: 1\n\nevent: b\ndata: 2\n\n")));
		expect(events).toEqual([
			{ event: "a", data: "1" },
			{ event: "b", data: "2" },
		]);
	});

	it("reassembles an event split across chunks, even mid-word", async () => {
		const events = await collect(
			bodyOf(encode("event: del"), encode("ta\ndata: hel"), encode("lo\n"), encode("\n"))
		);
		expect(events).toEqual([{ event: "delta", data: "hello" }]);
	});

	it("does not break a multi-byte character split across chunks", async () => {
		const bytes = encode("event: delta\ndata: é\n\n");
		const at = bytes.indexOf(0xc3) + 1;
		const events = await collect(bodyOf(bytes.slice(0, at), bytes.slice(at)));
		expect(events).toEqual([{ event: "delta", data: "é" }]);
	});

	it("accepts CRLF line endings", async () => {
		const events = await collect(bodyOf(encode("event: a\r\ndata: 1\r\n\r\n")));
		expect(events).toEqual([{ event: "a", data: "1" }]);
	});

	it("drops a trailing event that never finished", async () => {
		expect(await collect(bodyOf(encode("event: a\ndata: 1")))).toEqual([]);
	});
});
