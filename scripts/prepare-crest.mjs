/** Trim only the connected exterior JPEG matte; retain the supplied artwork. */
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";
const input = "assets-src/brand/porsche-crest-source.jpg";
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const seen = new Uint8Array(w * h),
  queue = new Int32Array(w * h);
let head = 0,
  tail = 0;
const push = (x, y) => {
  if (x < 0 || y < 0 || x >= w || y >= h) return;
  const p = y * w + x;
  if (seen[p]) return;
  seen[p] = 1;
  const i = p * 4;
  const rgb = [data[i], data[i + 1], data[i + 2]];
  if (Math.min(...rgb) > 230 && Math.max(...rgb) - Math.min(...rgb) < 20) queue[tail++] = p;
};
for (let x = 0; x < w; x++) {
  push(x, 0);
  push(x, h - 1);
}
for (let y = 0; y < h; y++) {
  push(0, y);
  push(w - 1, y);
}
while (head < tail) {
  const p = queue[head++],
    x = p % w,
    y = Math.floor(p / w);
  data[p * 4 + 3] = 0;
  push(x - 1, y);
  push(x + 1, y);
  push(x, y - 1);
  push(x, y + 1);
}
const crest = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
  .trim({ background: "#00000000", threshold: 1 })
  .png()
  .toBuffer();
mkdirSync("public/icons", { recursive: true });
await sharp(crest).toFile("assets-src/brand/porsche-crest.png");
await sharp(crest).toFile("public/brand/porsche-crest.png");
const entries = [];
for (const size of [16, 32, 180]) {
  const inset = size === 180 ? 20 : 0;
  const image = await sharp(crest)
    .resize(size - inset * 2, size - inset * 2, { fit: "contain", background: "#00000000" })
    .extend({ top: inset, bottom: inset, left: inset, right: inset, background: "#00000000" })
    .png()
    .toBuffer();
  const path = size === 180 ? "public/icons/apple-touch-icon.png" : `public/icons/favicon-${size}.png`;
  writeFileSync(path, image);
  if (size !== 180) entries.push({ size, image });
}
const header = Buffer.alloc(6 + 16 * entries.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(entries.length, 4);
let offset = header.length;
entries.forEach(({ size, image }, i) => {
  const p = 6 + 16 * i;
  header[p] = size;
  header[p + 1] = size;
  header.writeUInt16LE(1, p + 4);
  header.writeUInt16LE(32, p + 6);
  header.writeUInt32LE(image.length, p + 8);
  header.writeUInt32LE(offset, p + 12);
  offset += image.length;
});
writeFileSync("public/favicon.ico", Buffer.concat([header, ...entries.map((e) => e.image)]));
console.log("Supplied JPEG crest → transparent PNG, favicon 16/32, ICO, Apple 180");
