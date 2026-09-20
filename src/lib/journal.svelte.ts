import * as api from "@/lib/api";
import { describe } from "@/lib/errors";

class Journal {
	entries = $state<api.JournalEntry[]>([]);
	error = $state<string | null>(null);

	async load() {
		try {
			this.entries = await api.journal.list();
		} catch (error) {
			this.error = describe(error);
		}
	}

	async add(entry: api.NewJournalEntry): Promise<boolean> {
		this.error = null;
		try {
			const saved = await api.journal.add(entry);
			// The list is newest-cooked first, so a back-dated entry sorts into place.
			this.entries = [...this.entries, saved].toSorted(
				(a, b) => b.cookedOn.localeCompare(a.cookedOn) || b.id - a.id
			);
			return true;
		} catch (error) {
			this.error = describe(error);
			return false;
		}
	}

	async remove(id: number) {
		try {
			await api.journal.remove(id);
			this.entries = this.entries.filter((e) => e.id !== id);
		} catch (error) {
			this.error = describe(error);
		}
	}
}

export const journal = new Journal();
