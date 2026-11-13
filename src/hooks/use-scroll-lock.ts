"use client";

import { useEffect } from "react";

/** Locks page scroll while `locked`. `scrollbar-gutter: stable` prevents layout shift. */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [locked]);
}
