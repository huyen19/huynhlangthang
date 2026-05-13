---
name: sync-tc-results
description: Đồng bộ kết quả test từ HTML tracker (manual) hoặc Playwright JSON report (auto) ngược lại vào file TC markdown — cập nhật cột Result (Manual) hoặc Result (Auto) theo TC ID. Tối ưu token bằng cách gọi script thay vì xử lý file trực tiếp.
metadata:
  version: "1.0"
  author: QCTeam
  lastUpdate: "2026-05-07"
---

# Skill: Sync TC Results

## Dùng khi

- Sau khi tester đánh kết quả trên HTML tracker → muốn sync ngược lại vào file TC `.md`
- Sau khi chạy Playwright automation → muốn sync kết quả pass/fail vào file TC `.md`

## Không dùng khi

- File TC chưa có cột `Result (Manual)` / `Result (Auto)` → cần update format trước (xem bên dưới)
- Chưa có kết quả: chưa export JSON từ HTML, hoặc chưa chạy Playwright

---

## Các bước thực hiện

### Bước 1 — Xác định đầu vào

**Manual flow:**
1. Hỏi user đường dẫn file TC `.md`
2. Hỏi đường dẫn file JSON đã export từ HTML tracker (tên dạng `*_results_<timestamp>.json`)

**Auto flow:**
1. Hỏi user đường dẫn file TC `.md`
2. Tìm Playwright JSON report tại: `D-40_Testing/<feature>/report/playwright-report/results.json`
   - Nếu không có → hướng dẫn bật JSON reporter (xem cuối skill)

### Bước 2 — Gọi script

**Manual:**
```bash
node ".claude/skills/sync-tc-results/scripts/sync-tc-results.mjs" \
  --source=manual \
  --results="<đường-dẫn-export-json>" \
  --tc="<đường-dẫn-tc.md>"
```

**Auto:**
```bash
node ".claude/skills/sync-tc-results/scripts/sync-tc-results.mjs" \
  --source=auto \
  --report="<đường-dẫn-playwright-results.json>" \
  --tc="<đường-dẫn-tc.md>"
```

> Script chạy từ thư mục gốc repo (`1848_FE_Source/`).

### Bước 3 — Đọc output và báo cáo

Script in ra:
```
[Manual sync] TC_DSP-BENEFIT-12_HMCM.md
  Cột target : "Result (Manual)" (index 11)
  Updated    : 45 TC
  Not found  : 2 TC
    - TC-HMCM-S03-007
    - TC-HMCM-S05-012
```

Báo cáo lại cho user: số TC đã update, TC không tìm thấy (nếu có).

---

## Tiền điều kiện: Format file TC

File TC phải có **14 cột** với header:

```markdown
| TC ID | TVP ID | Sub-section | Test Description | Preconditions | Test Steps | Test Data | Expected Result | Test Type | Priority | Actual | Result (Manual) | Result (Auto) | Note |
```

Nếu file đang ở format cũ 13 cột (có cột `Status` thay vì `Result (Manual)`):
- Script manual vẫn chạy được (tự nhận cột `Status` như `Result (Manual)`)
- Script auto **KHÔNG** chạy được nếu thiếu cột `Result (Auto)` → cần thêm cột thủ công hoặc dùng `/write-manual-tests` để gen lại

---

## Bật Playwright JSON Reporter

Cột `Result (Auto)` cần Playwright JSON reporter. Thêm vào `playwright.config.ts` của feature:

```typescript
reporter: [
  ['html', { outputFolder: '../report/playwright-report', open: 'never' }],
  ['list'],
  ['json', { outputFile: '../report/playwright-report/results.json' }],
],
```

Sau đó chạy:
```bash
npx playwright test --config playwright.config.ts
```

File `results.json` sẽ được tạo tại `D-40_Testing/<feature>/report/playwright-report/results.json`.

---

## Mapping giá trị

| HTML tracker status | Result (Manual) |
|---------------------|-----------------|
| `pass` | `PASS` |
| `fail` | `FAIL` |
| `impact` | `IMPACT` |
| `notrun` | `Not Run` |
| `open` | `Open` |
| `skip` | `Skip` |

| Playwright status | Result (Auto) |
|-------------------|---------------|
| `expected` (passed) | `PASS` |
| `unexpected` (failed) | `FAIL` |
| `skipped` | `Skip` |

---

## Quy tắc quan trọng

- Script **chỉ update đúng cột** tương ứng (manual/auto) — không overwrite cột còn lại
- TC nằm trong JSON nhưng không tìm thấy trong MD → warning, không crash
- Nếu file TC có nhiều table (nhiều section), script scan toàn bộ file và update tất cả TC match
