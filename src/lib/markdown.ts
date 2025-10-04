import { remark } from "remark";
import html from "remark-html";

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await remark().use(html, { sanitize: false }).process(markdown);
  return String(file);
}
