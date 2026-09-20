import type { Attachment } from "@/lib/image";
import { prepareImage } from "@/lib/image";

export const MAX_PHOTOS = 4;

// The photos waiting to go out with the next message.
export class Attachments {
	items = $state<Attachment[]>([]);
	problem = $state<string | null>(null);

	// Shrinks and adds the images among files, up to MAX_PHOTOS in all.
	async add(files: File[]) {
		this.problem = null;
		const images = files.filter((f) => f.type.startsWith("image/"));
		const picked = images.slice(0, MAX_PHOTOS - this.items.length);
		if (picked.length < images.length)
			this.problem = `At most ${MAX_PHOTOS} photos per message`;

		const results = await Promise.allSettled(picked.map((file) => prepareImage(file)));
		for (const result of results) {
			if (result.status === "fulfilled") this.items.push(result.value);
			else this.problem = "Could not read that photo";
		}
	}

	remove(key: string) {
		this.items = this.items.filter((a) => a.key !== key);
	}

	// Hands over everything waiting and empties the tray.
	take(): Attachment[] {
		const taken = this.items;
		this.items = [];
		return taken;
	}
}
