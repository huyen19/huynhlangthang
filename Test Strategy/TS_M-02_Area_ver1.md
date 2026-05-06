# Test Strategy — M-02 Quản lý thông tin khu vực (エリア)

| Mục | Nội dung |
|---|---|
| File | TS_M-02_Area_ver1.md |
| Màn hình | M-02 / M-02-cud — Quản lý khu vực (Danh sách / Thêm / Sửa / Xóa) |
| Ngày tạo | 2026-04-29 |
| Cập nhật | 2026-04-29 — Confirm G-021, G-024, G-027 từ BA/Dev |
| Phiên bản | 1.1 |
| Tài liệu tham chiếu | [M-02_VN.md](../Requirements/M-02/M-02_エリア情報一覧_VN.md), [M-02-cud_VN.md](../Requirements/M-02/M-02-cud_エリア（追加・編集・削除）_VN.md), [detail-design_list.md](../Requirements/M-02/detail-design_list.md), [detail-design_create.md](../Requirements/M-02/detail-design%20create.md), [detail-design_update.md](../Requirements/M-02/detail-design_update.md), [detail-design_delete.md](../Requirements/M-02/detail-design_delete.md), [Q&A_M-02_Area_ver1.md](../Test%20Q&A/Q&A_M-02_Area_ver1.md) |

---

## 1. System Overview

Module **Quản lý khu vực (エリア)** là master data trung gian trong chuỗi phân cấp địa lý:

```
Client (M-01) → Khu vực / Area (M-02) → Trung tâm phân phối / DC (M-03) → Cửa hàng / Store
```

Mỗi khu vực gắn với một khách hàng cụ thể và là điểm neo cho DC và Store tham chiếu xuống. Toàn bộ thao tác CRUD (Thêm / Sửa / Xóa mềm) thực hiện qua **Drawer trượt ngang** trên cùng URL `/area` — không chuyển trang.

**Luồng nghiệp vụ chính:**
1. Xem danh sách → filter (areaCode / clientId / centerId) → sort → phân trang
2. Thêm mới area → validate → insert → refresh list
3. Sửa area → load Drawer → đổi name / client → validate → update → refresh list
4. Xóa mềm area → kiểm tra FK (DC + Store) → confirmation dialog → set `deleted_at`

---

## 2. Key Test Targets

| ID | Priority | Module / Tính năng | Lý do |
|---|---|---|---|
| T-01 | High | Tạo mới area (POST /v1/areas) | Validate toàn bộ input; unique check cả `code` lẫn `name` (case-insensitive); ảnh hưởng trực tiếp đến DC/Store downstream |
| T-02 | High | Xóa mềm area (DELETE /v1/areas/{id}) | FK constraint check vs DC + Store là nghiệp vụ cốt lõi tránh orphan data; sai logic → data corruption chuỗi master |
| T-03 | High | Sửa area (PUT /v1/areas/{id}) | `code` read-only khi sửa; unique `name` exclude self; đổi client liên quan toàn bộ scope phân cấp |
| T-04 | High | Filter + Sort + Phân trang (GET /v1/areas) | Sort whitelist chỉ có 3 field — `name` không được sort (gap G-027); default size 30; filter exact-match case-sensitive |
| T-05 | High | Authorization — ADMIN only | Toàn bộ 4 endpoint đều yêu cầu `ROLE_ADMIN`; LOGISTICS hoặc unauthenticated phải bị chặn |
| T-06 | Medium | Soft delete behavior | Area đã xóa không hiển thị trong list (`deleted_at IS NULL`) nhưng row vẫn còn trong DB |
| T-07 | Medium | Trạng thái `status` (ACTIVE / INACTIVE) | `status` hiển thị trong list (cột ステータス) nhưng không lọc — cả ACTIVE và INACTIVE đều xuất hiện trong list |
| T-08 | Medium | Drawer UX — Hủy / đóng | Hủy không có confirmation khi có unsaved changes; filter/sort state sau khi close Drawer |

---

## 3. Risk Assessment

| Loại rủi ro | Impact | Lý do & Ảnh hưởng |
|---|---|---|
| **Business** | High | Xóa area khi còn DC/Store active tham chiếu sẽ phá vỡ chuỗi master phân cấp. Logic FK check (MSG-022) phải hoạt động chính xác cho cả 2 loại reference. |
| **Data** | High | **[Bug — cần fix trước khi test] G-021 ✅ Confirmed**: `name` max = **100 ký tự** cho cả Create lẫn Update. `@Size(max=255)` trong detail-design create là lỗi. **[Bug — cần fix] G-024 ✅ Confirmed**: `code` unique check phải **case-sensitive** — "A1" và "a1" là 2 code khác nhau. `IgnoreCase` trong implementation là lỗi. |
| **Business** | High | **G-025**: Unique constraint `(client_id, name)` có trong DB nhưng không được mô tả trong spec — user sẽ nhận 409 bất ngờ khi tạo area trùng tên trong cùng client. Cần confirm xem đây là feature hay bug. |
| **Integration** | Medium | List và Drawer dropdown phụ thuộc M-01 (client). Nếu API M-01 lỗi, toàn bộ tạo/sửa area bị block. Spec chưa định nghĩa fallback UI (gap G-011). |
| **Technical** | Medium | **G-026**: Optimistic lock yêu cầu trong spec (MSG-020) nhưng chưa implement — concurrent edit dùng last-write-wins. Hai ADMIN sửa cùng area đồng thời → người sau overwrite người trước không cảnh báo. |
| **Technical** | Medium | **[Bug — cần fix] G-027 ✅ Confirmed**: Sort `name` (エリア名) **phải được hỗ trợ** — tất cả cột đều sort được. `name` cần bổ sung vào sort whitelist API. |
| **Data** | Low | Graceful degradation trong delete: nếu `DataAccessException` bất kỳ → bỏ qua FK check, cho phép xóa. Trong production rủi ro thấp nhưng che khuất lỗi DB thật (gap G-016). |

---

## 4. Test Scope

**In Scope:**
- Toàn bộ CRUD qua API: `GET /v1/areas`, `POST /v1/areas`, `GET /v1/areas/{id}`, `PUT /v1/areas/{id}`, `DELETE /v1/areas/{id}`
- Validation tất cả field: `code` (NotBlank, max 20, pattern `[a-zA-Z0-9-]`), `name` (NotBlank, max 100/255), `clientId` (NotNull, ACTIVE + not deleted)
- Unique constraint: `(client_id, code)` và `(client_id, name)` — case-insensitive
- Filter: `areaCode` exact-match case-sensitive sau trim; `clientId`; `centerId` (nếu có UI)
- Sort: `code`, `clientName`, `centerName` — sort field ngoài whitelist → 400
- Soft delete: FK check vs `m_delivery_centers` + `m_stores`; confirmation dialog
- Authorization: JWT required, ADMIN only (401 / 403)
- Status `ACTIVE`/`INACTIVE` hiển thị trong list — không lọc
- Deep link Drawer: `/area?drawer=area&mode=new`, `/area?drawer=area&mode=edit&id={id}`
- Pagination: default 30/trang; hiển thị từ trang 2; filter/sort giữ nguyên khi đổi trang

**Out of Scope:**
- M-01 (Client) và M-03 (Distribution Center) testing riêng
- Load / performance testing quy mô lớn (phase riêng)
- UI pixel-level design, màu sắc, animation Drawer
- Audit log (common-document framework chưa có đặc tả — gap G-020)

---

## 5. Test Approach

**Test Levels:**
- **API / Integration Test**: Kiểm tra trực tiếp các endpoint với valid/invalid input, verify DB state sau mỗi operation. Đây là lớp test chính cho module này.
- **System Test**: Kiểm tra luồng đầu cuối — tạo area → sửa → thêm DC tham chiếu → thử xóa (bị block) → xóa DC → xóa area thành công.

**Test Types:**
| Loại | Mục tiêu |
|---|---|
| **Functional** | CRUD logic, FK constraint, validation rules, unique constraints |
| **API Testing** | Tất cả endpoint với đủ tổ hợp input — happy path, error path, edge case |
| **Data Validation** | Verify DB state: `deleted_at`, `code`/`name` không bị thay đổi ngoài ý muốn, `status` giữ nguyên sau update |
| **Authorization** | JWT missing (401), expired (401), role LOGISTICS (403), role ADMIN (2xx) |
| **Negative Testing** | Sort field không hợp lệ, clientId INACTIVE/deleted, code/name duplicate |

---

## 6. Test Focus Areas

**Critical Logic:**
- **FK constraint khi xóa**: Area có DC active → 409 MSG-022; có Store active → 409 MSG-022; có cả DC lẫn Store → 409 (thứ tự check không ràng buộc); DC/Store đã soft-delete → KHÔNG block → 204
- **`code` read-only khi edit**: PUT body có `code` → BE bỏ qua, DB giữ nguyên giá trị cũ
- **Soft delete visibility**: sau DELETE, `GET /v1/areas` không trả area đó; `GET /v1/areas/{id}` trả 404

**Complex Validation:**
- `code` unique **case-sensitive** trong cùng client: "A1" và "a1" là 2 code KHÁC NHAU, được phép cùng tồn tại ✅ (G-024 confirmed — implementation `IgnoreCase` là bug cần fix)
- `name` unique **case-insensitive** + **trim** trong cùng client: "  関西  " vs "関西" → conflict (409 PSMS-AREA-002)
- `name` max **100 ký tự** cho cả Create lẫn Update ✅ (G-021 confirmed — `@Size(max=255)` trong create là bug cần fix)
- `clientId` phải là ACTIVE + `deleted_at IS NULL` — INACTIVE client → 400 PSMS-AREA-003

**Edge Cases:**
- Tạo area với `name` > 100 ký tự → 400 (max 100 cho cả Create và Update — G-021 confirmed)
- Tạo 2 area cùng client với `code` chỉ khác case "A1" vs "a1" → **201 cả hai** (case-sensitive — G-024 confirmed; sau khi bug fix)
- Sort `sort=name,asc` → **200** sau khi G-027 bug fix (hiện tại trả 400 — cần wait fix trước khi test)
- Sort `sort=code,UP` (direction sai) → 400 PSMS-AREA-002
- `areaCode` filter: "  01  " → trim → tìm kiếm "01"; "   " → trim rỗng → bỏ qua filter
- Area không có center nào → `centerNames: []` trong response
- Deep link `/area?drawer=area&mode=edit&id=99999` (không tồn tại) → 404 PSMS-AREA-001
- Concurrent create 2 request cùng `(client_id, code)` → 1 × 201, 1 × 409 (DB unique constraint)

**High-risk Data Scenarios:**
- Area được tham chiếu bởi DC active → xóa bị block
- Area được tham chiếu bởi Store active → xóa bị block
- Area được tham chiếu bởi cả DC lẫn Store active → xóa bị block (dùng cùng message MSG-022)
- Tạo/Sửa area với `clientId` của client vừa bị soft-delete → 400 PSMS-AREA-003

---

## 7. Test Data Strategy

**Key Data cần chuẩn bị:**

| Dataset | Mô tả | Dùng cho |
|---|---|---|
| Client ACTIVE (≥2) | `m_clients.status='ACTIVE'`, `deleted_at IS NULL` | Tạo/sửa area, filter dropdown |
| Client INACTIVE (1) | `m_clients.status='INACTIVE'` | Kiểm tra 400 PSMS-AREA-003 |
| Client đã soft-delete (1) | `m_clients.deleted_at IS NOT NULL` | Kiểm tra 400 PSMS-AREA-003 |
| Area ACTIVE (≥5) | Đa dạng code/name/client | Filter, sort, pagination |
| Area INACTIVE (1) | `status='INACTIVE'` | Kiểm tra INACTIVE vẫn hiển thị trong list |
| Area đã soft-delete (1) | `deleted_at IS NOT NULL` | Kiểm tra không hiển thị trong list, GET → 404 |
| Area có DC active tham chiếu | 1 DC `deleted_at IS NULL` | Kiểm tra FK block delete |
| Area có Store active tham chiếu | 1 Store `deleted_at IS NULL` | Kiểm tra FK block delete |
| Area có DC/Store đã soft-delete | DC/Store `deleted_at IS NOT NULL` | Kiểm tra không block delete |

**Edge Case Data:**
- `code` đúng 20 ký tự (max length)
- `code` có hyphen: `"AREA-01"` (validate pattern implementation cho phép)
- `name` đúng 100 ký tự (update limit)
- `name` đúng 255 ký tự (create limit — confirm gap G-021)
- Cặp area cùng client có `code` chỉ khác case: `"A1"` và `"a1"`

**Dependencies:**
- `m_clients` cần có data trước khi test M-02
- `m_delivery_centers` và `m_stores` cần có data với `area_id` FK để test delete constraint

---

## 8. Automation Strategy

**Nên tự động hóa (API — ROI cao):**
- Happy path CRUD: create / get detail / update / delete area
- Validation errors: thiếu field bắt buộc, vượt max length, sai pattern `code`
- Duplicate detection: code trùng (case-insensitive), name trùng (case-insensitive + trim)
- FK constraint delete: DC active → 409, Store active → 409, DC soft-deleted → 204
- Authorization: 401 (no token), 403 (LOGISTICS role), 200/201/204 (ADMIN)
- Filter + Sort + Pagination: exact match, whitelist sort, invalid sort → 400

**Thực hiện thủ công:**
- Drawer open/close behavior, overlay, animation
- Sort icon state trên bảng danh sách (default / asc / desc)
- Pagination controls hiển thị/ẩn (boundary condition trang 1 vs trang 2)
- Confirmation dialog xóa: nội dung text, nút Hủy / Xóa
- Toast message sau Lưu (MSG-025) và toast lỗi (đỏ)
- Behavior khi nhấn Hủy có unsaved changes (không có confirmation — gap G-009)

---

## 9. Entry / Exit Criteria

**Entry Criteria:**
- ✅ **G-021, G-024, G-027 đã confirmed** — 3 bug implementation cần được Dev fix trước khi chạy test case liên quan (name max 100, code case-sensitive, sort name)
- DB schema v3.1 (`m_areas`, `m_delivery_centers`, `m_stores`) đã deploy lên test environment
- Data seed: ít nhất 2 Client ACTIVE, 1 Client INACTIVE tồn tại trong `m_clients`
- API endpoint `/v1/areas` đã deploy và accessible

**Exit Criteria:**
- 100% test case Priority High pass; ≥ 95% Priority Medium pass
- Không còn bug Critical / Major chưa xử lý
- FK constraint delete đã verified với cả 2 loại reference (DC + Store)
- Authorization đã verified: 401 / 403 / 200 đúng với từng role
- DB state verified sau create / update / soft-delete

---

## 10. Gaps & Questions

### Đã Confirmed

| Gap ID | Nội dung | Trạng thái |
|---|---|---|
| G-001 | Cột ステータス trong UI hiển thị 有効 / 無効 | ✅ Confirmed từ detail-design_list §3 — `m_areas.status = 'ACTIVE'/'INACTIVE'`; FE dùng để styling |
| G-002 | DB field `status` không có trong spec M-02-cud | ✅ Confirmed từ detail-design_list §3 — `status VARCHAR(20) DEFAULT 'ACTIVE'`; fix ACTIVE khi tạo, không thay đổi qua PUT |
| G-007 | Mâu thuẫn page size default 50 (spec JP) vs 30 (common) | ✅ Confirmed từ detail-design_list §5 — **default = 30** |
| G-008 | Filter areaCode phân biệt hoa/thường không? | ✅ Confirmed từ detail-design_list §5 — **case-sensitive** exact match |
| G-012 | Deep link edit với ID không tồn tại xử lý thế nào | ✅ Confirmed từ detail-design_update §5.1 — **404 PSMS-AREA-001** "エリアが見つかりません" |
| G-014 | Độ dài tối thiểu của `code` | ✅ Confirmed từ detail-design create §5.1 — **min 1 ký tự** (`@NotBlank`, không có `@Size(min)`) |
| G-015 | Ký tự cho phép cho `name` | ✅ Confirmed từ detail-design create §11 Note #8 — **không áp regex**, cho phép kanji/kana/special chars; giới hạn chỉ theo độ dài |
| G-018 | Có hỗ trợ multi-column sort không | ✅ Confirmed từ detail-design_list §5 — **chỉ single column** `{field},{asc/desc}`; field ngoài whitelist → 400 |
| G-021 | `name` max 255 (Create) vs max 100 (Update) — bug implementation | ✅ **Confirmed 2026-04-29 (BA/Dev)** — Max **100 ký tự** cho cả Create và Update. `@Size(max=255)` là **bug Dev cần fix** |
| G-024 | `code` unique check `IgnoreCase` — phân biệt hoa/thường không? | ✅ **Confirmed 2026-04-29 (BA/Dev)** — **Case-sensitive**. "A1" và "a1" là 2 code khác nhau. `IgnoreCase` là **bug Dev cần fix** |
| G-027 | `エリア名` (name) thiếu trong sort whitelist API | ✅ **Confirmed 2026-04-29 (BA/Dev)** — Tất cả cột đều sort được kể cả `name`. Đây là **bug thiếu Dev cần bổ sung** |

---

### Chưa Confirmed — **Need confirm spec?**

#### 🔴 High Risk — Cần xác nhận trước khi viết test case

| Gap ID | Nội dung | Impact nếu không confirm |
|---|---|---|
| **G-003** | **Filter Tên trung tâm phân phối** có trong spec nhưng không xuất hiện trên UI mockup — Backend đã expose `centerId` param | High — không rõ FE có implement filter này không; ảnh hưởng scope test |
| **G-004** | **Khách hàng tạm dừng (INACTIVE)** có xuất hiện trong dropdown filter M-02 không? — spec nói có, detail design nói ảnh hưởng dropdown | High — test case dropdown sẽ sai nếu behavior thực tế khác spec |
| **G-005** | **Cột No.** trên UI không có trong API response — FE tự generate hay từ backend? | High — test case cần biết No. reset về 1 mỗi trang hay là row index global |

#### 🟡 Medium Risk — Cần xác nhận trước khi kết thúc test cycle

| Gap ID | Nội dung | Impact nếu không confirm |
|---|---|---|
| G-022 | **`code` cho phép hyphen** trong implementation (`@Pattern=[a-zA-Z0-9-]`) nhưng spec chỉ ghi 半角英数字 | Tester không rõ "AREA-01" là valid hay invalid |
| G-025 | **Unique constraint `(client_id, name)`** không có trong spec — tạo 2 area cùng tên → 409 bất ngờ với user | Test case cần cover 409 PSMS-AREA-002 cho trùng name |
| G-026 | **Optimistic lock (MSG-020) yêu cầu trong spec nhưng chưa implement** — last-write-wins hiện tại | Concurrent edit test case: không nên expect MSG-020 cho đến khi implement |
| G-028 | **`centerNames` có trong API response** nhưng không được mô tả là cột bảng trong spec M-02 | Cần biết FE hiển thị centerNames ở đâu để test UI đúng |
| G-006 | Khi area bị xóa bởi user khác trong khi đang mở Drawer sửa → PUT trả 404 — **FE xử lý 404 thế nào?** | Test case UI: không rõ FE show toast hay tự đóng Drawer |
| G-009 | **Hủy không có confirmation** dù có unsaved changes — có phải thiết kế cố ý? | Nếu cố ý: không cần test case "confirm dialog". Nếu bug: cần report |
| G-013 | Sau khi Drawer đóng (save thành công), **filter/sort có được giữ nguyên** không? | Ảnh hưởng test case UX — cần verify state persistence |
| G-023 | Test scenario G-01 trong detail-design_list §8.1 ghi `size: 50` nhưng default param là `30` | Tester cần dùng đúng giá trị 30 khi viết test |

#### ⚪ Low Risk — Có thể defer

| Gap ID | Nội dung | Impact nếu không confirm |
|---|---|---|
| G-010 | Điều kiện chính xác để hiển thị pagination controls (totalPages > 1 hay totalElements > pageSize) | Low — ảnh hưởng 1 test case boundary |
| G-011 | API load dropdown M-01 thất bại → FE xử lý thế nào | Low — error handling UI |
| G-016 | Delete API: graceful degradation cho `DataAccessException` chung có thể che lỗi DB thật | Low — chỉ ảnh hưởng production monitoring |
| G-017 | Validation trigger: real-time khi gõ hay sau submit | Low — UX test case detail |
| G-019 | Performance target "< 3 giây" ở quy mô dữ liệu nào | Low — cần nếu có performance test |
| G-020 | Audit log có yêu cầu bảng riêng ngoài audit columns không | Low — chưa có framework |
