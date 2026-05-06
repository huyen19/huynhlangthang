# Detail Design — M-03-cud Delivery Center Create

## 1. Document Info

| Item | Value |
|---|---|
| Feature | Trung tâm phân phối (配送センター) — Thêm mới |
| Screen ID | M-03-cud (mode: **new** — URL `/center/new`) |
| Related | M-03 list (`/center`), M-03-cud edit (`/center/{id}/edit`), M-03-cud delete |
| Source | `documents/dev-basic-design/masters/delivery-centers/delivery-centers-create/basic-design.md` |
| DB Design | `specs/db-designs/db-overview/v3/1834-db-design.dbml` |
| Common Spec | `documents/dev-basic-design/common/common-spec.md` |
| Message Definition | `documents/dev-basic-design/common/message-definition.md` |
| Author | tiendv@hblab.vn |
| Reviewer | (pending) |
| Created | 2026-04-22 |
| Status | Draft |

---

## 2. Overview

API tạo mới bản ghi **Master trung tâm phân phối (配送センター)** từ form M-03-cud chế độ **new** (URL `/center/new`). Người dùng (ADMIN) nhập **tên trung tâm, khách hàng, khu vực, ID trung tâm (center_code), mã bưu điện, tỉnh, địa chỉ, số điện thoại**; BE validate, đảm bảo Client đang ACTIVE và Area thuộc đúng Client, kiểm tra duy nhất `(client_id, center_code)` trong phạm vi bản ghi chưa xóa mềm, sau đó insert vào `m_delivery_centers`. Thành công → FE điều hướng về M-03 list kèm toast "登録しました".

**Actors:**
- ADMIN (管理者) — duy nhất được phép gọi API này (basic-design §5 "Quyền").

**Preconditions:**
- Người dùng đã đăng nhập, JWT còn hiệu lực.
- Role = `ADMIN`.
- Client đã chọn ∈ `m_clients` và `status = ACTIVE`, `deleted_at IS NULL`.
- Area đã chọn ∈ `m_areas`, `deleted_at IS NULL`, và `area.client_id = request.clientId`.

**Postconditions:**
- Một bản ghi mới trong `m_delivery_centers` với `status = ACTIVE`, `created_at = now()`, `created_by = <user>`, `updated_at = created_at`, `updated_by = created_by`.
- Response 201 Created kèm `DeliveryCenterResponse` (full detail 12 fields, dùng cho FE hiển thị ngay trước khi điều hướng về list).
- Log: `create_delivery_center id={} code={} clientId={}`.

---

## 3. DB Schema

> Nguồn: DBML v3 (`specs/db-designs/db-overview/v3/1834-db-design.dbml`). Dùng **nguyên xi** — không thêm/sửa cột.

### 3.1 Table `psms.m_delivery_centers` (primary — INSERT target)

> Đã sync với DB sau migration **V10** (`align_delivery_center_columns.sql`). Verified qua `\d psms.m_delivery_centers` ngày 2026-04-22.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `BIGSERIAL` | PK, auto-generated (`nextval('psms.m_delivery_center_id_seq')`) | — |
| `code` | `VARCHAR(20)` | NOT NULL | Mã trung tâm (business key) — BD #5 max **20**, chỉ `半角英数字` |
| `name` | `VARCHAR(100)` | NOT NULL | 配送センター名 — BD #2 max **100** sau trim |
| `client_id` | `BIGINT` | NOT NULL, FK → `m_clients.id` | Trung tâm thuộc client nào |
| `area_id` | `BIGINT` | NOT NULL, FK → `m_areas.id` | Area phải có `client_id` khớp |
| `postal_code` | `VARCHAR(10)` | **NOT NULL** | 郵便番号 format `999-9999` (BD #6 required) |
| `prefecture` | `VARCHAR(20)` | **NOT NULL** | 都道府県 dropdown (BD #8 required) |
| `address` | `VARCHAR(255)` | **NOT NULL** | 住所 — BD #9 max 255, required |
| `phone` | `VARCHAR(20)` | nullable / optional | 10 hoặc 11 chữ số sau strip `+`, `-`, whitespace, bắt đầu bằng `0` (common-spec §5.11) |
| `status` | `VARCHAR(20)` | NOT NULL, DEFAULT `'ACTIVE'` | Lưu giá trị `DeliveryCenterStatus` enum (`ACTIVE`/`INACTIVE`). Tạo mới → always `ACTIVE` |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Tự động bởi DB / BaseEntity |
| `created_by` | `VARCHAR(100)` | NOT NULL | `@CreatedBy` — lấy từ `Authentication.name` |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Lúc create = created_at |
| `updated_by` | `VARCHAR(100)` | NOT NULL | Lúc create = created_by |
| `deleted_at` | `TIMESTAMPTZ` | nullable | NULL khi tạo mới |
| `deleted_by` | `VARCHAR(100)` | nullable | NULL khi tạo mới |

**Unique constraint (business rule critical):**
`(client_id, code)` → `uq_m_delivery_center_client_code` — basic-design §5 "Ràng buộc duy nhất". Trùng với bản ghi đang ACTIVE (deleted_at IS NULL) → 409 CONFLICT `MSG-010` (với `{0}` = `配送センターID`).

**Indexes:**
- `m_delivery_center_pkey` (PK btree on `id`)
- `idx_m_delivery_center_client_id` (btree on `client_id`)
- `idx_m_delivery_center_area_id` (btree on `area_id`)
- `idx_m_delivery_center_status` (btree on `status`)
- `uq_m_delivery_center_client_code` (UNIQUE btree on `client_id, code`)

**Foreign keys (outgoing):**
- `fk_m_delivery_center_client` — `client_id` → `psms.m_clients.id`
- `fk_m_delivery_center_area` — `area_id` → `psms.m_areas.id`

**Reverse references (used by delete check, không ảnh hưởng create):**
- `psms.m_clients.fixed_center_id` (DEFERRABLE INITIALLY DEFERRED — circular ref)
- `psms.m_stores.delivery_center_id`
- `psms.t_pallets.delivery_center_id`
- `psms.t_plan_stores.delivery_center_id`

**Migration history relevant cho create:**
- V1 (`init_full_schema.sql`) — tạo bảng (cột rộng hơn, postal/prefecture/address nullable)
- V10 (`align_delivery_center_columns.sql`, 2026-04-22) — shrink `code 50→20`, `name 255→100`, `address 500→255`; thêm NOT NULL cho `postal_code`, `prefecture`, `address`

### 3.2 Table `psms.m_clients` (JOIN — resolve + validate ACTIVE)

| Column | Role |
|---|---|
| `id` | PK, target của FK `m_delivery_centers.client_id` |
| `code` | Hiển thị trong response (`clientCode` qua mapper — nếu response có) |
| `name` | Hiển thị trong response (`clientName`) |
| `status` | Kiểm tra `= ACTIVE` trước khi allow tạo center (basic-design §2 dropdown "không hiển thị tạm dừng") |
| `deleted_at` | Phải `IS NULL` |

### 3.3 Table `psms.m_areas` (JOIN — resolve + validate cross-client)

| Column | Role |
|---|---|
| `id` | PK, target của FK `m_delivery_centers.area_id` |
| `name` | Hiển thị trong response (`areaName`) |
| `client_id` | **Phải khớp** `request.clientId` — nếu sai → 400 `PSMS_CTR_004` |
| `status` | Basic-design không yêu cầu check; dropdown UI đã ẩn INACTIVE ở màn edit (common-spec §5.6 Detail). BE không enforce thêm để tránh block khi user chọn area đang tạm dừng do race condition |
| `deleted_at` | Phải `IS NULL` |

---

## 4. API Endpoints Summary

| # | Method | Path | Role | Description |
|---|---|---|---|---|
| 1 | POST | `/v1/delivery-centers` | ADMIN | Tạo mới trung tâm phân phối |

> Base path `/v1/delivery-centers` — số nhiều, kebab-case (CLAUDE.md RULE 1). Endpoint chung cho CRUD list + create; method POST phân biệt.

---

## 5. API Detail

### 5.1 POST /v1/delivery-centers

#### Authorization

- Security: `Bearer <JWT>` bắt buộc (header `Authorization`).
- Class-level: `@PreAuthorize("hasRole('ADMIN')")` trên `DeliveryCenterController` → kế thừa cho method `create`.
- LOGISTICS / user chưa đăng nhập → 403 / 401.

#### Request

**Headers:**

| Header | Required | Value |
|---|---|---|
| `Authorization` | Yes | `Bearer <token>` |
| `Content-Type` | Yes | `application/json; charset=utf-8` |
| `Accept` | No | `application/json` |
| `Accept-Language` | No | `ja` (default), `vi`, `en` — quyết định locale cho error messages |

**Request Body — `DeliveryCenterRequest`:**

```json
{
  "name":       "加古川配送センター",
  "clientId":   10,
  "areaId":     2,
  "code":       "kakogawa",
  "postalCode": "675-0064",
  "prefecture": "兵庫県",
  "address":    "加古川市加古川町溝之口1番地",
  "phone":      "079-421-1234"
}
```

**Validation rules:**

| Field | Type | Required | Constraints | Error code (BE / Bean Validation) |
|---|---|---|---|---|
| `name` | `String` | Yes | Trim đầu/cuối; sau trim không rỗng; length 1–100 (basic-design #2); cho phép full/half-width chữ + số + ký tự đặc biệt tên chuẩn (common-spec §5.1.1) | `MSG-001` (required), `MSG-009` (too long) |
| `clientId` | `Long` | Yes | NOT NULL; phải tồn tại trong `m_clients` (`deleted_at IS NULL`, `status = ACTIVE`) | `MSG-001`, `PSMS_CTR_002` (not found), `PSMS_CTR_006` (inactive) |
| `areaId` | `Long` | Yes | NOT NULL; phải tồn tại `m_areas` (`deleted_at IS NULL`); `area.client_id = clientId` | `MSG-001`, `PSMS_CTR_003` (not found), `PSMS_CTR_004` (cross-client) |
| `code` | `String` | Yes | Trim; không rỗng sau trim; max 20 ký tự; chỉ `半角英数字` (pattern `^[A-Za-z0-9]+$`) per basic-design #5; unique `(clientId, code)` trong `deleted_at IS NULL` | `MSG-001`, `MSG-009`, `MSG-002` (format), `MSG-010` (duplicate, `{項目名}` = `配送センターID`) |
| `postalCode` | `String` | Yes | Format `999-9999` (regex `^\d{3}-\d{4}$`); max 10 | `MSG-001`, `MSG-009`, `MSG-002` (format) |
| `prefecture` | `String` | Yes | Max 20 (match 都道府県 master — xem GAP-202) | `MSG-001`, `MSG-009` |
| `address` | `String` | Yes | Trim; max 255 (basic-design #9); DB column `VARCHAR(500)` để dư chỗ cho auto-fill concat | `MSG-001`, `MSG-009` |
| `phone` | `String` | No | Max 20; nếu có giá trị → strip `+`, `-`, whitespace → phải còn 10–11 chữ số và bắt đầu `0` (common-spec §5.11) | `MSG-009`, `MSG-013` (định dạng số sai) |

> **Note:** `status` không nhận từ request — BE hardcode `ACTIVE` khi tạo. Không có `id`, `created_*`, `updated_*`, `deleted_*` trong request (audit columns tự động).

#### Response

**201 Created** — `ApiResponse<DeliveryCenterResponse>`

```json
{
  "success": true,
  "message": "登録しました",
  "data": {
    "id": 15,
    "code": "kakogawa",
    "name": "加古川配送センター",
    "clientId": 10,
    "clientName": "ファミリーマート",
    "areaId": 2,
    "areaName": "関西",
    "postalCode": "675-0064",
    "prefecture": "兵庫県",
    "address": "加古川市加古川町溝之口1番地",
    "phone": "079-421-1234",
    "status": "ACTIVE"
  }
}
```

**Response fields (12 fields):**

| Field | Type | Source | Notes |
|---|---|---|---|
| `id` | `Long` | `m_delivery_centers.id` (auto-gen) | Dùng bởi FE để redirect `/center/{id}/edit` nếu cần |
| `code` | `String` | `m_delivery_centers.code` | Đã trim |
| `name` | `String` | `m_delivery_centers.name` | Đã trim |
| `clientId` | `Long` | `m_delivery_centers.client_id` | — |
| `clientName` | `String` | `m_clients.name` (JOIN) | — |
| `areaId` | `Long` | `m_delivery_centers.area_id` | — |
| `areaName` | `String` | `m_areas.name` (JOIN) | — |
| `postalCode` | `String` | `m_delivery_centers.postal_code` | — |
| `prefecture` | `String` | `m_delivery_centers.prefecture` | — |
| `address` | `String` | `m_delivery_centers.address` | — |
| `phone` | `String` | `m_delivery_centers.phone` | nullable |
| `status` | `String` | `m_delivery_centers.status` | Luôn `ACTIVE` khi tạo mới |

#### Business Logic

1. **Authorization check** — Spring Security xác thực JWT, kiểm tra role `ADMIN`. Fail → 401/403.
2. **Bean Validation** — `@Valid` trên `@RequestBody` → thực thi các ràng buộc Jakarta. Fail → 400 qua `GlobalExceptionHandler#handleValidation`, message theo `MSG-001` / `MSG-009` / `MSG-002` tùy constraint vi phạm.
3. **Trim input** — trim đầu/cuối cho các field BD chỉ định: `name` (BD #2), `address` (BD #9), `phone` (BD #10). Các field khác (`code`, `postalCode`, `prefecture`) giữ theo code hiện hành — `code` hiện có trim; `postalCode`, `prefecture` không trim.
4. **Resolve ACTIVE Client** — `clientRepository.findByIdAndDeletedAtIsNull(clientId)`:
   - Không tìm thấy → `ResourceNotFoundException(PSMS_CTR_002)` (404).
   - Tìm thấy nhưng `status != ACTIVE` → `BusinessException(PSMS_CTR_006)` (400) — basic-design §2 "không hiển thị tạm dừng" trong dropdown, BE defense-in-depth.
5. **Resolve Area thuộc Client** — `areaRepository.findByIdAndDeletedAtIsNull(areaId)`:
   - Không tìm thấy → `ResourceNotFoundException(PSMS_CTR_003)` (404).
   - `area.client_id != request.clientId` → `BusinessException(PSMS_CTR_004)` (400). Basic-design §5 "Ràng buộc tham chiếu `area_id` ↔ `client_id`".
6. **Check uniqueness** — `deliveryCenterRepository.existsByClientIdAndCodeIgnoreCaseAndDeletedAtIsNull(clientId, trimmedCode)`:
   - Trả `true` → `ConflictException(MSG-010, "配送センターID")` (409). BD §5 "Ràng buộc duy nhất — Trùng → báo lỗi MSG-010 với `{項目名}` = `配送センターID`".
7. **Build entity** — `DeliveryCenter.builder()` với: trimmed `name`, `code`, FK objects `client` và `area`, các trường địa chỉ + phone, `status = "ACTIVE"`. BaseEntity audit fields (`created_at`, `created_by`, etc.) tự động qua Spring Data JPA auditing.
8. **Save** — `deliveryCenterRepository.save(entity)` → DB INSERT, trả entity có `id`.
9. **Log info** — `log.info("create_delivery_center id={} code={} clientId={}")` để audit và troubleshoot.
10. **Map sang DTO** — `deliveryCenterMapper.toResponse(saved)` (MapStruct) → `DeliveryCenterResponse` (12 fields, bao gồm `clientName`, `areaName` qua JOIN).
11. **Wrap response** — Controller trả `ApiResponse.ok("登録しました", response)` + HTTP 201 (via `@ResponseStatus(HttpStatus.CREATED)`).

#### Error Cases

| HTTP | Code | Message (JP) | Nguyên nhân |
|---|---|---|---|
| 400 | `MSG-001` | `{項目名}を入力してください` | Field required bị null/blank |
| 400 | `MSG-002` | `半角英数字とハイフンのみで入力してください` | `code` sai format (có ký tự khác 半角英数字), `postalCode` sai format `999-9999` |
| 400 | `MSG-009` | `{max-length}文字以内で入力してください` | Field vượt max length |
| 400 | `MSG-013` | `10桁または11桁で入力してください` | `phone` có giá trị nhưng không đúng 10/11 chữ số sau strip |
| 400 | `PSMS_CTR_004` | `このエリアは選択されたクライアントに属していません` | Area được chọn không thuộc Client được chọn |
| 400 | `PSMS_CTR_006` | `このクライアントは無効です` | Client tồn tại nhưng `status = INACTIVE` |
| 401 | — | (Spring Security default) | Thiếu/hết hạn JWT |
| 403 | — | (Spring Security default) | Role ≠ ADMIN |
| 404 | `PSMS_CTR_002` | `クライアントが見つかりません` | Client không tồn tại hoặc đã xóa mềm |
| 404 | `PSMS_CTR_003` | `エリアが見つかりません` | Area không tồn tại hoặc đã xóa mềm |
| 409 | `MSG-010` | `この配送センターIDは既に登録されています` | Trùng `(client_id, code)` với bản ghi chưa xóa mềm — thông điệp `この{項目名}は既に登録されています` với `{項目名}` = `配送センターID` (BD §5) |
| 500 | `MSG-022` | `システムエラーが発生しました。しばらくしてから再試行してください。` | DB lỗi / lỗi không kiểm soát |

#### Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant SEC as SecurityFilter (JWT)
    participant CTRL as DeliveryCenterController
    participant VAL as @Valid (Bean Validation)
    participant SVC as DeliveryCenterServiceImpl
    participant CR as ClientRepository
    participant AR as AreaRepository
    participant DR as DeliveryCenterRepository
    participant MAP as DeliveryCenterMapper
    participant DB as PostgreSQL

    C->>SEC: POST /v1/delivery-centers { name, clientId, areaId, code, ... }<br/>Authorization: Bearer <jwt>
    SEC->>SEC: Xác thực JWT + role ADMIN
    alt Token invalid / role sai
        SEC-->>C: 401 / 403
    else OK
        SEC->>CTRL: forward
        CTRL->>VAL: @Valid DeliveryCenterRequest
        alt Validation fail
            VAL-->>CTRL: MethodArgumentNotValidException
            CTRL-->>C: 400 { success: false, message: "MSG-001/009/002/...", errors }
        else OK
            CTRL->>SVC: create(request)
            SVC->>SVC: Trim name, address, phone (BD); code đã được trim sẵn (existing code)
            SVC->>CR: findByIdAndDeletedAtIsNull(clientId)
            alt Client không tồn tại
                CR-->>SVC: Optional.empty()
                SVC-->>CTRL: throw ResourceNotFoundException(PSMS_CTR_002)
                CTRL-->>C: 404 { success: false, message: "クライアントが見つかりません" }
            else Client INACTIVE
                CR-->>SVC: Client(status=INACTIVE)
                SVC-->>CTRL: throw BusinessException(PSMS_CTR_006)
                CTRL-->>C: 400 { success: false, message: "このクライアントは無効です" }
            else Client ACTIVE
                CR-->>SVC: Client(status=ACTIVE)
                SVC->>AR: findByIdAndDeletedAtIsNull(areaId)
                alt Area không tồn tại
                    AR-->>SVC: Optional.empty()
                    SVC-->>CTRL: throw ResourceNotFoundException(PSMS_CTR_003)
                    CTRL-->>C: 404
                else Area cross-client
                    AR-->>SVC: Area(client_id != request.clientId)
                    SVC-->>CTRL: throw BusinessException(PSMS_CTR_004)
                    CTRL-->>C: 400
                else Area OK
                    AR-->>SVC: Area
                    SVC->>DR: existsByClientIdAndCodeIgnoreCaseAndDeletedAtIsNull(clientId, code)
                    alt Duplicate (client_id, code)
                        DR-->>SVC: true
                        SVC-->>CTRL: throw ConflictException(MSG-010, "配送センターID")
                        CTRL-->>C: 409 { message: "この配送センターIDは既に登録されています" }
                    else OK
                        DR-->>SVC: false
                        SVC->>DR: save(entity) — status=ACTIVE, audit cols auto
                        DR->>DB: INSERT INTO psms.m_delivery_centers
                        DB-->>DR: DeliveryCenter (id=15)
                        DR-->>SVC: saved entity
                        SVC->>SVC: log.info("create_delivery_center id=15 code=... clientId=...")
                        SVC->>MAP: toResponse(saved)
                        MAP-->>SVC: DeliveryCenterResponse (12 fields)
                        SVC-->>CTRL: DeliveryCenterResponse
                        CTRL-->>C: 201 Created<br/>{ success: true, message: "登録しました", data: {...} }
                    end
                end
            end
        end
    end
```

---

## 6. DTO Definitions

### 6.1 Request — `DeliveryCenterRequest`

```java
// jp.kreo.psms.dto.request.DeliveryCenterRequest
public record DeliveryCenterRequest(
    @NotBlank(message = "{MSG-001}")
    @Size(max = 100, message = "{MSG-009}")
    String name,

    @NotNull(message = "{MSG-001}")
    Long clientId,

    @NotNull(message = "{MSG-001}")
    Long areaId,

    @NotBlank(message = "{MSG-001}")
    @Size(max = 20, message = "{MSG-009}")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "{MSG-002}")
    String code,

    @NotBlank(message = "{MSG-001}")
    @Pattern(regexp = "^\\d{3}-\\d{4}$", message = "{MSG-002}")
    @Size(max = 10, message = "{MSG-009}")
    String postalCode,

    @NotBlank(message = "{MSG-001}")
    @Size(max = 20, message = "{MSG-009}")
    String prefecture,

    @NotBlank(message = "{MSG-001}")
    @Size(max = 255, message = "{MSG-009}")
    String address,

    @Size(max = 20, message = "{MSG-009}")
    String phone
) { }
```

> **Gap vs code hiện có** (xem §15 Gaps): hiện `@NotBlank` thiếu ở `postalCode`, `prefecture`, `address`; `@Size(max)` chưa khớp BD (`name` 255 vs cần 100; `code` 50 vs cần 20; `address` 500 vs cần 255); thiếu `@Pattern` cho `code` (半角英数字) và `postalCode` (`999-9999`); thiếu validate phone format (10/11 chữ số sau strip).

### 6.2 Response — `DeliveryCenterResponse`

```java
// jp.kreo.psms.dto.response.DeliveryCenterResponse (đã có)
public record DeliveryCenterResponse(
    Long   id,
    String code,
    String name,
    Long   clientId,
    String clientName,
    Long   areaId,
    String areaName,
    String postalCode,
    String prefecture,
    String address,
    String phone,
    String status
) { }
```

### 6.3 Standard wrappers (đã có sẵn)

```java
// jp.kreo.psms.dto.response.ApiResponse<T>   — wrapper chuẩn dự án
```

---

## 7. Service Contract

```java
// jp.kreo.psms.service.DeliveryCenterService (đã có)
public interface DeliveryCenterService {
    /**
     * Tạo mới delivery center.
     * @throws ResourceNotFoundException PSMS_CTR_002 nếu client không tồn tại
     * @throws BusinessException PSMS_CTR_006 nếu client INACTIVE
     * @throws ResourceNotFoundException PSMS_CTR_003 nếu area không tồn tại
     * @throws BusinessException PSMS_CTR_004 nếu area không thuộc client
     * @throws ConflictException MSG-010 nếu trùng (clientId, code) — tham số {項目名} = "配送センターID"
     */
    DeliveryCenterResponse create(DeliveryCenterRequest request);
    // ... các method khác (findAll, findById, update, delete) — khác scope
}
```

---

## 8. Repository Methods Used

```java
// jp.kreo.psms.repository.DeliveryCenterRepository
boolean existsByClientIdAndCodeIgnoreCaseAndDeletedAtIsNull(Long clientId, String code);
// save(entity)  ← inherited từ JpaRepository

// jp.kreo.psms.repository.ClientRepository
Optional<Client> findByIdAndDeletedAtIsNull(Long id);

// jp.kreo.psms.repository.AreaRepository
Optional<Area> findByIdAndDeletedAtIsNull(Long id);
```

Tất cả method đã tồn tại, không cần bổ sung.

---

## 9. Controller Signature

```java
// jp.kreo.psms.controller.DeliveryCenterController (đã có)
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
@Operation(summary = "Create a new delivery center")
public ApiResponse<DeliveryCenterResponse> create(@Valid @RequestBody DeliveryCenterRequest request) {
    return ApiResponse.ok("登録しました", deliveryCenterService.create(request));
}
```

> Class-level `@PreAuthorize("hasRole('ADMIN')")` kế thừa.

---

## 10. Mapper

```java
// jp.kreo.psms.mapper.DeliveryCenterMapper (đã có)
@Mapping(target = "clientId",   source = "client.id")
@Mapping(target = "clientName", source = "client.name")
@Mapping(target = "areaId",     source = "area.id")
@Mapping(target = "areaName",   source = "area.name")
DeliveryCenterResponse toResponse(DeliveryCenter entity);
```

> `toResponse` không có `clientCode` vì `DeliveryCenterResponse` không expose field này (khác với `DeliveryCenterListResponse` của M-03 list).

---

## 11. Error Handling Summary

| Error Code | HTTP | Exception | Where thrown |
|---|---|---|---|
| `MSG-001` | 400 | `MethodArgumentNotValidException` | `@NotBlank` / `@NotNull` fail |
| `MSG-002` | 400 | `MethodArgumentNotValidException` | `@Pattern` fail cho `code` hoặc `postalCode` |
| `MSG-009` | 400 | `MethodArgumentNotValidException` | `@Size` fail |
| `MSG-013` | 400 | `MethodArgumentNotValidException` | Phone không đúng 10/11 chữ số (nếu dùng custom validator) |
| `PSMS_CTR_002` | 404 | `ResourceNotFoundException` | `DeliveryCenterServiceImpl#resolveActiveClient` — client không tồn tại |
| `PSMS_CTR_003` | 404 | `ResourceNotFoundException` | `DeliveryCenterServiceImpl#resolveAreaBelongingToClient` — area không tồn tại |
| `PSMS_CTR_004` | 400 | `BusinessException` | `DeliveryCenterServiceImpl#resolveAreaBelongingToClient` — area cross-client |
| `PSMS_CTR_006` | 400 | `BusinessException` | `DeliveryCenterServiceImpl#resolveActiveClient` — client INACTIVE |
| `MSG-010` | 409 | `ConflictException` | `DeliveryCenterServiceImpl#create` — duplicate (client_id, code); truyền `{項目名}` = `"配送センターID"` |
| `MSG-022` | 500 | `Exception` (fallback) | `GlobalExceptionHandler#handleGeneral` |

**Error UX mapping (BD §5 + common-spec §4.1):**

| Status | UX hiển thị | Nguồn |
|---|---|---|
| 400 (validation) | Inline đỏ dưới field tương ứng | BD §5 "Validation: dưới ô tương ứng, inline(đỏ)" |
| 400 `PSMS_CTR_004` / `PSMS_CTR_006` | Toast đỏ | BD §5 "Lỗi hệ thống / mạng / trùng / tham chiếu: toast(đỏ)" |
| 404 `PSMS_CTR_002` / `PSMS_CTR_003` | Toast đỏ | Như trên |
| 409 `MSG-010` | Toast đỏ hoặc inline dưới `code` | Như trên |
| 500 | Modal "接続エラー" với nút 再試行 | common-spec §4.1 (MSG-022) |

---

## 12. Testing Scenarios

### 12.1 Happy Path

| # | Scenario | Input | Expected |
|---|---|---|---|
| G-01 | Input hợp lệ đầy đủ | `{name, clientId=active, areaId=belongs, code unique, postalCode=999-9999, prefecture, address, phone}` | 201 Created, `data.id` auto, `status=ACTIVE`, message `"登録しました"` |
| G-02 | `phone` null (optional) | phone omitted | 201 Created, `data.phone=null` |
| G-03 | `name` có whitespace | `"  加古川センター  "` | 201, DB chứa trimmed `"加古川センター"` |
| G-04 | `code` uppercase unique | `"Kakogawa"` | 201, lưu y nguyên; kiểm tra duplicate case-insensitive (`existsIgnoreCase`) |

### 12.2 Edge Cases

| # | Scenario | Input | Expected |
|---|---|---|---|
| E-01 | Name sát giới hạn 100 | `name.length() == 100` | 201 |
| E-02 | Name 101 | `name.length() == 101` | 400 MSG-009 |
| E-03 | Code có ký tự đặc biệt | `"kako-gawa"` | 400 MSG-002 (ngoài 半角英数字) |
| E-04 | `postalCode` thiếu dấu gạch | `"6750064"` | 400 MSG-002 |
| E-05 | Duplicate với bản ghi đã xóa mềm | cùng `(client_id, code)` với record có `deleted_at != NULL` | 201 (theo basic-design §5 "Trùng với bản ghi đã xóa mềm: 要確認" — mặc định cho phép do `existsBy...AndDeletedAtIsNull` loại bỏ) |
| E-06 | Create với cùng `code` nhưng khác `client_id` | record khác client có cùng code | 201 (unique scope là per client) |
| E-07 | Phone có `+81-90-1234-5678` | strip `+`, `-`, space → 11 digits bắt đầu `0`... chờ, `81` không bắt đầu `0` | 400 MSG-013 (nếu implement validator) hoặc 201 nếu BE skip phone format check |
| E-08 | Phone `"090-1234-5678"` | strip → `09012345678` (11 digits, bắt đầu `0`) | 201 |

### 12.3 Error Cases

| # | Scenario | Input | Expected |
|---|---|---|---|
| X-01 | Thiếu JWT | no `Authorization` | 401 |
| X-02 | Role LOGISTICS | LOGISTICS token | 403 |
| X-03 | Thiếu `name` | `name: null` | 400 MSG-001 |
| X-04 | Thiếu `clientId` | `clientId: null` | 400 MSG-001 |
| X-05 | Thiếu `postalCode` | `postalCode: null` | 400 MSG-001 |
| X-06 | Thiếu `prefecture` | `prefecture: null` | 400 MSG-001 |
| X-07 | Thiếu `address` | `address: null` | 400 MSG-001 |
| X-08 | Client không tồn tại | `clientId: 9999` | 404 PSMS_CTR_002 |
| X-09 | Client INACTIVE | `clientId` của INACTIVE client | 400 PSMS_CTR_006 |
| X-10 | Area không tồn tại | `areaId: 9999` | 404 PSMS_CTR_003 |
| X-11 | Area cross-client | `areaId` của client khác | 400 PSMS_CTR_004 |
| X-12 | Duplicate `(client_id, code)` | Tạo 2 lần cùng client + code | lần 1: 201, lần 2: 409 MSG-010 (`この配送センターIDは既に登録されています`) |
| X-13 | Duplicate case-insensitive | Sau khi có `"KAKOGAWA"`, tạo `"kakogawa"` cùng client | 409 MSG-010 |

---

## 13. Dependent APIs (External / Other Features)

### 13.1 Dropdown sources cho form M-03-cud

| # | Method | Path | Feature | Purpose |
|---|---|---|---|---|
| D-1 | GET | `/v1/clients/dropdown` | M-01 Client | Nạp dropdown "Tên khách hàng" — **ẩn soft-deleted, ẩn INACTIVE** (common-spec §5.6 Detail: màn CUD không hiển thị tạm dừng) |
| D-2 | GET | `/v1/areas/dropdown?clientId={id}` | M-02 Area | Nạp dropdown "Tên khu vực" sau khi chọn Client — lọc theo `clientId`, ẩn soft-deleted, ẩn INACTIVE (common-spec §5.6 Detail) |

> **Khác với M-03 list:** list dùng dropdown filter với INACTIVE hiển thị (common-spec §5.6 List). Màn CUD này (Detail) ẩn INACTIVE để tránh user chọn option tạm dừng.

### 13.2 Postal code lookup (auto-fill 郵便番号 → 都道府県 + address)

Basic-design §5 "Auto-fill địa chỉ theo 郵便番号" + **GAP-201** (要確認 nguồn tra cứu).

**Hiện trạng:** BE **không** cung cấp endpoint lookup. FE gọi dịch vụ bên ngoài (ví dụ `zipcloud.ibsnet.co.jp`):

```
GET https://zipcloud.ibsnet.co.jp/api/search?zipcode={7digits}
```

Response shape (tham khảo):
```json
{ "status": 200, "results": [{ "zipcode": "6750064", "address1": "兵庫県", "address2": "加古川市", "address3": "加古川町溝之口" }] }
```

FE ghép `address2 + address3` vào field "Địa chỉ chi tiết", set `address1` vào "Tỉnh/Thành".

**Nếu cần đưa về BE (future work):** tạo endpoint `GET /v1/postal-codes/{code}` làm proxy + cache — ngoài scope feature này.

### 13.3 Prefecture master (都道府県 dropdown)

Basic-design **GAP-202** (要確認 danh sách cố định vs API).

**Hiện trạng:** FE hardcode 47 都道府県 (cố định). Nếu cần future: `GET /v1/prefectures` master endpoint.

---

## 14. FE Behavior Contract

| # | Sự kiện | Hành vi FE |
|---|---|---|
| F-01 | Vào `/center/new` | Gọi D-1 (clients dropdown); form trống; `code` enable edit; nút **Xóa** ẩn |
| F-02 | User chọn Client | Clear `areaId` đã chọn; gọi D-2 với `clientId` mới |
| F-03 | User nhập `postalCode` đủ format rồi blur | FE gọi external postal API; nếu success → auto-fill `prefecture` + `address`; nếu fail → toast MSG-024 |
| F-04 | User click **Lưu** | FE validate client-side (required, length, pattern) → POST `/v1/delivery-centers`. Success 201 → toast "登録しました" → redirect `/center`. Fail → hiển thị lỗi inline / toast theo code |
| F-05 | User click **Hủy** | KHÔNG hỏi xác nhận; redirect `/center` (basic-design §3 #13) |
| F-06 | Server trả 409 `MSG-010` | Hiển thị lỗi inline dưới field `code`: `この配送センターIDは既に登録されています` |
| F-07 | Server trả 400 `PSMS_CTR_004` | Hiển thị lỗi inline dưới field `areaId` |
| F-08 | Server trả 500 | Modal lỗi common-spec §4.1 (MSG-022) |

---

## 15. Notes & Assumptions

1. **Message code convention**: Dùng mã feature-specific `PSMS_CTR_xxx` cho các business error đặc thù của M-03 (Client not found/inactive, Area not found/cross-client). Riêng **duplicate `(client_id, code)`** dùng **`MSG-010`** (Common) theo BD §5 — thông điệp template `この{0}は既に登録されています` với parameter `{0}` = `"配送センターID"`. Infrastructure đã sẵn: `MessageCode.MSG_010` đã có trong enum và `MSG-010=この{0}は既に登録されています` đã có trong `messages_ja.properties:12` — chỉ cần đổi service throw từ `PSMS_CTR_007` sang `MSG_010` với param.
2. **Trim theo BD**: BD #2 yêu cầu trim `name`, BD #9 yêu cầu trim `address`, BD #10 yêu cầu trim `phone`. Các field khác (`code`, `postalCode`, `prefecture`) BD không đề cập → giữ theo code hiện hành (code hiện có trim `code`; `postalCode`/`prefecture` không trim).
3. **Duplicate với bản ghi đã xóa mềm**: BD §5 đánh dấu 要確認. Code hiện tại dùng `existsByClientIdAndCodeIgnoreCaseAndDeletedAtIsNull` = ALLOW reuse code sau khi record cũ soft-deleted. Giữ hiện trạng cho tới khi PM confirm khác.
4. **Client ACTIVE check**: BD §3 #3 dropdown "không hiển thị tạm dừng" → BE đã check `status = ACTIVE` → PSMS_CTR_006. Giữ hiện trạng.
5. **Area status**: BD không yêu cầu BE check area status → giữ theo code hiện tại (không check).
6. **Postal code auto-fill (GAP-201 trong BD §5)**: BD đánh dấu 要確認 nguồn tra cứu. Code hiện tại: **không có endpoint BE cho postal lookup** → FE tự xử lý. Giữ hiện trạng.
7. **Prefecture master (GAP-202 trong BD §5)**: BD đánh dấu 要確認 master nguồn. Code hiện tại: **không có endpoint BE cho prefecture master** → FE tự xử lý (hardcode). Giữ hiện trạng.
8. **Optimistic locking (`updated_at`)**: BD §5 nhắc `MSG-020` cho conflict khi update. Với create không áp dụng (chưa có bản ghi).
9. **Gaps so với code hiện có trong repo** — chỉ liệt kê các điểm BD yêu cầu khác với code hiện hành:
    - **Gap-1:** `DeliveryCenterRequest.name` `@Size(max = 255)` → đổi `max = 100` theo BD #2.
    - **Gap-2:** `DeliveryCenterRequest.code` `@Size(max = 50)` → đổi `max = 20` theo BD #5.
    - **Gap-3:** `DeliveryCenterRequest.code` thiếu `@Pattern(^[A-Za-z0-9]+$)` — BD #5 yêu cầu "半角英数字".
    - **Gap-4:** `DeliveryCenterRequest.address` `@Size(max = 500)` → đổi `max = 255` theo BD #9.
    - **Gap-5:** `DeliveryCenterRequest` thiếu `@NotBlank` cho `postalCode`, `prefecture`, `address` — BD #6/#8/#9 đều đánh dấu "Bắt buộc".
    - **Gap-6:** `DeliveryCenterRequest.postalCode` thiếu `@Pattern(^\\d{3}-\\d{4}$)` — BD #6 yêu cầu format `999-9999`.
    - **Gap-7:** `DeliveryCenterRequest.phone` thiếu validator format 10/11 chữ số sau strip — BD #10 reference common-spec §5.11.
    - **Gap-8:** `DeliveryCenterServiceImpl#create` cần trim thêm `address` (BD #9) và `phone` (BD #10). Không cần trim `postalCode`, `prefecture` (BD không yêu cầu).
    - **Gap-9:** `DeliveryCenterServiceImpl#create` hiện throw `ConflictException(MessageCode.PSMS_CTR_007.getCode())` — cần đổi sang `ConflictException(MessageCode.MSG_010.getCode(), "配送センターID")` theo BD §5. `MessageCode.MSG_010.getCode()` trả `"MSG-010"` → `messages_ja.properties:12` resolve `この{0}は既に登録されています` với `{0}="配送センターID"` thành `"この配送センターIDは既に登録されています"`. Tương tự cho `update()` (`existsByClientIdAndCodeIgnoreCaseAndDeletedAtIsNullAndIdNot`). `PSMS_CTR_007` có thể remove khỏi enum + properties sau khi refactor hoặc giữ làm deprecated.
    - **Các gap này sẽ được xử lý ở Phase 3 bởi `/analyze-code-gaps` + `/gen-code` (OUTDATED).**
10. **Phạm vi endpoint**: BD chỉ định form gọi 1 API tạo mới. BE không thêm endpoint phụ trợ (postal lookup, prefecture master, dropdown) — thuộc feature khác hoặc FE tự handle. Giữ scope BE = 1 endpoint `POST /v1/delivery-centers`.

---

**Lịch sử phiên bản**

| Version | Date | Author | Description |
|---|---|---|---|
| 1.0 | 2026-04-22 | tiendv@hblab.vn | Initial detail-design từ basic-design M-03-cud (create mode) + DBML v3 + common-spec |
| 1.1 | 2026-04-22 | tiendv@hblab.vn | Narrow scope theo BD: bỏ §15 NFR (BD không có), narrow trim chỉ cho field BD chỉ định (name/address/phone), tight gap list — BD silent → giữ code cũ |
| 1.2 | 2026-04-22 | tiendv@hblab.vn | Duplicate error chuyển từ `PSMS_CTR_007` sang `MSG-010` ({0}=配送センターID) theo BD §5; thêm Gap-9 |
| 1.3 | 2026-04-22 | tiendv@hblab.vn | §3.1 sync với DB sau V10 migration: code 20, name 100, address 255, postal/prefecture/address NOT NULL; thêm chi tiết indexes, FK, reverse refs, migration history |
