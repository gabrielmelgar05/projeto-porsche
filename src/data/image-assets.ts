import type { ImageAsset } from "@/types";
import available from "./generated/available-images.json" with { type: "json" };

/**
 * Image manifest — every photograph the site can show.
 *
 * Masters go in `assets-src/images/<dir>/<name>.(png|jpg|webp)`.
 * `npm run images` writes AVIF + WebP variants to `public/images/<dir>/`
 * and records which ids are complete in `generated/available-images.json`.
 * Until then each slot renders an elegant placeholder — never a broken image.
 * Full briefs for every file: docs/CODEX_IMAGE_ASSETS.md
 */

const WIDE = [640, 1280, 1920, 2560] as const;
const MEDIUM = [480, 960, 1440] as const;

const asset = (a: Omit<ImageAsset, "widths"> & { widths?: readonly number[] }): ImageAsset => ({
  widths: WIDE,
  ...a,
});

export const images = {
  /** Hero layer 1 — atmospheric backdrop (no car). */
  heroBackdrop: asset({
    id: "heroBackdrop",
    dir: "hero",
    name: "gt3rs-hero-backdrop",
    width: 2560,
    height: 1440,
    mobile: { name: "gt3rs-hero-backdrop-portrait", width: 1080, height: 1920 },
  }),
  /** Hero layer 3 — the car, side profile, on a transparent background. */
  heroCar: asset({ id: "heroCar", dir: "hero", name: "gt3rs-hero-car", width: 2400, height: 960 }),
  precisionSide: asset({
    id: "precisionSide",
    dir: "precision",
    name: "gt3rs-precision-side",
    width: 2560,
    height: 1600,
  }),
  precisionBrake: asset({
    id: "precisionBrake",
    dir: "precision",
    name: "gt3rs-precision-brake",
    width: 2560,
    height: 1600,
  }),
  precisionWing: asset({
    id: "precisionWing",
    dir: "precision",
    name: "gt3rs-precision-wing",
    width: 2560,
    height: 1600,
  }),
  aeroWing: asset({
    id: "aeroWing",
    dir: "aerodynamics",
    name: "gt3rs-aero-rear-wing",
    width: 2560,
    height: 1600,
  }),
  aeroSplitter: asset({
    id: "aeroSplitter",
    dir: "aerodynamics",
    name: "gt3rs-aero-splitter",
    width: 1440,
    height: 1800,
    widths: MEDIUM,
  }),
  aeroCarbon: asset({
    id: "aeroCarbon",
    dir: "aerodynamics",
    name: "gt3rs-aero-carbon",
    width: 1440,
    height: 1800,
    widths: MEDIUM,
  }),
  performanceTrack: asset({
    id: "performanceTrack",
    dir: "performance",
    name: "gt3rs-performance-track",
    width: 2560,
    height: 1097,
  }),
  interiorCockpit: asset({
    id: "interiorCockpit",
    dir: "interior",
    name: "gt3rs-interior-cockpit",
    width: 2560,
    height: 1440,
  }),
  interiorWheel: asset({
    id: "interiorWheel",
    dir: "interior",
    name: "gt3rs-interior-wheel",
    width: 1440,
    height: 1800,
    widths: MEDIUM,
  }),
  interiorSeats: asset({
    id: "interiorSeats",
    dir: "interior",
    name: "gt3rs-interior-seats",
    width: 1440,
    height: 1800,
    widths: MEDIUM,
  }),
  interiorClubsport: asset({
    id: "interiorClubsport",
    dir: "interior",
    name: "gt3rs-interior-clubsport",
    width: 1440,
    height: 1800,
    widths: MEDIUM,
  }),
  finaleRear: asset({
    id: "finaleRear",
    dir: "finale",
    name: "gt3rs-finale-rear34",
    width: 2560,
    height: 1097,
    mobile: { name: "gt3rs-finale-rear34-portrait", width: 1080, height: 1440 },
  }),
  detailRearWing: asset({
    id: "detailRearWing",
    dir: "details",
    name: "gt3rs-detail-rear-wing",
    width: 1600,
    height: 1067,
    widths: MEDIUM,
  }),
  detailFrontAero: asset({
    id: "detailFrontAero",
    dir: "details",
    name: "gt3rs-detail-front-aero",
    width: 1600,
    height: 1067,
    widths: MEDIUM,
  }),
  detailWheel: asset({
    id: "detailWheel",
    dir: "details",
    name: "gt3rs-detail-wheel",
    width: 1600,
    height: 1067,
    widths: MEDIUM,
  }),
  detailCarbon: asset({
    id: "detailCarbon",
    dir: "details",
    name: "gt3rs-detail-carbon",
    width: 1600,
    height: 1067,
    widths: MEDIUM,
  }),
  detailDiffuser: asset({
    id: "detailDiffuser",
    dir: "details",
    name: "gt3rs-detail-diffuser",
    width: 1600,
    height: 1067,
    widths: MEDIUM,
  }),
  detailCockpit: asset({
    id: "detailCockpit",
    dir: "details",
    name: "gt3rs-detail-cockpit",
    width: 1600,
    height: 1067,
    widths: MEDIUM,
  }),
  detailSeat: asset({
    id: "detailSeat",
    dir: "details",
    name: "gt3rs-detail-seat",
    width: 1600,
    height: 1067,
    widths: MEDIUM,
  }),
} satisfies Record<string, ImageAsset>;

export type ImageId = keyof typeof images;

/** Showroom: one image per paint × view, all with identical studio framing. */
export const showroomImage = (paint: string, view: string): ImageAsset => ({
  id: `showroom-${paint}-${view}`,
  dir: "showroom",
  name: `gt3rs-${paint}-${view}`,
  width: 2560,
  height: 1440,
  widths: WIDE,
});

const availableIds = new Set<string>(available as string[]);

export const isAvailable = (asset: ImageAsset): boolean => availableIds.has(asset.id);

/** Every asset, for the optimiser script and docs. */
export const allAssets = (): ImageAsset[] => [
  ...Object.values(images),
  ...(["white", "black"] as const).flatMap((paint) =>
    (["front34", "side", "rear34", "front", "rear"] as const).map((view) => showroomImage(paint, view)),
  ),
];
