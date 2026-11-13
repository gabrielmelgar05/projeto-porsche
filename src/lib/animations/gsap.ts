"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

/** Motion vocabulary — see docs/MOTION_GUIDELINES.md. */
export const EASE = {
  /** Reveals: fast start, long precise settle. */
  reveal: "expo.out",
  /** Panels, masks, curtains. */
  curtain: "power4.inOut",
  /** Drawing strokes. */
  draw: "power2.inOut",
  /** UI feedback. */
  ui: "power2.out",
  exit: "power2.in",
} as const;

export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export const reducedMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;

export { gsap, ScrollTrigger, useGSAP };
