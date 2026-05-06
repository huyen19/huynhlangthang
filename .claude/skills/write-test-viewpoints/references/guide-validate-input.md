# Guide: Validation Input Test Coverage

Dùng khi viết TC cho **bất kỳ field input nào** có validation rule — trong modal Create, Edit, hoặc Import.

---

## Checklist coverage theo Test Type

Với mỗi field, đi qua từng dòng bên dưới và tạo TC nếu điều kiện áp dụng:

| # | Kịch bản cần cover | Test Type | Điều kiện áp dụng |
|---|-------------------|-----------|------------------|
| 1 | Bỏ trống field bắt buộc → inline error | Validation | Field có required (*) |
| 2 | Nhập khoảng trắng (spaces only) → vẫn báo required | Validation | Field có required (*) |
| 3 | Nhập sai format (email, mã code, số điện thoại...) → inline error | Validation | Field có format rule |
| 4 | Nhập sai pattern (chữ thường khi chỉ nhận hoa, ký tự không cho phép...) → inline error | Validation | Field có pattern rule |
| 5 | Field conditional required: field A rỗng → field B không bắt buộc; field A có giá trị → field B bắt buộc | Validation | Có cross-field dependency |
| 6 | Nhập đúng maxlength — chấp nhận | Edge Case | Field có maxlength |
| 7 | Nhập maxlength + 1 — bị block hoặc cắt bớt | Edge Case | Field có maxlength |
| 8 | Nhập đúng minlength — chấp nhận | Edge Case | Field có minlength |
| 9 | Nhập minlength - 1 — báo lỗi | Edge Case | Field có minlength |
| 10 | Nhập ký tự tiếng Nhật: hiragana, katakana (全角 và 半角) | Data | Field chứa text; áp dụng cho toàn bộ dự án |
| 11 | Nhập Unicode, ký tự đặc biệt (!, @, #, ¥...) | Data | Field text không giới hạn charset |
| 12 | Nhập khoảng trắng đầu/cuối — hệ thống trim hay giữ nguyên? | Edge Case | Spec cần ghi rõ behavior |
| 13 | Nhập SQL injection pattern (vd: `' OR 1=1--`) | Negative | Field text bất kỳ có submit API |
| 14 | Nhập XSS pattern (vd: `<script>alert(1)</script>`) | Negative | Field text bất kỳ có submit API |
| 15 | Nhập ký tự bị cấm rõ ràng theo spec | Negative | Spec liệt kê disallowed chars |

---

## Quy tắc Expected Result cho TC validation

1. **Phải ghi chính xác nội dung inline error** — không viết "hiển thị lỗi" chung chung
   - ✅ `Inline error hiển thị:「管理会社コードを入力してください。」`
   - ❌ `Hiển thị thông báo lỗi`

2. **Format Expected Result** — dùng `<br>` và đánh số:
   ```
   1. Inline error hiển thị dưới [tên field]:「...」<br>2. Modal không đóng<br>3. Không có request API nào được gọi
   ```

3. **Nếu spec định nghĩa mã lỗi** — ghi cả mã lẫn nội dung message, không chỉ ghi một trong hai
   - ✅ `Inline error:「VAL-001: 管理会社コードを入力してください。」`
   - ✅ `Inline error:「E001: 必須項目です。」` ← spec dùng format khác vẫn áp dụng cùng quy tắc
   - ❌ Chỉ ghi mã: `VAL-001` (thiếu message — tester không biết text kỳ vọng là gì)
   - ❌ Chỉ ghi message mà bỏ mã (nếu spec có định nghĩa mã)

---

## Lưu ý project-specific

- **Japanese input**: Luôn test cả full-width (全角) và half-width (半角) cho các field katakana — vì frontend thường restrict 全角 katakana only
- **Error message**: Giữ nguyên tiếng Nhật, không dịch, không paraphrase
- **Trim behavior**: Nếu spec không ghi rõ → đánh dấu `[⚠️ Need Confirm]` trong Note column thay vì tự giả định
