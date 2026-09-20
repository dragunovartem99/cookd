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
	<summary class="btn">Записать блюдо</summary>
	<form onsubmit={submit}>
		<input class="input" placeholder="Что вы приготовили?" aria-label="Блюдо" required maxlength="100" bind:value={dish} />
		<StarPicker bind:value={taste} />
		<div class="row">
			<input class="input" type="number" min="1" max="1440" placeholder="Минуты" aria-label="Сколько минут заняло" bind:value={minutes} />
			<input class="input" type="date" max={today()} aria-label="Дата" required bind:value={cookedOn} />
		</div>
		<textarea class="input" rows="2" maxlength="500" placeholder="Заметки: пересолено? в следующий раз меньше?" aria-label="Заметки" bind:value={note}></textarea>
		<button class="btn primary" disabled={busy}>Сохранить</button>
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
