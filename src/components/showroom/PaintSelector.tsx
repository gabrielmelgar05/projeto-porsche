"use client";

import type { PaintId } from "@/types";
import { isPaintSelectable, paints } from "@/data/gallery";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";

interface PaintSelectorProps {
  value: PaintId;
  onChange: (paint: PaintId) => void;
}

/**
 * Native radios. A paint without a complete, consistent image set is shown
 * as unavailable — never faked with a CSS filter.
 */
export function PaintSelector({ value, onChange }: PaintSelectorProps) {
  const { t } = useI18n();
  return (
    <fieldset className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <legend className="t-label float-left mr-2 text-stone">{t.showroom.paint}</legend>
      {paints.map((paint) => {
        const selectable = isPaintSelectable(paint);
        const checked = value === paint.id;
        return (
          <label
            key={paint.id}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-[2px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-red",
              selectable ? "cursor-pointer" : "cursor-not-allowed",
            )}
          >
            <input
              type="radio"
              name="paint"
              value={paint.id}
              checked={checked}
              disabled={!selectable}
              onChange={() => onChange(paint.id)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                "grid size-8 place-items-center rounded-full border transition-colors",
                checked ? "border-red" : "border-ink/20",
                !selectable && "opacity-40",
              )}
            >
              <span
                className="size-5 rounded-full border border-ink/15"
                style={{ backgroundColor: paint.swatch }}
              />
            </span>
            <span className={cn("text-[0.9375rem]", checked && "font-semibold", !selectable && "text-stone")}>
              {t.showroom.paints[paint.id]}
              {!selectable ? (
                <span className="ml-2 text-[0.8125rem]">· {t.showroom.paintPending}</span>
              ) : null}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
