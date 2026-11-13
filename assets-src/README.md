# Image masters (not deployed)

The 28 selected generated campaign masters are in `images/<section>/`, named exactly as in
`src/data/image-assets.ts`. All are PNG; `images/hero/gt3rs-hero-car.png` has real alpha transparency.

`image-production.json` records each final generation prompt, input reference and correction.
No separate user approval is implied by selection. Preserve these originals for future edits.

Run `npm run images` to generate native-size AVIF/WebP in `public/images/`, then
`npm run images:audit` to decode and validate every output and regenerate
`docs/IMAGE_ASSET_REPORT.json` (dimensions, weights, alpha, paths and hashes).

The optional black showroom set is still absent. See `docs/CODEX_IMAGE_ASSETS.md` for the complete
inventory, actual native resolution limits, pending brand files and review instructions.
