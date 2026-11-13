import { expect, test, type Page } from "@playwright/test";
import { openFast } from "./helpers";

/** Progress of the finale signature: share of the fill wipe that is open (0–1). */
const progress = (page: Page) =>
  page.locator("#final [data-fill-wipe]").evaluate((el) => Number(el.getAttribute("width") ?? 0) / 1120);

/** Scrolls so the signature's top edge sits at `fraction` of the viewport height. */
async function placeMark(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const svg = document.querySelector("#final svg")!;
    const top = svg.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - window.innerHeight * f, behavior: "instant" });
  }, fraction);
  await page.waitForTimeout(1600); // scrub smoothing settles
}

test("finale signature follows the scroll: draws, rewinds, redraws", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await openFast(page);

  await placeMark(page, 1.2); // below the viewport — not started
  expect(await progress(page)).toBe(0);

  await placeMark(page, 0.1); // scrolled past — fully drawn
  expect(await progress(page)).toBeGreaterThan(0.99);

  await placeMark(page, 0.95); // scrolled back up — rewound
  expect(await progress(page)).toBeLessThan(0.05);

  await placeMark(page, 0.1); // down again — drawn again
  expect(await progress(page)).toBeGreaterThan(0.99);

  await placeMark(page, 3); // leave the section upwards — reset
  expect(await progress(page)).toBe(0);
});

test("navbar shows the GT3 RS signature, not the Porsche wordmark", async ({ page }) => {
  await openFast(page);
  const home = page.getByRole("link", { name: "GT3 RS — back to top" });
  await expect(home.locator("svg [data-outline]")).toHaveCount(5);
});

test("no numbered section markers remain", async ({ page }) => {
  await openFast(page);
  const markers = await page.evaluate(() =>
    [...document.querySelectorAll("main .t-label, #mobile-menu .t-label")]
      .map((el) => el.textContent?.trim() ?? "")
      .filter((text) => /^0\d\b/.test(text)),
  );
  expect(markers).toEqual([]);
});
