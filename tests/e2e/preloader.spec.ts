import { expect, test } from "@playwright/test";
import { waitForIntro } from "./helpers";

test.describe("preloader", () => {
  test("draws the signature, locks scroll, then hands over to the hero", async ({ page }) => {
    const started = Date.now();
    await page.goto("/");
    const preloader = page.locator(".preloader");
    await expect(preloader).toHaveAttribute("data-state", "running");
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

    // Contours are drawn with stroke-dashoffset (not a fade).
    const dash = await page
      .locator("[data-outline]")
      .first()
      .evaluate((el) => getComputedStyle(el).strokeDasharray);
    expect(dash).not.toBe("none");

    await waitForIntro(page);
    const elapsed = Date.now() - started;
    expect(elapsed).toBeLessThan(7_000);
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Hero entrance completes (title characters back in place).
    await expect
      .poll(() =>
        page
          .locator("[data-hero-title] [data-char]")
          .first()
          .evaluate((el) => getComputedStyle(el).transform),
      )
      .toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);
  });

  test("is shorter on a repeat visit in the same session", async ({ page }) => {
    await page.goto("/");
    await waitForIntro(page);
    const started = Date.now();
    await page.reload();
    await waitForIntro(page);
    expect(Date.now() - started).toBeLessThan(4_000);
  });

  test("can be skipped", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Skip intro" }).click();
    await waitForIntro(page, 3_000);
  });

  test("reduced motion: quick fade, no long sequence", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const started = Date.now();
    await page.goto("/");
    await waitForIntro(page, 4_000);
    expect(Date.now() - started).toBeLessThan(3_500);
  });
});
