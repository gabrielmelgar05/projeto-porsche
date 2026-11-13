import type { Locale } from "@/types";

/**
 * Active-language store (read with useSyncExternalStore).
 *
 * Server rendering and hydration always use English, so markup matches.
 * The client snapshot reads the saved choice and React re-renders right
 * after hydration. The browser language is never used: English is the
 * default until the visitor picks Português.
 */

export const LOCALE_KEY = "gt3rs.locale";
export const INTRO_KEY = "gt3rs.intro-played";
export const LOCALE_TAGS: Record<Locale, string> = { en: "en", pt: "pt-BR" };

const listeners = new Set<() => void>();
let current: Locale | null = null;

function readSaved(): Locale {
  try {
    return window.localStorage.getItem(LOCALE_KEY) === "pt" ? "pt" : "en";
  } catch {
    return "en";
  }
}

export const getLocale = (): Locale => (current ??= readSaved());
export const getServerLocale = (): Locale => "en";

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setLocale(next: Locale): void {
  if (next === getLocale()) return;
  current = next;
  try {
    window.localStorage.setItem(LOCALE_KEY, next);
  } catch {
    // Private mode / quota: the switch still works for this visit.
  }
  document.documentElement.lang = LOCALE_TAGS[next];
  listeners.forEach((listener) => listener());
}

/** Inline <head> script: JS flag, saved `lang`, repeat-visit flag — before first paint. */
export const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");try{if(localStorage.getItem("${LOCALE_KEY}")==="pt")d.lang="pt-BR";if(sessionStorage.getItem("${INTRO_KEY}"))d.classList.add("intro-played")}catch(e){}})();`;
