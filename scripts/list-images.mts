/**
 * Writes scripts/expected-images.json from the TypeScript manifest so the
 * (plain Node) optimiser and docs always match src/data/image-assets.ts.
 * Run with: npm run images:list   (uses Node's built-in TypeScript support)
 */
import { writeFileSync } from "node:fs";
import { allAssets } from "../src/data/image-assets.ts";

const list = allAssets().map(({ id, dir, name, width, height, widths, mobile }) => ({
  id,
  dir,
  name,
  width,
  height,
  widths,
  ...(mobile ? { mobile } : {}),
}));
writeFileSync("scripts/expected-images.json", `${JSON.stringify(list, null, 2)}\n`);
console.log(`${list.length} images listed`);
