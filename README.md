# 911 GT3 RS — Concept Experience

An editorial, cinematic one-page experience for the Porsche 911 GT3 RS (992), designed and developed
by **Aklio Studio** as an independent portfolio study.

> Independent concept. Not affiliated with, endorsed by or associated with Porsche AG.
> Porsche, 911 and GT3 RS are trademarks of Dr. Ing. h.c. F. Porsche AG.

**Stack:** Next.js 16 (App Router, static export) · React 19 · TypeScript (strict) · Tailwind CSS 4 ·
GSAP 3 + ScrollTrigger + `@gsap/react` · Lucide React · sharp (image pipeline) · Playwright (tests).
No backend, no database, no server runtime.

---

## Quick start

Requires **Node.js ≥ 22.18** and npm.

```bash
npm ci          # install exactly what package-lock.json specifies
npm run dev     # http://localhost:3000
```

```bash
npm run build   # static export → out/
npm run preview # serve out/ locally on http://localhost:4173
```

| Script | What it does |
|---|---|
| `dev` | Development server |
| `build` | Type-checks and exports the static site to `out/` |
| `preview` | Serves `out/` like a static host |
| `lint` / `typecheck` / `format` | ESLint · `tsc --noEmit` · Prettier |
| `images` | Optimises masters in `assets-src/` → AVIF/WebP in `public/images/` |
| `brand` | Regenerates the GT3 RS signature, OG card and touch icon |
| `test:e2e` | Playwright end-to-end tests against `out/` (uses installed Google Chrome) |
| `check` | lint + typecheck + build + e2e |

## Structure

```
public/
  brand/gt3rs-performance-mark.svg   original concept signature (generated)
  icons/                             provisional neutral favicon + touch icon
  images/<section>/                  generated photo variants (after `npm run images`)
  og.png, _headers                   social card, Cloudflare cache headers
assets-src/images/<section>/         photo masters (not deployed)
src/
  app/                layout (fonts, metadata, boot script), page, globals.css (tokens)
  components/
    brand/            PerformanceMark (SVG + timeline), Wordmark, mark-geometry (generated)
    preloader/        cinematic opening
    layout/           Header, MobileMenu, LanguageToggle, Footer, SkipLink, Runtime
    sections/         Hero, Precision, Aerodynamics, ShowroomSection, HotspotsSection,
                      Performance, Interior, Finale
    showroom/         Showroom (stage, thumbnails, controls), PaintSelector
    hotspots/         HotspotScene (tabs + markers), HotspotPanel (detail dialog)
    ui/               ArtImage, ImageFallback, CtaLink, Eyebrow, Split (Chars / Words)
  data/               image-assets, gallery, hotspots, specifications, brand, site
  hooks/              use-scroll-lock, use-swipe
  lib/animations/     gsap setup + tokens, preloader→hero hand-off
  lib/i18n/           en.ts (source), pt.ts, store, use-i18n, format
  types/
scripts/              generate-mark, optimize-images, list-images, build-social, serve-static
tests/e2e/            Playwright specs
docs/                 CODEX_IMAGE_ASSETS.md · DESIGN_SYSTEM.md · MOTION_GUIDELINES.md
```

## Sections

| # | Section | Highlights |
|---|---|---|
| 00 | Preloader | GT3 RS signature drawn path by path, fill, red stripe, travelling yellow glint, panels part into the hero |
| 01 | Hero | Three depth layers: backdrop · giant "PORSCHE" · car cut-out; headline left, lede + link right, spec cards; coordinated entrance and layered scroll exit |
| 02 | Precision in motion | Desktop pinned scene: three photographs replace each other through masks with three chapters |
| 03 | Aerodynamics | Wing frame with scroll-drawn illustrative airflow (labelled as such), verified facts, 860 kg figure |
| 04 | Interactive showroom | 5 views, thumbnails, prev/next, ←/→, swipe, live announcements, paint architecture (white / black) |
| 05 | Details (hotspots) | 3 viewpoints, 7 markers anchored to the image, complete list, editorial detail dialog |
| 06 | Performance | Large figures climbing digit by digit, track band |
| 07 | Interior | Pinned horizontal journey through the cabin (native scroller on mobile) |
| 08 | Final | Signature drawn and rewound with the scroll, aperture-revealed photograph, CTAs, credits, footer |

Technical figures come only from Porsche's 2022 world-premiere release (`src/data/specifications.ts`).

## How the animations work

- `useGSAP` everywhere (scoped, auto-cleanup), `gsap.matchMedia()` for desktop / mobile /
  reduced-motion variants; pins only on desktop (Precision, Interior).
- The preloader builds its timeline with `buildMarkTimeline()` (stroke-dash drawing, clip-path fill,
  masked stripes, animated gradient) and hands over to the hero through `lib/animations/intro.ts`.
- Safety: scroll locked only during the opening; 7 s timer-based hard stop; CSS failsafe; no
  preloader without JavaScript; shorter on repeat visits; fade-only with reduced motion.
- Full timings and rules: **docs/MOTION_GUIDELINES.md**.

## Languages

English by default (the browser language is not used). `EN | PT` switches instantly without a reload,
is saved in `localStorage`, updates `<html lang>`, title and description, and never replays the opening.
Dictionaries: `src/lib/i18n/en.ts` (source of the `Dictionary` type) and `pt.ts` — a missing key is a
type error.

## Adding the photographs

No final photography is included. Every slot shows an elegant "Image pending" placeholder.

1. Read **docs/CODEX_IMAGE_ASSETS.md** (inventory, sizes, prompts, consistency rules, hotspots).
2. Save masters as `assets-src/images/<section>/<name>.png`.
3. Run `npm run images` — slots switch to the photographs automatically.
4. Adjust hotspot positions in `src/data/hotspots.ts` if needed, then `npm run check`.

The navbar logo is the original GT3 RS concept signature. The crest favicon is wired but switched
off until a licensed file is supplied — see section 9 of the image brief.

## Deploying to Cloudflare Pages

The site is a fully static export.

| Setting | Value |
|---|---|
| Framework preset | None (or "Next.js (Static HTML Export)") |
| Build command | `npm run build` |
| Build output directory | `out` |
| Environment variables | `NODE_VERSION=22`, optionally `NEXT_PUBLIC_SITE_URL=https://your-domain` |

`public/_headers` sets long-term caching for `/_next/static/*` and `/images/*`.
Or deploy from the command line: `npm run build && npx wrangler pages deploy out`.

## Tests

`npm run build && npm run test:e2e` runs against the exported site on desktop (1440×900) and mobile
(Pixel 7): preloader (drawing, timing, repeat, skip, reduced motion), language switching and
persistence, showroom (buttons, keyboard, thumbnails, paint availability, no broken images),
hotspots (dialog, navigation, Escape, focus return, list, tab keys), navigation (mobile menu),
finale signature (draws, rewinds, redraws with the scroll), navbar logo, no numbered markers,
layout at 320–1920 px in EN and PT (no horizontal overflow, full-height hero, text ≥ 13 px) and
static-export output. `CAPTURE=1 npx playwright test visual` records review screenshots in `.visual/`.
