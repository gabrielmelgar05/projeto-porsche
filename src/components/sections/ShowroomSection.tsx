"use client";

import { useRef } from "react";
import { EASE, gsap, useGSAP } from "@/lib/animations/gsap";
import { useI18n } from "@/lib/i18n/use-i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Showroom } from "@/components/showroom/Showroom";

export function ShowroomSection() {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);

  // Entrance: the headline drops in from above its mask; the gallery rises.
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%", once: true } })
        .from(q("[data-showroom-title]"), { yPercent: -100, duration: 1, ease: EASE.reveal })
        .from(q("[data-showroom-body]"), { opacity: 0, y: 40, duration: 1.1, ease: EASE.reveal }, 0.2);
    },
    { scope: ref, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="showroom"
      data-tone="light"
      aria-labelledby="showroom-title"
      className="section-pad bg-mineral"
    >
      <div className="frame">
        <Eyebrow className="text-stone">{t.showroom.eyebrow}</Eyebrow>
        <div className="mt-6 overflow-hidden pb-2">
          <h2 id="showroom-title" data-showroom-title="" className="t-headline max-w-[16ch]">
            {t.showroom.title}
          </h2>
        </div>
        <div data-showroom-body="" className="mt-10 lg:mt-14">
          <Showroom />
        </div>
      </div>
    </section>
  );
}
