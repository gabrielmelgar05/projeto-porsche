"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/animations/gsap";
import { useI18n } from "@/lib/i18n/use-i18n";

let timer = 0;
const refresh = () => {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, 120);
};

/** Document metadata per language + ScrollTrigger re-measure when layout can change. */
export function Runtime() {
  const { t, tag } = useI18n();
  const previous = useRef(tag);

  useEffect(() => {
    document.documentElement.lang = tag;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
    if (previous.current !== tag) {
      previous.current = tag;
      refresh(); // longer Portuguese copy can reflow sections
    }
  }, [t, tag]);

  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && refresh());
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
