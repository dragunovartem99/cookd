<script lang="ts">
	import type { ViewImage } from "@/lib/chat.svelte";

	import { imageUrl } from "@/lib/api/images";

	let { image, onremove }: { image: ViewImage; onremove?: () => void } = $props();

	// A photo already stored is private, so it is fetched with the token first.
	let fetched = $state<string | null>(null);
	const src = $derived("url" in image ? image.url : fetched);

	$effect(() => {
		if ("id" in image) {
			imageUrl(image.id)
				.then((url) => (fetched = url))
				.catch(() => (fetched = null));
		}
	});
</script>

<span class="thumb">
	{#if src}<img {src} alt="Attached" />{/if}
	{#if onremove}
		<button class="remove" aria-label="Remove photo" onclick={onremove}>×</button>
	{/if}
</span>

<style>
	.thumb {
		position: relative;
		display: inline-block;
		width: 5rem;
		height: 5rem;
		overflow: hidden;
		border-radius: 8px;
		background: var(--line);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.remove {
		position: absolute;
		top: 0.2rem;
		right: 0.2rem;
		width: 1.3rem;
		height: 1.3rem;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: rgb(0 0 0 / 0.6);
		color: white;
		line-height: 1.3rem;
	}
</style>
