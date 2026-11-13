"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { SceneId } from "@/types";
import { hotspots } from "@/data/hotspots";
import { EASE, gsap, useGSAP } from "@/lib/animations/gsap";
import { useI18n } from "@/lib/i18n/use-i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Words } from "@/components/ui/Split";
import { HotspotPanel } from "@/components/hotspots/HotspotPanel";
import { HotspotScene } from "@/components/hotspots/HotspotScene";

export function HotspotsSection() {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [scene, setScene] = useState<SceneId>("front34");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => {
    setScene(hotspots[index]!.scene);
    setOpenIndex(index);
  }, []);

  // Panel navigation keeps the scene behind it in sync.
  const navigate = useCallback((index: number) => {
    setScene(hotspots[index]!.scene);
    setOpenIndex(index);
  }, []);

  // On close, focus returns to the marker of the detail that was showing.
  const close = useCallback(() => {
    setOpenIndex((index) => {
      if (index !== null) {
        const id = hotspots[index]!.id;
        requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-hotspot="${id}"]`)?.focus());
      }
      return null;
    });
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%", once: true } })
        .from(q("[data-hs-title] [data-word]"), {
          yPercent: 110,
          rotate: 4,
          duration: 1,
          ease: EASE.reveal,
          stagger: 0.08,
        })
        .from(q("[data-hs-lede]"), { autoAlpha: 0, y: 16, duration: 0.8 }, 0.3)
        .from(q("[data-hs-stage]"), { opacity: 0, y: 40, duration: 1.1, ease: EASE.reveal }, 0.35);
      // Interactive content animates opacity only — it stays focusable while hidden.
      gsap.from(q("[data-hs-item]"), {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: EASE.reveal,
        stagger: 0.05,
        scrollTrigger: { trigger: q("[data-hs-list]")[0], start: "top 88%", once: true },
      });
    },
    { scope: ref, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="details"
      data-tone="dark"
      aria-labelledby="details-title"
      className="section-pad relative bg-ink text-white"
    >
      <div className="frame">
        <div className="grid-12 gap-y-6">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <Eyebrow className="text-white/70">{t.hotspots.eyebrow}</Eyebrow>
            <h2 id="details-title" data-hs-title="" className="t-headline mt-6">
              <Words text={t.hotspots.title} />
            </h2>
          </div>
          <p
            data-hs-lede=""
            className="t-lede col-span-4 max-w-[38ch] self-end text-white/80 md:col-span-6 lg:col-span-5 lg:col-start-8"
          >
            {t.hotspots.lede}
          </p>
        </div>

        <div data-hs-stage="" className="mt-10 lg:mt-14">
          <HotspotScene scene={scene} onSceneChange={setScene} onOpen={open} />
        </div>

        <div data-hs-list="" className="mt-12">
          <h3 className="t-label text-white/70">{t.hotspots.listTitle}</h3>
          <ol className="mt-4 grid grid-cols-1 border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {hotspots.map((spot, index) => (
              <li
                key={spot.id}
                data-hs-item=""
                className="border-b border-white/15 sm:odd:border-r lg:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <button
                  type="button"
                  onClick={() => open(index)}
                  className="group flex min-h-16 w-full cursor-pointer items-center justify-between gap-4 px-1 py-4 text-left transition-colors hover:text-accent sm:px-4"
                >
                  <span className="text-[1.0625rem] font-medium">{t.hotspots.items[spot.id].title}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 shrink-0 transition-transform duration-500 group-hover:rotate-45"
                    strokeWidth={1.5}
                  />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <HotspotPanel index={openIndex} onNavigate={navigate} onClose={close} />
    </section>
  );
}
