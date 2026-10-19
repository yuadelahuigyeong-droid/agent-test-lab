import { test, expect } from "@playwright/test";

test("顧客検索の正常系", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("textbox", { name: "顧客名を入力" }).fill("田中");

  await page.getByRole("button", { name: "検索" }).click();

  await expect(page.getByText("C001 - 田中太郎")).toBeVisible();
});
