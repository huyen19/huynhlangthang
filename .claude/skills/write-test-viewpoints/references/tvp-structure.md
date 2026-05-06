# TVP Structure Reference

**Mục tiêu**: Tài liệu duy nhất định nghĩa format và tiêu chí nội dung TVP — đảm bảo TVP đủ rõ để người đọc bắt đầu viết test cases ngay mà không cần hỏi thêm.

---

## Header file

Đặt ngay đầu file output:

```markdown
# TVP_[ScreenID]_[ABBR].md

| Mục | Nội dung |
|---|---|
| **File** | TVP_[ScreenID]_[ABBR].md |
| **Màn hình** | [Screen ID] — [Screen Name] |
| **Tài liệu tham chiếu** | [link spec / detail design] |
| **UI Mock** | [link mockup — hoặc N/A] |
| **Tổng số TVP** | [N] |
```

---

## Định nghĩa cột

| Cột | Bắt buộc | Mô tả | Giá trị hợp lệ |
|-----|:--------:|-------|----------------|
| **ID TVP** | ✔ | Mã định danh duy nhất — tăng dần liên tục xuyên suốt toàn bộ bảng, không reset giữa các Section | `TVP-001`, `TVP-002` ... |
| **Sub-section** | ✔ | Section con mà TVP thuộc về — mỗi TVP thuộc đúng **1** section con, không ghép bằng `/` | `UI`, `Validation`, `Submit`, `Integration`, `Edge Case`, `Pagination` ... |
| **Feature** | ✔ | Tính năng cụ thể trong section con — mô tả ngắn điểm kiểm thử | Cụm danh từ ngắn gọn |
| **TVP Description** | ✔ | Mô tả CẦN kiểm tra cái gì — đủ rõ để viết TC ngay mà không hỏi thêm | Hành vi + điều kiện + expected behavior |
| **Test Type** | ✔ | Phân loại kiểm thử | `UI` / `Functional` / `Validation` / `Data` / `Integration` / `Edge Case` / `User Behavior` |
| **Priority** | ✔ | Mức độ ưu tiên | `Critical` / `High` / `Medium` / `Low` |
| **Method test** | ✔ | Phương thức test đề xuất phù hợp nhất | `E2E` / `Manual` / `API` / `E2E / Manual` |

---

## Bảng TVP

Các TVP được nhóm theo **Section lớn**. Mỗi Section lớn mở đầu bằng **một dòng header 1 cột** (chỉ 1 cell, không có cột trống sau). Cột **Sub-section** trong từng dòng TVP thể hiện section con thuộc Section lớn đó.

```markdown
| ID TVP | Sub-section | Feature | TVP Description | Test Type | Priority | Method test |
|--------|-------------|---------|-----------------|-----------|----------|-------------|
| **SECTION 1 — ĐĂNG KÝ MỚI (新規登録)** |
| TVP-001 | UI | Modal layout | Modal title, field labels, required markers (*), nút 登録 / キャンセル | UI | High | Manual |
| TVP-002 | UI | Default values | Tất cả text field rỗng; 状態 mặc định「契約」khi mở modal | Functional | High | E2E |
| TVP-003 | Validation | FLD-001 required | Bỏ trống → inline error VAL-001; modal không đóng; API không gọi | Validation | Critical | E2E |
| TVP-004 | Validation | FLD-001 pattern | Nhập chữ thường / sai vị trí → error VAL-002 | Validation | Critical | E2E |
| TVP-005 | Submit | Submit thành công | Nhập hợp lệ → 201: modal đóng; toast xanh; list reload page=1 | Functional | Critical | E2E |
| TVP-006 | Submit | Nút disabled khi saving | Click 登録: nút disabled + spinner; không double-submit | User Behavior | High | E2E |
| TVP-007 | Integration | POST body — optional omit | Optional fields rỗng → omit khỏi body (không gửi null) | Integration | High | E2E |
| **SECTION 2 — PHÂN TRANG** |
| TVP-008 | Pagination | Hiển thị pagination | Chỉ hiển thị khi totalItems > pageSize | UI | Medium | E2E |
| TVP-009 | Pagination | Chuyển trang giữ filter | Click trang 2 → API gọi page=2 với filterState hiện tại | Functional | High | E2E |
```

**Quy tắc dòng header Section lớn:**
- Chỉ có **1 cell duy nhất**: `| **SECTION N — TÊN** |`
- Không thêm các cột trống sau
- Không đánh TVP ID cho dòng này

**Quy tắc cột Sub-section:**
- Mỗi TVP thuộc đúng 1 section con — không ghép bằng `/` (sai: `Create / Validation`; đúng: `Validation`)
- **Section lớn dạng form** (Create, Edit, Import…) luôn phải tách sub-section theo chiều kiểm thử: `UI` · `Validation` · `Submit` · `Integration` · `Edge Case` — không dùng tên Section lớn làm giá trị cột Sub-section
- **Quy tắc "1 nhóm duy nhất"** — chỉ áp dụng khi toàn bộ TVPs trong Section lớn thực sự cùng một chiều kiểm thử (ví dụ: Section PHÂN TRANG chỉ gồm pagination TVPs → dùng `Pagination` cho cột Sub-section). Không áp dụng cho section dạng form.

---

## Lịch sử tạo file

| Phiên bản | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.0 | YYYY-MM-DD | Tạo mới | QCL |
