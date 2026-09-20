<script lang="ts">
	import { session } from "@/lib/session.svelte";
	import { openConversation } from "@/lib/navigation";

	import ConversationList from "./ConversationList.svelte";

	let { onpick }: { onpick: () => void } = $props();

	function startNew() {
		void openConversation(null);
		onpick();
	}
</script>

<nav>
	<h1>cookd</h1>
	<button class="btn primary" onclick={startNew}>New chat</button>
	<ConversationList {onpick} />
	<button class="btn signout" onclick={() => session.end()}>Sign out</button>
</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-height: 100%;
		padding: 1.25rem 1rem;
	}

	h1 {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 500;
		letter-spacing: -0.02em;
	}

	.signout {
		margin-top: auto;
	}
</style>
