import type { Tone } from "@/types";
import { cn } from "@/lib/cn";

interface ImageFallbackProps {
  label: string;
  status: string;
  file: string;
  tone?: Tone;
  /** Thumbnails: surface only, no labels. */
  compact?: boolean;
  /** Where the label sits — keep it clear of copy laid over the image. */
  labelAt?: "bottom" | "top" | "none";
  /** Transparent cut-out (car on alpha): no surface, just a floor line. */
  cutout?: boolean;
  className?: string;
}

/**
 * Shown until a photograph exists. A quiet studio-cyclorama gradient keeps
 * the composition and lighting intent; the label names the expected file.
 */
export function ImageFallback({
  label,
  status,
  file,
  tone = "light",
  compact = false,
  labelAt = "bottom",
  cutout = false,
  className,
}: ImageFallbackProps) {
  const dark = tone === "dark";
  const decorative = label === "";

  if (cutout) {
    return (
      <div
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : `${label} — ${status}`}
        data-image-fallback=""
        className={cn("@container absolute inset-0", dark ? "text-white" : "text-ink", className)}
      >
        <div className="absolute inset-x-[6%] bottom-[10%] flex flex-col items-center gap-3">
          <span className="t-label flex items-center gap-2 opacity-90">
            <span aria-hidden="true" className="size-1.5 bg-red" />
            {status}
          </span>
          <span aria-hidden="true" className="flex w-full items-center">
            <span className="h-3 w-px bg-current opacity-60" />
            <span className="h-px flex-1 bg-current opacity-35" />
            <span className="mx-2 size-1.5 rounded-full border border-current opacity-60" />
            <span className="h-px flex-1 bg-current opacity-35" />
            <span className="h-3 w-px bg-current opacity-60" />
          </span>
          <span className={cn("hidden text-[0.8125rem] @lg:block", dark ? "text-white/65" : "text-stone")}>
            {file}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `${label} — ${status}`}
      aria-hidden={decorative ? true : undefined}
      data-image-fallback=""
      className={cn(
        "@container absolute inset-0 overflow-hidden",
        dark
          ? "bg-[radial-gradient(90%_70%_at_50%_38%,#2b2b2b_0%,#161616_55%,#0b0b0b_100%)] text-white"
          : "bg-[radial-gradient(90%_70%_at_50%_38%,#ffffff_0%,#ecebe6_50%,#d6d4ce_100%)] text-ink",
        className,
      )}
    >
      {/* studio floor */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-[8%] bottom-[14%] h-[18%] rounded-[50%] blur-2xl",
          dark ? "bg-white/[0.06]" : "bg-ink/[0.07]",
        )}
      />
      {compact || labelAt === "none" ? null : (
        <>
          <div aria-hidden="true" className="absolute inset-4 @md:inset-6">
            <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-current opacity-30" />
            <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-current opacity-30" />
            <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-current opacity-30" />
            <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-current opacity-30" />
          </div>
          <div
            className={cn(
              "absolute left-5 right-5 flex flex-col gap-1 @md:left-8 @md:right-8",
              labelAt === "top"
                ? "top-[calc(var(--header-h)+4.5rem)] items-end text-right"
                : "bottom-5 @md:bottom-8",
            )}
          >
            <span className="t-label flex items-center gap-2">
              <span aria-hidden="true" className="size-1.5 bg-red" />
              {status}
            </span>
            <span className={cn("hidden text-[0.8125rem] @sm:block", dark ? "text-white/65" : "text-stone")}>
              {file}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
