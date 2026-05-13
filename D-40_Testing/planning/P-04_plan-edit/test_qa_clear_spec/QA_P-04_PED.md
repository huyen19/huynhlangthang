# QA Clear Spec — P-04 Plan Edit

Nguồn phân tích: `requirements/P-04/P-04_企画編集_VN.md` (v1.0 + cập nhật 2026-04-29), Figma `https://www.figma.com/design/9uzeEOcEjgmZ8OhWKiGZHf/-16-04--1834-Figma?node-id=99-19826` (node `99:19826`, frame **P-04_企画編集**).

---

## Gap Analysis Summary

- Tài liệu: P-04 企画編集_VN (v1.0, 2026-04-17; chỉnh §5/§1–3 ngày 2026-04-29); Figma P-04 (node `99:19826`)
- Tổng số gap: 20
- High risk: 4 | Medium: 14 | Low: 2
- Category nhiều gap nhất: State Machine / Status Flow

---

## Gap Table

| Gap ID | Category | Spec Section | Gap Description | Risk | Clarification Question |
| --- | --- | --- | --- | --- | --- |
| G-001 | State Machine / Status Flow + Functional | §5 Bảng trạng thái + §3 + §5「論理削除」 | Bảng **企画ステータスと編集可否** chỉ liệt kê ràng buộc cho **upload lại phiếu yêu cầu v.v.**; **không** nêu **この企画を削除する** được phép ở trạng thái nào. | High | **論理削除** có chỉ cho phép khi **未対応** giống upload, hay vẫn cho phép ở **進行中/配送中** (kèm điều kiện)? Nếu cấm: disable + message D-00 như thế nào? |
| G-002 | State Machine / Status Flow + Edge Case | §5 + §4 | User mở **`/plan/{{id}}/edit`** khi plan còn **未対応**, trong lúc thao tác trạng thái chuyển **進行中** (SATO/PcInspection) — **登録する** / **データ読み込み** xử lý ra sao? | High | Có polling/version (`ETag`/updated_at) trước mỗi mutation không? Khi phát hiện đổi trạng thái: reject **登録する**, refresh UI, hay cảnh báo và yêu cầu reload? |
| G-003 | Business Logic + Integration | §5「論理削除」+ P-01 | Plan **進行中** đã đồng bộ SATO: nếu vẫn cho **論理削除** (hoặc rule chưa chặn), tác động tới dữ liệu phía SATO/field (QR, vận đơn) chưa mô tả. | High | Sau **論理削除**, có gọi API hủy/hoàn tác phía SATO không, hay chỉ ẩn trên HBLAB? Ai chịu trách nhiệm đối soát tồn tại dữ liệu ghost? |
| G-004 | Permission / Authorization | §3 (tham chiếu P-03) | P-04 không định nghĩa RBAC riêng; toàn bộ UI giả định theo **P-03** nhưng P-04 có ràng buộc trạng thái bổ sung. | High | Permission nào được **mở `/plan/{{id}}/edit`**, **xem preview khi cấm sửa**, **テンプレートダウンロード**, **論理削除**? Khác biệt role **管理者** vs **後勤** tại P-04? |
| G-005 | UI/UX | Figma node `99:19826` vs §1 | Frame Figma tên **P-04_企画編集** nhưng **画面タイトル** trong code/text hiển thị **企画新規登録** (giống P-03), không khớp **企画編集画面** / context plan hiện có. | Medium | Copy chuẩn JP cho H1: **企画編集** hay giữ **企画新規登録**? Có hiển thị thêm **企画No./企画名** trong header để phân biệt plan đang sửa không? |
| G-006 | UI/UX | Figma `99:20057` sort + §5「プレビュー」 | Trên bảng preview có control **sort-ascending**; đặc tả **プレビュー read-only** và không cho sửa cell. | Medium | Sort chỉ đổi thứ tự hiển thị client-side (không đổi dữ liệu) có được phép không? Nếu không: Figma bỏ sort; nếu có: bổ sung vào spec và test case regression sau **登録する**. |
| G-007 | UI/UX | Figma `99:19966`「読み込み中・・・」+ P-03 §3 | Figma có vùng **読み込み中・・・** + progress bar; P-03 mô tả chặn double-click **データ読み込み** nhưng wording/animation có thể khác. | Medium | UX **データ読み込み** tại P-04 có bắt buộc đồng nhất component/copy với P-03 không (文言、プログレス、ブロック範囲)? |
| G-008 | Functional | §5「企画ステータス」+ §3 | Khi trạng thái **Cấm** upload: **テンプレートダウンロード** vẫn cho phép không (tải template để soạn offline)? | Medium | Nút **テンプレートダウンロード** có phụ thuộc trạng thái plan không; nếu disable thì message gì? |
| G-009 | State Machine / Status Flow | §5「進行中」 | **進行中** = sau khi gọi API nhóm **PcInspection** — không có danh sách API/version hay event trigger cụ thể trong đặc tả màn hình. | Medium | Điều kiện kỹ thuật chính xác để set **進行中** (response field, retry, idempotency); ai là source of truth khi lệch với trạng thái thực tế SATO? |
| G-010 | State Machine / Status Flow | §5「配送中」 | **配送中** = **đã phát hành Waybill No.** — không mô tả cơ chế phát hiện (Yamato API, nhập tay, batch). | Medium | Waybill được coi là “đã phát hành” khi nào (API success, số in ra, hay ghi nhận từ P-01)? |
| G-011 | Business Logic | §5 cuối + P-01 | Nếu có nhánh trạng thái theo **charter** v.v. phải đồng bộ **P-01/T-01** — chỉ ghi nguyên tắc, không có checklist đối chiếu. | Medium | Bảng mapping đầy đủ status P-04 ↔ P-01 card (運送業者/チャーター) ↔ T-01 cột filter; trường hợp mâu thuẫn ưu tiên rule nào? |
| G-012 | Data | §5「論理削除」+ T-01 | Plan đã **論理削除** không hiện T-01 giống filter **完了した企画を表示** — chưa rõ query có overlap (plan 完了 vs deleted). | Medium | Điều kiện loại khỏi danh sách T-01: chỉ `deleted_at`, hay kết hợp `status`; export/báo cáo có cần nhìn thấy bản ghi đã xóa logic không? |
| G-013 | Functional + Integration | §3 + `P-03_新規企画作成.md` | P-04 delegate phần lớn UI/luồng sang **P-03**; mọi **要確認** / gap tại P-03 ảnh hưởng P-04 nhưng không được liệt kê. | Medium | Danh sách delta test: chức năng nào của P-03 **không** áp dụng P-04 (ví dụ draft `plan_id` lúc tạo mới vs plan tồn tại)? SSOT khi hai spec mâu thuẫn? |
| G-014 | Edge Case | §4 Hiển thị ban đầu | Mở `/plan/{{id}}/edit` với `id` không tồn tại, đã **論理削除**, hoặc user không có quyền — không mô tả. | Medium | HTTP/route; redirect **T-01** hay **P-01**; message D-00? |
| G-015 | Edge Case | §3 + §5 | Hai user cùng sửa một plan **未対応** (upload/Data Load/登録) — không có optimistic lock. | Medium | Có kiểm tra version row khi **登録する** không; conflict thì UI/message? |
| G-016 | Validation | §5 + §3 | Khi thao tác bị **disable** hoặc “không cho thực thi”, message **D-00** hay **要確認** — chưa gán mã cụ thể theo action. | Medium | Ma trận: mỗi cặp (trạng thái, nút: **ファイル参照** / **データ読み込み** / **登録する** / **テンプレートDL** / **削除**) → mã message JP bắt buộc? |
| G-017 | Functional | §3 + P-03 §4 | Sau **登録する** thành công: P-03 chuyển **P-01**; P-04 nói “giả định cùng luồng P-03” nhưng URL đang là edit. | Medium | Sau save tại P-04: luôn redirect **`/plan/{{id}}`** (P-01), giữ `/edit`, hay optional toast + stay? |
| G-018 | Non-functional | §5「論理削除」 | Không yêu cầu **audit** (ai xóa, lý do, IP, khôi phục được không). | Medium | Có cần audit trail cho compliance và hỗ trợ support undo không? |
| G-019 | UI/UX | §2 | Chỉ nói hiển thị định danh plan + preview; không bắt buộc hiển thị **企画No./クライアント** trong vùng cố định (ngoài preview). | Low | Figma/spec có cần khối **企画ヘッダ** giống **P-01** (read-only) để tránh nhầm plan khi nhiều tab? |
| G-020 | UI/UX | §4 | Không mô tả **Cancel / 戻る** từ màn edit về **P-01** hoặc **T-01** và hành vi khi có preview chưa **登録**. | Low | Nút back/browser back: cảnh báo mất thay đổi chưa save; draft preview có bị hủy không? |

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

