import DOMPurify from "dompurify";
import { marked } from "marked";

// Renders the model's Markdown to HTML. The text comes from a model and is
// inserted with {@html}, so it is always sanitised on the way out.
//
export function renderMarkdown(text: string): string {
	return DOMPurify.sanitize(marked.parse(text, { async: false, breaks: true }));
}
