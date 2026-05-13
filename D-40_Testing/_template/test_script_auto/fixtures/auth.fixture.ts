/**
 * auth.fixture.ts — USERS catalog + sessionStorage token injection.
 *
 * Thêm account mới: thêm entry vào USERS, thêm credentials vào .env.test.
 * Chọn user khi chạy: TEST_USER=<key> pnpm test  (mặc định: DEFAULT_USER)
 * Xem .env.test.example để biết env vars cần thiết.
 */
import { test as base, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// ── USERS catalog — thêm/bỏ account tại đây ──────────────────────────────
export const USERS = {
  // TODO: đổi key và label theo role thực tế của feature này
  default_user: {
    label: 'Default User',
    emailEnv: 'USER_DEFAULT_EMAIL',
    passwordEnv: 'USER_DEFAULT_PASSWORD',
    sessionFile: '.auth/session-default.json',
  },
  // Thêm role mới theo pattern:
  // <key>: {
  //   label: '<tên hiển thị>',
  //   emailEnv: 'USER_<KEY>_EMAIL',
  //   passwordEnv: 'USER_<KEY>_PASSWORD',
  //   sessionFile: '.auth/session-<key>.json',
  // },
} as const;

export type UserKey = keyof typeof USERS;
export const DEFAULT_USER: UserKey = 'default_user';

// ─────────────────────────────────────────────────────────────────────────────

const userKey = (process.env.TEST_USER as UserKey | undefined) ?? DEFAULT_USER;
const SESSION_FILE = path.join(__dirname, '..', USERS[userKey].sessionFile);

export const test = base.extend({
  page: async ({ page }, use) => {
    if (!fs.existsSync(SESSION_FILE)) {
      throw new Error(
        `Session file không tồn tại: ${SESSION_FILE}\n` +
          `Chạy auth setup cho user "${userKey}":\n` +
          `  TEST_USER=${userKey} pnpm exec playwright test auth.setup.ts`,
      );
    }

    const { token } = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8')) as {
      token: string;
      savedAt: string;
    };

    await page.addInitScript((t: string) => {
      window.sessionStorage.setItem('employee_internal_token', t);
    }, token);

    await use(page);
  },
});

export { expect };
