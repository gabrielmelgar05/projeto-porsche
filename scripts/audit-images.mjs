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
  const optional = false;
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

// A localized badge edit must not change the car, camera or any pixel outside its patches.
const placements = JSON.parse(readFileSync("assets-src/brand/photo-placements.json", "utf8"));
const localizedEdits = [];
for (const [key, decals] of Object.entries(placements)) {
  const original = `assets-src/archive/unbranded/${key}.png`;
  const current = `assets-src/images/${key}.png`;
  const before = await sharp(original).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const after = await sharp(current).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(before.info.width, after.info.width, `${key}: badge edit reframed image`);
  assert.equal(before.info.height, after.info.height, `${key}: badge edit reframed image`);
  let changed = 0,
    outside = 0;
  const bounds = decals.map(({ quad }) => ({
    left: Math.min(...quad.map((p) => p[0])) - 4,
    right: Math.max(...quad.map((p) => p[0])) + 4,
    top: Math.min(...quad.map((p) => p[1])) - 4,
    bottom: Math.max(...quad.map((p) => p[1])) + 4,
  }));
  for (let p = 0; p < before.data.length; p += 3) {
    if (
      before.data[p] === after.data[p] &&
      before.data[p + 1] === after.data[p + 1] &&
      before.data[p + 2] === after.data[p + 2]
    )
      continue;
    changed++;
    const pixel = p / 3,
      x = pixel % before.info.width,
      y = Math.floor(pixel / before.info.width);
    if (!bounds.some((b) => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom)) outside++;
  }
  assert(changed > 0, `${key}: badge edit did not change pixels`);
  assert.equal(outside, 0, `${key}: pixels changed outside badge patches`);
  localizedEdits.push({ key, badges: decals.length, changedPixels: changed, outsidePatchPixels: outside });
}
for (const size of [16, 32, 180]) {
  const path = size === 180 ? "public/icons/apple-touch-icon.png" : `public/icons/favicon-${size}.png`;
  const metadata = await sharp(path).metadata();
  assert.equal(metadata.width, size);
  assert.equal(metadata.height, size);
  assert.equal(metadata.format, "png");
  assert(metadata.hasAlpha);
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
    singleComposedHero:
      expected.some((asset) => asset.id === "heroRoad") && !expected.some((asset) => asset.id === "heroCar"),
    provenanceComplete: true,
    localizedBadgesPreserveSurroundingPixels: true,
    crestIconsNativeFormats: true,
  },
  pending,
  localizedEdits,
  masters,
};
writeFileSync("docs/IMAGE_ASSET_REPORT.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report.totals, checks: report.checks }, null, 2));
