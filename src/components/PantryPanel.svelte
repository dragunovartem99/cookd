<script lang="ts">
	import { pantry } from "@/lib/pantry.svelte";

	import IngredientForm from "./IngredientForm.svelte";
	import IngredientRow from "./IngredientRow.svelte";
</script>

<IngredientForm />
{#if pantry.error}<p class="error" role="alert">{pantry.error}</p>{/if}
{#if pantry.items.length === 0}
	<p class="empty">
		Перечислите, что обычно покупаете. Когда что-то закончится, отключите. Список сохранится до следующего раза.
	</p>
{/if}
{#if pantry.inStock.length > 0}
	<h3>В наличии · {pantry.inStock.length}</h3>
	<ul>
		{#each pantry.inStock as item (item.id)}<IngredientRow {item} />{/each}
	</ul>
{/if}
{#if pantry.out.length > 0}
	<h3>Закончилось · {pantry.out.length}</h3>
	<ul>
		{#each pantry.out as item (item.id)}<IngredientRow {item} />{/each}
	</ul>
{/if}

<style>
	h3 {
		margin: 1.4rem 0 0.4rem;
		color: var(--muted);
		font: 600 0.75rem var(--sans);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.empty {
		margin-top: 1rem;
		color: var(--muted);
		font-style: italic;
	}
</style>
