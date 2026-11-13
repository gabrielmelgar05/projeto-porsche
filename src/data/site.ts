import type { SectionId } from "@/types";

/** In-page sections in narrative order (the hero is `#top`). */
export const sections: readonly SectionId[] = [
  "precision",
  "aerodynamics",
  "showroom",
  "details",
  "performance",
  "interior",
];

export const site = {
  name: "911 GT3 RS — Concept Experience",
  studio: "Aklio Studio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
