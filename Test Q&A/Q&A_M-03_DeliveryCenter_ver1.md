# Q&A Spec — M-03 Quản lý trung tâm phân phối (配送センター)

| Mục | Nội dung |
|---|---|
| **File** | Q&A_M-03_DeliveryCenter_ver1.md |
| **Ngày tạo** | 2026-04-30 |
| **Người tạo** | HuyenNTK1 |
| **Tài liệu tham chiếu** | [M-03_VN.md](../Requirements/M-03/M-03_配送センター情報一覧_VN.md), [M-03-cud_VN.md](../Requirements/M-03/M-03-cud_配送センター（追加・編集・削除）_VN.md) |
| **UI tham chiếu** | [M-03 List UI](../Requirements/M-03/M-03_配送センター情報一覧_VN.png), [M-03 CUD UI](../Requirements/M-03/M-03-cud_配送センター（追加・編集・削除）_VN.png) |

---

## Lịch sử tạo file

| Phiên bản | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.0 | 2026-04-30 | Tạo mới | HuyenNTK1 |

---

## I. Gaps Chưa Giải Đáp (Open)

> **Ghi chú**: Sắp xếp theo Risk (High → Medium → Low), sau đó theo Category.

| Gap ID | Category | Gap Description | Risk | Clarification Question |
|---|---|---|---|---|
| **G-001** | Integration | **GAP-201 — Nguồn tra cứu 郵便番号 chưa xác định**: Spec M-03-cud §5 và §6 (#7) đánh dấu **要確認** cho nguồn auto-fill mã bưu điện. Khi tra cứu thất bại thì hiển thị MSG-024 nhưng không rõ flow tiếp theo (user có thể nhập thủ công không, hay bắt buộc phải có kết quả tra cứu). | High | Nguồn tra cứu 郵便番号 (→ 都道府県 + 住所) là gì: external API bên thứ ba, service nội bộ, hay dữ liệu tĩnh? Khi tra cứu thất bại, ngoài hiển thị MSG-024, user có thể tiếp tục nhập thủ công 都道府県 và 住所 rồi lưu được không? |
| **G-002** | Integration | **GAP-202 — Master 都道府県 chưa xác định nguồn**: Spec M-03-cud §3 (#8) và §5 ghi **要確認** cho nguồn dropdown Tỉnh/Thành phố. Ảnh hưởng trực tiếp đến cách setup test data và test case (nếu FE hardcode 47 tỉnh JP thì không có endpoint, nếu có API thì cần test timeout/error). | High | Dropdown 都道府県 lấy từ đâu: FE hardcode 47 tỉnh thành Nhật, hay gọi API endpoint? Có option "その他" hoặc option ngoài 47 tỉnh không? |
| **G-003** | Business Logic | **センターID unique check — phân biệt hoa/thường**: Spec M-03-cud §5 nêu unique theo cặp `(client_id, center_code)` nhưng không nêu rõ có phân biệt chữ hoa/thường không. Ví dụ: DB đã có `code="KAKO"` của client X, tạo thêm `code="kako"` cùng client X → 201 OK hay 409 lỗi trùng? | High | Unique check センターID có phân biệt hoa/thường (case-sensitive) không? Nếu đã có `KAKO` thuộc client X, nhập `kako` cùng client X có bị báo lỗi trùng không? |
| **G-004** | Business Logic | **Tái sử dụng センターID sau khi xóa mềm**: Spec M-03-cud §5 đánh dấu **要確認**: "Trùng với bản ghi đã xóa mềm: 要確認". Chưa có câu trả lời chính thức. Ảnh hưởng đến test case xóa rồi tạo lại. | High | Nếu center A `(client=X, code="KAKO")` đã bị xóa mềm, tạo center mới cùng `(client=X, code="KAKO")` có được phép (201 OK) hay báo lỗi trùng (409 MSG-010)? |
| **G-005** | Business Logic | **Điều kiện chặn xóa — m_clients tham chiếu**: Spec M-03-cud §5 ghi điều kiện chặn là khách hàng đang có `destination_setting = 一か所` và center này là固定出荷先, nhưng chú thích ghi **"要確認nếu tên cột chưa cố định trong bản DB"**. Tên cột FK trong `m_clients` trỏ tới center chưa được xác nhận. | High | Điều kiện chặn xóa center từ phía `m_clients` cụ thể là gì? Tên cột FK trong `m_clients` lưu ID của center là gì (`fixed_center_id` hay tên khác)? Điều kiện check có bao gồm filter `destination_setting = '一か所'` không? |
| **G-006** | Validation | **Số điện thoại dạng quốc tế (+81)**: Spec M-03-cud §3 (#10) và 共通仕様 §5.11: sau khi strip `+`, `-`, khoảng trắng → phải còn 10–11 chữ số bắt đầu bằng `0`. Số quốc tế như `+81-90-1234-5678` sau strip → `81901234567` (11 chữ số nhưng bắt đầu `8`, không phải `0`) → fail validation. User có thể nhập nhầm dạng quốc tế mà không biết. | High | Format số điện thoại có hỗ trợ dạng quốc tế `+81xxx` không? Nếu nhập `+81-90-1234-5678`, hệ thống xử lý thế nào: báo lỗi hay tự convert thành `090-1234-5678`? |
| **G-007** | Data | **センターID — dấu gạch ngang (-) có được phép**: Spec M-03-cud §3 (#5) chỉ ghi **"半角英数字"** mà không đề cập hyphen. Không rõ `kako-gawa` (có dấu `-`) có hợp lệ hay không. Ảnh hưởng trực tiếp đến test case validation. | High | センターID có được phép nhập dấu gạch ngang (`-`) không? Ví dụ `kako-gawa` có hợp lệ không? Ngoài chữ cái và số, có ký tự đặc biệt nào được phép không? |
| **G-008** | Functional | **Filter "Tên trung tâm" gửi gì lên server**: Spec M-03 §3 (#5) nêu dropdown 配送センター名 lấy từ master `m_distribution_centers`. Nhưng không nêu rõ khi user chọn một tên, FE gửi `name` (chuỗi) hay `id` (số nguyên) lên API. Nếu gửi `name`, hai center cùng tên ở 2 client khác nhau sẽ cùng xuất hiện. Nếu gửi `id`, tester cần test data theo ID. | High | Filter "Tên trung tâm" (配送センター名) gửi `name` (chuỗi, exact match) hay `id` (Long) lên API? Nếu có 2 center cùng tên ở 2 client khác nhau, chọn filter tên đó có trả về cả 2 không? |
| **G-009** | UI/UX | **Page size mặc định: spec 30 vs UI 50**: Spec M-03 §2 và §5 nêu mặc định là **30** (15/30/50). Nhưng UI screenshot M-03 hiển thị **"50件表示"** đang được chọn và tổng "140件". Không rõ đây là user đã đổi trước khi chụp hay mặc định thực tế của FE là 50. | Medium | Page size mặc định khi vào `/center` lần đầu là **30** hay **50**? UI có nhớ page size user đã chọn lần trước (localStorage/sessionStorage) không? |
| **G-010** | Functional | **Filter state sau khi quay về từ M-03-cud**: Spec M-03 §4 "Quay danh sách" ghi "Tải lại M-03 nếu cần" nhưng không nêu rõ có giữ filter/sort/trang hiện tại không. Ảnh hưởng trực tiếp đến expected result của test case flow tạo/sửa/xóa. | Medium | Sau khi tạo/sửa/xóa center ở M-03-cud rồi quay về M-03, danh sách có giữ nguyên filter + sort + trang hiện tại không? Hay reset về mặc định (trang 1, sort センターID asc, không filter)? |
| **G-011** | UI/UX | **M-03-cud là full-page hay overlay**: Spec M-03 §1 và M-03-cud §1 nêu "màn hình trang đầy đủ có URL riêng" (`/center/new`, `/center/{id}/edit`). Nhưng UI screenshot M-03-cud hiển thị form trên nền tối (trông như modal overlay), sidebar vẫn thấy ở bên trái. Cần xác nhận để test navigation đúng (browser back, history). | Medium | M-03-cud (`/center/new`, `/center/{id}/edit`) có phải **full-page navigation** (URL thay đổi, browser history mới) không? Hay là overlay/modal component hiển thị trên M-03 mà không tạo browser history entry mới? |
| **G-012** | UI/UX | **Nội dung chính thức hộp thoại xác nhận xóa**: Spec M-03-cud §3 bảng "Hộp thoại xác nhận xóa" chỉ ghi nội dung "gợi ý" bằng tiếng Việt và chú thích `文言 chính thức: D-00`. Cần biết nội dung JP chính thức để viết expected result trong test case. | Medium | Nội dung chính thức hộp thoại xác nhận xóa là gì? Tiêu đề: `配送センターの削除`? Nội dung: `本当にこの配送センターを削除してもよろしいですか？`? Nút xác nhận label: `削除する`? Nút hủy label: `キャンセル`? |
| **G-013** | UI/UX | **Hủy không hỏi xác nhận khi có thay đổi chưa lưu — thiết kế cố ý hay thiếu sót**: Spec M-03-cud §3 (#13) nêu rõ: nhấn Hủy **không** hiển thị hộp thoại xác nhận dù có chỉnh sửa chưa lưu. Hành vi này có thể gây mất dữ liệu user đã nhập. Cần xác nhận đây là thiết kế cố ý để test case viết expected result đúng. | Medium | Khi user đã nhập/sửa dữ liệu trong form M-03-cud nhưng nhấn「キャンセル」, hệ thống chuyển về M-03 ngay mà **không** hỏi xác nhận — đây là thiết kế cố ý (by design) hay nên có dialog xác nhận "unsaved changes"? |
| **G-014** | Edge Case | **Dropdown エリア名 trống khi client chưa có area**: Khi tạo/sửa center, user chọn クライアント nhưng client đó chưa có khu vực (area) nào trong `m_areas`. Dropdown エリア名 sẽ trống. Spec không nêu UX trong trường hợp này. | Medium | Khi dropdown エリア名 trống (client chưa có area nào), hệ thống hiển thị gì? Có placeholder message như "エリアが存在しません" không? User có thể nhấn Lưu khi エリア名 chưa chọn (field bắt buộc) và nhận lỗi validation không? |
| **G-015** | Edge Case | **Đổi クライアント trong form — lựa chọn area cũ bị xóa hay giữ lại**: Spec M-03-cud §2 nêu "khi đổi khách hàng: reset lựa chọn Tên khu vực ngay". Nhưng không rõ: nếu area đã chọn tình cờ cũng thuộc client mới, FE có giữ lại không hay vẫn reset về trống? | Medium | Khi đổi クライアント trong form M-03-cud, lựa chọn エリア名 có bị reset về trống **bất kể** area cũ có thuộc client mới không? Hay FE kiểm tra và giữ lại nếu area cũ vẫn hợp lệ với client mới? |
| **G-016** | Edge Case | **Địa chỉ auto-fill có thể vượt max 255 ký tự**: Field 住所 max 255 (spec §3 #9). Nhưng auto-fill từ 郵便番号 có thể ghép nhiều thành phần địa chỉ (thành phố + quận + tên đường). Chuỗi ghép có thể vượt 255 ký tự. Spec không nêu cách xử lý. | Medium | Khi auto-fill địa chỉ từ mã bưu điện trả về chuỗi dài hơn 255 ký tự, hệ thống xử lý thế nào? FE có tự truncate không? Hay user nhận lỗi validation khi Lưu (MSG-009 vượt max length)? |
| **G-017** | Functional | **Cột đầu tiên trong bảng (No./ID) là gì**: UI screenshot M-03 hiển thị cột đầu có số 1, 2, 3…10. Spec §3 định nghĩa các cột: ID trung tâm, ID khách hàng, Tên khách hàng, Tên khu vực, Tên trung tâm, Sửa. Không rõ cột số đầu tiên trong UI là: row number theo trang, `m_distribution_centers.id` (PK), hay cột ẩn khác. | Medium | Cột số đầu tiên (hiển thị 1, 2, 3…) trong bảng M-03 là gì: row number tuần tự theo trang (trang 2 bắt đầu từ 31?), `m_distribution_centers.id` (PK), hay index trong page hiện tại? |
| **G-018** | Functional | **Trang 1: điều khiển phân trang hiển thị gì**: Spec M-03 §2 và §5 nêu **"hiển thị điều khiển phân trang từ trang thứ 2 trở đi"**. Không rõ khi ở trang 1 thì: chỉ ẩn nút Prev/page number hay ẩn toàn bộ phân trang (kể cả page size selector và tổng số bản ghi)? | Medium | Khi đang ở trang 1, UI hiển thị những gì: tổng số bản ghi ("140件") và page size selector ("50件表示") vẫn hiện, chỉ ẩn nút điều hướng trang? Hay ẩn toàn bộ khu vực phân trang? |
| **G-019** | Validation | **Mã bưu điện — format auto hay phải nhập đúng dấu `-`**: Spec M-03-cud §3 (#6) định nghĩa format **`999-9999`** (3 số + gạch ngang + 4 số). Không rõ nếu user nhập 7 chữ số liền (không có `-`) thì: hệ thống tự thêm `-` để format không, hay báo lỗi sai format ngay? | Medium | Nếu user nhập mã bưu điện không có dấu gạch ngang (ví dụ `1234567`), hệ thống tự format thành `123-4567` không? Hay validation báo lỗi format sai (phải nhập đúng `123-4567`)? |
| **G-020** | Business Logic | **Ràng buộc area_id ↔ client_id — FE validate hay chỉ BE**: Spec M-03-cud §5 nêu: `area_id` phải thuộc cùng `client_id` với center → "Vi phạm → lỗi server / validate". FE đã giới hạn dropdown エリア名 theo client_id đã chọn (ngăn chọn sai). Nhưng spec không nêu rõ error message khi vi phạm, và liệu có cần test BE validate riêng không. | Medium | Khi vi phạm ràng buộc `area_id` không thuộc `client_id`, BE trả mã lỗi gì (MSG-xxx)? Nội dung thông báo lỗi là gì? Có cần test bypass FE để gọi trực tiếp API với area_id sai client không? |
| **G-021** | UI/UX | **Tiêu đề màn hình sửa: "ID=" là PK hay center_code**: Spec M-03-cud §2 ghi tiêu đề chỉnh sửa là **"配送センター編集（ID=）"** nhưng không nêu "ID=" là giá trị gì. UI screenshot hiển thị "配送センター編集 (id=1)" gợi ý là PK. Cần xác nhận để test expected. | Low | Tiêu đề màn hình sửa hiển thị `ID=` là giá trị gì: `m_distribution_centers.id` (PK, số, ví dụ id=1) hay `center_code` (mã nghiệp vụ, ví dụ id=kakogawa)? |
| **G-022** | Edge Case | **Browser back button từ M-03-cud về M-03**: Spec §4 chỉ đề cập hành vi Hủy và Lưu để quay về M-03. Không nêu behavior khi user nhấn nút Back của trình duyệt (không phải nút Hủy trên form). Nếu M-03-cud là full-page navigation, back button sẽ quay về M-03. Không rõ filter/sort/trang có được giữ không. | Low | Khi user nhấn nút Back của trình duyệt từ M-03-cud, behavior có giống nhấn nút「キャンセル」không? Hay có hành vi khác (ví dụ: browser confirm "leave page" vì có unsaved changes)? |
| **G-023** | Functional | **Dropdown エリア名 trong filter list có hiển thị INACTIVE area không**: Spec M-03 §3 (#4) ghi dropdown エリア名 trong filter: **"không hiển thị bản ghi đã xóa mềm; hiển thị bản ghi tạm dừng (停止)"**. Trong khi đó, dropdown エリア名 trong form M-03-cud chỉ hiển thị area chưa xóa và chưa tạm dừng (spec §3 #4 form: không đề cập rõ nhưng common-spec §5.6 CUD ẩn INACTIVE). Cần xác nhận để chuẩn bị test data. | Low | Xác nhận: dropdown lọc エリア名 trên M-03 list **hiển thị** area `status=INACTIVE (停止)`? Và dropdown エリア名 trong form M-03-cud **ẩn** area `status=INACTIVE`? |

---

## II. Gaps Đã Giải Đáp (Resolved)

> **Ghi chú**: Các điểm đã được xác nhận rõ trong spec, không cần hỏi thêm.

| Gap ID | Category | Nội dung đã xác nhận | Nguồn |
|---|---|---|---|
| **G-R01** | Functional | **センターID read-only trong edit**: field `center_code` không thể chỉnh sửa sau khi tạo. Form tạo mới cho nhập, form chỉnh sửa hiển thị read-only. | M-03-cud §3 #5, §4 |
| **G-R02** | Functional | **Nút Xóa chỉ hiện ở chế độ sửa**: nút Xóa không hiển thị khi tạo mới (`/center/new`), chỉ hiển thị ở chỉnh sửa (`/center/{id}/edit`). | M-03-cud §3 #11 |
| **G-R03** | Functional | **Sort 3 cột cố định**: chỉ センターID, クライアントID, エリア名 có icon sort. Cột クライアント名 và 配送センター名 không hỗ trợ sort. | M-03 §3 #9-1 đến #9-5, §5 |
| **G-R04** | Business Logic | **Soft delete bằng `deleted_at`**: xóa mềm đặt `deleted_at`, bản ghi không hiển thị trên M-03 list thông thường. | M-03-cud §5 |
| **G-R05** | Business Logic | **Optimistic lock dùng `updated_at`**: khi Lưu, server kiểm tra `updated_at`. Nếu xung đột → MSG-020. | M-03-cud §3 #12, §5 |
| **G-R06** | Business Logic | **Xóa bị chặn nếu còn tham chiếu → MSG-022**: không xóa được nếu còn `m_clients` (destination=一か所) hoặc `m_stores` tham chiếu. Thông báo MSG-022. | M-03-cud §5 |
| **G-R07** | Functional | **Sau khi Lưu thành công → về M-03**: cả tạo mới và cập nhật, sau khi thành công đều điều hướng về `/center` kèm toast/info. | M-03-cud §4 |
| **G-R08** | UI/UX | **Dropdown クライアント trong form ẩn INACTIVE và deleted**: không hiển thị khách hàng đã xóa mềm **hoặc** tạm dừng (停止). Khác với dropdown client trong filter list (chỉ ẩn đã xóa, hiển thị tạm dừng). | M-03-cud §3 #3 |
| **G-R09** | Functional | **Khi đổi client → reset area selection**: chọn client mới thì lựa chọn エリア名 bị reset ngay, dropdown area được nạp lại theo client mới. | M-03-cud §2 |
| **G-R10** | Functional | **Phân trang: hiển thị điều khiển từ trang 2**: trang 1 không hiển thị điều khiển phân trang (nút next/prev/page số). Page sizes: 15/30/50. | M-03 §2 #10, §5 |

---

## III. Tóm tắt

### Phân bổ theo Risk

| Risk | Số lượng |
|---|---|
| High | 8 |
| Medium | 12 |
| Low | 3 |
| **Tổng Open** | **23** |
| Resolved | 10 |

### Phân bổ theo Category

| Category | Open | Resolved |
|---|---|---|
| Functional | 5 (G-008, G-010, G-017, G-018, G-023) | 5 (G-R01, G-R02, G-R03, G-R07, G-R09, G-R10) |
| Business Logic | 5 (G-003, G-004, G-005, G-020, G-R06) | 3 (G-R05, G-R06, G-R08 phần) |
| Data | 1 (G-007) | — |
| Validation | 2 (G-006, G-019) | — |
| Integration | 2 (G-001, G-002) | — |
| Edge Case | 4 (G-014, G-015, G-016, G-022) | — |
| UI/UX | 4 (G-009, G-011, G-012, G-013, G-021) | 2 (G-R08) |
| Non-functional | — | — |

### Thứ tự ưu tiên giải đáp trước khi viết TVP

1. **G-001** (GAP-201) + **G-002** (GAP-202) — ảnh hưởng cả flow auto-fill địa chỉ
2. **G-003** + **G-004** — ảnh hưởng test case unique/duplicate
3. **G-005** — ảnh hưởng test case xóa (delete constraint)
4. **G-007** + **G-008** — ảnh hưởng test case validation và filter
5. **G-009** — ảnh hưởng test case pagination default
