import { chat } from "@/lib/chat.svelte";
import { conversations } from "@/lib/conversations.svelte";

// Shows a stored conversation, or a fresh blank one for null. Selection and
// loading are one step here rather than an effect, so starting a conversation
// while sending its first message cannot reload it out from under the answer.
export async function openConversation(id: string | null): Promise<void> {
	conversations.activeId = id;
	await chat.open(id);
}
