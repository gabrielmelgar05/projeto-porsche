import type { PaintId, ViewId } from "@/types";
import { isAvailable, showroomImage } from "./image-assets";

/** Showroom views in presentation order. */
export const views: readonly ViewId[] = ["front34", "side", "rear34", "front", "rear"];

export interface Paint {
  id: PaintId;
  swatch: string;
  /** The default paint is always selectable (its slots show placeholders until imagery lands). */
  isDefault?: boolean;
}

export const paints: readonly Paint[] = [
  { id: "white", swatch: "#f2f1ec", isDefault: true },
  { id: "black", swatch: "#141414" },
];

/**
 * A non-default paint only becomes selectable once all five of its views
 * exist — no CSS recolouring, no half-finished sets.
 */
export const isPaintSelectable = (paint: Paint): boolean =>
  paint.isDefault === true || views.every((view) => isAvailable(showroomImage(paint.id, view)));
