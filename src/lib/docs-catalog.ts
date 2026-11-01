import { parse } from "yaml";
import { z } from "zod";

export const DOC_CATEGORIES = ["about", "info", "dev", "safety"] as const;
export type DocCategory = typeof DOC_CATEGORIES[number];
export const DOC_LABELS: Record<DocCategory, string> = { about: "De missie", info: "ROUT gebruiken", dev: "Developers", safety: "Trust & Safety" };
const schema = z.object({ title: z.string().min(1), description: z.string().min(1), category: z.enum(DOC_CATEGORIES), last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), ai_ready: z.literal(true) });
export type DocEntry = z.infer<typeof schema> & { path: string; source: string; headings: { id: string; text: string; level: number }[] };
export const headingId = (text: string) => text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export function parseDoc(source: string, file: string): DocEntry {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
  if (!match?.[1]) throw new Error(`Missing frontmatter: ${file}`);
  const meta = schema.parse(parse(match[1]));
  const relative = file.replace(/^.*\/content\//, "").replace(/\.mdx$/, "");
  const path = `/${relative.replace(/\/index$/, "")}`;
  if (!path.startsWith(`/${meta.category}`)) throw new Error(`Wrong category: ${file}`);
  const seen = new Map<string, number>();
  const headings = [...source.matchAll(/^(#{2,3}) (.+)$/gm)].map(m => {
    const text = (m[2] ?? "").replace(/[`*_]/g, "");
    const base = headingId(text); const count = seen.get(base) ?? 0; seen.set(base, count + 1);
    return { id: count ? `${base}-${count}` : base, text, level: m[1]?.length ?? 2 };
  });
  return { ...meta, path, source, headings };
}
const sources = import.meta.glob("/src/content/**/*.mdx", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
export const docs = Object.entries(sources).map(([file, source]) => parseDoc(source, file));
export function getDoc(path: string) { return docs.find(d => d.path === path); }
export function docsInCategory(category: DocCategory) { return docs.filter(d => d.category === category); }
export function docHead(path: string) {
  const doc = getDoc(path);
  const title = `${doc?.title ?? "Documentatie"} — ROUT`;
  const description = doc?.description ?? "ROUT-documentatie";
  return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }] };
}