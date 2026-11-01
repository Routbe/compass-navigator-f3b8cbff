import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { readdirSync, readFileSync } from "node:fs";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

export default defineConfig({
  plugins: [{
    name: "rout-docs-test-catalog",
    resolveId(id) { if (id === "virtual:rout-docs") return "\0virtual:rout-docs"; },
    load(id) {
      if (id !== "\0virtual:rout-docs") return;
      const sources: Record<string, string> = {};
      for (const category of ["about", "info", "dev", "safety"]) for (const file of readdirSync(`src/content/${category}`)) {
        if (file.endsWith(".mdx")) sources[`/src/content/${category}/${file}`] = readFileSync(`src/content/${category}/${file}`, "utf8");
      }
      return `export default ${JSON.stringify(sources)}`;
    },
  }, mdx({ include: /\.mdx$/, providerImportSource: "@mdx-js/react", remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
