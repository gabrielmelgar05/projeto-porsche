"use client";

import { useRef } from "react";
import type { ImageAsset } from "@/types";
import { images, isAvailable } from "@/data/image-assets";
import { cn } from "@/lib/cn";
import { EASE, MQ, gsap, reducedMotion, useGSAP } from "@/lib/animations/gsap";
import { useI18n } from "@/lib/i18n/use-i18n";
import { ArtImage } from "@/components/ui/ArtImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Words } from "@/components/ui/Split";

/** Conceptual streamlines over the wing frame (16:10). Not CFD output. */
const airflow = [
  { d: "M-40 470 C 280 450 560 360 860 330 S 1360 300 1640 360", accent: false },
  { d: "M-40 520 C 300 505 600 420 900 395 S 1380 380 1640 420", accent: true },
  { d: "M-40 570 C 320 560 640 490 940 470 S 1400 460 1640 480", accent: false },
  { d: "M-40 405 C 260 390 520 300 820 262 S 1340 228 1640 300", accent: false },
  { d: "M-40 640 C 340 640 700 600 1000 590 S 1420 580 1640 560", accent: false },
];

function Fact({ title, text, big }: { title: string; text: string; big?: string }) {
  return (
    <div data-aero-fact="" className="relative pt-6">
      <span data-fact-line="" aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/25" />
      <h3 data-fact-text="" className="t-label text-accent">
        {title}
      </h3>
      {big ? (
        <p
          data-fact-text=""
          className="mt-3 font-display text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.04em] [font-stretch:118%]"
        >
          {big}
        </p>
      ) : null}
      <p data-fact-text="" className="mt-3 max-w-[40ch] text-[1.0625rem] leading-relaxed text-white/80">
        {text}
      </p>
    </div>
  );
}

/** Portrait with parallax — only once the real photograph exists. */
function Portrait({ asset, alt, className }: { asset: ImageAsset; alt: string; className?: string }) {
  const parallax = isAvailable(asset);
  return (
    <div
      data-aero-portrait={parallax ? "" : undefined}
      className={cn("relative aspect-[4/5] overflow-hidden rounded-[var(--radius)]", className)}
    >
      <div
        data-aero-portrait-inner=""
        className={cn("absolute inset-x-0", parallax ? "-inset-y-[8%]" : "inset-y-0")}
      >
        <ArtImage
          asset={asset}
          alt={alt}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          tone="dark"
        />
      </div>
    </div>
  );
}

export function Aerodynamics() {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const facts = t.aero.facts;

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const once = (trigger: Element | undefined, start = "top 82%") => ({ trigger, start, once: true });

      // Headline slides in on the slant, like air over a surface.
      gsap.from(q("[data-aero-title] [data-word]"), {
        xPercent: -30,
        skewX: 14,
        autoAlpha: 0,
        duration: 1.1,
        ease: EASE.reveal,
        stagger: 0.07,
        scrollTrigger: once(q("[data-aero-title]")[0]),
      });
      gsap.from(q("[data-aero-lede]"), {
        autoAlpha: 0,
        y: 20,
        duration: 0.9,
        scrollTrigger: once(q("[data-aero-lede]")[0]),
      });

      // Wing frame: opens from the left, the photograph settles.
      const frame = q("[data-aero-frame]")[0];
      gsap
        .timeline({ scrollTrigger: once(frame, "top 75%") })
        .fromTo(
          frame ?? [],
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: EASE.curtain },
        )
        .from(q("[data-aero-frame-inner]"), { scale: 1.2, duration: 1.8, ease: EASE.reveal }, 0.1)
        .from(q("[data-aero-concept]"), { autoAlpha: 0, x: -12, duration: 0.6 }, 0.9);

      // Streamlines are drawn by the scroll.
      const lines = q<SVGPathElement>("[data-airflow]");
      if (reducedMotion()) {
        gsap.set(lines, { strokeDashoffset: 0 });
      } else {
        lines.forEach((line) => {
          const length = line.getTotalLength();
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.to(lines, {
          strokeDashoffset: 0,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: frame, start: "top 70%", end: "bottom 45%", scrub: 0.8 },
        });
      }

      // Facts: hairline draws, then the copy.
      q("[data-aero-fact]").forEach((fact) => {
        gsap
          .timeline({ scrollTrigger: once(fact, "top 88%") })
          .from(fact.querySelector("[data-fact-line]"), {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
            ease: EASE.curtain,
          })
          .from(
            fact.querySelectorAll("[data-fact-text]"),
            { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.06 },
            0.3,
          );
      });

      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        q("[data-aero-portrait]").forEach((portrait, i) => {
          gsap.fromTo(
            portrait.querySelector("[data-aero-portrait-inner]"),
            { yPercent: i === 0 ? -7 : 7 },
            {
              yPercent: i === 0 ? 7 : -7,
              ease: "none",
              scrollTrigger: { trigger: portrait, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="aerodynamics"
      data-tone="dark"
      aria-labelledby="aero-title"
      className="section-pad relative overflow-hidden bg-graphite text-white"
    >
      <div className="frame grid-12 gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <Eyebrow className="text-white/70">{t.aero.eyebrow}</Eyebrow>
          <h2 id="aero-title" data-aero-title="" className="t-headline mt-6 max-w-[12ch]">
            <Words text={t.aero.title} />
          </h2>
        </div>
        <p
          data-aero-lede=""
          className="t-lede col-span-4 max-w-[36ch] self-end text-white/80 md:col-span-6 lg:col-span-4 lg:col-start-9"
        >
          {t.aero.lede}
        </p>
      </div>

      <div className="frame mt-12 lg:mt-20">
        <figure
          data-aero-frame=""
          className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-ink sm:aspect-[16/10]"
        >
          <div data-aero-frame-inner="" className="absolute inset-0">
            <ArtImage
              asset={images.aeroWing}
              alt={t.alt.aeroWing}
              sizes="(min-width: 1600px) 1520px, 100vw"
              tone="dark"
            />
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 1600 1000"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 size-full"
          >
            {airflow.map((line) => (
              <path
                key={line.d}
                data-airflow=""
                d={line.d}
                fill="none"
                stroke={line.accent ? "#c8102e" : "rgba(255,255,255,0.55)"}
                strokeWidth={line.accent ? 2.5 : 1.4}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <figcaption
            data-aero-concept=""
            className="t-label absolute left-4 top-4 bg-ink/80 px-3 py-2 text-white/90 sm:left-6 sm:top-6"
          >
            {t.aero.concept}
          </figcaption>
        </figure>
      </div>

      <div className="frame grid-12 mt-14 gap-y-12 lg:mt-24">
        <Portrait
          asset={images.aeroSplitter}
          alt={t.alt.aeroSplitter}
          className="col-span-4 md:col-span-4 lg:col-span-4"
        />
        <div className="col-span-4 flex flex-col gap-10 md:col-span-4 lg:col-span-6 lg:col-start-6 lg:justify-center">
          <Fact title={facts.wing.title} text={facts.wing.text} />
          <Fact title={facts.drs.title} text={facts.drs.text} />
        </div>

        <div className="col-span-4 flex flex-col gap-10 md:col-span-4 lg:col-span-6 lg:mt-8">
          <Fact title={facts.downforce.title} text={facts.downforce.text} big="860 kg" />
          <Fact title={facts.carbon.title} text={facts.carbon.text} />
          <Fact title={facts.axle.title} text={facts.axle.text} />
        </div>
        <Portrait
          asset={images.aeroCarbon}
          alt={t.alt.aeroCarbon}
          className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-9 lg:mt-24"
        />
      </div>
    </section>
  );
}
