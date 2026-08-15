import { test, expect } from "@playwright/test";

test.describe("Earth Monitor — smoke tests", () => {
  test("home page loads and shows the brand", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("EARTH MONITOR", { exact: true })).toBeVisible();
  });

  test("command palette opens via the ⌘K button", async ({ page }) => {
    await page.goto("/");
    await page.getByText("K", { exact: true }).click();
    await expect(page.getByPlaceholder("Type a command…")).toBeVisible();
  });

  test("command palette closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByText("K", { exact: true }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByPlaceholder("Type a command…")).not.toBeVisible();
  });

  test("map page loads with the Leaflet container", async ({ page }) => {
    await page.goto("/map");
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 10000 });
  });

  test("power structure page loads live data", async ({ page }) => {
    await page.goto("/power-structure");
    await expect(page.getByText(/officeholders found/)).toBeVisible({ timeout: 15000 });
  });

  test("navigating from home to markets works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Markets/i }).click();
    await expect(page).toHaveURL(/\/markets/);
  });
});
