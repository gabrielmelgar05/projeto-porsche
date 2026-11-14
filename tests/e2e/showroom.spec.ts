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

  test("all five paints retain the selected angle across all 25 photographs", async ({ page }) => {
    test.setTimeout(90_000);
    const section = page.locator("#showroom");
    const stage = section.locator('[aria-roledescription="carousel"]');
    const paints = [
      ["Ice Grey Metallic", "ice-grey"],
      ["White", "white"],
      ["Matte Black", "matte-black"],
      ["GT Silver Metallic", "gt-silver"],
      ["Guards Red", "guards-red"],
    ];
    const angles = [
      ["Front ¾", "front34"],
      ["Side profile", "side"],
      ["Rear ¾", "rear34"],
      ["Front", "front"],
      ["Rear", "rear"],
    ];
    for (const [name, id] of paints) {
      await expect(section.getByRole("radio", { name, exact: true })).toBeEnabled();
      const previous = await section.locator('button[aria-current="true"]').getAttribute("aria-label");
      await section.getByTitle(name!, { exact: true }).click();
      await expect(section.getByRole("radio", { name, exact: true })).toBeChecked();
      await expect(section.getByRole("button", { name: previous!, exact: true })).toHaveAttribute(
        "aria-current",
        "true",
      );
      for (const [angle, view] of angles) {
        await section.getByRole("button", { name: angle, exact: true }).click();
        await expect(stage.locator("[data-layer]")).toHaveCount(1);
        await expect(stage.locator("img")).toHaveAttribute("src", new RegExp(`gt3rs-${id}-${view}-`));
        await expect(stage.locator("img")).toHaveJSProperty("complete", true);
        expect(
          await stage.locator("img").evaluate((image) => (image as HTMLImageElement).naturalWidth),
        ).toBeGreaterThan(0);
        await expect(section.getByRole("radio", { name, exact: true })).toBeChecked();
      }
    }
    await section.getByTitle("Matte Black", { exact: true }).click();
    await expect(section.getByText("Concept finish · matte paint", { exact: true })).toBeVisible();
  });

  test("pending paint keeps the displayed photograph and checked swatch consistent", async ({ page }) => {
    const section = page.locator("#showroom");
    const stage = section.locator('[aria-roledescription="carousel"]');
    await stage.locator("img").evaluate((image) => (image as HTMLImageElement).decode());
    let release = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const pattern = /gt3rs-guards-red-front34-\d+\.(avif|webp)/;
    await page.route(pattern, async (route) => {
      await gate;
      await route.continue();
    });
    try {
      await section.getByTitle("Guards Red", { exact: true }).click();
      await expect(stage).toHaveAttribute("aria-busy", "true");
      await page.waitForTimeout(1100);
      await expect(section.getByRole("radio", { name: "Ice Grey Metallic", exact: true })).toBeChecked();
      await expect(stage.locator('img[src*="gt3rs-ice-grey-front34-"]')).toBeVisible();
      await expect(section.getByRole("status")).toContainText("Preparing Guards Red");
      release();
      await expect(section.getByRole("radio", { name: "Guards Red", exact: true })).toBeChecked();
      await expect(stage.locator("[data-layer]")).toHaveCount(1);
      await expect(stage.locator('img[src*="gt3rs-guards-red-front34-"]')).toBeVisible();
    } finally {
      release();
      await page.unroute(pattern);
    }
  });

  test("latest rapid selection wins, including returning to the displayed paint", async ({ page }) => {
    const section = page.locator("#showroom");
    const stage = section.locator('[aria-roledescription="carousel"]');
    let release = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const pattern = /gt3rs-(guards-red|matte-black|white)-front34-\d+\.(avif|webp)/;
    await page.route(pattern, async (route) => {
      await gate;
      await route.continue();
    });
    try {
      for (const name of ["Guards Red", "Matte Black", "White", "Ice Grey Metallic"])
        await section.getByTitle(name, { exact: true }).click();
      await expect(stage).toHaveAttribute("aria-busy", "false");
      await expect(stage.locator("[data-layer]")).toHaveCount(1);
      release();
      await page.waitForTimeout(700);
      await expect(section.getByRole("radio", { name: "Ice Grey Metallic", exact: true })).toBeChecked();
      await expect(stage.locator("img")).toHaveAttribute("src", /gt3rs-ice-grey-front34-/);
    } finally {
      release();
      await page.unroute(pattern);
    }
  });

  test("failed paint retains the previous view and can be retried", async ({ page }) => {
    const section = page.locator("#showroom");
    const stage = section.locator('[aria-roledescription="carousel"]');
    const pattern = /gt3rs-guards-red-front34-\d+\.(avif|webp)/;
    await page.route(pattern, (route) => route.abort());
    await section.getByTitle("Guards Red", { exact: true }).click();
    await expect(section.getByRole("button", { name: "Try again", exact: true })).toBeVisible();
    await expect(section.getByRole("radio", { name: "Ice Grey Metallic", exact: true })).toBeChecked();
    await expect(stage.locator('img[src*="gt3rs-ice-grey-front34-"]')).toBeVisible();
    await page.unroute(pattern);
    await section.getByRole("button", { name: "Try again", exact: true }).click();
    await expect(section.getByRole("radio", { name: "Guards Red", exact: true })).toBeChecked();
    await expect(stage.locator("[data-layer]")).toHaveCount(1);
    await expect(stage.locator("[data-image-fallback]")).toHaveCount(0);
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

test("showroom initially fetches only the active paint and nearby full-size angles", async ({ page }) => {
  await openFast(page, "/#showroom");
  const stage = page.locator('#showroom [aria-roledescription="carousel"]');
  await stage.locator("img").evaluate((image) => (image as HTMLImageElement).decode());
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          performance
            .getEntriesByType("resource")
            .map((entry) => new URL(entry.name).pathname)
            .filter((path) => /gt3rs-ice-grey-(side|rear)-1280\.(avif|webp)$/.test(path)).length,
      ),
    )
    .toBeGreaterThanOrEqual(2);
  const paths = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => new URL(entry.name).pathname)
      .filter((path) => path.includes("/showroom/")),
  );
  expect(paths.some((path) => /gt3rs-(matte-black|gt-silver|guards-red)-/.test(path))).toBe(false);
  const largeIce = [
    ...new Set(paths.filter((path) => /gt3rs-ice-grey-.*-(1280|167\d)\.(avif|webp)$/.test(path))),
  ];
  expect(largeIce.length).toBeLessThanOrEqual(3);
});
