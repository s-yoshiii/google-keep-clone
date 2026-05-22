import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    headless: false,   // ブラウザを画面に表示してテストを実行する
    slowMo: 500,       // 操作と操作の間に 500ms の待機を入れる（動きが見やすくなる）
  },
});
