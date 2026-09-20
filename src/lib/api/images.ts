import { send } from "./client";

const cache = new Map<number, Promise<string>>();

// Photos are private, so an <img src> cannot fetch them (it can't send the
// token). They are fetched with it and shown from an object URL instead; a
// photo never changes, so one fetch per id is enough.
//
export function imageUrl(id: number): Promise<string> {
	let url = cache.get(id);
	if (!url) {
		url = send(`/images/${id}`)
			.then((response) => response.blob())
			.then((blob) => URL.createObjectURL(blob));
		url.catch(() => cache.delete(id));
		cache.set(id, url);
	}
	return url;
}
