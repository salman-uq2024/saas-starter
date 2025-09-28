import { test, expect } from "@playwright/test";

test("marketing homepage smoke", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /production SaaS/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Start the demo/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Docs/i })).toBeVisible();
});
