import * as api from "@/lib/api";
import { describe } from "@/lib/errors";

class Pantry {
	items = $state<api.Ingredient[]>([]);
	error = $state<string | null>(null);
	inStock = $derived(this.items.filter((i) => i.inStock));
	out = $derived(this.items.filter((i) => !i.inStock));

	async load() {
		await this.#run(async () => (this.items = await api.ingredients.list()));
	}

	// Adds a pasted list; anything already listed is switched back on.
	add(text: string): Promise<boolean> {
		return this.#run(async () => (this.items = await api.ingredients.add(text)));
	}

	// Flips the switch at once and puts it back if the server says no.
	async toggle(item: api.Ingredient) {
		item.inStock = !item.inStock;
		const ok = await this.#run(() => api.ingredients.setInStock(item.id, item.inStock));
		if (!ok) item.inStock = !item.inStock;
	}

	async remove(item: api.Ingredient) {
		await this.#run(async () => {
			await api.ingredients.remove(item.id);
			this.items = this.items.filter((i) => i.id !== item.id);
		});
	}

	async #run(action: () => Promise<unknown>): Promise<boolean> {
		this.error = null;
		try {
			await action();
			return true;
		} catch (error) {
			this.error = describe(error);
			return false;
		}
	}
}

export const pantry = new Pantry();
