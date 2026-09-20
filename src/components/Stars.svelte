<script lang="ts">
	let { n }: { n: number } = $props();
</script>

<span class="stars" role="img" aria-label="{n} из 5">
	{"★".repeat(n)}<span class="off">{"★".repeat(5 - n)}</span>
</span>

<style>
	.stars {
		color: var(--accent);
		letter-spacing: 0.05em;
	}

	.off {
		color: var(--line);
	}
</style>
