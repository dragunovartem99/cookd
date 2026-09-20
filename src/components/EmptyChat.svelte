<script lang="ts">
	import { chat } from "@/lib/chat.svelte";

	const starters = [
		"What can I cook with what's in my pantry?",
		"Something quick for tonight, under 20 minutes",
		"Teach me one technique I'll use all the time",
	];
</script>

<div>
	<h2>What are we cooking?</h2>
	<p>
		Tell me what you have, or send a photo of your fridge. I know what's in your pantry and what you've
		cooked before.
	</p>
	<ul>
		{#each starters as starter (starter)}
			<li><button class="btn" onclick={() => chat.send(starter, [])}>{starter}</button></li>
		{/each}
	</ul>
</div>

<style>
	div {
		padding: 3vh 0;
	}

	h2 {
		margin: 0 0 0.5rem;
		font-size: 1.9rem;
		font-weight: 500;
		letter-spacing: -0.02em;
	}

	p {
		margin: 0 0 1.25rem;
		color: var(--muted);
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
