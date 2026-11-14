# Image assets — current integration

Independent AKLIO Studio concept, refined on 2026-11-13. No official affiliation.

## Inventory and provenance

47 active native PNG masters feed 45 image entries and 280 AVIF/WebP files. All entries are available.
`src/data/image-assets.ts` is the catalogue; `assets-src/image-production.json` records the built-in
ImageGen prompts, references, material corrections and localized brand edits.
`docs/IMAGE_ASSET_REPORT.json` contains actual dimensions, SHA-256 hashes, sizes and decoded-output checks.

| Area | Masters |
|---|---:|
| Hero road photograph, desktop + portrait | 2 |
| Precision | 3 |
| Aerodynamics | 3 |
| Showroom: 5 paints × 5 angles | 25 |
| Detail dialog photographs | 7 |
| Performance | 1 |
| Interior | 4 |
| Finale, desktop + portrait | 2 |

## Hero

`assets-src/images/hero/gt3rs-hero-road.png` (1672×941) and
`gt3rs-hero-road-portrait.png` (941×1672) are alternate sources of one composed photograph.
The portrait is recomposed with safe side margins for tall narrow screens. The source changes below
1024 px or at aspect ratios ≤4:3; only one photograph is displayed. The picture contains car,
environment, light and shadows. The headline, CTA and floating header remain HTML.

The original preloader hand-off controls a photo mask/scale reveal and staggered text/header/CTA
entrances. Scroll adds restrained movement; reduced motion uses fades. The former backdrop,
transparent car and neutral icon are archived in `assets-src/archive/hero-v1/`, outside the export.
The first portrait draft remains in `assets-src/archive/hero-road-draft/`.

## Showroom

Files: `assets-src/images/showroom/gt3rs-{paint}-{view}.png`.

- Paints: `ice-grey` (default), `white`, `matte-black`, `gt-silver`, `guards-red`.
- Views: `front34`, `side`, `rear34`, `front`, `rear`.
- Matte Black is an explicitly labelled concept finish with diffuse material highlights.
- The white set is retained and serves as the editing base for the other four paints.
- Camera, framing, red wheels/calipers, black carbon components and studio direction remain consistent.
- Native widths vary from1670 to1672 px; the pipeline records actual dimensions without enlargement.

The large photograph has a paint panel beside it on desktop and beneath it on mobile. Five thumbnails,
previous/next buttons, arrow keys and touch swipes share the same state. Changing paint retains angle;
changing angle retains paint. A paint is enabled only when all five encoded views exist.

The visible photograph and checked swatch remain together while a request loads. Incoming images decode
before reveal; stale async requests are cancelled. Returning to the checked paint also cancels a pending
change. Failed loads retain the previous image and offer retry. When the gallery approaches the viewport,
only the two neighbouring angles of the displayed paint are preloaded using the chosen format/size.
Other paints load on selection; browser caching serves revisits. EN/PT covers all new controls and states.

## Supplied crest and photographic badges

The supplied file whose name mentions EPS/SVG/CDR is actually a JPEG736×736. The unmodified file is
`assets-src/brand/porsche-crest-source.jpg`. `scripts/prepare-crest.mjs` removes only its connected
exterior white matte, trims the artwork and writes a transparent PNG. Internal lettering is preserved.
It produces PNG16/32, ICO16+32 and Apple180 icons; layout metadata includes explicit formats/sizes and a
revision query. `npm run brand` regenerates them while preserving the original GT3 RS signature.

`scripts/brand-photos.mjs` applies the supplied crest to visible hood, wheel-hub and steering-wheel
positions using the quadrilaterals in `assets-src/brand/photo-placements.json`. It also restores rear
Porsche identification with the sourced wordmark. Perspective, small scale and exposure are baked into
the PNGs; no floating HTML badge is used. The command reads preserved originals from
`assets-src/archive/unbranded/`, making repeated runs safe. Geometry and hotspot coordinates remain intact.
The audit compares every pixel against each original and rejects changes outside the badge patches.
Small/distant emblems naturally lose detail at thumbnail resolution. Cropped surfaces and motion-blurred
wheel centres are not given sharp, oversized marks; no model lettering is fabricated from generic fonts.

Crest: user-supplied artwork used for the requested independent concept; no independently verified external
licence is claimed. Wordmark: Porsche AG, source attributed to www.porsche.com by the
[Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:Porsche_Wordmark_Logo_Black.svg),
which marks the simple text logo PD-textlogo and includes a trademark notice. These records do not grant
rights to represent Porsche officially. The artist-labelled992.2 references are mood references only;
their watermarked renders are not distributed as site photographs.

## Rebuilding

```bash
npm run brand
node scripts/brand-photos.mjs # only when revising a localized badge
npm run images             # all masters; may take several minutes
npm run images:audit
npm run build
npm run test:e2e
```

For a selective encode: `npm run images -- showroom/gt3rs-white-front34`.
The pipeline refreshes native dimensions, source revision hashes and availability. Responsive picture
URLs include source hashes so corrected photos invalidate cached older versions. The audit requires
complete provenance, decodes every output, checks no enlargement/duplicates, verifies localized edits
and validates raster-icon formats. Native sources/archives are excluded from `out/`.

## Validation on 2026-11-13

ESLint, TypeScript, the production export and image audit passed. Chrome/Playwright:66 passed,
30 conditional cases skipped (project-specific sweeps and optional visual-capture tests). The suite
covers all25 paint/angle combinations in desktop and mobile profiles, loading consistency, latest-request
behaviour, failure/retry, selective fetches, touch swipe, EN/PT, preloader, hotspots, focus/navigation
and the final signature. Layout sweeps cover320/375/390/430/768/1024/1440/1920 px in both languages;
additional Hero checks include a short1024×600 viewport. Visual captures are in the ignored `.visual/refinement/`.
