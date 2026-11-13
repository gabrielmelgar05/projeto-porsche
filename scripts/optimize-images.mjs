/**
 * Image pipeline for the static export.
 *
 *   assets-src/images/<dir>/<name>.(png|jpg|jpeg|webp|tif)   ← masters (not deployed)
 *   public/images/<dir>/<name>-<width>.(avif|webp)            ← generated
 *   src/data/generated/available-images.json                  ← ids with a complete set
 *
 * The manifest (src/data/image-assets.ts) is the source of truth for names,
 * sizes and widths; this script reads it through a tiny parser-free mirror:
 * it simply processes every master it finds and then re-checks every
 * expected variant listed in scripts/expected-images.json (written by
 * `npm run images:list`).
 *
 * Usage: npm run images
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, parse } from "node:path";
import sharp from "sharp";

const SRC = "assets-src/images";
const OUT = "public/images";
const EXPECTED = "scripts/expected-images.json";
const AVAILABLE = "src/data/generated/available-images.json";
const MASTER_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"]);

if (!existsSync(EXPECTED)) {
  console.error(`Missing ${EXPECTED}. Run: npm run images:list`);
  process.exit(1);
}
const expected = JSON.parse(readFileSync(EXPECTED, "utf8"));

// name → required widths (desktop + optional mobile crop)
const jobs = new Map();
for (const asset of expected) {
  jobs.set(
    `${asset.dir}/${asset.name}`,
    asset.widths.filter((w) => w <= asset.width),
  );
  if (asset.mobile) {
    jobs.set(
      `${asset.dir}/${asset.mobile.name}`,
      [480, 828, 1080].filter((w) => w <= asset.mobile.width),
    );
  }
}

let processed = 0;
if (existsSync(SRC)) {
  for (const dir of readdirSync(SRC, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    for (const file of readdirSync(join(SRC, dir.name))) {
      if (!MASTER_EXT.has(extname(file).toLowerCase())) continue;
      const key = `${dir.name}/${parse(file).name}`;
      const widths = jobs.get(key);
      if (!widths) {
        console.warn(`  skip ${key} — not in the manifest`);
        continue;
      }
      mkdirSync(join(OUT, dir.name), { recursive: true });
      const input = join(SRC, dir.name, file);
      const meta = await sharp(input).metadata();
      for (const width of widths) {
        if ((meta.width ?? 0) < width)
          console.warn(`  ${key}: master is narrower than ${width}px (upscaling)`);
        const base = join(OUT, dir.name, `${parse(file).name}-${width}`);
        const pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: false });
        await pipeline.clone().avif({ quality: 52, effort: 6 }).toFile(`${base}.avif`);
        await pipeline.clone().webp({ quality: 76, effort: 5 }).toFile(`${base}.webp`);
      }
      processed += 1;
      console.log(`  ✓ ${key} → ${widths.join(", ")}`);
    }
  }
}

// An id is "available" only when every variant it needs exists.
const complete = (dir, name, widths) =>
  widths.every((w) => ["avif", "webp"].every((ext) => existsSync(join(OUT, dir, `${name}-${w}.${ext}`))));

const available = expected
  .filter((asset) => {
    const main = complete(asset.dir, asset.name, jobs.get(`${asset.dir}/${asset.name}`));
    const mobile = asset.mobile
      ? complete(asset.dir, asset.mobile.name, jobs.get(`${asset.dir}/${asset.mobile.name}`))
      : true;
    return main && mobile;
  })
  .map((asset) => asset.id);

writeFileSync(AVAILABLE, `${JSON.stringify(available, null, 2)}\n`);
console.log(`\n${processed} master(s) processed · ${available.length}/${expected.length} images available`);
