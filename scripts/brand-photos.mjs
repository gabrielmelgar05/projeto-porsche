/** Bake the supplied crest and sourced wordmark into visible badges, preserving all other pixels.
 * Originals remain in assets-src/archive/unbranded; this command is repeatable.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import sharp from "sharp";
import { projectDecal } from "./project-decal.mjs";
const config = JSON.parse(readFileSync("assets-src/brand/photo-placements.json", "utf8"));
const crest = readFileSync("assets-src/brand/porsche-crest.png");
const wordmark = await sharp(
  Buffer.from(readFileSync("assets-src/brand/porsche-wordmark.svg", "utf8").replace(/#000000/g, "#b8b8b6")),
)
  .png()
  .toBuffer();
const args = process.argv.slice(2);
for (const [key, decals] of Object.entries(config)) {
  if (args.length && !args.includes(key)) continue;
  const path = `assets-src/images/${key}.png`;
  if (!existsSync(path)) continue;
  const backup = `assets-src/archive/unbranded/${key}.png`;
  mkdirSync(dirname(backup), { recursive: true });
  if (!existsSync(backup)) copyFileSync(path, backup);
  const overlays = [];
  for (const decal of decals)
    overlays.push(
      await projectDecal(decal.kind === "wordmark" ? wordmark : crest, decal.quad, {
        exposure: decal.exposure ?? 0.8,
        opacity: decal.opacity ?? 0.96,
      }),
    );
  const result = await sharp(backup).composite(overlays).png().toBuffer();
  writeFileSync(path, result);
  console.log(`${key}: ${overlays.length} localized badge(s)`);
}
