# QA Clear Spec — P-05 Delivery Status

Nguồn phân tích: `requirements/P-05/P-05_配送ステータス_VN.md` (v1.0, 2026-04-27), Figma metadata node `190:23696` (frame **P-05_配送ステータス** — `get_design_context` trả về sparse tree do kích thước frame).

---

## Gap Analysis Summary

- Tài liệu: P-05 配送ステータス_VN v1.0 (2026-04-27); Figma P-05 (node `190:23696`)
- Tổng số gap: 20
- High risk: 3 | Medium: 14 | Low: 3
- Category nhiều gap nhất: Functional

---

## Gap Table

| Gap ID | Category | Spec Section | Gap Description | Risk | Clarification Question |
| --- | --- | --- | --- | --- | --- |
| G-001 | Functional + Data | §1 URL + §4 + §6 GAP-P05-001 | **§1** ghi URL **`/plan/status`**, **§4** mô tả mở **`/plan/{{id}}/status`** theo plan — mâu thuẫn routing và không định nghĩa hành vi khi không có `{{id}}`. | High | URL chính thức là gì; `/plan/status` có redirect, liệt kê **tất cả** plan, hay 403; query param `planId` có được hỗ trợ không? |
| G-002 | Data | §3.1 No.2 + §3.2 No.11 | **送り状No** lọc/hiển thị từ hai nguồn **`出荷個口.送り状No`** và **`企画店舗配送.送り状No`** — không có quy tắc ưu tiên khi hai giá trị khác nhau hoặc một bên null. | High | Khi cả hai tồn tại: hiển thị/ lọc theo cột nào; có merge rule hay cảnh báo data inconsistency không? |
| G-003 | Permission / Authorization | §5 Quyền | Chỉ ghi **管理・物流**; không chi tiết permission theo thao tác (**絞り込み**, sort, mở accordion, xem dữ liệu carrier). | High | Ma trận RBAC: role nào được mở P-05; có plan-level restriction (chỉ plan của team mình) không; thiếu quyền thì ẩn route hay empty state? |
| G-004 | Integration | §5 Hiển thị trạng thái + §6 GAP-P05-002 | Trạng thái **`配送ステータス`** từ API carrier, giá trị khác nhau theo hãng; **mapping label/màu** **要検討**. | Medium | Bảng chuẩn (API raw → JP hiển thị → màu badge) per carrier; fallback khi giá trị chưa đăng ký trong mapping? |
| G-005 | State Machine / Status Flow | §3.1 No.6 + §5 | Dropdown **ステータス** lấy giá trị từ API — danh sách cố định trên UI hay động theo dữ liệu thực tế trong DB/API? | Medium | Giá trị filter có phải union tất cả status từng thấy trong hệ thống không; có nhóm “Other” không? |
| G-006 | Functional | §4 Sort + §6 GAP-P05-003 | Sort cột **納品先名** / **配達予定日** / **配送ステータス** — chưa chốt **thứ tự mặc định** và **chu kỳ** click header (asc/desc/none). | Medium | Default sort khi load; click thứ 3 có reset không; sort client-side hay server-side (ảnh hưởng pagination)? |
| G-007 | UI/UX | §5 Quy cách highlight + §6 GAP-P05-004 | Highlight **`#DFFF00`** khi khớp serial — mô tả “vị trí tương ứng” nhưng chưa chi tiết **dòng cha/dòng con**, cell, hay toàn row. | Medium | Khi nhiều cell khớp một chuỗi con: highlight tất cả hay match đầu tiên; có giữ highlight sau khi đóng accordion không? |
| G-008 | Functional | §3.1 No.3 + §4 | **企画名** khi chuyển từ **P-01/T-01**: “giả định đặt sẵn điều kiện ban đầu” — **要確認**. | Medium | Giá trị preset là full name, partial, hay `plan_id` ẩn trong state; user xóa filter có được xem cross-plan không khi URL vẫn scoped theo plan? |
| G-009 | Validation | §3.1 No.5 | **配達予定日** “điều kiện theo ngày đơn” — không rõ so khớp **bằng ngày** (=), **≤/≥**, hay khoảng một ngày theo timezone. | Medium | So sánh theo calendar date (JST) hay UTC instant; plan giao qua đêm quốc tế? |
| G-010 | Edge Case | §5 + §3.2 | Không mô tả khi **không có dòng** sau lọc, hoặc khi API carrier/DB **timeout/lỗi**. | Medium | Empty state copy (JP); retry/backoff; message D-00 cho từng loại lỗi? |
| G-011 | Non-functional | §3.2 List | Danh sách có thể rất lớn (nhiều **個口**); không có **phân trang**, page size, hay virtual scroll trong đặc tả. | Medium | Giới hạn số dòng tối đa; lazy load accordion detail; SLA thời gian query? |
| G-012 | Integration | §5 Hiển thị trạng thái | Giá trị API có thể là **遅延中** v.v. — không định nghĩa **tần suất đồng bộ** với carrier (near-real-time vs batch). | Medium | Dữ liệu stale tối đa bao lâu; có nút **手動更新** hay auto-refresh interval không? |
| G-013 | Edge Case | §5 Quy cách lọc serial | Khi serial khớp **nhiều dòng con** cùng một dòng cha: có expand sẵn tất cả nhánh liên quan không? | Medium | UX mặc định: auto-expand parent, scroll-into-view, hay chỉ badge số match? |
| G-014 | Validation | §5 AND + §3.1 | Điều kiện **AND** — không nêu xử lý field để trống (coi như wildcard hay bắt buộc nhập tối thiểu một field). | Medium | Filter với tất cả field trống: trả về full list plan hay cảnh báo; giới hạn query cost? |
| G-015 | UI/UX | Figma table labels vs §3.2 | Metadata Figma dùng placeholder **#配送先住所** / **#配送センター**; spec cột **納品先住所列** / **納品先名列** (**納品先**). | Medium | Chuẩn copy JP trên UI: **納品先** hay **配送先**; đồng bộ với master **配送センター** và tài liệu khác (P-01)? |
| G-016 | Functional | §3.1 No.9 + §4 | **絞り込み** “chống click lặp khi đang xử lý” — không mô tả spinner/disable phạm vi (chỉ nút hay toàn form). | Medium | Trong lúc fetch: khóa bảng, hiển thị skeleton, hay cho phép sort; double-submit API? |
| G-017 | Business Logic | §5 + P-04/T-01 | Plan **論理削除** (P-04) vẫn có dữ liệu giao vật lý? — P-05 không nói có ẩn hay không hiển thị các **個口** thuộc plan đã xóa logic. | Medium | Query P-05 có filter `deleted` plan không; nếu user có deep link tới plan đã xóa: 404 hay empty list? |
| G-018 | UI/UX | Figma `441:203041` | Component tên **FIlter Bar** (typo **FIlter**) trong file thiết kế. | Low | Chuẩn hóa tên layer/component (ảnh hưởng handoff dev/design system không)? |
| G-019 | Non-functional | §3.3 Accordion | Không có yêu cầu **keyboard** (Enter/Space mở row), **focus trap**, hay announce screen reader cho nội dung mở rộng. | Low | Có bắt buộc WCAG mức nào cho màn logistics nội bộ không? |
| G-020 | UI/UX | §3.2 No.10 | “Icon đầu dòng chỉ hỗ trợ hiển thị” — không ghi **aria-label** / tooltip JP cho vùng click mở accordion. | Low | Tooltip/accessible name cho **アコーディオン印** (ví dụ **「詳細を開く」**)? |

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

