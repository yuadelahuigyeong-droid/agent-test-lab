import { test, expect } from "@playwright/test";

test("顧客検索が0件の場合に結果なしのメッセージを表示する", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("textbox").fill("存在しない顧客");
  await page.getByRole("button", { name: "検索", exact: true }).click();

  // 初期表示と区別するため、検索後の実行ログを確認する。
  await expect(
    page.getByText("Search Agent: 0件取得", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Validator Agent: 成功", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("検索結果がありません。", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("検索中にエラーが発生しました。", { exact: true }),
  ).toBeHidden();
});
