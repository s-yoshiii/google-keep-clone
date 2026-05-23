import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'test@example.com'; // 作成したテストアカウントのメールアドレスに変更
const TEST_PASSWORD = 'testpassword123'; // 作成したテストアカウントのパスワードに変更

test('ログインできる', async ({ page }) => {
  // ① ログインページを開く
  await page.goto('/login');

  // ② メールアドレスとパスワードを入力
  await page.fill('#email', TEST_EMAIL);
  await page.fill('#password', TEST_PASSWORD);

  // ③ ログインボタンをクリック
  await page.click('button:has-text("ログイン")');

  // ④ ホーム画面に遷移することを確認
  await expect(page).toHaveURL('/');
  await expect(page.getByText('すべてのメモ')).toBeVisible();
});

test('間違ったパスワードではログインできない', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', TEST_EMAIL);
  await page.fill('#password', 'wrongpassword');

  await page.click('button:has-text("ログイン")');

  // エラーメッセージが表示されることを確認
  await expect(page.getByText('ログインに失敗しました')).toBeVisible();
  // ログインページに留まることを確認
  await expect(page).toHaveURL('/login');
});

test('ログアウトできる', async ({ page }) => {
  // ① /login に移動（goto）
  await page.goto('/login');

  // ② メールアドレスとパスワードを入力
  await page.fill('#email', TEST_EMAIL);
  await page.fill('#password', TEST_PASSWORD);

  // ③ ログインボタンをクリック
  await page.click('button:has-text("ログイン")');

  // ④rootに遷移するのを待つ（waitForURL）
  await expect(page).toHaveURL('/');
  await expect(page.getByText('すべてのメモ')).toBeVisible();

  // ⑤グアウトボタンをクリック
  await page.click('.home-header__logout-btn');
  // ⑥ /login に戻ることを確認
  await expect(page).toHaveURL('/login');
});
