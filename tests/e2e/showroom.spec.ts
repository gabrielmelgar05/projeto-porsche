import { expect, test } from "@playwright/test";
import { openFast } from "./helpers";

test.describe("showroom", () => {
  test.beforeEach(async ({ page }) => {
    await openFast(page, "/#showroom");
  });

  test("next / previous, keyboard and thumbnails change the view", async ({ page }) => {
    const section = page.locator("#showroom");
    const thumb = (name: string) => section.getByRole("button", { name, exact: true });
    const live = section.locator("[aria-live=polite]");

    await expect(thumb("Front ¾")).toHaveAttribute("aria-current", "true");
    await section.getByRole("button", { name: "Next view" }).click();
    await expect(live).toHaveText(/Side profile, view 2 of 5/);
    await expect(thumb("Side profile")).toHaveAttribute("aria-current", "true");

    await section.getByRole("group", { name: "Five angles. One silhouette." }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(live).toHaveText(/Rear ¾, view 3 of 5/);
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(live).toHaveText(/Rear, view 5 of 5/);

    await thumb("Front").click();
    await expect(live).toHaveText(/Front, view 4 of 5/);
    await expect(thumb("Front")).toHaveAttribute("aria-current", "true");
    // Position indicator: exactly one active segment.
    await expect(section.locator("[data-view-progress] > .bg-red")).toHaveCount(1);
  });

  test("black paint is not offered until its imagery exists", async ({ page }) => {
    const section = page.locator("#showroom");
    await expect(section.getByRole("radio", { name: /White/ })).toBeChecked();
    await expect(section.getByRole("radio", { name: /Black/ })).toBeDisabled();
  });

  test("the current photo remains visible until the next photo decodes", async ({ page, isMobile }) => {
    test.skip(isMobile, "stage and thumbnail use distinct image sizes on desktop");
    const section = page.locator("#showroom");
    const stage = section.locator('[aria-roledescription="carousel"]');
    await stage.locator("img").evaluate((image) => (image as HTMLImageElement).decode());
    let release = () => {};
    let requested = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const request = new Promise<void>((resolve) => {
      requested = resolve;
    });
    const pattern = /gt3rs-white-side-(1280|1672)\.avif/;
    await page.route(pattern, async (route) => {
      requested();
      await gate;
      await route.continue();
    });
    try {
      await section.getByRole("button", { name: "Next view" }).click();
      await request;
      // Beyond the existing 900 ms wipe: the outgoing photograph must still be visible.
      await page.waitForTimeout(1200);
      const previous = stage.locator('img[src*="gt3rs-white-front34-"]');
      await expect(previous).toBeVisible();
      release();
      await expect(previous).toHaveCount(0);
      const next = stage.locator('img[src*="gt3rs-white-side-"]');
      await expect(next).toBeVisible();
      await expect
        .poll(() => next.evaluate((image) => (image as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
    } finally {
      release();
      await page.unroute(pattern);
    }
  });

  test("a touch swipe over the photograph advances the mobile gallery", async ({ page, isMobile }) => {
    test.skip(!isMobile, "real touch gesture runs on the mobile project");
    const section = page.locator("#showroom");
    const stage = section.locator('[aria-roledescription="carousel"]');
    await stage.scrollIntoViewIfNeeded();
    await stage.locator("img").evaluate((image) => (image as HTMLImageElement).decode());
    const bounds = await stage.boundingBox();
    if (!bounds) throw new Error("Showroom stage is not visible");
    const touch = await page.context().newCDPSession(page);
    const y = bounds.y + bounds.height / 2;
    try {
      await touch.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: bounds.x + bounds.width * 0.8, y }],
      });
      for (const fraction of [0.7, 0.6, 0.5, 0.4, 0.3]) {
        await touch.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: bounds.x + bounds.width * fraction, y }],
        });
      }
      await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await expect(section.locator("[aria-live=polite]")).toHaveText(/Side profile, view 2 of 5/);
    } finally {
      await touch.detach();
    }
  });

  test("integrated photographs load without placeholders or broken images", async ({ page }) => {
    const stage = page.locator('#showroom [aria-roledescription="carousel"]');
    const photograph = stage.locator("img").last();
    await expect(photograph).toBeVisible();
    await expect(photograph).toHaveJSProperty("complete", true);
    await expect
      .poll(() => photograph.evaluate((img) => (img as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    const broken = await page.evaluate(() =>
      [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
    );
    expect(broken).toEqual([]);
    await expect(page.locator("#showroom [data-image-fallback]")).toHaveCount(0);
  });
});
