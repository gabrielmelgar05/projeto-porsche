"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaintId } from "@/types";
import { views } from "@/data/gallery";
import { showroomImage } from "@/data/image-assets";
import { EASE, gsap, reducedMotion, useGSAP } from "@/lib/animations/gsap";
import { useSwipe } from "@/hooks/use-swipe";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";
import { ArtImage } from "@/components/ui/ArtImage";
import { PaintSelector } from "./PaintSelector";

interface Layer {
  key: number;
  index: number;
  paint: PaintId;
  direction: -1 | 0 | 1;
}

export function Showroom() {
  const { t } = useI18n();
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef(0);
  const [layers, setLayers] = useState<Layer[]>([{ key: 0, index: 0, paint: "white", direction: 0 }]);
  const [announcement, setAnnouncement] = useState("");

  const current = layers[layers.length - 1]!;
  const viewName = (index: number) => t.showroom.views[views[index]!];

  const show = useCallback(
    (index: number, paint: PaintId, direction: -1 | 0 | 1) => {
      setLayers((previous) => {
        const top = previous[previous.length - 1]!;
        if (top.index === index && top.paint === paint) return previous;
        counter.current += 1;
        return [...previous.slice(-1), { key: counter.current, index, paint, direction }];
      });
      setAnnouncement(
        fill(t.showroom.announce, {
          view: t.showroom.views[views[index]!],
          index: index + 1,
          total: views.length,
        }),
      );
    },
    [t],
  );

  const step = useCallback(
    (direction: -1 | 1) => {
      const next = (current.index + direction + views.length) % views.length;
      show(next, current.paint, direction);
    },
    [current.index, current.paint, show],
  );

  useSwipe(stage, step);

  // Transition between the outgoing and incoming layers.
  useGSAP(
    () => {
      if (layers.length < 2) return;
      const [outgoing, incoming] = layers;
      const q = gsap.utils.selector(stage);
      const outEl = q(`[data-layer="${outgoing!.key}"]`)[0];
      const inEl = q(`[data-layer="${incoming!.key}"]`)[0];
      if (!outEl || !inEl) return;
      const done = () => setLayers((previous) => previous.filter((layer) => layer.key !== outgoing!.key));

      if (reducedMotion() || incoming!.direction === 0) {
        gsap.fromTo(
          inEl,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: reducedMotion() ? 0.15 : 0.5, ease: "none", onComplete: done },
        );
        return;
      }
      const dir = incoming!.direction;
      gsap.fromTo(
        inEl,
        { clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: EASE.curtain, onComplete: done },
      );
      gsap.fromTo(
        inEl.querySelector("[data-layer-inner]"),
        { scale: 1.08, xPercent: 4 * dir },
        { scale: 1, xPercent: 0, duration: 1.2, ease: EASE.reveal },
      );
      gsap.to(outEl.querySelector("[data-layer-inner]"), {
        xPercent: -6 * dir,
        duration: 0.9,
        ease: EASE.curtain,
      });
    },
    { scope: stage, dependencies: [layers] },
  );

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <PaintSelector value={current.paint} onChange={(paint) => show(current.index, paint, 0)} />
        <p className="t-label hidden text-stone md:block">{t.showroom.hintKeys}</p>
        <p className="t-label text-stone md:hidden">{t.showroom.hintSwipe}</p>
      </div>

      <div
        ref={stage}
        role="group"
        aria-roledescription="carousel"
        aria-label={t.showroom.title}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
        className="relative mx-auto mt-6 aspect-[16/9] w-full max-w-[calc(70svh*16/9)] touch-pan-y overflow-hidden rounded-[var(--radius)] bg-concrete"
      >
        {layers.map((layer) => (
          <div key={layer.key} data-layer={layer.key} className="absolute inset-0 overflow-hidden">
            <div data-layer-inner="" className="absolute inset-0">
              <ArtImage
                asset={showroomImage(layer.paint, views[layer.index]!)}
                alt={fill(t.showroom.alt, {
                  paint: t.showroom.paints[layer.paint].toLowerCase(),
                  view: viewName(layer.index).toLowerCase(),
                })}
                sizes="(min-width: 1024px) 80vw, 100vw"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div className="mx-auto mt-5 flex w-full max-w-[calc(70svh*16/9)] items-center justify-between gap-4">
        <div className="flex flex-col gap-3">
          {/* Position indicator: one segment per view, the active one in red. */}
          <span aria-hidden="true" data-view-progress="" className="flex gap-1.5">
            {views.map((view, index) => (
              <span
                key={view}
                className={cn(
                  "h-0.5 w-7 transition-colors duration-500",
                  index === current.index ? "bg-red" : "bg-ink/20",
                )}
              />
            ))}
          </span>
          <p className="t-title">{viewName(current.index)}</p>
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => step(direction)}
              aria-label={direction < 0 ? t.showroom.previous : t.showroom.next}
              className="grid size-12 cursor-pointer place-items-center rounded-[2px] border border-ink/20 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
            >
              {direction < 0 ? (
                <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
              ) : (
                <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
              )}
            </button>
          ))}
        </div>
      </div>

      <ul
        aria-label={t.showroom.viewsLabel}
        className="mx-auto mt-6 flex w-full max-w-[calc(70svh*16/9)] snap-x gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible md:pb-0"
      >
        {views.map((view, index) => {
          const active = index === current.index;
          return (
            <li key={view} className="w-[8.5rem] shrink-0 snap-start md:w-auto">
              <button
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => show(index, current.paint, index > current.index ? 1 : -1)}
                className="group block w-full cursor-pointer text-left"
              >
                <span
                  className={cn(
                    "relative block aspect-[16/9] overflow-hidden rounded-[2px] bg-concrete outline outline-2 outline-offset-2 transition-[outline-color] duration-300",
                    active ? "outline-red" : "outline-transparent group-hover:outline-ink/30",
                  )}
                >
                  <ArtImage
                    asset={showroomImage(current.paint, view)}
                    alt=""
                    sizes="(min-width: 768px) 16vw, 136px"
                    compact
                  />
                </span>
                <span className={cn("mt-2 block text-[0.9375rem]", active ? "font-semibold" : "text-stone")}>
                  {t.showroom.views[view]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
