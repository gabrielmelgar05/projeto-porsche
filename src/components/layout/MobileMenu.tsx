"use client";

import { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { sections } from "@/data/site";
import { EASE, gsap, reducedMotion } from "@/lib/animations/gsap";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useI18n } from "@/lib/i18n/use-i18n";
import { scrollToSection } from "@/lib/scroll";
import { LanguageToggle } from "./LanguageToggle";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Compact navigation below 1024 px, built on a modal <dialog>: focus is
 * contained, the page is inert, Escape closes it and focus returns to the
 * toggle. GSAP only animates the curtain.
 */
export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const { t } = useI18n();
  const dialog = useRef<HTMLDialogElement>(null);
  const pending = useRef<string | null>(null);

  useScrollLock(open);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      if (!reducedMotion()) {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: EASE.curtain },
        );
        gsap.fromTo(
          el.querySelectorAll("[data-menu-item]"),
          { yPercent: 105 },
          { yPercent: 0, duration: 0.8, ease: EASE.reveal, stagger: 0.05, delay: 0.25 },
        );
      }
    }
  }, [open]);

  // Widening to desktop hides the dialog; never leave the page inert behind it.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (desktop.matches && dialog.current?.open) {
        dialog.current.close();
        onOpenChange(false);
      }
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [onOpenChange]);

  const close = useCallback(() => {
    const el = dialog.current;
    if (!el?.open) return;
    const done = () => {
      el.close();
      onOpenChange(false);
      const target = pending.current;
      pending.current = null;
      if (target) scrollToSection(target);
    };
    if (reducedMotion()) done();
    else
      gsap.to(el, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.5,
        ease: EASE.curtain,
        onComplete: done,
      });
  }, [onOpenChange]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t.a11y.openMenu}
        onClick={() => onOpenChange(true)}
        className="flex min-h-11 min-w-11 cursor-pointer flex-col items-center justify-center gap-[7px] lg:hidden"
      >
        <span aria-hidden="true" className="h-px w-6 bg-current" />
        <span aria-hidden="true" className="h-px w-6 bg-current" />
      </button>

      <dialog
        ref={dialog}
        aria-label={t.a11y.mainNav}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        className="m-0 h-dvh w-screen bg-ink p-0 text-white backdrop:bg-transparent lg:hidden"
        data-surface="dark"
      >
        <div className="frame flex h-full flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
          <div className="flex h-[var(--header-h)] items-center justify-between">
            <LanguageToggle large />
            <button
              type="button"
              onClick={close}
              aria-label={t.a11y.closeMenu}
              className="-mr-2 grid min-h-12 min-w-12 cursor-pointer place-items-center"
            >
              <X aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </button>
          </div>
          <nav aria-label={t.a11y.mainNav} className="flex flex-1 flex-col justify-center">
            <ol>
              {sections.map((id) => (
                <li key={id} className="overflow-hidden border-b border-white/10">
                  <a
                    href={`#${id}`}
                    data-menu-item=""
                    onClick={(event) => {
                      event.preventDefault();
                      pending.current = id;
                      close();
                    }}
                    className="flex min-h-16 items-baseline py-3 font-display text-[clamp(1.75rem,7vw,2.75rem)] font-semibold leading-tight [font-stretch:112%]"
                  >
                    {t.nav[id]}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </dialog>
    </>
  );
}
