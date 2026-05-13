# QA Clear Spec — P-01 Plan Detail (Work Status Check)

Nguồn phân tích: `requirements/P-01/P-01_企画詳細（作業ステータス確認）_VN.md` (v1.0, 2026-04-17), `requirements/P-01/P-01_ピッキングリスト_VN.md` (v1.0, 2026-04-29), Figma `https://www.figma.com/design/9uzeEOcEjgmZ8OhWKiGZHf/-16-04--1834-Figma?node-id=99-8251` (node `99:8251`).

---

## Gap Analysis Summary

- Tài liệu: P-01 企画詳細（作業ステータス確認）_VN v1.0 + P-01 ピッキングリスト_VN v1.0; thiết kế Figma P-01 (node `99:8251`)
- Tổng số gap: 22
- High risk: 5 | Medium: 13 | Low: 4
- Category nhiều gap nhất: UI/UX

---

## Gap Table

| Gap ID | Category | Spec Section | Gap Description | Risk | Clarification Question |
| --- | --- | --- | --- | --- | --- |
| G-001 | Permission / Authorization | §5 Quyền | Đặc tả chỉ ghi giả định **quản lý / hậu cần** cho toàn màn hình; không phân tách quyền theo từng hành động (toolbar DL, `企画編集`, `配送ステータス`, `詳細`, `送り状印刷`, `パレット数入力`). | High | Với RBAC: role/permission code nào được **mở `/plan/{{id}}`**, **nhấn từng nút DL**, **Regenerate 鏡データ**, **送り状印刷**, **パレット数入力**, **企画編集**? Khi không đủ quyền: ẩn nút, disable kèm tooltip, hay redirect/message (mã D-00)? |
| G-002 | Functional | §3.2 / §4 DL toolbar | Xử lý tạo file chạy **background** với `生成中` và chặn double-click, nhưng chưa định nghĩa hành vi khi user **rời trang (SPA navigate)**, **F5/reload**, hoặc **đóng tab** giữa chừng. | High | Job generation có id theo dõi không? User quay lại P-01 thì UI hiển thị trạng thái nào (tiếp tục `生成中`, đã fail, đã xong chờ DL)? Có thông báo/toast cross-session không? |
| G-003 | Business Logic | §3.2 Mirror Data DL — Regenerate | Regenerate **vô hiệu toàn bộ code cũ** và phát hành CSV/QR mới; không mô tả tác động vận hành khi mã/QR cũ **đã phát ra hiện trường** hoặc đang trong luồng đếm/検品. | High | Trong bao lâu sau phát hành, user được phép regenerate? QR/csv cũ sau vô hiệu hóa: thiết bị quét còn nhận không, API SATO/Yamato xử lý thế nào, có cầnh báo bắt buộc trước khi regenerate không? |
| G-004 | State Machine / Status Flow + Integration | §6 GAP-P01-004 / §3.3 | Đặc tả ghi cần mapping **điều kiện charter vs delivery company** với **API/event** (đếm hoàn tất, 検品, vận đơn, lỗi) nhưng không có bảng mapping cụ thể trong tài liệu màn hình. | High | Với **mỗi** transition trong §3.3 (運送業者 / チャーター): event/API cụ thể nào (tên message hoặc contract) là trigger; payload tối thiểu; trạng thái lỗi/timeout/retry ảnh hiển thị ra sao? Ai là source of truth khi API trễ hoặc trùng? |
| G-005 | Edge Case | §3.2 / §5 | Không định nghĩa khi **hai session/user** cùng plan cùng lúc nhấn **鏡データDL** / **資材ラベルDL** / **ピッキングリストDL** (hoặc một user double-tab). | High | Có khóa optimistic theo plan không? Response thứ hai: reject, xếp hàng, hay tạo batch riêng? Serial/QR có nguy cơ trùng không và DB enforce thế nào? |
| G-006 | Data | §3.2 QR — Chi tiết dữ liệu QR | Cấu thành QR ghi **Plan No (X chữ số)**, **Area code (X chữ số)**… — độ dài **X** và padding chưa chốt (`要確認` trong spec). | Medium | Chốt độ dài cố định và ký tự pad (số 0?) cho từng thành phần; quy tắc khi master đổi mã sau khi plan đã phát hành QR? |
| G-007 | Data | §3.2 Mirror — Khi không có dữ liệu | Gói `..._000000.zip` không PNG; **có** file Excel nhưng **nội dung chính thức: 要確認**. | Medium | File Excel trong zip rỗng: sheet/cột tối thiểu nào bắt buộc (header, message code), encoding, tên file? |
| G-008 | Validation | §3.2 Picking List DL / D-00 | Chỉ nêu message **D-00** khi picking **không có dữ liệu**; các DL khác khi rỗng dùng cùng mã hay khác? | Medium | **鏡データDL** / **資材ラベルDL** khi zero rows: zip `000000` (mirror) đã mô tả — picking và material có rule tương đương không? Nội dung message D-00 (JP) cố định là gì? |
| G-009 | Validation | §4 Hiển thị ban đầu + D-00 | Không mô tả rõ khi `plan ID` không tồn tại, plan bị xóa, hoặc user không có quyền xem plan. | Medium | HTTP status/route; hiển thị empty state, error page, hay redirect về **T-01**? Message thuộc D-00 hay mã riêng? |
| G-010 | Data | §3.4 No.22 **`1個口`** | Công thức/làm tròn từ **`PC_梱包実績送信`**: **要確認**. | Medium | Công thức chính thức (làm tròn lên/xuống, số nguyên), đơn vị, và hành vi khi thiếu một phần payload từ SATO? |
| G-011 | Edge Case | §3.4 Bổ sung — charter / 運送業者 | Việc判定 charter vs delivery company **phụ thuộc cài đặt client/plan/phiếu yêu cầu — 要確認**; chưa rõ một plan có **nhiều card** với mode hỗn hợp hay thống nhất một mode cho cả plan. | Medium | Một **企画** có thể vừa có center **チャーター** vừa có center **運送業者** không? Nếu có: header toolbar và từng card lấy rule enable/disable DL theo đâu? |
| G-012 | UI/UX | Figma node `99:8251` vs §3.1–§3.2 | Trên Figma, ba nút toolbar chính và một số nút card/step vẫn là literal **「Button text」**, không khớp nhãn đặc tả (**鏡データDL** / **資材ラベルDL** / **ピッキングリストDL** / **詳細** / bước 3 status bar). | Medium | Final copy JP cho từng nút: đồng nhất với §3.1–3.2 hay cập nhật đặc tả theo Figma? Ai sign-off copy trước UAT? |
| G-013 | UI/UX | Figma vs §3.3（運送業者） | Figma thẻ mẫu dùng nhãn **「カウント完了」**; đặc tả **運送業者** ghi hoàn tất đếm là **「全件カウント完了」**. | Medium | Nhãn chuẩn production là gì (đồng nhất toàn app)? Có cần phân biệt visual giữa “đủ job” và “complete khác nghĩa” không? |
| G-014 | UI/UX | §3.4 No.18 作業ステータス表示 | **Khi click** có chuyển màn hình hay không: **要確認**. | Medium | Click badge/status trên card: chỉ hiển thị tooltip/drawer, navigate **P-02**/**P-05**, hay không có hành động? Nếu có keyboard/focus requirement? |
| G-015 | UI/UX | §3.1 No.7 配送ステータス | Ghi chú **企画（ヘッダ）.配達ステータス** — **要確認**. | Low | Dữ liệu header lấy từ aggregate nào (định nghĩa “tổng hợp” theo center/pattern)? Label hiển thị trên nút có đồng bộ **P-05** không? |
| G-016 | Non-functional | §3.2 DL / Regenerate | Không có yêu cầu **audit log** (ai DL/regenerate, thời điểm, version file/serial range). | Medium | Có cần ghi nhận audit cho compliance không? Nếu có: field tối thiểu và retention? |
| G-017 | Non-functional | §3.2 Package | Zip có thể rất lớn (29 artifacts, nhiều PNG); không có SLA thời gian tạo, timeout, hay giới hạn kích thước. | Low | Timeout server/client; partial download; resume được không; thông báo khi vượt ngưỡng dung lượng? |
| G-018 | State Machine / Status Flow | §3.3 チャーター — Cột trạng thái 1 | Bảng **運送業者** có dòng **Ban đầu → 未着手**; bảng **チャーター** cột 1 bắt đầu từ “Khi trigger QR…” mà không có dòng ban đầu tương đương. | Medium | Trạng thái khởi tạo trên UI **チャーター** trước lần đầu nhận API là gì (blank, **未着手**, hay ẩn)? Có mâu thuẫn với card-level **未着手** trong grid không? |
| G-019 | Data | P-01 ピッキングリスト §5 GAP | **Template variable** cho header (ngày/chia trang) chưa chốt. | Low | Danh sách biến chính thức cho dòng title (No.1): ví dụ `{{planName}}`, `{{page}}`, `{{totalPages}}`, timezone format? |
| G-020 | Integration + Data | P-01 ピッキングリスト §3 No.3 | **トリガーQR**: mã 3 chữ số cố định + **payload generate động**; chi tiết qua implementation và **format-pickinglist.xlsx**. | Medium | Payload QR picking có cùng quy tắc thành phần với **鏡データ** QR không, hay schema riêng? Tài liệu nào là SSOT nếu xung đột với xlsx? |
| G-021 | Data | §6 GAP-P01-002 / §3.4 No.16,19–21 | Công thức tổng **納品数** và tỷ lệ **mẫu số/ tử số** / dự phòng: **要確認**. | Medium | Chốt công thức tổng per center và per pattern; nguồn số khi import **P-03** thay đổi sau khi plan active? |
| G-022 | UI/UX | §3.4 Bảng phần tử | Đánh số **No.** nhảy từ **16** sang **18** (không có No.17). | Low | Đây là lỗi đánh số hay thiếu một hàng mô tả phần tử? Nếu thiếu, bổ sung No.17 là gì? |

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
