"use client";

import { useRef } from "react";
import { EASE, gsap, reducedMotion, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { finishHeroIntro, startHeroIntro } from "@/lib/animations/intro";
import { INTRO_KEY } from "@/lib/i18n/store";
import { useI18n } from "@/lib/i18n/use-i18n";
import { PerformanceMark, buildMarkTimeline } from "@/components/brand/PerformanceMark";

/** Never hold the page longer than this, even if animation frames stall. */
const HARD_STOP_MS = 7000;

const panelTexture =
  "bg-ink bg-[repeating-linear-gradient(115deg,rgb(255_255_255/0.018)_0_1px,transparent_1px_7px)]";

/**
 * Cinematic opening:
 * 01 darkness + red precision line · 02 contours draw · 03 fill, red stripe,
 * yellow glint · 04 panels part to reveal the hero · 05 hero entrance.
 * Full sequence once per session; shortened on repeat; a fade for reduced motion.
 */
export function Preloader() {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<SVGSVGElement>(null);
  const skip = useRef<() => void>(() => undefined);

  useGSAP(
    (_context, contextSafe) => {
      const el = root.current;
      const svg = mark.current;
      if (!el || !svg || !contextSafe) return;
      el.dataset.state = "running";

      const html = document.documentElement;
      const previousOverflow = html.style.overflow;
      html.style.overflow = "hidden";
      const repeat = html.classList.contains("intro-played");
      const reduce = reducedMotion();
      const q = gsap.utils.selector(el);

      let finished = false;
      const release = () => {
        html.style.overflow = previousOverflow;
      };
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(hardStop);
        el.dataset.state = "done";
        release();
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {
          // Non-critical.
        }
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        // Deep links: pinned sections add scroll distance after the browser's
        // initial jump, so land on the hash target again once measured.
        const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
        target?.scrollIntoView({ behavior: "instant", block: "start" });
      };

      const hardStop = window.setTimeout(() => {
        startHeroIntro();
        finishHeroIntro(true);
        finish();
      }, HARD_STOP_MS);

      gsap.set(q("[data-pl-stage]"), { autoAlpha: 1 });
      const tl = gsap.timeline();

      if (reduce) {
        tl.to({}, { duration: 0.6 })
          .add(() => startHeroIntro())
          .to(el, { autoAlpha: 0, duration: 0.35, ease: "none" })
          .add(finish);
      } else {
        tl.fromTo(
          q("[data-pl-line]"),
          { scaleX: 0 },
          { scaleX: 1, duration: repeat ? 0.35 : 0.75, ease: EASE.curtain },
        )
          .from(q("[data-pl-meta]"), { autoAlpha: 0, y: 8, duration: 0.5, stagger: 0.06 }, "<0.2")
          .add(buildMarkTimeline(svg, repeat ? "quick" : "full"), repeat ? 0.15 : 0.5)
          .to(
            q("[data-pl-line]"),
            { scaleX: 0, transformOrigin: "right center", duration: 0.5, ease: EASE.curtain },
            "-=0.45",
          )
          .addLabel("exit", repeat ? "+=0.1" : "+=0.15")
          .to(
            q("[data-pl-content], [data-pl-skip]"),
            { scale: 0.94, autoAlpha: 0, duration: 0.55, ease: EASE.exit },
            "exit",
          )
          .to(q("[data-pl-top]"), { yPercent: -100, duration: 1.1, ease: EASE.curtain }, "exit+=0.2")
          .to(q("[data-pl-bottom]"), { yPercent: 100, duration: 1.1, ease: EASE.curtain }, "<")
          .add(() => {
            release();
            startHeroIntro();
          }, "exit+=0.4")
          .add(finish);
      }

      skip.current = contextSafe(() => tl.progress(1));

      return () => {
        finished = true;
        window.clearTimeout(hardStop);
        release();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="preloader fixed inset-0 z-[100] text-white" aria-busy="true">
      <div data-pl-top="" className={`absolute inset-x-0 top-0 h-1/2 ${panelTexture}`} />
      <div data-pl-bottom="" className={`absolute inset-x-0 bottom-0 h-1/2 ${panelTexture}`} />

      <div data-pl-stage="" className="invisible absolute inset-0">
        <div data-pl-content="" className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <p className="sr-only" role="status">
            {t.a11y.loading}
          </p>
          <div className="w-[min(46rem,86vw)]">
            <PerformanceMark ref={mark} letterColor="#f4f3ef" />
          </div>
          <div
            data-pl-line=""
            aria-hidden="true"
            className="mt-10 h-px w-[min(46rem,86vw)] origin-left bg-red"
          />
          <div className="mt-6 flex w-[min(46rem,86vw)] justify-between text-white/65">
            <span data-pl-meta="" className="t-label">
              992 · 525 PS
            </span>
            <span data-pl-meta="" className="t-label">
              Aklio Studio
            </span>
          </div>
        </div>

        <button
          type="button"
          data-pl-skip=""
          onClick={() => skip.current()}
          className="t-label absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 min-h-11 cursor-pointer px-3 text-white/65 transition-colors hover:text-white"
        >
          {t.a11y.skipIntro}
        </button>
      </div>
    </div>
  );
}
