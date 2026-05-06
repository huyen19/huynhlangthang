---
name: write-test-viewpoints
description: Phân tích risk-based test viewpoints từ spec/AC — sinh bảng TVP với risk level, test type, và coverage priority; kiểm tra độ phủ 18 mục trước khi viết test case.
metadata:
  version: "2.0"
  author: QCLead
  lastUpdate: "2026-04-24"
  input: "spec / AC / tên module"
  output: "D-40_Testing/<subsystem>/<screen>/test_viewpoint/<screen>.md"
---

# Skill: Write Test Viewpoints

## Dùng skill này khi

- Bắt đầu testing một module mới chưa có test plan
- Cần quyết định nên viết hình thức test nào (unit / integration / E2E / manual)
- Cần xây dựng quan điểm test (TVP) trước khi viết test case chi tiết
- Cần ưu tiên test effort khi thời gian có hạn

## Không dùng skill này khi

- Đã có test plan rõ, chỉ cần viết cases → dùng `write-manual-tests`
- Chỉ cần sinh script từ AC có sẵn → dùng `write-e2e-script`

---

## Đầu vào

Một trong các dạng sau:
- Tên module + mô tả thô
- File spec / basic design / FE detail design
- Danh sách acceptance criteria

---

## Quy trình phân tích (bắt buộc đủ 6 bước)

### 1. Xác định mục tiêu kiểm thử

Chia hệ thống thành: Module → Features → Key functionalities.

### 2. Xây dựng các điểm quan sát kiểm thử

Đối với mỗi tính năng/mô-đun, tạo TVP dựa trên:

- UI: label, kiểu input, vị trí, màu sắc, trạng thái
  - **Bắt buộc có TVP verify static text cho**: page title/breadcrumb, column header labels, button labels (toolbar và trong modal/dialog), form field labels và required marker (*), modal/dialog title, placeholder text, filter field labels
- Hành vi chức năng
- Kiểm tra tính hợp lệ của dữ liệu đầu vào
- Quy tắc nghiệp vụ
- Xử lý dữ liệu
- Điểm tích hợp
- Xử lý lỗi
- Trường hợp ngoại lệ
- Hành động của người dùng

### 3. Áp dụng các kỹ thuật thiết kế kiểm thử

- Chọn kỹ thuật phù hợp với đặc điểm của spec (BVA, Equivalence Partitioning, Decision Table, State Transition, Pairwise, Use Case, Error Guessing, v.v.)

### 4. Tập trung vào các khu vực rủi ro cao

- Logic nghiệp vụ quan trọng
- Tính nhất quán dữ liệu
- Luồng tích hợp
- Kiểm tra tính hợp lệ phức tạp
- **Validation rules phải được tạo TVP riêng biệt cho từng luồng có form input** (Create, Edit/Update, Import)
  - **Trong mỗi luồng, mỗi field phải có TVP validation riêng** — không gộp nhiều field vào 1 TVP duy nhất, dù rules giống nhau. Đơn vị tối thiểu là: 1 field × 1 nhóm rule = 1 TVP.
  - **Cấm mô tả dạng "reuse"**: các cụm từ như *"cùng rules Create"*, *"giống màn hình X"*, *"tất cả giống"* không được là nội dung chính của TVP — phải liệt kê field + rule cụ thể.

### 5. Cấu trúc các điểm quan sát kiểm thử

Định nghĩa cột, format bảng, ví dụ và quy tắc section: xem `references/tvp-structure.md`

### 6. Kiểm tra độ phủ theo TVP Checklist

Sau khi hoàn thành bảng TVP, đối chiếu với **18 mục** trong `references/tvp-checklist.md`. Với mỗi mục, đánh dấu ✔ (đã có TVP cover) hoặc ✖ (chưa có) và **bổ sung TVP ngay nếu ✖**.

Bảng checklist output (bắt buộc):

| # | Checklist Category | Trạng thái | Ghi chú |
|---|-------------------|-----------|---------|
| 1 | FUNCTIONAL (Happy Path) | ✔/✖ | |
| 2 | INPUT VALIDATION (Field Level) | ✔/✖ | Apply cho MỌI luồng có form input: Create, Edit/Update, Import |
| 3 | BOUNDARY VALUE (BVA) | ✔/✖ | |
| 4 | NEGATIVE CASE | ✔/✖ | |
| 5 | USER BEHAVIOR (Real-world) | ✔/✖ | |
| 6 | SYSTEM BEHAVIOR | ✔/✖ | |
| 7 | DATA INTEGRITY | ✔/✖ | |
| 8 | DB ↔ UI DATA MAPPING | ✔/✖ | |
| 9 | INTEGRATION (API) | ✔/✖ | Chỉ apply nếu tài liệu mô tả API |
| 10 | SECURITY (Basic) | ✔/✖ | SQL Injection, XSS, unauthorized access |
| 11 | UX/UI | ✔/✖ | Static text: title, button labels, column headers, form labels, modal titles, state, color |
| 12 | STATE & FLOW | ✔/✖ | |
| 13 | CONCURRENCY (Advanced) | ✔/✖ | |
| 14 | DATA LIFECYCLE | ✔/✖ | Apply nếu màn hình có xóa/khôi phục |
| 15 | SEARCH / FILTER / SORT | ✔/✖ | Apply nếu màn hình có thanh tìm kiếm hoặc bộ lọc |
| 16 | PAGINATION / LARGE DATA | ✔/✖ | Apply nếu màn hình có phân trang hoặc danh sách lớn |
| 17 | CROSS-FIELD VALIDATION | ✔/✖ | Apply nếu có field phụ thuộc lẫn nhau hoặc conditional required |
| 18 | IMPORT / EXPORT | ✔/✖ | Apply nếu màn hình có chức năng xuất hoặc nhập file |

**Quy tắc**: Không được kết thúc bước này khi còn bất kỳ ✖ nào chưa được xử lý. Nếu một mục không áp dụng, ghi rõ lý do vào cột Ghi chú.

Chi tiết từng mục checklist: xem `references/tvp-checklist.md`

**Mục 15 — SEARCH / FILTER / SORT**: đối chiếu bắt buộc thêm `references/guide-function-search.md` — checklist 23 kịch bản (F/I/N/V/E/D) và Decision Table tổ hợp filter.

**Luồng có form input (Create / Edit / Import)**: đối chiếu bắt buộc thêm `references/guide-validate-input.md` — checklist 15 kịch bản cho từng field (required, spaces-only, pattern, BVA, JP chars, SQL injection, XSS, trim, v.v.).

**Luồng Import (CSV)**: đối chiếu bắt buộc thêm `references/guide-import.md`

**Luồng Export (CSV)**: đối chiếu bắt buộc thêm `references/guide-export.md`

---

## Quy tắc

- Giữ nguyên UI labels, tên button, tên cột, message/error message bằng tiếng Nhật chính xác như tài liệu.
- Không sinh test cases trong skill này — chỉ phân tích viewpoints và điều kiện.
- **Chỉ dựa vào tài liệu được cung cấp** — không đọc source code trừ khi user yêu cầu rõ ràng.
- Nếu spec mơ hồ → ghi assumption hoặc open question, không suy đoán ngầm.
- Output phải đủ rõ để người đọc bắt đầu viết test cases ngay mà không cần hỏi thêm.
- Thà cảnh báo mơ hồ còn hơn tạo ra TVP sai — TVP sai dẫn đến test case sai và bỏ sót lỗi thực tế.

**Xử lý TVP mơ hồ, GAP mockup/spec, nhãn AMBIGUOUS/ASSUMPTION**: xem `references/tvp-ambiguity-rules.md`

---

## Output path

`D-40_Testing/<subsystem>/<screen>/test_viewpoint/TVP_<Screen ID>_<ABBR>.md`

- `<subsystem>`: tên app viết thường — `benefits`, `mdm`, `staffing`, `attendance`, `inventory`, `education`, `license`, `mypage`
- `<screen>`: `<Screen ID>_<screen-name>` — ví dụ `DSP-BENEFIT-12_housing-management-company-master`
- `<ABBR>`: viết tắt viết hoa của tên màn hình — ví dụ `HMCM` (Housing Management Company Master)
