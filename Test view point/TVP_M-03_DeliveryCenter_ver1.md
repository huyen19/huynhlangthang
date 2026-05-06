# Test View Point — M-03 Quản lý Trung tâm phân phối (配送センター)

| Mục | Nội dung |
|---|---|
| **File** | TVP_M-03_DeliveryCenter_ver1.md |
| **Màn hình** | M-03 / M-03-cud (Create) / M-03-update (Update) / M-03-delete (Delete) |
| **Ngày tạo** | 2026-05-04 |
| **Người tạo** | HuyenNTK1 |
| **Tài liệu tham chiếu** | [Detail Design M-03 List](../Requirements/M-03/Detail%20Design%20—%20M-03%20Delivery%20Center%20List.md) · [Detail Design M-03-cud Create](../Requirements/M-03/Detail%20Design%20—%20M-03-cud%20Delivery%20Center%20Create.md) · [Detail Design M-03-update](../Requirements/M-03/Detail%20Design%20—%20M-03-update%20Delivery%20Center%20Update.md) · [Detail Design M-03-delete](../Requirements/M-03/Detail%20Design%20—%20M-03-delete.md) · [Test Strategy M-03](../Test%20Strategy/TS_M-03_DeliveryCenter_ver1.md) |

---

## Lịch sử tạo file

| Phiên bản | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.0 | 2026-05-04 | Tạo mới | HuyenNTK1 |

---

## Bảng Test View Point

### Module 1: M-03 — Danh sách Trung tâm phân phối

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| TVP-001 | M-03 List | Display | Tải danh sách thành công khi ADMIN truy cập `/center` lần đầu — không có filter, sort mặc định `centerCode asc`, size mặc định 30, chỉ hiển thị center có `deleted_at IS NULL` | Functional | High |
| TVP-002 | M-03 List | Display | Bảng hiển thị đủ 6 cột đúng spec: センターID, クライアントID, クライアント名, エリア名, 配送センター名, nút「Sửa」— label, thứ tự cột khớp thiết kế | UI | Medium |
| TVP-003 | M-03 List | Display | Cột số đầu tiên trong bảng (hiển thị 1, 2, 3…): xác nhận giá trị là row number theo trang, PK `id`, hay index trong page `[⚠️ Need Confirm — G-017]` | UI | Low |
| TVP-004 | M-03 List | Filter | Filter `centerCode` partial match, case-insensitive: nhập `kako` → trả về tất cả center có `code LIKE %kako%` (cả `KAKO`, `Kakogawa`) | Functional | High |
| TVP-005 | M-03 List | Filter | Filter `centerCode` trim whitespace 2 đầu: `"  kako  "` → query với `%kako%` (không include khoảng trắng) | Validation | High |
| TVP-006 | M-03 List | Filter | Filter `centerCode` chỉ gồm whitespace (`"   "`) → bỏ qua điều kiện, trả toàn bộ list (không filter) | Edge Case | High |
| TVP-007 | M-03 List | Filter | Filter `clientId` từ dropdown クライアント名 → chỉ trả về center thuộc client đó | Functional | High |
| TVP-008 | M-03 List | Filter | Filter `areaId` từ dropdown エリア名 (được thu hẹp theo clientId đã chọn) → chỉ trả về center thuộc area đó | Functional | High |
| TVP-009 | M-03 List | Filter | Filter `centerName` exact match, case-insensitive qua dropdown 配送センター名 → chỉ trả về center khớp chính xác tên (partial `"加古川"` không khớp tên đầy đủ `"加古川配送センター"`) | Functional | High |
| TVP-010 | M-03 List | Filter | Kết hợp nhiều filter cùng lúc (AND logic): `clientId=X AND areaId=Y AND centerCode=z` → intersection, không phải union | Functional | High |
| TVP-011 | M-03 List | Filter | Không có kết quả khớp filter → trả `content=[]`, `totalElements=0`, hiển thị empty state | Edge Case | Medium |
| TVP-012 | M-03 List | Filter | `clientId` trỏ đến client đã xóa mềm hoặc không tồn tại → trả `content=[]` (FK không match), không báo lỗi | Edge Case | Medium |
| TVP-013 | M-03 List | Sort | Sort mặc định `centerCode asc` khi không truyền `sort` param | Functional | High |
| TVP-014 | M-03 List | Sort | Sort theo `centerCode asc` / `centerCode desc` — ORDER BY `m_delivery_centers.code` | Functional | High |
| TVP-015 | M-03 List | Sort | Sort theo `clientCode asc` / `clientCode desc` — ORDER BY `m_clients.code` (JOIN) | Functional | High |
| TVP-016 | M-03 List | Sort | Sort theo `areaName asc` / `areaName desc` — ORDER BY `m_areas.name` (JOIN) | Functional | High |
| TVP-017 | M-03 List | Sort | Sort field không hợp lệ (`id`, `clientName`, `name`, `status`…) → 400 PSMS-CTR-005 `ソート項目「{0}」は使用できません` | Negative | High |
| TVP-018 | M-03 List | Sort | Sort direction không hợp lệ (`up`, `down`, `ascending`…) → 400 PSMS-CTR-011 `並び替えの方向が不正です。` | Negative | High |
| TVP-019 | M-03 List | Pagination | Default page size = 30 khi vào list lần đầu (`size` không truyền) `[⚠️ Mock≠Spec: follow Spec — UI screenshot hiển thị 50件表示]` | Functional | High |
| TVP-020 | M-03 List | Pagination | User đổi page size sang 15 / 30 / 50 → danh sách reload với đúng số bản ghi/trang, reset về trang 1 | Functional | Medium |
| TVP-021 | M-03 List | Pagination | Điều hướng trang: next/prev/page number → đúng trang, giữ nguyên filter + sort | Functional | Medium |
| TVP-022 | M-03 List | Pagination | Pagination control **ẩn toàn bộ** khi `totalPages < 2` (1 trang hoặc không có kết quả) | UI | Medium |
| TVP-023 | M-03 List | Pagination | Truy cập `page` vượt quá `totalPages` → 200, `content=[]`, `totalElements` không đổi | Edge Case | Medium |
| TVP-024 | M-03 List | Data | Center có `deleted_at IS NOT NULL` (soft-deleted) **không hiển thị** trong list | Data | High |
| TVP-025 | M-03 List | Data | Center có `status = INACTIVE` vẫn **hiển thị** trong list (không bị lọc theo status) | Data | High |
| TVP-026 | M-03 List | State | Filter state sau khi return từ M-03-cud: danh sách giữ filter/sort/trang cũ hay reset về default `[⚠️ Need Confirm — G-010]` | State & Flow | Medium |
| TVP-027 | M-03 List | Navigation | Click nút「Sửa」của center → navigate đến `/center/{id}/edit` với đúng `id` tương ứng | Functional | High |

---

### Module 2: Dropdown APIs (phục vụ filter M-03 List)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| TVP-028 | Dropdown | センター名 Dropdown | `GET /v1/delivery-centers/dropdown` không có `clientId` → trả toàn bộ center có `deleted_at IS NULL`, ORDER BY name ASC | Functional | High |
| TVP-029 | Dropdown | センター名 Dropdown | `GET /v1/delivery-centers/dropdown?clientId={id}` → chỉ trả center thuộc client đó, ẩn soft-deleted | Functional | High |
| TVP-030 | Dropdown | センター名 Dropdown | Dropdown hiển thị center `status = INACTIVE` (theo common-spec §5.6 List — ẩn INACTIVE chỉ áp dụng cho form CUD, không áp dụng list filter) | Data | High |
| TVP-031 | Dropdown | センター名 Dropdown | Dropdown **ẩn** center đã soft-deleted (`deleted_at IS NOT NULL`) | Data | High |
| TVP-032 | Dropdown | Cascade Filter | Khi user chọn クライアント trong filter → dropdown エリア名 thu hẹp theo clientId đã chọn; dropdown 配送センター名 thu hẹp theo clientId đã chọn | Integration | High |
| TVP-033 | Dropdown | Cascade Filter | Khi user xóa chọn クライアント (về null) → dropdown エリア名 và 配送センター名 reload toàn bộ master (không theo client) | Integration | Medium |

---

### Module 3: M-03-cud — Tạo mới Trung tâm phân phối

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| TVP-034 | M-03 Create | Display | Form tạo mới tại `/center/new`: tất cả fields trống, nút「Xóa」**không hiển thị**, nút「Lưu」và「キャンセル」hiển thị | UI | Medium |
| TVP-035 | M-03 Create | Functional | Tạo center với đầy đủ fields hợp lệ → 201 Created, response gồm đủ 12 fields (id, code, name, clientId, clientName, areaId, areaName, postalCode, prefecture, address, phone, status=ACTIVE), toast「登録しました」, redirect `/center` | Functional | High |
| TVP-036 | M-03 Create | Functional | Tạo center với `phone = null` (optional field) → 201 Created, `data.phone = null` | Functional | High |
| TVP-037 | M-03 Create | Cancel | Click「キャンセル」khi đang nhập form (có unsaved data) → redirect `/center` ngay, **không hiển thị dialog xác nhận** (by design) | User Behavior | Medium |
| TVP-038 | M-03 Create | Validation — name | `name` để trống / null → 400 MSG-001 `{項目名}を入力してください`, inline error dưới field | Validation | High |
| TVP-039 | M-03 Create | Validation — name | `name` chỉ gồm whitespace (`"   "`) → 400 MSG-001 (after trim = blank) | Validation | High |
| TVP-040 | M-03 Create | Validation — name | `name` có whitespace 2 đầu → DB lưu trimmed value (ví dụ `"  加古川  "` → DB: `"加古川"`) | Data | High |
| TVP-041 | M-03 Create | Validation — name BVA | `name` đúng 100 ký tự → 201 OK; `name` 101 ký tự → 400 MSG-009 `{max}文字以内で入力してください` | Boundary | High |
| TVP-042 | M-03 Create | Validation — code | `code` để trống / null → 400 MSG-001 | Validation | High |
| TVP-043 | M-03 Create | Validation — code | `code` chứa ký tự không phải 半角英数字: dấu gạch ngang (`kako-gawa`), khoảng trắng, ký tự đặc biệt (`@`, `_`…) → 400 MSG-002 `半角英数字とハイフンのみで入力してください` | Validation | High |
| TVP-044 | M-03 Create | Validation — code BVA | `code` đúng 20 ký tự → 201 OK; `code` 21 ký tự → 400 MSG-009 | Boundary | High |
| TVP-045 | M-03 Create | Validation — postalCode | `postalCode` để trống / null → 400 MSG-001 | Validation | High |
| TVP-046 | M-03 Create | Validation — postalCode | `postalCode` nhập không có dấu `-` (`"1234567"`) → 400 MSG-002; nhập đúng `"123-4567"` → pass | Validation | High |
| TVP-047 | M-03 Create | Validation — postalCode BVA | `postalCode` đúng format `999-9999` (7 chars + 1 hyphen = 8 chars, max col 10) → 201; > 10 chars → 400 MSG-009 | Boundary | Medium |
| TVP-048 | M-03 Create | Validation — prefecture | `prefecture` để trống / null → 400 MSG-001 | Validation | High |
| TVP-049 | M-03 Create | Validation — prefecture BVA | `prefecture` đúng 20 ký tự → 201; 21 ký tự → 400 MSG-009 | Boundary | Medium |
| TVP-050 | M-03 Create | Validation — prefecture | Dropdown 都道府県 — nguồn data (FE hardcode 47 tỉnh hay API) `[⚠️ Need Confirm — G-002]` | Integration | High |
| TVP-051 | M-03 Create | Validation — address | `address` để trống / null → 400 MSG-001 | Validation | High |
| TVP-052 | M-03 Create | Validation — address | `address` có whitespace 2 đầu → DB lưu trimmed value | Data | Medium |
| TVP-053 | M-03 Create | Validation — address BVA | `address` đúng 255 ký tự → 201; 256 ký tự → 400 MSG-009 | Boundary | High |
| TVP-054 | M-03 Create | Validation — phone | `phone = null` (optional) → 201 OK | Validation | High |
| TVP-055 | M-03 Create | Validation — phone | `phone` hợp lệ: `"090-1234-5678"` → strip `+`, `-`, space → `"09012345678"` (11 digits, bắt đầu `0`) → 201 | Validation | High |
| TVP-056 | M-03 Create | Validation — phone | `phone` dạng quốc tế `"+81-90-1234-5678"` → sau strip: `"81901234567"` (bắt đầu `8`, không phải `0`) → 400 MSG-013 `10桁または11桁で入力してください` | Validation | High |
| TVP-057 | M-03 Create | Validation — phone | `phone` chứa ký tự chữ sau strip (ví dụ `"abc-1234-5678"`) → 400 MSG-013 | Validation | Medium |
| TVP-058 | M-03 Create | Validation — clientId | `clientId = null` → 400 MSG-001 | Validation | High |
| TVP-059 | M-03 Create | Validation — clientId | `clientId` trỏ đến client không tồn tại hoặc đã xóa mềm → 404 PSMS_CTR_002 `クライアントが見つかりません` | Negative | High |
| TVP-060 | M-03 Create | Validation — clientId | `clientId` trỏ đến client có `status = INACTIVE` → 400 PSMS_CTR_006 `このクライアントは無効です` | Negative | High |
| TVP-061 | M-03 Create | Validation — areaId | `areaId = null` → 400 MSG-001 | Validation | High |
| TVP-062 | M-03 Create | Validation — areaId | `areaId` trỏ đến area không tồn tại hoặc đã xóa mềm → 404 PSMS_CTR_003 `エリアが見つかりません` | Negative | High |
| TVP-063 | M-03 Create | Validation — cross-field | `areaId` không thuộc `clientId` đã chọn → 400 PSMS_CTR_004 `このエリアは選択されたクライアントに属していません` (bypass FE để test BE validate) | Cross-field | High |
| TVP-064 | M-03 Create | Business Rule | Tạo center với `(clientId, code)` đã tồn tại (active record) → 409 MSG-010 `この配送センターIDは既に登録されています` | Negative | High |
| TVP-065 | M-03 Create | Business Rule | Unique check **case-insensitive**: DB có `code="KAKO"` cùng client → tạo `code="kako"` cùng client → 409 MSG-010 | Data | High |
| TVP-066 | M-03 Create | Business Rule | Tạo center với cùng `code` nhưng **khác** `clientId` → 201 OK (unique scope là per-client) | Data | High |
| TVP-067 | M-03 Create | Business Rule | Tạo center với `code` trùng với bản ghi **đã xóa mềm** cùng client: expect 201 OK (code hiện tại cho phép) `[⚠️ Need Confirm — G-004]` | Business Logic | High |
| TVP-068 | M-03 Create | Integration | Auto-fill địa chỉ khi nhập `postalCode` đủ format → prefecture + address được fill tự động `[⚠️ Need Confirm — G-001: nguồn API chưa xác định]` | Integration | High |
| TVP-069 | M-03 Create | Integration | Auto-fill thất bại (API timeout/404) → hiển thị MSG-024; user vẫn có thể nhập thủ công `[⚠️ Need Confirm — G-001: flow khi fail]` | Integration | High |
| TVP-070 | M-03 Create | Edge Case | Địa chỉ auto-fill có thể vượt 255 ký tự → FE truncate hay MSG-009 khi Lưu `[⚠️ Need Confirm — G-016]` | Edge Case | Medium |
| TVP-071 | M-03 Create | Cross-field | Chọn クライアント → dropdown エリア名 thu hẹp theo client đã chọn; đổi クライアント → エリア名 reset và reload | Cross-field | High |
| TVP-072 | M-03 Create | Edge Case | Dropdown エリア名 trống (client chưa có area nào): UX hiển thị gì? Có thể Lưu với areaId=null nhận MSG-001 không? `[⚠️ Need Confirm — G-014]` | Edge Case | Medium |
| TVP-073 | M-03 Create | DB Mapping | Sau khi tạo thành công, verify trong list: `code` (センターID), `clientCode` (クライアントID), `clientName` (クライアント名), `areaName` (エリア名), `name` (配送センター名) hiển thị đúng DB values | DB↔UI | High |

---

### Module 4: M-03-update — Chỉnh sửa Trung tâm phân phối

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| TVP-074 | M-03 Update | Pre-load | `GET /v1/delivery-centers/{id}` → form được fill đầy đủ tất cả fields với giá trị hiện tại từ DB (name, code, clientId, areaId, postalCode, prefecture, address, phone, status); `updatedAt` có trong response để dùng làm lock token | Functional | High |
| TVP-075 | M-03 Update | Pre-load | Pre-load với `id` không tồn tại hoặc đã soft-deleted → 404 PSMS_CTR_001, redirect về list | Negative | High |
| TVP-076 | M-03 Update | Display | Field `code` (センターID) hiển thị dưới dạng **read-only** (không thể chỉnh sửa) trong edit mode | UI | High |
| TVP-077 | M-03 Update | Display | Nút「Xóa」hiển thị ở edit mode (`/center/{id}/edit`); không hiển thị ở create mode | UI | High |
| TVP-078 | M-03 Update | Display | Tiêu đề màn hình sửa hiển thị `配送センター編集（ID=?）`: xác nhận `ID=` là PK số hay `center_code` `[⚠️ Need Confirm — G-021]` | UI | Low |
| TVP-079 | M-03 Update | Optimistic Lock | PUT với `updatedAt` khớp DB → 200 OK, toast「編集しました」, redirect `/center` | Functional | High |
| TVP-080 | M-03 Update | Optimistic Lock | PUT với `updatedAt` **không khớp** DB (user khác đã sửa trước) → 409 MSG-020 `他のユーザーが更新したため保存できません。画面を再読み込みしてから再度お試しください。` | Negative | High |
| TVP-081 | M-03 Update | Optimistic Lock | PUT với `updatedAt = null` → 400 MSG-001 | Negative | High |
| TVP-082 | M-03 Update | Business Rule | PUT body có chứa field `code` → BE **ignore**, DB không thay đổi giá trị code | Business Logic | High |
| TVP-083 | M-03 Update | Validation | Validation tất cả editable fields tương tự Create: name (required/trim/max 100), postalCode (required/format/max 10), prefecture (required/max 20), address (required/trim/max 255), phone (optional/strip/10-11 digits/start 0), clientId (required/ACTIVE check), areaId (required/not found/cross-client) | Validation | High |
| TVP-084 | M-03 Update | Business Rule | Đổi sang client khác có center với cùng `code` (current code, case-insensitive) → 409 MSG-010 | Negative | High |
| TVP-085 | M-03 Update | Cross-field | Đổi クライアント trong form edit → dropdown エリア名 reset và reload theo client mới (không giữ selection cũ, kể cả area cũ vẫn thuộc client mới) | Cross-field | High |
| TVP-086 | M-03 Update | Cancel | Click「キャンセル」từ edit form (có unsaved changes) → redirect `/center` ngay, không hỏi xác nhận | User Behavior | Medium |
| TVP-087 | M-03 Update | DB Mapping | Sau khi update thành công, verify trong list và trong pre-load: tất cả fields updated đúng DB values; `code` không thay đổi; `status` không thay đổi | DB↔UI | High |
| TVP-088 | M-03 Update | DB Mapping | Round-trip: edit form pre-load → sửa → Lưu → re-open edit form: tất cả fields (kể cả `updatedAt` mới) load đúng giá trị sau update | DB↔UI | High |
| TVP-089 | M-03 Update | Integration | Auto-fill địa chỉ khi sửa `postalCode` → fill lại prefecture + address `[⚠️ Need Confirm — G-001]` | Integration | Medium |
| TVP-090 | M-03 Update | User Behavior | User nhập sai form rồi sửa lại nhiều lần trước khi Lưu → validation chạy lại, chỉ submit final valid data | User Behavior | Medium |
| TVP-091 | M-03 Update | Edge Case | Browser back button từ `/center/{id}/edit` về `/center`: behavior có giống キャンセル không? Có dialog "unsaved changes" không? `[⚠️ Need Confirm — G-022]` | Edge Case | Low |

---

### Module 5: M-03-delete — Xóa mềm Trung tâm phân phối

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| TVP-092 | M-03 Delete | Display | Confirmation dialog hiển thị đúng nội dung: title `配送センターの削除`, body `本当にこの配送センターを削除してもよろしいですか？`, 2 buttons「キャンセル」và「削除する」 | UI | High |
| TVP-093 | M-03 Delete | Functional | Click「キャンセル」trong dialog → dialog đóng, record **không** bị xóa, ở lại trang edit | User Behavior | High |
| TVP-094 | M-03 Delete | Functional | Click「削除する」→ DELETE /v1/delivery-centers/{id} → 204 No Content → dialog đóng + redirect `/center` | Functional | High |
| TVP-095 | M-03 Delete | Data | Sau khi xóa thành công: record **không hiển thị** trong M-03 list (`deleted_at IS NOT NULL`) | Data | High |
| TVP-096 | M-03 Delete | Data | Sau khi xóa thành công: record **không hiển thị** trong dropdown 配送センター名 filter | Data | High |
| TVP-097 | M-03 Delete | Reference Check | Center có ACTIVE `m_stores.delivery_center_id` reference → 409 MSG-022 `関連データが存在するため削除できません。` | Negative | High |
| TVP-098 | M-03 Delete | Reference Check | Center có `m_clients.fixed_center_id` reference AND `destination_type = 'FIXED_CENTER'` AND `deleted_at IS NULL` → 409 MSG-022 | Negative | High |
| TVP-099 | M-03 Delete | Reference Check | Center chỉ bị reference bởi **soft-deleted** stores/clients (deleted_at IS NOT NULL) → 204 OK (xóa được vì check filter `deleted_at IS NULL`) | Edge Case | High |
| TVP-100 | M-03 Delete | Reference Check | Center bị reference bởi cả store lẫn client cùng lúc → 409 MSG-022 (fail-fast ở check store đầu tiên) | Edge Case | Medium |
| TVP-101 | M-03 Delete | Negative | DELETE lần 2 cùng id (center đã xóa mềm) → 404 PSMS_CTR_001 (không idempotent) | Negative | High |
| TVP-102 | M-03 Delete | Negative | DELETE với id không tồn tại → 404 PSMS_CTR_001 | Negative | Medium |
| TVP-103 | M-03 Delete | Data Lifecycle | Full lifecycle: Create → List (verify) → Edit → Update → List (verify updated) → Delete → List (verify gone) | Data | High |

---

### Module 6: Authorization — Tất cả Endpoints

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| TVP-104 | Authorization | ADMIN | ADMIN JWT hợp lệ có thể access tất cả 6 endpoints (GET list, GET dropdown, POST create, GET by id, PUT update, DELETE) → không bị chặn | Functional | High |
| TVP-105 | Authorization | LOGISTICS | LOGISTICS role JWT → 403 Forbidden cho tất cả 6 endpoints | Security | High |
| TVP-106 | Authorization | No JWT | Request không có `Authorization` header → 401 Unauthorized cho tất cả 6 endpoints | Security | High |
| TVP-107 | Authorization | Expired JWT | JWT hết hạn → 401 Unauthorized (Spring Security default) | Security | High |
| TVP-108 | Authorization | Data Leak | 401/403 response không tiết lộ thông tin nhạy cảm (không có data, stack trace trong body) | Security | Medium |

---

### Module 7: Security

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| TVP-109 | Security | SQL Injection | Nhập `' OR 1=1--` vào filter `centerCode` → hệ thống không bị inject, query chạy an toàn (Spring JPA parameterized query) | Security | High |
| TVP-110 | Security | XSS | Nhập `<script>alert(1)</script>` vào field `name` → 201 (lưu raw string); khi hiển thị trên list/form không execute script | Security | High |
| TVP-111 | Security | Input Reject | Input quá dài (ví dụ 10000 chars) vào name/address → 400 MSG-009, không gây crash hay timeout | Security | Medium |

---

### Module 8: Concurrency & System Behavior

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| TVP-112 | Concurrency | Optimistic Lock | 2 ADMIN cùng mở edit cùng record → người submit sau (updatedAt cũ) nhận 409 MSG-020; record cuối cùng trong DB là của người submit trước | Concurrency | High |
| TVP-113 | Concurrency | Double Submit | User double-click nút「Lưu」trong create form → hệ thống không tạo duplicate record | Concurrency | High |
| TVP-114 | System | Server Error | Server trả 500 → FE hiển thị modal lỗi kết nối theo common-spec §4.1 (MSG-022 generic), không crash UI | System Behavior | Medium |
| TVP-115 | System | Network | API call bị timeout/network chậm → FE không crash, có loading state; sau khi retry hoặc refresh có thể tiếp tục | System Behavior | Medium |

---

## Kiểm tra độ phủ theo Thinking Approach Checklist

| # | Checklist Category | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | FUNCTIONAL (Happy Path) | ✔ | TVP-001 (list), TVP-035 (create), TVP-079 (update), TVP-094 (delete) |
| 2 | INPUT VALIDATION (Field Level) | ✔ | TVP-038~067 (create), TVP-083 (update) — name/code/postalCode/phone/prefecture/address/clientId/areaId |
| 3 | BOUNDARY VALUE (BVA) | ✔ | TVP-041 (name 100/101), TVP-044 (code 20/21), TVP-047 (postal), TVP-049 (prefecture), TVP-053 (address 255/256) |
| 4 | NEGATIVE CASE | ✔ | TVP-017 (sort invalid), TVP-059~063 (client/area not found/inactive/cross), TVP-064~065 (duplicate), TVP-075 (pre-load 404), TVP-080 (optimistic lock), TVP-097~102 (delete reference check/404) |
| 5 | USER BEHAVIOR (Real-world) | ✔ | TVP-037 (cancel create), TVP-086 (cancel update), TVP-090 (sửa lại trước submit), TVP-093 (cancel dialog), TVP-091 (browser back `[Need Confirm]`) |
| 6 | SYSTEM BEHAVIOR | ✔ | TVP-114 (500 error modal), TVP-115 (timeout/network) |
| 7 | DATA INTEGRITY | ✔ | TVP-024 (soft-deleted hidden), TVP-025 (INACTIVE visible), TVP-040 (trim save), TVP-065 (case-insensitive unique), TVP-095~096 (after delete verify) |
| 8 | DB ↔ UI DATA MAPPING | ✔ | TVP-073 (create→list verify), TVP-087~088 (update→list/form verify), TVP-103 (full lifecycle) |
| 9 | INTEGRATION (API) | ✔ | TVP-032~033 (cascade dropdown), TVP-063 (cross-client bypass FE), TVP-068~069 (postal auto-fill `[Need Confirm]`), TVP-089 |
| 10 | SECURITY (Basic) | ✔ | TVP-105~108 (auth 401/403), TVP-109 (SQL injection), TVP-110 (XSS), TVP-111 (oversized input) |
| 11 | UX/UI | ✔ | TVP-002 (columns), TVP-022 (pagination hidden), TVP-034 (form display), TVP-076~077 (code readonly, delete button), TVP-092 (dialog content) |
| 12 | STATE & FLOW | ✔ | TVP-026 (filter state after return `[Need Confirm]`), TVP-027 (navigate to edit), TVP-082 (code not changed), TVP-103 (full CRUD flow) |
| 13 | CONCURRENCY (Advanced) | ✔ | TVP-112 (2 users same record), TVP-113 (double submit) |
| 14 | DATA LIFECYCLE | ✔ | TVP-024 (soft-delete hidden), TVP-095~096 (verify after delete), TVP-101 (delete idempotent), TVP-103 (full CRUD lifecycle) |
| 15 | SEARCH / FILTER / SORT | ✔ | TVP-004~012 (filter: partial/exact/combine), TVP-013~018 (sort: valid/invalid), TVP-065 (case-insensitive) |
| 16 | PAGINATION / LARGE DATA | ✔ | TVP-019~023 (default size, page size options, navigation, hidden control, out-of-range page) |
| 17 | CROSS-FIELD VALIDATION | ✔ | TVP-063 (area cross-client), TVP-071 (client→area cascade), TVP-085 (change client reset area), TVP-032~033 (cascade dropdown filter) |

---

## ⚠️ Các điểm cần làm rõ trước khi hoàn thiện TVP

| # | TVP ID liên quan | Nội dung cần xác nhận | Lý do không thể tự suy diễn |
|---|---|---|---|
| 1 | TVP-068, TVP-069, TVP-089 | **G-001 — Nguồn tra cứu 郵便番号**: API bên thứ ba (zipcloud), service nội bộ, hay dữ liệu tĩnh? Khi tra cứu thất bại (MSG-024), user có thể nhập thủ công 都道府県 + 住所 rồi Lưu không? | Spec đánh dấu 要確認, detail-design liệt kê 3 options nhưng chưa có quyết định chính thức từ PM |
| 2 | TVP-050 | **G-002 — Master 都道府県**: FE hardcode 47 tỉnh hay gọi API endpoint? Có option ngoài 47 tỉnh không? | Ảnh hưởng đến cách test dropdown (có hay không có API endpoint để test timeout/error) |
| 3 | TVP-067 | **G-004 — Reuse センターID sau soft delete**: Tạo center cùng `(clientId, code)` với record đã xóa mềm → 201 OK hay 409? | Code hiện tại ALLOW nhưng spec đánh dấu 要確認, PM chưa confirm chính thức |
| 4 | TVP-026 | **G-010 — Filter state sau khi return từ M-03-cud**: Danh sách giữ filter/sort/trang cũ hay reset về default? | Detail design nêu "FE tự cache hoặc reset về default F-01" nhưng không xác định rõ |
| 5 | TVP-072 | **G-014 — UX khi dropdown エリア名 trống**: Hiển thị placeholder message gì? User có thể submit với areaId=null không? | Spec không đề cập UI trong trường hợp này |
| 6 | TVP-070 | **G-016 — Địa chỉ auto-fill > 255 ký tự**: FE tự truncate hay user nhận MSG-009 khi Lưu? | Spec không nêu cách xử lý khi auto-fill vượt max length |
| 7 | TVP-003 | **G-017 — Cột số đầu tiên trong bảng**: Row number theo trang, PK `id`, hay row index? | Spec không định nghĩa cột này; UI screenshot hiển thị 1,2,3…10 nhưng không rõ logic |
| 8 | TVP-078 | **G-021 — Tiêu đề màn hình sửa `ID=`**: Giá trị là PK (`id=1`) hay center code (`id=kakogawa`)? | Spec ghi `配送センター編集（ID=）` nhưng không nêu rõ giá trị; UI screenshot hiển thị `id=1` gợi ý PK |
| 9 | TVP-091 | **G-022 — Browser back button**: Behavior có giống キャンセル không? Có dialog "leave page" khi unsaved changes không? | Spec chỉ định nghĩa hành vi nút Hủy và nút Lưu, không đề cập browser back button |
