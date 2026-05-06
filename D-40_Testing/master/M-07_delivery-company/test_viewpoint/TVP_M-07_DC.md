# TVP_M-07_DC.md

| Mục | Nội dung |
|---|---|
| **File** | TVP_M-07_DC.md |
| **Màn hình** | M-07 / M-07-cud — 運送業者管理（Quản lý công ty vận chuyển） |
| **Tài liệu tham chiếu** | Requirements\M-07\M-07_運送業者管理（一覧）_VN.md · Requirements\M-07\M-07-cud_運送会社（追加・編集・削除）_VN.md · Requirements\D-00_Message definition.md · Requirements\共通仕様_vi.md · Test Q&A\Q&A_M-07_DeliveryCompany_ver1.md · Test Strategy\TS_M-07_DeliveryCompany_ver1.md |
| **UI Mock** | List: https://www.figma.com/design/Vc34OD1eP9RrkQR54if1Ua/1834-design-figma?node-id=245-7627 · CUD Drawer: https://www.figma.com/design/Vc34OD1eP9RrkQR54if1Ua/1834-design-figma?node-id=245-5199 |
| **Tổng số TVP** | 112 |

---

> **Ghi chú GAP đang chờ làm rõ**
> - **[⚠️ Need Confirm G-002]** — `carrier_code` không có field trên UI, không rõ sinh tự động hay nhập tay
> - **[⚠️ Need Confirm G-003]** — Ràng buộc xóa điều kiện 2 bị cắt đứt; tên bảng/field FK chưa rõ
> - **[⚠️ Need Confirm G-004]** — MSG-022 dùng cho 2 ngữ cảnh (connection error vs xóa ràng buộc) — cần xác nhận message hiển thị cho user
> - **[⚠️ Need Confirm G-007]** — `name` unique constraint chưa rõ
> - **[⚠️ Need Confirm G-008]** — `waybill_code` unique constraint chưa rõ
> - **[⚠️ Need Confirm G-010]** — `waybill_code` min-length chưa định nghĩa
> - **[⚠️ Need Confirm G-011]** — Timing validation (on-blur / on-submit) chưa rõ
> - **[⚠️ Need Confirm G-013]** — Nội dung hộp thoại xác nhận xóa chưa finalize
> - **[⚠️ Need Confirm G-014]** — Toast message khi xóa mềm thành công chưa định nghĩa
> - **[⚠️ Need Confirm G-016]** — Hành vi khi bản ghi bị xóa mềm bởi user khác trong khi Drawer đang mở
> - **[⚠️ Need Confirm G-018]** — Click outside Drawer / Escape có đóng Drawer không?
>
> **GAP đã confirmed:**
> - **G-005 ✓** — Không có sort; thứ tự hiển thị theo M-07 spec (không phải common ID-ascending sort)
> - **G-006 ✓** — `waybill_code`: Create = optional (null cho phép); Edit = bắt buộc nhập

---

## Bảng TVP

| ID TVP | Sub-section | Feature | TVP Description | Test Type | Priority | Method test |
|--------|-------------|---------|-----------------|-----------|----------|-------------|
| **SECTION 1 — M-07 DANH SÁCH（一覧）** |
| TVP-001 | UI | Page title | Verify tiêu đề màn hình hiển thị đúng nhãn JP（「運送業者管理」hoặc tương đương theo Figma node-id=245-7627）; breadcrumb/header đúng hierarchy | UI | High | Manual |
| TVP-002 | UI | Column headers | Verify labels 3 cột: 「ID」「会社名」「送り状コード」; cột thao tác hiển thị nút 「編集」trên mỗi dòng; không có cột nào khác ngoài spec | UI | High | Manual |
| TVP-003 | UI | Toolbar buttons | Toolbar có nút 「Thêm」; không có ô tìm kiếm hoặc bộ lọc（絞り込みなし）trên màn hình | UI | High | Manual |
| TVP-004 | UI | No sort on columns | Các cột ID, 会社名, 送り状コード không có icon sort; click vào header cột không kích hoạt sort — G-005 confirmed | UI | Medium | Manual |
| TVP-005 | Functional | Initial load | Vào `/delivery`: trang 1 được tải; hiển thị tối đa 30 bản ghi; chỉ bản ghi có `deleted_at IS NULL`; không có sort/filter áp dụng | Functional | Critical | E2E |
| TVP-006 | Functional | Open Add Drawer | Click nút 「Thêm」: Drawer trượt từ cạnh màn hình; URL thay đổi thành `/delivery?drawer=deliveryCompany&mode=new`; list phía sau vẫn hiển thị | Functional | Critical | E2E |
| TVP-007 | Functional | Open Edit Drawer | Click 「編集」trên một dòng: Drawer mở ở chế độ edit với dữ liệu của dòng đó; URL = `/delivery?drawer=deliveryCompany&mode=edit&id={id}` | Functional | Critical | E2E |
| TVP-008 | Functional | Empty state | Khi không có công ty vận chuyển nào (`m_delivery_companies` WHERE `deleted_at IS NULL` = 0 bản ghi): hiển thị empty state message với hướng dẫn tạo mới bản ghi（per common spec 4）— [⚠️ Need Confirm G-022: text cụ thể là gì?] | Functional | Medium | Manual |
| TVP-009 | Pagination | Page size default | Bảng danh sách hiển thị mặc định 30 bản ghi/trang khi tải lần đầu | Functional | High | E2E |
| TVP-010 | Pagination | Page size options | Selector cho phép đổi page size: 15 / 30 / 50; khi đổi size → list reload với số bản ghi tương ứng, về trang 1 | Functional | Medium | E2E |
| TVP-011 | Pagination | Widget visibility | Pagination widget ẩn khi tổng bản ghi ≤ page size（tức chỉ 1 trang）; widget hiển thị từ khi tổng bản ghi > page size | Functional | Medium | E2E |
| TVP-012 | Pagination | Navigation controls | Điều hướng Next / Prev / First / Last hoạt động đúng; số trang hiện tại highlight; trang cuối hiển thị đúng số bản ghi còn lại（không thiếu）| Functional | Medium | E2E |
| TVP-013 | Pagination | Ellipsis jump | "..." bên trái: click → nhảy đến trang cuối của chunk trước（ví dụ trang 10）; "..." bên phải: click → nhảy đến trang đầu chunk kế（ví dụ trang 21）— per common spec 5.2 | Functional | Low | Manual |
| TVP-014 | Pagination | No sort preserved | Khi chuyển trang, danh sách không áp dụng sort — thứ tự hiển thị theo M-07 spec, không thay đổi theo common sort rule（G-005 confirmed） | Data | Medium | E2E |
| TVP-015 | Permission | Manager access | Tài khoản role 管理（Quản lý）vào `/delivery`: màn hình hiển thị đầy đủ; nút 「Thêm」và 「編集」active | Functional | Critical | E2E |
| TVP-016 | Permission | Non-manager denied | Tài khoản role khác（không phải 管理）vào `/delivery`: bị chặn / redirect; màn hình hoặc dữ liệu không hiển thị | Functional | Critical | E2E |
| TVP-017 | Permission | API auth | Non-manager gọi trực tiếp GET/POST/DELETE `/delivery` API → 403 Forbidden; không trả dữ liệu | Functional | High | API |
| TVP-018 | Functional | Deleted records excluded | Bản ghi đã xóa mềm（`deleted_at IS NOT NULL`）không xuất hiện trong danh sách; count API = số bản ghi active only | Data | High | E2E |
| TVP-019 | Functional | Record count accuracy | Tổng số bản ghi hiển thị（pagination info）khớp với `SELECT COUNT(*) FROM m_delivery_companies WHERE deleted_at IS NULL` | Data | Medium | API |
| TVP-020 | UI | Density Standard | Màn hình hiển thị ở mật độ Standard（không phải Dense hoặc Compact）— đồng bộ với spec M-07 | UI | Low | Manual |
| **SECTION 2 — THÊM MỚI（新規登録）** |
| TVP-021 | UI | Drawer title Create | Tiêu đề Drawer ở chế độ Thêm mới hiển thị: 「運送会社新規登録」| UI | High | Manual |
| TVP-022 | UI | Field labels Create | Labels form Create: 「会社名」có dấu (*) required; 「送り状コード」KHÔNG có (*) required（optional trong create per G-006）; kiểu input là text | UI | High | Manual |
| TVP-023 | UI | Buttons Create | Footer Drawer: có nút 「保存」và 「キャンセル」; nút 「削除」KHÔNG hiển thị trong chế độ Create | UI | High | Manual |
| TVP-024 | UI | Drawer slide behavior | Drawer trượt từ cạnh màn hình; danh sách M-07 ở phía sau vẫn render; URL thay đổi không reload toàn trang | UI | Medium | Manual |
| TVP-025 | Validation | [Create] 会社名 — required | Để trống 会社名 → click 「保存」: inline error hiển thị dưới field:「{会社名}を入力してください」(MSG-001); Drawer không đóng; không có API call | Validation | Critical | E2E |
| TVP-026 | Validation | [Create] 会社名 — spaces-only | Nhập chỉ khoảng trắng vào 会社名 → click 「保存」: sau trim giá trị = rỗng → inline error MSG-001; không tạo record | Validation | Critical | E2E |
| TVP-027 | Validation | [Create] 会社名 — max 100 accepted | Nhập đúng 100 ký tự vào 会社名 → 「保存」: chấp nhận; không có lỗi; record được tạo | Edge Case | High | E2E |
| TVP-028 | Validation | [Create] 会社名 — 101 chars rejected | Nhập 101 ký tự vào 会社名: input bị chặn ở 100 ký tự（maxlength）HOẶC inline error:「100文字以内で入力してください」(MSG-009) | Edge Case | High | E2E |
| TVP-029 | Validation | [Create] 会社名 — special chars allowed | Nhập tên có ký tự đặc biệt cho phép per common:「ヤマト & Co.（JP）－運輸」（space, `.`, `,`, `-`, `ー`, `()`, `（）`, `&`, `/`, `・`）→ chấp nhận; lưu đúng | Validation | High | E2E |
| TVP-030 | Validation | [Create] 会社名 — forbidden chars | Nhập chars bị cấm per common（`<`, `>`, `\`, tab `\t`, newline `\n`）→ bị reject / inline error; không lưu được | Validation | High | E2E |
| TVP-031 | Validation | [Create] 会社名 — SQL injection | Nhập `' OR 1=1--` vào 会社名 → sanitized hoặc rejected; không crash; không có DB error; kiểm tra response API | Validation | High | E2E |
| TVP-032 | Validation | [Create] 会社名 — XSS | Nhập `<script>alert(1)</script>` vào 会社名 → sanitized; text không được execute trong browser khi hiển thị lại | Validation | High | E2E |
| TVP-033 | Validation | [Create] 会社名 — trim | Nhập「　ヤマト運輸　」có khoảng trắng/full-width space đầu/cuối → sau khi 保存, DB lưu giá trị đã trim（「ヤマト運輸」）| Edge Case | Medium | E2E |
| TVP-034 | Validation | [Create] 送り状コード — blank accepted | Để trống 送り状コード trong Create mode → click 「保存」: chấp nhận（optional per G-006）; record lưu với `waybill_code = NULL` | Validation | Critical | E2E |
| TVP-035 | Validation | [Create] 送り状コード — max 64 accepted | Nhập đúng 64 chữ số half-width (0-9) vào 送り状コード → chấp nhận; không có lỗi | Edge Case | High | E2E |
| TVP-036 | Validation | [Create] 送り状コード — 65 chars rejected | Nhập 65 ký tự vào 送り状コード: input bị chặn ở 64 ký tự（maxlength）HOẶC inline error:「64文字以内で入力してください」(MSG-009) | Edge Case | High | E2E |
| TVP-037 | Validation | [Create] 送り状コード — non-digit rejected | Nhập chữ cái hoặc ký tự không phải số（vd: "ABC-123", "abc"）vào 送り状コード → inline error:「半角数字で入力してください」(MSG-011) | Validation | Critical | E2E |
| TVP-038 | Validation | [Create] 送り状コード — full-width digits rejected | Nhập full-width digits「１２３」vào 送り状コード → inline error MSG-011（yêu cầu half-width digits only） | Validation | High | E2E |
| TVP-039 | Validation | [Create] 送り状コード — min-length | Nhập "0"（1 chữ số）vào 送り状コード → [⚠️ Need Confirm G-010: 1 chữ số có hợp lệ không? min-length chưa định nghĩa] | Edge Case | Medium | Manual |
| TVP-040 | Validation | [Create] 送り状コード — trim | Nhập "  000999  " với khoảng trắng đầu/cuối → [⚠️ Need Confirm G-011: trim xảy ra on-blur hay on-submit?]; sau save DB lưu "000999"（trimmed） | Edge Case | Medium | E2E |
| TVP-041 | Validation | [Create] 送り状コード — SQL injection | Nhập `1; DROP TABLE--` vào 送り状コード → bị reject bởi digit-only format rule（MSG-011）; không crash; không execute DB command | Validation | High | E2E |
| TVP-042 | Validation | [Create] 送り状コード — XSS | Nhập `<script>alert(1)</script>` vào 送り状コード → bị reject bởi digit-only format rule; không execute trong browser | Validation | High | E2E |
| TVP-043 | Submit | [Create] success | Nhập valid 会社名（≤100 chars）+ 送り状コード hợp lệ（hoặc để trống）→ click 「保存」: toast success MSG-031 hiển thị; Drawer đóng; list M-07 refresh hiển thị record mới | Functional | Critical | E2E |
| TVP-044 | Submit | [Create] carrier_code duplicate | [⚠️ Need Confirm G-002] Nếu auto-generated `carrier_code` trùng với bản ghi active → MSG-032 hiển thị; record không được tạo; Drawer vẫn mở | Integration | High | Manual |
| TVP-045 | Submit | [Create] double-click prevention | Click 「保存」hai lần nhanh liên tiếp → chỉ 1 API call được gửi; chỉ 1 record được tạo（nút disabled hoặc request deduplicated） | User Behavior | High | E2E |
| TVP-046 | Edge Case | [Create] Cancel with unsaved data | Nhập dữ liệu vào form → click 「キャンセル」: Drawer đóng ngay lập tức; không có cảnh báo unsaved changes; dữ liệu vừa nhập bị discard（per spec — intentional） | User Behavior | Medium | Manual |
| TVP-047 | Edge Case | [Create] Click outside / Escape | Click vào overlay ngoài Drawer hoặc nhấn phím Escape → [⚠️ Need Confirm G-018: Drawer có đóng không? Nếu có, behavior giống キャンセル?] | Edge Case | Low | Manual |
| **SECTION 3 — CHỈNH SỬA（編集）** |
| TVP-048 | UI | Drawer title Edit | Tiêu đề Drawer ở chế độ Edit hiển thị: 「運送会社編集」| UI | High | Manual |
| TVP-049 | UI | Field labels Edit | Labels form Edit: 「会社名」có (*) required; 「送り状コード」có (*) required（required trong Edit per G-006）; [⚠️ Need Confirm: Figma node-id=245-5199 có hiển thị (*) trên 送り状コード không?] | UI | High | Manual |
| TVP-050 | UI | Delete button visible | Nút 「削除」màu đỏ（destructive）hiển thị trong Edit mode; nằm ở vị trí tách biệt so với 保存/キャンセル — [⚠️ Need Confirm G-021: vị trí chính xác trong Drawer?] | UI | High | Manual |
| TVP-051 | UI | Pre-load data correct | Mở Edit Drawer cho record X: 会社名 field hiển thị `name` từ DB; 送り状コード field hiển thị `waybill_code` từ DB; không bị format/transform sai | Data | Critical | E2E |
| TVP-052 | UI | Pre-load null waybill_code | Record có `waybill_code = NULL` trong DB（dữ liệu cũ）→ mở Edit Drawer: field 送り状コード hiển thị rỗng; field vẫn là required（phải nhập trước khi Lưu） | Edge Case | High | E2E |
| TVP-053 | Validation | [Edit] 会社名 — required | Xóa trắng 会社名 trong Edit mode → click 「保存」: inline error MSG-001; Drawer không đóng; record không được update | Validation | Critical | E2E |
| TVP-054 | Validation | [Edit] 会社名 — spaces-only | Nhập chỉ khoảng trắng vào 会社名 trong Edit mode → click 「保存」: sau trim rỗng → MSG-001 | Validation | Critical | E2E |
| TVP-055 | Validation | [Edit] 会社名 — max 100 accepted | Nhập đúng 100 ký tự vào 会社名 trong Edit mode → chấp nhận; record updated | Edge Case | High | E2E |
| TVP-056 | Validation | [Edit] 会社名 — 101 chars rejected | Nhập 101 ký tự vào 会社名 trong Edit mode: bị chặn ở 100 ký tự HOẶC MSG-009（100文字以内） | Edge Case | High | E2E |
| TVP-057 | Validation | [Edit] 会社名 — special chars allowed | Nhập tên có ký tự đặc biệt allowed per common trong Edit mode → chấp nhận; lưu đúng | Validation | High | E2E |
| TVP-058 | Validation | [Edit] 会社名 — forbidden chars | Nhập chars bị cấm（`<`, `>`, `\`, newline）trong Edit mode → bị reject / inline error | Validation | High | E2E |
| TVP-059 | Validation | [Edit] 会社名 — SQL injection | Nhập `' OR 1=1--` vào 会社名（Edit mode）→ sanitized/rejected; không crash; DB không bị ảnh hưởng | Validation | High | E2E |
| TVP-060 | Validation | [Edit] 会社名 — XSS | Nhập `<script>alert(1)</script>` vào 会社名（Edit mode）→ sanitized; không execute trong browser | Validation | High | E2E |
| TVP-061 | Validation | [Edit] 会社名 — trim | Nhập tên có khoảng trắng đầu/cuối（Edit mode）→ sau save, DB lưu giá trị đã trim | Edge Case | Medium | E2E |
| TVP-062 | Validation | [Edit] 送り状コード — required | Xóa trắng 送り状コード trong Edit mode → click 「保存」: inline error MSG-001（khác Create mode: Edit = required per G-006）; không update | Validation | Critical | E2E |
| TVP-063 | Validation | [Edit] 送り状コード — spaces-only | Nhập chỉ khoảng trắng vào 送り状コード（Edit mode）→ sau trim rỗng → MSG-001 | Validation | Critical | E2E |
| TVP-064 | Validation | [Edit] 送り状コード — max 64 accepted | Nhập đúng 64 chữ số half-width vào 送り状コード（Edit mode）→ chấp nhận; record updated | Edge Case | High | E2E |
| TVP-065 | Validation | [Edit] 送り状コード — 65 chars rejected | Nhập 65 ký tự vào 送り状コード（Edit mode）: bị chặn ở 64 HOẶC MSG-009（64文字以内） | Edge Case | High | E2E |
| TVP-066 | Validation | [Edit] 送り状コード — non-digit rejected | Nhập chữ cái/ký tự không phải số vào 送り状コード（Edit mode）→ MSG-011（半角数字で入力してください） | Validation | Critical | E2E |
| TVP-067 | Validation | [Edit] 送り状コード — full-width digits rejected | Nhập「１２３」full-width digits（Edit mode）→ MSG-011 | Validation | High | E2E |
| TVP-068 | Validation | [Edit] 送り状コード — min-length | Nhập "0"（1 chữ số）trong Edit mode → [⚠️ Need Confirm G-010: min-length chưa định nghĩa] | Edge Case | Medium | Manual |
| TVP-069 | Validation | [Edit] 送り状コード — trim | Nhập "  000999  " với spaces（Edit mode）→ [⚠️ Need Confirm G-011: timing trim]; sau save DB lưu "000999"（trimmed） | Edge Case | Medium | E2E |
| TVP-070 | Validation | [Edit] 送り状コード — SQL injection | Nhập injection pattern vào 送り状コード（Edit mode）→ bị reject bởi digit-only rule（MSG-011）; không crash | Validation | High | E2E |
| TVP-071 | Validation | [Edit] 送り状コード — XSS | Nhập XSS pattern vào 送り状コード（Edit mode）→ bị reject bởi digit-only rule; không execute | Validation | High | E2E |
| TVP-072 | Submit | [Edit] success | Modify 会社名 và/hoặc 送り状コード hợp lệ → click 「保存」: toast MSG-031; Drawer đóng; list refresh; row tương ứng hiển thị giá trị đã cập nhật | Functional | Critical | E2E |
| TVP-073 | Submit | [Edit] optimistic lock conflict | User A và User B cùng mở Edit Drawer cho cùng 1 record; User A lưu trước; User B nhấn 「保存」sau → MSG-033 toast hiển thị cho User B; data của User B không overwrite DB; User B cần reload | Integration | High | Manual |
| TVP-074 | Submit | [Edit] carrier_code conflict | [⚠️ Need Confirm G-002 / ASSUMPTION] Nếu `carrier_code` auto-generated conflict khi update → MSG-032 hiển thị; record không được update | Integration | Medium | Manual |
| TVP-075 | Submit | [Edit] double-click prevention | Click 「保存」hai lần nhanh（Edit mode）→ chỉ 1 API PUT/PATCH call; record updated 1 lần | User Behavior | High | E2E |
| TVP-076 | Edge Case | [Edit] record deleted by concurrent user | User khác soft-delete record này trong khi Edit Drawer đang mở; current user nhấn 「保存」→ [⚠️ Need Confirm G-016: server trả response gì? Message hiển thị là gì?] | Edge Case | Medium | Manual |
| TVP-077 | Edge Case | [Edit] Cancel after modification | Sửa dữ liệu trong Edit Drawer → click 「キャンセル」: Drawer đóng; không cảnh báo; DB giữ nguyên giá trị cũ（per spec — intentional） | User Behavior | Medium | Manual |
| **SECTION 4 — XÓA MỀM（削除）** |
| TVP-078 | UI | Delete button in Edit only | Nút 「削除」chỉ hiển thị trong Edit mode; KHÔNG hiển thị trong Create mode; style đỏ/destructive rõ ràng | UI | High | Manual |
| TVP-079 | UI | Confirmation dialog content | Click 「削除」trong Edit mode → hộp thoại xác nhận xuất hiện; nội dung gồm: tiêu đề dialog, message cảnh báo xóa mềm, nút 「キャンセル」và nút 「削除」— [⚠️ Need Confirm G-013: text JP chính thức và message ID từ D-00 là gì?] | UI | High | Manual |
| TVP-080 | Functional | Cancel deletion | Trong dialog xác nhận → click 「キャンセル」: dialog đóng; Drawer vẫn mở ở Edit mode; record KHÔNG bị xóa; `deleted_at` không thay đổi | Functional | High | E2E |
| TVP-081 | Functional | Delete — Client default constraint | Setup: công ty đang là default carrier của 1 Client → click 「削除」→ xác nhận → MSG-022（「関連データが存在するため削除できません。」）hiển thị; `deleted_at` không được set; record vẫn trong list [⚠️ Need Confirm G-004: có phải dùng MSG-022 không?] | Functional | Critical | E2E |
| TVP-082 | Functional | Delete — shipment constraint | Setup: công ty đang được gán cho shipment/vận đơn active → click 「削除」→ xác nhận → MSG-022 hiển thị; xóa mềm không được thực hiện — [⚠️ Need Confirm G-003: tên bảng/field FK cụ thể để setup test data?] | Functional | Critical | Manual |
| TVP-083 | Functional | Delete — success | Setup: công ty không có tham chiếu active → click 「削除」→ xác nhận → xóa mềm thành công: `deleted_at` được set trong DB; Drawer đóng; list refresh; công ty không còn xuất hiện trong danh sách | Functional | Critical | E2E |
| TVP-084 | Functional | Delete success toast | Sau xóa mềm thành công → [⚠️ Need Confirm G-014: có hiển thị toast không? nếu có, message ID và text là gì?] | Functional | High | Manual |
| TVP-085 | Functional | Non-manager cannot delete | Gọi DELETE API trực tiếp với token non-manager role → 403 Forbidden; `deleted_at` không bị set | Functional | Critical | API |
| TVP-086 | Edge Case | Re-register after soft delete | Sau khi soft-delete công ty A, tạo mới công ty B với cùng `carrier_code` → được phép（unique check chỉ trên `deleted_at IS NULL`）| Edge Case | Medium | E2E |
| TVP-087 | Edge Case | Deleted company not in list | Sau soft delete: public GET /delivery list không trả về bản ghi đã xóa; pagination count giảm 1 | Data | High | E2E |
| TVP-088 | Edge Case | DB verify soft delete | Sau soft delete: query DB `SELECT deleted_at FROM m_delivery_companies WHERE id = X` → `deleted_at IS NOT NULL`; `deleted_by` set nếu schema hỗ trợ（per audit spec） | Data | High | Manual |
| **SECTION 5 — DEEP LINK（URL PARAMS）** |
| TVP-089 | Deep Link | Create mode deep link | Truy cập `/delivery?drawer=deliveryCompany&mode=new`: Drawer mở ở Create mode（form rỗng）; danh sách M-07 render phía sau | Functional | High | E2E |
| TVP-090 | Deep Link | Edit mode deep link | Truy cập `/delivery?drawer=deliveryCompany&mode=edit&id={valid_id}`: Drawer mở ở Edit mode; form hiển thị đúng dữ liệu của record có `id` tương ứng | Functional | High | E2E |
| TVP-091 | Deep Link | Missing id in edit mode | Truy cập `/delivery?drawer=deliveryCompany&mode=edit`（thiếu `id`）: Drawer KHÔNG mở; chỉ hiển thị danh sách; toast error per D-00 | Functional | High | E2E |
| TVP-092 | Deep Link | Invalid drawer param | Truy cập `/delivery?drawer=invalidName&mode=new`: Drawer KHÔNG mở; chỉ hiển thị danh sách; toast error per D-00 | Functional | Medium | E2E |
| TVP-093 | Deep Link | Non-existent record id | Truy cập `/delivery?drawer=deliveryCompany&mode=edit&id=99999`（id không tồn tại）: Drawer KHÔNG mở; list hiển thị; toast error per D-00 | Functional | High | E2E |
| TVP-094 | Deep Link | URL cleanup on close | Đóng Drawer（Save / Cancel / X）→ URL reverts về `/delivery`; các query params `drawer`, `mode`, `id` bị loại bỏ; sử dụng replace（không push history để tránh back-navigation rác） | Functional | Medium | E2E |
| **SECTION 6 — SYSTEM BEHAVIOR** |
| TVP-095 | System | Network error — list load | Lỗi network khi tải danh sách → modal「接続エラー」per common spec 4.1 xuất hiện: tiêu đề「接続エラー」, nội dung theo MSG-022（connection）, nút「再試行」; click「再試行」→ retry API call | Functional | High | E2E |
| TVP-096 | System | Network error — Save | Lỗi network khi click 「保存」→ toast đỏ hiển thị error per D-00; Drawer vẫn mở; dữ liệu KHÔNG được lưu; form data vẫn còn trong Drawer | Functional | High | E2E |
| TVP-097 | System | Loading spinner | Trong thời gian API call（tải danh sách, lưu, xóa）→ Flowbite Spinner hiển thị; UI không bị stuck; các button ở trạng thái disabled trong loading | Functional | Medium | Manual |
| TVP-098 | System | List refresh after Create | Sau Create thành công: list M-07 auto-refresh; record mới xuất hiện trong danh sách（ở đúng vị trí theo thứ tự M-07 spec） | Functional | High | E2E |
| TVP-099 | System | List refresh after Edit | Sau Edit thành công: list M-07 auto-refresh; row tương ứng hiển thị giá trị 会社名 và 送り状コード mới | Functional | High | E2E |
| TVP-100 | System | List refresh after Delete | Sau soft delete thành công: list M-07 auto-refresh; record đã xóa không còn trong list; pagination count giảm đúng | Functional | High | E2E |
| TVP-101 | System | Unauthenticated access | Vào `/delivery` khi chưa login（session hết hạn）→ redirect về màn hình login（L-01）; sau login thành công → redirect lại `/delivery`（per common spec 5.8） | Functional | High | E2E |
| TVP-102 | System | Message ID prefix | Error/warning message trên màn hình（ngoài popup）được hiển thị kèm message ID ở đầu（per common spec 5.7）— ví dụ:「[MSG-022] 関連データが存在するため削除できません。」 | Functional | Medium | Manual |
| **SECTION 7 — ĐỒNG THỜI（楽観的ロック / CONCURRENCY）** |
| TVP-103 | Concurrency | Optimistic lock — edit conflict | User A mở Edit Drawer cho công ty X; User B cũng mở Edit Drawer cho công ty X; User A click 「保存」trước（success）; sau đó User B click 「保存」→ MSG-033 toast（「他のユーザーが更新したため保存できません。画面を再読み込みしてから再度お試しください。」）; data User B KHÔNG overwrite DB | Functional | High | Manual |
| TVP-104 | Concurrency | Double submit prevention | Click 「保存」trong khi request đang pending（network slow）→ nút 保存 disabled hoặc request deduplicated; chỉ 1 API call được gửi; không tạo duplicate record hoặc update 2 lần | User Behavior | High | E2E |
| **SECTION 8 — DỮ LIỆU & BẢO MẬT（DATA INTEGRITY & SECURITY）** |
| TVP-105 | Data | Create round-trip | Sau Create: query DB `SELECT name, waybill_code FROM m_delivery_companies WHERE id = {new_id}` → giá trị khớp chính xác với giá trị đã nhập（sau trim）; không bị format/transform sai | Data | High | Manual |
| TVP-106 | Data | Edit round-trip | Sau Edit: query DB → `name` và `waybill_code` updated đúng; `updated_at` timestamp đã thay đổi; không có field nào bị sót hoặc bị format sai | Data | High | Manual |
| TVP-107 | Data | Soft delete round-trip | Sau soft delete: query DB `SELECT deleted_at FROM m_delivery_companies WHERE id = X` → `deleted_at IS NOT NULL`; record không trả về trong GET list API（deleted_at IS NULL filter） | Data | High | Manual |
| TVP-108 | Data | DB null → UI blank | Record có `waybill_code = NULL` trong DB → cột 「送り状コード」trong danh sách M-07 hiển thị blank（không hiển thị text "null" hay "N/A"）per common spec 5.12 | Data | Medium | E2E |
| TVP-109 | Data | name uniqueness | [⚠️ Need Confirm G-007] Tạo 2 công ty có cùng `name` → nếu có unique constraint: MSG-010（「この{会社名}は既に登録されています」）; nếu không: cả 2 record được tạo（không block） | Data | Medium | Manual |
| TVP-110 | Data | waybill_code uniqueness | [⚠️ Need Confirm G-008] Tạo 2 công ty có cùng `waybill_code` → nếu có unique constraint: error message（MSG-032 hay MSG-010?）; nếu không: cả 2 record được tạo — nguy cơ lỗi API phát hành vận đơn | Data | High | Manual |
| TVP-111 | Security | Non-manager API POST | Non-manager gọi POST `/delivery` API trực tiếp（bypass UI）→ 403 Forbidden; record không được tạo | Functional | Critical | API |
| TVP-112 | Security | Non-manager API DELETE | Non-manager gọi DELETE `/delivery/{id}` API trực tiếp → 403 Forbidden; `deleted_at` không được set | Functional | Critical | API |

---

## Checklist Coverage（18 mục）

| # | Checklist Category | Trạng thái | Ghi chú |
|---|-------------------|-----------|---------|
| 1 | FUNCTIONAL (Happy Path) | ✔ | TVP-005, TVP-043, TVP-072, TVP-083 |
| 2 | INPUT VALIDATION (Field Level) | ✔ | Create: TVP-025→TVP-042（会社名 + 送り状コード）; Edit: TVP-053→TVP-071（会社名 + 送り状コード）— mỗi field × mỗi flow = TVP riêng |
| 3 | BOUNDARY VALUE (BVA) | ✔ | TVP-027/028（name max 100/101 Create）; TVP-035/036（waybill_code max 64/65 Create）; TVP-055/056（name Edit）; TVP-064/065（waybill_code Edit） |
| 4 | NEGATIVE CASE | ✔ | TVP-025/026（blank/space required）; TVP-030（forbidden chars）; TVP-037/038（non-digit/full-width）; TVP-053/062（Edit required）; TVP-081/082（delete constraint） |
| 5 | USER BEHAVIOR (Real-world) | ✔ | TVP-045（Cancel unsaved Create）; TVP-046（Escape/outside）; TVP-047, TVP-075（double-click）; TVP-077（Cancel unsaved Edit）; TVP-104（double submit） |
| 6 | SYSTEM BEHAVIOR | ✔ | TVP-095（network error list）; TVP-096（network error Save）; TVP-097（spinner）; TVP-098→100（list refresh after CUD）; TVP-101（unauthenticated） |
| 7 | DATA INTEGRITY | ✔ | TVP-105（Create round-trip）; TVP-106（Edit round-trip）; TVP-107（soft delete DB verify）; TVP-108（null→blank）; TVP-110（waybill_code uniqueness） |
| 8 | DB ↔ UI DATA MAPPING | ✔ | TVP-051（Edit pre-load）; TVP-052（null waybill_code pre-load）; TVP-105/106/107（round-trip verify）; TVP-108（null→blank display） |
| 9 | INTEGRATION (API) | ✔ | TVP-044/074（carrier_code duplicate — BE）; TVP-073（optimistic lock API response）; TVP-085/111/112（authorization API direct call） |
| 10 | SECURITY (Basic) | ✔ | SQL Injection: TVP-031/041/059/070; XSS: TVP-032/042/060/071; Unauthorized access: TVP-016/017/085/111/112 |
| 11 | UX/UI | ✔ | Static text: TVP-001（title）、TVP-002（column headers）、TVP-003（buttons）、TVP-021/022/023（Create labels）、TVP-048/049/050（Edit labels）、TVP-078/079（Delete UI）|
| 12 | STATE & FLOW | ✔ | TVP-006/007（Drawer open state）; TVP-080（Cancel delete）; TVP-083（after delete state）; TVP-089→094（Deep link state） |
| 13 | CONCURRENCY (Advanced) | ✔ | TVP-073/103（楽観的ロック — optimistic lock conflict）; TVP-045/075/104（double submit） |
| 14 | DATA LIFECYCLE | ✔ | TVP-083（soft delete）; TVP-086（re-register after delete）; TVP-087/088（deleted_at verify）; TVP-107（DB lifecycle） |
| 15 | SEARCH / FILTER / SORT | N/A | M-07 không có tìm kiếm / lọc / sort（絞り込みなし）per spec — G-005 confirmed. TVP-004 verify absence of sort. |
| 16 | PAGINATION / LARGE DATA | ✔ | TVP-009（default 30）; TVP-010（size options 15/30/50）; TVP-011（widget visibility）; TVP-012（navigation）; TVP-013（ellipsis）; TVP-014（no sort on page change） |
| 17 | CROSS-FIELD VALIDATION | ✔ | 送り状コード required/optional thay đổi theo mode（Create vs Edit）: TVP-034（Create optional）vs TVP-062（Edit required）— mode-dependent required rule là cross-context validation chính của form này |
| 18 | IMPORT / EXPORT | N/A | M-07 và M-07-cud không có chức năng import hoặc export file |

---

## ⚠️ Các điểm cần làm rõ trước khi hoàn thiện TVP

| # | TVP ID liên quan | Nội dung cần xác nhận | Lý do không thể tự suy diễn |
|---|-----------------|----------------------|------------------------------|
| 1 | TVP-044, TVP-074 | `carrier_code` được sinh tự động（auto-increment/UUID）hay người dùng nhập? Nếu tự động, test case duplicate carrier_code cần approach nào?（G-002） | Không có field `carrier_code` trên UI; không rõ test được bằng cách nào |
| 2 | TVP-082, TVP-088 | Ràng buộc xóa điều kiện 2 đầy đủ là gì? Tên bảng, cột FK, và điều kiện "đang hiệu lực" được xác định thế nào?（G-003） | Spec bị cắt đứt; không thể setup test data mà không có tên bảng/FK |
| 3 | TVP-081, TVP-084 | Khi vi phạm ràng buộc xóa 運送業者, hệ thống hiển thị MSG-022 nguyên văn（関連データが存在するため削除できません）hay message riêng? MSG-022 cũng được dùng cho lỗi connection error trong common spec 4.1 — conflict?（G-004） | Dùng chung 1 message ID cho 2 ngữ cảnh có thể gây nhầm lẫn khi verify |
| 4 | TVP-079 | Nội dung chính thức（JP text + message ID）của hộp thoại xác nhận xóa là gì? Đã có message ID trong D-00 chưa?（G-013） | Spec chỉ cung cấp "gợi ý" content; cần text chính xác để verify |
| 5 | TVP-084 | Sau xóa mềm thành công có hiển thị toast thông báo không? Nếu có, text và message ID là gì?（G-014） | Spec chỉ định nghĩa MSG-031 cho Lưu thành công, không mention xóa thành công |
| 6 | TVP-039, TVP-068 | `waybill_code` có min-length bắt buộc không? 1 chữ số "0" có hợp lệ không? API đối tác SATO yêu cầu format cụ thể gì?（G-010, G-015） | Validation UI hiện tại chỉ kiểm tra half-width digits + max 64; không đủ nếu API cần số chữ số cố định |
| 7 | TVP-040, TVP-069 | Validation timing: on-blur hay on-submit? Áp dụng cho cả 会社名 và 送り状コード?（G-011） | Spec chỉ mô tả "khi Lưu: trim"; không nêu rõ on-blur behavior |
| 8 | TVP-047 | Click outside Drawer hoặc Escape có đóng Drawer không? Nếu có, hành vi giống キャンセル（không cảnh báo）?（G-018） | Spec chỉ đề cập nút キャンセル; không mô tả click-outside / Escape |
| 9 | TVP-076 | Khi bản ghi bị user khác soft-delete trong lúc Edit Drawer đang mở, nhấn 「保存」nhận response gì từ server? Message hiển thị là gì?（G-016） | 楽観的ロック kiểm tra `updated_at` nhưng bản ghi đã có `deleted_at`; response không xác định |
| 10 | TVP-109 | `name`（会社名）có unique constraint trên DB không? 2 công ty cùng tên có được phép tồn tại không?（G-007） | Spec không đề cập unique cho `name`; nếu không có unique check, cần verify behavior khi trùng tên |
| 11 | TVP-110 | `waybill_code` có unique constraint（trên `deleted_at IS NULL`）không? Nếu 2 công ty cùng mã, dùng message nào?（G-008） | Trùng `waybill_code` có thể gây lỗi nghiêm trọng khi phát hành vận đơn qua API SATO |
| 12 | TVP-022, TVP-049 | Figma node-id=245-5199（Drawer Edit）có hiển thị dấu (*) required bên cạnh 「送り状コード」không? Required marker trên UI có đồng bộ với G-006 confirmed（Edit = required）không? | Cần xác nhận UI thực tế để verify TVP-049 |
| 13 | TVP-001, TVP-008 | Tiêu đề màn hình JP chính xác trên Figma node-id=245-7627 là gì? Empty state text M-07 cụ thể là gì? Có message ID trong D-00 không?（G-022） | Spec không định nghĩa text empty state cụ thể cho M-07 |

---

## Lịch sử tạo file

| Phiên bản | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.0 | 2026-05-05 | Tạo mới — 112 TVPs, 18 checklist items | HuyenNTK1 |
