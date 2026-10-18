import { test, expect } from "@playwright/test";

test("検証サーバーの通信エラーを表示する", async ({ page }) => {
  // Validator 서버 장애를 API 응답으로 재현
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

  await page.getByRole("textbox").fill("田中");
  await page.getByRole("button", { name: "検索" }).click();

  await expect(page.getByText("検索中にエラーが発生しました。")).toBeVisible();

  await expect(page.getByText("Validator Agent: 通信エラー")).toBeVisible();
});
