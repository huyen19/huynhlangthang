# Q&A Spec — M-02 Quản lý thông tin khu vực (エリア)

- **Ngày tạo**: 2026-04-29
- **Cập nhật lần 2**: 2026-04-29 — Đối chiếu với Detail Design (list / create / update / delete)
- **Cập nhật lần 3**: 2026-04-29 — Confirm G-021, G-024, G-027 từ BA/Dev
- **Người tạo**: HuyenNTK1
- **Tài liệu tham chiếu**:
  - [M-02_エリア情報一覧_VN.md](../Requirements/M-02/M-02_エリア情報一覧_VN.md)
  - [M-02-cud_エリア（追加・編集・削除）_VN.md](../Requirements/M-02/M-02-cud_エリア（追加・編集・削除）_VN.md)
  - [detail-design_list.md](../Requirements/M-02/detail-design_list.md)
  - [detail-design create.md](../Requirements/M-02/detail-design%20create.md)
  - [detail-design_update.md](../Requirements/M-02/detail-design_update.md)
  - [detail-design_delete.md](../Requirements/M-02/detail-design_delete.md)
  - UI mockup: M-02_エリア情報一覧_VN.png / M-02-cud_エリア（追加・編集・削除)_VN.png

---

## Tổng hợp

| Chỉ số | Số lượng |
|---|---|
| Tổng gap đang mở (Open) | 17 |
| Tổng gap đã giải đáp (Resolved) | 11 |
| **Tổng cộng** | **28** |

**Phân bổ Open theo Risk:**

| Risk | Số gap |
|---|---|
| High | 3 |
| Medium | 11 |
| Low | 3 |

**Phân bổ Open theo Category:**

| Category | Số gap |
|---|---|
| Functional | 2 |
| Business Logic | 3 |
| Data | 1 |
| Validation | 3 |
| Integration | 2 |
| Edge Case | 3 |
| UI/UX | 1 |
| Non-functional | 2 |

---

## I. Gaps Chưa Giải Đáp (Open)

> Sắp xếp theo Risk: High → Medium → Low

| Gap ID | Category | Gap Description | Risk | Clarification Question |
|---|---|---|---|---|
| G-003 | Functional | Spec M-02 liệt kê filter **Tên trung tâm phân phối (M-03)** nhưng UI mockup không hiển thị filter này. Detail design `detail-design_list.md` đánh dấu là **GAP-003 còn mở**: "pulldown filter center hiện chưa có trên Figma — backend vẫn expose `centerId` để FE kích hoạt sau; nếu PM confirm không cần → ẩn param." | High | PM đã quyết định filter Tên trung tâm phân phối có xuất hiện trên UI không? Nếu có, khi nào FE implement? Nếu không, spec M-02 cần được cập nhật để loại bỏ mô tả filter này. |
| G-004 | Business Logic | Spec M-02 (dropdown filter Tên khách hàng): "trạng thái **tạm dừng** vẫn có trong danh sách chọn". Spec M-02-cud (dropdown Tên khách hàng khi tạo/sửa): "Không hiển thị khách hàng **tạm dừng（停止）**". Detail design list §3 ghi `m_clients.status` "ảnh hưởng dropdown filter" nhưng không định nghĩa rõ INACTIVE có xuất hiện trong filter dropdown hay không. | High | Khách hàng ở trạng thái INACTIVE (tạm dừng) có xuất hiện trong **dropdown filter** của M-02 không? Cần thống nhất giữa spec M-02, spec M-02-cud và detail design. |
| G-005 | Functional | UI image hiển thị cột **No.** (số thứ tự 1, 2, 3…) nhưng detail design API response không chứa field `No.` nào. API chỉ trả: `id`, `code`, `name`, `clientId`, `clientName`, `centerNames`, `status`. | High | Cột No. là số thứ tự do FE tự generate (row index trên trang hiện tại) hay một field từ API? Khi sort hoặc phân trang, giá trị No. có reset về 1 không? Cần xác nhận để viết test case đúng. |
| G-021 | Data | ~~**Mâu thuẫn độ dài tối đa của `name` giữa Create và Update:** detail-design create dùng `@Size(max=255)`; detail-design_update dùng `@Size(max=100)`.~~ | ~~High~~ | ✅ **Confirmed 2026-04-29**: Max `name` = **100 ký tự** cho cả Create lẫn Update. `@Size(max=255)` trong detail-design create là **lỗi** cần sửa. |
| G-024 | Validation | ~~**`code` unique check là case-insensitive** trong detail design create: `existsByClientIdAndCodeIgnoreCaseAndDeletedAtIsNull`. Spec ngụ ý A–Z và a–z là ký tự khác nhau.~~ | ~~High~~ | ✅ **Confirmed 2026-04-29**: `code` **có phân biệt hoa/thường** (case-sensitive). "A1" và "a1" là hai `code` khác nhau, được phép cùng tồn tại trong cùng client. `IgnoreCase` trong implementation là **lỗi** cần sửa. |
| G-027 | Functional | ~~**`エリア名` (name) không có trong sort whitelist** của API. Spec M-02 §3 và §5 ghi "Mọi cột đều có thể sắp xếp". Gửi `sort=name,asc` → 400.~~ | ~~High~~ | ✅ **Confirmed 2026-04-29**: **Tất cả cột đều có sort**. `name` phải được bổ sung vào sort whitelist. Đây là **lỗi thiếu** trong implementation cần fix. |
| G-006 | Edge Case | Spec M-02-cud đề cập **楽観的ロック** cho Lưu nhưng detail design update §9 ghi rõ: "Implementation hiện tại **chưa có `@Version`** trên entity — dùng last-write-wins." Nếu user A mở Drawer sửa area X, user B xóa mềm area X trước khi A nhấn Lưu, API PUT trả `404 PSMS-AREA-001 "エリアが見つかりません"`. | Medium | Message "エリアが見つかりません" có đủ thân thiện với user khi xảy ra concurrent delete không? FE xử lý 404 từ PUT thế nào: tự đóng Drawer, hiển thị toast, hay cần confirm popup? Cần mô tả hành vi FE trong spec. |
| G-009 | Validation | Spec M-02-cud mục 3 nút **Hủy**: "đóng Drawer (**không** xác nhận khi có chỉnh sửa chưa lưu)". Người dùng nhập dữ liệu dở rồi nhấn Hủy sẽ mất toàn bộ input không có cảnh báo. Detail design không đề cập cơ chế dirty check. | Medium | "Không confirmation khi Hủy" là thiết kế cố ý hay bỏ sót? Nếu cố ý, lý do là gì (ví dụ: theo UX guideline dự án)? Cần ghi rõ trong spec để tránh tester báo defect nhầm. |
| G-010 | Edge Case | Spec M-02 §3 và §5: "Chỉ hiển thị điều khiển phân trang **từ trang thứ 2** trở đi". Detail design API response luôn trả `totalElements` và `totalPages`. Không có mô tả rõ ràng về điều kiện FE dùng để ẩn/hiện pagination controls. | Medium | Điều kiện chính xác để hiện pagination controls là gì — `totalPages > 1` hay `totalElements > pageSize`? Nếu có đúng 30 bản ghi (= 1 trang đầy đủ với default size=30), pagination có hiển thị không? |
| G-011 | Integration | Detail design không định nghĩa trạng thái UI khi **API GET danh sách client (M-01) thất bại** trong quá trình load dropdown filter và dropdown Tạo/Sửa. Không rõ Drawer có disabled, hiển thị error message, hay có fallback. | Medium | Khi API load dropdown Tên khách hàng bị lỗi (timeout / 500), UI xử lý thế nào? Dropdown hiển thị empty, disabled, hay loading spinner? Người dùng có thể vẫn submit form không? |
| G-013 | UI/UX | Spec M-02 §4 "Đóng Drawer": "nếu có thay đổi dữ liệu thì tải lại danh sách". Detail design không đề cập việc giữ hay reset **filter và sort state** sau khi list reload. | Medium | Sau khi Drawer đóng (Lưu thành công), list reload có giữ nguyên filter conditions và sort order đang áp dụng không, hay reset về mặc định (sort by `code ASC`, không filter)? |
| G-016 | Integration | Detail design delete §11 Note #4 mô tả graceful degradation khi **FK table chưa migrate** (catch `DataAccessException`, skip check). Tuy nhiên, không phân biệt giữa "table not found" và các `DataAccessException` khác như **connection pool exhausted**, **network timeout**. | Medium | Graceful degradation "bỏ qua check FK khi `DataAccessException`" có nguy cơ bỏ sót lỗi DB thật sự (timeout, pool exhausted). Cần xác nhận: trong production, liệu `InvalidDataAccessResourceUsageException` (table không tồn tại) có được handle riêng để không che khuất lỗi thật không? |
| G-022 | Validation | **`code` cho phép dấu gạch nối (`-`)** trong detail design create §5: `@Pattern(regexp="^[a-zA-Z0-9\\-]+$")`. Spec M-02-cud ghi: "**半角英数字（0–9, A–Z, a–z half-width)**" — không đề cập hyphen. | Medium | Dấu gạch nối (`-`) có được phép trong `code` (エリアID) không? Nếu có, cần cập nhật spec M-02-cud để phản ánh đúng tập ký tự cho phép. |
| G-023 | Edge Case | **Mâu thuẫn nội bộ trong detail design list** §8.1 Testing Scenarios: test case G-01 expected ghi `size: 50` nhưng parameter default trong §5 là `size: 30`. | Medium | Default page size là **30** hay **50**? Cần sửa test scenario G-01 trong detail design để tránh dev và tester dùng sai con số khi viết test. (Liên quan đến GAP đã ghi nhận trong spec M-02 về 30 vs 50.) |
| G-025 | Business Logic | **Unique constraint trên `(client_id, name)`** (`uq_m_area_client_name`) có trong DB schema của detail design nhưng **hoàn toàn không được đề cập trong spec M-02-cud**. Spec chỉ nêu `(client_id, area_code)` là unique. Nếu user tạo 2 area cùng tên trong cùng client → 409 PSMS-AREA-002, nhưng UI spec không có validation message cho case này. | Medium | Tên khu vực (`name`) có bắt buộc unique trong phạm vi cùng một khách hàng không? Nếu có, cần bổ sung validation rule và error message vào spec M-02-cud (hiện tại không có). |
| G-026 | Business Logic | Spec M-02-cud §5: "Khi Lưu, server kiểm tra phiên bản（`updated_at`）. Xung đột → **MSG-020**". Detail design update §9: "Implementation hiện tại **chưa** implement `@Version` — dùng last-write-wins." Optimistic lock là **yêu cầu của spec nhưng chưa được implement**. | Medium | Optimistic lock cho thao tác Sửa có bắt buộc trong sprint hiện tại không? Nếu có, cần add `@Version` vào entity và FE gửi `updatedAt` trong PUT body. Nếu defer, cần ghi rõ trong spec là chức năng này chưa active để tester không tạo test case cho MSG-020. |
| G-028 | Data | **`centerNames` (Tên trung tâm) xuất hiện trong API response** nhưng **không được mô tả là cột trong bảng danh sách** của spec M-02 §3. Spec chỉ liệt kê cột: ID khu vực, Tên khu vực, Tên khách hàng, Sửa. Detail design `response.centerNames` là `List<String>` từ `m_delivery_centers`. | Medium | Có cột **Tên trung tâm** trong bảng danh sách M-02 không? Nếu có, spec M-02 §3 thiếu cột này cần bổ sung. Nếu không, `centerNames` trong API response được FE dùng để làm gì (tooltip, sidebar)? |
| G-017 | Validation | Detail design không đề cập **thời điểm trigger validation** cho các field trong Drawer: max 100 ký tự cho `name`, max 20 ký tự cho `code`. Không rõ FE block input khi gõ quá giới hạn hay chỉ hiện inline error khi submit. | Low | Validation độ dài max (`code` 20 chars, `name` 100 chars) trigger ở FE khi nào — real-time khi gõ (block character) hay inline error sau khi Submit? |
| G-019 | Non-functional | Spec M-02 §5: mục tiêu hiệu năng "tải một trang danh sách **dưới 3 giây**" nhưng "quy mô do PM xác định". Detail design §2 Overview nêu default 30 rows/page nhưng không đề cập data volume mục tiêu. | Low | Mục tiêu "dưới 3 giây" áp dụng tại quy mô dữ liệu nào (bao nhiêu bản ghi trong `m_areas`)? Cần con số cụ thể để thiết kế test case performance. |
| G-020 | Non-functional | Detail design create §11 Note #5 và delete §11 Note #8: "**common-document audit log framework chưa có đặc tả**". Hiện dùng cột `created_by`, `updated_by`, `deleted_by`, `deleted_at` trên row làm audit. Không có bảng audit riêng. | Low | Dự án có yêu cầu bảng audit log riêng (ngoài audit columns trong `m_areas`) cho M-02 không? Nếu có, cần ghi rõ schema và trigger condition trong spec. |

---

## II. Gaps Đã Giải Đáp (Resolved)

> Các gap này đã có câu trả lời từ detail design. Giữ lại để tham chiếu.

| Gap ID | Category | Gap Description | Câu trả lời (Nguồn) |
|---|---|---|---|
| G-001 | UI/UX | Cột **ステータス** (有効 / 無効) hiển thị trong UI nhưng không có trong spec M-02. | Confirmed: `m_areas.status VARCHAR(20)` = `'ACTIVE'`/`'INACTIVE'`. 有効 = ACTIVE, 無効 = INACTIVE. List hiển thị cả 2 trạng thái (không filter theo status, chỉ ẩn soft-deleted). FE dùng `status` field để styling. *(detail-design_list §3 DB Schema, §5 Business Logic step 3, §5 Response Fields)* |
| G-002 | Data | Không có DB field `status` trong spec M-02-cud. | Confirmed: `m_areas.status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'`. Luôn là `'ACTIVE'` khi tạo mới. Không thay đổi qua PUT (update). Chưa có UI để thay đổi status. *(detail-design_list §3, detail-design create §3, detail-design_update §2)* |
| G-007 | Business Logic | Mâu thuẫn page size default 50 (spec JP) vs 30 (common spec). | **Resolved: default = 30.** API `size` param default = `30`, giữ cố định theo basic-design. GAP-002 trong detail design đánh dấu mở nếu cần đổi trong tương lai. *(detail-design_list §5 Query Parameters)* |
| G-008 | Validation | Filter `areaCode` exact match — có phân biệt hoa/thường không? | **Case-sensitive.** API param description: "case-sensitive". Nhập "abc" sẽ KHÔNG trả về area có `code = "ABC"`. *(detail-design_list §5 areaCode param description)* |
| G-012 | Edge Case | Truy cập deep link `/area?drawer=area&mode=edit&id=999` khi ID không tồn tại. | Trả về **404 PSMS-AREA-001** "エリアが見つかりません". FE nên đóng Drawer và refresh list. *(detail-design_update §5.1 Error Cases)* |
| G-014 | Validation | Độ dài tối thiểu của `code` (area_code) là bao nhiêu? | Tối thiểu **1 ký tự** (do `@NotBlank` — ít nhất 1 ký tự non-whitespace). Không có `@Size(min)` riêng. *(detail-design create §5.1 AreaCreateRequest)* |
| G-015 | Data | "Ký tự cho phép theo Common" cho `name` (Tên khu vực) là gì? | Không áp dụng regex đặc biệt cho `name`. Chỉ giới hạn độ dài. Cho phép full-width/half-width, ký tự đặc biệt, kanji, kana. *(detail-design create §11 Note #8: "GAP-101 — áp dụng đề xuất: không áp regex đặc biệt cho name")* — **Lưu ý: max 100 ký tự khi Update vs max 255 ký tự khi Create → xem G-021 (còn mở).** |
| G-018 | Edge Case | Có hỗ trợ multi-column sort không? | **Không.** API chỉ nhận một cặp `{field},{asc\|desc}`. Field ngoài whitelist `{code, clientName, centerName}` → 400. *(detail-design_list §5 Sort rules, Error Cases PSMS-AREA-001)* |
| G-021 | Data | `name` max length: Create dùng 255, Update dùng 100 — mâu thuẫn với spec. | ✅ **Confirmed 2026-04-29 (BA/Dev)**: Max `name` = **100 ký tự** cho cả Create lẫn Update. `@Size(max=255)` trong detail-design create là **lỗi cần fix**. |
| G-024 | Validation | `code` unique check dùng `IgnoreCase` — có phân biệt hoa/thường không? | ✅ **Confirmed 2026-04-29 (BA/Dev)**: `code` **có phân biệt hoa/thường** (case-sensitive). "A1" và "a1" là hai `code` khác nhau trong cùng client. `IgnoreCase` trong implementation là **lỗi cần fix**. |
| G-027 | Functional | `エリア名` (name) không có trong sort whitelist API — sort=name,asc → 400. | ✅ **Confirmed 2026-04-29 (BA/Dev)**: **Tất cả cột đều có sort** (kể cả `name`). Cần bổ sung `name` vào sort whitelist API. Đây là **lỗi thiếu cần fix**. |

