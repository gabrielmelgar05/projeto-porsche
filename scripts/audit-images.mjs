/** Audit the actual masters and encoded files; run after `npm run images`. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const expected = JSON.parse(readFileSync("scripts/expected-images.json", "utf8"));
const available = JSON.parse(readFileSync("src/data/generated/available-images.json", "utf8"));
const production = JSON.parse(readFileSync("assets-src/image-production.json", "utf8"));
const hashes = new Set();
const masters = [];
const pending = [];
const integrated = [];

for (const asset of expected) {
  const variants = [
    { ...asset, widths: asset.widths.filter((width) => width <= asset.width) },
    ...(asset.mobile
      ? [{ ...asset.mobile, widths: [480, 828, 1080].filter((width) => width <= asset.mobile.width) }]
      : []),
  ];
  const optional = asset.id.startsWith("showroom-black-");
  const main = `assets-src/images/${asset.dir}/${asset.name}.png`;
  if (optional && !existsSync(main)) {
    assert(!available.includes(asset.id), `${asset.id}: available without a master`);
    pending.push({ id: asset.id, master: main, optional: true });
    continue;
  }
  assert(available.includes(asset.id), `${asset.id}: not integrated`);
  integrated.push(asset.id);
  for (const variant of variants) {
    const source = `assets-src/images/${asset.dir}/${variant.name}.png`;
    assert(existsSync(source), `Missing master: ${source}`);
    assert(
      production.assets.some((entry) => entry.path === source),
      `Missing provenance: ${source}`,
    );
    const meta = await sharp(source).metadata();
    assert.equal(meta.width, variant.width, `${source}: manifest width`);
    assert.equal(meta.height, variant.height, `${source}: manifest height`);
    const hash = createHash("sha256").update(readFileSync(source)).digest("hex");
    assert(!hashes.has(hash), `${source}: duplicate master`);
    hashes.add(hash);
    const cutout = asset.id === "heroCar";
    const files = [];
    for (const width of variant.widths) {
      assert(width <= meta.width, `${source}: enlargement`);
      for (const format of ["avif", "webp"]) {
        const path = `public/images/${asset.dir}/${variant.name}-${width}.${format}`;
        const decoded = sharp(path);
        const output = await decoded.metadata();
        assert.equal(output.width, width, `${path}: incorrect encoded width`);
        assert(Math.abs(output.height - (width * meta.height) / meta.width) <= 1, `${path}: distortion`);
        const stats = await decoded.stats(); // Decode the complete file, including alpha.
        if (cutout) {
          assert(output.hasAlpha, `${path}: lost alpha`);
          assert.equal(stats.channels[3].min, 0, `${path}: no transparent pixels`);
          assert.equal(stats.channels[3].max, 255, `${path}: no opaque pixels`);
        }
        files.push({
          path,
          format,
          width: output.width,
          height: output.height,
          bytes: statSync(path).size,
          alpha: output.hasAlpha,
        });
      }
    }
    masters.push({
      id: asset.id,
      path: source,
      format: meta.format,
      width: meta.width,
      height: meta.height,
      bytes: statSync(source).size,
      alpha: meta.hasAlpha,
      sha256: hash,
      outputs: files,
    });
  }
}

assert.deepEqual([...available].sort(), [...integrated].sort(), "Stale availability ids");
assert.equal(masters.length, production.assets.length, "Unused production masters");
const report = {
  date: production.date,
  generator: production.generator,
  totals: {
    manifestEntries: expected.length,
    sourceFiles: masters.length,
    integratedEntries: integrated.length,
    pendingOptionalEntries: pending.length,
    outputFiles: masters.reduce((sum, item) => sum + item.outputs.length, 0),
    masterBytes: masters.reduce((sum, item) => sum + item.bytes, 0),
    outputBytes: masters.reduce(
      (sum, item) => sum + item.outputs.reduce((total, file) => total + file.bytes, 0),
      0,
    ),
  },
  checks: {
    nativeDimensions: true,
    noUpscaling: true,
    noDuplicateMasters: true,
    allOutputsDecoded: true,
    heroAlphaPreserved: true,
    provenanceComplete: true,
  },
  pending,
  masters,
};
writeFileSync("docs/IMAGE_ASSET_REPORT.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report.totals, checks: report.checks }, null, 2));
