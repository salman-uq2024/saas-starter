import { test, expect } from "@playwright/test";

test.skip(process.env.PLAYWRIGHT_SKIP_BROWSER === "1", "Playwright browser disabled by environment");

test("marketing homepage smoke", async ({ page }) => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const React = await import("react");
  const MarketingPage = (await import("@/app/(marketing)/page")).default as React.ComponentType;

  const html = renderToStaticMarkup(React.createElement(MarketingPage));
  await page.setContent(`<!DOCTYPE html>${html}`);

  await expect(page.getByRole("heading", { name: /fastest path to a production SaaS/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Launch demo workspace/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Read the docs/i })).toBeVisible();
});
