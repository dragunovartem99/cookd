const KEY = "cookd.session";

// Storage can throw or be empty (private windows, blocked site data), so every
// access is guarded and the app still works for the length of the visit.
function read(): string | null {
	try {
		return localStorage.getItem(KEY);
	} catch {
		return null;
	}
}

function write(token: string | null) {
	try {
		if (token) localStorage.setItem(KEY, token);
		else localStorage.removeItem(KEY);
	} catch {
		// Not persisted; the session lives until the tab closes.
	}
}

class Session {
	token = $state<string | null>(read());

	start(token: string) {
		this.token = token;
		write(token);
	}

	end() {
		this.token = null;
		write(null);
	}
}

export const session = new Session();
