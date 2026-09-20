import { fileURLToPath, URL } from "node:url";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// Relative base: the site is served from a project path on GitHub Pages.
export default defineConfig({
	base: "./",
	plugins: [svelte()],
	resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
