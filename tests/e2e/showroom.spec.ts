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

  test("missing photographs render placeholders, never broken images", async ({ page }) => {
    const broken = await page.evaluate(() =>
      [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
    );
    expect(broken).toEqual([]);
    await expect(page.locator("#showroom [data-image-fallback]").first()).toBeVisible();
  });
});
