/**
 * Minimal static server for the exported site (`out/`), mirroring how
 * Cloudflare Pages serves it. Usage: npm run build && npm run preview
 */
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const ROOT = "out";
const PORT = Number(process.env.PORT ?? 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

if (!existsSync(ROOT)) {
  console.error("No out/ directory — run `npm run build` first.");
  process.exit(1);
}

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  let file = normalize(join(ROOT, url));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!existsSync(file)) {
    const notFound = join(ROOT, "404.html");
    res
      .writeHead(404, { "content-type": TYPES[".html"] })
      .end(existsSync(notFound) ? readFileSync(notFound) : "Not found");
    return;
  }
  res
    .writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" })
    .end(readFileSync(file));
}).listen(PORT, () => console.log(`Serving ${ROOT}/ at http://localhost:${PORT}`));
