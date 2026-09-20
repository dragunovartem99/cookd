import * as api from "@/lib/api";
import { describe } from "@/lib/errors";

class Conversations {
	list = $state<api.Conversation[]>([]);
	activeId = $state<string | null>(null);
	error = $state<string | null>(null);

	async load() {
		try {
			this.list = await api.conversations.list();
		} catch (error) {
			this.error = describe(error);
		}
	}

	// Starts an empty conversation and makes it the active one.
	async create(): Promise<string> {
		const created = await api.conversations.create();
		this.list = [created, ...this.list];
		this.activeId = created.id;
		return created.id;
	}

	async remove(id: string) {
		try {
			await api.conversations.remove(id);
			this.list = this.list.filter((c) => c.id !== id);
			if (this.activeId === id) this.activeId = null;
		} catch (error) {
			this.error = describe(error);
		}
	}

	// Records a new title and moves the conversation to the top.
	touch(id: string, title: string) {
		const found = this.list.find((c) => c.id === id);
		if (found) this.list = [{ ...found, title }, ...this.list.filter((c) => c.id !== id)];
	}
}

export const conversations = new Conversations();
