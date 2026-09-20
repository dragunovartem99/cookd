import { describe, expect, it, vi } from "vitest";

import { Attachments, MAX_PHOTOS } from "./attachments.svelte";

vi.mock("@/lib/image", () => ({
	prepareImage: (file: File) =>
		file.name === "broken.jpg"
			? Promise.reject(new Error("bad"))
			: Promise.resolve({
					key: file.name,
					previewUrl: `blob:${file.name}`,
					image: { mediaType: "image/jpeg", data: "" },
				}),
}));

const photo = (name: string) => new File(["x"], name, { type: "image/jpeg" });

describe("Attachments", () => {
	it("adds photos and ignores files that are not images", async () => {
		const photos = new Attachments();
		await photos.add([photo("a.jpg"), new File(["x"], "notes.txt", { type: "text/plain" })]);
		expect(photos.items.map((a) => a.key)).toEqual(["a.jpg"]);
	});

	it("stops at the limit and says so", async () => {
		const photos = new Attachments();
		await photos.add(Array.from({ length: MAX_PHOTOS + 2 }, (_, i) => photo(`${i}.jpg`)));
		expect(photos.items).toHaveLength(MAX_PHOTOS);
		expect(photos.problem).toContain(String(MAX_PHOTOS));
	});

	it("keeps the good photos when one cannot be read", async () => {
		const photos = new Attachments();
		await photos.add([photo("a.jpg"), photo("broken.jpg")]);
		expect(photos.items).toHaveLength(1);
		expect(photos.problem).toBe("Could not read that photo");
	});

	it("hands everything over on take", async () => {
		const photos = new Attachments();
		await photos.add([photo("a.jpg")]);
		expect(photos.take()).toHaveLength(1);
		expect(photos.items).toEqual([]);
	});
});
