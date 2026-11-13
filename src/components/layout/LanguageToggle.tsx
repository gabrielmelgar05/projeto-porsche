"use client";

import type { Locale } from "@/types";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";

const LOCALES: Locale[] = ["en", "pt"];

/** EN / PT — native buttons, instant switch, no reload, no replayed intro. */
export function LanguageToggle({ className, large = false }: { className?: string; large?: boolean }) {
  const { locale, t, setLocale } = useI18n();
  return (
    <div role="group" aria-label={t.a11y.language} className={cn("flex items-center", className)}>
      {LOCALES.map((code, i) => {
        const active = code === locale;
        return (
          <span key={code} className="flex items-center">
            {i > 0 ? <span aria-hidden="true" className="mx-1 h-3.5 w-px bg-current opacity-30" /> : null}
            <button
              type="button"
              lang={code === "pt" ? "pt-BR" : "en"}
              aria-pressed={active}
              aria-label={`${code.toUpperCase()} — ${t.a11y.languageNames[code]}`}
              onClick={() => setLocale(code)}
              className={cn(
                "t-label relative cursor-pointer px-2 transition-opacity duration-300",
                large ? "min-h-12 min-w-12 text-[0.9375rem]" : "min-h-11 min-w-10",
                active ? "opacity-100" : "opacity-55 hover:opacity-100",
              )}
            >
              {code.toUpperCase()}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-2 bottom-2 h-0.5 bg-red transition-transform duration-500 ease-[var(--ease-out-expo)]",
                  active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          </span>
        );
      })}
    </div>
  );
}
