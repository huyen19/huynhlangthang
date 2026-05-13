import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.test — credentials cho test accounts (gitignored, xem .env.test.example)
const envTestPath = path.join(__dirname, '.env.test');
if (fs.existsSync(envTestPath)) {
  for (const line of fs.readFileSync(envTestPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

/**
 * Playwright config template — copy cho mỗi feature mới.
 *
 * ── CHECKLIST KHI TẠO FEATURE MỚI ──────────────────────────────────────────
 * 1. Đổi baseURL về port của app tương ứng:
 *    mdm=3001 | staffing=4001 | attendance=4002 | inventory=4003
 *    education=4004 | benefits=4005 | license=4006 | mypage=4007
 *
 * 2. Chạy setup một lần từ D-40_Testing/:
 *    pnpm install && pnpm exec playwright install chromium
 *
 * 3. Chạy auth setup để tạo session.json:
 *    pnpm exec playwright test auth.setup.ts --config playwright.config.ts
 *
 * Commands:
 *   pnpm test              — chạy toàn bộ (trong test_script_auto/)
 *   pnpm test:headed       — chạy có browser hiển thị
 *   pnpm test:ui           — Playwright UI mode (debug)
 *   pnpm test:report       — mở HTML report
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ['html', { outputFolder: '../report/playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: '../report/playwright-report/results.json' }],
  ],

  use: {
    // TODO: đổi port theo app — xem checklist bên trên
    baseURL: process.env.BASE_URL ?? 'http://localhost:3001',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    viewport: { width: 1920, height: 1080 },
  },

  projects: [
    {
      name: 'setup',
      testDir: '.',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
});
