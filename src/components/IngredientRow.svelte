<script lang="ts">
	import type { Ingredient } from "@/lib/api";

	import { pantry } from "@/lib/pantry.svelte";

	let { item }: { item: Ingredient } = $props();
</script>

<li class:out={!item.inStock}>
	<label>
		<input
			class="switch"
			type="checkbox"
			role="switch"
			checked={item.inStock}
			onchange={() => pantry.toggle(item)}
		/>
		<span>{item.name}</span>
	</label>
	<button class="icon-btn" aria-label="Убрать {item.name}" onclick={() => pantry.remove(item)}>×</button>
</li>

<style>
	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	label {
		display: flex;
		flex: 1;
		gap: 0.7rem;
		align-items: center;
		padding: 0.3rem 0;
		cursor: pointer;
	}

	.out span {
		color: var(--muted);
		text-decoration: line-through;
		text-decoration-color: var(--line);
	}
</style>
