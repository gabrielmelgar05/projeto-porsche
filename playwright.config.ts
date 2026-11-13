import { defineConfig } from "@playwright/test";

const externalServer = process.env.QA_BASE_URL;
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 45000,
  expect: { timeout: 8000 },
  workers: 3,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: externalServer || "http://127.0.0.1:43117",
    headless: true,
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: externalServer
    ? undefined
    : {
        command: "npm run dev -- --hostname 127.0.0.1 --port 43117",
        url: "http://127.0.0.1:43117",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
});
