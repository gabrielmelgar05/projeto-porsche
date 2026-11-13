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
4. `npm run build` and review (section 14).

The manifest is the single source of truth. If you need to rename or resize something, change
`src/data/image-assets.ts`, then rerun `npm run images`.

---

## 1. Inventory

| # | Id | Master path (`assets-src/images/…`) | Section | Ratio · master size |
|---|----|------|---------|------|
| 1 | heroBackdrop | `hero/gt3rs-hero-backdrop.png` | 01 Hero · layer 1 (desktop/tablet) | 16:9 · 2560×1440 |
| 1b | heroBackdrop (mobile crop) | `hero/gt3rs-hero-backdrop-portrait.png` | 01 Hero · layer 1 (≤767 px) | 9:16 · 1080×1920 |
| 2 | heroCar | `hero/gt3rs-hero-car.png` | 01 Hero · layer 3 — **transparent cut-out** | 5:2 · 2400×960, alpha |
| 3 | precisionSide | `precision/gt3rs-precision-side.png` | 02 Precision · chapter 1 | 16:10 · 2560×1600 |
| 4 | precisionBrake | `precision/gt3rs-precision-brake.png` | 02 Precision · chapter 2 | 16:10 · 2560×1600 |
| 5 | precisionWing | `precision/gt3rs-precision-wing.png` | 02 Precision · chapter 3 | 16:10 · 2560×1600 |
| 6 | aeroWing | `aerodynamics/gt3rs-aero-rear-wing.png` | 03 Aerodynamics · main frame | 16:10 · 2560×1600 |
| 7 | aeroSplitter | `aerodynamics/gt3rs-aero-splitter.png` | 03 Aerodynamics · portrait | 4:5 · 1440×1800 |
| 8 | aeroCarbon | `aerodynamics/gt3rs-aero-carbon.png` | 03 Aerodynamics · portrait | 4:5 · 1440×1800 |
| 9–13 | showroom-white-{view} | `showroom/gt3rs-white-{front34,side,rear34,front,rear}.png` | 04 Showroom + 05 Hotspot scenes | 16:9 · 2560×1440 |
| 14–18 | showroom-black-{view} | `showroom/gt3rs-black-{front34,side,rear34,front,rear}.png` | 04 Showroom (optional set) | 16:9 · 2560×1440 |
| 19 | detailFrontAero | `details/gt3rs-detail-front-aero.png` | 05 Hotspot panel | 3:2 · 1600×1067 |
| 20 | detailWheel | `details/gt3rs-detail-wheel.png` | 05 Hotspot panel | 3:2 · 1600×1067 |
| 21 | detailCarbon | `details/gt3rs-detail-carbon.png` | 05 Hotspot panel | 3:2 · 1600×1067 |
| 22 | detailRearWing | `details/gt3rs-detail-rear-wing.png` | 05 Hotspot panel | 3:2 · 1600×1067 |
| 23 | detailDiffuser | `details/gt3rs-detail-diffuser.png` | 05 Hotspot panel | 3:2 · 1600×1067 |
| 24 | detailCockpit | `details/gt3rs-detail-cockpit.png` | 05 Hotspot panel | 3:2 · 1600×1067 |
| 25 | detailSeat | `details/gt3rs-detail-seat.png` | 05 Hotspot panel | 3:2 · 1600×1067 |
| 26 | performanceTrack | `performance/gt3rs-performance-track.png` | 06 Performance · band | 21:9 · 2560×1097 |
| 27 | interiorCockpit | `interior/gt3rs-interior-cockpit.png` | 07 Interior + 05 cockpit scene | 16:9 · 2560×1440 |
| 28 | interiorWheel | `interior/gt3rs-interior-wheel.png` | 07 Interior | 4:5 · 1440×1800 |
| 29 | interiorSeats | `interior/gt3rs-interior-seats.png` | 07 Interior | 4:5 · 1440×1800 |
| 30 | interiorClubsport | `interior/gt3rs-interior-clubsport.png` | 07 Interior | 4:5 · 1440×1800 |
| 31 | finaleRear | `finale/gt3rs-finale-rear34.png` | 08 Final (desktop/tablet) | 21:9 · 2560×1097 |
| 32 | finaleRear (mobile crop) | `finale/gt3rs-finale-rear34-portrait.png` | 08 Final (≤767 px) | 3:4 · 1080×1440 |

**Priority order:** 1–2 (hero backdrop + car cut-out) → 9–13 (white showroom, also used by hotspots) → 27 → 19–25 → the rest.
The black set (14–18) is optional; the Black paint becomes selectable automatically once all five
exist.

Compression targets after `npm run images`: hero ≤ 350 KB at 1920 w (AVIF), others ≤ 250 KB.

---

## 2. The reference vehicle (consistency contract)

Every image shows **the same car**. Paste this block at the start of every prompt:

> **VEHICLE:** Porsche 911 GT3 RS, 992 generation, white body (clean solid white, very slightly warm),
> black aerodynamic elements (front splitter, side air outlets, rear diffuser), large two-part
> swan-neck rear wing with black uprights — the upper edge of the wing sits higher than the roof
> line — exposed carbon-fibre weave on the front lid with its central air outlets, red forged
> multi-spoke centre-lock wheels, red brake callipers, thin red accent lettering-free stripe along
> the lower door, dark tinted glass, no licence plates, no stickers, no visible text.

Rules:

- **First approved image = reference.** Generate `gt3rs-white-front34` first. Once approved, attach
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

### 2 · Hero car — `hero/gt3rs-hero-car.png` (5:2, 2400×960, transparent PNG/WebP)
Pure left side profile (front of the car to the left), wheels level, the car filling the canvas
width with ~4 % margin and its tyres touching the bottom edge. Lighting must match the backdrop:
soft top light, gentle rim on the roof and wing, no hard reflections of studio equipment.
```
The car in a perfect left side profile, camera at door-handle height, 85mm, soft overhead studio
light with a thin rim light on the roof and wing, isolated on a plain neutral background for clean
background removal, no shadow on the ground, no text, photorealistic
```
Then remove the background to **true alpha** (clean edges around the wing, mirrors and wheels;
no halo). Export PNG or WebP with transparency.

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
| frontAero | `showroom/gt3rs-white-front34` | 72 / 70 | front splitter edge |
| wheelsBrakes | `showroom/gt3rs-white-front34` | 41 / 66 | front wheel hub / calliper |
| carbon | `showroom/gt3rs-white-front34` | 60 / 47 | front lid outlet |
| rearWing | `showroom/gt3rs-white-rear34` | 63 / 30 | upper wing element |
| diffuser | `showroom/gt3rs-white-rear34` | 67 / 72 | diffuser centre |
| cockpit | `interior/gt3rs-interior-cockpit` | 52 / 44 | steering wheel hub |
| seats | `interior/gt3rs-interior-cockpit` | 24 / 62 | driver seat shell |

Procedure: open `#details`, switch each viewpoint, compare marker positions with the parts,
edit `x` / `y` in `src/data/hotspots.ts` (0–100), reload. Keep markers ≥ 6 % away from image edges
so the 44–48 px button and its label are never clipped. On mobile the full list below the image
guarantees access to every detail.

---

## 7. Integration checklist

- [ ] Masters saved with the exact names in `assets-src/images/<dir>/`
- [ ] White showroom set complete (5 images) and identically framed
- [ ] `npm run images` reports the expected count as available
- [ ] Hotspot coordinates adjusted (section 6)
- [ ] `npm run lint && npm run build` pass
- [ ] `npm run test:e2e` passes
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
- Lighthouse: LCP is the hero image; re-check performance.

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
