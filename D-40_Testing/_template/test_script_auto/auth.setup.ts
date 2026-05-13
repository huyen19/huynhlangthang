/**
 * auth.setup.ts — Login và lưu token. Chạy 1 lần trước toàn bộ test suite.
 *
 * Credentials đọc từ .env.test (gitignored) — xem .env.test.example.
 * Chọn user: TEST_USER=<key> pnpm exec playwright test auth.setup.ts
 * Mặc định: DEFAULT_USER từ auth.fixture.ts
 */
import { test as setup } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { USERS, DEFAULT_USER, type UserKey } from './fixtures/auth.fixture';

// TODO: đổi về route thực tế của feature này
const TARGET_PAGE = '/';

const userKey = (process.env.TEST_USER as UserKey | undefined) ?? DEFAULT_USER;
const user = USERS[userKey];
const SESSION_FILE = path.join(__dirname, user.sessionFile);
const EMAIL = process.env[user.emailEnv];
const PASSWORD = process.env[user.passwordEnv];

setup('authenticate and save session token', async ({ page }) => {
  if (!EMAIL || !PASSWORD) {
    throw new Error(
      `Thiếu credentials cho user "${userKey}".\n` +
        `Tạo file .env.test (xem .env.test.example) với:\n` +
        `  ${user.emailEnv}=<email>\n` +
        `  ${user.passwordEnv}=<password>`,
    );
  }

  await page.goto(TARGET_PAGE);
  await page.waitForURL(/\/login/, { timeout: 30_000 });

  const emailInput = page
    .getByLabel(/メールアドレス|email/i)
    .or(page.locator('input[type="email"]'))
    .or(page.locator('input[name="email"]'))
    .first();

  const passwordInput = page
    .getByLabel(/パスワード|password/i)
    .or(page.locator('input[type="password"]'))
    .or(page.locator('input[name="password"]'))
    .first();

  await emailInput.fill(EMAIL);
  await passwordInput.fill(PASSWORD);

  const loginButton = page
    .getByRole('button', { name: /ログイン|login|サインイン|sign in/i })
    .first();

  await loginButton.click();

  // TODO: điều chỉnh URL pattern khớp với app đang test
  await page.waitForURL(
    (url) => !url.href.includes('/login'),
    { timeout: 60_000 },
  );

  await page.waitForLoadState('networkidle');

  const token = await page.evaluate((): string | null =>
    window.sessionStorage.getItem('employee_internal_token'),
  );

  if (!token) {
    throw new Error(
      'Auth setup thất bại: employee_internal_token không tìm thấy trong sessionStorage.\n' +
        'Kiểm tra: (1) credentials đúng chưa, (2) login flow hoàn tất chưa.',
    );
  }

  fs.mkdirSync(path.dirname(SESSION_FILE), { recursive: true });
  fs.writeFileSync(
    SESSION_FILE,
    JSON.stringify({ token, savedAt: new Date().toISOString() }, null, 2),
  );

  console.log(`✅ Auth setup hoàn tất. User: ${userKey} (${EMAIL}). Token lưu tại: ${SESSION_FILE}`);
});
