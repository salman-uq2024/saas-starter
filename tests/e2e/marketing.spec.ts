import { test, expect } from "@playwright/test";

test.skip(process.env.PLAYWRIGHT_SKIP_BROWSER === "1", "Playwright browser disabled by environment");

test("marketing homepage smoke", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /SaaS Starter – Built by Salman/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Launch demo workspace/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Read the docs/i })).toBeVisible();
});

test("legal pages are reachable", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: /Terms of Service/i })).toBeVisible();

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /Privacy Notice/i })).toBeVisible();
});
