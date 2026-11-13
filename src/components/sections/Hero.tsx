"use client";

import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { images } from "@/data/image-assets";
import { specifications as spec } from "@/data/specifications";
import { EASE, MQ, gsap, reducedMotion, useGSAP } from "@/lib/animations/gsap";
import { finishHeroIntro, registerHeroIntro } from "@/lib/animations/intro";
import { formatNumber } from "@/lib/i18n/format";
import { useI18n } from "@/lib/i18n/use-i18n";
import { ArtImage } from "@/components/ui/ArtImage";
import { Chars } from "@/components/ui/Split";

/**
 * Hero in three depth layers:
 *   1. atmospheric backdrop photograph
 *   2. the giant "PORSCHE" word — in front of the backdrop, behind the car
 *   3. the car itself, a transparent cut-out with its own floor shadow
 * Content sits on top: headline (left), lede + link (right), spec cards (bottom).
 */
export function Hero() {
  const { t, tag, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);

  const cards = [
    { label: t.specs.sprint, value: formatNumber(spec.sprint0to100, tag, 1), unit: "s" },
    { label: t.specs.power, value: formatNumber(spec.powerPs, tag), unit: "PS" },
    { label: t.specs.engine, value: formatNumber(spec.displacementL, tag, 1), unit: "l" },
    { label: t.specs.topSpeed, value: formatNumber(spec.topSpeedKmh, tag), unit: "km/h" },
  ];

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const header = document.querySelector("[data-header-inner]");
      const intro = gsap.timeline({ paused: true, onComplete: () => finishHeroIntro() });

      if (reducedMotion()) {
        intro.from([header, ...q("[data-hero-in]")], { autoAlpha: 0, duration: 0.5, stagger: 0.04 });
      } else {
        intro
          // 1 — the vehicle: backdrop opens, the word rises behind, the car drives in
          .fromTo(
            q("[data-hero-media]"),
            { clipPath: "inset(12% 8% 12% 8%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: EASE.curtain },
            0,
          )
          .from(q("[data-hero-media-inner]"), { scale: 1.25, duration: 2.2, ease: EASE.reveal }, 0)
          .from(
            q("[data-hero-word] [data-char]"),
            { yPercent: 110, duration: 1.2, ease: EASE.reveal, stagger: 0.05 },
            0.3,
          )
          .from(q("[data-hero-car]"), { xPercent: 18, autoAlpha: 0, duration: 1.7, ease: EASE.reveal }, 0.55)
          .from(q("[data-hero-floor]"), { scaleX: 0.3, autoAlpha: 0, duration: 1.4, ease: EASE.reveal }, 0.75)
          // 2 — headline
          .from(
            q("[data-hero-title] [data-char]"),
            { yPercent: 110, duration: 1, ease: EASE.reveal, stagger: 0.012 },
            0.75,
          )
          // 3 — supporting text
          .from(
            q("[data-hero-text]"),
            { autoAlpha: 0, y: 16, duration: 0.9, ease: EASE.reveal, stagger: 0.08 },
            1.0,
          )
          // 4 — header
          .from(header, { autoAlpha: 0, y: -16, duration: 0.9, ease: EASE.reveal }, 1.1)
          // 5 — CTA
          .from(q("[data-hero-cta]"), { autoAlpha: 0, y: 16, duration: 0.9, ease: EASE.reveal }, 1.2)
          // 6 — indicators
          .from(
            q("[data-hero-card]"),
            { autoAlpha: 0, y: 24, duration: 0.9, ease: EASE.reveal, stagger: 0.07 },
            1.3,
          )
          .from(q("[data-hero-scroll]"), { autoAlpha: 0, y: -10, duration: 0.8, ease: EASE.reveal }, 1.6);
      }
      const unregister = registerHeroIntro(intro);

      // Leaving the hero: depth layers separate — the backdrop sinks, the
      // word slides left, the car drives on to the right.
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.5 },
            defaults: { ease: "none" },
          })
          .to(q("[data-hero-parallax]"), { yPercent: 12, scale: 1.06 }, 0)
          .to(q("[data-hero-word-track]"), { xPercent: -10 }, 0)
          .to(q("[data-hero-car-track]"), { xPercent: 8, yPercent: -6 }, 0)
          .to(q("[data-hero-top]"), { y: -60, autoAlpha: 0 }, 0)
          .to(q("[data-hero-bottom]"), { y: 40, autoAlpha: 0 }, 0);
      });
      mm.add(MQ.mobile, () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: ref.current, start: "30% top", end: "bottom top", scrub: true },
            defaults: { ease: "none" },
          })
          .to(q("[data-hero-car-track]"), { xPercent: 12 }, 0)
          .to(q("[data-hero-bottom]"), { autoAlpha: 0 }, 0);
      });

      return () => {
        unregister();
        mm.revert();
      };
    },
    { scope: ref, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="top"
      data-tone="dark"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-screen-safe flex-col overflow-hidden bg-ink text-white"
    >
      {/* Layer 1 — backdrop */}
      <div data-hero-media="" data-hero-in="" className="absolute inset-0 -z-30">
        <div data-hero-parallax="" className="absolute inset-0">
          <div data-hero-media-inner="" className="absolute inset-0">
            <ArtImage asset={images.heroBackdrop} alt="" sizes="100vw" priority tone="dark" labelAt="none" />
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgb(10_10_10/0.6)_0%,rgb(10_10_10/0.05)_32%,rgb(10_10_10/0)_60%,rgb(10_10_10/0.55)_100%)]"
      />

      {/* Content — top block */}
      <div
        data-hero-top=""
        className="frame relative z-10 grid gap-6 pt-[calc(var(--header-h)+env(safe-area-inset-top)+1.75rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-start lg:pt-[calc(var(--header-h)+3rem)]"
      >
        <h1 id="hero-title" data-hero-title="" data-hero-in="">
          <span data-hero-text="" className="t-label mb-4 block text-accent">
            911 GT3 RS · {t.hero.eyebrow}
          </span>
          <span className="block max-w-[17ch] font-display text-[clamp(2rem,3.9vw,4.25rem)] font-bold uppercase leading-[0.95] tracking-[-0.025em] [font-stretch:112%]">
            <Chars text={t.hero.headline} />
          </span>
        </h1>
        <div className="flex flex-col gap-5 md:items-end md:pt-10 md:text-right">
          <p
            data-hero-text=""
            data-hero-in=""
            className="max-w-[34ch] text-[1.0625rem] leading-relaxed text-white/85"
          >
            {t.hero.lede}
          </p>
          <a
            href="#precision"
            data-hero-cta=""
            data-hero-in=""
            className="group inline-flex min-h-11 items-center gap-3 self-start border-b border-white/40 pb-1 font-display text-[0.9375rem] font-semibold [font-stretch:110%] transition-colors hover:border-white md:self-end"
          >
            {t.hero.cta}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45"
              strokeWidth={1.75}
            />
          </a>
        </div>
      </div>

      {/* Stage — the word (layer 2) behind the car (layer 3) */}
      <div className="relative min-h-[calc(var(--car-h)+3rem)] flex-1 [--car-h:calc(var(--car-w)/2.5)] [--car-w:min(96vw,34rem)] md:[--car-w:min(78vw,56rem)] lg:[--car-w:min(62vw,72rem)]">
        <div
          data-hero-word-track=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--car-h)*0.42)] -z-10 flex justify-center"
        >
          <span
            data-hero-word=""
            className="select-none whitespace-nowrap font-display text-[16vw] font-semibold uppercase leading-[0.8] tracking-[0.02em] text-white/[0.13] [font-stretch:112%]"
          >
            <Chars text="Porsche" />
          </span>
        </div>

        <div
          data-hero-car-track=""
          className="absolute inset-x-0 bottom-2 mx-auto h-[var(--car-h)] w-[var(--car-w)]"
        >
          <div data-hero-car="" data-hero-in="" className="absolute inset-0">
            <div
              data-hero-floor=""
              aria-hidden="true"
              className="absolute -bottom-[4%] left-[6%] right-[6%] h-[16%]"
            >
              {/* The child owns perspective; GSAP keeps ownership of the wrapper's scale. */}
              <span className="absolute inset-0 rotate-[7deg] rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(0_0_0/0.75)_0%,rgb(0_0_0/0.35)_45%,transparent_75%)]" />
            </div>
            <ArtImage
              asset={images.heroCar}
              alt={t.alt.heroCar}
              sizes="(min-width: 1024px) 62vw, (min-width: 768px) 78vw, 96vw"
              priority
              tone="dark"
              cutout
            />
          </div>
        </div>
      </div>

      {/* Content — indicators */}
      <div
        data-hero-bottom=""
        className="frame relative z-10 flex items-end justify-center gap-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 lg:pb-8"
      >
        <dl className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-4 sm:gap-3">
          {cards.map((card) => (
            <div
              key={card.label}
              data-hero-card=""
              data-hero-in=""
              className="flex flex-col gap-1 rounded-[3px] border border-white/12 bg-white/[0.07] px-4 py-2.5 backdrop-blur-md sm:min-w-[10.5rem] sm:gap-1.5 sm:py-3"
            >
              <dt className="t-label text-white/70">{card.label}</dt>
              <dd className="font-display text-[1.25rem] font-bold leading-none sm:text-[1.5rem] tracking-[-0.02em] [font-stretch:112%]">
                {card.value}
                <span className="text-[max(0.8125rem,0.55em)] font-semibold text-white/70"> {card.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
        <a
          href="#precision"
          data-hero-scroll=""
          data-hero-in=""
          className="absolute bottom-8 right-[var(--gutter)] hidden min-h-11 flex-col items-center gap-2 text-white/80 transition-colors hover:text-white xl:flex"
        >
          <span className="t-label">{t.hero.scroll}</span>
          <ArrowDown aria-hidden="true" className="size-4" strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
}
