import { mergeConfig, defineConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

export default mergeConfig(
	viteConfig,
	defineConfig({
		// Svelte components resolve to their browser build under test.
		resolve: { conditions: ["browser"] },
		test: { environment: "jsdom", root: import.meta.dirname, coverage: { provider: "v8" } },
	})
);
