"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import type { SceneId } from "@/types";
import { hotspots, scenes } from "@/data/hotspots";
import { EASE, gsap, reducedMotion, useGSAP } from "@/lib/animations/gsap";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";
import { ArtImage } from "@/components/ui/ArtImage";

interface HotspotSceneProps {
  scene: SceneId;
  onSceneChange: (scene: SceneId) => void;
  onOpen: (index: number) => void;
}

/**
 * Viewpoint tabs + the scene image with its markers. Markers are placed in
 * percentages of the image box (which keeps the image's aspect ratio), so
 * they stay on the car at any size.
 */
export function HotspotScene({ scene, onSceneChange, onOpen }: HotspotSceneProps) {
  const { t } = useI18n();
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = scenes.find((s) => s.id === scene) ?? scenes[0]!;

  // Scene change: image settles, markers pop in one by one.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(stage);
      gsap.fromTo(
        q("[data-scene-image]"),
        { autoAlpha: 0, scale: 1.04 },
        { autoAlpha: 1, scale: 1, duration: 0.9, ease: EASE.reveal },
      );
      gsap.fromTo(
        q("[data-marker]"),
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.08, delay: 0.25 },
      );
    },
    { scope: stage, dependencies: [scene] },
  );

  const sceneAlt = (id: SceneId) =>
    id === "cockpit" ? t.alt.interiorCockpit : `911 GT3 RS — ${t.hotspots.scenes[id]}`;

  return (
    <div>
      <div
        role="tablist"
        aria-label={t.hotspots.scenesLabel}
        className="flex gap-1 border-b border-white/15"
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          const i = scenes.findIndex((s) => s.id === scene);
          const next = (i + (event.key === "ArrowRight" ? 1 : -1) + scenes.length) % scenes.length;
          onSceneChange(scenes[next]!.id);
          tabs.current[next]?.focus();
        }}
      >
        {scenes.map((s, i) => {
          const selected = s.id === scene;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`scene-tab-${s.id}`}
              aria-selected={selected}
              aria-controls="scene-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => onSceneChange(s.id)}
              className={cn(
                "relative min-h-12 cursor-pointer px-4 text-[0.9375rem] font-medium transition-colors",
                selected ? "text-white" : "text-white/60 hover:text-white",
              )}
            >
              {t.hotspots.scenes[s.id]}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-4 -bottom-px h-0.5 bg-red transition-transform duration-500 ease-[var(--ease-out-expo)]",
                  selected ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          );
        })}
      </div>

      <div
        id="scene-panel"
        role="tabpanel"
        aria-labelledby={`scene-tab-${scene}`}
        ref={stage}
        className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius)] bg-graphite"
      >
        <div data-scene-image="" className="absolute inset-0">
          <ArtImage
            key={scene}
            asset={active.image}
            alt={sceneAlt(scene)}
            sizes="(min-width: 1600px) 1520px, 100vw"
          />
        </div>

        {hotspots.map((spot, index) =>
          spot.scene === scene ? (
            <div
              key={spot.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              {/* GSAP scales this wrapper; the outer element owns the centring translate. */}
              <div data-marker="">
                <button
                  type="button"
                  data-hotspot={spot.id}
                  onClick={() => onOpen(index)}
                  aria-label={fill(t.hotspots.open, { title: t.hotspots.items[spot.id].title })}
                  className="group relative grid size-11 cursor-pointer place-items-center rounded-full bg-white text-ink shadow-[0_6px_24px_rgb(0_0_0/0.35)] transition-colors duration-300 hover:bg-red hover:text-white sm:size-12"
                >
                  <span
                    aria-hidden="true"
                    className="hotspot-ring absolute inset-0 rounded-full border-2 border-red"
                  />
                  <Plus
                    aria-hidden="true"
                    className="size-5 transition-transform duration-500 group-hover:rotate-90"
                    strokeWidth={2}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap bg-ink px-3 py-1.5 text-[0.875rem] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
                  >
                    {t.hotspots.items[spot.id].title}
                  </span>
                </button>
              </div>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
