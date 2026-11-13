import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests against the static export (`out/`), served the way
 * Cloudflare Pages serves it. Uses the locally installed Google Chrome
 * (channel "chrome") — no browser download needed.
 *   npm run build && npm run test:e2e
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  fullyParallel: true,
  // The suite measures real animation timing; keep CPU contention moderate.
  workers: 3,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    channel: "chrome",
    trace: "off",
  },
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
});
