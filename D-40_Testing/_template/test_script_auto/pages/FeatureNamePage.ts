/**
 * FeatureNamePage — Page Object cho <FEATURE_NAME>
 * <BD Screen ID> (<Screen title>)
 *
 * TODO: Đổi tên file và class thành <FeatureName>Page
 *
 * Selectors dựa trên:
 *  - data-testid xác nhận từ source (ưu tiên nhất)
 *  - getByRole / getByLabel (semantic, không bị thay đổi khi refactor CSS)
 *  - HTML id / locator() là fallback cuối
 *
 * Route: TODO — ví dụ: /benefits/master/housing-management-companies (port 4005)
 *
 * ── GAP BD vs FE — ghi nhận để tránh assertion sai ───────────────────────────
 * TODO: liệt kê các điểm BD spec khác với FE thực tế
 * Ví dụ:
 *  - Null display: BD mong「-」, FE render「ー」
 *  - Status label: BD mong "Contract", FE map ACTIVE→「契約」
 */
import { expect, type Locator, type Page } from '@playwright/test';

/** Dữ liệu tối thiểu để tạo bản ghi mới hợp lệ — TODO: điều chỉnh theo form */
export interface NewRecordData {
  code: string;
  name: string;
  // TODO: thêm các field khác
}

/** Criteria cho filter/search — TODO: điều chỉnh theo filter form */
export interface FilterCriteria {
  code?: string;
  name?: string;
  // TODO: thêm các field khác
}

export class FeatureNamePage {
  readonly page: Page;

  // ── Toolbar ──────────────────────────────────────────────────────────────
  readonly newRegistrationBtn: Locator;
  // TODO: thêm các nút toolbar khác nếu có

  // ── Filter/Search ─────────────────────────────────────────────────────────
  // TODO: inline search hoặc filter modal — chọn pattern phù hợp
  // Pattern A — inline search (các input hiển thị trực tiếp trên trang):
  // readonly searchCodeInput: Locator;
  // Pattern B — filter modal (click button → mở dialog):
  // readonly filterBtn: Locator;
  // readonly filterModal: Locator;

  // ── Form modal (新規登録 & 編集 dùng chung component) ────────────────────
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly codeField: Locator;
  readonly nameField: Locator;
  readonly submitBtn: Locator;
  readonly cancelBtn: Locator;

  // ── Table ─────────────────────────────────────────────────────────────────
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;

    // ── Toolbar ──────────────────────────────────────────────────────────
    // TODO: đổi label về tiếng Nhật/tiếng Anh theo UI thực tế
    this.newRegistrationBtn = page.getByRole('button', { name: '新規登録' });

    // ── Form modal ───────────────────────────────────────────────────────
    this.modal = page.getByRole('dialog');
    this.modalTitle = this.modal.getByRole('heading');
    // TODO: đổi id/testid theo source code thực tế
    this.codeField = page.locator('#feature-form-code');
    this.nameField = page.locator('#feature-form-name');
    this.submitBtn = page.getByTestId('feature-form-submit');
    this.cancelBtn = page.getByTestId('feature-form-cancel');

    // ── Table ────────────────────────────────────────────────────────────
    // TODO: đổi testid theo source code thực tế
    this.table = page.getByTestId('feature-table');
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async goto() {
    // TODO: đổi route về path thực tế của màn hình
    await this.page.goto('/path/to/feature');
    await this.page.waitForLoadState('networkidle');
  }

  // ── Form modal actions ────────────────────────────────────────────────────

  async openNewRegistrationModal() {
    await this.newRegistrationBtn.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }

  async clickSubmit() {
    await this.submitBtn.click();
  }

  async fillForm(data: NewRecordData) {
    if (data.code !== undefined) await this.codeField.fill(data.code);
    if (data.name !== undefined) await this.nameField.fill(data.name);
    // TODO: thêm các field khác
  }

  // ── Table helpers ─────────────────────────────────────────────────────────

  /** Lấy locator của row chứa giá trị code nhất định */
  getTableRow(code: string): Locator {
    return this.table.getByRole('row').filter({ hasText: code });
  }

  getTableHeaders(): Locator {
    return this.table.getByRole('columnheader');
  }

  // ── Assertions ───────────────────────────────────────────────────────────

  async expectModalOpenWithTitle(expectedTitle: string) {
    await expect(this.modal).toBeVisible();
    await expect(this.modalTitle).toContainText(expectedTitle);
  }

  async expectModalClosed() {
    await expect(this.modal).not.toBeVisible({ timeout: 5_000 });
  }

  async expectSubmitDisabled() {
    await expect(this.submitBtn).toBeDisabled();
  }

  getFieldError(fieldId: string): Locator {
    return this.page
      .locator(`#${fieldId}`)
      .locator('xpath=ancestor::*[contains(@class,"form") or contains(@class,"field")][1]')
      .locator('[role="alert"], [class*="error"], p.text-danger');
  }
}
