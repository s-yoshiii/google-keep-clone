import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpassword123';
test.beforeEach(async ({ page }) => {
  // ログイン（notes.spec.ts と同じ）
  page.on('dialog', (dialog) => dialog.accept());

  // ログイン
  await page.goto('/login');
  await page.fill('#email', TEST_EMAIL);
  await page.fill('#password', TEST_PASSWORD);
  await page.click('button:has-text("ログイン")');
  await page.waitForURL('/');
});

test.afterEach(async ({ page }) => {
  // 作成したラベルを削除
  const labels = page.locator('.label-sidebar__label-btn');
  if ((await labels.count()) > 0) {
    await labels.first().hover();
    await page.locator('.label-sidebar__delete-btn').last().click();
  }
});

test('ラベルを作成できる', async ({ page }) => {
  const labelName = `テストラベル_${Date.now()}`;
  // ① + ボタンをクリック
  await page.click('.label-sidebar__add-btn');
  // ② ラベル名を入力
  await page.fill('#label-name', labelName);
  // ③ 作成ボタンをクリック
  await page.click('button:has-text("作成") ');
  // ④ サイドバーに表示されることを確認
  await expect(page.getByText(labelName)).toBeVisible();
});
