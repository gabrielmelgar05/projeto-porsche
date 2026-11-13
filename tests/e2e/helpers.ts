import { expect, type Page } from "@playwright/test";

/** Waits until the preloader has handed over to the page. */
export async function waitForIntro(page: Page, timeout = 15_000): Promise<void> {
  await expect(page.locator(".preloader")).toHaveAttribute("data-state", "done", { timeout });
}

/** Skips the opening on a fresh page (sets the repeat-visit flag first). */
export async function openFast(page: Page, path = "/"): Promise<void> {
  await page.addInitScript(() => sessionStorage.setItem("gt3rs.intro-played", "1"));
  await page.goto(path);
  await waitForIntro(page);
}
