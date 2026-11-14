"use client";

import { useState } from "react";
import type { SectionId, Tone } from "@/types";
import { sections } from "@/data/site";
import { ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";
import { PerformanceMark } from "@/components/brand/PerformanceMark";
import { LanguageToggle } from "./LanguageToggle";
import { MobileMenu } from "./MobileMenu";

/**
 * Fixed header. Reads `data-tone` from the section beneath it, deepens its glass
 * once the page scrolls, steps aside while reading down and returns on the
 * way up. Its contents (`[data-header-inner]`) are animated by the hero intro.
 */
export function Header() {
  const { t } = useI18n();
  const [tone, setTone] = useState<Tone>("dark");
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    // Lower refresh priority: measured after pinned sections add their spacing.
    ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onRefresh: (self) => setSolid(self.scroll() > 32),
      onUpdate: (self) => {
        const y = self.scroll();
        setSolid(y > 32);
        setHidden(self.direction === 1 && y > window.innerHeight * 0.8);
      },
    });

    document.querySelectorAll<HTMLElement>("[data-tone]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top+=40",
        end: "bottom top+=40",
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive) setTone(section.dataset.tone === "light" ? "light" : "dark");
        },
      });
    });

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive) setActive(id);
          else setActive((current) => (current === id ? null : current));
        },
      });
    });
  }, []);

  const dark = tone === "dark";

  return (
    <header
      data-header=""
      className={cn(
        "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[translate,color] duration-700 ease-[var(--ease-out-expo)] focus-within:translate-y-0",
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
        dark ? "text-white" : "text-ink",
      )}
    >
      <div
        data-header-inner=""
        className={cn(
          "relative mx-auto my-3 flex h-[var(--header-h)] w-[calc(100%-2*var(--gutter))] max-w-[calc(var(--frame-max)-2*var(--gutter))] items-center justify-between gap-2 rounded-[12px] border px-3 shadow-[0_8px_28px_rgb(0_0_0/0.10),inset_0_1px_0_rgb(255_255_255/0.05)] backdrop-blur-[24px] transition-[background-color,border-color] duration-500 sm:gap-4 sm:px-4 lg:my-4 lg:px-6 lg:backdrop-blur-[32px]",
          dark
            ? cn("border-white/15", solid ? "bg-graphite/65" : "bg-graphite/45")
            : cn("border-ink/10", solid ? "bg-mineral/75" : "bg-mineral/65"),
        )}
      >
        <a href="#top" aria-label={t.a11y.home} className="-mx-2 flex min-h-11 items-center px-2">
          <PerformanceMark letterColor="currentColor" className="w-[5.75rem] sm:w-[6.75rem] lg:w-[7.5rem]" />
        </a>

        <nav aria-label={t.a11y.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-8">
            {sections.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className="sweep py-1 text-[0.9375rem] font-medium"
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      </div>
    </header>
  );
}
