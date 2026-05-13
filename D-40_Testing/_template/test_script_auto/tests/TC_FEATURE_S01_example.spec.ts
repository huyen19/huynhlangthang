/**
 * TC_FEATURE_S01 — Section 1: <Tên Section> (ví dụ: 画面初期化 & レイアウト)
 *
 * TODO: Đổi tên file thành TC_<FEATURE>_S<NN>_<section-slug>.spec.ts
 *
 * Tài liệu tham chiếu: TC_FEATURE_NAME.md (Section 1, TC-XXX-S01-001 ~ NNN)
 * TVP: TVP-001 ~ TVP-00N
 *
 * ── GAP BD vs FE — CÁC TEST DỰ KIẾN THẤT BẠI ────────────────────────────────
 * TODO: liệt kê các GAP đã biết để tránh nhầm lẫn bug vs known-gap
 * Ví dụ:
 * [GAP-01] TC-S01-003: BD mong X, FE thực tế là Y → test FAIL có chủ đích
 *
 * Chiến lược mock:
 *  - GET /<resource> → mock stable list để page load ổn định
 *  - Route handler đăng ký TRƯỚC page.goto() theo chuẩn Playwright
 *
 * Mock response format — kiểm tra FE source để biết envelope thực tế:
 *   { success: true, data: { items: [...], page, pageSize, totalItems, totalPages } }
 */
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import { FeatureNamePage } from '../pages/FeatureNamePage';

// ── Mock data ──────────────────────────────────────────────────────────────
// TODO: điều chỉnh fields theo API response thực tế

const MOCK_ITEMS = [
  {
    id: 1,
    code: 'CODE-001',
    name: 'テストデータ A',
    status: 'ACTIVE',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    code: 'CODE-002',
    name: 'テストデータ B',
    status: 'SUSPENDED',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

function buildListResponse(items = MOCK_ITEMS, totalItems = MOCK_ITEMS.length) {
  return {
    success: true,
    data: { items, page: 1, pageSize: 20, totalItems, totalPages: 1 },
  };
}

// ── Helper: mock list API ──────────────────────────────────────────────────
// TODO: đổi URL pattern về endpoint thực tế
// Luôn dùng glob pattern (**/api/...) — không hardcode origin

async function mockListApi(
  page: Page,
  responseBody = buildListResponse(),
) {
  await page.route('**/api/v1/<module>/<resource>*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, json: responseBody });
    } else {
      await route.continue();
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 — <TÊN SECTION> (TVP-001 ~ TVP-00N)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('S01 — <Tên Section>', () => {
  let featurePage: FeatureNamePage;

  test.beforeEach(async ({ page }) => {
    featurePage = new FeatureNamePage(page);
    await mockListApi(page);
    await featurePage.goto();
  });

  // ── TVP-001: Page title ───────────────────────────────────────────────────

  test('TC-XXX-S01-001 | TVP-001 | Page title hiển thị đúng', async ({ page }) => {
    // TODO: đổi heading text về tên màn hình thực tế
    await expect(
      page.getByRole('heading', { name: '<Tên màn hình>' }),
    ).toBeVisible();
  });

  // ── TVP-002: Toolbar ──────────────────────────────────────────────────────

  test('TC-XXX-S01-002 | TVP-002 | Toolbar hiển thị đủ các nút bắt buộc', async () => {
    await expect(featurePage.newRegistrationBtn).toBeVisible();
    // TODO: thêm các assertion cho nút khác
  });

  // ── TVP-003: API auto-call ────────────────────────────────────────────────

  test('TC-XXX-S01-003 | TVP-003 | Màn hình tự động gọi API khi vào trang', async ({ page }) => {
    const capturedRequests: URL[] = [];

    // Override route để capture request
    await page.unroute('**/api/v1/<module>/<resource>*');
    await page.route('**/api/v1/<module>/<resource>*', async (route) => {
      if (route.request().method() === 'GET') {
        capturedRequests.push(new URL(route.request().url()));
        await route.fulfill({ status: 200, json: buildListResponse() });
      } else {
        await route.continue();
      }
    });

    await page.goto('/path/to/feature');
    await page.waitForLoadState('networkidle');

    expect(capturedRequests.length).toBeGreaterThan(0);
    expect(capturedRequests[0].searchParams.get('page')).toBe('1');
  });

  // ── TVP-004: Table headers ────────────────────────────────────────────────

  test('TC-XXX-S01-004 | TVP-004 | Table header hiển thị đủ các cột', async () => {
    // TODO: đổi tên cột về header thực tế
    await expect(featurePage.table.getByRole('columnheader', { name: 'コード' })).toBeVisible();
    await expect(featurePage.table.getByRole('columnheader', { name: '名称' })).toBeVisible();
    await expect(featurePage.table.getByRole('columnheader', { name: '状態' })).toBeVisible();
    await expect(featurePage.table.getByRole('columnheader', { name: '操作' })).toBeVisible();
  });

  // ── TVP-005: Empty state ──────────────────────────────────────────────────

  test('TC-XXX-S01-005 | TVP-005 | Hiển thị empty state khi không có dữ liệu', async ({ page }) => {
    await page.unroute('**/api/v1/<module>/<resource>*');
    await page.route('**/api/v1/<module>/<resource>*', async (route) => {
      await route.fulfill({ status: 200, json: buildListResponse([], 0) });
    });

    await page.goto('/path/to/feature');
    await page.waitForLoadState('networkidle');

    // TODO: đổi text về empty message thực tế của FE
    await expect(page.getByText(/データがありません|no data|empty/i)).toBeVisible();
  });
});
