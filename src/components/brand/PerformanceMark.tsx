"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";
import { gsap, EASE } from "@/lib/animations/gsap";
import { markColors, markLetters, markStripeGuides, markStripes, markViewBox } from "./mark-geometry";

interface PerformanceMarkProps {
  /** Letter colour — mineral white on dark grounds, ink on light. */
  letterColor?: string;
  className?: string;
  title?: string;
}

const vb = `${markViewBox.x} ${markViewBox.y} ${markViewBox.width} ${markViewBox.height}`;

/**
 * GT3 RS concept signature (original geometry, see scripts/generate-mark.mjs).
 * Renders fully drawn by default; `buildMarkTimeline` stages it for animation.
 */
export const PerformanceMark = forwardRef<SVGSVGElement, PerformanceMarkProps>(function PerformanceMark(
  { letterColor = markColors.ink, className, title },
  ref,
) {
  const uid = useId().replace(/:/g, "");
  const ids = {
    red: `mark-red-${uid}`,
    yellow: `mark-yellow-${uid}`,
    fill: `mark-fill-${uid}`,
    glint: `mark-glint-${uid}`,
  };

  return (
    <svg
      ref={ref}
      viewBox={vb}
      className={cn("block h-auto w-full overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <mask id={ids.red} maskUnits="userSpaceOnUse">
          <path data-guide="red" d={markStripeGuides.red} stroke="#fff" strokeWidth={70} fill="none" />
        </mask>
        <mask id={ids.yellow} maskUnits="userSpaceOnUse">
          <path data-guide="yellow" d={markStripeGuides.yellow} stroke="#fff" strokeWidth={24} fill="none" />
        </mask>
        <clipPath id={ids.fill} clipPathUnits="userSpaceOnUse">
          <rect
            data-fill-wipe=""
            x={-60}
            y={0}
            width={1120}
            height={markViewBox.height}
            transform="skewX(-24)"
          />
        </clipPath>
        <linearGradient
          id={ids.glint}
          gradientUnits="userSpaceOnUse"
          x1={-260}
          x2={-60}
          y1={0}
          y2={0}
          data-glint=""
        >
          <stop offset="0" stopColor={markColors.yellow} stopOpacity={0} />
          <stop offset="0.5" stopColor={markColors.yellow} stopOpacity={1} />
          <stop offset="1" stopColor={markColors.yellow} stopOpacity={0} />
        </linearGradient>
      </defs>

      <g data-mark="" style={{ color: letterColor }}>
        {/* Contours — drawn first */}
        <g data-outlines="" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round">
          {markLetters.map((letter) => (
            <path key={letter.id} data-outline={letter.id} d={letter.d} />
          ))}
        </g>
        {/* Solid letters — wiped in after the contours */}
        <g data-fills="" fill="currentColor" clipPath={`url(#${ids.fill})`}>
          {markLetters.map((letter) => (
            <path key={letter.id} d={letter.d} />
          ))}
        </g>
        {/* Speed stripes */}
        <path data-stripe="red" d={markStripes[0].d} fill={markColors.red} mask={`url(#${ids.red})`} />
        <path d={markStripes[0].d} fill={`url(#${ids.glint})`} mask={`url(#${ids.red})`} />
        <path
          data-stripe="yellow"
          d={markStripes[1].d}
          fill={markColors.yellow}
          mask={`url(#${ids.yellow})`}
        />
      </g>
    </svg>
  );
});

type MarkMode = "full" | "quick";

/**
 * Builds the signature reveal on an existing timeline:
 * contours draw → fill wipes in → red stripe draws → yellow glint travels
 * the red stripe → yellow stripe follows → small forward nudge.
 */
export function buildMarkTimeline(svg: SVGSVGElement, mode: MarkMode = "full"): gsap.core.Timeline {
  const q = gsap.utils.selector(svg);
  const outlines = q<SVGPathElement>("[data-outline]");
  const guides = {
    red: q<SVGPathElement>('[data-guide="red"]')[0],
    yellow: q<SVGPathElement>('[data-guide="yellow"]')[0],
  };
  const wipe = q("[data-fill-wipe]")[0];
  const glint = q("[data-glint]")[0];
  const mark = q("[data-mark]")[0];
  const quick = mode === "quick";

  const tl = gsap.timeline();

  // Stage: everything hidden, ready to draw.
  outlines.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
  });
  Object.values(guides).forEach((guide) => {
    if (!guide) return;
    const length = guide.getTotalLength();
    gsap.set(guide, { strokeDasharray: length, strokeDashoffset: length });
  });
  gsap.set(wipe, { attr: { width: 0 } });
  gsap.set(glint, { attr: { x1: -260, x2: -60 } });

  // 1 — contours
  tl.to(outlines, {
    strokeDashoffset: 0,
    duration: quick ? 0.45 : 0.9,
    ease: EASE.draw,
    stagger: quick ? 0.04 : 0.09,
  });
  // 2 — fill
  tl.to(
    wipe,
    { attr: { width: 1120 }, duration: quick ? 0.35 : 0.7, ease: EASE.curtain },
    quick ? "-=0.15" : "-=0.35",
  );
  tl.to(outlines, { opacity: 0, duration: 0.3, ease: "none" }, "<0.35");
  // 3 — red stripe
  tl.to(
    guides.red ?? [],
    { strokeDashoffset: 0, duration: quick ? 0.35 : 0.65, ease: EASE.draw },
    quick ? "<" : "-=0.35",
  );
  // 4 — yellow travels the red, then the yellow stripe follows
  tl.to(glint, { attr: { x1: 1080, x2: 1280 }, duration: quick ? 0.4 : 0.75, ease: "power2.inOut" }, "-=0.2");
  tl.to(guides.yellow ?? [], { strokeDashoffset: 0, duration: quick ? 0.3 : 0.5, ease: EASE.draw }, "<0.25");
  // 5 — forward nudge
  if (!quick) {
    tl.fromTo(mark, { x: 0 }, { x: 10, duration: 0.2, ease: "power2.out" }, "-=0.15").to(mark, {
      x: 0,
      duration: 0.45,
      ease: EASE.reveal,
    });
  }
  return tl;
}
