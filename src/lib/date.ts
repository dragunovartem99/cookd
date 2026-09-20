// Today as YYYY-MM-DD in the browser's own timezone, the shape the API stores.
export function today(now = new Date()): string {
	const month = String(now.getMonth() + 1).padStart(2, "0");
	return `${now.getFullYear()}-${month}-${String(now.getDate()).padStart(2, "0")}`;
}

// "14 Sep" for a YYYY-MM-DD date, with the year when it is not this one.
export function formatDay(iso: string, now = new Date()): string {
	const [year, month, day] = iso.split("-").map(Number);
	const date = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
	return date.toLocaleDateString(undefined, {
		day: "numeric",
		month: "short",
		year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
	});
}
