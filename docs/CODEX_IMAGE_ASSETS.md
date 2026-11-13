# CODEX — Image Assets Brief

Everything needed to produce and integrate the photography for **911 GT3 RS — Concept Experience**
without touching the design. The site already works without images: every slot shows a labelled
placeholder until its files exist.

> Independent concept by Aklio Studio. Not affiliated with Porsche AG. Do not present any generated
> image as official Porsche material, and only integrate brand marks you are licensed to use.

---

## 0. How integration works (read first)

1. Generate each **master** image at (or above) the resolution listed below.
2. Save it to `assets-src/images/<dir>/<name>.png` (or `.jpg` / `.webp`) — exact names below.
   `assets-src/` is **not** deployed.
3. Run:

   ```bash
   npm run images
   ```

   This lists the manifest (`src/data/image-assets.ts`), writes AVIF + WebP variants to
   `public/images/<dir>/<name>-<width>.(avif|webp)` and records every complete image in
   `src/data/generated/available-images.json`. Slots switch from placeholder to photograph
   automatically — no code edits.
4. `npm run build` and review (section 8).

The manifest is the single source of truth. If you need to rename or resize something, change
`src/data/image-assets.ts`, then rerun `npm run images`.

---

## 1. Inventory — verified 2026-11-13

The real manifest has **31 entries and 33 possible source files** (two entries have mobile art direction).
**28 source PNGs are produced and integrated across 26 entries.** The other five entries are the optional
black showroom set, still disabled. The previous 32-image count omitted the mobile Hero backdrop.

All paths below are relative to `assets-src/images/`. Dimensions are actual native generator output,
not enlarged files. The five pending black masters retain the same target dimensions as their white views.

| # | Manifest id | Master path | Native size | Status |
|---|---|---|---|---|
| 1 | heroBackdrop | `hero/gt3rs-hero-backdrop.png` | 1672×941 | Integrated |
| 2 | heroBackdrop · mobile | `hero/gt3rs-hero-backdrop-portrait.png` | 941×1672 | Integrated |
| 3 | heroCar | `hero/gt3rs-hero-car.png` | 1983×793 | Integrated |
| 4 | precisionSide | `precision/gt3rs-precision-side.png` | 1586×992 | Integrated |
| 5 | precisionBrake | `precision/gt3rs-precision-brake.png` | 1586×992 | Integrated |
| 6 | precisionWing | `precision/gt3rs-precision-wing.png` | 1586×992 | Integrated |
| 7 | aeroWing | `aerodynamics/gt3rs-aero-rear-wing.png` | 1586×992 | Integrated |
| 8 | aeroSplitter | `aerodynamics/gt3rs-aero-splitter.png` | 1122×1402 | Integrated |
| 9 | aeroCarbon | `aerodynamics/gt3rs-aero-carbon.png` | 1122×1402 | Integrated |
| 10 | performanceTrack | `performance/gt3rs-performance-track.png` | 1885×834 | Integrated |
| 11 | interiorCockpit | `interior/gt3rs-interior-cockpit.png` | 1672×941 | Integrated |
| 12 | interiorWheel | `interior/gt3rs-interior-wheel.png` | 1122×1402 | Integrated |
| 13 | interiorSeats | `interior/gt3rs-interior-seats.png` | 1122×1402 | Integrated |
| 14 | interiorClubsport | `interior/gt3rs-interior-clubsport.png` | 1122×1402 | Integrated |
| 15 | finaleRear | `finale/gt3rs-finale-rear34.png` | 1914×822 | Integrated |
| 16 | finaleRear · mobile | `finale/gt3rs-finale-rear34-portrait.png` | 1086×1448 | Integrated |
| 17 | detailRearWing | `details/gt3rs-detail-rear-wing.png` | 1536×1024 | Integrated |
| 18 | detailFrontAero | `details/gt3rs-detail-front-aero.png` | 1536×1024 | Integrated |
| 19 | detailWheel | `details/gt3rs-detail-wheel.png` | 1536×1024 | Integrated |
| 20 | detailCarbon | `details/gt3rs-detail-carbon.png` | 1536×1024 | Integrated |
| 21 | detailDiffuser | `details/gt3rs-detail-diffuser.png` | 1536×1024 | Integrated |
| 22 | detailCockpit | `details/gt3rs-detail-cockpit.png` | 1536×1024 | Integrated |
| 23 | detailSeat | `details/gt3rs-detail-seat.png` | 1536×1024 | Integrated |
| 24 | showroom-white-front34 | `showroom/gt3rs-white-front34.png` | 1672×941 | Integrated |
| 25 | showroom-white-side | `showroom/gt3rs-white-side.png` | 1672×941 | Integrated |
| 26 | showroom-white-rear34 | `showroom/gt3rs-white-rear34.png` | 1672×941 | Integrated |
| 27 | showroom-white-front | `showroom/gt3rs-white-front.png` | 1672×941 | Integrated |
| 28 | showroom-white-rear | `showroom/gt3rs-white-rear.png` | 1672×941 | Integrated |
| 29 | showroom-black-front34 | `showroom/gt3rs-black-front34.png` | 1672×941 | Optional · pending |
| 30 | showroom-black-side | `showroom/gt3rs-black-side.png` | 1672×941 | Optional · pending |
| 31 | showroom-black-rear34 | `showroom/gt3rs-black-rear34.png` | 1672×941 | Optional · pending |
| 32 | showroom-black-front | `showroom/gt3rs-black-front.png` | 1672×941 | Optional · pending |
| 33 | showroom-black-rear | `showroom/gt3rs-black-rear.png` | 1672×941 | Optional · pending |

**Priority order:** Hero layers → white showroom + hotspot photography → Precision and Aerodynamics →
Interior, Performance and Finale → optional black showroom.

The original brief requested 2560 px landscape / 1440 px portrait masters. The built-in generator
returned 1536–1983 px landscape and 941–1122 px portrait files. These are preserved at native resolution;
the manifest and `srcset` match the real files. Higher-density full-width viewing still benefits from
higher-native-resolution masters. Do not upscale existing files and describe them as additional detail.

Compression targets: Hero ≤350 KB at its largest AVIF size; other AVIF photographs ≤250 KB.
Actual source and output byte sizes, resolutions, SHA-256 hashes, alpha and paths are in
[`IMAGE_ASSET_REPORT.json`](IMAGE_ASSET_REPORT.json), regenerated with `npm run images:audit`.

The optional black set must be generated from the corresponding white views after visual approval of
the essential campaign. It remains unselectable until all five images exist.

## 2. The reference vehicle (consistency contract)

Every image shows **the same car**. Paste this block at the start of every prompt:

> **VEHICLE:** Porsche 911 GT3 RS, 992 generation, white body (clean solid white, very slightly warm),
> black aerodynamic elements (front splitter, side air outlets, rear diffuser), large two-part
> swan-neck rear wing with black uprights — the upper edge of the wing sits higher than the roof
> line — exposed carbon-fibre weave on the front lid with its central air outlets, red forged
> multi-spoke centre-lock wheels, red brake callipers, thin red accent lettering-free stripe along
> the lower door, dark tinted glass, no licence plates, no stickers, no visible text.

Rules:

- **First selected, visually reviewed image = reference.** Generate `gt3rs-white-front34` first. Once reviewed, attach
  it as the image reference for every later generation and state: *"Same car, same wheels, same
  wing, same paint, same lighting language as the reference image."*
- Same wheel design and colour in every exterior image. Same wing shape and height.
- No other car models, no Cayenne or other Porsche models, no people, no watermarks.
- The black set (14–18): identical framing to the white set, body black, everything else unchanged.
- No CSS recolouring will ever be applied: colour variants must be separate photographs.

---

## 3. Lighting & camera language

| Family | Used for | Lighting | Camera |
|---|---|---|---|
| **Dark studio** | hero, aero, finale | Near-black cyclorama, one large soft key from above-front, thin rim lights tracing the roof and wing, subtle floor reflection | 50–85 mm equivalent, low (bumper height), slight upward view |
| **Light studio** | showroom set, hotspot scenes, precision chapter 1 | Off-white / light grey cyclorama (#F3F2EE → #D9D7D1), large overhead softbox, soft contact shadow, no hard reflections | 85 mm equivalent, camera at headlight height, car **centred**, generous margins (car ≈ 70 % of frame width) |
| **Detail / macro** | details, precision 2–3, interior | Directional low light, shallow depth of field, crisp textures (carbon, Alcantara-like fabric, aluminium) | 100 mm macro equivalent |
| **Track** | performance band | Overcast daylight or late sun, panning motion blur on background only, car sharp | 200 mm equivalent, side-on panning |

Grade: neutral-cool, deep blacks, no orange/teal grading, no lens flares, no HDR halos.

---

## 4. Image briefs & prompts

The sizes in the original prompts below are production targets; the verified inventory above records actual delivered sizes.

Each prompt below assumes the **VEHICLE** block from section 2 is prepended.

### Hero composition — three layers

The hero is built from **two photographs** with a typographic layer between them:

1. **Backdrop** (`heroBackdrop`) — atmosphere only, no car.
2. **"PORSCHE"** — giant translucent type, rendered in code, in front of the backdrop.
3. **Car** (`heroCar`) — the car alone on a **transparent background**, placed in front of the word.
   The floor shadow is drawn in code, so the cut-out needs no ground.

The headline sits top-left, lede + link top-right, spec cards bottom-centre: keep the backdrop calm
in those areas.

### 1 · Hero backdrop — `hero/gt3rs-hero-backdrop.png` (16:9, 2560×1440) + `-portrait` (1080×1920)
```
Empty cinematic backdrop with no vehicle: a dark graphite studio horizon meeting a low, moody sky
of soft grey clouds and haze, light concentrated in a broad band across the lower-middle third
(where the car will stand), deep shadow toward the top and the corners, subtle floor line, neutral
cool grade, no objects, no text, photorealistic, 16:9
```
Portrait version: same atmosphere, vertical, light band at ~60 % height.

### Hero car — `hero/gt3rs-hero-car.png` (5:2, native 1983×793, transparent PNG)
The latest user brief supersedes the earlier side-profile prompt: **front-left three-quarter, nose
toward the right**, whole vehicle, black carbon and red wheels exactly as the showroom reference.
The built-in generator extracted the car with true alpha, followed by an edge-cleanup edit. No
rectangular floor or baked ground shadow is present; the existing Hero floor shadow stays in code.
The optimised AVIF and WebP versions preserve the alpha channel. The same contained asset works on
mobile without stretching or cropping, so a separate mobile car photograph is unnecessary.

The exact generation and correction prompts, with input-reference paths, are saved in
[`assets-src/image-production.json`](../assets-src/image-production.json).

### 3 · Precision 1 — `precision/gt3rs-precision-side.png` (16:10)
```
Pure side profile in a light grey studio, camera at door-handle height, 85mm, whole car visible with
margins, soft overhead light, gentle contact shadow, the wing silhouette clearly readable, 16:10
```

### 4 · Precision 2 — `precision/gt3rs-precision-brake.png` (16:10)
```
Close detail of the front wheel and red brake calliper, macro 100mm, low directional light,
shallow depth of field, wheel spokes crisp, dark studio background, 16:10
```

### 5 · Precision 3 — `precision/gt3rs-precision-wing.png` (16:10)
```
Rear wing silhouette from a low side angle against a dim warm horizon light, dark studio,
the wing and its swan-neck uprights in sharp profile, minimal and graphic, 16:10
```

### 6 · Aero main — `aerodynamics/gt3rs-aero-rear-wing.png` (16:10)
Leave the upper-left corner calm (concept label) and a clear band across the middle-upper area —
illustrative airflow lines are drawn over it.
```
Rear three-quarter view from slightly above, dark graphite studio, the two-part rear wing and its
uprights dominant in the upper-centre of the frame, rim light along the wing edges, deep blacks,
photorealistic, 16:10
```

### 7 · Aero splitter — `aerodynamics/gt3rs-aero-splitter.png` (4:5)
```
Low front detail of the black front splitter and intakes, macro, side light grazing the surfaces,
dark background, vertical 4:5
```

### 8 · Aero carbon — `aerodynamics/gt3rs-aero-carbon.png` (4:5)
```
Macro of the exposed carbon-fibre weave on the front lid around the central air outlet, raking
light revealing the weave, shallow depth of field, vertical 4:5
```

### 9–13 · Showroom (white) — `showroom/gt3rs-white-{view}.png` (16:9)
All five: **light studio**, identical lighting, camera height and distance; car centred with the
same scale. Views: `front34` (front-left three-quarter) · `side` (left profile) · `rear34`
(rear-left three-quarter) · `front` (head-on) · `rear` (straight rear).
```
Clean light grey studio cyclorama, the car centred and fully visible with even margins, {VIEW},
camera at headlight height, 85mm, large overhead softbox, soft contact shadow, neutral grade,
no text, no plates, photorealistic, 16:9
```
`front34` and `rear34` double as **hotspot scenes** — see section 6.

### 14–18 · Showroom (black) — `showroom/gt3rs-black-{view}.png`
Exactly the same as 9–13 with the body in **solid black**. Use the white image of the same view as
the reference ("identical framing, only the paint colour changes").

### 19–25 · Hotspot details — `details/*.png` (3:2, 1600×1067)
Shown at the top of the detail panel; subject centred, nothing important in the top-right corner
(close button).

| File | Subject prompt |
|---|---|
| `gt3rs-detail-front-aero.png` | Front splitter and front wing elements, low macro, dark studio |
| `gt3rs-detail-wheel.png` | Front wheel, red six-piston calliper and large disc visible through the spokes |
| `gt3rs-detail-carbon.png` | Carbon-fibre front lid with central outlets, raking light |
| `gt3rs-detail-rear-wing.png` | Upper wing element and uprights, the gap between the two wing elements visible |
| `gt3rs-detail-diffuser.png` | Rear diffuser fins from a low rear angle, dark studio |
| `gt3rs-detail-cockpit.png` | Steering wheel with four rotary controls and a button cluster, shallow depth of field |
| `gt3rs-detail-seat.png` | Carbon-shell full bucket seat with harness openings, side light |

### 26 · Performance band — `performance/gt3rs-performance-track.png` (21:9)
```
The car at speed on a race circuit, side-on panning shot, background streaked with motion blur,
car perfectly sharp, overcast daylight, kerbs in the foreground, ultra wide 21:9
```

### 27–30 · Interior
| File | Prompt |
|---|---|
| `interior/gt3rs-interior-cockpit.png` (16:9) | Cockpit seen from the passenger side door opening, steering wheel, instruments, bucket seat and roll bar, low warm practical light, deep shadows |
| `interior/gt3rs-interior-wheel.png` (4:5) | Steering wheel close-up, four rotary controls, Alcantara-like rim with top-centre marker, macro |
| `interior/gt3rs-interior-seats.png` (4:5) | Two full bucket seats, carbon shells, red six-point harness, side light |
| `interior/gt3rs-interior-clubsport.png` (4:5) | Steel roll bar and harness mounting behind the seats, graphic composition |

Keep the lower 25 % of each frame calm — captions sit below the image, not on it.

### 31–32 · Finale — `finale/gt3rs-finale-rear34.png` (21:9) + portrait (3:4)
```
Rear three-quarter view at dusk on an empty concrete plaza, long soft light from the side, the rear
light bar glowing, wing silhouette against the sky, quiet and cinematic, 21:9
```
Portrait: same scene, vertical, car in the lower half.

---

## 5. Logo & lettering correction rules

Image generators misspell and invent badges. Apply these before approving any image:

1. **No invented crests or text.** If a badge, crest or lettering is distorted, remove it
   (clean paint/surface) rather than keep a fake.
2. No "GT3 RS" side lettering unless it renders perfectly; prefer a plain red accent line.
3. Wheels: centre caps plain, no fake logos.
4. Rear: the light bar may carry no text, or the exact correct wordmark — nothing in between.
5. No licence plates, number boards, sponsor decals, watermarks or signatures.
6. Never paste the official crest or wordmark into a photo by hand.

---

## 6. Hotspots — scenes and coordinates

Hotspots use scene images at **16:9** and are positioned in **percent of the image box**
(`src/data/hotspots.ts`). After integrating the scene images:

| Hotspot | Scene image | Current x / y (%) | Point at |
|---|---|---|---|
| frontAero | `showroom/gt3rs-white-front34` | 79 / 76 | front splitter edge |
| wheelsBrakes | `showroom/gt3rs-white-front34` | 49 / 66 | front wheel hub / calliper |
| carbon | `showroom/gt3rs-white-front34` | 69 / 51 | front lid outlet |
| rearWing | `showroom/gt3rs-white-rear34` | 69 / 34 | upper wing element |
| diffuser | `showroom/gt3rs-white-rear34` | 79 / 73 | diffuser lateral fin |
| cockpit | `interior/gt3rs-interior-cockpit` | 72 / 42 | steering wheel hub |
| seats | `interior/gt3rs-interior-cockpit` | 18 / 64 | driver seat shell |

Procedure: open `#details`, switch each viewpoint, compare marker positions with the parts,
edit `x` / `y` in `src/data/hotspots.ts` (0–100), reload. Keep markers ≥ 6 % away from image edges
so the 44–48 px button and its label are never clipped. On mobile the full list below the image
guarantees access to every detail.

---

## 7. Integration checklist

- [x] Masters saved with the exact names in `assets-src/images/<dir>/`
- [x] White showroom set complete (5 images) and identically framed
- [x] `npm run images` generates the essential set (26/31 entries; 28 masters)
- [x] Hotspot coordinates adjusted (section 6)
- [x] `npm run lint && npm run build` pass
- [x] `npm run test:e2e` passes (47 passed, 23 intentionally skipped)
- [ ] Optional: black set complete → Black paint becomes selectable automatically

## 8. After integration — verify

- Hero: headline and lower band readable over the photo at 320, 390, 768, 1440, 1920 px; the
  mobile crop is used below 768 px.
- No visible upscaling (check 2560 w variants on a large screen).
- Showroom: switching views shows no jump in car position or scale.
- Precision (desktop): the three chapters read as one sequence; no subject cut by the pinned frame.
- Aerodynamics: the illustrative airflow lines don't hide important details.
- Detail panels: subject visible beside the close button on mobile and desktop.
- Performance band: parallax doesn't reveal edges (the band is drawn 16 % wider than its frame).
- Lighthouse: measure the actual LCP element and performance after integration; do not assume the Hero car is LCP.

---

## 9. Brand files — favicon & wordmark

The navbar and the preloader use the **original GT3 RS concept signature** (no Porsche wordmark).
The site ships with a **neutral provisional favicon**; replace it only with files you are licensed
to use.

| File | Requirements | Switch-on |
|---|---|---|
| `public/icons/favicon.svg` | Crest SVG, square artboard (crest centred, ~8 % padding) | Replace the file — metadata already points to it |
| `public/icons/apple-touch-icon.png` | 180×180, opaque background | Run `npm run brand` after replacing `favicon.svg` (regenerates it) |
| `public/brand/porsche-crest.svg` | Original crest artwork, optional for future use | `brand.crest.available: true` |

The GT3 RS signature (`public/brand/gt3rs-performance-mark.svg`) is an **original concept drawing**
generated by `scripts/generate-mark.mjs`; it is not an official Porsche mark and must not be
described as one.


## 10. Production and integration record — 2026-11-13

- **Tooling:** built-in `image_gen` generated and edited the photographs using local image references;
  no API key, API/CLI fallback, external paid service or stock image was used. `sharp` handles EXIF
  orientation, native-size resizing and AVIF/WebP export. Playwright and local Google Chrome are available.
- **Consistency:** `showroom/gt3rs-white-front34.png` is the selected exterior master. The other views
  reference it; rear details reference the generated rear view. Interior photographs reference the
  generated cockpit master. Original draft configurations were rejected before integration. Exact
  selected prompts, references and corrections are in `assets-src/image-production.json`. Selection
  by the agent does not imply a separate user approval.
- **Sources:** all 28 selected originals remain as local sRGB PNGs in `assets-src/images/`. Only
  optimised AVIF/WebP variants in `public/images/` are exported. There are no temporary external image URLs.
- **Hero:** `gt3rs-hero-backdrop.png`, its portrait companion and `gt3rs-hero-car.png` are independent.
  Typography is still rendered in code between background and car. The PNG has RGBA with alpha 0–255;
  each encoded car variant is decoded by the audit to check alpha preservation. The contact shadow is tilted 7° to match the new three-quarter perspective; its child owns rotation
  while GSAP retains the wrapper scale. The existing reveal timeline and preloader hand-off are preserved.
- **Showroom:** all five white views are present; the four non-profile views were reframed against the side profile to align apparent
  vehicle height and camera distance across the set. Navigation, keyboard, thumbnails, swipe, announcements and GSAP transitions remain.
  No whole-image CSS recolouring is used. The five black views remain optional and disabled.
- **Hotspots:** all seven coordinates were changed to the current photography (table above). Front
  splitter 79/76; front wheel 49/66; bonnet 69/51; wing 69/34; diffuser 79/73; wheel hub 72/42; seat 18/64.
  The scene retains 16:9 framing on all screens. Panel focus, Escape and complete detail list remain.
- **Precision:** profile → brake → wing, with a shared medium-grey exposure. **Aerodynamics:** rear
  wing/DRS plus splitter and carbon portraits; airflow remains the existing illustrative SVG animation.
- **Interior:** cockpit, wheel, bucket seats and Clubsport photographs share black Race-Tex, carbon,
  red stitching and red belts. An edit removed invented wheel-control labels and the extra fifth knob.
  The existing desktop horizontal journey and native mobile scroller remain.
- **Finale:** the generated plaza rear view and separate portrait are integrated. The existing GT3 RS
  SVG signature and reversible scroll animation are untouched.
- **Brand:** no official Porsche crest, wordmark or emblem file was added. The existing original
  GT3 RS concept signature and neutral favicon remain. A licensed crest is still pending; no licence
  to an official crest is claimed. No fake crest was generated. The project remains an independent
  Aklio Studio concept. The official world-premiere page was consulted only to verify vehicle geometry;
  its photographs are not included in the project or used as final assets:
  [Porsche Newsroom, 17 August 2022](https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html).

Run `npm run images` after changing a source, then `npm run images:audit`. The audit decodes every
output, checks native dimensions/no enlargement, rejects duplicate masters and stale availability,
and records file sizes and alpha in `docs/IMAGE_ASSET_REPORT.json`.

Human final visual approval remains necessary, especially for model-specific generated component
geometry, matching apparent vehicle scale across views, cut-out edges on graphite, and high-DPI image
sharpness. No commit, push, merge or deployment is part of this integration.


## 11. Validation results

- `npm run images`: **28 masters processed, 26/31 entries available**. Five optional black entries absent.
- `npm run images:audit`: **166 outputs decoded**, 59,393,071 source bytes and 6,209,036 encoded bytes
  across every format and breakpoint (this is stored asset size, not one page load). All native dimension,
  no-enlargement, no-duplicate, provenance and Hero alpha checks pass. Largest AVIF: Hero car at 1920 px,
  **77,109 bytes**; its WebP is **153,412 bytes**. All AVIFs are below the brief's compression targets.
- `npm run lint`, `npm run typecheck`, `npm run build`: pass. The static export includes all photographs
  in `out/images/`. The initial sandbox socket error was cached by Turbopack; moving its generated cache
  to `/tmp/porsche-turbopack-cache-20261113` and building outside the sandbox resolved it without source
  changes to Next.js configuration.
- Existing Playwright suite: **47 passed, 23 skipped, zero failures** (70 configured cases, desktop/mobile).
  The skips are explicit project filters and opt-in screenshot cases. Gallery including a real Chrome touch swipe over the photograph, hotspot dialogs/list/tab
  keys/focus, languages, navigation, opening, reduced motion, seven-width layouts in EN/PT, static export,
  navbar signature, absent decorative numbers and final SVG drawing/rewind/redraw passed.
- The already-running port 4173 served a different old export. Validation uses a dedicated local preview
  on **http://localhost:4174**, whose HTML was byte-compared with the current `out/index.html` and whose
  new Hero AVIF returned HTTP 200. The test invocation was `npm run test:e2e -- --config
  .visual/playwright.assets.config.ts`; that ignored temporary config only overrides the server URL,
  leaving the same existing test files and projects in use. The unrelated preview was preserved.


## 12. Framing adjustments confirmed in the browser

The following are integration-only changes; section structure, typography, palette, controls and GSAP
animation timings remain unchanged:

- `Hero.tsx`: tilt the floor-shadow child 7° to align the contact plane with the three-quarter cut-out.
  The original animated shadow wrapper is preserved, so GSAP and CSS do not share transform ownership.
- `Precision.tsx`: cap the desktop media height at `min(43vw, 78svh, 52rem)` so the full side-view car
  remains inside the initial zoom. Its studio composition was widened with an image edit. Request
  `85vw` variants on desktop to account for `object-cover` and the animated zoom; this avoids choosing
  the 640 px file for a larger rendered photograph at 1024 px. Brake/wing `object-position` values are
  `38% 50%` / `100% 50%` to keep the technical subjects inside the viewport.
- `Aerodynamics.tsx`: retain the native 16:10 main wing frame on mobile, showing the full wing instead
  of cutting both endplates in a portrait crop. Existing illustrative SVG flow lines are preserved.
- `Performance.tsx`: use 16:9 on mobile and 21:9 from `sm`, keeping the moving vehicle complete.
- `en.ts` / `pt.ts`: describe the Hero car's actual front three-quarter view in its alt text.
- `hotspots.ts`: only the seven percentage anchors changed; dialog/tab/list accessibility is untouched.

The source and optimised-image directories, manifests, availability JSON, image pipeline/audit,
Showroom image/touch tests and the asset documentation are the other changed paths. No official logo,
navbar signature, preloader, final signature geometry, language-switching implementation or menu was replaced.


The Showroom also waits for the selected photograph to finish decoding before running the original
mask/crossfade. It retains the last fully visible view during delayed image requests and rapid
navigation. Pending decoding callbacks and GSAP animations are cancelled through the scoped context.
A regression test blocks the next large image beyond the original 900 ms wipe and verifies that the
previous photograph remains visible until the new one loads. The 70-case suite includes this and a
real Chrome mobile touch gesture.

For iterative edits, `npm run images -- showroom/gt3rs-white-front34` regenerates only that exact
manifest key; the default `npm run images` still processes every master. The final showroom framing
revision regenerated four keys; the subsequent audit still validates all 166 encoded outputs.


## 13. Performance delivery adjustments and measurement method

Lighthouse runs use the installed **13.6.0** CLI and local Google Chrome, on the current static export,
with the standard desktop preset / default simulated mobile throttling and storage reset. Reports
are local measurements, not a deployed Cloudflare result.

The first mobile run was **69 / 100 / 100 / 100** with **1,370,229 transfer bytes**, LCP **8.2 s** and
CLS **0**. The original preview served HTML/CSS/JS without content compression. `scripts/serve-static.mjs`
now negotiates Brotli/gzip for text, honours disabled encodings and sends `Vary: Accept-Encoding`.
Bitmaps and WOFF2 are untouched. Decompression was byte-compared with the original export: a 106,160-byte
HTML response became 15,867 bytes with Brotli and 18,340 bytes with gzip. This models the type of
[text compression supported by Cloudflare](https://developers.cloudflare.com/speed/optimization/content/compression/),
without changing the static-export files or claiming a production benchmark.

With compression alone the mobile run became **76 / 100 / 100 / 100**, **783,168 transfer bytes**, LCP
**5.0 s**, CLS **0**. The report also exposed two unused `latin-ext` preloads (~171 KB combined).
`src/app/layout.tsx` now preloads `latin` for Archivo and Inter; family, axes, weights, font sizes and
all CSS font faces stay available. The shipped EN/PT characters use the Latin faces. This is a
preload change only, based on the installed Next.js `next/font` guide, not a typography redesign.
The full EN/PT layout and animation tests pass after this change.

Original and intermediate Lighthouse reports are preserved in `.visual/lighthouse-*-uncompressed.*`
and `.visual/lighthouse-mobile-compressed-before-fonts.*`. Final reports use
`.visual/lighthouse-mobile.report.{json,html}` and `.visual/lighthouse-desktop.report.{json,html}`.


Final Lighthouse results after text compression and Latin-only preloading:

| Profile | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Desktop | 100 | 100 | 100 | 100 | 0.81 s | 0 | 51.5 ms | 629,063 bytes |
| Mobile | 83 | 100 | 100 | 100 | 3.98 s | 0 | 244 ms | 611,708 bytes |

Both final runs load two font files and report no Lighthouse run warnings. The mobile score is below
the historical 88; it is reported as measured, with the complete GSAP experience and image quality
preserved. A published-host result is still unmeasured because deployment is outside this task.
The HTML export contains exactly two font preload links, while extended font faces remain in CSS.
The final 70-case Playwright run after these delivery changes again reports **47 passed / 23 skipped**,
exit code **0**.

## 14. Final visual review

- Local review: **http://localhost:4174** (`PORT=4174 npm run preview` if a restart is needed).
- `.visual/integration-review.json` records the 320, 375, 390, 768, 1024, 1440 and 1920 px sweep:
  every section and all five views were opened, without missing images, placeholders or horizontal overflow.
  Hero screenshots are `.visual/assets-<width>-hero.png`; section screenshots use 390 / 1440 px.
- The last showroom scale corrections and all three hotspot scenes have dedicated captures:
  `.visual/final-{390,1440}-showroom-{front34,side,rear34,front,rear}.png` and
  `.visual/final-{390,1440}-hotspots-{front34,rear34,cockpit}.png`.
- `.visual/frame-<width>-*.png` records the camera crop and intermediate Precision masks, main wing,
  track band and final photograph; `.visual/lighthouse-summary.json` contains the exact final metrics.
- On the preview, check the full Hero after the opening, all five white angles, all seven detail
  panels, the horizontal Interior and the Final signature while scrolling down, up and back down.
- Human sign-off should focus on model-specific generated geometry, wheel/wing identity across views,
  optical cut-out edges and sharpness on high-DPI displays. The 2560 px master target is still unmet;
  current source dimensions are the real native outputs in the inventory. The five black views are
  optional/pending and disabled; a licensed Porsche crest is also still pending.

No Git commit, push, merge or deployment was executed.

After the final diffuser target adjustment to 79/73, the focused desktop/mobile hotspot suite was rerun: **6 passed**, exit code **0**. The two rear-scene review captures were refreshed.
