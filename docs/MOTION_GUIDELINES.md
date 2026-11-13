# Motion Guidelines

Motion should read as **precision**: fast starts, long controlled settles, nothing elastic except
the hotspot markers' small pop. Every section moves differently, and every move has a reason.

## Tokens — `src/lib/animations/gsap.ts`

| Token | Ease | Use |
|---|---|---|
| `EASE.reveal` | `expo.out` | Text and image entrances |
| `EASE.curtain` | `power4.inOut` | Masks, clip-paths, panels |
| `EASE.draw` | `power2.inOut` | SVG stroke drawing |
| `EASE.ui` | `power2.out` | Small UI feedback |
| `EASE.exit` | `power2.in` | Elements leaving |

Typical durations: UI 0.3–0.5 s · text 0.8–1.1 s · masks 0.8–1.3 s · image settle 1.6–2.2 s.
CSS transitions (hover/focus) use 300–700 ms with `--ease-out-expo`.

## Preloader — `components/preloader/Preloader.tsx`

| t (s) | Moment | What happens |
|---|---|---|
| 0.0 | 01 Darkness | Red precision line draws from the left (0.75 s); meta labels fade in |
| 0.5 | 02 Drawing | Each letter outline is drawn with `stroke-dashoffset` (0.9 s, stagger 0.09) |
| ~1.6 | 03 Completion | Fill wipes in through a slanted clip; outlines fade; red stripe drawn through a mask |
| ~2.3 | | Yellow glint travels along the red stripe (animated gradient); yellow stripe follows |
| ~2.9 | | Forward nudge of the whole mark (10 px and back) |
| ~3.2 | 04 Transition | Content lifts out; the two textured panels part vertically (1.1 s) |
| ~3.6 | 05 Hero | Scroll is released and the hero timeline starts |

- Repeat visit in the same session (`sessionStorage`): quick variant (~1.3 s).
- `prefers-reduced-motion`: static mark, 0.6 s hold, fade.
- "Skip intro" jumps the timeline to its end.
- Safety: a 7 s timer-based hard stop (independent of animation frames) and a CSS failsafe; the
  preloader never appears without JavaScript.
- Language switches never replay it.

## Hero reveal — `components/sections/Hero.tsx`

Registered paused and started by the preloader (`lib/animations/intro.ts`), in this order:
1. Vehicle — backdrop opens from an inset frame and settles from 1.25; the "PORSCHE" letters rise
   behind; the car drives in from the right (xPercent 18 → 0) as its floor shadow spreads
2. Headline — characters rise out of masks
3. Eyebrow + lede
4. Header
5. CTA link
6. Indicators — spec cards (stagger), scroll cue

Exit (desktop, scrubbed): depth layers separate — the backdrop sinks, the word slides left, the car
drives on to the right, content fades. Mobile: the car drives on, cards fade.

## Sections

| Section | Entrance | Scroll behaviour |
|---|---|---|
| 02 Precision | Headline words rise | **Pinned** (desktop, +220 %): image 2 wipes up, image 3 opens from the right, framing pushes in, chapter text and red progress rail follow. Mobile: per-chapter clip reveals |
| 03 Aerodynamics | Headline words slide in on a slant (skewX 14° → 0) | Wing frame opens from the left; illustrative streamlines drawn by scroll (scrub); hairlines draw before facts; portrait parallax (desktop, real images only) |
| 04 Showroom | Headline drops in from its mask; gallery rises | View changes (below) |
| 05 Hotspots | Words rise with a small rotation; stage rises | Markers pop in per viewpoint; list items slide in |
| 06 Performance | Headline characters | Each figure climbs digit by digit as its rule draws; track band opens from the centre (scrub) with horizontal parallax |
| 07 Interior | Headline words | **Pinned horizontal travel** (desktop) with inner image drift via `containerAnimation`; captions rise as panels enter. Mobile: native scroll-snap |
| 08 Final | **Signature tied to the scroll** (scrub 0.8, `top 90%` → `top 30%`): draws going down, rewinds going up, redraws on return, resets when the section is left upwards | Closing frame opens from a centred aperture (scrub); headline words, CTAs |

## Showroom transitions — `components/showroom/Showroom.tsx`

- Position indicator: five segments, the active one in red (no numbers).
- Next / previous: incoming view wipes in from the travel direction (clip-path, 0.9 s, curtain),
  settles from scale 1.08; the outgoing view drifts 6 % the other way.
- Paint change: crossfade on identical framing (no warping).
- Image readiness: the incoming photograph decodes before the transition starts. The last completed
  view remains visible during slow requests or rapid selection; scoped cleanup cancels stale decodes
  and animations. Mask/crossfade durations remain unchanged.
- Inputs: buttons, thumbnails, ←/→ on the focused stage, swipe (pointer events, 48 px threshold).
- Announcements: polite live region ("Side profile, view 2 of 5").

## Hotspot interactions — `components/hotspots/*`

- Viewpoint change: image settles from 1.04; markers `back.out(2)` pop in, stagger 0.08.
- Marker: three CSS pulses after load, then still (no infinite loop).
- Panel open: scrim fades; sheet slides from the right (desktop) / bottom (mobile), 0.8 s.
- Panel navigation: photograph wipes from the right, copy rises; the scene behind follows.
- Close (button, Escape, scrim): reverse slide, then focus returns to the marker of the detail
  that was showing.

## Reduced motion

`gsap.matchMedia()` gates every transform/scrub/pin behind `prefers-reduced-motion: no-preference`.
With reduction: no pins, no parallax, no drawing; the preloader fades; transitions become
≤ 0.2 s fades; CSS durations are neutralised globally.

## Performance & correctness rules

1. **Animate `transform` and `opacity` only** (plus one-shot `clip-path` masks). Never animate
   `filter`/`backdrop-filter` or layout properties.
2. **One owner per property.** GSAP and CSS never transition the same property on the same
   element. GSAP writes inline `translate/scale: none`, so CSS hover transforms live on child
   elements and centring translates live on parents (see hotspot markers).
3. **Interactive content uses `opacity`, not `autoAlpha`,** so it stays focusable before its reveal.
4. All animations are created in `useGSAP` (scoped, auto-cleanup); breakpoint logic in
   `gsap.matchMedia()` and reverted on cleanup; timelines rebuilt on language change with
   `revertOnUpdate`, and the hero jumps to its end state if the intro already played.
5. ScrollTrigger: header triggers use `refreshPriority: -1` (measured after pins); one
   `sort()` + `refresh()` when the preloader hands over; deep links are re-anchored afterwards;
   refresh is debounced on font load and language change.
6. Parallax only when a real photograph exists (placeholders stay still).
7. No infinite animations; no scroll hijacking; mobile uses native scrolling everywhere.
