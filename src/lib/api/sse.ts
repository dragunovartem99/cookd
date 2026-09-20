export interface SseEvent {
	event: string;
	data: string;
}

// Turns one blank-line-delimited SSE block into an event, or null if it has no data.
export function parseBlock(block: string): SseEvent | null {
	let event = "message";
	const data: string[] = [];
	for (const line of block.split("\n")) {
		if (line.startsWith("event:")) event = line.slice(6).trim();
		else if (line.startsWith("data:")) data.push(line.slice(5).replace(/^ /u, ""));
	}
	return data.length > 0 ? { event, data: data.join("\n") } : null;
}

// Reads a Server-Sent Events body. fetch is used instead of EventSource because
// EventSource cannot send the Authorization header. A chunk can end anywhere,
// mid-line or mid-character, so text is buffered until a whole block arrives.
//
export async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<SseEvent> {
	const reader = body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	try {
		for (;;) {
			// Each read waits on the network by design: chunks are handled in order.
			// oxlint-disable-next-line eslint/no-await-in-loop
			const { done, value } = await reader.read();
			buffer += decoder.decode(value, { stream: !done }).replaceAll("\r\n", "\n");

			let end: number;
			while ((end = buffer.indexOf("\n\n")) !== -1) {
				const event = parseBlock(buffer.slice(0, end));
				buffer = buffer.slice(end + 2);
				if (event) yield event;
			}
			if (done) break;
		}
	} finally {
		reader.releaseLock();
	}
}
