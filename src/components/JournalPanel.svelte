<script lang="ts">
	import { journal } from "@/lib/journal.svelte";

	import JournalEntryItem from "./JournalEntryItem.svelte";
	import JournalForm from "./JournalForm.svelte";
</script>

<JournalForm />
{#if journal.error}<p class="error" role="alert">{journal.error}</p>{/if}
<ul>
	{#each journal.entries as entry (entry.id)}<JournalEntryItem {entry} />{:else}
		<li class="empty">
			Nothing logged yet. After you cook, note how it tasted and how long it took. I'll remember for next
			time.
		</li>
	{/each}
</ul>

<style>
	ul {
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}

	.empty {
		color: var(--muted);
		font-style: italic;
	}
</style>
