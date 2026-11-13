/**
 * Builds social / touch images from the concept signature:
 *   public/og.png                    1200 × 630 Open Graph card
 *   public/icons/apple-touch-icon.png 180 × 180 (neutral, provisional)
 * Usage: npm run brand
 */
import { readFileSync } from "node:fs";
import sharp from "sharp";

const mark = readFileSync("public/brand/gt3rs-performance-mark.svg", "utf8");
const inner = mark
  .replace(/<\?xml[^>]*>/, "")
  .replace(/<title[^>]*>.*?<\/title>/s, "")
  .replace('fill="#0b0b0b"', 'fill="#f3f2ee"')
  .replace(
    /<svg[^>]*viewBox="([^"]+)"[^>]*>/,
    (_m, vb) => `<svg x="150" y="190" width="900" height="200" viewBox="${vb}">`,
  );

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect x="80" y="80" width="1040" height="470" fill="none" stroke="#ffffff" stroke-opacity="0.08"/>
  ${inner}
  <text x="150" y="470" font-family="Arial, Helvetica, sans-serif" font-size="26" letter-spacing="5" fill="#f3f2ee">911 GT3 RS — CONCEPT EXPERIENCE</text>
  <text x="150" y="508" font-family="Arial, Helvetica, sans-serif" font-size="20" letter-spacing="3" fill="#a7a49d">AKLIO STUDIO · INDEPENDENT STUDY · NOT AFFILIATED WITH PORSCHE AG</text>
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile("public/og.png");

const icon = readFileSync("public/icons/favicon.svg", "utf8").replace(/<!--.*?-->/s, "");
await sharp(Buffer.from(icon), { density: 600 })
  .resize(180, 180)
  .png()
  .toFile("public/icons/apple-touch-icon.png");
console.log("social images written");
