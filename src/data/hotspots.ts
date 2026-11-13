import type { HotspotId, ImageAsset, SceneId } from "@/types";
import { images, showroomImage } from "./image-assets";

/**
 * Hotspots are positioned in percentages of their scene image, so they
 * stay attached to the car at every size. After real photography lands,
 * adjust `x` / `y` here (see docs/CODEX_IMAGE_ASSETS.md → Hotspots).
 */

export interface Scene {
  id: SceneId;
  image: ImageAsset;
  /** Alt-text key or showroom view used to describe the scene. */
  altView?: "front34" | "rear34";
}

export const scenes: readonly Scene[] = [
  { id: "front34", image: showroomImage("white", "front34"), altView: "front34" },
  { id: "rear34", image: showroomImage("white", "rear34"), altView: "rear34" },
  { id: "cockpit", image: images.interiorCockpit },
];

export interface Hotspot {
  id: HotspotId;
  scene: SceneId;
  /** Position on the scene image, in % of width / height. */
  x: number;
  y: number;
  detail: ImageAsset;
}

/** Order defines the panel's previous / next sequence. */
export const hotspots: readonly Hotspot[] = [
  { id: "frontAero", scene: "front34", x: 79, y: 76, detail: images.detailFrontAero },
  { id: "wheelsBrakes", scene: "front34", x: 49, y: 66, detail: images.detailWheel },
  { id: "carbon", scene: "front34", x: 69, y: 51, detail: images.detailCarbon },
  { id: "rearWing", scene: "rear34", x: 69, y: 34, detail: images.detailRearWing },
  { id: "diffuser", scene: "rear34", x: 79, y: 73, detail: images.detailDiffuser },
  { id: "cockpit", scene: "cockpit", x: 72, y: 42, detail: images.detailCockpit },
  { id: "seats", scene: "cockpit", x: 18, y: 64, detail: images.detailSeat },
];
