# Guide: CSV Import Test Coverage

Dùng khi viết TVP cho màn hình có **chức năng nhập file CSV**.

> **Lưu ý sử dụng**: File này là **checklist kịch bản** — liệt kê _cần test cái gì_ và _cần verify điểm nào_.
> Expected Result trong TVP phải được viết dựa vào **spec của project**, không copy từ guide này.
> Cột "Verify Points" chỉ nhắc những góc kiểm tra cần có, không prescribe kết quả cụ thể.

---

## Khung 6 lớp validation (CRITICAL)

CSV Import có nhiều điểm thất bại hơn form input thông thường. Chia theo 6 lớp để đảm bảo không sót:

| Lớp | Scope | Nơi validate | Khi nào trigger |
|-----|-------|-------------|----------------|
| **A — File level** | Sự tồn tại, định dạng, kích thước file | FE precheck | Khi user chọn file |
| **B — Format level** | Delimiter, encoding, header | FE hoặc server | Khi parse file |
| **C — Structure level** | Số cột, tên cột, thứ tự cột | Server | Sau khi parse |
| **D — Data level** | Required, type, format, boundary cho từng cột | Server | Khi validate từng dòng |
| **E — Business level** | Duplicate, FK, domain rules | Server | Khi apply business logic |
| **F — System level** | Performance, concurrency, transaction | Server / Infra | Khi commit |

**Quy tắc**: Mỗi lớp phải có TVP riêng. **Không dùng TVP "lỗi server generic" làm catch-all cho lớp D~E.**

> ⚠️ **Khi tạo TVP từ guide này**: Mã kịch bản (A-01, B-02…) chỉ dùng để đối chiếu nội bộ — **không đặt vào cột Feature** của TVP output. Cột **Sub-section** dùng tên chiều kiểm thử (`Validation`, `Negative`, `Edge Case`…), không dùng tên Section lớn (`CSV Import`).

---

## A — File level

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| A-01 | Submit khi chưa chọn file | Validation | Luôn | Error display, API có bị gọi không, modal state |
| A-02 | Chọn file sai định dạng (.txt, .xlsx, .json…) | Validation | Luôn | Rejection xảy ra ở FE hay server, error display, file có được upload không |
| A-03 | File rỗng (0 bytes) | Validation | Luôn | Error display, preview behavior, modal state |
| A-04 | File chỉ có header, không có dòng dữ liệu | Edge Case | Confirm spec | Behavior theo spec — import thành công (0 records) hay báo lỗi? |
| A-05 | Size **đúng max** (giá trị cụ thể theo spec) | BVA (valid) | Nếu spec có giới hạn size | Precheck pass, file được chấp nhận |
| A-06 | Size **vượt max** (max + 1 byte) | BVA (invalid) | Nếu spec có giới hạn size | Error display, file có bị upload không, trigger ở FE hay server |
| A-07 | Row count **đúng max** (giá trị cụ thể theo spec) | BVA (valid) | Nếu spec có giới hạn số dòng | Server chấp nhận, import result |
| A-08 | Row count **vượt max** (max + 1 dòng) | BVA (invalid) | Nếu spec có giới hạn số dòng | Server rejection, error message, modal state |

> **Quy tắc BVA**: A-05/A-06 và A-07/A-08 phải đi theo **cặp** — thiếu một chiều là vi phạm BVA bidirectionality.

---

## B — Format level

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| B-01 | Sai delimiter (ví dụ `;` khi spec yêu cầu `,`) | Negative | Nếu spec quy định delimiter | Parse failure, error message rõ ràng |
| B-02 | Sai encoding (không đúng encoding quy định trong spec — encoding cụ thể tra theo spec project) | Negative | Dự án có ký tự đa byte | Character display (vỡ hay không), error message từ server |
| B-03 | Thiếu header row (dòng đầu không phải header) | Negative | Luôn | Error message, loại lỗi (structure hay format) |
| B-04 | Tên header sai chính tả hoặc sai ngôn ngữ | Negative | Luôn | Error message, server có nhận dạng được header không |

---

## C — Structure level

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| C-01 | Thiếu cột so với template | Negative | Luôn | Error message, server có liệt kê cột thiếu không |
| C-02 | Dư cột so với template | Edge Case | Confirm spec | Behavior theo spec — bỏ qua cột dư hay báo lỗi? |
| C-03 | Sai thứ tự cột (đúng tên nhưng hoán vị vị trí) | Negative | Nếu server validate theo thứ tự | Data mapping result, error behavior |

---

## D — Data level

Với mỗi **cột trong CSV**, áp dụng checklist 15 kịch bản từ `guide-validate-input.md`. Đơn vị tối thiểu: **1 cột × 1 nhóm rule = 1 TVP**.

### Bước xác định cột và rules cần test

**Bước 1**: Lấy danh sách cột từ spec (header CSV template, modal Create/Edit, hoặc API schema).

**Bước 2**: Với mỗi cột, xác định **loại (type)** và áp dụng checklist tương ứng:

| Loại cột | Đặc điểm nhận diện | Guide item áp dụng |
|----------|--------------------|-------------------|
| **Required text** | Có dấu `*`, không được rỗng | #1 (required), #2 (spaces-only), #6 (maxlength valid), #7 (maxlength+1) |
| **Optional text** | Không bắt buộc | #7 (maxlength+1), #6 (maxlength valid); test bỏ trống → pass |
| **Code / ID** | Pattern cụ thể (format, exact length) | #4 (pattern violation), BVA (length ranh giới), #1 nếu required |
| **Enum / Dropdown** | Chỉ nhận tập giá trị cố định theo spec | #1 nếu required, #3 (giá trị ngoài tập → lỗi) |
| **Số / Number** | Chỉ nhận số nguyên hoặc decimal | #3 (sai type: nhập chữ vào số), BVA (min/max value) |
| **Số điện thoại / FAX** | Pattern format số điện thoại | #3 (sai pattern), #7 (maxlength+1) |
| **Postal code** | Số chữ số cố định, không gạch nối | #3 (sai format), BVA (exact length ± 1) |
| **Ngày / Date** | Format ngày theo spec (vd: YYYY-MM-DD) | #3 (sai format, invalid date như 2024-02-30) |
| **Tất cả text fields** | Mọi cột chứa text tự do | #10 (JP chars full-width/half-width), #13 (SQL injection), #14 (XSS) |

**Bước 3**: Với các cột optional, vẫn cần TVP xác nhận bỏ trống → server **không** báo required (tránh regression).

### Data level — kịch bản edge case bổ sung

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| D-01 | Dòng trống giữa các dòng dữ liệu | Edge Case | Confirm spec | Behavior theo spec — bỏ qua hay báo lỗi? |
| D-02 | Giá trị chứa dấu phẩy trong nội dung (phải được quote `"..."`) | Edge Case | Nếu delimiter là `,` | Parse result, data correctness sau import |
| D-03 | Giá trị chứa ký tự newline trong nội dung | Edge Case | Confirm spec | Behavior theo spec — hỗ trợ hay báo lỗi? |

---

## E — Business level

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| E-01 | Cột unique key đã tồn tại active trong DB | Negative | Nếu cột là unique key | Mã lỗi theo spec, FE có hiển thị số dòng + message không |
| E-02 | File CSV có 2 dòng cùng giá trị ở cột unique | Edge Case | Confirm spec | Behavior theo spec — từ chối toàn file hay chỉ báo lỗi dòng sau? |
| E-03 | Giá trị cột unique đã bị soft-delete trong DB | Functional | Nếu bảng dùng soft-delete pattern | Import thành công, không bị duplicate check |
| E-04 | Cột FK tham chiếu entity không tồn tại trong DB | Negative | Nếu cột là FK | Mã lỗi theo spec, FE có hiển thị dòng + message không |
| E-05 | Giá trị enum/status ngoài tập allowed theo spec | Negative | Nếu cột có domain rule | Domain error, FE display behavior |

---

## F — System level

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| F-01 | Transaction rollback: file N dòng, dòng K lỗi | Data Integrity | Nếu spec dùng 1 transaction | DB state sau import (có bản ghi nào được insert không), modal state |
| F-02 | Partial commit: dòng hợp lệ insert, dòng lỗi bị skip | Data Integrity | Nếu spec cho phép partial commit | DB state (có dữ liệu một phần), error display cho dòng lỗi |
| F-03 | Import file đúng max size/rows | Performance | Nếu có SLA hoặc timeout spec | Response time, timeout behavior |
| F-04 | Import đồng thời 2 file (2 tab hoặc 2 user) | Concurrency | Nếu hệ thống cho phép concurrent import | Deadlock behavior, data integrity sau cả 2 import |

---

## Anti-pattern — Cấm dùng TVP generic catch-all

❌ **Sai**: Chỉ viết 1 TVP dạng "Server trả lỗi → FE hiển thị lỗi đầu tiên" rồi kết thúc.

> TVP này chỉ cover **FE behavior** (display behavior), không cover **trigger scenario**. Tester không biết phải chuẩn bị CSV gì để kiểm thử từng lớp.

✅ **Đúng**: TVP "lỗi server generic" vẫn cần — nhưng **song song** với TVP riêng cho từng lớp:

| TVP | Mục đích |
|-----|----------|
| TVP generic "Import lỗi server" | FE behavior: chỉ show lỗi đầu tiên, modal giữ mở |
| TVP per layer (A~E) | Trigger scenario: CSV có gì → server trả lỗi gì → FE hiển thị gì |

---

## Quy tắc viết Expected Result trong TVP

Expected Result **phải tra spec**, không lấy từ guide này. Khi viết:

1. **Ghi rõ trigger**: nội dung CSV cụ thể tại cột nào, dòng nào
   - ✅ `File CSV: dòng 2, cột [tên cột] = "giá trị sai"` → server trả [mã lỗi theo spec] → FE hiển thị số dòng + nội dung lỗi
   - ❌ `Nhập sai [tên field]` (mơ hồ)

2. **Ghi rõ error message** kỳ vọng theo spec — không paraphrase, không dịch; nếu không rõ → `[⚠️ Need Confirm]`

3. **Ghi rollback / partial behavior** rõ ràng theo spec
   - ✅ `DB không có bản ghi mới sau import; modal giữ mở`

4. **Nếu spec không mô tả behavior** → ghi `[⚠️ Need Confirm]`, không tự suy đoán

---

## Lưu ý project-specific

- **Encoding**: Tra spec để xác định encoding yêu cầu (UTF-8, UTF-8 BOM, Shift-JIS…) — 1 TVP verify mở bằng Excel không vỡ ký tự (Layer B)
- **Preview step**: Nếu có preview trước khi commit — verify preview header + data cũng là TVP riêng (Layer C)
- **Error display**: Nếu FE chỉ hiển thị lỗi đầu tiên — ghi rõ dòng nào là "đầu tiên" trong file test data
