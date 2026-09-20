// oxlint's `max-lines` reads only the <script> block of a .svelte file, so a component's markup
// and styles could grow without limit. This applies the same budget to the whole file:
// at most MAX lines of real content, not counting blank lines or comments.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const MAX = 100;

export function countCodeLines(source: string): number {
	const withoutBlocks = source.replaceAll(/<!--.*?-->|\/\*.*?\*\//gsu, "");
	return withoutBlocks.split("\n").filter((line) => {
		const trimmed = line.trim();
		return trimmed !== "" && !trimmed.startsWith("//");
	}).length;
}

function* svelteFiles(dir: string): Generator<string> {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) yield* svelteFiles(path);
		else if (entry.name.endsWith(".svelte")) yield path;
	}
}

if (import.meta.main) {
	const tooLong = [...svelteFiles("src")]
		.map((file) => ({ file, lines: countCodeLines(readFileSync(file, "utf8")) }))
		.filter(({ lines }) => lines > MAX);

	for (const { file, lines } of tooLong) console.error(`${file}: ${lines} lines, at most ${MAX}`);
	process.exit(tooLong.length > 0 ? 1 : 0);
}
