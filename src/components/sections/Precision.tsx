"use client";

import { useRef } from "react";
import { images } from "@/data/image-assets";
import { EASE, MQ, gsap, useGSAP } from "@/lib/animations/gsap";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";
import { ArtImage } from "@/components/ui/ArtImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Words } from "@/components/ui/Split";

const frames = [
  { asset: images.precisionSide, alt: "precisionSide" },
  { asset: images.precisionBrake, alt: "precisionBrake" },
  { asset: images.precisionWing, alt: "precisionWing" },
] as const;

/**
 * Desktop: one pinned scene. Three photographs replace each other through
 * masks while the framing shifts, in step with three short chapters.
 * Mobile: chapters stack, each photograph revealed as it arrives.
 */
export function Precision() {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      // Headline: words rise in sequence as the section arrives.
      gsap.from(q("[data-precision-title] [data-word]"), {
        yPercent: 110,
        duration: 1,
        ease: EASE.reveal,
        stagger: 0.06,
        scrollTrigger: { trigger: q("[data-precision-title]")[0], start: "top 85%", once: true },
      });

      mm.add(MQ.desktop, () => {
        const layers = q("[data-precision-layer]");
        const inners = q("[data-precision-layer] [data-precision-inner]");
        const chapters = q("[data-chapter]");
        const rail = q("[data-precision-rail]")[0];

        gsap.set(layers.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        // Inactive chapters recede in colour, not opacity — they stay ≥ 4.5:1.
        const DIM = { "--ch-label": "#5c5a55", "--ch-text": "#5c5a55" };
        const LIT = { "--ch-label": "#c8102e", "--ch-text": "#0a0a0a" };
        gsap.set(chapters.slice(1), DIM);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q("[data-precision-pin]")[0],
            start: "top top",
            end: "+=220%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Chapter 1 — slow push-in on the profile.
        tl.fromTo(inners[0] ?? [], { scale: 1.18, xPercent: -4 }, { scale: 1, xPercent: 0, duration: 1 }, 0)
          .to(rail ?? [], { scaleY: 1 / 3, duration: 1 }, 0)
          // Chapter 2 — the brake detail wipes up over it.
          .to(layers[1] ?? [], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE.curtain }, 1)
          .fromTo(
            inners[1] ?? [],
            { scale: 1.3, yPercent: 6 },
            { scale: 1.05, yPercent: 0, duration: 1.4 },
            1,
          )
          .to(chapters[0] ?? [], { ...DIM, duration: 0.3 }, 1.1)
          .to(chapters[1] ?? [], { ...LIT, duration: 0.3 }, 1.1)
          .to(rail ?? [], { scaleY: 2 / 3, duration: 1 }, 1)
          // Chapter 3 — the wing silhouette opens from the right.
          .fromTo(
            layers[2] ?? [],
            { clipPath: "inset(0% 0% 0% 100%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE.curtain },
            2.2,
          )
          .fromTo(inners[2] ?? [], { scale: 1.2, xPercent: 6 }, { scale: 1, xPercent: 0, duration: 1.2 }, 2.2)
          .to(chapters[1] ?? [], { ...DIM, duration: 0.3 }, 2.3)
          .to(chapters[2] ?? [], { ...LIT, duration: 0.3 }, 2.3)
          .to(rail ?? [], { scaleY: 1, duration: 1 }, 2.2);
      });

      mm.add(MQ.mobile, () => {
        q("[data-chapter-card]").forEach((card) => {
          const media = card.querySelector("[data-chapter-media]");
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 80%", once: true } })
            .fromTo(
              media,
              { clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: EASE.curtain },
            )
            .from(
              card.querySelectorAll("[data-chapter-text]"),
              { autoAlpha: 0, y: 16, duration: 0.8, ease: EASE.reveal },
              0.4,
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
      id="precision"
      data-tone="light"
      aria-labelledby="precision-title"
      className="relative bg-paper"
    >
      {/* ── Desktop: pinned scene ─────────────────────────── */}
      <div data-precision-pin="" className="hidden h-screen-safe lg:block">
        <div className="frame grid-12 h-full items-center gap-y-0 pb-10 pt-[calc(var(--header-h)+2rem)]">
          <div className="col-span-5 flex h-full flex-col justify-between py-4">
            <div>
              <Eyebrow className="text-stone">{t.precision.eyebrow}</Eyebrow>
              <h2 id="precision-title" data-precision-title="" className="t-headline mt-6 max-w-[11ch]">
                <Words text={t.precision.title} />
              </h2>
            </div>
            <div className="flex gap-6">
              <div aria-hidden="true" className="relative w-px shrink-0 bg-ink/15">
                <span data-precision-rail="" className="absolute inset-0 origin-top scale-y-0 bg-red" />
              </div>
              <ol className="flex flex-col gap-7">
                {t.precision.chapters.map((chapter) => (
                  <li key={chapter.label} data-chapter="">
                    <p className="t-label text-[var(--ch-label,var(--accent-text))]">{chapter.label}</p>
                    <p className="mt-2 max-w-[38ch] text-[1.0625rem] leading-relaxed text-[var(--ch-text,inherit)]">
                      {chapter.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="relative col-span-7 col-start-6 h-[min(78svh,52rem)] overflow-hidden rounded-[var(--radius)] bg-concrete">
            {frames.map((frame, i) => (
              <div
                key={frame.alt}
                data-precision-layer=""
                className={cn("absolute inset-0 overflow-hidden", i > 0 && "z-10")}
              >
                <div data-precision-inner="" className="absolute inset-0">
                  <ArtImage
                    asset={frame.asset}
                    alt={t.alt[frame.alt]}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile / tablet: stacked chapters ─────────────── */}
      <div className="frame section-pad lg:hidden">
        <Eyebrow className="text-stone">{t.precision.eyebrow}</Eyebrow>
        {/* Only one of the two headings is ever displayed (and exposed) at a time. */}
        <h2 className="t-headline mt-6 max-w-[12ch]">{t.precision.title}</h2>
        <ol className="mt-12 flex flex-col gap-14">
          {t.precision.chapters.map((chapter, i) => (
            <li key={chapter.label} data-chapter-card="">
              <div
                data-chapter-media=""
                className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-concrete"
              >
                <ArtImage asset={frames[i]!.asset} alt={t.alt[frames[i]!.alt]} sizes="100vw" />
              </div>
              <p data-chapter-text="" className="t-label mt-5 text-accent">
                {chapter.label}
              </p>
              <p data-chapter-text="" className="mt-2 max-w-[40ch] text-[1.0625rem] leading-relaxed">
                {chapter.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
