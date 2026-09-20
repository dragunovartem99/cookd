import { session } from "@/lib/session.svelte";

export const API_URL: string =
	import.meta.env.VITE_API_URL ??
	(import.meta.env.DEV ? "http://localhost:50001" : "https://cookd.dragunov.dev");

export class ApiError extends Error {
	constructor(
		readonly status: number,
		message: string
	) {
		super(message);
	}
}

interface Options {
	method?: string;
	body?: unknown;
	signal?: AbortSignal;
}

// Calls the API with the session token and returns the raw response, so a
// caller can stream it. Anything but a 2xx becomes an ApiError carrying the
// server's own message; a 401 while signed in means the session is over.
//
export async function send(path: string, { method = "GET", body, signal }: Options = {}) {
	const headers: Record<string, string> = {};
	if (session.token) headers.Authorization = `Bearer ${session.token}`;
	if (body !== undefined) headers["Content-Type"] = "application/json";

	let response: Response;
	try {
		response = await fetch(API_URL + path, {
			method,
			headers,
			signal,
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	} catch (error) {
		if (signal?.aborted) throw error;
		throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
	}

	if (!response.ok) {
		const payload = (await response.json().catch(() => null)) as { error?: string } | null;
		if (response.status === 401 && session.token) session.end();
		throw new ApiError(
			response.status,
			payload?.error ?? `Request failed (${response.status})`
		);
	}
	return response;
}

// Calls the API and parses the JSON answer; a 204 resolves to undefined.
export async function request<T>(path: string, options?: Options): Promise<T> {
	const response = await send(path, options);
	return (response.status === 204 ? undefined : await response.json()) as T;
}
