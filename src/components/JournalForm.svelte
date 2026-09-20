<script lang="ts">
	import { today } from "@/lib/date";
	import { journal } from "@/lib/journal.svelte";

	import StarPicker from "./StarPicker.svelte";

	let open = $state(false);
	let busy = $state(false);
	let dish = $state("");
	let taste = $state(0);
	let minutes = $state<number | null>(null);
	let note = $state("");
	let cookedOn = $state(today());

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		const saved = await journal.add({
			dish: dish.trim(),
			taste,
			minutes: minutes ?? undefined,
			note: note.trim() || undefined,
			cookedOn,
		});
		busy = false;
		if (!saved) return;
		[dish, taste, minutes, note, cookedOn, open] = ["", 0, null, "", today(), false];
	}
</script>

<details bind:open>
	<summary class="btn">Log a dish</summary>
	<form onsubmit={submit}>
		<input class="input" placeholder="What did you cook?" aria-label="Dish" required maxlength="100" bind:value={dish} />
		<StarPicker bind:value={taste} />
		<div class="row">
			<input class="input" type="number" min="1" max="1440" placeholder="Minutes" aria-label="Minutes it took" bind:value={minutes} />
			<input class="input" type="date" max={today()} aria-label="Date" required bind:value={cookedOn} />
		</div>
		<textarea class="input" rows="2" maxlength="500" placeholder="Notes: too salty? use less next time?" aria-label="Notes" bind:value={note}></textarea>
		<button class="btn primary" disabled={busy}>Save</button>
	</form>
</details>

<style>
	summary {
		display: block;
		text-align: center;
		list-style: none;
	}

	form {
		display: grid;
		gap: 0.6rem;
		margin-top: 0.75rem;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	textarea {
		resize: none;
	}
</style>
