"use client";

import { ArrowUpRight } from "lucide-react";
import { sections } from "@/data/site";
import { specificationSource } from "@/data/specifications";
import { useI18n } from "@/lib/i18n/use-i18n";
import { LanguageToggle } from "./LanguageToggle";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer data-tone="dark" className="bg-ink pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-20 text-white">
      <div className="frame">
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <p className="font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold uppercase leading-none tracking-[-0.03em] [font-stretch:125%]">
              911 GT3 RS
            </p>
            <p className="mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-white/70">
              {t.footer.disclaimer}
            </p>
          </div>

          <nav
            aria-label={t.footer.sections}
            className="col-span-4 md:col-span-4 lg:col-span-3 lg:col-start-7"
          >
            <p className="t-label mb-5 text-white/60">{t.footer.sections}</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-1">
              {sections.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="sweep text-[1rem]">
                    {t.nav[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-4 flex flex-col gap-8 md:col-span-4 lg:col-span-3 lg:col-start-10">
            <div>
              <p className="t-label mb-2 text-white/60">{t.a11y.language}</p>
              <LanguageToggle large className="-ml-2" />
            </div>
            <div>
              <p className="t-label mb-2 text-white/60">{t.footer.source}</p>
              <a
                href={specificationSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sweep inline-flex items-center gap-1.5 text-[0.9375rem]"
              >
                Porsche Newsroom
                <ArrowUpRight aria-hidden="true" className="size-4" />
                <span className="sr-only">({t.a11y.newTab})</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-[0.9375rem] text-white/70 sm:flex-row sm:justify-between">
          <p>
            {t.footer.credit} — <span className="text-white">Aklio Studio</span>
          </p>
          <p>© 2026</p>
        </div>
      </div>
    </footer>
  );
}
