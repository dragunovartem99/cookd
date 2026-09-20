<script lang="ts">
	import type { JournalEntry } from "@/lib/api";

	import { formatDay } from "@/lib/date";
	import { journal } from "@/lib/journal.svelte";

	import Stars from "./Stars.svelte";

	let { entry }: { entry: JournalEntry } = $props();
</script>

<li>
	<div class="head">
		<strong>{entry.dish}</strong>
		<button class="icon-btn" aria-label="Delete {entry.dish}" onclick={() => journal.remove(entry.id)}>×</button>
	</div>
	<p class="meta">
		<Stars n={entry.taste} /> · {formatDay(entry.cookedOn)}{#if entry.minutes} · {entry.minutes} min{/if}
	</p>
	{#if entry.note}<p class="note">{entry.note}</p>{/if}
</li>

<style>
	li {
		padding: 0.8rem 0;
		border-bottom: 1px solid var(--line);
	}

	.head {
		display: flex;
		justify-content: space-between;
	}

	p {
		margin: 0.1rem 0 0;
	}

	.meta {
		color: var(--muted);
		font: 0.8rem var(--sans);
	}

	.note {
		font-style: italic;
	}
</style>
