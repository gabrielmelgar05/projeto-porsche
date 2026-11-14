import { expect, test } from "@playwright/test";
import { openFast } from "./helpers";

for (const viewport of [
  { width: 320, height: 760 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 600 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]) {
  test(`single-photo hero at ${viewport.width}×${viewport.height}`, async ({ page, isMobile }) => {
    test.skip(isMobile, "viewport sweep runs on desktop project");
    await page.setViewportSize(viewport);
    await openFast(page);
    const hero = page.locator("#top");
    await expect(hero.locator("img")).toHaveCount(1);
    await hero.locator("img").evaluate((image) => (image as HTMLImageElement).decode());
    const cta = hero.locator("[data-hero-cta]");
    await expect(cta).toHaveAttribute("href", "#showroom");
    const bounds = await cta.boundingBox();
    expect(bounds!.y).toBeGreaterThan(70);
    expect(bounds!.y + bounds!.height).toBeLessThan(viewport.height);
    const title = await hero.locator("h1").boundingBox();
    expect(Math.abs(title!.x + title!.width / 2 - viewport.width / 2)).toBeLessThan(10);
    const metrics = await page.evaluate(() => ({
      hero: document.querySelector("#top")!.getBoundingClientRect().height,
      next: document.querySelector("#precision")!.getBoundingClientRect().top,
      viewport: innerHeight,
    }));
    expect(metrics.hero).toBeGreaterThanOrEqual(metrics.viewport);
    expect(metrics.next).toBeGreaterThanOrEqual(metrics.viewport);
  });
}

test("hero CTA opens showroom and translated copy remains functional", async ({ page }) => {
  await openFast(page);
  await page.locator("header").getByRole("button", { name: "PT — Português", exact: true }).click();
  const cta = page.getByRole("link", { name: "Explore o 911 GT3 RS", exact: true });
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/#showroom$/);
  await expect(
    page.locator("#showroom").getByRole("radio", { name: "Preto fosco", exact: true }),
  ).toBeEnabled();
});

test("favicon uses supplied raster crest at real sizes", async ({ page, request }) => {
  await openFast(page);
  const links = await page.locator('link[rel="icon"]').evaluateAll((nodes) =>
    nodes.map((node) => ({
      href: node.getAttribute("href"),
      type: node.getAttribute("type"),
      sizes: node.getAttribute("sizes"),
    })),
  );
  expect(links).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ type: "image/png", sizes: "16x16" }),
      expect.objectContaining({ type: "image/png", sizes: "32x32" }),
    ]),
  );
  for (const link of links) {
    expect(link.href).not.toContain("favicon.svg");
    const response = await request.get(link.href!);
    expect(response.ok()).toBe(true);
    expect((await response.body()).subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  }
  const ico = await request.get("/favicon.ico");
  expect(ico.ok()).toBe(true);
  expect((await ico.body()).subarray(0, 4).toString("hex")).toBe("00000100");
});
