import type { PaintId, ViewId } from "@/types";
import { isAvailable, showroomImage } from "./image-assets";

/** Showroom views in presentation order. */
export const views: readonly ViewId[] = ["front34", "side", "rear34", "front", "rear"];

export interface Paint {
  id: PaintId;
  swatch: string;
  finish: "solid" | "metallic" | "matte";
}

export const paints: readonly Paint[] = [
  { id: "ice-grey", swatch: "#c1cbd1", finish: "metallic" },
  { id: "white", swatch: "#f2f1ec", finish: "solid" },
  { id: "matte-black", swatch: "#242526", finish: "matte" },
  { id: "gt-silver", swatch: "#9b9e9f", finish: "metallic" },
  { id: "guards-red", swatch: "#bd162b", finish: "solid" },
];

/**
 * A paint only becomes selectable once all five of its views
 * exist — no CSS recolouring, no half-finished sets.
 */
export const isPaintSelectable = (paint: Paint): boolean =>
  views.every((view) => isAvailable(showroomImage(paint.id, view)));
