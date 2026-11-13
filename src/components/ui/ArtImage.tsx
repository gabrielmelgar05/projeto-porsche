"use client";

import { useState } from "react";
import type { ImageAsset, Tone } from "@/types";
import { isAvailable } from "@/data/image-assets";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/cn";
import { ImageFallback } from "./ImageFallback";

const MOBILE_WIDTHS = [480, 828, 1080];

const srcSet = (dir: string, name: string, widths: readonly number[], format: "avif" | "webp") =>
  widths.map((w) => `/images/${dir}/${name}-${w}.${format} ${w}w`).join(", ");

interface ArtImageProps {
  asset: ImageAsset;
  alt: string;
  sizes: string;
  /** Above-the-fold image: eager + high fetch priority. */
  priority?: boolean;
  tone?: Tone;
  compact?: boolean;
  labelAt?: "bottom" | "top" | "none";
  /** Transparent cut-out: contained, anchored to the bottom, no surface. */
  cutout?: boolean;
  className?: string;
}

/** Fills its positioned parent with the photograph, or the pending-image fallback. */
export function ArtImage({
  asset,
  alt,
  sizes,
  priority = false,
  tone = "light",
  compact = false,
  labelAt,
  cutout = false,
  className,
}: ArtImageProps) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);

  if (!isAvailable(asset) || failed) {
    return (
      <ImageFallback
        label={alt}
        status={t.image.pending}
        file={`/images/${asset.dir}/${asset.name}`}
        tone={tone}
        compact={compact}
        labelAt={labelAt}
        cutout={cutout}
        className={className}
      />
    );
  }

  const widths = asset.widths.filter((w) => w <= asset.width);
  const largest = widths[widths.length - 1] ?? asset.width;
  const mobile = asset.mobile;
  const mobileWidths = mobile ? MOBILE_WIDTHS.filter((w) => w <= mobile.width) : [];

  return (
    <picture className={cn("absolute inset-0 block", className)}>
      {mobile ? (
        <>
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet={srcSet(asset.dir, mobile.name, mobileWidths, "avif")}
            sizes="100vw"
          />
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet={srcSet(asset.dir, mobile.name, mobileWidths, "webp")}
            sizes="100vw"
          />
        </>
      ) : null}
      <source type="image/avif" srcSet={srcSet(asset.dir, asset.name, widths, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(asset.dir, asset.name, widths, "webp")} sizes={sizes} />
      <img
        src={`/images/${asset.dir}/${asset.name}-${largest}.webp`}
        alt={alt}
        width={asset.width}
        height={asset.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn("size-full", cutout ? "object-contain object-bottom" : "object-cover")}
        style={asset.focus ? { objectPosition: asset.focus } : undefined}
      />
    </picture>
  );
}
