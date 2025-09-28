import { defineConfig, devices } from "@playwright/test";

const port = process.env.PORT ?? "3100";
const shouldStartServer = process.env.PLAYWRIGHT_WEB_SERVER !== "0";
const fallbackBaseURL = `http://127.0.0.1:${port}`;
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL ?? (shouldStartServer ? fallbackBaseURL : undefined);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: shouldStartServer
    ? {
        command: `cross-env PORT=${port} next start -H 127.0.0.1 -p ${port}`,
        url: fallbackBaseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
