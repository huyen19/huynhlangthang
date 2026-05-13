/**
 * evidence.fixture.ts — Tự động chụp screenshot + lưu video sau mỗi test vào evidence/
 * với tên file dựa trên TC ID.
 *
 * Naming:
 *   {TC_ID}-{status}.png   — screenshot toàn trang
 *   {TC_ID}-{status}.webm  — video (chỉ khi playwright.config bật video recording)
 *
 * Ví dụ: TC-HMCM-S01-001-passed.png / TC-HMCM-S01-001-passed.webm
 *
 * Extend từ auth.fixture để giữ nguyên token injection.
 * Dùng { auto: true } — chạy tự động cho mọi test mà không cần khai báo trong test.
 */
import fs from 'node:fs';
import path from 'node:path';

import { test as authTest, expect } from './auth.fixture';

const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'evidence');

type EvidenceFixtures = {
  autoEvidence: void;
};

export const test = authTest.extend<EvidenceFixtures>({
  autoEvidence: [
    async ({ page }, use, testInfo) => {
      await use();

      if (testInfo.status === 'skipped') return;

      // Extract TC ID từ test title — vd: "TC-HMCM-S01-001 | TVP-001 | ..."
      const match = testInfo.title.match(/TC-[\w-]+/);
      const tcId = match ? match[0] : `TC-UNKNOWN-${testInfo.workerIndex}`;
      const status = testInfo.status ?? 'unknown';

      fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

      // 1. Screenshot — chụp khi page còn mở
      const screenshotPath = path.join(EVIDENCE_DIR, `${tcId}-${status}.png`);
      try {
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await testInfo.attach(tcId, {
          path: screenshotPath,
          contentType: 'image/png',
        });
      } catch {
        // Page đã đóng (crash/timeout) — bỏ qua
      }

      // 2. Video — page.video() trả về null nếu config không bật video recording.
      // saveAs() chờ đến khi page đóng mới finalize, nên phải close page trước.
      const video = page.video();
      if (video) {
        const videoPath = path.join(EVIDENCE_DIR, `${tcId}-${status}.webm`);
        try {
          await page.close(); // finalize video recording
          await video.saveAs(videoPath);
          await testInfo.attach(`${tcId}-video`, {
            path: videoPath,
            contentType: 'video/webm',
          });
        } catch {
          // Video không khả dụng — bỏ qua
        }
      }
    },
    { auto: true },
  ],
});

export { expect };
