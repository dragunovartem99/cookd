<script lang="ts">
	import type { ViewMessage } from "@/lib/chat.svelte";

	import { renderMarkdown } from "@/lib/markdown";

	import Thumb from "./Thumb.svelte";

	let { message, streaming }: { message: ViewMessage; streaming: boolean } = $props();
</script>

<article class={message.role}>
	{#if message.images.length > 0}
		<div class="photos">
			{#each message.images as image, i (i)}<Thumb {image} />{/each}
		</div>
	{/if}
	{#if message.role === "user"}
		<p class="text">{message.text}</p>
	{:else if message.text}
		<div class="prose">{@html renderMarkdown(message.text)}</div>
	{:else if streaming}
		<p class="thinking">Думаю…</p>
	{/if}
</article>

<style>
	.user {
		justify-self: end;
		max-width: 85%;
		padding: 0.6rem 0.9rem;
		border-radius: 14px 14px 4px;
		background: var(--accent);
		color: var(--accent-ink);
	}

	.text {
		margin: 0;
		white-space: pre-wrap;
	}

	.photos {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 0.4rem;
	}

	.thinking {
		margin: 0;
		color: var(--muted);
		font-style: italic;
	}

	.prose :global(> :first-child) {
		margin-top: 0;
	}

	.prose :global(> :last-child) {
		margin-bottom: 0;
	}

	.prose :global(h1),
	.prose :global(h2),
	.prose :global(h3) {
		margin: 1.2em 0 0.4em;
		font-weight: 600;
		line-height: 1.25;
	}

	.prose :global(ul),
	.prose :global(ol) {
		padding-left: 1.3rem;
	}
</style>
