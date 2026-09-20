import { send } from "./client";
import { readEvents } from "./sse";
import type { ChatEvent, UploadImage } from "./types";

// Sends a message and yields the answer as it is written. The server stores the
// exchange only after a complete answer, so an "error" event or an abort leaves
// the conversation as it was.
//
export async function* streamMessage(
	conversationId: string,
	message: { text: string; images: UploadImage[] },
	signal: AbortSignal
): AsyncGenerator<ChatEvent> {
	const response = await send(`/conversations/${conversationId}/messages`, {
		method: "POST",
		body: message,
		signal,
	});
	if (!response.body) throw new Error("Сервер не прислал ответ");

	for await (const { event, data } of readEvents(response.body)) {
		const payload = JSON.parse(data) as Record<string, unknown>;
		if (event === "delta") yield { type: "delta", text: String(payload.text) };
		else if (event === "done") {
			yield {
				type: "done",
				messageId: Number(payload.messageId),
				title: String(payload.title),
				stopReason: String(payload.stopReason),
			};
		} else if (event === "error") yield { type: "error", error: String(payload.error) };
	}
}
