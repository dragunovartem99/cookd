<script lang="ts">
	import { onMount } from "svelte";

	import { conversations } from "@/lib/conversations.svelte";
	import { journal } from "@/lib/journal.svelte";
	import { pantry } from "@/lib/pantry.svelte";

	import ChatView from "./ChatView.svelte";
	import KitchenPanel from "./KitchenPanel.svelte";
	import Sidebar from "./Sidebar.svelte";

	// On a narrow screen the two side panels are drawers over the chat.
	let drawer = $state<"none" | "left" | "right">("none");

	onMount(() => {
		void conversations.load();
		void pantry.load();
		void journal.load();
	});
</script>

<div class="shell" data-drawer={drawer}>
	<aside class="left"><Sidebar onpick={() => (drawer = "none")} /></aside>
	<ChatView onmenu={() => (drawer = "left")} onkitchen={() => (drawer = "right")} />
	<aside class="right"><KitchenPanel /></aside>
	<button class="scrim" aria-label="Close panel" onclick={() => (drawer = "none")}></button>
</div>

<style>
	.shell {
		display: grid;
		grid-template-columns: 16rem minmax(0, 1fr) 20rem;
		height: 100%;
	}

	aside {
		overflow-y: auto;
		background: var(--surface);
		border: 0 solid var(--line);
	}

	.left {
		border-right-width: 1px;
	}

	.right {
		border-left-width: 1px;
	}

	.scrim {
		display: none;
	}

	@media (max-width: 62rem) {
		.shell {
			grid-template-columns: minmax(0, 1fr);
		}

		aside {
			position: fixed;
			inset: 0 auto 0 0;
			z-index: 20;
			width: min(22rem, 88vw);
			transform: translateX(-102%);
			transition: transform 0.2s;
		}

		.right {
			inset: 0 0 0 auto;
			transform: translateX(102%);
		}

		[data-drawer="left"] .left,
		[data-drawer="right"] .right {
			transform: none;
		}

		[data-drawer="left"] .scrim,
		[data-drawer="right"] .scrim {
			position: fixed;
			inset: 0;
			z-index: 10;
			display: block;
			border: 0;
			background: rgb(0 0 0 / 0.35);
		}
	}
</style>
