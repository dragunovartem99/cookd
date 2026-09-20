<script lang="ts">
	import { chat } from "@/lib/chat.svelte";

	const starters = [
		"Что можно приготовить из моих запасов?",
		"Что-нибудь быстрое на вечер, до 20 минут",
		"Научи меня одному приёму, который пригодится всегда",
	];
</script>

<div>
	<h2>Что готовим?</h2>
	<p>
		Расскажите, что у вас есть или чего хочется. После готовки пришлите фото блюда, и я разберу, что
		получилось. Я знаю, что у вас в кладовой и что вы уже готовили.
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
