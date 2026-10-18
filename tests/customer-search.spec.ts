import { test, expect } from "@playwright/test";

test("顧客検索が正常に動作する", async ({ page }) => {
  // 고객 검색 화면 접속
  await page.goto("http://localhost:5173/");

  // 고객명 입력
  await page.getByRole("textbox").fill("田中");

  // 검색 버튼 클릭
  await page.getByRole("button", { name: "検索" }).click();

  // 검색 결과 확인
  await expect(page.getByText("C001 - 田中太郎")).toBeVisible();

  // Validator 실행 결과 확인
  await expect(page.getByText("Validator Agent: 成功")).toBeVisible();
});
