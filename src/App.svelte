<script lang="ts">
	import Login from "@/components/Login.svelte";
	import Workspace from "@/components/Workspace.svelte";
	import { session } from "@/lib/session.svelte";
</script>

{#if session.token}
	<Workspace />
{:else}
	<Login />
{/if}
