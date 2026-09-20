import type { UploadImage } from "@/lib/api";

// Longest side, in pixels, a photo is sent at: plenty for a fridge, cheap to send.
export const MAX_SIDE = 1500;

export interface Attachment {
	key: string;
	// Object URL of the downscaled photo, for showing it before and after sending.
	previewUrl: string;
	image: UploadImage;
}

// The size a width x height photo shrinks to so its longer side is at most max.
export function fitWithin(width: number, height: number, max = MAX_SIDE) {
	const scale = Math.min(1, max / Math.max(width, height));
	return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

function blobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => resolve(String(reader.result).split(",")[1] ?? ""));
		reader.addEventListener("error", () => reject(reader.error));
		reader.readAsDataURL(blob);
	});
}

// Shrinks a photo to JPEG at MAX_SIDE, which also lands it under the API's 5 MiB limit.
export async function prepareImage(file: File): Promise<Attachment> {
	const bitmap = await createImageBitmap(file);
	const { width, height } = fitWithin(bitmap.width, bitmap.height);

	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();

	const blob = await new Promise<Blob | null>((done) => {
		canvas.toBlob(done, "image/jpeg", 0.85);
	});
	if (!blob) throw new Error("Не удалось прочитать изображение");

	return {
		key: crypto.randomUUID(),
		previewUrl: URL.createObjectURL(blob),
		image: { mediaType: "image/jpeg", data: await blobToBase64(blob) },
	};
}
