"use client";

import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { images } from "@/data/image-assets";
import { EASE, MQ, gsap, reducedMotion, useGSAP } from "@/lib/animations/gsap";
import { finishHeroIntro, registerHeroIntro } from "@/lib/animations/intro";
import { useI18n } from "@/lib/i18n/use-i18n";
import { ArtImage } from "@/components/ui/ArtImage";
import { Chars } from "@/components/ui/Split";

/** A single composed road photograph, with responsive art direction and the original intro hand-off. */
export function Hero() {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const header = document.querySelector("[data-header-inner]");
      const intro = gsap.timeline({ paused: true, onComplete: () => finishHeroIntro() });

      if (reducedMotion()) {
        intro.fromTo(
          [...q("[data-hero-media]"), header, ...q("[data-hero-in]")],
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.35, stagger: 0.05 },
        );
      } else {
        intro
          .fromTo(
            q("[data-hero-media]"),
            { clipPath: "inset(5% 3% 5% 3%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.35, ease: EASE.curtain },
            0,
          )
          .from(q("[data-hero-media-inner]"), { scale: 1.055, duration: 1.9, ease: EASE.reveal }, 0)
          .from(header, { autoAlpha: 0, y: -12, duration: 0.85, ease: EASE.reveal }, 0.22)
          .from(
            q("[data-hero-title] [data-char]"),
            { yPercent: 110, duration: 1, ease: EASE.reveal, stagger: 0.018 },
            0.42,
          )
          .from(q("[data-hero-lede]"), { autoAlpha: 0, y: 12, duration: 0.85, ease: EASE.reveal }, 0.82)
          .from(q("[data-hero-cta]"), { autoAlpha: 0, y: 12, duration: 0.85, ease: EASE.reveal }, 1.02)
          .from(q("[data-hero-bottom]"), { autoAlpha: 0, y: 10, duration: 0.85, ease: EASE.reveal }, 1.16);
      }
      const unregister = registerHeroIntro(intro);
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.65 },
            defaults: { ease: "none" },
          })
          .to(q("[data-hero-parallax]"), { yPercent: 5, scale: 1.035 }, 0)
          .to(q("[data-hero-copy]"), { y: -42, autoAlpha: 0 }, 0)
          .to(q("[data-hero-bottom]"), { autoAlpha: 0 }, 0);
      });
      mm.add(MQ.mobile, () => {
        gsap.to(q("[data-hero-copy], [data-hero-bottom]"), {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "25% top", end: "bottom top", scrub: true },
        });
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
      className="relative isolate flex min-h-[max(100svh,44rem)] flex-col overflow-hidden bg-ink text-white"
    >
      <div data-hero-media="" className="absolute inset-0 -z-20">
        <div data-hero-parallax="" className="absolute inset-0">
          <div data-hero-media-inner="" className="absolute inset-0">
            <ArtImage
              asset={images.heroRoad}
              alt={t.alt.heroRoad}
              sizes="100vw"
              priority
              tone="dark"
              labelAt="none"
            />
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_10_10/0.70)_0%,rgb(10_10_10/0.48)_40%,rgb(10_10_10/0.02)_65%,rgb(10_10_10/0.05)_82%,rgb(10_10_10/0.60)_100%)]"
      />

      <div
        data-hero-copy=""
        className="hero-copy frame relative z-10 flex flex-col items-center pt-[calc(var(--header-h)+3.5rem)] text-center sm:pt-[calc(var(--header-h)+4.5rem)] lg:pt-[calc(var(--header-h)+5rem)]"
      >
        <h1
          id="hero-title"
          data-hero-title=""
          data-hero-in=""
          className="max-w-[18ch] font-display text-[clamp(2.75rem,6vw,6.25rem)] font-semibold uppercase leading-[0.94] tracking-[-0.04em] [font-stretch:112%]"
        >
          <Chars text={t.hero.headline} />
        </h1>
        <p
          data-hero-lede=""
          data-hero-in=""
          className="mt-5 max-w-[31ch] text-[1rem] leading-relaxed text-white sm:max-w-[46ch] sm:text-[1.125rem]"
        >
          {t.hero.lede}
        </p>
        <a
          href="#showroom"
          data-hero-cta=""
          data-hero-in=""
          className="group relative mt-7 inline-flex min-h-12 items-center justify-center gap-4 overflow-hidden rounded-[7px] border border-white/60 bg-white px-5 py-3 font-display text-[0.9375rem] font-semibold text-ink shadow-[0_8px_32px_rgb(0_0_0/0.08)] sm:mt-8 sm:px-6"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-red transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
          <span className="relative transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
            {t.hero.cta}
          </span>
          <ArrowRight
            aria-hidden="true"
            className="relative size-4 transition-[translate,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-white"
            strokeWidth={1.75}
          />
        </a>
      </div>

      <div
        data-hero-bottom=""
        data-hero-in=""
        className="frame relative z-10 mt-auto flex items-end justify-between gap-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10 lg:pb-8"
      >
        <p className="flex flex-col gap-2">
          <span className="font-display text-[1rem] font-semibold tracking-[0.04em]">911 GT3 RS</span>
          <span className="t-label max-w-[24ch] text-white/85">{t.hero.eyebrow}</span>
        </p>
        <a href="#precision" className="group inline-flex min-h-11 items-center gap-3 text-white">
          <span className="t-label hidden sm:block">{t.hero.scroll}</span>
          <span className="grid size-11 place-items-center rounded-full border border-white/45 transition-colors hover:bg-white/15">
            <ArrowDown
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-y-0.5"
              strokeWidth={1.5}
            />
          </span>
          <span className="sr-only sm:hidden">{t.hero.scroll}</span>
        </a>
      </div>
    </section>
  );
}
