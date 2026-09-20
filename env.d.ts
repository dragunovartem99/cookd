/// <reference types="vite/client" />
/// <reference types="svelte" />

interface ImportMetaEnv {
	/** Base URL of cookd-api; defaults to localhost in dev and cookd.dragunov.dev in production. */
	readonly VITE_API_URL?: string;
}
