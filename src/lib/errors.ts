import { ApiError } from "@/lib/api/client";

// A message fit to show the user for whatever went wrong.
export function describe(error: unknown): string {
	if (error instanceof ApiError) return error.message;
	return "Что-то пошло не так. Попробуйте ещё раз.";
}
