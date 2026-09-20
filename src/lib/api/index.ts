import { request } from "./client";
import type { Conversation, Ingredient, JournalEntry, Message, NewJournalEntry } from "./types";

export { ApiError } from "./client";
export { streamMessage } from "./chat";
export type * from "./types";

export const auth = {
	login: (password: string) =>
		request<{ token: string; email: string }>("/auth/login", {
			method: "POST",
			body: { password },
		}),
};

export const conversations = {
	list: () => request<Conversation[]>("/conversations"),
	create: () => request<Conversation>("/conversations", { method: "POST" }),
	remove: (id: string) => request<void>(`/conversations/${id}`, { method: "DELETE" }),
	messages: (id: string) => request<Message[]>(`/conversations/${id}/messages`),
};

export const ingredients = {
	list: () => request<Ingredient[]>("/ingredients"),
	add: (text: string) =>
		request<Ingredient[]>("/ingredients", { method: "POST", body: { text } }),
	setInStock: (id: number, inStock: boolean) =>
		request<Ingredient>(`/ingredients/${id}`, { method: "PATCH", body: { inStock } }),
	remove: (id: number) => request<void>(`/ingredients/${id}`, { method: "DELETE" }),
};

export const journal = {
	list: () => request<JournalEntry[]>("/journal"),
	add: (entry: NewJournalEntry) =>
		request<JournalEntry>("/journal", { method: "POST", body: entry }),
	remove: (id: number) => request<void>(`/journal/${id}`, { method: "DELETE" }),
};
