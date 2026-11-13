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
  { id: "frontAero", scene: "front34", x: 72, y: 70, detail: images.detailFrontAero },
  { id: "wheelsBrakes", scene: "front34", x: 41, y: 66, detail: images.detailWheel },
  { id: "carbon", scene: "front34", x: 60, y: 47, detail: images.detailCarbon },
  { id: "rearWing", scene: "rear34", x: 63, y: 30, detail: images.detailRearWing },
  { id: "diffuser", scene: "rear34", x: 67, y: 72, detail: images.detailDiffuser },
  { id: "cockpit", scene: "cockpit", x: 52, y: 44, detail: images.detailCockpit },
  { id: "seats", scene: "cockpit", x: 24, y: 62, detail: images.detailSeat },
];
