"use client";

import { useEffect, type RefObject } from "react";

/** Horizontal swipe on touch / pen. Calls back with -1 (to previous) or 1 (to next). */
export function useSwipe(ref: RefObject<HTMLElement | null>, onSwipe: (direction: -1 | 1) => void): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      tracking = true;
      startX = event.clientX;
      startY = event.clientY;
    };
    const up = (event: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) onSwipe(dx < 0 ? 1 : -1);
    };
    const cancel = () => {
      tracking = false;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", cancel);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
    };
  }, [ref, onSwipe]);
}
