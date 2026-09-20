<script lang="ts">
	import type { Attachments } from "@/lib/attachments.svelte";

	import Thumb from "./Thumb.svelte";

	let { photos }: { photos: Attachments } = $props();
</script>

{#if photos.items.length > 0}
	<div class="thumbs">
		{#each photos.items as a (a.key)}
			<Thumb image={{ url: a.previewUrl }} onremove={() => photos.remove(a.key)} />
		{/each}
	</div>
{/if}
{#if photos.problem}<p class="error" role="alert">{photos.problem}</p>{/if}

<style>
	.thumbs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 0.5rem;
	}
</style>
