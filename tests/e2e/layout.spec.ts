import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { openFast } from "./helpers";

const widths = [320, 375, 390, 768, 1024, 1440, 1920];

for (const width of widths) {
  for (const locale of ["en", "pt"] as const) {
    test(`${width}px ${locale}: no horizontal overflow, full-height hero, readable text`, async ({
      page,
      isMobile,
    }) => {
      test.skip(isMobile, "viewport sweep runs once, on the desktop project");
      await page.setViewportSize({ width, height: width < 768 ? 760 : 900 });
      await page.addInitScript((l) => localStorage.setItem("gt3rs.locale", l), locale);
      await openFast(page);

      const metrics = await page.evaluate(() => {
        const html = document.documentElement;
        html.style.overflowX = "visible";
        document.body.style.overflowX = "visible";
        const scrollWidth = html.scrollWidth;
        html.style.overflowX = "";
        document.body.style.overflowX = "";
        // Smallest visible text (labels must stay ≥ 13px).
        let minFont = Infinity;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const el = node.parentElement;
          if (!el || !node.textContent?.trim()) continue;
          if (el.closest(".sr-only, [aria-hidden=true], dialog:not([open]), .preloader")) continue;
          const style = getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden" || el.getClientRects().length === 0)
            continue;
          minFont = Math.min(minFont, parseFloat(style.fontSize));
        }
        return {
          scrollWidth,
          clientWidth: html.clientWidth,
          heroHeight: document.getElementById("top")!.getBoundingClientRect().height,
          viewport: window.innerHeight,
          minFont,
        };
      });

      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
      expect(metrics.heroHeight).toBeGreaterThanOrEqual(metrics.viewport - 1);
      expect(metrics.minFont).toBeGreaterThanOrEqual(13);
    });
  }
}

test("static export contains the full page content", () => {
  test.skip(!existsSync("out/index.html"), "run `npm run build` first");
  const html = readFileSync("out/index.html", "utf8");
  expect(html).toContain("Not affiliated with, endorsed by or associated with Porsche AG");
  expect(html).toContain('id="showroom"');
  expect(existsSync("out/brand/gt3rs-performance-mark.svg")).toBe(true);
  expect(existsSync("out/og.png")).toBe(true);
});
