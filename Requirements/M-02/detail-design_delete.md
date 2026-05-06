# Detail Design — M-02-cud Area Delete

## 1. Document Info

| Item | Value |
|---|---|
| Feature | Quản lý khu vực (エリア) — Xóa mềm |
| Screen ID | M-02-cud (Drawer — nút **削除** đỏ + 確認ダイアログ) |
| Related List | M-02 (`/area`) |
| Related Ops | areas-create (POST), areas-update (GET + PUT) |
| Source | `documents/dev-basic-design/masters/areas/areas-delete/basic-design.md` |
| DB Design | `specs/db-designs/db-overview/v3/1834-db-design.dbml` |
| Author | tiendv@hblab.vn |
| Reviewer | (pending) |
| Created | 2026-04-21 |
| Status | Draft |

---

## 2. Overview

`DELETE /v1/areas/{id}` — Xóa mềm (logical delete) một Area bằng cách set `deleted_at` và `deleted_by`. Theo basic-design §5 **"Ràng buộc xóa dữ liệu (Master Data — chung)"**, BE **chặn** xóa nếu còn **配送センター (Delivery Center)** hoặc **店舗 (Store)** đang tham chiếu (`area_id = {id}` và `deleted_at IS NULL`) — trả về 409 với message theo D-00.

**Actors:**
- ADMIN (管理者) — duy nhất được phép gọi API này.

**Preconditions:**
- Người dùng đã đăng nhập, token JWT còn hiệu lực.
- Role của user là `ADMIN`.
- Bản ghi Area tồn tại và chưa xóa mềm (`deleted_at IS NULL`).
- Không có Delivery Center / Store active nào đang tham chiếu `area_id`.
- FE đã hiển thị **確認ダイアログ** (`本当にこのエリアを削除してもよろしいですか？`) và user đã xác nhận — BE không kiểm tra điều này (là UX contract).

**Postconditions:**
- `m_areas.deleted_at = NOW()`, `m_areas.deleted_by = currentUser.email`.
- `m_areas.updated_at` và `m_areas.updated_by` cũng được cập nhật (qua JPA auditing trên `BaseEntity`).
- Bản ghi không còn hiển thị trong list M-02 (filter `deleted_at IS NULL`).
- Không xóa vật lý — row vẫn tồn tại trong DB để audit/trace.
- Không có cascade tới bảng khác.

---

## 3. DB Schema

> Nguồn: DBML v3.1 (`specs/db-designs/db-overview/v3/1834-db-design.dbml`). Dùng **nguyên xi** — không thêm/sửa cột.

### Table `psms.m_areas` (primary — UPDATE set deleted_at)

| Column | Type | Constraints | Mô tả |
|---|---|---|---|
| `id` | `BIGSERIAL` | PK | Khóa chính, giá trị path param |
| `deleted_at` | `TIMESTAMPTZ` | nullable | NULL = active; set `NOW()` khi xóa mềm |
| `deleted_by` | `VARCHAR(100)` | nullable | Email của user thực hiện xóa |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | Auto-update qua JPA auditing |
| `updated_by` | `VARCHAR(100)` | NOT NULL | Auto-update qua JPA auditing (`@LastModifiedBy`) |

Các cột khác (`code`, `name`, `client_id`, `description`, `status`, `created_at`, `created_by`) **không thay đổi** khi delete — dữ liệu được giữ nguyên để truy vết.

### Table `psms.m_delivery_centers` (referenced — integrity check)

| Column | Type | Vai trò |
|---|---|---|
| `id` | `BIGSERIAL` | PK |
| `area_id` | `BIGINT` | NOT NULL, FK → `m_areas.id` — tham chiếu Area |
| `deleted_at` | `TIMESTAMPTZ` | Chỉ bản ghi **chưa** xóa mềm (IS NULL) mới block delete |

### Table `psms.m_stores` (referenced — integrity check)

| Column | Type | Vai trò |
|---|---|---|
| `id` | `BIGSERIAL` | PK |
| `area_id` | `BIGINT` | NOT NULL, FK → `m_areas.id` — tham chiếu Area |
| `deleted_at` | `TIMESTAMPTZ` | Chỉ bản ghi **chưa** xóa mềm (IS NULL) mới block delete |

---

## 4. API Endpoints Summary

| # | Method | Path | Mô tả | Auth |
|---|---|---|---|---|
| 1 | `DELETE` | `/v1/areas/{id}` | Xóa mềm một Area, kèm FK integrity check | `ROLE_ADMIN` |

---

## 5. API Detail

### 5.1 DELETE /v1/areas/{id}

**Purpose:** Xóa mềm Area từ Drawer M-02-cud chế độ Sửa (nút 削除 + 確認ダイアログ → xác nhận → gọi API).

#### Authorization

`@PreAuthorize("hasRole('ADMIN')")` — ADMIN only. LOGISTICS bị chặn → 403.

#### Request

**Path Parameter:** `id` (`Long`) — ID Area cần xóa.

**Headers:**

| Header | Required | Value |
|---|---|---|
| `Authorization` | Yes | `Bearer <JWT>` |

**No request body.**

#### Response

**204 No Content** (thành công — không body).

Error cases trả về `ApiResponse` wrapper với `success: false`.

#### Business Logic

1. Bộ lọc JWT xác thực token, `@PreAuthorize` chặn non-ADMIN → 403.
2. Tra Area theo `id` với điều kiện `deleted_at IS NULL` (`AreaRepository.findByIdAndDeletedAtIsNull`). Không tìm thấy → ném `ResourceNotFoundException(PSMS-AREA-001)` → 404.
3. Đếm Delivery Center active đang tham chiếu Area: `SELECT COUNT(*) FROM psms.m_delivery_centers WHERE area_id = {id} AND deleted_at IS NULL` (`AreaRepository.countActiveDeliveryCentersByAreaId`). Nếu `count > 0` → ném `ConflictException(MSG-022)` → 409.
4. Đếm Store active đang tham chiếu Area: `SELECT COUNT(*) FROM psms.m_stores WHERE area_id = {id} AND deleted_at IS NULL` (`AreaRepository.countActiveStoresByAreaId`). Nếu `count > 0` → ném `ConflictException(MSG-022)` → 409.
5. Set `area.deleted_at = NOW()` (dùng `Clock` injected để test deterministic).
6. Set `area.deleted_by = currentUser.email` (lấy từ `SecurityContextHolder.getContext().getAuthentication().getName()`).
7. `AreaRepository.save(area)` — Hibernate dirty-check sẽ UPDATE. JPA auditing tự cập nhật `updated_at` và `updated_by` (`@LastModifiedDate`, `@LastModifiedBy` trên `BaseEntity`).
8. Controller trả `204 No Content` (void return).

**Graceful degradation:** Nếu table `m_delivery_centers` hoặc `m_stores` chưa được migrate (early dev), service catch `DataAccessException` và **bỏ qua** bước check — cho phép delete tiến hành. Chỉ ghi `log.warn` với reason. Production sẽ luôn có table nên không ảnh hưởng.

#### Error Cases

| HTTP | Error Code | Condition | Message (hiển thị user) |
|---|---|---|---|
| 401 | — | Thiếu / sai JWT | `Unauthorized` |
| 403 | — | User không phải ADMIN | `Access denied` |
| 404 | `PSMS-AREA-001` | Area không tồn tại hoặc đã xóa mềm | `エリアが見つかりません` |
| 409 | `MSG-022` | Còn Delivery Center **hoặc** Store active tham chiếu (Master Data — chung) | `関連データが存在するため削除できません。` |
| 500 | — | Lỗi không mong đợi | `システムエラーが発生しました` |

**Reference check note:** Theo basic-design §5 "Ràng buộc xóa dữ liệu（Master Data — chung）", cả 2 loại tham chiếu (Delivery Center + Store) đều chặn xóa và dùng chung thông báo `MSG-022`. BE không phân biệt loại reference trong response; FE hiển thị duy nhất 1 toast đỏ với message chung. Thứ tự kiểm tra giữa DC và Store **không** ràng buộc bởi basic-design — implementation có thể chọn bất kỳ thứ tự nào (chỉ cần cả 2 đều check trước khi update `deleted_at`).

#### Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant AC as AreaController
    participant AS as AreaService
    participant AR as AreaRepository
    participant DB as PostgreSQL

    C->>AC: DELETE /v1/areas/{id} + JWT
    AC->>AC: @PreAuthorize("hasRole('ADMIN')")
    alt không phải ADMIN
        AC-->>C: 403 Access denied
    end
    AC->>AS: delete(id)
    AS->>AR: findByIdAndDeletedAtIsNull(id)
    AR->>DB: SELECT ... WHERE id=? AND deleted_at IS NULL
    alt không tìm thấy
        AS-->>AC: throw ResourceNotFoundException(PSMS-AREA-001)
        AC-->>C: 404 { success: false, message: "エリアが見つかりません" }
    end
    AS->>AR: countActiveDeliveryCentersByAreaId(id)
    AR->>DB: SELECT COUNT(*) FROM m_delivery_centers WHERE area_id=? AND deleted_at IS NULL
    alt DC count > 0
        AS-->>AC: throw ConflictException(MSG-022)
        AC-->>C: 409 { success: false, message: "関連データが存在するため削除できません。" }
    end
    AS->>AR: countActiveStoresByAreaId(id)
    AR->>DB: SELECT COUNT(*) FROM m_stores WHERE area_id=? AND deleted_at IS NULL
    alt Store count > 0
        AS-->>AC: throw ConflictException(MSG-022)
        AC-->>C: 409 { success: false, message: "関連データが存在するため削除できません。" }
    end
    AS->>AS: area.setDeletedAt(NOW()); area.setDeletedBy(currentUser.email)
    AS->>AR: save(area)
    AR->>DB: UPDATE psms.m_areas SET deleted_at=NOW(), deleted_by=?, updated_at=NOW(), updated_by=? WHERE id=?
    DB-->>AR: updated row
    AR-->>AS: Area
    AS-->>AC: void
    AC-->>C: 204 No Content
```

---

## 6. DTO Definitions

**Không có DTO** — DELETE chỉ dùng path param, không body, response 204 không data.

---

## 7. Repository Contracts

### AreaRepository (`JpaRepository<Area, Long>`)

| Method | Mục đích |
|---|---|
| `Optional<Area> findByIdAndDeletedAtIsNull(Long id)` | Lookup Area active, throw 404 nếu đã xóa mềm hoặc không tồn tại |
| `long countActiveDeliveryCentersByAreaId(Long areaId)` | Native query COUNT trên `psms.m_delivery_centers` — FK integrity check |
| `long countActiveStoresByAreaId(Long areaId)` | Native query COUNT trên `psms.m_stores` — FK integrity check |
| `<S extends Area> S save(S area)` | JPA dirty-check UPDATE để set deleted_at |

> **Lưu ý:** Cả 2 `countActive*` query là native query bên trong `AreaRepository` (không dùng `DeliveryCenterRepository`/`StoreRepository`) để:
> - Giảm coupling giữa service Area và service Center/Store.
> - Cho phép fallback graceful khi table chưa migrate (try-catch `DataAccessException`).

---

## 8. Side Effects

- **DB:** UPDATE 1 row trên `m_areas` (set `deleted_at`, `deleted_by`, + JPA auditing update `updated_at`, `updated_by`).
- **Không cascade** tới `m_delivery_centers` / `m_stores` — đây là nguyên nhân FE cần xóa records con trước.
- **Không side effect** email / external API.

**Audit:** 4 cột được cập nhật atomically trong 1 transaction:
- `deleted_at` (manual)
- `deleted_by` (manual)
- `updated_at` (JPA `@LastModifiedDate`)
- `updated_by` (JPA `@LastModifiedBy`)

---

## 9. Error Handling Summary

| Error Code | HTTP | Exception | Thrown by |
|---|---|---|---|
| `PSMS-AREA-001` | 404 | `ResourceNotFoundException` | `AreaService.delete` khi Area không tồn tại hoặc đã xóa mềm |
| `MSG-022` | 409 | `ConflictException` | `AreaService.delete` khi còn Delivery Center **hoặc** Store active tham chiếu (basic-design §5 Master Data chung) |
| — | 403 | `AccessDeniedException` | `@PreAuthorize("hasRole('ADMIN')")` — FE chuyển trang login/error |
| — | 401 | `AuthenticationException` | `JwtAuthenticationFilter` |
| — | 500 | `Exception` | `GlobalExceptionHandler` — log.error kèm request URI, không expose stack trace |

**Retry policy:** 404 không retry (resource đã không còn). 409 **user-fixable**: FE nên hiển thị hướng dẫn xóa DC/Store con trước rồi thử lại. Không auto-retry phía client.

---

## 10. Testing Scenarios

> **Test type legend:** `[U]` service unit test (Mockito), `[C]` controller test (`@WebMvcTest`), `[E]` E2E curl + DB verify.

### Happy Path

| # | Scenario | Input | Expected | Type |
|---|---|---|---|---|
| D-01 | Area không có DC/Store active | `DELETE /v1/areas/{id}` | Service setter gọi `setDeletedAt` + `setDeletedBy` với email user; response 204 | `[U][C]` |
| D-02 | Area có DC đã xóa mềm | DC `deleted_at != null` | 204 (DC đã xóa không block) | `[U]` |
| D-03 | Area có Store đã xóa mềm | Store `deleted_at != null` | 204 | `[U]` |
| D-04 | Table `m_delivery_centers` chưa migrate (dev-only) | COUNT query throw `DataAccessException` | 204 (graceful skip); log.warn | `[U]` |
| D-05 | Table `m_stores` chưa migrate (dev-only) | COUNT query throw `DataAccessException` | 204 (graceful skip); log.warn | `[U]` |

### Error — Not Found

| # | Scenario | Input | Expected | Type |
|---|---|---|---|---|
| D-E1 | ID không tồn tại | `id=99999` | 404, `PSMS-AREA-001`, `エリアが見つかりません` | `[U][C]` |
| D-E2 | Area đã bị xóa mềm trước đó | `id` với `deleted_at NOT NULL` | 404, `PSMS-AREA-001` | `[U]` |

### Error — Conflict (MSG-022 chung — basic-design §5)

| # | Scenario | Input | Expected | Type |
|---|---|---|---|---|
| D-C1 | 1 Delivery Center active | 1 DC `deleted_at IS NULL` | 409, `MSG-022`, `関連データが存在するため削除できません。` | `[U][C]` |
| D-C2 | Nhiều Delivery Center active | 3 DC active | 409, `MSG-022` | `[U]` |
| D-C3 | 1 Store active | 1 Store `deleted_at IS NULL` | 409, `MSG-022` | `[U][C]` |
| D-C4 | Nhiều Store active | 5 Store active | 409, `MSG-022` | `[U]` |
| D-C5 | Cả DC và Store đều active | Mixed | 409, `MSG-022` (thứ tự check không quan trọng — basic-design §5 coi 2 loại ref là tương đương) | `[U]` |

### Error — Authorization

| # | Scenario | Input | Expected | Type |
|---|---|---|---|---|
| D-A1 | Không có token | No `Authorization` header | 401 | `[C][E]` |
| D-A2 | Token hết hạn | Expired JWT | 401 | `[E]` (non-automated — cần JWT real expire) |
| D-A3 | Token LOGISTICS | Valid JWT role `LOGISTICS` | 403 | `[C][E]` |

### Verification (post-delete — chỉ E2E)

| # | Scenario | Input | Expected | Type |
|---|---|---|---|---|
| D-V1 | GET /v1/areas/{id} sau khi DELETE | id vừa xóa | 404 (vì `findByIdAndDeletedAtIsNull` filter) | `[E]` |
| D-V2 | GET /v1/areas list sau khi DELETE | List endpoint | Area đã xóa không có trong `content[]` — đúng theo basic-design §5 "bản ghi không hiển thị trên M-02" | `[E]` |
| D-V3 | Row vẫn tồn tại trong DB (không xóa vật lý) | SQL trực tiếp | `SELECT * WHERE id=?` trả về row với `deleted_at NOT NULL` | `[E]` |
| D-V4 | `deleted_by` = user email đã login | Sau DELETE | DB check — email của ADMIN | `[E]` |

---

## 11. Notes & Assumptions

1. **Xác nhận xóa là UX contract của FE** — basic-design §3 hàng #5 + §5 yêu cầu `確認ダイアログ` (`本当にこのエリアを削除してもよろしいですか？`) trước khi gọi API. BE không kiểm tra double-confirmation — giả định request đã đến từ action có chủ đích của user ADMIN.
2. **Soft delete không cascade** — xóa Area không tự động xóa DC/Store con. Đây là deliberate design: user phải chủ động xóa records con trước (tránh lỗi data consistency với Plan đang tham chiếu Store).
3. **Thứ tự check DC và Store không ràng buộc bởi basic-design §5** — cả 2 tham chiếu được coi là tương đương. Implementation có thể chọn bất kỳ thứ tự. Message trả về (`MSG-022`) là duy nhất cho cả 2 loại. Nếu Area có cả DC và Store active, user thấy 1 message chung `関連データが存在するため削除できません。` — user cần kiểm tra cả 2 loại ref để xóa.
4. **Graceful degradation khi FK table chưa migrate** — service catch `DataAccessException` và bỏ qua check thay vì 500. Quyết định này xuất phát từ môi trường early dev. **Cân nhắc:** Trong production, nếu catch che dấu lỗi DB thật (connection pool exhausted...) thì rủi ro. Nên phân biệt `InvalidDataAccessResourceUsageException` (table not found) với các `DataAccessException` khác.
5. **Không có optimistic lock cho DELETE** — basic-design §5 chỉ đề cập `楽観的ロック` cho Lưu (Save). DELETE là one-shot, không có concurrent edit form state.
6. **Không bulk delete** — basic-design không yêu cầu multi-delete. Mỗi lần xóa 1 Area (drawer chỉ có 1 record trong chế độ Sửa).
7. **Undo delete?** — không có endpoint "restore". Nếu cần, mở ticket riêng (update `deleted_at = NULL`).
8. **Audit log riêng** — basic-design §5 đánh dấu TODO cho `common-document` audit. Hiện dùng cột `deleted_by` + `deleted_at` trên row là đủ — không tạo bảng audit riêng.

---

## 12. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | 2026-04-21 | tiendv@hblab.vn | Draft đầu tiên theo template `/gen-detail-design`. Align table names (`m_areas`, `m_delivery_centers`, `m_stores`) theo DBML v3.1. Repository contracts dùng native query trong `AreaRepository` (không dùng repository riêng của DC/Store) để giảm coupling + cho phép graceful fallback. |
| 0.2 | 2026-04-21 | tiendv@hblab.vn | Theo review: (W1) Consolidate error code → dùng **`MSG-022`** duy nhất cho cả DC và Store reference thay vì split `PSMS-AREA-004/005` — theo basic-design §5 "Master Data — chung". Sequence diagram + §9 Error Handling Summary + §5.1 Error Cases + Notes #3 đã sync. (W3) Phân loại test scenarios theo type `[U]/[C]/[E]` — assertion DB-level chỉ thuộc E2E, tránh unit test Mockito assert thông tin không kiểm được. (W4) Bỏ note "Order DC trước Store" — basic-design không quy định thứ tự; implementation tùy chọn. Cập nhật D-C5 scenario expected message đổi từ `PSMS-AREA-004` → `MSG-022`. |
