<script lang="ts">
	import { conversations } from "@/lib/conversations.svelte";
	import { openConversation } from "@/lib/navigation";

	let { onpick }: { onpick: () => void } = $props();

	function pick(id: string) {
		void openConversation(id);
		onpick();
	}

	async function remove(id: string, title: string) {
		if (!confirm(`Удалить «${title || "этот чат"}» вместе с фото?`)) return;
		const wasActive = conversations.activeId === id;
		await conversations.remove(id);
		if (wasActive) await openConversation(null);
	}
</script>

{#if conversations.error}<p class="error" role="alert">{conversations.error}</p>{/if}
<ul>
	{#each conversations.list as c (c.id)}
		<li class:active={c.id === conversations.activeId}>
			<button class="title" onclick={() => pick(c.id)}>{c.title || "Новый чат"}</button>
			<button class="icon-btn" aria-label="Удалить чат" onclick={() => remove(c.id, c.title)}>×</button>
		</li>
	{:else}
		<li class="empty">Пока пусто. Начните чат.</li>
	{/each}
</ul>

<style>
	ul {
		display: grid;
		gap: 0.15rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		border-radius: 8px;
	}

	li.active {
		background: var(--bg);
	}

	.title {
		flex: 1;
		min-width: 0;
		padding: 0.45rem 0.6rem;
		border: 0;
		background: none;
		overflow-wrap: anywhere;
		text-align: left;
	}

	.empty {
		padding: 0.5rem 0.6rem;
		color: var(--muted);
		font-style: italic;
	}
</style>
