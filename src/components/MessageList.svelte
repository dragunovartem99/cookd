<script lang="ts">
	import { chat } from "@/lib/chat.svelte";

	import EmptyChat from "./EmptyChat.svelte";
	import MessageBubble from "./MessageBubble.svelte";

	let list: HTMLElement | undefined = $state();
	let stuck = true;

	// Follow the answer as it is written, unless the reader has scrolled up.
	$effect(() => {
		void chat.messages.length;
		void chat.messages.at(-1)?.text;
		if (stuck) queueMicrotask(() => list && (list.scrollTop = list.scrollHeight));
	});

	function onscroll() {
		if (list) stuck = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
	}
</script>

<section bind:this={list} {onscroll}>
	<div class="column">
		{#if chat.loading}
			<p class="hint">Loading…</p>
		{:else if chat.messages.length === 0}
			<EmptyChat />
		{/if}
		{#each chat.messages as message (message.key)}
			<MessageBubble {message} streaming={chat.busy && message === chat.messages.at(-1)} />
		{/each}
	</div>
</section>

<style>
	section {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem 1rem;
	}

	.column {
		display: grid;
		gap: 1.25rem;
		width: min(46rem, 100%);
		margin: 0 auto;
	}

	.hint {
		color: var(--muted);
		font-style: italic;
	}
</style>
