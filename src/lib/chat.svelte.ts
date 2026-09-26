import * as api from "@/lib/api";
import { conversations } from "@/lib/conversations.svelte";
import { describe } from "@/lib/errors";
import type { Attachment } from "@/lib/image";

// A photo in the chat: a local preview just attached, or one stored on the server.
export type ViewImage = { url: string } | { id: number };

export interface ViewMessage {
	key: string;
	role: "user" | "assistant";
	text: string;
	images: ViewImage[];
}

class Chat {
	messages = $state<ViewMessage[]>([]);
	busy = $state(false);
	loading = $state(false);
	error = $state<string | null>(null);
	notice = $state<string | null>(null);
	#abort: AbortController | null = null;

	// Shows a stored conversation, or a blank page for null. Stops any answer in flight.
	async open(id: string | null) {
		this.stop();
		this.messages = [];
		this.error = null;
		this.notice = null;
		if (!id) return;

		this.loading = true;
		try {
			const rows = await api.conversations.messages(id);
			if (conversations.activeId !== id) return;
			this.messages = rows.map((m) => ({
				key: String(m.id),
				role: m.role,
				text: m.text,
				images: m.images.map((image) => ({ id: image.id })),
			}));
		} catch (error) {
			this.error = describe(error);
		} finally {
			this.loading = false;
		}
	}

	stop() {
		this.#abort?.abort();
	}

	// Sends a message and streams the answer in. Resolves false when nothing was
	// kept — an error, or the user pressing stop — so the caller can put the draft back.
	//
	async send(text: string, attachments: Attachment[]): Promise<boolean> {
		if (this.busy) return false;
		this.busy = true;
		this.error = null;
		this.notice = null;
		const before = this.messages.length;
		const abort = new AbortController();
		this.#abort = abort;

		try {
			const id = conversations.activeId ?? (await conversations.create());
			this.messages.push({
				key: crypto.randomUUID(),
				role: "user",
				text,
				images: attachments.map((a) => ({ url: a.previewUrl })),
			});
			const answer = {
				key: crypto.randomUUID(),
				role: "assistant" as const,
				text: "",
				images: [],
			};
			this.messages.push(answer);
			const shown = this.messages.at(-1)!;

			const message = { text, images: attachments.map((a) => a.image) };
			for await (const event of api.streamMessage(id, message, abort.signal)) {
				if (event.type === "delta") shown.text += event.text;
				else if (event.type === "error") throw new Error(event.error);
				else {
					conversations.touch(id, event.title);
					if (event.stopReason === "max_tokens") this.notice = "Ответ был обрезан.";
				}
			}
			return true;
		} catch (error) {
			// The server keeps nothing from a failed or stopped answer, so neither do we.
			this.messages.length = before;
			if (!abort.signal.aborted)
				this.error =
					error instanceof Error && !(error instanceof api.ApiError)
						? error.message
						: describe(error);
			return false;
		} finally {
			this.busy = false;
			this.#abort = null;
		}
	}
}

export const chat = new Chat();
