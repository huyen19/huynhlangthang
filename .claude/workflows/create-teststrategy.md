---
description: Tạo Test Strategy từ tài liệu yêu cầu
---

# Command: Tạo Test Strategy từ Tài liệu Yêu cầu

## Mô tả
Tạo Test Strategy Document có cấu trúc từ tài liệu yêu cầu và các file bổ sung, sau đó lưu vào đường dẫn chỉ định.

## Cú pháp
```
/create-teststrategy <requirement_path> [qa_path|test_policy_path] [output_path]
```

## Tham số

| Tham số | Bắt buộc | Mô tả |
|---|---|---|
| `requirement_path` | Có | Đường dẫn đến tài liệu yêu cầu (Spec/SRS/UI/BasicDesign) |
| `qa_path` | Không | Đường dẫn đến file Q&A Spec — dùng để tự động phân loại gap status (confirmed / pending / skip) |
| `test_policy_path` | Không | Đường dẫn đến file Test Policy định hướng kiểm thử |
| `output_path` | Không | Đường dẫn file markdown để lưu Test Strategy. Nếu không cung cấp, **tự động sinh** từ tên màn hình trong `requirement_path` theo quy ước `TestStrategy/TS_<ScreenName>_ver1.md` |

## Nhận diện tham số (khi gọi command)

Phân tích tham số theo loại file:
- File có pattern `Q&A_` hoặc nằm trong thư mục `Q&A_Spec/` → `qa_path`
- File có pattern `TestPolicy` → `test_policy_path`
- File có pattern `D-14_` hoặc nằm trong thư mục `D-14_BasicDesign/` → `requirement_path`
- File có pattern `TS_` hoặc nằm trong thư mục `TestStrategy/` → `output_path`
- Nếu không nhận diện được → dùng thứ tự tham số để suy luận

## Ví dụ sử dụng
```
# Có Q&A file (output_path tự động sinh)
/create-teststrategy benefits-document/VN/D-14_BasicDesign/DSP-BENEFIT-12_HousingManagementCompanyMaster.md benefits-document/VN/D-40_Testing/Q&A_Spec/Q&A_HousingManagementCompanyMaster_ver1.md

# Có Test Policy + output_path chỉ định
/create-teststrategy benefits-document/VN/D-14_BasicDesign/BenefitsApplicationList.md benefits-document/VN/D-40_Testing/TestPolicy/TestPolicy_ver1.md benefits-document/VN/D-40_Testing/TestStrategy/TS_BenefitsApplicationList_ver1.md

# Chỉ requirement (output_path tự động sinh)
/create-teststrategy benefits-document/VN/D-14_BasicDesign/BenefitsApplicationList.md
```

---

## Hướng dẫn thực thi (Agent follow this)

### Bước 1 — Đọc Skill
Đọc và tuân thủ toàn bộ hướng dẫn trong skill file:
`.agents\skills\test-strategy\SKILL.md`

### Bước 2 — Đọc tài liệu đầu vào
Đọc song song tất cả file được cung cấp:
- Luôn đọc `requirement_path` — làm tài liệu gốc để phân tích hệ thống, rủi ro và định hướng kiểm thử
- Nếu có `qa_path` → đọc để phân loại gap status (xem Bước 3c)
- Nếu có `test_policy_path` → đọc để nắm ràng buộc, mức độ kiểm thử và tiêu chuẩn áp dụng

### Bước 3 — Tạo Test Strategy
Áp dụng đầy đủ skill `test-strategy` để sinh Test Strategy Document:

**3a. Nội dung chính (10 sections)**
- System Overview và luồng nghiệp vụ quan trọng
- Key Test Targets (module/tính năng ưu tiên)
- Risk Assessment: Business / Data / Integration / Technical risk
- Test Scope (In Scope / Out of Scope)
- Test Approach: Test levels và Test types
- Test Focus Areas: critical logic, complex validation, edge cases, high-risk data
- Test Data Strategy: key data, edge cases, data dependencies
- Automation Strategy: what to automate vs. manual
- Entry / Exit Criteria (thực tế, ngắn gọn)
- Gaps & Questions

**3b. Out of Scope — lưu ý khi có mockup UI**
Nếu tài liệu tham chiếu UI mockup HTML, **chỉ loại trừ phần cụ thể không áp dụng production** (ví dụ: modal filter đã bị thay bằng inline search). Không loại trừ toàn bộ mockup — các thành phần layout, list, modal CRUD vẫn là tham chiếu hợp lệ.

**3c. Gaps & Questions — phân loại tự động khi có `qa_path`**

Đọc Q&A file và phân loại mỗi gap theo trạng thái:

| Trạng thái | Điều kiện | Marker |
|---|---|---|
| `✅ Confirmed` | Cột `Answer` trong Q&A có nội dung (không rỗng) | Đưa vào bảng **"Đã Confirmed"** |
| `✅ Confirmed từ D-14` | Gap có thể tự trả lời bằng cách cross-check nội dung `requirement_path` | Đưa vào bảng **"Đã Confirmed"**, ghi rõ nguồn section |
| `⚠ Partially confirmed` | Answer có nhưng vẫn delegate một phần sang tài liệu khác (D-00, D-16…) | Đưa vào bảng **"Chưa Confirmed"**, ghi rõ phần còn pending |
| `⏭ Bỏ qua` | User/BA chỉ định không cần QC check | Đưa vào bảng **"Chưa Confirmed"** với marker này |
| **`Need confirm spec?`** | Cột `Answer` rỗng và không tự trả lời được từ D-14 | Đưa vào bảng **"Chưa Confirmed"** — in đậm để nổi bật |

Cấu trúc section Gaps & Questions:
```
## 10. Gaps & Questions

### Đã Confirmed
| Gap | Nội dung | Trạng thái |
...

### Chưa Confirmed — `Need confirm spec?`
| Gap | Nội dung | Impact nếu không confirm |
...
```

Khi cross-check D-14 để tự trả lời gap:
- Tìm trong các section: validation rules, bảng cột CSV, bảng UI component, hành động & chuyển màn hình
- Nếu tìm thấy câu trả lời rõ ràng → mark `✅ Confirmed từ D-14 §<tên section>`
- Nếu D-14 chỉ delegate sang D-00/D-16/D-20 → mark `⚠ Partially confirmed`

### Bước 4 — Xác định output_path và lưu kết quả

**Nếu `output_path` được cung cấp:**
- File chưa tồn tại → tạo mới
- File đã tồn tại → **tự động tạo file mới** tăng version: `TS_<ScreenName>_verX.md`; thông báo tên file mới

**Nếu `output_path` không được cung cấp:**
- Tự động sinh: `benefits-document/VN/D-40_Testing/TestStrategy/TS_<ScreenName>_ver1.md`
  - `<ScreenName>` lấy từ tên file `requirement_path` bỏ prefix screen ID (ví dụ `DSP-BENEFIT-12_HousingManagementCompanyMaster.md` → `HousingManagementCompanyMaster`)
  - Nếu `ver1` đã tồn tại → tăng lên `ver2`, v.v.
- Thông báo đường dẫn file được tạo

**Header bắt buộc trong file output:**

| Mục | Nội dung |
|---|---|
| File | Tên file output |
| Màn hình | Screen ID + tên màn hình |
| Ngày tạo | Ngày hiện tại |
| Phiên bản | 1.0 |
| Tài liệu tham chiếu | Link đến requirement_path, qa_path (nếu có), test_policy_path (nếu có) |

### Bước 5 — Báo cáo kết quả
Sau khi hoàn thành, thông báo:
- Đường dẫn file output
- Tổng số section đã tạo
- Danh sách Risk đã nhận diện (Business / Data / Integration / Technical)
- Tổng số gaps: bao nhiêu `✅ Confirmed`, bao nhiêu **`Need confirm spec?`**, bao nhiêu `⏭ Bỏ qua`
- Highlight các gap **`Need confirm spec?`** cần BA/Dev xác nhận trước khi viết TVP
