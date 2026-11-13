"use client";

import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { images } from "@/data/image-assets";
import { EASE, ScrollTrigger, gsap, reducedMotion, useGSAP } from "@/lib/animations/gsap";
import { useI18n } from "@/lib/i18n/use-i18n";
import { ArtImage } from "@/components/ui/ArtImage";
import { CtaLink } from "@/components/ui/CtaLink";
import { Words } from "@/components/ui/Split";
import { PerformanceMark, buildMarkTimeline } from "@/components/brand/PerformanceMark";

export function Finale() {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const mark = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const frame = q("[data-final-frame]")[0];

      // Aperture: the closing photograph opens from the centre as it rises.
      if (!reducedMotion()) {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: frame, start: "top bottom", end: "center 55%", scrub: 0.6 },
          })
          .fromTo(frame ?? [], { clipPath: "inset(18% 26% 18% 26%)" }, { clipPath: "inset(0% 0% 0% 0%)" }, 0)
          .fromTo(q("[data-final-inner]"), { scale: 1.3 }, { scale: 1 }, 0);
      }

      // The signature is tied to the scroll: it draws as the visitor scrolls
      // down, rewinds (as if time ran backwards) on the way up, and draws
      // again on every return — leaving the section above resets it.
      const svg = mark.current;
      if (svg && !reducedMotion()) {
        ScrollTrigger.create({
          animation: buildMarkTimeline(svg, "full"),
          trigger: svg,
          start: "top 90%",
          end: "top 30%",
          scrub: 0.8,
        });
      }

      gsap
        .timeline({ scrollTrigger: { trigger: q("[data-final-copy]")[0], start: "top 85%", once: true } })
        .from(q("[data-final-copy] [data-word]"), {
          yPercent: 110,
          duration: 1,
          ease: EASE.reveal,
          stagger: 0.07,
        })
        .from(q("[data-final-cta]"), { opacity: 0, y: 16, duration: 0.8, stagger: 0.08 }, 0.4);
    },
    { scope: ref, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="final"
      data-tone="light"
      aria-labelledby="final-title"
      className="section-pad bg-concrete/60"
    >
      <div className="frame">
        <div className="mx-auto w-[min(56rem,100%)]">
          <PerformanceMark ref={mark} letterColor="#0a0a0a" title="GT3 RS — concept signature" />
        </div>

        <div
          data-final-frame=""
          className="relative mt-14 aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-ink sm:aspect-[16/9] lg:mt-20 lg:aspect-[21/9]"
        >
          <div data-final-inner="" className="absolute inset-0">
            <ArtImage
              asset={images.finaleRear}
              alt={t.alt.finaleRear}
              sizes="(min-width: 1600px) 1520px, 100vw"
              tone="dark"
            />
          </div>
        </div>

        <div
          data-final-copy=""
          className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
        >
          <div>
            <h2 id="final-title" className="t-headline max-w-[14ch]">
              <Words text={t.finale.title} />
            </h2>
            <p className="t-lede mt-5 max-w-[40ch] text-stone">{t.finale.lede}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div data-final-cta="">
              <CtaLink href="#showroom">{t.finale.ctaShowroom}</CtaLink>
            </div>
            <a
              data-final-cta=""
              href="#top"
              className="group inline-flex min-h-13 items-center gap-3 px-2 font-display text-[0.9375rem] font-semibold [font-stretch:110%]"
            >
              <ArrowUp
                aria-hidden="true"
                className="size-4 transition-transform duration-500 group-hover:-translate-y-1"
                strokeWidth={1.75}
              />
              <span className="sweep">{t.finale.ctaTop}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
