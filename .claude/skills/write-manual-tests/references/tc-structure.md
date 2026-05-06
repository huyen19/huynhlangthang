# TC Structure Reference

---

## PHẦN 1 — FORMAT

---

## 1. TC ID format

`TC-[ABBR]-[SectionID]-[SEQ]`

| Phần | Mô tả | Ví dụ |
|------|-------|-------|
| `[ABBR]` | Viết tắt màn hình (viết hoa) | `HMCM` |
| `[SectionID]` | Số thứ tự của **Section lớn** trong bảng TVP, format `S` + 2 chữ số | `S01`, `S02`, `S15` |
| `[SEQ]` | Số thứ tự 3 chữ số, **reset về `001` khi sang Section mới** | `001`, `002` |

Ví dụ: `TC-HMCM-S01-001`, `TC-HMCM-S01-002`, `TC-HMCM-S05-001`, `TC-HMCM-S05-002`

---

## 2. Header file

Đặt ngay đầu file output:

```markdown
# TCs_[ScreenID]_[SectionAbbr]_ver[N].md

| Mục | Nội dung |
|---|---|
| **File** | TCs_[ScreenID]_[SectionAbbr]_ver[N].md |
| **Màn hình** | [Screen ID] — [Screen Name] |
| **Tài liệu tham chiếu** | [link spec] |
| **TVP tham chiếu** | [link TVP file] |
| **UI Mock** | [link mockup — hoặc N/A] |
| **Tổng số TC** | [N] |
```

---

## 3. Định nghĩa cột bảng test case

| Cột | Bắt buộc | Mô tả | Giá trị hợp lệ |
|-----|:--------:|-------|----------------|
| **TC ID** | ✔ | Mã định danh duy nhất | `TC-[ABBR]-[SectionID]-[SEQ]` |
| **TVP ID** | ✔ | TVP gốc mà test case này cover | `TVP-001`, `TVP-002` ... |
| **Sub-section** | ✔ | Sub-section của TVP (cột Section trong bảng TVP) | Tên sub-section: `Screen Init`, `Filter`, `Validation`, `Submit` ... |
| **Test Description** | ✔ | Mô tả ngắn hành vi cần kiểm tra — bắt đầu bằng động từ | Câu ngắn, rõ hành vi |
| **Preconditions** | ✔ | Điều kiện hệ thống và dữ liệu cần có trước khi chạy | Đánh số, nối bằng `<br>` |
| **Test Steps** | ✔ | Các bước thực hiện theo thứ tự | Đánh số, nối bằng `<br>` |
| **Test Data** | — | Giá trị input cụ thể dùng trong test | Giá trị literal; để `-` nếu không cần |
| **Expected Result** | ✔ | Kết quả quan sát được trên UI hoặc response — **phải đo lường được** | Đánh số, nối bằng `<br>` |
| **Status** | — | Kết quả test (tester điền) | `Open` / `Pass` / `Fail` / `Skip` |
| **Actual** | — | Kết quả thực tế (tester điền khi chạy) | *(để trống)* |
| **Note** | — | Ghi chú khi chạy test (bug ref, điều kiện đặc biệt, v.v.) | *(để trống)* |
| **Test Type** | ✔ | Phân loại test case | `UI` / `Functional` / `Validation` / `Integration` / `Negative` / `Edge Case` / `Data` |
| **Priority** | ✔ | Mức độ ưu tiên | `Critical` / `High` / `Medium` / `Low` |
| **Method Test** | ✔ | Đề xuất phương thức thực thi | `Auto` / `Manual` |

---

## 4. Format bảng

```markdown
| TC ID | TVP ID | Sub-section | Test Description | Preconditions | Test Steps | Test Data | Expected Result | Status | Actual | Note | Test Type | Priority | Method Test |
|-------|--------|------------|-----------------|---------------|------------|-----------|-----------------|--------|--------|------|-----------|----------|-------------|
```

---

## 5. Quy tắc nội dung nhiều dòng trong cell

Dùng `<br>` để xuống dòng — **KHÔNG** dùng newline thật hoặc dấu `;`.

**❌ Sai:**
```
| Đơn chuyển sang 承認; đơn biến khỏi tab 申請; badge giảm 1 |
```

**✅ Đúng:**
```
| 1. Đơn chuyển sang status=承認<br>2. Đơn biến khỏi tab 申請<br>3. Badge 申請 giảm 1 |
```

Áp dụng thống nhất cho cả ba cột **Preconditions**, **Test Steps**, và **Expected Result**:
```
| 1. Điều kiện A<br>2. Điều kiện B |          ← Preconditions
| 1. Click nút フィルタ<br>2. Quan sát modal |  ← Test Steps
| 1. Modal mở<br>2. Filter form rỗng |         ← Expected Result
```

---

## 6. Ví dụ hàng đầy đủ

| TC ID | TVP ID | Sub-section | Test Description | Preconditions | Test Steps | Test Data | Expected Result | Status | Actual | Note | Test Type | Priority | Method Test |
|-------|--------|------------|-----------------|---------------|------------|-----------|-----------------|--------|--------|------|-----------|----------|-------------|
| TC-HMCM-S01-001 | TVP-001 | Screen Init | Page title「社宅管理会社マスタ」hiển thị đúng | 1. User đăng nhập với ROLE_HR_ADMIN<br>2. App đang chạy port 4005 | 1. Navigate đến `/benefits/master/housing-management-companies`<br>2. Chờ skeleton loader biến mất<br>3. Quan sát vùng tiêu đề và breadcrumb | — | 1. Page title hiển thị「社宅管理会社マスタ」<br>2. Breadcrumb hiển thị đúng cấu trúc nền tảng | | | | UI | High | Auto |
| TC-HMCM-S05-001 | TVP-039 | Validation | FLD-001 bỏ trống → inline error VAL-001 | 1. User đăng nhập với ROLE_HR_ADMIN<br>2. Modal 新規登録 đang mở | 1. Để trống field 管理会社コード<br>2. Click nút 登録 | (rỗng) | 1. Inline error hiển thị dưới FLD-001:「管理会社コードを入力してください。」<br>2. Modal không đóng<br>3. Không có request API nào được gọi | | | | Negative | Critical | Auto |

---

## 7. Footer file

| Phiên bản | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.0 | YYYY-MM-DD | Tạo mới | QCL |

---

## PHẦN 2 — TIÊU CHÍ NỘI DUNG TỪNG CỘT

### TC ID
- Định danh duy nhất cho mỗi testcase — format tại Phần 1 §1

### TVP ID
- Mỗi TC phải map ít nhất 1 TVP
- 1 TVP có thể có nhiều TC

### Sub-section
- Tên sub-section trong TVP mà TC thuộc về (vd: Screen Init, Filter, Validation, Submit...)

### Test Description
- Mô tả ngắn gọn, rõ ràng mục tiêu cần test — không mô tả step
- Tách TC chi tiết theo từng điều kiện hoặc từng item trong TVP; mỗi điều kiện/item có ít nhất 1 TC

### Preconditions
- Xác định điều kiện tiên quyết của hệ thống để testcase được thực thi đúng logic
- Quy tắc: Rõ ràng, có thể tái sử dụng, không phụ thuộc step trước đó

### Test Steps
- Mô tả hành động cụ thể của user/system
- 1 step = 1 action
- Steps chứa actions cụ thể hoặc verification trigger

### Test Data
- Xác định dữ liệu dùng cho từng testcase
- Data phải cụ thể
- Dựa vào kinh nghiệm có thể đưa ra giá trị thường hay gặp lỗi
- Data bao gồm các vùng: valid data, invalid data, boundary, duplicate
- Đối với ô input, tách case theo:
  - Loại ký tự: chữ, số, ký tự đặc biệt, Katakana, Hiragana, full-width / half-width
  - SQL injection, XSS

### Expected Result
- Phải chỉ rõ **element nào** và **assertion type**: visible / not visible / has text / count equals / URL equals / not disabled / has class...
- Cùng expect result nhưng precondition khác nhau → tách thành TC riêng
- Kết quả chưa xác định từ tài liệu tham chiếu → ghi `[⚠️ Need Confirm]`
- Test Type `Data`: bắt buộc mapping với DB theo format `table_name.column_name` (vd: `t_benefits_application.employee_cd`)
- Kết quả có mã lỗi: bắt buộc ghi cả mã lẫn nội dung theo format `<Mã lỗi>: <Nội dung thông báo>`

#### Nguyên tắc "Một TC — Một Expected Result" (CRITICAL)

Mỗi TC chỉ kiểm tra DUY NHẤT MỘT điều kiện và MỘT kết quả mong đợi.

❌ **KHÔNG ĐƯỢC** gộp hai trạng thái đối lập vào cùng một TC:
```
Expected: "Nút X enabled khi chọn ≥1 đơn; disabled khi selection = 0"
```

✅ **PHẢI** tách thành hai TC riêng biệt:
```
TC-A: "Nút X disabled khi không có đơn được chọn" → Expected: Nút X disabled
TC-B: "Nút X enabled khi chọn ≥1 đơn"            → Expected: Nút X enabled
```

**Quy tắc áp dụng cho các hành vi đối lập phổ biến:**
- `enabled` vs `disabled`
- `visible` vs `hidden`
- `success` vs `error`
- `allowed` vs `blocked`
- `saved` vs `not saved`

**Ngoại lệ:** Trạng thái ban đầu ghi ở Preconditions (không phải Expected Result) là chấp nhận được khi đó là điều kiện tiên quyết, không phải mục tiêu kiểm thử.

### Test Type
- Bao gồm: `UI` / `Functional` / `Validation` / `Integration` / `Negative` / `Edge Case` / `Data`
- Chi tiết định nghĩa từng loại → tham chiếu `skill.md §3`

### Priority
- Bao gồm: `Critical` / `High` / `Medium` / `Low`

### Method Test
- Đề xuất phương thức thực thi phù hợp nhất cho TC này
- Giá trị: `Auto` / `Manual`

| Giá trị | Khi nào dùng |
|---------|--------------|
| `Auto` | TC có steps xác định, input/output rõ ràng, có thể lặp lại nhiều lần — phù hợp Playwright/Selenium |
| `Manual` | TC yêu cầu phán đoán thị giác, kiểm tra UX/cảm quan, môi trường khó mock, hoặc luồng phức tạp khó tự động hóa |

**Hướng dẫn gán giá trị:**
- `UI` + layout/label tĩnh → `Auto`
- `Functional` + luồng chính → `Auto`
- `Validation` + inline error → `Auto`
- `Integration` + API request/response → `Auto`
- `Negative` + API error → `Auto`
- `Edge Case` + giá trị biên → `Auto`
- `Data` + DB mapping → `Manual` (cần verify DB trực tiếp)
- TC có điều kiện môi trường đặc biệt hoặc phụ thuộc dữ liệu production → `Manual`
