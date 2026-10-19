import { test, expect } from "@playwright/test";

test("TC-01 正常検索", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("顧客名を入力", { exact: true }).fill("田中");
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

test("TC-02 検索結果0件", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page
    .getByPlaceholder("顧客名を入力", { exact: true })
    .fill("存在しない顧客");
  await page.getByRole("button", { name: "検索", exact: true }).click();

  // 初期画面にも結果なしのメッセージがあるため、検索後のログを先に確認する。
  await expect(
    page.getByText("Search Agent: 0件取得", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Validator Agent: 成功", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("検索結果がありません。", { exact: true }),
  ).toBeVisible();
});

test("TC-03 API通信エラー", async ({ page }) => {
  await page.route("**/api/customers?*", async (route) => {
    await route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Validator server unavailable",
        logs: [
          "Search Agent: 検索開始",
          "Search Agent: 1件取得",
          "Validator Agent: HTTP検証開始",
          "Validator Agent: 通信エラー",
        ],
      }),
    });
  });

  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("顧客名を入力", { exact: true }).fill("田中");
  await page.getByRole("button", { name: "検索", exact: true }).click();

  await expect(
    page.getByText("検索中にエラーが発生しました。", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Validator Agent: 通信エラー", { exact: true }),
  ).toBeVisible();
});
