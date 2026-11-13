"use client";

import { useI18n } from "@/lib/i18n/use-i18n";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="t-label fixed left-4 top-4 z-[110] -translate-y-[300%] bg-red px-5 py-3 text-white transition-transform focus-visible:translate-y-0"
    >
      {t.a11y.skip}
    </a>
  );
}
