<script lang="ts">
	import { pantry } from "@/lib/pantry.svelte";

	import JournalPanel from "./JournalPanel.svelte";
	import PantryPanel from "./PantryPanel.svelte";

	let tab = $state<"pantry" | "journal">("pantry");
</script>

<div class="panel">
	<div class="tabs" role="tablist">
		<button
			class="tab"
			role="tab"
			aria-selected={tab === "pantry"}
			onclick={() => (tab = "pantry")}
		>
			Pantry <small>{pantry.inStock.length}</small>
		</button>
		<button
			class="tab"
			role="tab"
			aria-selected={tab === "journal"}
			onclick={() => (tab = "journal")}
		>
			Journal
		</button>
	</div>
	<div class="body" role="tabpanel">
		{#if tab === "pantry"}<PantryPanel />{:else}<JournalPanel />{/if}
	</div>
</div>

<style>
	.tabs {
		display: flex;
		border-bottom: 1px solid var(--line);
	}

	.tab {
		flex: 1;
		padding: 0.85rem 0.5rem;
		border: 0;
		border-bottom: 2px solid transparent;
		background: none;
		color: var(--muted);
	}

	.tab[aria-selected="true"] {
		border-bottom-color: var(--accent);
		color: var(--ink);
	}

	small {
		margin-left: 0.2rem;
		color: var(--muted);
	}

	.body {
		padding: 1rem;
	}
</style>
