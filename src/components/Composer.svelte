<script lang="ts">
	import { Attachments } from "@/lib/attachments.svelte";
	import { chat } from "@/lib/chat.svelte";

	import AttachmentTray from "./AttachmentTray.svelte";

	const photos = new Attachments();
	let text = $state("");
	let picker: HTMLInputElement | undefined = $state();
	const canSend = $derived(!chat.busy && (text.trim() !== "" || photos.items.length > 0));

	async function submit() {
		if (!canSend) return;
		const [sentText, sentPhotos] = [text.trim(), photos.take()];
		text = "";
		// Put the draft back if nothing was kept, so a failure loses no typing.
		if (!(await chat.send(sentText, sentPhotos))) {
			text = sentText;
			photos.items = sentPhotos;
		}
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
			event.preventDefault();
			void submit();
		}
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		void submit();
	}

	function onpick(event: Event & { currentTarget: HTMLInputElement }) {
		void photos.add([...(event.currentTarget.files ?? [])]);
		event.currentTarget.value = "";
	}

	function onpaste(event: ClipboardEvent) {
		const files = [...(event.clipboardData?.files ?? [])];
		if (files.some((f) => f.type.startsWith("image/"))) {
			event.preventDefault();
			void photos.add(files);
		}
	}
</script>

<form onsubmit={onsubmit}>
	<AttachmentTray {photos} />
	<div class="bar">
		<button type="button" class="btn" onclick={() => picker?.click()}>Фото</button>
		<input
			bind:this={picker}
			type="file"
			accept="image/*"
			multiple
			hidden
			onchange={onpick}
		/>
		<textarea
			class="input"
			rows="1"
			placeholder="Что готовим?"
			bind:value={text}
			{onkeydown}
			{onpaste}
		></textarea>
		{#if chat.busy}
			<button type="button" class="btn" onclick={() => chat.stop()}>Стоп</button>
		{:else}
			<button class="btn primary" disabled={!canSend}>Отправить</button>
		{/if}
	</div>
</form>

<style>
	form {
		width: min(46rem, 100%);
		margin: 0 auto;
		padding: 0.5rem 1rem 1rem;
	}

	.bar {
		display: flex;
		gap: 0.5rem;
		align-items: flex-end;
	}

	textarea {
		max-height: 40vh;
		resize: none;
		field-sizing: content;
		font-family: var(--serif);
		font-size: 1rem;
	}

	.btn {
		align-self: stretch;
	}
</style>
