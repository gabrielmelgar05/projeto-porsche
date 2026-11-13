import { expect, test } from "@playwright/test";
import { openFast } from "./helpers";

test("mobile menu: opens, closes with Escape, navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await openFast(page);
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const menu = page.getByRole("dialog", { name: "Main navigation" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await menu.getByRole("link", { name: /Interior/ }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#interior$/);
  await expect
    .poll(() =>
      page.evaluate(() => Math.abs(document.getElementById("interior")!.getBoundingClientRect().top)),
    )
    .toBeLessThan(4);
});

test("desktop navigation links reach every section", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await openFast(page);
  for (const name of ["Precision", "Aerodynamics", "Showroom", "Details", "Performance", "Interior"]) {
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name }),
    ).toHaveAttribute("href", `#${name.toLowerCase()}`);
  }
});
