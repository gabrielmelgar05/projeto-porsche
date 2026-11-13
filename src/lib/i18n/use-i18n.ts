"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/types";
import { en, type Dictionary } from "./en";
import { pt } from "./pt";
import { LOCALE_TAGS, getLocale, getServerLocale, setLocale, subscribeLocale } from "./store";

const dictionaries: Record<Locale, Dictionary> = { en, pt };

export function useI18n() {
  const locale = useSyncExternalStore(subscribeLocale, getLocale, getServerLocale);
  return { locale, tag: LOCALE_TAGS[locale], t: dictionaries[locale], setLocale };
}
