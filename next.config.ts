import type { NextConfig } from "next";

/**
 * Fully static export (Cloudflare Pages): `npm run build` writes `out/`.
 * Images are pre-optimised by `npm run images` (sharp) and served through
 * <picture>, so the Next.js image optimiser is not needed at runtime.
 */
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
