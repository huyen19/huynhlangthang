# Test Strategy — M-03 Quản lý Trung tâm phân phối (配送センター)

| Mục | Nội dung |
|---|---|
| **File** | TS_M-03_DeliveryCenter_ver1.md |
| **Màn hình** | M-03 / M-03-cud / M-03-update / M-03-delete — 配送センター情報管理 |
| **Ngày tạo** | 2026-05-04 |
| **Phiên bản** | 1.0 |
| **Tài liệu tham chiếu** | [Detail Design — M-03 List](../Requirements/M-03/Detail%20Design%20—%20M-03%20Delivery%20Center%20List.md) · [Detail Design — M-03-cud Create](../Requirements/M-03/Detail%20Design%20—%20M-03-cud%20Delivery%20Center%20Create.md) · [Detail Design — M-03-update](../Requirements/M-03/Detail%20Design%20—%20M-03-update%20Delivery%20Center%20Update.md) · [Detail Design — M-03-delete](../Requirements/M-03/Detail%20Design%20—%20M-03-delete.md) · [Q&A M-03](../Test%20Q%26A/Q%26A_M-03_DeliveryCenter_ver1.md) |

---

## 1. System Overview

**Hệ thống:** Module quản lý Trung tâm phân phối (配送センター) trong hệ thống PSMS — cho phép ADMIN thực hiện đầy đủ CRUD.

**Luồng nghiệp vụ quan trọng:**

| Luồng | Mô tả |
|---|---|
| List → Filter/Sort/Page | ADMIN xem danh sách center, lọc theo centerCode/clientId/areaId/centerName, sắp xếp theo 3 cột, phân trang 15/30/50 |
| List → Create | Nhấn "新規作成" → `/center/new` → nhập thông tin → POST → 201 → về list |
| List → Update | Nhấn "Sửa" → `/center/{id}/edit` → pre-load GET → chỉnh sửa → PUT với `updatedAt` (optimistic lock) → 200 → về list |
| List → Delete | Vào edit → nhấn "Xóa" → confirmation dialog → DELETE (BE check references) → 204 → về list |

**Actor duy nhất:** ADMIN. LOGISTICS và unauthenticated bị chặn ở mọi endpoint (401/403).

**DB liên quan:** `m_delivery_centers` (PK: `id`, unique: `(client_id, code)`); JOIN `m_clients`, `m_areas`; bị tham chiếu bởi `m_stores.delivery_center_id`, `m_clients.fixed_center_id`, `t_plan_stores.delivery_center_id`.

---

## 2. Key Test Targets

| ID | Priority | Module / Tính năng | Lý do |
|---|---|---|---|
| TT-01 | P1 | Tạo mới center (POST /v1/delivery-centers) | Core flow; nhiều validation rules phức tạp (code pattern, postalCode format, phone strip, cross-reference client↔area) |
| TT-02 | P1 | Optimistic lock khi Update (PUT /v1/delivery-centers/{id}) | Cơ chế locking dễ gây lỗi; `updatedAt` so sánh đến millisecond; DTO mới cần tạo |
| TT-03 | P1 | Delete + Reference Check (DELETE /v1/delivery-centers/{id}) | Business-critical: xóa bị chặn nếu còn store/client/plan tham chiếu; phải dùng MSG-022 duy nhất |
| TT-04 | P1 | Unique constraint (client_id, code) — case-insensitive | Dữ liệu sai có thể gây duplicate hidden; confirmed case-insensitive via D-14 |
| TT-05 | P2 | Filter & Sort (GET /v1/delivery-centers) | centerCode partial match vs centerName exact match; sort whitelist 3 cột; sort field/direction invalid → 400 |
| TT-06 | P2 | Authorization ADMIN-only | Mọi endpoint chỉ ADMIN; LOGISTICS/unauthenticated phải bị chặn |
| TT-07 | P2 | Dropdown API (GET /v1/delivery-centers/dropdown) | INACTIVE hiển thị (theo common-spec §5.6 List); thu hẹp theo clientId |
| TT-08 | P3 | Pagination (page/size/totalPages) | Mặc định size=30; ẩn pagination control khi totalPages < 2 |
| TT-09 | P3 | Soft delete behavior | `deleted_at IS NULL` filter; bản ghi soft-deleted ẩn khỏi list và dropdown |

---

## 3. Risk Assessment

### Business Risk

| Risk | Impact | Lý do |
|---|---|---|
| Delete bị chặn không đúng điều kiện | **High** | Nếu thiếu filter `destination_type = 'FIXED_CENTER'` trong check m_clients, sẽ chặn delete nhầm khi client có `fixed_center_id` nhưng `destination_type != FIXED_CENTER` (Gap-3 trong detail-design delete) |
| Duplicate center code vô tình | **High** | Unique check case-insensitive — nếu thiếu `IgnoreCase` trong query, `KAKO` và `kako` cùng client sẽ tạo được 2 record |
| Mất dữ liệu khi 2 user cùng sửa | **High** | Optimistic lock qua `updatedAt`: nếu comparison không chính xác đến millisecond (timezone, serialize/deserialize) → lock fail silent hoặc false positive |
| Tạo center với client/area sai tham chiếu | **High** | BE phải check ACTIVE client + cross-client area; nếu thiếu → data corruption |

### Data Risk

| Risk | Impact | Lý do |
|---|---|---|
| Code VARCHAR shrink (50→20) | **High** | Migration V10 đã shrink `code 50→20`, `name 255→100`, `address 500→255`; test data cũ có thể vượt giới hạn mới |
| Reuse center code sau soft delete | **Medium** | Chưa confirmed chính thức (G-004 — ⚠ Partially confirmed); code hiện tại allow nhưng PM chưa xác nhận |
| Phone format strip | **Medium** | Strip `+`, `-`, space trước validate; số quốc tế `+81-xxx` không bắt đầu `0` sau strip → 400. Tester cần biết behavior để tạo test data |

### Integration Risk

| Risk | Impact | Lý do |
|---|---|---|
| Postal code auto-fill (GAP-201) | **High** | Nguồn tra cứu 郵便番号 chưa confirmed (G-001 — pending PM); chưa có endpoint BE → FE dùng external API. Test case auto-fill không thể viết đầy đủ cho đến khi confirm |
| Prefecture master (GAP-202) | **High** | Nguồn dropdown 都道府県 chưa confirmed (G-002 — pending PM); FE có thể hardcode 47 tỉnh → không test API timeout/error |
| Dependent dropdown APIs (M-01 Client, M-02 Area) | **Medium** | M-03-cud form phụ thuộc `/v1/clients/dropdown` và `/v1/areas/dropdown` — nếu chưa có thì form không load được dropdown, không test được create/update flow |

### Technical Risk

| Risk | Impact | Lý do |
|---|---|---|
| N+1 query cho list (LAZY JOIN client/area) | **Medium** | 50 record/trang → tối đa 100 extra query. Không critical nhưng cần monitor khi data lớn |
| Pagination stability với tie-breaker | **Low** | Dùng `id ASC` tie-breaker để đảm bảo stable; không ảnh hưởng functional nhưng cần verify order nhất quán khi có sort |
| `DeliveryCenterResponse` thiếu `updatedAt` (Gap-2 update) | **High** | Nếu response không có `updatedAt`, FE không cache được lock token → không test được optimistic lock flow |

---

## 4. Test Scope

### In Scope

| # | Endpoint | Method | Mô tả |
|---|---|---|---|
| 1 | `/v1/delivery-centers` | GET | List + filter + sort + pagination |
| 2 | `/v1/delivery-centers/dropdown` | GET | Dropdown cho filter centerName |
| 3 | `/v1/delivery-centers` | POST | Tạo mới center |
| 4 | `/v1/delivery-centers/{id}` | GET | Pre-load chi tiết cho form edit |
| 5 | `/v1/delivery-centers/{id}` | PUT | Cập nhật center với optimistic lock |
| 6 | `/v1/delivery-centers/{id}` | DELETE | Xóa mềm center sau reference check |

Tất cả các trường hợp: happy path, edge case, validation error, auth error, business rule violation.

### Out of Scope

| # | Phần loại trừ | Lý do |
|---|---|---|
| 1 | Postal code lookup external API (GAP-201) | Pending PM confirm; BE không có endpoint |
| 2 | Prefecture master API (GAP-202) | Pending PM confirm |
| 3 | `/v1/clients/dropdown` và `/v1/areas/dropdown` | Thuộc feature M-01 Client và M-02 Area |
| 4 | `m_stores`, `m_clients` business logic | Chỉ tham chiếu; test reference check thông qua count queries |
| 5 | Cột `status` trong list screen | Spec không filter theo status; INACTIVE vẫn hiển thị — không test business logic change status |
| 6 | Performance testing | NFR < 3s (p95) — ra ngoài scope test functional |

---

## 5. Test Approach

### Test Levels

| Level | Phạm vi |
|---|---|
| **API / Integration** | Gọi trực tiếp các endpoint với JWT ADMIN; verify HTTP status, response body, DB state |
| **System** | Test flow đầy đủ: List → Create → Update → Delete; verify UI behavior khi có lỗi |
| **Security** | Verify 401 (no/expired JWT) và 403 (LOGISTICS role) cho tất cả 6 endpoints |

### Test Types

| Type | Áp dụng cho |
|---|---|
| **Functional** | Tất cả CRUD operations, filter, sort, pagination |
| **Validation** | Bean validation (name, code pattern, postalCode format, phone strip), business validation (client ACTIVE, cross-client area) |
| **Boundary** | Max length fields (name=100, code=20, address=255, phone=20), page size (15/30/50), sort field whitelist |
| **Negative** | 400 validation errors, 401/403 auth, 404 not found, 409 conflict (duplicate/optimistic lock/reference) |
| **Data Integrity** | Soft delete, FK constraints, tie-breaker sort, AND filter logic |

---

## 6. Test Focus Areas

### Critical Logic

| Area | Chi tiết |
|---|---|
| Unique (client_id, code) case-insensitive | `existsByClientIdAndCodeIgnoreCaseAndDeletedAtIsNull` — test: `KAKO` vs `kako` cùng client → 409; cùng code khác client → 201 |
| Optimistic lock `updatedAt` | GET → save `updatedAt` → PUT với đúng token → 200; PUT với token sai 1ms → 409 MSG-020 |
| Reference check trước delete | m_stores active → 409; m_clients fixed_center (destination_type=FIXED_CENTER) → 409; chỉ soft-deleted references → 204 |
| `code` read-only trong update | PUT body có `code` field → BE ignore, DB không đổi code |
| Filter AND logic | Combine các filter: kết quả phải là intersection, không phải union |

### Complex Validation

| Area | Chi tiết |
|---|---|
| `phone` strip + format | Strip `+`, `-`, space → 10 hoặc 11 chữ số, bắt đầu `0`. `+81-90-xxx` → fail (starts `8`); `090-1234-5678` strip → pass |
| `postalCode` format | Regex `^\d{3}-\d{4}$` — `1234567` không có `-` → 400 MSG-002; `123-4567` → pass |
| `code` pattern | `^[A-Za-z0-9]+$` — `kako-gawa` → 400 MSG-002; `kakogawa` → pass |
| Client ACTIVE check | Client INACTIVE → 400 PSMS_CTR_006 (defensively, dù FE dropdown đã ẩn) |
| Cross-client area | area.client_id ≠ request.clientId → 400 PSMS_CTR_004 |
| Sort field whitelist | `centerCode`, `clientCode`, `areaName` → OK; `id`, `clientName`, `name` → 400 PSMS-CTR-005 |

### Edge Cases

| Area | Chi tiết |
|---|---|
| centerCode whitespace trim | `"  kako  "` → sau trim `%kako%` partial match |
| centerName empty after trim | `"   "` → bỏ qua condition, không filter |
| Soft-deleted center trong filter | Không hiển thị trong list; không trả về trong dropdown |
| Delete idempotent | DELETE lần 2 → 404 (không 204) |
| Cascade dropdown khi đổi client | Sau khi đổi clientId → area reset ngay |
| Duplicate với soft-deleted record | ⚠ Pending PM confirm (G-004): hiện tại code ALLOW reuse → test và ghi rõ expected |

### High-Risk Data Scenarios

| Scenario | Risk |
|---|---|
| Center với stores đang tham chiếu → DELETE | 409 MSG-022 expected |
| 2 ADMIN cùng sửa cùng record (race condition) | 409 MSG-020 cho người thứ hai |
| centerName filter với 2 center cùng tên ở 2 client khác nhau | Trả về cả 2 (filter theo name String, không theo clientId) |
| page vượt quá totalPages | 200, content=[], totalElements không đổi |

---

## 7. Test Data Strategy

### Key Data Cần Chuẩn Bị

| Data | Yêu cầu |
|---|---|
| ADMIN user | JWT hợp lệ với role ADMIN |
| LOGISTICS user | JWT với role LOGISTICS (test 403) |
| Client ACTIVE | Ít nhất 2 client ACTIVE cho test cross-client |
| Client INACTIVE | 1 client với status=INACTIVE (test PSMS_CTR_006) |
| Area per client | Mỗi ACTIVE client có ít nhất 2 area |
| Center với store reference | 1 center có m_stores.delivery_center_id trỏ tới → test delete block |
| Center với fixed_center reference | 1 client có fixed_center_id trỏ tới center AND destination_type=FIXED_CENTER → test delete block |
| Soft-deleted center | 1 center với deleted_at NOT NULL → test ẩn khỏi list |
| Center INACTIVE | 1 center với status=INACTIVE → test vẫn hiển thị trong list + dropdown |

### Edge Case Data

| Data | Mục đích |
|---|---|
| `code` = "KAKO" và "kako" cùng client | Test case-insensitive unique |
| `code` = "kako-gawa" (có hyphen) | Test validation MSG-002 |
| `phone` = "+81-90-1234-5678" | Test international format fail |
| `name` = 100 ký tự chính xác | Test boundary max length |
| `name` = 101 ký tự | Test MSG-009 |
| `postalCode` = "1234567" (không có gạch ngang) | Test format MSG-002 |

### Data Dependencies

- `m_delivery_centers` → `m_clients` (client phải tồn tại trước)
- `m_delivery_centers` → `m_areas` (area phải thuộc đúng client)
- `m_stores.delivery_center_id` → cần tạo store trước để test delete block
- Dropdown clientId filter: area dropdown phụ thuộc vào client đã chọn

---

## 8. Automation Strategy

### Nên Tự Động Hóa (ROI cao)

| Test Area | Lý do |
|---|---|
| API happy path (CRUD, filter, sort, pagination) | Ổn định, chạy nhanh, không thay đổi thường xuyên |
| Validation boundary tests (max length, pattern, format) | Nhiều case, dễ data-driven |
| Auth tests (401/403 cho 6 endpoints) | Lặp lại với pattern giống nhau |
| Error code assertions (400/404/409 với đúng code) | Dễ assert bằng JSON comparison |
| Unique constraint (case-insensitive, per-client scope) | Business-critical, dễ break khi refactor |
| Reference check delete | Business-critical; test bằng DB seed |

### Nên Test Thủ Công

| Test Area | Lý do |
|---|---|
| UI behavior: confirmation dialog xóa | Cần verify text JP, button label, visual |
| Optimistic lock race condition (2 tab cùng sửa) | Khó simulate bằng automation |
| Postal code auto-fill UX (G-001) | Pending PM confirm; phụ thuộc external API |
| Prefecture dropdown render (G-002) | Pending PM confirm |
| Browser back button behavior (G-022) | Browser-level behavior |
| Pagination control ẩn/hiện khi totalPages < 2 | Visual verification |

---

## 9. Entry / Exit Criteria

### Entry Criteria (bắt đầu test)

- [ ] Tất cả 6 API endpoints được deploy lên môi trường test
- [ ] `DeliveryCenterResponse` có field `updatedAt` (Gap-2 update đã fix)
- [ ] `DeliveryCenterUpdateRequest` DTO riêng đã có (không dùng chung với Create)
- [ ] DB schema đã migrate V10 (code=20, name=100, address=255, NOT NULL cho postal/prefecture/address)
- [ ] Test data seed: ít nhất 1 ADMIN user, 2 ACTIVE clients, 2+ areas per client
- [ ] Dependent APIs (client dropdown, area dropdown) đã available hoặc mock

### Exit Criteria (hoàn thành test)

- [ ] Tất cả P1 test cases (TT-01, TT-02, TT-03, TT-04) PASS
- [ ] Không có critical bug (401 bypass, data corruption, silent duplicate)
- [ ] P2 test cases PASS ≥ 90%
- [ ] Tất cả **`Need confirm spec?`** gaps đã được BA/PM xác nhận trước khi viết test case liên quan
- [ ] Optimistic lock scenario đã được verify trên môi trường test với 2 concurrent requests

---

## 10. Gaps & Questions

### Đã Confirmed

| Gap ID | Nội dung | Trạng thái |
|---|---|---|
| G-R01 | センターID read-only trong edit mode — form tạo mới nhập được, form sửa hiển thị static | ✅ Confirmed — M-03-cud §3 #5 |
| G-R02 | Nút "Xóa" chỉ hiển thị ở `/center/{id}/edit`, không hiển thị ở `/center/new` | ✅ Confirmed — M-03-cud §3 #11 |
| G-R03 | Sort chỉ 3 cột: センターID, クライアントID, エリア名. クライアント名 và 配送センター名 không có sort | ✅ Confirmed — M-03 §3, §5 |
| G-R04 | Soft delete dùng `deleted_at`; bản ghi soft-deleted ẩn khỏi list và dropdown | ✅ Confirmed — M-03-cud §5 |
| G-R05 | Optimistic lock dùng `updated_at`; conflict → MSG-020 409 | ✅ Confirmed — M-03-cud §3 #12, §5 |
| G-R06 | Delete bị chặn nếu còn tham chiếu từ m_stores hoặc m_clients (fixed_center) → MSG-022 409 | ✅ Confirmed — M-03-cud §5 |
| G-R07 | Sau khi Lưu thành công (create/update) → redirect về `/center` | ✅ Confirmed — M-03-cud §4 |
| G-R08 | Dropdown クライアント trong form ẩn INACTIVE + deleted; khác với filter list (chỉ ẩn deleted) | ✅ Confirmed — M-03-cud §3 #3, common-spec §5.6 |
| G-R09 | Khi đổi client trong form → reset area selection + reload area dropdown theo client mới | ✅ Confirmed — M-03-cud §2 |
| G-R10 | Pagination control ẩn khi `totalPages < 2` (trang 1 hoặc không có kết quả) | ✅ Confirmed — M-03 §2 #10 |
| G-003 | センターID unique check là **case-insensitive**: `KAKO` = `kako` cùng client → 409 MSG-010 | ✅ Confirmed từ D-14 §5 (existsByClientIdAndCode**IgnoreCase**AndDeletedAtIsNull) |
| G-005 | Điều kiện chặn delete từ m_clients: `fixed_center_id = {id}` AND `destination_type = 'FIXED_CENTER'` AND `deleted_at IS NULL`. Tên cột: `fixed_center_id` | ✅ Confirmed từ D-14 Delete §3.2, §15 Gap-3 |
| G-006 | Phone +81 format (ví dụ `+81-90-1234-5678`): sau strip → `81901234567` — bắt đầu `8`, không phải `0` → 400 MSG-013. Không auto-convert | ✅ Confirmed từ D-14 Create §5 validation, common-spec §5.11 |
| G-007 | センターID không được chứa dấu `-`: `kako-gawa` → 400 MSG-002. Pattern: `^[A-Za-z0-9]+$` | ✅ Confirmed từ D-14 Create §5 validation, §6.1 DTO @Pattern |
| G-008 | Filter "Tên trung tâm" gửi `name` (String, exact match, case-insensitive). 2 center cùng tên → cả 2 xuất hiện trong results | ✅ Confirmed từ D-14 §5.1 Request params, §16 Note 2 |
| G-009 | Page size **mặc định là 30** (@PageableDefault). Options: 15/30/50 | ✅ Confirmed từ D-14 §5.1 @PageableDefault(size = 30) |
| G-011 | M-03-cud là **full-page navigation** với URL riêng (`/center/new`, `/center/{id}/edit`). Không phải modal/overlay | ✅ Confirmed từ D-14 §2 Overview |
| G-012 | Confirmation dialog xóa: title `配送センターの削除`, body `本当にこの配送センターを削除してもよろしいですか？`, buttons `キャンセル` / `削除する` | ✅ Confirmed từ D-14 Delete §12 FE Behavior F-02 |
| G-013 | Nhấn「キャンセル」khi có unsaved changes: **redirect về list ngay, không hỏi xác nhận** — thiết kế cố ý (by design) | ✅ Confirmed từ D-14 Create §14 F-05, Update §14 F-05 |
| G-015 | Khi đổi client trong form: area selection **luôn reset về trống** bất kể area cũ có thuộc client mới không | ✅ Confirmed từ D-14 Update §14 F-02 |
| G-018 | Khi `totalPages < 2`: **ẩn toàn bộ** pagination control (kể cả nút next/prev, page numbers) | ✅ Confirmed từ D-14 §14 FE Behavior: "ẩn điều khiển phân trang" |
| G-019 | Mã bưu điện **phải nhập đúng format có dấu `-`** (`123-4567`). Nhập `1234567` không có `-` → 400 MSG-002. FE không tự format | ✅ Confirmed từ D-14 Create §5 validation, §6.1 @Pattern(regex=`^\d{3}-\d{4}$`) |
| G-020 | BE validate cross-client area: `area.client_id ≠ request.clientId` → 400 **PSMS_CTR_004** `このエリアは選択されたクライアントに属していません`. Cần test bypass FE để verify BE defense | ✅ Confirmed từ D-14 Create §5 BL step 5, Update §5.2 BL step 7 |
| G-023 | Dropdown エリア名 trong **list filter**: hiển thị INACTIVE (停止). Dropdown エリア名 trong **form CUD**: ẩn INACTIVE | ✅ Confirmed từ D-14 §13.1 (common-spec §5.6 List vs Detail) |

---

### Chưa Confirmed — `Need confirm spec?`

| Gap ID | Nội dung | Impact nếu không confirm |
|---|---|---|
| **G-001** | **GAP-201 — Nguồn tra cứu 郵便番号**: Detail design gợi ý FE dùng external `zipcloud.ibsnet.co.jp` nhưng PM chưa xác nhận. Khi tra cứu thất bại (MSG-024), user có thể nhập thủ công không? ⚠ Partially confirmed từ D-14 §13.2: pending PM | Không thể viết test case auto-fill đầy đủ; không rõ expected behavior khi external API down |
| **G-002** | **GAP-202 — Master 都道府県**: Detail design gợi ý FE hardcode 47 tỉnh nhưng PM chưa xác nhận. Có option ngoài 47 tỉnh không? ⚠ Partially confirmed từ D-14 §13.3: pending PM | Không rõ test data cho prefecture; không rõ có cần test API timeout/error |
| **G-004** | **Tái sử dụng センターID sau soft delete**: Code hiện tại ALLOW (vì query dùng `deletedAtIsNull`), nhưng BD đánh dấu 要確認 — PM chưa confirm chính thức. ⚠ Partially confirmed từ D-14 §15 Note 3 | Test case "tạo lại sau khi xóa" có thể sai expected result; ảnh hưởng test data cleanup strategy |
| **G-010** | **Filter state sau khi return từ M-03-cud**: Detail design ghi "FE tự cache hoặc reset về default F-01" — không xác định rõ. ⚠ Partially confirmed từ D-14 §14 F-07 | Test case flow create/update/delete + verify list state không rõ expected |
| **G-014** | **UX khi dropdown エリア名 trống** (client chưa có area nào): spec không nêu placeholder message. Có hiển thị "エリアが存在しません" không? | Test case chọn client không có area không rõ expected UX |
| **G-016** | **Địa chỉ auto-fill từ postal code > 255 ký tự**: FE ghép address1+2+3 có thể vượt max 255. FE tự truncate hay user nhận MSG-009 khi Lưu? | Test case auto-fill → save không rõ expected result |
| **G-017** | **Cột số đầu tiên trong bảng M-03** (hiển thị 1, 2, 3…): là row number tuần tự theo trang (trang 2 bắt đầu từ 31), PK `id`, hay row index trong page? | Expected value của cột đầu tiên trong test case list không rõ |
| **G-021** | **Tiêu đề màn hình sửa "配送センター編集（ID=?）"**: ID= là PK (`id=1`) hay center code (`id=kakogawa`)? | Expected value của UI title trong test case edit không rõ |
| **G-022** | **Browser back button từ M-03-cud về M-03**: behavior có giống nhấn Hủy không? Có dialog "leave page" khi có unsaved changes không? | Test case navigation không đầy đủ |

---

### Thứ tự ưu tiên xác nhận trước khi viết test case

1. **G-001 + G-002** — Ảnh hưởng toàn bộ flow create/update liên quan postal + prefecture
2. **G-004** — Ảnh hưởng test data strategy và cleanup
3. **G-010** — Ảnh hưởng expected result của end-to-end flow tests
4. **G-014, G-016, G-017** — Ảnh hưởng test case cụ thể (edge case, data display)
5. **G-021, G-022** — Low priority; ảnh hưởng UI test case nhỏ
