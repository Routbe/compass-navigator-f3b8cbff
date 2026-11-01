import { lazy, Suspense, type ComponentType } from "react";
import { MDXProvider } from "@mdx-js/react";
import { DocsLayout } from "@/layouts/DocsLayout";
import { getDoc } from "@/lib/docs-catalog";
import { mdxComponents } from "./components";
const modules = import.meta.glob<{ default: ComponentType }>("/src/content/**/*.mdx");
const pages = new Map(Object.entries(modules).map(([file, load]) => [file.replace("/src/content", "").replace(/\.mdx$/, "").replace(/\/index$/, ""), lazy(load)]));
export function DocPage({ path }: { path: string }) {
  const doc = getDoc(path); const Content = pages.get(path);
  if (!doc || !Content) return <p>Artikel niet beschikbaar.</p>;
  return <DocsLayout doc={doc}><MDXProvider components={mdxComponents}><Suspense fallback={<p className="text-muted-foreground">Artikel laden…</p>}><Content /></Suspense></MDXProvider></DocsLayout>;
}