export interface Conversation {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
}

export interface MessageImage {
	id: number;
	mediaType: string;
}

export interface Message {
	id: number;
	role: "user" | "assistant";
	text: string;
	images: MessageImage[];
	createdAt: string;
}

export interface Ingredient {
	id: number;
	name: string;
	inStock: boolean;
}

export interface JournalEntry {
	id: number;
	dish: string;
	cookedOn: string;
	taste: number;
	minutes: number | null;
	note: string;
	createdAt: string;
}

export interface NewJournalEntry {
	dish: string;
	taste: number;
	minutes?: number;
	note?: string;
	cookedOn?: string;
}

export interface UploadImage {
	mediaType: string;
	// Standard base64, no data: prefix.
	data: string;
}

// What the server streams back while it answers.
export type ChatEvent =
	| { type: "delta"; text: string }
	| { type: "done"; messageId: number; title: string; stopReason: string }
	| { type: "error"; error: string };
