"use client";

import { useRef } from "react";
import type { ImageAsset } from "@/types";
import { images, isAvailable } from "@/data/image-assets";
import { EASE, MQ, gsap, useGSAP } from "@/lib/animations/gsap";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";
import { ArtImage } from "@/components/ui/ArtImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Words } from "@/components/ui/Split";

type PanelId = "cockpit" | "wheel" | "seats" | "clubsport";

const panels: ReadonlyArray<{
  id: PanelId;
  asset: ImageAsset;
  alt: "interiorCockpit" | "interiorWheel" | "interiorSeats" | "interiorClubsport";
  wide?: boolean;
}> = [
  { id: "cockpit", asset: images.interiorCockpit, alt: "interiorCockpit", wide: true },
  { id: "wheel", asset: images.interiorWheel, alt: "interiorWheel" },
  { id: "seats", asset: images.interiorSeats, alt: "interiorSeats" },
  { id: "clubsport", asset: images.interiorClubsport, alt: "interiorClubsport" },
];

/**
 * A journey through the cabin, distinct from the exterior gallery.
 * Desktop: the section pins and the panels travel sideways under a fixed
 * title. Mobile: a native horizontal scroller with snap points.
 */
export function Interior() {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.from(q("[data-int-title] [data-word]"), {
        yPercent: 110,
        duration: 1,
        ease: EASE.reveal,
        stagger: 0.06,
        scrollTrigger: { trigger: q("[data-int-title]")[0], start: "top 85%", once: true },
      });

      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const track = q("[data-int-track]")[0];
        const viewport = q("[data-int-viewport]")[0];
        if (!track || !viewport) return;
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-int-pin]")[0],
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Inside the travelling track: photographs drift, captions rise as they enter.
        q("[data-int-panel]").forEach((panel) => {
          const inner = panel.querySelector("[data-int-parallax]");
          if (inner) {
            gsap.fromTo(
              inner,
              { xPercent: -8 },
              {
                xPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: travel,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          }
          gsap.from(panel.querySelectorAll("[data-int-caption]"), {
            autoAlpha: 0,
            y: 18,
            duration: 0.8,
            ease: EASE.reveal,
            stagger: 0.06,
            scrollTrigger: { trigger: panel, containerAnimation: travel, start: "left 80%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="interior"
      data-tone="dark"
      aria-labelledby="interior-title"
      className="relative bg-graphite text-white"
    >
      <div
        data-int-pin=""
        className="section-pad lg:grid lg:h-screen-safe lg:grid-cols-[minmax(20rem,30vw)_minmax(0,1fr)] lg:items-center lg:gap-[var(--gap)] lg:py-0 lg:pl-[max(var(--gutter),calc((100vw-var(--frame-max))/2+var(--gutter)))]"
      >
        <div className="px-[var(--gutter)] lg:px-0">
          <Eyebrow className="text-white/70">{t.interior.eyebrow}</Eyebrow>
          <h2
            id="interior-title"
            data-int-title=""
            className="t-headline mt-6 max-w-[12ch] lg:text-[clamp(2.5rem,3.9vw,4.5rem)]"
          >
            <Words text={t.interior.title} />
          </h2>
          <p className="t-label mt-8 hidden text-white/60 lg:block">{t.interior.dragHint} →</p>
        </div>

        <div
          data-int-viewport=""
          className="mt-10 overflow-x-auto overscroll-x-contain lg:mt-0 lg:h-full lg:overflow-hidden"
        >
          <ul
            data-int-track=""
            className="flex snap-x snap-mandatory gap-4 px-[var(--gutter)] pb-4 lg:h-full lg:snap-none lg:items-center lg:gap-8 lg:px-0 lg:pb-0 lg:pr-[var(--gutter)]"
          >
            {panels.map((panel) => {
              const parallax = isAvailable(panel.asset);
              return (
                <li
                  key={panel.id}
                  data-int-panel=""
                  className={cn(
                    "shrink-0 snap-start",
                    panel.wide ? "w-[86vw] sm:w-[70vw] lg:w-[54vw]" : "w-[72vw] sm:w-[44vw] lg:w-[24vw]",
                  )}
                >
                  <figure>
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-[var(--radius)] bg-ink",
                        panel.wide ? "aspect-[4/3] lg:aspect-[16/10]" : "aspect-[4/5]",
                      )}
                    >
                      <div
                        data-int-parallax={parallax ? "" : undefined}
                        className={cn("absolute inset-y-0", parallax ? "-inset-x-[10%]" : "inset-x-0")}
                      >
                        <ArtImage
                          asset={panel.asset}
                          alt={t.alt[panel.alt]}
                          sizes={
                            panel.wide ? "(min-width: 1024px) 54vw, 86vw" : "(min-width: 1024px) 24vw, 72vw"
                          }
                          tone="dark"
                        />
                      </div>
                    </div>
                    <figcaption className="mt-5 max-w-[34ch]">
                      <span data-int-caption="" className="t-label block text-accent">
                        {t.interior.panels[panel.id].title}
                      </span>
                      <span
                        data-int-caption=""
                        className="mt-2 block text-[1.0625rem] leading-relaxed text-white/80"
                      >
                        {t.interior.panels[panel.id].text}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
