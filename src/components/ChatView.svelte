<script lang="ts">
	import { chat } from "@/lib/chat.svelte";
	import { conversations } from "@/lib/conversations.svelte";

	import Composer from "./Composer.svelte";
	import MessageList from "./MessageList.svelte";

	let { onmenu, onkitchen }: { onmenu: () => void; onkitchen: () => void } = $props();

	const title = $derived(
		conversations.list.find((c) => c.id === conversations.activeId)?.title || "New conversation"
	);
</script>

<main>
	<header>
		<button class="btn" onclick={onmenu}>Chats</button>
		<h2>{title}</h2>
		<button class="btn" onclick={onkitchen}>Kitchen</button>
	</header>
	<MessageList />
	{#if chat.error}<p class="error" role="alert">{chat.error}</p>{/if}
	{#if chat.notice}<p class="notice">{chat.notice}</p>{/if}
	<Composer />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: 100%;
	}

	header {
		display: none;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 1rem;
		border-bottom: 1px solid var(--line);
	}

	h2 {
		flex: 1;
		margin: 0;
		font-size: 1rem;
		font-weight: 500;
		text-align: center;
		overflow-wrap: anywhere;
	}

	.error,
	.notice {
		width: min(46rem, 100%);
		margin: 0 auto;
		padding: 0 1rem;
	}

	.notice {
		color: var(--muted);
		font: 0.875rem var(--sans);
	}

	@media (max-width: 62rem) {
		header {
			display: flex;
		}
	}
</style>
