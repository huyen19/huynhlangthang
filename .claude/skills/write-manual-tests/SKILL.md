---
name: write-manual-tests
description: Viết manual test cases theo format bảng chuẩn từ TVP hoặc AC — phân loại theo Test Type (UI, Functional, Validation, Integration, Negative, Edge Case, Data) và risk priority.
metadata:
  version: "2.0"
  author: QCTeam
  lastUpdate: "2026-04-25"
  input: "TVP report từ write-test-viewpoints hoặc detail_design/<module>/<feature>.md"
  output: "D-40_Testing/<subsystem>/<screen>/test_cases_manual/TC_[ScreenID]_[ABBR].md"
---

# Skill: Write Manual Tests

## Dùng skill này khi

- Đã có test viewpoints hoặc AC, cần sinh test case để tester chạy tay
- Cần phủ negative case và edge case mà E2E automation khó mô phỏng
- Cần tài liệu kiểm thử cho sprint review hoặc UAT

## Không dùng skill này khi

- Chưa có spec hay AC rõ ràng → dùng `write-test-viewpoints` trước
- Chỉ cần script chạy tự động → dùng `write-e2e-script`

## Đầu vào

- Báo cáo từ `write-test-viewpoints`, hoặc
- `detail_design/<module>/<feature>.md`, hoặc
- Mô tả feature + danh sách behaviors

## Các bước thực hiện

## 1. Hiểu TVP
- Xác định mục đích của từng TVP
- Xác định các điểm logic kinh doanh, xác thực và tích hợp có liên quan

### 1.1. TVP Decomposition — Bắt buộc trước khi viết TC (CRITICAL)

- Trước khi viết TC, **liệt kê rõ tất cả các item** được đề cập bên trong mỗi TVP: button, field, role, trạng thái, điều kiện.  
- Sau đó **xác nhận mỗi item sẽ có ít nhất 1 TC riêng**.

| Kiểu item trong TVP | Yêu cầu tách TC |
|---|---|
| Nhiều button (vd: `承認 / 完了 / 削除 / 取込実行`) | 1 TC cho mỗi button |
| Nhiều role (vd: `担当者` và `上長`) | 1 TC cho mỗi role × mỗi action |
| Nhiều trạng thái đơn (vd: `申請 / 承認 / 完了`) | 1 TC cho mỗi trạng thái |
| Nhiều field input | 1 TC cho mỗi field (nếu behavior khác nhau) |

**Ví dụ:** TVP-BAL-101 nhắc đến `承認 / 完了 / 削除 / 取込実行` → tạo **4 TC riêng biệt**, mỗi TC cho 1 button.  
❌ Sai: Chỉ viết 1 TC cho `承認`, bỏ qua `完了`, `削除`, `取込実行`.

## 2. Apply Test Design Techniques (IMPORTANT)

Chọn kỹ thuật phù hợp với từng TVP dựa trên Test Type và đặc điểm dữ liệu:

| Kỹ thuật | Áp dụng cho Test Type | Khi nào dùng |
|----------|----------------------|--------------|
| Equivalence Partitioning | Validation, Edge Case, Data | Field có nhiều nhóm giá trị hợp lệ / không hợp lệ. **Mỗi equivalence class → 1 TC riêng biệt** (không gộp nhiều class vào 1 TC dù cùng TVP) |
| Boundary Value Analysis | Edge Case, Data | Field có giới hạn ký tự, ngưỡng số, khoảng ngày |
| Decision Table | Validation, Integration | Nhiều điều kiện kết hợp ảnh hưởng đến kết quả |
| State Transition | UI, Functional, Negative | Entity có nhiều trạng thái chuyển đổi (申請→承認→完了) |
| Negative Testing | Negative | Input sai, thiếu quyền, API trả lỗi |
| Error Guessing | Negative, Edge Case | Spec mơ hồ — phán đoán điểm dễ vỡ từ kinh nghiệm |
| Use Case Testing | Functional, Integration | Luồng chính từ TVP Happy Path |
| Idempotency / Retry | Integration | TVP có submit form, nguy cơ double-submit |

## 3. Tạo test case

Với mỗi TVP, gán **Test Type** theo bảng dưới và tạo TC tương ứng:

| Test Type | Khi nào tạo | Ví dụ điển hình |
|-----------|------------|-----------------|
| **UI** | TVP kiểm tra layout, label tĩnh, hiển thị trực quan — không có logic nghiệp vụ | Page title đúng; button hiển thị đúng vị trí; badge đúng màu; placeholder đúng |
| **Functional** | TVP kiểm tra luồng chính (happy path) và hành vi nghiệp vụ khi user tương tác | Click nút → modal mở; submit form hợp lệ → record được lưu; trạng thái chuyển đúng |
| **Validation** | TVP kiểm tra rule nhập liệu: required, maxlength, pattern, format | Bỏ trống field bắt buộc → inline error; vượt maxlength → bị block |
| **Integration** | TVP kiểm tra tích hợp API: request body, response mapping, status code | POST body gửi đúng field; response 201 → modal đóng; toast xanh hiển thị |
| **Negative** | TVP kiểm tra xử lý lỗi, thiếu quyền, input sai | API 500 → error state + nút 再試行; user không có role → redirect /403 |
| **Edge Case** | TVP kiểm tra giá trị biên và trạng thái hiếm gặp | Maxlength đúng ranh giới (n) và n+1; 0 bản ghi → empty state; double-submit |
| **Data** | TVP kiểm tra dữ liệu đặc biệt, ký tự, encoding, và DB↔UI mapping | Ký tự tiếng Nhật full-width/half-width; Unicode; dữ liệu DB khớp UI; sort DB vs UI |

**Quy tắc sinh TC:**
- Mỗi TVP → ít nhất 1 TC
- **Mỗi item được liệt kê trong TVP → 1 TC riêng**
- TVP Priority Critical hoặc High → bắt buộc có cả TC positive lẫn negative
- **EP/BVA**: Mỗi equivalence class hoặc boundary point → 1 TC riêng. ❌ Không dùng "Scenario A / B / C" trong cùng 1 TC row

## 4. Quy tắc quan trọng
- KHÔNG dịch các UI labels, tên button, tên cột hoặc message/error message.
- Với những testcase không xác định được kết quả mong đợi từ các tài liệu tham chiếu thì thực hiện warning
- Không tự suy diễn business rule nếu spec không ghi rõ
- Nếu AC thiếu expected behavior cụ thể, ghi open question thay vì tự điền
- Tránh sự mơ hồ của giao diện người dùng (ví dụ: "click vào đâu đó")
- Dữ liệu kiểm thử có thể tái sử dụng và được tham số hóa

## 5. Xử lý GAP giữa Mockup và Spec (CRITICAL)
- Tham chiếu `references/guide-gap-mockup-spec.md`

## 6. Cấu trúc testcase (Bắt buộc)
- Tham chiếu `references/tc-structure.md` — bao gồm format (TC ID, cột bảng, ký hiệu) và tiêu chí nội dung từng cột

---

## Output Path

**Path:** `D-40_Testing/<subsystem>/<screen>/test_cases_manual/TC_[ScreenID]_[ABBR].md`

| Phần | Mô tả | Ví dụ |
|------|-------|-------|
| `<subsystem>` | Tên app viết thường | `benefits`, `mdm`, `staffing` |
| `<screen>` | `[ScreenID]_[screen-name]` | `DSP-BENEFIT-12_housing-management-company-master` |
| `[ScreenID]` | ID màn hình | `DSP-BENEFIT-12` |
| `[ABBR]` | Viết tắt màn hình viết hoa | `HMCM` |

Ví dụ: `D-40_Testing/benefits/DSP-BENEFIT-12_housing-management-company-master/test_cases_manual/TC_DSP-BENEFIT-12_HMCM.md`

## Guidelines:
- Chính xác và có cấu trúc
- Đảm bảo mỗi trường hợp kiểm thử sẵn sàng cho tự động hóa
- Tập trung vào thực thi thực tế
- Bao gồm logic nghiệp vụ quan trọng và luồng tích hợp
- Suy nghĩ như một chuyên viên kiểm thử cao cấp thiết kế testcase cho một dự án thực tế
