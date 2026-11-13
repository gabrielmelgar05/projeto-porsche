import { expect, test } from "@playwright/test";
import { openFast } from "./helpers";

test.describe("hotspots", () => {
  test("open, navigate, close with Escape and restore focus", async ({ page }) => {
    await openFast(page, "/#details");
    const section = page.locator("#details");
    await section.getByRole("button", { name: "Open detail: Front aerodynamics" }).click();

    const dialog = page.getByRole("dialog", { name: "Front aerodynamics" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Detail 1 of 7")).toBeVisible();

    await dialog.getByRole("button", { name: "Next detail" }).click();
    await expect(page.getByRole("dialog", { name: "Wheels & brakes" })).toBeVisible();
    await page.getByRole("button", { name: "Next detail" }).click();
    await page.getByRole("button", { name: "Next detail" }).click();
    // Detail 4 lives on the rear viewpoint — the scene behind follows.
    await expect(page.getByRole("dialog", { name: "Rear wing & DRS" })).toBeVisible();
    await expect(section.getByRole("tab", { name: "Rear ¾" })).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(section.locator('[data-hotspot="rearWing"]')).toBeFocused();
  });

  test("every detail is reachable from the list", async ({ page }) => {
    await openFast(page, "/#details");
    await page.locator("#details").getByRole("button", { name: "Sports seats" }).click();
    await expect(page.getByRole("dialog", { name: "Sports seats" })).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("viewpoint tabs work with arrow keys", async ({ page }) => {
    await openFast(page, "/#details");
    const tab = page.locator("#details").getByRole("tab", { name: "Front ¾" });
    await tab.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#details").getByRole("tab", { name: "Rear ¾" })).toBeFocused();
    await expect(page.locator("#details").getByRole("tab", { name: "Rear ¾" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
