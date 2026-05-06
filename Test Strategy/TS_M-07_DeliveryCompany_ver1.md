# TEST STRATEGY — M-07 Quản lý công ty vận chuyển（運送業者管理）

|                  | Nội dung                              |
| ---------------- | ------------------------------------- |
| Màn hình         | M-07 (Danh sách) / M-07-cud (Drawer)  |
| Người tạo        | HuyenNTK1                             |
| Ngày tạo         | 2026-05-05                            |
| Tài liệu tham chiếu | M-07_VN.md, M-07-cud_VN.md, D-00_Message definition.md, 共通仕様_vi.md, Q&A_M-07 |

---

## 1. System Overview

### Hệ thống là gì?

M-07 là màn hình **Master Quản lý công ty vận chuyển** (運送業者管理). Dữ liệu lưu trong bảng `m_delivery_companies` gồm: ID, tên công ty, mã vận đơn (`waybill_code`), mã định danh (`carrier_code`).

**Mục đích chính**: Quản lý danh sách các công ty vận chuyển (Yamato, Sagawa...). Đặc biệt, `waybill_code` là trường quan trọng dùng để **liên kết API phát hành mã vận đơn tự động** với đối tác SATO社.

### Luồng nghiệp vụ chính

1. **Xem danh sách**: Tải trang `/delivery`, hiển thị bảng công ty vận chuyển chưa xóa mềm, phân trang 30 bản ghi/trang, không có tìm kiếm/sort.
2. **Thêm mới**: Nhấn nút Thêm → Drawer mở (mode=new) → Nhập tên công ty + mã vận đơn → Lưu.
3. **Sửa**: Nhấn nút Sửa trên dòng → Drawer mở (mode=edit) → Chỉnh sửa → Lưu.
4. **Xóa mềm**: Từ Drawer chế độ Sửa → Nhấn Xóa → Xác nhận dialog → Xóa mềm (set `deleted_at`).

**Quyền truy cập**: Chỉ role **Quản lý（管理）** mới được truy cập và thao tác.

---

## 2. Key Test Targets

| ID   | Priority | Module / Tính năng                          | Lý do                                                                               |
| ---- | -------- | ------------------------------------------- | ----------------------------------------------------------------------------------- |
| T-01 | High     | Tạo mới công ty vận chuyển                  | Happy path cốt lõi; `waybill_code` ảnh hưởng trực tiếp đến API phát hành vận đơn   |
| T-02 | High     | Chỉnh sửa công ty vận chuyển                | Có 楽観的ロック; `waybill_code` edit mode là bắt buộc (khác create mode)            |
| T-03 | High     | Xóa mềm — ràng buộc nghiệp vụ              | Ràng buộc xóa phức tạp (2 điều kiện FK); lỗi ảnh hưởng dữ liệu Client và shipment  |
| T-04 | High     | Validation trường `waybill_code`            | Chỉ half-width số, max 64; liên kết API đối tác — sai format có thể gây lỗi hệ thống|
| T-05 | High     | Phân quyền — chỉ role Quản lý              | Màn hình master nhạy cảm; vai trò khác không được truy cập                          |
| T-06 | Medium   | Validation trường `name` (tên công ty)      | Bắt buộc, max 100 ký tự, full-width/half-width, ký tự đặc biệt theo common          |
| T-07 | Medium   | Danh sách — phân trang, empty state         | Common spec: 30 bản ghi/trang, pagination widget, empty state có hướng dẫn          |
| T-08 | Medium   | Deep link Drawer (URL param)                | `/delivery?drawer=deliveryCompany&mode=new/edit&id=...` — bookmark/share             |
| T-09 | Medium   | 楽観的ロック (concurrent update)            | MSG-033: xung đột khi 2 user sửa cùng bản ghi                                       |
| T-10 | Medium   | Đóng Drawer (Hủy, sau Lưu, deep link)      | URL cleanup sau đóng Drawer; không cảnh báo khi Hủy dù đã nhập dữ liệu             |
| T-11 | Low      | Refresh danh sách sau CUD                   | Sau Lưu/Xóa: danh sách cần phản ánh thay đổi ngay                                  |
| T-12 | Low      | Lỗi mạng / connection error                 | Modal lỗi kết nối thống nhất theo common spec mục 4.1                               |

---

## 3. Risk Assessment

### Business Risk

| Rủi ro                                                        | Impact | Lý do                                                                                         |
| ------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| `waybill_code` sai format gây lỗi API phát hành vận đơn       | High   | Toàn bộ quy trình phát hành vận đơn tự động phụ thuộc vào mã này; lỗi ảnh hưởng vận hành     |
| Xóa mầm công ty vận chuyển đang gán cho Client/shipment       | High   | Vi phạm ràng buộc xóa — nếu không kiểm tra đúng, dữ liệu tham chiếu bị corrupt                |
| Người dùng không có quyền Quản lý truy cập được màn hình      | High   | Dữ liệu Master nhạy cảm; lộ thông tin hoặc thao tác sai quyền                                 |

### Data Risk

| Rủi ro                                                        | Impact | Lý do                                                                                         |
| ------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| `carrier_code` không tồn tại trên UI nhưng bắt buộc trên DB  | High   | Không rõ cách sinh — nếu auto-gen sai logic thì unique constraint lỗi ở tầng DB (G-002)       |
| `waybill_code`: create=null vs edit=required gây inconsistency| Medium | Dữ liệu cũ null khi edit có thể gây nhầm lẫn UX và validate logic (G-006 clarified)           |
| Unique constraint `name` và `waybill_code` chưa rõ            | Medium | Nếu không có unique check, 2 công ty trùng tên/mã có thể gây lỗi API hoặc nhầm lẫn (G-007, G-008) |
| Cascade behavior sau xóa mềm chưa được spec                   | Medium | FK ở bảng con (Client default, shipment) sau xóa mềm không rõ xử lý thế nào (G-009)          |

### Integration Risk

| Rủi ro                                                        | Impact | Lý do                                                                                         |
| ------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| `waybill_code` format từ API đối tác SATO chưa được định nghĩa | High  | Validation UI (half-width số, max 64) có thể không đủ nếu API yêu cầu độ dài/prefix cố định (G-015)|
| Message ID MSG-031, 032, 033 chưa có trong D-00               | High   | Không thể test/verify message content chính xác (G-001 — confirmed cần lấy từ file đầy đủ)   |

### Technical Risk

| Rủi ro                                                        | Impact | Lý do                                                                                         |
| ------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| 楽観的ロック (Optimistic lock) với `updated_at`                | Medium | Concurrent edit cần test kỹ; edge case bản ghi bị xóa mềm trong lúc Drawer đang mở (G-016)  |
| Deep link URL parameter validation                            | Low    | Param không hợp lệ không được mở Drawer; cần test các case sai parameter                     |

---

## 4. Test Scope

### In Scope

- **M-07 Danh sách**: Hiển thị bảng, phân trang (15/30/50 bản ghi/trang), empty state, quyền truy cập
- **M-07-cud Thêm mới**: Form validation (name, waybill_code), Lưu thành công, toast MSG-031
- **M-07-cud Chỉnh sửa**: Nạp dữ liệu vào Drawer, validate (waybill_code bắt buộc khi edit), 楽観的ロック (MSG-033), Lưu thành công
- **M-07-cud Xóa mềm**: Dialog xác nhận, ràng buộc xóa 2 điều kiện (MSG-022), xóa thành công, refresh list
- **Validation**: name (required, max 100, ký tự đặc biệt), waybill_code (required khi edit, half-width số only, max 64), trim đầu/cuối
- **Duplicate check**: carrier_code unique → MSG-032
- **Deep link**: Các URL params hợp lệ và không hợp lệ
- **Phân quyền**: Role Quản lý vs vai trò khác
- **Message**: Tất cả message ID liên quan (MSG-001, MSG-009, MSG-010/032, MSG-022, MSG-033)
- **Lỗi mạng**: Modal lỗi kết nối theo common spec
- **Không có sort/filter**: Xác nhận bảng không có header sort và không có ô lọc

### Out of Scope

- **API SATO社 integration test**: Chỉ test UI/BE validation; test tích hợp API thực tế nằm ngoài scope M-07 manual testing
- **Audit log chi tiết**: Spec tham chiếu common-document audit chưa có — skip cho đến khi có tài liệu (G-024)
- **Performance load test**: SLA "dưới 3 giây" là "mục tiêu tham khảo", không có dataset cụ thể và điều kiện chính thức (G-023)
- **Unit test / API test tầng BE**: Nằm trong phạm vi dev, không phải QA manual

---

## 5. Test Approach

### Test Levels

| Level       | Áp dụng                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| System Test | Chính — kiểm thử end-to-end từ UI qua BE, bao gồm validation và DB      |
| UAT         | Stakeholder confirm luồng Thêm/Sửa/Xóa và phân quyền                    |

### Test Types

| Type        | Nơi áp dụng                                                             |
| ----------- | ----------------------------------------------------------------------- |
| Functional  | Tất cả luồng CRUD, validation, ràng buộc xóa, 楽観的ロック              |
| Negative    | Nhập sai format, bỏ trống trường bắt buộc, vi phạm ràng buộc xóa       |
| Permission  | Truy cập với role không phải Quản lý                                    |
| Integration | Deep link URL → Drawer behavior; refresh list sau CUD                   |
| Edge Case   | Xóa mềm rồi tạo lại; bản ghi bị xóa mềm trong khi Drawer đang mở; waybill_code = null (dữ liệu cũ) khi edit |

### Test Effort Allocation

- **High effort (60%)**: T-01, T-02, T-03, T-04 (core CUD + ràng buộc + waybill_code validation)
- **Medium effort (30%)**: T-05, T-06, T-07, T-08, T-09, T-10 (phân quyền, pagination, deep link, lock)
- **Low effort (10%)**: T-11, T-12 (refresh, lỗi mạng)

---

## 6. Test Focus Areas

### Critical Logic

1. **waybill_code format**: Chỉ half-width số (0-9), không chứa chữ cái hay ký tự đặc biệt. Đây là trường dùng cho API — sai format có hậu quả nghiêm trọng.
2. **waybill_code create vs edit**: Khi tạo mới — cho phép để trống (null); khi sửa — bắt buộc nhập.
3. **Ràng buộc xóa**: 2 điều kiện độc lập — (1) đang là default carrier của Client, (2) đang gán cho shipment/vận đơn. Vi phạm một trong hai → không được xóa.
4. **楽観的ロック**: Kiểm tra `updated_at` — xung đột trả MSG-033, không ghi đè.

### Complex Validation

- `name`: Bắt buộc, max 100, trim đầu/cuối, cho phép full-width/half-width/ký tự đặc biệt theo common (space, `.`, `,`, `-`, `()`, `&`, `/`, `・`)
- `waybill_code`: Bắt buộc (khi edit), max 64, chỉ half-width số — loại bỏ ký tự chữ, dấu gạch nối, khoảng trắng
- Trim + re-validate: sau trim nếu rỗng → hiển thị MSG-001

### Edge Cases

- `waybill_code` = `null` trên DB (dữ liệu cũ) → khi mở Drawer edit, field trống → bắt buộc nhập
- Tạo mới với `name` trùng tên công ty đã xóa mềm → có bị chặn không? (G-017)
- Bản ghi bị user khác xóa mềm trong lúc Drawer đang mở → nhấn Lưu nhận response gì? (G-016)
- Nhập chính xác 100 ký tự cho `name`, 64 ký tự số cho `waybill_code` → được chấp nhận
- Nhập 101 ký tự cho `name`, 65 ký tự cho `waybill_code` → bị chặn (maxlength trên UI)

### High-Risk Data Scenarios

- `carrier_code` duplicate → MSG-032 (lưu ý: field không hiện trên UI, không rõ cách test trực tiếp — G-002)
- Xóa công ty vận chuyển đang là default của Client → MSG-022
- Xóa công ty vận chuyển đang có shipment đang gán → MSG-022

---

## 7. Test Data Strategy

### Key Data Cần Chuẩn Bị

| Data                                       | Mục đích                                                          |
| ------------------------------------------ | ----------------------------------------------------------------- |
| Tài khoản role **Quản lý**                  | Test toàn bộ luồng CRUD                                           |
| Tài khoản role khác (không phải Quản lý)   | Test phân quyền truy cập bị từ chối                               |
| Công ty vận chuyển **chưa có tham chiếu**  | Test xóa mềm thành công                                           |
| Công ty vận chuyển **là default của Client** | Test ràng buộc xóa điều kiện 1                                   |
| Công ty vận chuyển **có shipment đang gán** | Test ràng buộc xóa điều kiện 2                                   |
| Công ty vận chuyển với `waybill_code = null` | Test behavior khi mở Drawer edit với dữ liệu cũ                  |
| 2 session / 2 user cùng mở Drawer sửa 1 bản ghi | Test 楽観的ロック                                            |
| >30 bản ghi công ty vận chuyển             | Test phân trang                                                   |

### Edge Case Data

- `name` chứa ký tự đặc biệt: `Yamato & Co. (JP)－運輸`, full-width: `ヤマト運輸株式会社`
- `waybill_code` = `000999000000` (12 chữ số — ví dụ trong spec)
- `waybill_code` = `0` (1 chữ số — test min-length, G-010)
- `name` đúng 100 ký tự; `waybill_code` đúng 64 ký tự số

### Data Dependencies

- Dữ liệu Client (M-01) cần có FK tới `m_delivery_companies.id` để test ràng buộc xóa điều kiện 1
- Dữ liệu Shipment cần có FK tới `m_delivery_companies.id` để test ràng buộc xóa điều kiện 2

---

## 8. Automation Strategy

### Nên Tự Động Hóa (ROI cao)

| Loại             | Test case                                                       |
| ---------------- | --------------------------------------------------------------- |
| Regression/Smoke | Happy path: Thêm, Sửa, Xóa mềm thành công                     |
| Validation       | Format check `waybill_code` (số vs chữ), required fields       |
| Phân quyền       | Role khác không truy cập được `/delivery`                       |
| Pagination       | Kiểm tra 30 bản ghi/trang mặc định, chuyển trang               |

### Nên Thực Hiện Thủ Công

| Loại             | Lý do                                                           |
| ---------------- | --------------------------------------------------------------- |
| Ràng buộc xóa    | Cần setup data phức tạp (Client FK, Shipment FK)                |
| 楽観的ロック      | Cần 2 session đồng thời — khó tự động hóa đáng tin cậy         |
| Deep link URL    | Cần verify visual behavior của Drawer trên browser              |
| Edge case G-002, G-016 | Chưa có spec rõ ràng — cần exploratory testing           |
| Empty state UI   | Cần kiểm tra trực quan text và nút hướng dẫn                    |
| Message content  | Verify nội dung toast/dialog chính xác (MSG-031, 032, 033)      |

---

## 9. Entry / Exit Criteria

### Entry Criteria

- [ ] Màn hình M-07 và M-07-cud đã deploy lên môi trường test
- [ ] API CRUD `/delivery` hoạt động (không cần API SATO)
- [ ] Có ít nhất 1 tài khoản role Quản lý và 1 tài khoản role khác
- [ ] Dữ liệu test đã chuẩn bị: công ty vận chuyển có/không có tham chiếu
- [ ] MSG-031, 032, 033 đã được xác nhận nội dung (G-001)

### Exit Criteria

- [ ] 100% test case Priority High đã pass
- [ ] 80% test case Priority Medium đã pass
- [ ] Không có bug Severity Critical hoặc High còn mở
- [ ] Ràng buộc xóa (2 điều kiện) đã được verify
- [ ] waybill_code format validation pass trên cả FE và BE
- [ ] Phân quyền đã verify: role không phải Quản lý không truy cập được

---

## 10. Gaps & Questions

### High Risk — Cần làm rõ trước khi viết Test Case

| Gap ID | Vấn đề                                                      | Status       |
| ------ | ------------------------------------------------------------ | ------------ |
| G-001  | MSG-031, MSG-032, MSG-033 chưa có trong D-00 (chỉ tới MSG-024) | ✓ Lấy từ file message definition đầy đủ |
| G-002  | `carrier_code` không có field trên UI — sinh auto hay nhập tay? | ⏳ Cần làm rõ |
| G-003  | Ràng buộc xóa điều kiện 2 bị cắt đứt, thiếu tên bảng/field | ⏳ Cần làm rõ |
| G-004  | MSG-022 dùng cho 2 ngữ cảnh khác nhau (connection error vs xóa vi phạm) | ⏳ Cần làm rõ |
| G-015  | `waybill_code` format API đối tác SATO chưa định nghĩa — validation UI có đủ không? | ⏳ Cần làm rõ |

### Medium Risk — Cần làm rõ trước khi viết TVP

| Gap ID | Vấn đề                                                      |
| ------ | ------------------------------------------------------------ |
| G-007  | `name` — unique constraint chưa rõ                          |
| G-008  | `waybill_code` — unique constraint chưa rõ                  |
| G-009  | Cascade behavior sau xóa mềm (FK ở Client, shipment)        |
| G-010  | `waybill_code` — min-length chưa định nghĩa (1 chữ số có hợp lệ?) |
| G-011  | Timing validation: on-blur hay on-submit?                    |
| G-013  | Message xác nhận xóa chưa finalize (chỉ là "gợi ý")         |
| G-014  | Toast message khi xóa mềm thành công chưa định nghĩa        |
| G-016  | Bản ghi bị xóa mềm bởi user khác trong khi Drawer đang mở  |
| G-017  | Tạo mới với name/waybill_code trùng bản ghi đã xóa mềm — unique check trên `deleted_at IS NULL`? |

### Low Risk — Có thể làm rõ song song

| Gap ID | Vấn đề                                                      |
| ------ | ------------------------------------------------------------ |
| G-012  | Message khi nhập chữ vào `waybill_code` — có dùng MSG-011?  |
| G-018  | Click outside Drawer / nhấn Escape — có đóng Drawer không?  |
| G-019  | Hủy sau khi đã nhập dữ liệu — không cảnh báo, có phải intentional? |
| G-022  | Text empty state M-07 cụ thể là gì? Có message ID không?    |
| G-023  | SLA performance chưa có số cụ thể và dataset test           |
| G-024  | Tài liệu audit log đặc tả cho M-07 là document nào?         |

---

*Ghi chú: G-005 (thứ tự sort) và G-006 (waybill_code create=null/edit=required) đã được confirmed — đã phản ánh vào strategy này.*
