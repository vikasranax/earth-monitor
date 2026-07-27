import { expect, test } from "@playwright/test";

test("boot screen comes online with module manifest", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Jagat-Manthan");
  await expect(page.getByText("M01 · FOUNDATION & DEVEX")).toBeVisible();
  await expect(page.getByText("ONLINE").first()).toBeVisible();
});

test("404 renders the signal-lost screen", async ({ page }) => {
  await page.goto("/this-coordinate-does-not-exist");
  await expect(page.getByText("SIGNAL LOST · 404")).toBeVisible();
});