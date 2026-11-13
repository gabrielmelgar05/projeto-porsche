"use client";

import { useRef } from "react";
import { images, isAvailable } from "@/data/image-assets";
import { specifications as spec } from "@/data/specifications";
import { EASE, MQ, gsap, useGSAP } from "@/lib/animations/gsap";
import { formatNumber } from "@/lib/i18n/format";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";
import { ArtImage } from "@/components/ui/ArtImage";
import { Chars } from "@/components/ui/Split";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface Figure {
  value: string;
  unit: string;
  label: string;
  note: string;
}

/** One figure: label + note (dt), then the big number (dd), shown number-first on wide screens. */
function FigureRow({ value, unit, label, note }: Figure) {
  return (
    <div
      data-perf-row=""
      className="relative grid grid-cols-1 gap-4 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:items-end md:gap-10 lg:py-10"
    >
      <span data-perf-rule="" aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-ink/20" />
      <dt className="flex flex-col gap-1 md:order-2 md:pb-4">
        <span data-perf-meta="" className="t-label text-accent">
          {label}
        </span>
        <span data-perf-meta="" className="text-[1.0625rem] text-stone">
          {note}
        </span>
      </dt>
      <dd className="t-figure md:order-1">
        <Chars text={value} />
        <span className="ml-[0.08em] text-[0.32em] font-semibold tracking-normal text-stone"> {unit}</span>
      </dd>
    </div>
  );
}

export function Performance() {
  const { t, tag, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const rows = t.performance.rows;

  const figures = [
    { id: "power", value: formatNumber(spec.powerPs, tag), unit: "PS", ...rows.power },
    { id: "sprint", value: formatNumber(spec.sprint0to100, tag, 1), unit: "s", ...rows.sprint },
    { id: "topSpeed", value: formatNumber(spec.topSpeedKmh, tag), unit: "km/h", ...rows.topSpeed },
    { id: "engine", value: formatNumber(spec.displacementL, tag, 1), unit: "l", ...rows.engine },
    { id: "weight", value: formatNumber(spec.kerbWeightKg, tag), unit: "kg", ...rows.weight },
  ];

  const bandParallax = isAvailable(images.performanceTrack);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.from(q("[data-perf-title] [data-char]"), {
        yPercent: 110,
        duration: 0.9,
        ease: EASE.reveal,
        stagger: 0.015,
        scrollTrigger: { trigger: q("[data-perf-title]")[0], start: "top 85%", once: true },
      });

      // Each figure climbs digit by digit while its rule draws across.
      q("[data-perf-row]").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 85%", once: true } })
          .from(row.querySelector("[data-perf-rule]"), {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.1,
            ease: EASE.curtain,
          })
          .from(
            row.querySelectorAll("[data-char]"),
            { yPercent: 105, duration: 1, ease: EASE.reveal, stagger: 0.06 },
            0.15,
          )
          .from(
            row.querySelectorAll("[data-perf-meta]"),
            { autoAlpha: 0, x: 16, duration: 0.7, stagger: 0.06 },
            0.4,
          );
      });

      const band = q("[data-perf-band]")[0];
      gsap.fromTo(
        band ?? [],
        { clipPath: "inset(0% 50% 0% 50%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: band, start: "top 90%", end: "top 40%", scrub: 0.5 },
        },
      );

      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const inner = q("[data-perf-band-inner][data-parallax]")[0];
        if (!inner) return;
        gsap.fromTo(
          inner,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="performance"
      data-tone="light"
      aria-labelledby="performance-title"
      className="section-pad bg-paper"
    >
      <div className="frame">
        <Eyebrow className="text-stone">{t.performance.eyebrow}</Eyebrow>
        <h2 id="performance-title" data-perf-title="" className="t-headline mt-6 max-w-[14ch]">
          <Chars text={t.performance.title} />
        </h2>

        <dl className="mt-14 lg:mt-20">
          {figures.slice(0, 2).map((figure) => (
            <FigureRow key={figure.id} {...figure} />
          ))}
        </dl>

        <div
          data-perf-band=""
          className="relative my-6 aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-concrete sm:aspect-[21/9] lg:my-10"
        >
          <div
            data-perf-band-inner=""
            data-parallax={bandParallax ? "" : undefined}
            className={cn("absolute inset-y-0", bandParallax ? "-inset-x-[8%]" : "inset-x-0")}
          >
            <ArtImage
              asset={images.performanceTrack}
              alt={t.alt.performanceTrack}
              sizes="(min-width: 1600px) 1700px, 110vw"
            />
          </div>
        </div>

        <dl>
          {figures.slice(2).map((figure) => (
            <FigureRow key={figure.id} {...figure} />
          ))}
        </dl>

        <p className="mt-10 max-w-[64ch] border-t border-ink/20 pt-6 text-[0.9375rem] leading-relaxed text-stone">
          {t.performance.source}
        </p>
      </div>
    </section>
  );
}
