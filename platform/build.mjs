// Build GREEN FAD platform: bundle Hono worker + copy static assets
import { build } from "esbuild";
import { cpSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = new URL(".", import.meta.url).pathname;
const dist = join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// 1) Bundle the worker (Pages advanced mode: dist/_worker.js)
await build({
  entryPoints: [join(root, "src/index.tsx")],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2022",
  platform: "neutral",
  outfile: join(dist, "_worker.js"),
  external: ["cloudflare:*", "node:*"],
  jsx: "automatic",
  jsxImportSource: "hono/jsx",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
});

// 2) Static assets (css/js/favicon)
if (existsSync(join(root, "public"))) cpSync(join(root, "public"), dist, { recursive: true });

// 3) Legacy images from the previous site — preserves /assets/images/* URLs after the DNS switch
if (existsSync(join(root, "legacy-assets")))
  cpSync(join(root, "legacy-assets"), join(dist, "assets"), { recursive: true });

console.log("✔ build → dist/ (_worker.js + static assets)");
