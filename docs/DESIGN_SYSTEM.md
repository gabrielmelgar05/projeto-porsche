# Design System

Editorial, cinematic, restrained. The car, the photography, the type and the motion carry the page;
interface chrome stays quiet. Tokens live in `src/app/globals.css` (`@theme`).

## Palette

| Token | Hex | Role |
|---|---|---|
| `paper` | `#F3F2EE` | Off-white base, light sections |
| `mineral` | `#FAFAF7` | Mineral white — showroom, panels |
| `concrete` | `#D9D7D1` | Concrete grey — image wells, finale ground, hairlines |
| `concrete-deep` | `#A7A49D` | Concrete on dark surfaces (non-text decoration) |
| `stone` | `#5C5A55` | Secondary text on light (≈ 6.6:1 on paper) |
| `graphite` | `#1D1D1D` | Graphite black — aerodynamics, interior |
| `ink` | `#0A0A0A` | Deep black — hero, details, footer, preloader |
| `red` | `#C8102E` | Performance red — indices, active states, focus, accents only |
| `signal` | `#F2B705` | Signature yellow — **only** inside the GT3 RS mark |

Rules: red is an accent (≤ 5 % of any viewport); no colour gradients; secondary text on dark uses
white at ≥ 60 % opacity.

## Typography

| Family | Use | Notes |
|---|---|---|
| **Archivo** (variable `wght` + `wdth`) | Display, headlines, labels | Extended widths (`font-stretch` 108–125 %) give the motorsport voice |
| **Inter** | Body copy, UI text | 16–18 px for reading text |

| Utility | Size | Use |
|---|---|---|
| `t-monument` | 56–112 px mobile · 80–248 px desktop | "911 GT3 RS" only — uppercase, 125 % width, 800 |
| `t-headline` | 36–100 px | Section headlines, sentence case |
| `t-figure` | 64–208 px | Performance figures, tabular numerals |
| `t-title` | 22–32 px | Panel / view titles |
| `t-lede` | 18–22 px | Introductory paragraphs |
| `t-body` | 17 px | Body |
| `t-label` | **13 px**, 0.14em tracking, uppercase | Eyebrows, labels, counters |

Minimum on-screen text size is 13 px (enforced by `tests/e2e/layout.spec.ts`). Headlines use
`text-wrap: balance`; words never break mid-word (split text groups characters per word).

## Spacing & grid

| Token | Value |
|---|---|
| `--gutter` | `clamp(20px, 4vw, 64px)` page margin |
| `--gap` | `clamp(16px, 2vw, 32px)` column gap |
| `--section-pad` | `clamp(88px, 12vh, 160px)` vertical rhythm |
| `--frame-max` | 1600 px content width |
| `--header-h` | 68 px · 80 px ≥ 1024 |

Grid (`grid-12`): 4 columns < 768 · 8 columns 768–1023 · 12 columns ≥ 1024.

## Breakpoints

`xs` 375 · `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536 · `3xl` 1800.
Verified at 320, 375, 390, 768, 1024, 1440, 1920.

## Components

| Component | File | Notes |
|---|---|---|
| Header | `components/layout/Header.tsx` | GT3 RS signature as logo (letters follow the header tone); fixed; tone from `data-tone`; solid on scroll; hides on scroll down |
| Mobile menu | `components/layout/MobileMenu.tsx` | Modal `<dialog>`, curtain animation, Escape, focus return |
| Language toggle | `components/layout/LanguageToggle.tsx` | `EN \| PT`, red underline marks the active language |
| GT3 RS mark | `components/brand/PerformanceMark.tsx` | Original vector signature + `buildMarkTimeline()` |
| CtaLink | `components/ui/CtaLink.tsx` | Squared bar (2 px radius); red fills from the left on hover/focus |
| Eyebrow | `components/ui/Eyebrow.tsx` | Section label above a headline — no index numbers |
| ArtImage | `components/ui/ArtImage.tsx` | `<picture>` AVIF/WebP + mobile art direction; falls back to ImageFallback |
| ImageFallback | `components/ui/ImageFallback.tsx` | Studio-cyclorama gradient + "Image pending" label; `compact` for thumbnails |
| Showroom | `components/showroom/*` | Stage, thumbnails, paint radios, counter, prev/next |
| Hotspots | `components/hotspots/*` | Viewpoint tablist, % positioned markers, detail `<dialog>` |

## Buttons & interaction states

| Element | Rest | Hover | Focus | Active / selected |
|---|---|---|---|---|
| CtaLink | ink or white bar | red wipe, arrow nudges right | same as hover + red outline | — |
| Round / square controls (48 px) | 1 px border | ink fill, white icon | 2 px red outline, 3 px offset | — |
| Nav link | — | underline sweeps in | outline | `aria-current` keeps underline |
| Hotspot marker (44–48 px) | white disc, "+" | red disc, "+" rotates 90° | outline + label shown | 3 initial pulses |
| Thumbnail | — | grey outline | outline | red outline + bold label |
| Paint radio | ring | — | red outline | red ring; unavailable = 40 % + note |

Touch targets ≥ 44 × 44 px. Hover effects are never the only signal.

## Responsive behaviour

| Section | < 1024 px | ≥ 1024 px |
|---|---|---|
| Hero | Headline + lede stacked, car 96vw, spec cards 2×2, portrait backdrop | Headline left / lede right, car 62vw over the "PORSCHE" word, 4 spec cards in a row |
| Precision | Three stacked chapters with their own images | Pinned scene, images replace each other |
| Aerodynamics | Single column, portraits full width | Asymmetric grid, parallax portraits |
| Showroom | Swipe, scrolling thumbnail strip, swipe hint | Arrow keys, 5-column thumbnails |
| Hotspots | Image + complete list (every point reachable) | Same, wider; marker labels on hover/focus |
| Detail panel | Bottom sheet | Right-hand drawer |
| Performance | Label above figure | Figure left, label right |
| Interior | Native horizontal scroller with snap | Pinned horizontal travel |
| Footer | Stacked | 3 columns |
