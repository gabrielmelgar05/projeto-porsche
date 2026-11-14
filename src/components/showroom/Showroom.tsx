"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaintId } from "@/types";
import { views } from "@/data/gallery";
import { imageUrl, showroomImage } from "@/data/image-assets";
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
const initial: Layer = { key: 0, index: 0, paint: "ice-grey", direction: 0 };

export function Showroom() {
  const { t } = useI18n();
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef(0);
  const visible = useRef<Layer>(initial);
  const requested = useRef<Layer>(initial);
  const cached = useRef(new Map<string, HTMLImageElement>());
  const [layers, setLayers] = useState<Layer[]>([initial]);
  const [presented, setPresented] = useState<Layer>(initial);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState(false);
  const [announcedIndex, setAnnouncedIndex] = useState<number | null>(null);
  const current = layers[layers.length - 1]!;
  const viewName = (index: number) => t.showroom.views[views[index]!];

  const show = useCallback((index: number, paint: PaintId, direction: -1 | 0 | 1, force = false) => {
    const previous = requested.current;
    if (!force && previous.index === index && previous.paint === paint) return;
    const next = { key: ++counter.current, index, paint, direction };
    requested.current = next;
    setPresented(visible.current);
    setLoading(true);
    setFailed(false);
    setLayers([visible.current, next]);
  }, []);

  const step = useCallback(
    (direction: -1 | 1) => {
      const active = requested.current;
      show((active.index + direction + views.length) % views.length, active.paint, direction);
    },
    [show],
  );
  useSwipe(stage, step);

  useEffect(() => {
    if (!stage.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  // Only two neighbouring views of the displayed paint, using the browser's chosen format/size.
  useEffect(() => {
    if (!near || layers.length !== 1 || loading) return;
    const image = stage.current?.querySelector("img");
    if (!image) return;
    let cancelled = false;
    const preload = () => {
      if (cancelled) return;
      const match = image.currentSrc.match(/-(\d+)\.(avif|webp)(?:\?.*)?$/);
      if (!match) return;
      for (const direction of [-1, 1]) {
        const index = (presented.index + direction + views.length) % views.length;
        const asset = showroomImage(presented.paint, views[index]!);
        const width = asset.widths.find((width) => width >= Number(match[1])) ?? asset.width;
        const url = imageUrl(asset.dir, asset.name, width, match[2] as "avif" | "webp");
        if (cached.current.has(url)) continue;
        const adjacent = new Image();
        adjacent.decoding = "async";
        adjacent.src = url;
        cached.current.set(url, adjacent);
      }
    };
    void image.decode().then(preload, () => {});
    return () => {
      cancelled = true;
    };
  }, [near, layers, loading, presented]);

  useGSAP(
    (context) => {
      if (layers.length < 2) return;
      const [outgoing, incoming] = layers;
      const q = gsap.utils.selector(stage);
      const outEl = q(`[data-layer="${outgoing!.key}"]`)[0];
      const inEl = q(`[data-layer="${incoming!.key}"]`)[0];
      if (!outEl || !inEl) return;
      let cancelled = false;
      const isLatest = () => !cancelled && inEl.isConnected && incoming!.key === counter.current;
      const done = () => {
        if (!isLatest()) return;
        visible.current = incoming!;
        setPresented(incoming!);
        setLoading(false);
        setAnnouncedIndex(incoming!.index);
        setLayers([incoming!]);
      };
      gsap.set(inEl, { autoAlpha: 0 });
      const failure = () => {
        if (!isLatest()) return;
        setLoading(false);
        setFailed(true);
      };
      const reveal = () => {
        if (!isLatest()) return;
        context.add(() => {
          if (reducedMotion() || incoming!.direction === 0) {
            gsap.fromTo(
              inEl,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: reducedMotion() ? 0.15 : 0.5, ease: "none", onComplete: done },
            );
            return;
          }
          const dir = incoming!.direction;
          gsap.set(inEl, { autoAlpha: 1 });
          gsap.fromTo(
            inEl,
            { clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: EASE.curtain, onComplete: done },
          );
          gsap.fromTo(
            inEl.querySelector("[data-layer-inner]"),
            { scale: 1.035, xPercent: 2 * dir },
            { scale: 1, xPercent: 0, duration: 0.9, ease: EASE.reveal },
          );
          gsap.to(outEl.querySelector("[data-layer-inner]"), {
            xPercent: -3 * dir,
            duration: 0.9,
            ease: EASE.curtain,
          });
        });
      };
      const photograph = inEl.querySelector<HTMLImageElement>("img");
      if (photograph) {
        photograph.loading = "eager";
        void photograph.decode().then(() => (photograph.naturalWidth > 0 ? reveal() : failure()), failure);
      } else failure();
      return () => {
        cancelled = true;
      };
    },
    { scope: stage, dependencies: [layers], revertOnUpdate: true },
  );

  const preparing = fill(t.showroom.preparing, {
    paint: t.showroom.paints[current.paint],
    view: viewName(current.index),
  });
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-x-7">
      <div
        ref={stage}
        role="group"
        aria-roledescription="carousel"
        aria-label={t.showroom.title}
        aria-busy={loading}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            step(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        className="relative aspect-[16/9] w-full min-w-0 touch-pan-y overflow-hidden rounded-[10px] bg-concrete lg:col-start-1 lg:row-start-1"
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
                sizes="(min-width: 1600px) 1180px, (min-width: 1024px) 70vw, 100vw"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="min-w-0 lg:col-start-2 lg:row-span-3 lg:row-start-1">
        <PaintSelector
          value={presented.paint}
          pending={loading ? current.paint : undefined}
          onChange={(paint) => show(requested.current.index, paint, 0)}
        />
        <div className="mt-3 min-h-10 text-[0.8125rem] leading-relaxed text-stone" role="status">
          {loading ? (
            preparing
          ) : failed ? (
            <>
              <p>{t.showroom.loadFailed}</p>
              <button
                type="button"
                className="mt-2 min-h-11 cursor-pointer underline underline-offset-4"
                onClick={() => show(current.index, current.paint, 0, true)}
              >
                {t.showroom.retry}
              </button>
            </>
          ) : null}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {announcedIndex === null
          ? ""
          : fill(t.showroom.announce, {
              view: viewName(announcedIndex),
              index: announcedIndex + 1,
              total: views.length,
            })}
      </p>
      <div className="flex min-w-0 items-center justify-between gap-4 lg:col-start-1 lg:row-start-2">
        <div className="flex flex-col gap-3">
          <span aria-hidden="true" data-view-progress="" className="flex gap-1.5">
            {views.map((view, index) => (
              <span
                key={view}
                className={cn(
                  "h-0.5 w-7 transition-colors duration-500",
                  index === presented.index ? "bg-red" : "bg-ink/20",
                )}
              />
            ))}
          </span>
          <p className="t-title">{viewName(presented.index)}</p>
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => step(direction)}
              aria-label={direction < 0 ? t.showroom.previous : t.showroom.next}
              className="grid size-12 cursor-pointer place-items-center rounded-[6px] border border-ink/20 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
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
      <div className="min-w-0 lg:col-start-1 lg:row-start-3">
        <ul aria-label={t.showroom.viewsLabel} className="grid grid-cols-5 gap-2 py-1">
          {views.map((view, index) => {
            const active = index === presented.index;
            return (
              <li key={view} className="min-w-0">
                <button
                  type="button"
                  aria-label={t.showroom.views[view]}
                  aria-current={active ? "true" : undefined}
                  onClick={() =>
                    show(index, requested.current.paint, index > requested.current.index ? 1 : -1)
                  }
                  className="group block min-h-11 w-full cursor-pointer text-left"
                >
                  <span
                    className={cn(
                      "relative block aspect-[16/9] overflow-hidden rounded-[4px] bg-concrete outline outline-2 outline-offset-2 transition-[outline-color] duration-300",
                      active ? "outline-red" : "outline-transparent group-hover:outline-ink/30",
                    )}
                  >
                    <ArtImage
                      asset={showroomImage(presented.paint, view)}
                      alt=""
                      sizes="(min-width: 1600px) 220px, (min-width: 1024px) 13vw, 18vw"
                      compact
                    />
                  </span>
                  <span
                    className={cn(
                      "mt-2 hidden text-[0.8125rem] sm:block",
                      active ? "font-semibold" : "text-stone",
                    )}
                  >
                    {t.showroom.views[view]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="t-label mt-4 hidden text-stone md:block">{t.showroom.hintKeys}</p>
        <p className="t-label mt-4 text-stone md:hidden">{t.showroom.hintSwipe}</p>
      </div>
    </div>
  );
}
