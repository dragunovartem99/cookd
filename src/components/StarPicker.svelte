<script lang="ts">
	let { value = $bindable(0) }: { value: number } = $props();
</script>

<fieldset>
	<legend class="label">Как получилось на вкус?</legend>
	<div>
		{#each [1, 2, 3, 4, 5] as n (n)}
			<label class:on={n <= value}>
				<input type="radio" name="taste" value={n} required bind:group={value} />
				<span aria-hidden="true">★</span>
				<span class="sr">{n} из 5</span>
			</label>
		{/each}
	</div>
</fieldset>

<style>
	fieldset {
		margin: 0;
		padding: 0;
		border: 0;
	}

	legend {
		margin-bottom: 0.2rem;
		color: var(--muted);
	}

	div {
		display: flex;
	}

	label {
		position: relative;
		color: var(--line);
		font-size: 1.7rem;
		line-height: 1.2;
		cursor: pointer;
	}

	label.on {
		color: var(--accent);
	}

	input,
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
	}

	label:has(:focus-visible) {
		outline: 2px solid var(--accent);
		border-radius: 4px;
	}
</style>
