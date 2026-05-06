# Test View Point — M-02 Quản lý thông tin khu vực (エリア)

| Mục | Nội dung |
|---|---|
| File | TVP_M-02_Area_ver1.md |
| Ngày tạo | 2026-04-29 |
| Tài liệu tham chiếu | [M-02_VN.md](../Requirements/M-02/M-02_エリア情報一覧_VN.md), [M-02-cud_VN.md](../Requirements/M-02/M-02-cud_エリア（追加・編集・削除）_VN.md), [detail-design_list.md](../Requirements/M-02/detail-design_list.md), [detail-design_create.md](../Requirements/M-02/detail-design%20create.md), [detail-design_update.md](../Requirements/M-02/detail-design_update.md), [detail-design_delete.md](../Requirements/M-02/detail-design_delete.md), [TS_M-02_Area_ver1.md](../Test%20Strategy/TS_M-02_Area_ver1.md) |

---

## 1. Lịch sử tạo file

| Phiên bản | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.0 | 2026-04-29 | Tạo mới | HuyenNTK1 |

---

## 2. Bảng Quan điểm Kiểm thử (TVP)

### M-02 — Danh sách khu vực (List)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-001** | M-02 | List Display | Kiểm tra hiển thị đầy đủ các cột bảng: No., エリアID, エリア名, ステータス, クライアント名, 編集. [⚠️ Mock≠Spec: Spec không đề cập cột No. và ステータス — follow UI mockup; xem G-005] | UI | Medium |
| **TVP-002** | M-02 | List Display | Kiểm tra cột ステータス hiển thị: `ACTIVE` → 「有効」, `INACTIVE` → 「無効」 | UI | Medium |
| **TVP-003** | M-02 | List Display | Kiểm tra area đã xóa mềm (`deleted_at IS NOT NULL`) **không hiển thị** trong danh sách | Functional | High |
| **TVP-004** | M-02 | List Display | Kiểm tra area có `status = INACTIVE` **vẫn hiển thị** trong danh sách (không bị ẩn theo status) | Functional | High |
| **TVP-005** | M-02 | List Display | Kiểm tra cột centerNames: area có nhiều trung tâm → hiển thị danh sách tên; area không có trung tâm nào → hiển thị rỗng. [⚠️ Need Confirm: G-028 — centerNames hiển thị ở đâu trên UI?] | Functional | Medium |
| **TVP-006** | M-02 | List Display | Kiểm tra sắp xếp mặc định khi vào màn hình: theo エリアID (`area_code`) tăng dần | Functional | High |
| **TVP-007** | M-02 | List Display | Kiểm tra hiển thị tiêu đề màn hình: 「エリア管理」(hoặc 「Quản lý thông tin khu vực — Danh sách」theo spec) | UI | Low |

### M-02 — Filter (Bộ lọc)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-008** | M-02 | Filter | Kiểm tra filter エリアID: **exact match case-sensitive** sau khi trim — nhập "01" chỉ trả area có `code = "01"` (không trả "A01") | Functional | High |
| **TVP-009** | M-02 | Filter | Kiểm tra filter エリアID: nhập có khoảng trắng đầu/cuối (ví dụ "  01  ") → trim → tìm "01" | Validation | Medium |
| **TVP-010** | M-02 | Filter | Kiểm tra filter エリアID: chỉ toàn khoảng trắng → sau trim rỗng → **bỏ qua điều kiện**, trả tất cả | Validation | Medium |
| **TVP-011** | M-02 | Filter | Kiểm tra filter クライアント名: chọn từ dropdown, chỉ trả area thuộc client đó | Functional | High |
| **TVP-012** | M-02 | Filter | Kiểm tra filter クライアント名: dropdown hiển thị client nào — INACTIVE có xuất hiện không? [⚠️ Need Confirm: G-004] | UI | High |
| **TVP-013** | M-02 | Filter | Kiểm tra filter Tên trung tâm (centerId): chỉ trả area có delivery center tương ứng còn active. [⚠️ Need Confirm: G-003 — filter này có trên UI không?] | Functional | High |
| **TVP-014** | M-02 | Filter | Kiểm tra kết hợp nhiều filter cùng lúc (AND logic): エリアID + クライアント名 | Functional | High |
| **TVP-015** | M-02 | Filter | Kiểm tra filter không có kết quả nào khớp → hiển thị empty state | Edge Case | Medium |

### M-02 — Sort (Sắp xếp)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-016** | M-02 | Sort | Kiểm tra sort theo エリアID (`code`) tăng dần / giảm dần | Functional | High |
| **TVP-017** | M-02 | Sort | Kiểm tra sort theo エリア名 (`name`) tăng dần / giảm dần. [⚠️ Mock≠Spec: G-027 confirmed — bug API cần fix, follow spec: tất cả cột đều sort được] | Functional | High |
| **TVP-018** | M-02 | Sort | Kiểm tra sort theo クライアント名 tăng dần / giảm dần | Functional | Medium |
| **TVP-019** | M-02 | Sort | Kiểm tra sort theo センター名 tăng dần / giảm dần — area không có center xếp cuối (NULLS LAST) | Functional | Medium |
| **TVP-020** | M-02 | Sort | Kiểm tra sort field không hợp lệ (`sort=description,asc`) → 400 Bad Request (PSMS-AREA-001) | Negative | Medium |
| **TVP-021** | M-02 | Sort | Kiểm tra sort direction không hợp lệ (`sort=code,UP`) → 400 Bad Request (PSMS-AREA-002) | Negative | Medium |
| **TVP-022** | M-02 | Sort | Kiểm tra sort kết hợp filter: khi đổi thứ tự sắp xếp, filter condition vẫn được giữ nguyên | Functional | Medium |

### M-02 — Pagination (Phân trang)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-023** | M-02 | Pagination | Kiểm tra default page size = **30** bản ghi/trang | Functional | High |
| **TVP-024** | M-02 | Pagination | Kiểm tra pagination controls **ẩn** khi ở trang 1; **hiển thị** từ trang 2 trở đi | UI | Medium |
| **TVP-025** | M-02 | Pagination | Kiểm tra chuyển trang: filter và sort được **giữ nguyên** khi đổi trang | Functional | High |
| **TVP-026** | M-02 | Pagination | Kiểm tra trang cuối (last page): hiển thị đúng số bản ghi còn lại (có thể < 30) | Edge Case | Medium |
| **TVP-027** | M-02 | Pagination | Kiểm tra tổng số bản ghi (totalElements) và số trang (totalPages) trả về đúng | Data | Medium |

### M-02 — Drawer Mở / Đóng

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-028** | M-02 | Drawer | Kiểm tra nhấn nút 「追加」→ Drawer mở ở chế độ tạo mới, form trống | Functional | High |
| **TVP-029** | M-02 | Drawer | Kiểm tra nhấn nút 「編集」trên một dòng → Drawer mở ở chế độ sửa, dữ liệu đúng area được load vào form | Functional | High |
| **TVP-030** | M-02 | Drawer | Kiểm tra deep link tạo mới (`/area?drawer=area&mode=new`) → Drawer mở ở chế độ tạo mới | Functional | Medium |
| **TVP-031** | M-02 | Drawer | Kiểm tra deep link sửa (`/area?drawer=area&mode=edit&id={id}`) với ID hợp lệ → Drawer load đúng dữ liệu | Functional | Medium |
| **TVP-032** | M-02 | Drawer | Kiểm tra deep link sửa với ID không tồn tại hoặc đã xóa mềm → 404, Drawer không mở hoặc hiển thị lỗi | Edge Case | Medium |
| **TVP-033** | M-02 | Drawer | Kiểm tra sau khi Drawer đóng (Lưu thành công), danh sách M-02 reload hiển thị dữ liệu mới nhất | Functional | High |
| **TVP-034** | M-02 | Drawer | Kiểm tra filter và sort state sau khi Drawer đóng. [⚠️ Need Confirm: G-013 — có giữ nguyên hay reset?] | Functional | Medium |

---

### M-02-cud — Tạo mới (Create)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-035** | M-02-cud | Create UI | Kiểm tra tiêu đề Drawer ở chế độ tạo mới: 「エリア新規登録」 | UI | Low |
| **TVP-036** | M-02-cud | Create UI | Kiểm tra dropdown クライアント名: chỉ hiển thị client có `status = ACTIVE` và chưa xóa mềm | UI | High |
| **TVP-037** | M-02-cud | Create Validation | Kiểm tra エリアID: bắt buộc nhập — để trống → error 「エリアIDを入力してください」 | Validation | High |
| **TVP-038** | M-02-cud | Create Validation | Kiểm tra エリアID: max 20 ký tự — nhập 21 ký tự → error 「20文字以内で入力してください」 | Validation | High |
| **TVP-039** | M-02-cud | Create Validation | Kiểm tra エリアID: boundary — nhập đúng 20 ký tự → hợp lệ; nhập 21 ký tự → lỗi (BVA) | Validation | High |
| **TVP-040** | M-02-cud | Create Validation | Kiểm tra エリアID: pattern 半角英数字 — ký tự không hợp lệ (ví dụ: 「エリア@#」) → error 「半角英数字とハイフンのみで入力してください」. [⚠️ Need Confirm: G-022 — hyphen có được phép không theo spec?] | Validation | High |
| **TVP-041** | M-02-cud | Create Validation | Kiểm tra エリア名: bắt buộc nhập — để trống → error 「エリア名称を入力してください」 | Validation | High |
| **TVP-042** | M-02-cud | Create Validation | Kiểm tra エリア名: chỉ toàn khoảng trắng → coi là rỗng → error「エリア名称を入力してください」 | Validation | High |
| **TVP-043** | M-02-cud | Create Validation | Kiểm tra エリア名: max **100** ký tự — nhập 101 ký tự → error「100文字以内で入力してください」. [⚠️ Mock≠Spec: G-021 confirmed — max = 100 cho cả Create lẫn Update] | Validation | High |
| **TVP-044** | M-02-cud | Create Validation | Kiểm tra エリア名: boundary — nhập đúng 100 ký tự → hợp lệ; 101 ký tự → lỗi (BVA) | Validation | High |
| **TVP-045** | M-02-cud | Create Validation | Kiểm tra エリア名: có khoảng trắng đầu/cuối → trim trước khi lưu và kiểm tra unique | Validation | Medium |
| **TVP-046** | M-02-cud | Create Validation | Kiểm tra クライアント名: bắt buộc chọn — không chọn → error 「クライアントを入力してください」 | Validation | High |
| **TVP-047** | M-02-cud | Create Business | Kiểm tra エリアID unique **case-sensitive** trong cùng client: "A1" và "a1" là 2 code KHÁC NHAU → cả hai đều tạo thành công. [⚠️ Mock≠Spec: G-024 confirmed — implementation bug IgnoreCase cần fix trước khi test] | Functional | High |
| **TVP-048** | M-02-cud | Create Business | Kiểm tra エリアID trùng (cùng client, cùng case) → 409, error 「指定されたエリアIDとクライアントの組み合わせは既に登録されています。」 | Negative | High |
| **TVP-049** | M-02-cud | Create Business | Kiểm tra エリアID trùng nhưng khác client → **201 OK** (unique scope theo client) | Edge Case | High |
| **TVP-050** | M-02-cud | Create Business | Kiểm tra エリア名 unique **case-insensitive** trong cùng client: "関西" và "関西" → 409. [⚠️ Need Confirm: G-025 — unique name constraint không có trong spec] | Negative | High |
| **TVP-051** | M-02-cud | Create Business | Kiểm tra エリア名 trùng sau khi trim: DB có "関西", nhập "  関西  " → 409 (trim match) | Negative | Medium |
| **TVP-052** | M-02-cud | Create Business | Kiểm tra エリア名 trùng nhưng khác client → **201 OK** | Edge Case | Medium |
| **TVP-053** | M-02-cud | Create Business | Kiểm tra clientId là client INACTIVE → 400 PSMS-AREA-003 「クライアントが見つかりません、または無効です」 | Negative | High |
| **TVP-054** | M-02-cud | Create Business | Kiểm tra clientId là client đã xóa mềm → 400 PSMS-AREA-003 | Negative | High |
| **TVP-055** | M-02-cud | Create Save | Kiểm tra 「保存」thành công → 201, Drawer đóng, danh sách M-02 refresh, area mới xuất hiện với `status = ACTIVE` | Functional | High |
| **TVP-056** | M-02-cud | Create Save | Kiểm tra toast sau khi tạo mới thành công: 「登録しました」 | UI | Medium |
| **TVP-057** | M-02-cud | Create Save | Kiểm tra DB sau khi tạo: `code`, `name` (trimmed), `client_id`, `status = ACTIVE`, `deleted_at = NULL`, `created_by = updated_by = user_email` | Data | High |

---

### M-02-cud — Sửa (Update)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-058** | M-02-cud | Edit UI | Kiểm tra tiêu đề Drawer ở chế độ sửa: 「エリア編集（ID=X）」trong đó X là area_code | UI | Low |
| **TVP-059** | M-02-cud | Edit UI | Kiểm tra エリアID field **read-only** khi sửa — không thể chỉnh sửa | UI | High |
| **TVP-060** | M-02-cud | Edit UI | Kiểm tra エリア名 và クライアント名 được pre-fill đúng giá trị hiện tại từ DB | UI | High |
| **TVP-061** | M-02-cud | Edit UI | Kiểm tra nút 「削除」màu đỏ **chỉ hiển thị ở chế độ Sửa**, không hiển thị ở chế độ Tạo mới | UI | High |
| **TVP-062** | M-02-cud | Edit Validation | Kiểm tra エリア名: bắt buộc, max 100 ký tự, không toàn khoảng trắng — tương tự Create (TVP-041 đến TVP-044) | Validation | High |
| **TVP-063** | M-02-cud | Edit Business | Kiểm tra PUT gửi kèm field `code` trong body → BE bỏ qua, DB giữ nguyên `code` gốc | Functional | High |
| **TVP-064** | M-02-cud | Edit Business | Kiểm tra đổi エリア名 sang tên khác (unique trong client mới) → 200 OK | Functional | High |
| **TVP-065** | M-02-cud | Edit Business | Kiểm tra giữ nguyên エリア名 của chính area đang sửa → 200 OK (self-exclusion trong unique check) | Edge Case | High |
| **TVP-066** | M-02-cud | Edit Business | Kiểm tra エリア名 trùng với area khác trong cùng client → 409 PSMS-AREA-002 | Negative | High |
| **TVP-067** | M-02-cud | Edit Business | Kiểm tra đổi クライアント名 sang client khác (ACTIVE + not-deleted) → 200 OK, clientName mới trong response | Functional | High |
| **TVP-068** | M-02-cud | Edit Business | Kiểm tra đổi sang client INACTIVE → 400 PSMS-AREA-003 | Negative | High |
| **TVP-069** | M-02-cud | Edit Save | Kiểm tra 「保存」thành công → 200, Drawer đóng, list refresh, giá trị mới hiển thị | Functional | High |
| **TVP-070** | M-02-cud | Edit Save | Kiểm tra toast sau khi sửa thành công: 「編集しました」 | UI | Medium |
| **TVP-071** | M-02-cud | Edit Save | Kiểm tra DB sau khi sửa: `name` và `client_id` cập nhật đúng; `code` và `status` giữ nguyên; `updated_at` và `updated_by` được cập nhật | Data | High |
| **TVP-072** | M-02-cud | Edit Save | Kiểm tra area bị xóa mềm bởi user khác trong khi đang mở Drawer → nhấn 「保存」→ 404 PSMS-AREA-001 [⚠️ Need Confirm: G-006 — FE hiển thị gì và xử lý thế nào?] | Edge Case | Medium |

---

### M-02-cud — Xóa (Delete)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-073** | M-02-cud | Delete UI | Kiểm tra nhấn nút 「削除」→ hiển thị hộp thoại xác nhận với tiêu đề 「エリアの削除」, nội dung 「本当にこのエリアを削除してもよろしいですか？」, nút 「キャンセル」và 「削除する」 | UI | High |
| **TVP-074** | M-02-cud | Delete UI | Kiểm tra nhấn 「キャンセル」trong hộp thoại → hộp thoại đóng, Drawer vẫn mở, không có hành động xóa | Functional | High |
| **TVP-075** | M-02-cud | Delete | Kiểm tra xóa thành công (area không có DC/Store active tham chiếu) → 204, Drawer đóng, list refresh, area không còn hiển thị | Functional | High |
| **TVP-076** | M-02-cud | Delete | Kiểm tra xóa **bị chặn** khi còn **Delivery Center** active tham chiếu → 409 MSG-022 「関連データが存在するため削除できません。」 | Functional | High |
| **TVP-077** | M-02-cud | Delete | Kiểm tra xóa **bị chặn** khi còn **Store** active tham chiếu → 409 MSG-022 | Functional | High |
| **TVP-078** | M-02-cud | Delete | Kiểm tra xóa **bị chặn** khi có cả DC lẫn Store active → 409 MSG-022 (cùng message, không phân biệt loại) | Functional | High |
| **TVP-079** | M-02-cud | Delete | Kiểm tra xóa **không bị chặn** khi DC/Store đã xóa mềm (`deleted_at IS NOT NULL`) → 204 | Edge Case | High |
| **TVP-080** | M-02-cud | Delete | Kiểm tra soft delete: row trong DB vẫn tồn tại với `deleted_at IS NOT NULL`; `GET /v1/areas/{id}` → 404; không hiển thị trong `GET /v1/areas` | Data | High |
| **TVP-081** | M-02-cud | Delete | Kiểm tra DB sau khi xóa: `deleted_at = NOW()`, `deleted_by = user_email`, `updated_at` và `updated_by` được cập nhật | Data | High |

---

### M-02-cud — Hủy (Cancel)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-082** | M-02-cud | Cancel | Kiểm tra nhấn 「キャンセル」→ Drawer đóng, không lưu dữ liệu đã nhập, không có confirmation dialog. [⚠️ Need Confirm: G-009 — thiết kế cố ý hay bỏ sót?] | Functional | Medium |

---

### M-02 — Phân quyền (Authorization)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-083** | M-02 | Authorization | Kiểm tra tất cả endpoint yêu cầu JWT hợp lệ — không có token → 401 Unauthorized | Security | High |
| **TVP-084** | M-02 | Authorization | Kiểm tra token hết hạn → 401 Unauthorized | Security | High |
| **TVP-085** | M-02 | Authorization | Kiểm tra role LOGISTICS truy cập bất kỳ endpoint nào → 403 Forbidden | Security | High |
| **TVP-086** | M-02 | Authorization | Kiểm tra role ADMIN có quyền thực hiện đầy đủ CRUD (GET/POST/PUT/DELETE) → 2xx | Security | High |
| **TVP-087** | M-02 | Authorization | Kiểm tra URL `/area` không truy cập được khi chưa đăng nhập | Security | High |

---

### DB ↔ UI Data Mapping

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-088** | M-02 | DB↔UI | Kiểm tra `m_areas.code` hiển thị đúng ở cột エリアID trong danh sách | Data | Medium |
| **TVP-089** | M-02 | DB↔UI | Kiểm tra `m_areas.name` hiển thị đúng ở cột エリア名 | Data | Medium |
| **TVP-090** | M-02 | DB↔UI | Kiểm tra `m_clients.name` hiển thị đúng ở cột クライアント名 (JOIN từ client_id) | Data | Medium |
| **TVP-091** | M-02 | DB↔UI | Kiểm tra `m_areas.status` mapping đúng: `ACTIVE` → 「有効」, `INACTIVE` → 「無効」 | Data | Medium |
| **TVP-092** | M-02 | DB↔UI | Kiểm tra round-trip: Tạo mới → reload danh sách → tất cả field hiển thị đúng, không bị sót hoặc format sai | Data | High |
| **TVP-093** | M-02-cud | DB↔UI | Kiểm tra khi mở Drawer sửa: giá trị load vào form (code, name, clientId) đúng với giá trị trong DB | Data | High |

---

### Concurrency & User Behavior

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-094** | M-02-cud | Concurrency | Kiểm tra 2 user tạo area cùng `(client_id, code)` đồng thời → 1 × 201, 1 × 409 (DB unique constraint bảo vệ) | Edge Case | High |
| **TVP-095** | M-02-cud | Concurrency | Kiểm tra 2 user sửa cùng area đồng thời → last-write-wins (optimistic lock chưa implement). [⚠️ Need Confirm: G-026 — khi nào implement MSG-020?] | Edge Case | Medium |
| **TVP-096** | M-02-cud | User Behavior | Kiểm tra double-click nút 「保存」→ không tạo/cập nhật duplicate (1 lần ghi dữ liệu) | Edge Case | Medium |
| **TVP-097** | M-02 | System Behavior | Kiểm tra UI xử lý khi API `/v1/areas` trả lỗi 500 → hiển thị thông báo lỗi hợp lý, không crash UI | Functional | Medium |
| **TVP-098** | M-02-cud | System Behavior | Kiểm tra UI xử lý khi API load dropdown クライアント名 thất bại. [⚠️ Need Confirm: G-011 — FE xử lý thế nào?] | Functional | Medium |

---

## 3. Thinking Approach Checklist

| # | Checklist Category | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | FUNCTIONAL (Happy Path) | ✔ | TVP-003, 006, 008, 011, 014, 016–019, 023, 025, 028–029, 033, 036, 055, 060, 064, 067–069, 075 — cover đầy đủ luồng List / Create / Update / Delete |
| 2 | INPUT VALIDATION (Field Level) | ✔ | TVP-037 đến 046, 062: cover エリアID (required, max 20, pattern) và エリア名 (required, max 100, trim); クライアント名 (required) |
| 3 | BOUNDARY VALUE (BVA) | ✔ | TVP-039, 044: boundary max length code (20) và name (100) — min value 1 char (NotBlank) |
| 4 | NEGATIVE CASE | ✔ | TVP-020, 021, 040, 047–051, 053, 054, 066, 068, 076–078: sort không hợp lệ, trùng code/name, client không hợp lệ, FK constraint delete |
| 5 | USER BEHAVIOR (Real-world) | ✔ | TVP-082, 096: Hủy không confirm, double-click Lưu |
| 6 | SYSTEM BEHAVIOR | ✔ | TVP-097, 098: API fail khi load list và dropdown |
| 7 | DATA INTEGRITY | ✔ | TVP-057, 071, 080, 081, 092: verify DB state sau Create / Update / Delete |
| 8 | DB ↔ UI DATA MAPPING | ✔ | TVP-088 đến 093: mapping tất cả field hiển thị, enum status, round-trip, modal pre-load |
| 9 | INTEGRATION (API) | ✔ | TVP-083 đến 087: authorization; TVP-055, 069, 075: verify API response code và DB state |
| 10 | SECURITY (Basic) | ✔ | TVP-083 đến 087: JWT required (401), role LOGISTICS (403), unauthorized access |
| 11 | UX/UI | ✔ | TVP-001, 002, 007, 024, 035, 056, 058, 059, 061, 070, 073, 074: label, tiêu đề Drawer, read-only field, button visibility, toast message |
| 12 | STATE & FLOW | ✔ | TVP-028–033, 059, 061, 073–075: Drawer state (create vs edit), read-only code, nút 削除 chỉ ở edit mode |
| 13 | CONCURRENCY (Advanced) | ✔ | TVP-094, 095: concurrent create (DB constraint), concurrent edit (last-write-wins), TVP-072: area bị delete trong khi đang sửa |
| 14 | DATA LIFECYCLE | ✔ | TVP-003, 075, 076–079, 080, 081: soft delete, ẩn khỏi list, không xóa vật lý, FK constraint |
| 15 | SEARCH / FILTER / SORT | ✔ | TVP-008 đến 022: filter (exact match, trim, combine), sort (all columns, invalid field/direction) |
| 16 | PAGINATION / LARGE DATA | ✔ | TVP-023 đến 027: page size 30, pagination show/hide, chuyển trang giữ filter/sort, last page |
| 17 | CROSS-FIELD VALIDATION | ✔ | TVP-047–052: unique check `(client_id, code)` case-sensitive; unique `(client_id, name)` case-insensitive; scope thay đổi theo client trong edit |

---

## 4. ⚠️ Các điểm cần làm rõ trước khi hoàn thiện TVP

| # | TVP ID liên quan | Nội dung cần xác nhận | Lý do không thể tự suy diễn |
|---|---|---|---|
| 1 | TVP-012 | **G-004**: Client INACTIVE có xuất hiện trong dropdown filter M-02 không? | Spec nói có, detail design nói INACTIVE ảnh hưởng dropdown — mâu thuẫn, cần confirm để biết test case dropdown filter đúng hay sai |
| 2 | TVP-013 | **G-003**: Filter Tên trung tâm (centerId) có xuất hiện trên UI không? | Backend đã expose param nhưng UI mockup không thấy — không biết có cần test UI filter này không |
| 3 | TVP-034 | **G-013**: Filter và sort state sau khi Drawer đóng — giữ nguyên hay reset? | Ảnh hưởng trực tiếp expected behavior của test case |
| 4 | TVP-040 | **G-022**: Dấu gạch nối (`-`) có được phép trong エリアID không? | Spec ghi 半角英数字 (không đề cập hyphen), implementation có hyphen — cần thống nhất để test pattern validation đúng |
| 5 | TVP-050 | **G-025**: Unique constraint `(client_id, name)` có phải yêu cầu nghiệp vụ chính thức không? | Constraint có trong DB nhưng không có trong spec — test case trùng name sẽ expect 409 hay 201? |
| 6 | TVP-072 | **G-006**: Khi area bị xóa bởi user khác → PUT trả 404 — FE hiển thị gì? Tự đóng Drawer hay hiện toast? | Cần mô tả hành vi FE để viết test case UX đúng |
| 7 | TVP-082 | **G-009**: Nhấn キャンセル khi có unsaved changes — không có confirmation dialog — thiết kế cố ý hay bỏ sót? | Nếu cố ý: không test case cho confirm dialog; nếu bug: cần report |
| 8 | TVP-005, TVP-088 | **G-028**: centerNames hiển thị ở đâu trên UI list (cột riêng, tooltip, hay chỉ trong API)? | Cần biết để viết test case UI mapping đúng |
| 9 | TVP-095 | **G-026**: Optimistic lock (MSG-020) khi nào được implement? | Hiện tại last-write-wins — không nên expect MSG-020 cho đến khi Dev confirm implement |
| 10 | TVP-098 | **G-011**: API load dropdown クライアント名 fail → FE xử lý thế nào? | Cần biết expected behavior để viết test case system behavior |
