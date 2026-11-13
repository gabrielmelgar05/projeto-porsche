"use client";

import { useCallback, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { hotspots } from "@/data/hotspots";
import { EASE, gsap, reducedMotion, useGSAP } from "@/lib/animations/gsap";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/lib/i18n/use-i18n";
import { ArtImage } from "@/components/ui/ArtImage";

interface HotspotPanelProps {
  /** Index into `hotspots`, or null when closed. */
  index: number | null;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

/**
 * Editorial detail panel on a modal <dialog>: large photograph, counter,
 * title, copy, previous / next. Escape and the close button animate out;
 * the section then returns focus to the matching marker.
 */
export function HotspotPanel({ index, onNavigate, onClose }: HotspotPanelProps) {
  const { t } = useI18n();
  const dialog = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const spot = index !== null ? hotspots[index] : null;
  const total = hotspots.length;

  useScrollLock(open);

  const mobile = () => window.matchMedia("(max-width: 767.98px)").matches;

  useEffect(() => {
    const el = dialog.current;
    if (!el || !open || el.open) return;
    el.showModal();
    if (reducedMotion()) return;
    gsap.fromTo(
      el.querySelector("[data-panel-scrim]"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: "none" },
    );
    gsap.fromTo(
      el.querySelector("[data-panel-sheet]"),
      mobile() ? { yPercent: 100, xPercent: 0 } : { xPercent: 100, yPercent: 0 },
      { xPercent: 0, yPercent: 0, duration: 0.8, ease: EASE.curtain },
    );
  }, [open]);

  // Content change inside an open panel: photograph wipes, copy follows.
  useGSAP(
    () => {
      const el = dialog.current;
      if (!el || index === null || reducedMotion()) return;
      gsap.fromTo(
        el.querySelector("[data-panel-media]"),
        { clipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE.curtain },
      );
      gsap.fromTo(
        el.querySelectorAll("[data-panel-copy]"),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.reveal, stagger: 0.06, delay: 0.2 },
      );
    },
    { scope: dialog, dependencies: [index] },
  );

  const close = useCallback(() => {
    const el = dialog.current;
    if (!el?.open) return;
    const done = () => {
      el.close();
      onClose();
    };
    if (reducedMotion()) return done();
    gsap.to(el.querySelector("[data-panel-scrim]"), { autoAlpha: 0, duration: 0.4, ease: "none" });
    gsap.to(el.querySelector("[data-panel-sheet]"), {
      ...(mobile() ? { yPercent: 100 } : { xPercent: 100 }),
      duration: 0.55,
      ease: EASE.curtain,
      onComplete: done,
    });
  }, [onClose]);

  const go = (step: -1 | 1) => {
    if (index === null) return;
    onNavigate((index + step + total) % total);
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="hotspot-panel-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
      className="m-0 h-dvh w-screen bg-transparent p-0 backdrop:bg-transparent"
    >
      <div data-panel-scrim="" aria-hidden="true" onClick={close} className="absolute inset-0 bg-ink/70" />
      <div
        data-panel-sheet=""
        data-surface="light"
        className="absolute inset-x-0 bottom-0 top-[max(3rem,env(safe-area-inset-top))] flex flex-col overflow-y-auto bg-mineral text-ink md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[min(38rem,48vw)]"
      >
        {spot ? (
          <>
            <div
              data-panel-media=""
              className="relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-concrete"
            >
              <ArtImage
                asset={spot.detail}
                alt={t.alt[spot.detail.id as keyof typeof t.alt]}
                sizes="(min-width: 768px) 48vw, 100vw"
              />
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={t.hotspots.close}
              className="absolute right-4 top-4 z-10 grid size-12 cursor-pointer place-items-center rounded-full bg-white text-ink shadow-md transition-colors hover:bg-red hover:text-white"
            >
              <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </button>

            <div className="flex flex-1 flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 md:px-10 md:pt-10">
              <p data-panel-copy="" className="t-label text-accent">
                {fill(t.hotspots.counter, { index: index! + 1, total })}
              </p>
              <h3
                id="hotspot-panel-title"
                data-panel-copy=""
                className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.025em] [font-stretch:110%]"
              >
                {t.hotspots.items[spot.id].title}
              </h3>
              <p data-panel-copy="" className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed text-stone">
                {t.hotspots.items[spot.id].text}
              </p>

              <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t.hotspots.previous}
                  className="grid size-12 cursor-pointer place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t.hotspots.next}
                  className="grid size-12 cursor-pointer place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </dialog>
  );
}
