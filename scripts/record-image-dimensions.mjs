/** Record native sizes and source revisions. Revised photos invalidate immutable browser caches. */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";
const dimensions = {},
  versions = {};
for (const section of readdirSync("assets-src/images", { withFileTypes: true }).filter((entry) =>
  entry.isDirectory(),
)) {
  for (const file of readdirSync(`assets-src/images/${section.name}`)
    .filter((file) => file.endsWith(".png"))
    .sort()) {
    const name = file.slice(0, -4),
      path = `assets-src/images/${section.name}/${file}`;
    versions[`${section.name}/${name}`] = createHash("sha256")
      .update(readFileSync(path))
      .digest("hex")
      .slice(0, 12);
    if (section.name === "showroom") {
      const { width, height } = await sharp(path).metadata();
      dimensions[name] = [width, height];
    }
  }
}
writeFileSync("src/data/generated/image-dimensions.json", JSON.stringify(dimensions, null, 2) + "\n");
writeFileSync("src/data/generated/image-versions.json", JSON.stringify(versions, null, 2) + "\n");
