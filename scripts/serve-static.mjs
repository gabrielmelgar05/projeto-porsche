/**
 * Minimal static server for the exported site (`out/`), mirroring how
 * Cloudflare Pages serves it. Usage: npm run build && npm run preview
 */
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

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
const TEXT = new Set([".html", ".js", ".css", ".json", ".svg", ".txt"]);

/** Match the text compression used by static hosting; leave encoded photographs untouched. */
function textEncoding(header = "") {
  const accepted = new Map(
    header.split(",").map((item) => {
      const [name, ...parameters] = item.trim().toLowerCase().split(";");
      const weight = parameters.find((parameter) => parameter.trim().startsWith("q="));
      return [name, weight ? Number(weight.trim().slice(2)) : 1];
    }),
  );
  const quality = (encoding) => accepted.get(encoding) ?? accepted.get("*") ?? 0;
  return ["br", "gzip"]
    .filter((encoding) => quality(encoding) > 0)
    .sort((a, b) => quality(b) - quality(a))[0];
}

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
  const extension = extname(file);
  const headers = { "content-type": TYPES[extension] ?? "application/octet-stream" };
  let body = readFileSync(file);
  if (TEXT.has(extension) && body.length > 1024) {
    headers.vary = "Accept-Encoding";
    const encoding = textEncoding(req.headers["accept-encoding"]);
    if (encoding) {
      headers["content-encoding"] = encoding;
      body =
        encoding === "br"
          ? brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } })
          : gzipSync(body);
    }
  }
  res.writeHead(200, headers).end(body);
}).listen(PORT, () => console.log(`Serving ${ROOT}/ at http://localhost:${PORT}`));
