import { test } from "@playwright/test";

/**
 * Visual capture for design review (not an assertion suite).
 *   CAPTURE=1 npx playwright test visual
 * Writes PNGs to .visual/ (git-ignored).
 */
test.skip(!process.env.CAPTURE, "set CAPTURE=1 to record screenshots");

const out = (name: string) => `.visual/${name}.png`;

test("preloader frames", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.clock.install();
  await page.goto("/");
  let elapsed = 0;
  for (const ms of [500, 900, 1500, 2100, 2700, 3200, 3700, 4300, 5600]) {
    await page.clock.runFor(ms - elapsed);
    elapsed = ms;
    await page.screenshot({ path: out(`preloader-${String(ms).padStart(4, "0")}`) });
  }
});

test("sections", async ({ page }, info) => {
  await page.addInitScript(() => sessionStorage.setItem("gt3rs.intro-played", "1"));
  await page.goto("/");
  await page.waitForSelector('.preloader[data-state="done"]', { state: "attached", timeout: 9000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: out(`${info.project.name}-01-hero`) });
  for (const id of ["precision", "aerodynamics", "showroom", "details", "performance", "interior", "final"]) {
    await page.evaluate(
      (target) => document.getElementById(target)?.scrollIntoView({ behavior: "instant" }),
      id,
    );
    await page.waitForTimeout(1600);
    await page.screenshot({ path: out(`${info.project.name}-${id}`) });
  }
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: out(`${info.project.name}-footer`) });
});
