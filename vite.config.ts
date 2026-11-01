// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const docsCatalogPlugin = {
  name: "rout-docs-catalog",
  resolveId(id: string) { if (id === "virtual:rout-docs") return "\0virtual:rout-docs"; },
  load(id: string) {
    if (id !== "\0virtual:rout-docs") return;
    const sources: Record<string, string> = {};
    for (const category of ["about", "info", "dev", "safety"]) {
      const dir = resolve("src/content", category);
      for (const file of readdirSync(dir)) if (file.endsWith(".mdx")) sources[`/src/content/${category}/${file}`] = readFileSync(resolve(dir, file), "utf8");
    }
    return `export default ${JSON.stringify(sources)}`;
  },
};

export default defineConfig({
  vite: { plugins: [docsCatalogPlugin, mdx({ include: /\.mdx$/, providerImportSource: "@mdx-js/react", remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] })] },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
