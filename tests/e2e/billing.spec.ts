import { test, expect } from "@playwright/test";

test.skip(process.env.PLAYWRIGHT_SKIP_BROWSER === "1", "Playwright browser disabled by environment");

test.describe("Billing E2E", () => {
  test("login to access billing", async ({ page }) => {
    // Note: Magic link auth requires email delivery; for E2E, use seeded session or manual login
    // This test checks login form visibility
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send magic link/i })).toBeVisible();
  });

  test("navigate to billing settings", async ({ page }) => {
    // Test auth protection: should redirect to login if not authenticated
    await page.goto("/settings/billing");

    await expect(page).toHaveURL(/\/login/);
  });

  test("simulate subscription success", async ({ page }) => {
    // Test success page visibility (post-subscription redirect)
    await page.goto("/billing/success");

    // Expects redirect to login if unauthenticated; for full test, login first
    await expect(page).toHaveURL(/\/login/);
  });
});