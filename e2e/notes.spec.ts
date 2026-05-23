import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpassword123';

test.beforeEach(async ({ page }) => {
  // confirmダイアログを自動承認（ここで一度だけ登録する）
  page.on('dialog', (dialog) => dialog.accept());

  // ログイン
  await page.goto('/login');
  await page.fill('#email', TEST_EMAIL);
  await page.fill('#password', TEST_PASSWORD);
  await page.click('button:has-text("ログイン")');
  await page.waitForURL('/');
});

test.afterEach(async ({ page }) => {
  // テストで作ったメモを後片付け
  const cards = page.locator('.note-card');
  if ((await cards.count()) > 0) {
    await cards.first().hover();
    await page
      .locator('.note-card__actions .note-card__action-btn')
      .last()
      .click();
  }
});

test('メモを作成できる', async ({ page }) => {
  await page.click('button:has-text("新しいメモ")');
  await page.fill('input[placeholder="タイトル"]', 'E2Eテストメモ');
  await page.fill('textarea', 'これはテストです');
  await page.click('button:has-text("保存")');

  await expect(page.getByText('E2Eテストメモ').first()).toBeVisible();
});

test('メモを削除できる', async ({ page }) => {
  // タイムスタンプで毎回ユニークなタイトルにする
  const title = `削除テスト_${Date.now()}`;

  // ① メモを作成
  await page.click('button:has-text("新しいメモ")');
  await page.fill('input[placeholder="タイトル"]', title);
  await page.click('button:has-text("保存")');
  await expect(page.getByText(title)).toBeVisible();

  // ② カードにホバーして削除ボタンをクリック
  await page.locator('.note-card').first().hover();
  await page
    .locator('.note-card')
    .first()
    .locator('.note-card__action-btn')
    .last()
    .click();

  // ③ メモが消えることを確認
  await expect(page.getByText(title)).not.toBeVisible();
});

test('メモを編集できる', async ({ page }) => {
  const title = `編集テスト_${Date.now()}`;
  const newTitle = `編集済み_${Date.now()}`;
  // ① メモを作成
  await page.click('button:has-text("新しいメモ")');
  await page.fill('input[placeholder="タイトル"]', title);
  await page.fill('textarea', 'これはテストです');
  await page.click('button:has-text("保存")');
  // ② カードをクリックしてモーダルを開く
  await page.locator('.note-card').first().hover();
  await page.locator('.note-card').first().click();
  // ③ タイトルを書き換えて保存
  await page.fill('input[placeholder="タイトル"]', newTitle);
  await page.click('button:has-text("保存")');
  // ④ 更新後のタイトルが表示されることを確認
  await expect(page.getByText(newTitle)).toBeVisible();
});
