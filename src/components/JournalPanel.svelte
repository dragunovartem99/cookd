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
			Пока ничего не записано. После готовки отметьте, как получилось и сколько это заняло. Я запомню на будущее.
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
