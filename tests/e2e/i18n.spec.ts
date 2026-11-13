import { expect, test } from "@playwright/test";
import { openFast } from "./helpers";

test("English by default, switches to Portuguese without reload, and persists", async ({ page }) => {
  await page
    .context()
    .addInitScript(() => Object.defineProperty(navigator, "language", { get: () => "pt-BR" }));
  await openFast(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/Concept Experience/);

  await page
    .getByRole("button", { name: /PT — Português/ })
    .first()
    .click();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page).toHaveTitle(/Experiência Conceitual/);
  await expect(page.locator("#aero-title")).toContainText("Ar transformado em aderência.");
  // Switching language never replays the opening.
  await expect(page.locator(".preloader")).toHaveAttribute("data-state", "done");
  expect(await page.evaluate(() => localStorage.getItem("gt3rs.locale"))).toBe("pt");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("#aero-title")).toContainText("Ar transformado em aderência.");
});
