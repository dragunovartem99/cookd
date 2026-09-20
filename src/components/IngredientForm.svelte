<script lang="ts">
	import { pantry } from "@/lib/pantry.svelte";

	let text = $state("");
	let busy = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!text.trim()) return;
		busy = true;
		if (await pantry.add(text)) text = "";
		busy = false;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
			event.preventDefault();
			(event.currentTarget as HTMLTextAreaElement).form?.requestSubmit();
		}
	}
</script>

<form onsubmit={submit}>
	<textarea
		class="input"
		rows="2"
		placeholder="Добавить: яйца, рис, помидоры"
		aria-label="Продукты для добавления"
		bind:value={text}
		{onkeydown}
	></textarea>
	<button class="btn primary" disabled={busy || !text.trim()}>Добавить</button>
</form>

<style>
	form {
		display: grid;
		gap: 0.5rem;
	}

	textarea {
		resize: none;
	}
</style>
