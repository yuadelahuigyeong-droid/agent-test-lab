import { test, expect } from "@playwright/test";

test("TC-01 正常検索", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("textbox", { name: "顧客名を入力" }).fill("田中");
  await page.getByRole("button", { name: "検索", exact: true }).click();

  await expect(
    page.getByText("C001 - 田中太郎", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Search Agent: 1件取得", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Validator Agent: 成功", { exact: true }),
  ).toBeVisible();
});
