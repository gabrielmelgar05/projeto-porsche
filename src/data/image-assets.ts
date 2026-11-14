import type { ImageAsset, PaintId, ViewId } from "@/types";
import available from "./generated/available-images.json" with { type: "json" };
import nativeDimensions from "./generated/image-dimensions.json" with { type: "json" };
import versions from "./generated/image-versions.json" with { type: "json" };

/**
 * Image manifest — every photograph the site can show.
 *
 * Masters go in `assets-src/images/<dir>/<name>.(png|jpg|webp)`.
 * `npm run images` writes AVIF + WebP variants to `public/images/<dir>/`
 * and records which ids are complete in `generated/available-images.json`.
 * Until then each slot renders an elegant placeholder — never a broken image.
 * Full briefs for every file: docs/CODEX_IMAGE_ASSETS.md
 */

// Native generator sizes: do not advertise variants larger than the masters.
const WIDE = [640, 1280, 1672] as const;
const CINEMATIC = [640, 1280, 1586] as const;
const MEDIUM = [480, 960, 1440] as const;
const PORTRAIT = [480, 960, 1122] as const;

const asset = (a: Omit<ImageAsset, "widths"> & { widths?: readonly number[] }): ImageAsset => ({
  widths: WIDE,
  ...a,
});

export const paintIds = [
  "ice-grey",
  "white",
  "matte-black",
  "gt-silver",
  "guards-red",
] as const satisfies readonly PaintId[];

export const images = {
  /** One photograph per viewport: car and environment are composed in the source image. */
  heroRoad: asset({
    id: "heroRoad",
    dir: "hero",
    name: "gt3rs-hero-road",
    width: 1672,
    height: 941,
    focus: "50% 80%",
    mobile: {
      name: "gt3rs-hero-road-portrait",
      width: 941,
      height: 1672,
      media: "(max-width: 1023px), (max-aspect-ratio: 4/3)",
    },
  }),
  precisionSide: asset({
    id: "precisionSide",
    dir: "precision",
    name: "gt3rs-precision-side",
    width: 1586,
    height: 992,
    widths: CINEMATIC,
  }),
  precisionBrake: asset({
    id: "precisionBrake",
    dir: "precision",
    name: "gt3rs-precision-brake",
    width: 1586,
    height: 992,
    widths: CINEMATIC,
    focus: "38% 50%",
  }),
  precisionWing: asset({
    id: "precisionWing",
    dir: "precision",
    name: "gt3rs-precision-wing",
    width: 1586,
    height: 992,
    widths: CINEMATIC,
    focus: "100% 50%",
  }),
  aeroWing: asset({
    id: "aeroWing",
    dir: "aerodynamics",
    name: "gt3rs-aero-rear-wing",
    width: 1586,
    height: 992,
    widths: CINEMATIC,
  }),
  aeroSplitter: asset({
    id: "aeroSplitter",
    dir: "aerodynamics",
    name: "gt3rs-aero-splitter",
    width: 1122,
    height: 1402,
    widths: PORTRAIT,
  }),
  aeroCarbon: asset({
    id: "aeroCarbon",
    dir: "aerodynamics",
    name: "gt3rs-aero-carbon",
    width: 1122,
    height: 1402,
    widths: PORTRAIT,
  }),
  performanceTrack: asset({
    id: "performanceTrack",
    dir: "performance",
    name: "gt3rs-performance-track",
    width: 1885,
    height: 834,
    widths: [640, 1280, 1885],
  }),
  interiorCockpit: asset({
    id: "interiorCockpit",
    dir: "interior",
    name: "gt3rs-interior-cockpit",
    width: 1672,
    height: 941,
  }),
  interiorWheel: asset({
    id: "interiorWheel",
    dir: "interior",
    name: "gt3rs-interior-wheel",
    width: 1122,
    height: 1402,
    widths: PORTRAIT,
  }),
  interiorSeats: asset({
    id: "interiorSeats",
    dir: "interior",
    name: "gt3rs-interior-seats",
    width: 1122,
    height: 1402,
    widths: PORTRAIT,
  }),
  interiorClubsport: asset({
    id: "interiorClubsport",
    dir: "interior",
    name: "gt3rs-interior-clubsport",
    width: 1122,
    height: 1402,
    widths: PORTRAIT,
  }),
  finaleRear: asset({
    id: "finaleRear",
    dir: "finale",
    name: "gt3rs-finale-rear34",
    width: 1914,
    height: 822,
    widths: [640, 1280, 1914],
    mobile: { name: "gt3rs-finale-rear34-portrait", width: 1086, height: 1448 },
  }),
  detailRearWing: asset({
    id: "detailRearWing",
    dir: "details",
    name: "gt3rs-detail-rear-wing",
    width: 1536,
    height: 1024,
    widths: MEDIUM,
  }),
  detailFrontAero: asset({
    id: "detailFrontAero",
    dir: "details",
    name: "gt3rs-detail-front-aero",
    width: 1536,
    height: 1024,
    widths: MEDIUM,
  }),
  detailWheel: asset({
    id: "detailWheel",
    dir: "details",
    name: "gt3rs-detail-wheel",
    width: 1536,
    height: 1024,
    widths: MEDIUM,
  }),
  detailCarbon: asset({
    id: "detailCarbon",
    dir: "details",
    name: "gt3rs-detail-carbon",
    width: 1536,
    height: 1024,
    widths: MEDIUM,
  }),
  detailDiffuser: asset({
    id: "detailDiffuser",
    dir: "details",
    name: "gt3rs-detail-diffuser",
    width: 1536,
    height: 1024,
    widths: MEDIUM,
  }),
  detailCockpit: asset({
    id: "detailCockpit",
    dir: "details",
    name: "gt3rs-detail-cockpit",
    width: 1536,
    height: 1024,
    widths: MEDIUM,
  }),
  detailSeat: asset({
    id: "detailSeat",
    dir: "details",
    name: "gt3rs-detail-seat",
    width: 1536,
    height: 1024,
    widths: MEDIUM,
  }),
} satisfies Record<string, ImageAsset>;

export type ImageId = keyof typeof images;

/** Showroom: one image per paint × view, all with identical studio framing. */
export const showroomImage = (paint: PaintId, view: ViewId): ImageAsset => {
  const name = `gt3rs-${paint}-${view}`;
  const [width, height] = (nativeDimensions as Record<string, number[]>)[name] ?? [1672, 941];
  return {
    id: `showroom-${paint}-${view}`,
    dir: "showroom",
    name,
    width: width!,
    height: height!,
    widths: [640, 1280, width!],
  };
};

const availableIds = new Set<string>(available as string[]);

export const isAvailable = (asset: ImageAsset): boolean => availableIds.has(asset.id);

/** Shared by picture sources and selective preloads so a revision is fetched only once. */
export const imageUrl = (dir: string, name: string, width: number, format: "avif" | "webp") => {
  const version = (versions as Record<string, string>)[`${dir}/${name}`];
  return `/images/${dir}/${name}-${width}.${format}${version ? `?v=${version}` : ""}`;
};

/** Every asset, for the optimiser script and docs. */
export const allAssets = (): ImageAsset[] => [
  ...Object.values(images),
  ...paintIds.flatMap((paint) =>
    (["front34", "side", "rear34", "front", "rear"] as const).map((view) => showroomImage(paint, view)),
  ),
];
