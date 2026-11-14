"use client";

import type { PaintId } from "@/types";
import { isPaintSelectable, paints } from "@/data/gallery";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";

interface PaintSelectorProps {
  value: PaintId;
  pending?: PaintId;
  onChange: (paint: PaintId) => void;
}

/** Checked paint describes the photograph on screen; a pending choice gets its own indicator. */
export function PaintSelector({ value, pending, onChange }: PaintSelectorProps) {
  const { t } = useI18n();
  const selected = paints.find((paint) => paint.id === value)!;
  return (
    <fieldset className="min-w-0 rounded-[12px] border border-ink/10 bg-paper/60 p-4 lg:p-5">
      <legend className="t-label px-1 text-stone">{t.showroom.paint}</legend>
      <p className="mt-1 font-display text-lg font-semibold lg:hidden">{t.showroom.paints[value]}</p>
      <div className="mt-3 grid grid-cols-5 gap-1 lg:mt-1 lg:grid-cols-1 lg:gap-2">
        {paints.map((paint) => {
          const selectable = isPaintSelectable(paint);
          const checked = value === paint.id;
          const waiting = pending === paint.id;
          return (
            <label
              key={paint.id}
              title={t.showroom.paints[paint.id]}
              className={cn(
                "relative flex min-h-11 min-w-0 items-center justify-center gap-3 rounded-[6px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-red lg:justify-start lg:px-2 lg:py-2",
                checked && "lg:bg-ink/5",
                selectable ? "cursor-pointer" : "cursor-not-allowed opacity-40",
              )}
            >
              <input
                type="radio"
                name="paint"
                value={paint.id}
                checked={checked}
                disabled={!selectable}
                aria-label={t.showroom.paints[paint.id]}
                onChange={() => onChange(paint.id)}
                onClick={() => {
                  if (checked && pending) onChange(paint.id);
                }}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-full border transition-colors",
                  checked ? "border-red" : waiting ? "border-ink border-dashed" : "border-transparent",
                )}
              >
                <span
                  className="size-8 rounded-full border border-ink/20 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]"
                  style={{
                    backgroundColor: paint.swatch,
                    backgroundImage:
                      paint.finish === "metallic"
                        ? "linear-gradient(135deg,transparent 25%,rgb(255 255 255 / .5) 46%,rgb(0 0 0 / .12) 52%,transparent 75%)"
                        : undefined,
                  }}
                />
              </span>
              <span className={cn("hidden text-sm lg:block", checked && "font-semibold")}>
                {t.showroom.paints[paint.id]}
              </span>
            </label>
          );
        })}
      </div>
      <p className="mt-4 min-h-10 text-[0.8125rem] leading-relaxed text-stone">
        {t.showroom.finishes[selected.finish]}
      </p>
    </fieldset>
  );
}
