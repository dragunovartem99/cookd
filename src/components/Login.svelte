<script lang="ts">
	import * as api from "@/lib/api";
	import { describe } from "@/lib/errors";
	import { session } from "@/lib/session.svelte";

	let password = $state("");
	let error = $state<string | null>(null);
	let busy = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		error = null;
		try {
			session.start((await api.auth.login(password)).token);
		} catch (failure) {
			error = describe(failure);
			password = "";
		} finally {
			busy = false;
		}
	}
</script>

<main>
	<form onsubmit={submit}>
		<h1>cookd</h1>
		<p class="tagline">Your kitchen, remembered.</p>
		<label class="label" for="password">Password</label>
		<input
			id="password"
			class="input"
			type="password"
			autocomplete="current-password"
			required
			bind:value={password}
		/>
		{#if error}<p class="error" role="alert">{error}</p>{/if}
		<button class="btn primary" disabled={busy || !password}>
			{busy ? "Signing in…" : "Sign in"}
		</button>
	</form>
</main>

<style>
	main {
		display: grid;
		min-height: 100%;
		place-items: center;
		padding: 1rem;
	}

	form {
		display: grid;
		gap: 0.6rem;
		width: min(22rem, 100%);
		padding: 2rem;
		border: 1px solid var(--line);
		border-radius: 14px;
		background: var(--surface);
	}

	h1 {
		margin: 0;
		font-size: 2.4rem;
		font-weight: 500;
		letter-spacing: -0.02em;
	}

	.tagline {
		margin: 0 0 1rem;
		color: var(--muted);
		font-style: italic;
	}

	.label {
		color: var(--muted);
	}
</style>
