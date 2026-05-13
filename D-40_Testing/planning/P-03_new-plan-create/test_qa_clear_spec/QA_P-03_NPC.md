# QA Clear Spec — P-03 New Plan Create

Nguồn phân tích: `requirements/P-03/P-03_新規企画作成_VN.md` (v1.0, 2026-04-17), Figma `https://www.figma.com/design/9uzeEOcEjgmZ8OhWKiGZHf/-16-04--1834-Figma?node-id=99-18849` (node `99:18849`, frame **P-03_新規企画作成**).

---

## Gap Analysis Summary

- Tài liệu: P-03 新規企画作成_VN v1.0 (2026-04-17); Figma P-03 (node `99:18849`)
- Tổng số gap: 22
- High risk: 5 | Medium: 13 | Low: 4
- Category nhiều gap nhất: Data

---

## Gap Table

| Gap ID | Category | Spec Section | Gap Description | Risk | Clarification Question |
| --- | --- | --- | --- | --- | --- |
| G-001 | Permission / Authorization | §5 Quyền | Chỉ ghi giả định **quản lý / hậu cần**; không tách quyền theo **テンプレートダウンロード** / **ファイル参照** / **データ読み込み** / **登録する** / **この企画を削除する**. | High | RBAC: permission nào cho từng hành động trên; khi thiếu quyền thì ẩn, disable, hay message (mã D-00)? Có role chỉ xem template không upload không? |
| G-002 | Functional + Data | §3.2 / §4 / §5 Register | Luồng preview/delete/register thao tác trên **「企画」đang preview** nhưng đặc tả không nêu rõ **thời điểm tạo bản ghi `t_plans`/cấp `plan_id`** (sau **データ読み込み** thành công hay chỉ sau **登録する**). | High | `plan_id` và row draft được tạo khi nào? Nếu sau Data Load: trạng thái DB và khóa ngoại các bảng con trước **登録する** là gì? User đóng tab giữa chừng thì dữ liệu tạm xử lý thế nào (TTL, job cleanup)? |
| G-003 | Business Logic | §3.2 No.8 + §5「Register」 | **登録する** ghi nhiều bảng (`t_plans`, `t_plan_materials`, `t_plan_stores`, `t_plan_store_materials`, `t_pallets` điều kiện); không mô tả **giao dịch** (all-or-nothing) khi một bước insert thất bại. | High | Có bắt buộc single transaction không? Lỗi giữa chừng: rollback toàn bộ, hay để orphan records; user thấy message gì và có thể **データ読み込み** lại an toàn không? |
| G-004 | Data | §5 `t_plans` — `client_id` | Mapping **クライアント名** → `m_clients`: nếu **trùng tên hiển thị** hoặc gần giống (space, full/half width) thì chọn record nào? | High | Quy tắc unique (code kèm theo?), thứ tự ưu tiên, hay bắt buộc import thêm cột **クライアントID**? Khi ambiguous: fail toàn bộ hay cảnh báo trong **エラー一覧**? |
| G-005 | Data | §5 `t_plan_stores` + §5「Khi nhấn Data Load」 | Dòng `t_plan_stores` **không map 1-1 từ một cell**; xác định store/DC từ **area** và master liên quan — chưa mô tả khi **một area gắn nhiều store/DC** hoặc rule chọn DC mặc định. | High | Với mỗi cột area hợp lệ trên request: thuật toán chọn **配送センター**/**店舗** cụ thể là gì (ưu tiên theo M-01 client setting giống P-01 `9999999999`, theo tuyến, hay bắt buộc cột DC trên Excel)? |
| G-006 | Validation | §3.1 No.4 + §5「Kích thước file」 | Chỉ rõ **xlsx/csv**, **30MB**, **MSG-035**; chưa định nghĩa file **0 byte**, không sheet, **.xls** (legacy), **macro-enabled** (xlsm), **password-protected**, hoặc **CSV delimiter/encoding**. | Medium | Danh sách extension MIME được chấp nhận; CSV encoding (UTF-8 BOM?); file khóa mật khẩu: từ chối với mã message nào? |
| G-007 | Validation | §3.1 No.5 / §3.2 No.5 | **データ読み込み** khi chưa chọn file: **「không cho chạy hoặc hiển thị thông báo」** — message code/wording chưa gán. | Medium | Dùng mã nào trong **D-00** (JP cố định)? Disable nút hay toast khi click? |
| G-008 | Functional | §5「Logic…」Bước 1–4 | Nhiều hạng mục ghi **要確認** (cấu trúc sheet/cell ngoài một phần, vị trí cột preview, pattern hiển thị code+tên theo Figma). | Medium | SSOT cho layout Excel đọc vào: file `format-*.xlsx`, `P-03_依頼書.png`, hay tài liệu khác — thứ tự ưu tiên khi mâu thuẫn? |
| G-009 | Business Logic | §3.2 No.6 + §5「Khi nhấn Data Load」 | Dòng bị loại do không khớp master có **「có thể」** hiển thị ở **エラー一覧** — không bắt buộc. | Medium | Chính sách thống nhất: mọi dòng/cột bị loại đều phải xuất hiện trong Error List với lý do, hay một số **silent drop**; nếu silent, làm sao vận hành đối soát với file gốc? |
| G-010 | Data | §3.2 No.6 Ghi chú | Bản import dự kiến là bản **đã loại trừ Tây Nhật［DNP］** — không có rule kỹ thuật trong §5. | Medium | Tiêu chí loại trừ (area code, client flag, dòng cụ thể): do template, do parser, hay do người soạn file; có cần log các dòng đã loại không? |
| G-011 | Integration | §3.1 No.3 + §5 Template Excel | Template **server generate động** theo master mới nhất; không mô tả khi generate lỗi (DB timeout), version cache, hay user vừa sửa master giữa lúc DL và Upload. | Medium | Response lỗi DL template; có **ETag/version** trên file không để phát hiện mismatch với file user điền offline lâu ngày? |
| G-012 | Edge Case | §3.2 No.4 | Sau preview, **thay file** rồi **データ読み込み** lại — không nêu xử lý draft cũ (plan_id, preview data) khi re-validate. | Medium | Re-load có xóa draft DB cũ và tạo session mới không? Nếu lần 2 fail sau khi lần 1 success: UI và dữ liệu residue? |
| G-013 | Edge Case | §5 `t_pallets` | Chỉ tạo khi **`m_clients.use_pallet_label_print` = ON**; không mô tả khi preview/register cho client **OFF** nhưng sau đó bật ON (hoặc ngược lại) trước khi **登録する**. | Medium | Snapshot theo thời điểm Data Load hay theo Register? Có cầnh báo refresh preview khi master client đổi không? |
| G-014 | State Machine / Status Flow | §5 `t_plans.status` | Sau đăng ký mặc định **`UNPROCESSED` / 未対応**; không mô tả trạng thái **draft** (nếu có) trước Register và transition sang UNPROCESSED. | Medium | Có các giá trị `status` trung gian (DRAFT) trên DB không; **T-01** / **P-01** filter thế nào để không lộ plan chưa hoàn tất register? |
| G-015 | UI/UX | Figma `99:18849` vs §3.2 | Frame Figma chỉ phản ánh **§3.1** (title, template DL, upload, **ファイル参照**, **データ読み込み**); không có mock **プレビュー表示**, footer **この企画を削除する** / **登録する**, **エラー一覧**. | Medium | Figma bổ sung state sau Data Load/Error hay acceptance dựa wireframe khác; spacing/copy **アップロード案内文** final sign-off với §3.1 No.2? |
| G-016 | UI/UX + Cross-screen | §3.2 No.8 + P-01 | **登録する** chỉ active khi **「preview hợp lệ」** — tiêu chí **hợp lệ** ngoài parse thành công chưa chi tiết (ví dụ tổng = 0, thiếu ngày header). | Medium | Checklist validation bắt buộc trước Register; có rule business giống **P-01** (số lượng, pattern tối thiểu) cần đồng bộ không? |
| G-017 | Integration | §5 Tham chiếu image | Link **P-03_依頼書.png** trên Git — không nằm trong repo workspace; dev/test có thể không truy cập được. | Medium | Bản copy nội bộ/requirement frozen version nào là chuẩn cho UAT; khi ảnh cập nhật ai cập nhật mapping §5? |
| G-018 | Non-functional | §3.1 No.4 + §5 | Giới hạn **30MB** nhưng không có **thời gian parse tối đa**, timeout server, hay progress UI (chỉ chặn double-click). | Medium | SLA xử lý **データ読み込み**; có progress bar/percentage không; timeout hiển thị message nào? |
| G-019 | Non-functional | §3.1 / §5 | Không đề cập **virus scan** / content validation cho file upload từ user. | Low | Có yêu cầu scan attachment trước khi parse không; file chứa formula external link xử lý thế nào? |
| G-020 | Functional | §3.2 No.7 | Dialog xác nhận **この企画を削除する**: **「đối tượng xóa/văn bản xác nhận theo requirement」** chưa cụ thể. | Low | Wording JP chính thức (title/body nút), mã message; xóa có hoàn tác (undo) không? |
| G-021 | UI/UX | §4 | Không mô tả **Cancel / quay lại** từ `/plan/new` về **T-01** hoặc browser back sau khi đã Data Load. | Low | Back navigation: cảnh báo mất preview/draft; deep link `/plan/new` khi đã có draft? |
| G-022 | Data | §5「完全一致文字列」 | Đối chiếu master bằng text **完全一致** — không nêu chuẩn hóa (trim, full-width digit, uppercase) trước khi so. | Low | Có bước normalize chuỗi không; nếu không, có document hướng dẫn soạn file cho vận hành không? |

---

## Checklist nhanh (skill)

```
[x] Phân tích đủ 10 category
[x] Mỗi gap có Gap ID duy nhất
[x] Cột Spec Section được điền cho mỗi gap
[x] Risk được đánh giá theo Risk Rating Criteria (High / Medium / Low)
[x] Câu hỏi làm rõ cụ thể, actionable
[x] Ưu tiên gap có Risk = High trước
[x] Không tự giả định logic bị thiếu
[x] Kiểm tra tính nhất quán cross-screen nếu spec đề cập màn hình liên quan
[x] Authorization/Permission gap đã được kiểm tra (Category 9)
[x] State/Status flow gap đã được kiểm tra nếu entity có trạng thái (Category 10)
[x] Summary section được điền trước bảng gap
```
