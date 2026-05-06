# Test Strategy — T-01 企画一覧（トップ）

| Mục | Nội dung |
|-----|----------|
| **File** | `TS_T-01_企画一覧TOP_ver1.md` |
| **Màn hình** | T-01 — 企画一覧（トップ）/ Danh sách Kế hoạch — Trang chủ |
| **Ngày tạo** | 2026-05-04 |
| **Phiên bản** | 1.0 |
| **Tài liệu tham chiếu** | `Requirements/T-01/T-01_企画一覧（トップ）_VN.md` · `Requirements/T-01/T01.png` · `Test Q&A/Q&A_T-01_企画一覧TOP_ver1.md` |

---

## 1. System Overview

**FM資材管理システム** — Hệ thống quản lý vật tư / logistics.

Màn hình **T-01** là **trang chủ (TOP)** của hệ thống: hiển thị toàn bộ danh sách **企画（kế hoạch / chiến dịch triển khai）** và cho phép người dùng xác nhận tiến độ, lọc, tìm kiếm, sắp xếp rồi điều hướng sang màn chi tiết **P-01**.

**Luồng nghiệp vụ quan trọng:**

| Luồng | Mô tả |
|-------|-------|
| **Vận chuyển thường** | 5 trạng thái: 未対応 → 進行中 → 配送中 → 配達完了 → 完了 (tự động sau 5 ngày) |
| **Charter（チャーター）** | 4 trạng thái: 未対応 → 進行中 → 配送中 → 完了 (tự động sau 5 ngày, không qua 配達完了) |
| **Lọc & Tìm kiếm** | 6 tiêu chí kết hợp AND: khách hàng, 展開期間, 出荷予定日, 納品予定日, ステータス, tên/ID |
| **Sắp xếp** | 3 cột: ID, 出荷予定日, 納品予定日 |
| **Phân trang** | Cỡ trang mặc định (GAP-701 chưa xác định) |
| **Điều hướng** | T-01 → P-01 企画詳細 (GAP-703 chưa xác định cách trigger) |

**Vai trò:** Quản lý（管理）và Logistics（物流）— các vai trò khác không được truy cập.

---

## 2. Key Test Targets

| ID | Priority | Module / Tính năng | Lý do |
|----|----------|--------------------|-------|
| TT-01 | **High** | Badge trạng thái — 2 luồng (thường & Charter) | Core display; hai state machine khác nhau, badge sai gây nhầm lẫn nghiệp vụ |
| TT-02 | **High** | Lọc kết hợp AND (6 tiêu chí) | Logic phức tạp, nhiều combination; sai một điều kiện là miss/show sai kế hoạch |
| TT-03 | **High** | Lọc theo 展開期間 (date range matching) | GAP-704 chưa rõ quy tắc intersect/within — block test case nếu chưa confirm |
| TT-04 | **High** | Điều hướng sang P-01 | Luồng chính; GAP-703 chưa xác định trigger mechanism |
| TT-05 | **High** | Sort mặc định và sort theo cột | GAP-708 chưa xác định; ảnh hưởng UX initial load |
| TT-06 | **High** | Quyền truy cập (管理 / 物流 / unauthorized) | Security requirement; redirect sai → unauthorized access |
| TT-07 | Medium | Lọc text (tên kế hoạch / ID) — partial vs exact match | GAP-706: không rõ match type; sai logic → UX confusing |
| TT-08 | Medium | Phân trang — giữ filter & sort khi chuyển trang | State management; regressions hay gặp ở pagination |
| TT-09 | Medium | Empty state khi filter không có kết quả | UX requirement; cần phân biệt "chưa có kế hoạch" vs "filter 0 kết quả" |
| TT-10 | Medium | Xử lý lỗi: network lỗi, SATO down | Resilience; stale data badge risk |
| TT-11 | Low | Performance: tải trang < 3 giây | Non-functional SLA; Dense layout nhiều cột cần đo thực tế |

---

## 3. Risk Assessment

### Business Risk

| Risk | Impact | Lý do |
|------|--------|-------|
| Badge trạng thái hiển thị sai luồng Charter vs thường | **High** | Người dùng logistics đọc sai trạng thái giao hàng → hành động sai nghiệp vụ; Charter không có bước 配達完了 |
| Lọc 展開期間 trả về sai tập kết quả | **High** | GAP-704: nếu quy tắc là "within" thay vì "intersect", nhiều kế hoạch đang triển khai sẽ bị ẩn |
| Sort mặc định không hợp lý | **Medium** | GAP-708: nếu sort theo ID tăng dần, kế hoạch mới nhất/cấp bách nhất sẽ hiển thị cuối trang |
| Không thể điều hướng sang P-01 | **High** | GAP-703: nếu cơ chế click bị conflict (click dòng vs click element con), user bị block khỏi workflow chính |

### Data Risk

| Risk | Impact | Lý do |
|------|--------|-------|
| Không xác định được field Charter (GAP-712) | **High** | Không tạo được test data đúng → không validate được badge Charter |
| Null values trong 出荷予定日 / 納品予定日 | **Medium** | Sort behavior với NULL không định nghĩa → NULLS FIRST/LAST có thể gây UX bug |
| Khách hàng bị xóa mềm sau khi kế hoạch tạo | **Medium** | Cột klhách hàng trên bảng có thể hiển thị sai (snapshot vs lookup) |
| Kế hoạch có 展開期間 null | **Medium** | Hành vi hiển thị và filter matching không xác định |

### Integration Risk

| Risk | Impact | Lý do |
|------|--------|-------|
| SATO system down (GAP-713) | **High** | Trạng thái kế hoạch không cập nhật → stale badge → user thấy thông tin sai |
| Charter count sync thất bại một phần | **High** | GAP-005 trong Q&A: trạng thái Charter stuck ở 進行中, không rõ error handling |
| Batch auto-transition 5 ngày (timezone) | **Medium** | GAP-711 + GAP-713: nếu batch chạy theo JST nhưng filter theo browser timezone → inconsistency |

### Technical Risk

| Risk | Impact | Lý do |
|------|--------|-------|
| Dense layout + nhiều cột → performance | **Medium** | Cỡ trang mặc định chưa rõ (GAP-701); nếu 50+ rows × 8 cột → render chậm |
| State management filter + sort + pagination | **Medium** | 3 state phải giữ đồng thời; regressions hay gặp khi kết hợp |
| Date picker timezone inconsistency | **Medium** | GAP-711: browser timezone khác JST → filter ngày trả về sai ngày |

---

## 4. Test Scope

### In Scope

- Hiển thị danh sách kế hoạch: tất cả trạng thái, cả 2 luồng (thường & Charter)
- Lọc theo 6 tiêu chí riêng lẻ và kết hợp AND
- Sort theo 3 cột (ID, 出荷予定日, 納品予定日) — ASC/DESC toggle
- Phân trang: chuyển trang, giữ filter & sort
- Badge trạng thái: 5 values, 2 luồng, màu sắc (pending UI guideline)
- Điều hướng sang P-01 (sau khi GAP-703 confirmed)
- Quyền truy cập: 管理, 物流, unauthorized user
- Xử lý lỗi: empty state, network error, integration failure
- Initial load behavior (sau khi GAP-708, GAP-709 confirmed)
- Validation bộ lọc: date range end < start

### Out of Scope

| Hạng mục | Lý do loại trừ |
|----------|----------------|
| Tạo / sửa / xóa kế hoạch | Màn khác (không phải T-01) |
| Logic cập nhật trạng thái (batch/webhook/SATO API) | Integration testing riêng; T-01 chỉ hiển thị kết quả |
| P-01 企画詳細 chi tiết | Scope của màn P-01 |
| API contract testing | Tài liệu IF riêng |
| Export CSV/Excel | Chưa có trong spec T-01 |
| Mobile/tablet responsive | Spec chỉ định Dense layout cho desktop |

---

## 5. Test Approach

### Test Levels

| Level | Áp dụng cho |
|-------|------------|
| **System Testing** | Toàn bộ chức năng T-01: filter, sort, pagination, navigation, badge, permission |
| **Integration Testing** | SATO down scenario, Charter count sync failure, auto-transition state |
| **UAT** | Verify với 管理 và 物流 role trên staging environment |

### Test Types

| Type | Mục tiêu | Ưu tiên |
|------|----------|---------|
| **Functional** | Filter logic (AND), sort, pagination, navigation to P-01, badge display | High |
| **Data** | State machine transitions, Charter vs normal, null field handling | High |
| **Security** | Access control, unauthorized redirect | High |
| **Integration** | SATO down, Charter sync failure, batch timing | Medium |
| **UI/Visual** | Badge màu sắc, sort icon, loading indicator, empty state | Medium (pending guideline) |
| **Performance** | Page load < 3s với dataset representative | Low |

---

## 6. Test Focus Areas

### Critical Logic
1. **AND logic** giữa tất cả điều kiện filter — blank field không tham gia query
2. **Date range matching** 展開期間 (intersect/within/contains — sau khi GAP-704 confirmed)
3. **State machine badge** — đúng trạng thái cho đúng luồng (Charter không có 配達完了)
4. **Auto-transition 5 ngày** — calendar days, timezone, trigger mechanism

### Complex Validation
1. Date range filter: end < start → phải bị chặn
2. Text search: phân biệt ID lookup vs name partial match (GAP-706)
3. Dropdown クライアント: active vs suspended vs soft-deleted display logic
4. Trim text input: khoảng trắng đầu/cuối bị loại bỏ trước khi query

### Edge Cases
1. Kế hoạch với **展開期間 null** — hiển thị và filter behavior
2. Kế hoạch với **出荷予定日/納品予定日 null** — sort order (NULLS FIRST/LAST)
3. **Empty result** sau filter — empty state display
4. **Một bản ghi** duy nhất — pagination behavior (disabled?)
5. **Charter partial sync** — trạng thái stuck, error recovery
6. **Khách hàng bị soft-delete** sau khi kế hoạch tạo — cột hiển thị gì

### High-Risk Data Scenarios
1. Charter flag = true + tất cả 4 trạng thái
2. Kế hoạch ở ranh giới 5 ngày (ngày 4 vs ngày 5 vs ngày 6)
3. 展開期間 overlap với boundary của date range filter
4. Nhiều kế hoạch cùng 出荷予定日 — sort stability

---

## 7. Test Data Strategy

### Key Data Cần Chuẩn Bị

| Nhóm | Data cần có |
|------|-------------|
| **Kế hoạch — Luồng thường** | 1 bản ghi × 5 trạng thái: 未対応, 進行中, 配送中, 配達完了, 完了 |
| **Kế hoạch — Luồng Charter** | 1 bản ghi × 4 trạng thái: 未対応, 進行中, 配送中, 完了 |
| **Kế hoạch — Ngày null** | 出荷予定日=null, 納品予定日=null, 展開期間=null |
| **Kế hoạch — Biên giới 5 ngày** | Bản ghi ở ngày thứ 4, 5, 6 sau 配達完了 (thường) / 配送中 (Charter) |
| **Khách hàng** | 1 active, 1 suspended (停止中), 1 soft-deleted |
| **多 kế hoạch cùng 出荷予定日** | ≥ 3 bản ghi cùng ngày để test sort stability |
| **Tên kế hoạch đặc biệt** | Chứa ký tự Nhật (全角/半角), số, khoảng trắng đầu/cuối |
| **Volume test** | > 100 bản ghi để test pagination; > 1000 để test performance |

### Data Dependencies

```
クライアント master ──→ dropdown filter + cột khách hàng trên bảng
Charter flag (GAP-712) ──→ badge state machine selection
SATO integration ──→ trạng thái 進行中, 配送中 (cả 2 luồng)
送り状No. ──→ trạng thái 配送中 (luồng thường)
Batch job ──→ tự động 完了 (sau 5 ngày)
```

---

## 8. Automation Strategy

### Nên Automate (ROI Cao)

| Test area | Lý do |
|-----------|-------|
| Smoke test: màn hình render, 5 badge hiển thị đúng | Chạy mỗi deploy, nhanh, stable |
| Happy path: load list → filter đơn → chuyển trang → open P-01 | Regression regression core flow |
| Filter AND logic: các combination phổ biến (khách hàng + trạng thái, date range đơn) | Nhiều combination, dễ bị regression |
| Sort: 3 cột × ASC/DESC | Rule đơn giản, dễ assert |
| Access control: unauthorized redirect | Security smoke, không thay đổi thường xuyên |

### Nên Manual

| Test area | Lý do |
|-----------|-------|
| Visual: badge màu sắc, sort icon, loading indicator | Pending UI guideline; assertion màu khó maintain |
| UX exploratory: Dense layout usability, filter area overflow | Cần human judgment |
| Charter partial sync edge case | Cần coordination với SATO mock setup |
| UAT với real 管理/物流 users | Business validation, cần end user |
| Performance test | Cần production-like environment và data volume |
| One-off: null value display, 5-day boundary exact timing | Chạy 1 lần, không regression |

---

## 9. Entry / Exit Criteria

### Entry Criteria

- [ ] Môi trường test deploy thành công, API up
- [ ] Test data chuẩn bị xong theo Data Strategy (mục 7)
- [ ] Các **blocking gaps confirm**: **G-001 (GAP-703)**, **G-004 (GAP-704)**, **G-003 (GAP-708)**, **G-006 (GAP-712)** đã có answer từ BA/Dev
- [ ] Build pass CI (unit tests, lint)
- [ ] UI guideline badge màu sắc đã có (cho visual test)

### Exit Criteria

- [ ] 100% test cases **High priority** passed
- [ ] **Medium priority** ≥ 90% passed
- [ ] Không còn open bug severity **Critical** hoặc **High**
- [ ] Tất cả **Need confirm spec?** gaps đã được: confirm + test thêm, HOẶC documented accepted risk
- [ ] Performance test đạt < 3 giây với dataset chuẩn (sau khi GAP-701 confirmed)

---

## 10. Gaps & Questions

### Đã Confirmed (từ D-14)

| Gap | Nội dung | Trạng thái |
|-----|----------|------------|
| Filter AND logic | Giữa các nhóm điều kiện là AND; ô trống sau trim không tham gia | ✅ Confirmed từ D-14 §Hành động |
| Sortable columns | Chỉ ID, 出荷予定日, 納品予定日 | ✅ Confirmed từ D-14 §Bố cục màn hình |
| Reset page on filter | Khi áp dụng lọc → reset về trang 1 | ✅ Confirmed từ D-14 §Hành động |
| Keep filter on pagination | Giữ điều kiện lọc và sort khi chuyển trang | ✅ Confirmed từ D-14 §Hành động |
| Empty state | Tồn tại khi danh sách rỗng | ✅ Confirmed từ D-14 §Xử lý lỗi |
| Network error → toast | Lỗi tải danh sách → toast đỏ (chi tiết → D-00) | ✅ Confirmed từ D-14 §Xử lý lỗi |
| Role access | Chỉ 管理 và 物流 | ✅ Confirmed từ D-14 §Quyền |
| 5 status values | 未対応, 進行中, 配送中, 配達完了, 完了 | ✅ Confirmed từ D-14 §Quản lý trạng thái |
| State machines | Cả 2 sơ đồ trạng thái (thường & Charter) | ✅ Confirmed từ D-14 §Sơ đồ trạng thái |
| Client filter: soft-delete | Không hiển thị soft-deleted, hiển thị suspended | ✅ Confirmed từ D-14 §3 (phần tử #2) |
| Text trim | Trim đầu/cuối trước khi apply; sau trim rỗng = không lọc | ✅ Confirmed từ D-14 §3 (phần tử #7) |
| Date range validation | Ngày kết thúc ≥ ngày bắt đầu (nếu cả hai nhập) | ✅ Confirmed từ D-14 §3 (phần tử #3) |
| Sort toggle ASC/DESC | Click header: toggle tăng/giảm | ✅ Confirmed từ D-14 §3 (phần tử 10-1) |
| Charter auto-完了 | Sau 5 ngày từ 配送中, không qua 配達完了 | ✅ Confirmed từ D-14 §Luồng Charter |
| Inline error position | Lỗi validation ô lọc → hiển thị dưới ô (inline đỏ) | ✅ Confirmed từ D-14 §Xử lý lỗi |
| G-001 (GAP-703) | Điều hướng P-01: có thể dùng tất cả — click toàn dòng, click ID, click tên kế hoạch, và nút/icon chi tiết | ✅ Confirmed từ BA (2026-05-04) |

### Partially Confirmed — Cần làm rõ thêm

| Gap | Nội dung | Phần còn pending |
|-----|----------|-----------------|
| G-010 | "5 ngày" confirmed, nhưng calendar vs business days chưa rõ | Xác nhận calendar/business + timezone |
| G-016 | Validate rule confirmed, nhưng error message cụ thể và block-submit chưa rõ | D-00_Message definition.md |
| G-017 | Client-side block implied, nhưng server behavior (400 vs ignore) chưa rõ | Confirm với Dev |
| G-025 | Single-sort là intent ("chỉ một tiêu chí sort chính"), nhưng GAP-709 chưa đóng dứt khoát | BA/PM confirm single-sort final |
| G-026 | Toast on error confirmed; session expire redirect behavior chưa rõ | D-00_Message definition.md |

### Chưa Confirmed — `Need confirm spec?`

> **Các gap dưới đây cần BA/Dev xác nhận trước khi viết Test Viewpoints**

| Gap | Category | Nội dung gap | Risk | Impact nếu không confirm |
|-----|----------|-------------|------|--------------------------|
| ~~G-001~~ | Functional | ~~GAP-703 — Đã confirmed~~ | ~~High~~ | ~~Moved to Confirmed~~ |
| **G-002** | Functional | **GAP-702** — Submit bộ lọc: nhấn nút hay auto-apply? | **High** | TC filter sẽ sai hoàn toàn nếu mechanism khác |
| **G-003** | Functional | **GAP-708** — Sort mặc định khi vào màn hình (cột nào, chiều nào)? | **High** | Không validate được initial load TC |
| **G-004** | Business Logic | **GAP-704** — Quy tắc so khớp 展開期間: intersect, within, hay contains? | **High** | Toàn bộ TC filter 展開期間 sẽ sai nếu quy tắc khác |
| **G-005** | Business Logic | Charter partial sync: trạng thái khi chỉ một phần số lượng gửi thành công? | **High** | Không test được Charter partial failure path |
| **G-006** | Business Logic | **GAP-712** — Trường phân biệt Charter trong DB (tên cột, kiểu dữ liệu, giá trị)? | **High** | Không tạo được test data Charter; không validate badge |
| **G-007** | Integration | **GAP-713** — Cơ chế auto-update trạng thái: batch/webhook/polling, tần suất? | **High** | Không biết khi nào test state transition; nếu batch 1 lần/ngày → không test real-time |
| **G-008** | Integration | SATO down fallback: cached value, unknown badge, hay toast? | **High** | Không test được degraded mode |
| **G-009** | Functional | Initial load: tất cả kế hoạch hay có filter mặc định? | **High** | TC initial state sai |
| G-011 | Data | **GAP-706** — Match type: ID exact/partial, name partial; phân biệt hoa thường? | Medium | TC search sẽ sai về expected result |
| G-012 | Data | **GAP-705** — Max length ô tìm text? | Medium | Không test boundary length |
| G-013 | Data | **GAP-707** — Format hiển thị 展開期間 trên bảng? | Medium | Visual TC sẽ sai |
| G-014 | Data | Soft-deleted client sau khi kế hoạch tạo → cột khách hàng hiển thị gì? | Medium | Không test được data integrity scenario |
| G-015 | Data | **GAP-711** — Timezone date picker và bảng: JST hay browser? | Medium | TC filter ngày có thể sai nếu test từ ngoài JST |
| G-018 | Business Logic | Dropdown ステータス có option "全て" không? Giá trị mặc định? | Medium | TC initial filter state không rõ |
| G-019 | Business Logic | Filter theo khách hàng "tạm dừng": có indicator "(停止中)" trên dropdown không? | Medium | Visual TC |
| G-020 | UI/UX | Màu sắc badge cho 5 trạng thái? | Medium | Visual TC bị block (pending UI guideline) |
| G-021 | UI/UX | **GAP-702** — Nhãn nút áp dụng lọc? Có nút Clear bộ lọc không? | Medium | TC verify UI text |
| G-022 | UI/UX | **GAP-701** — Cỡ trang mặc định? Format pagination (tổng số records)? | Medium | TC pagination không rõ expected |
| G-023 | Edge Case | 展開期間 = null: hiển thị gì, filter behavior? | Medium | Edge case TC |
| G-024 | Edge Case | Sort với NULL 出荷予定日/納品予定日: NULLS FIRST hay LAST? | Medium | Sort TC với null data |
| G-027 | Non-functional | < 3 giây cho cỡ trang mặc định hay tối đa? | Medium | Performance acceptance criteria không rõ |
| G-028 | Functional | Có nút Reset/Clear bộ lọc không? | Low | UX TC |
| G-029 | Data | Format ID kế hoạch (số nguyên, UUID, prefix)? | Low | Ảnh hưởng search TC |
| G-030 | UI/UX | Loading indicator: skeleton, spinner, hay overlay? | Low | Visual TC |
| G-031 | UI/UX | Sort icon: click lần 3 có toggle về "no sort" không? | Low | Sort UX TC |
| G-032 | Edge Case | 2 tab cùng T-01, URL encode filter state? | Low | Multi-tab behavior |
| G-033 | Non-functional | Unauthorized access: redirect về đâu? Validate ở tầng nào? | Low | Security TC redirect |
| G-034 | UI/UX | Filter area có collapse/expand không? | Low | Layout TC |
| G-035 | Non-functional | Có chức năng export không? | Low | Feature completeness |

---

**Tổng hợp gaps:**

| Trạng thái | Số lượng |
|------------|----------|
| ✅ Confirmed từ D-14 | 15 |
| ✅ Confirmed từ BA | 1 (G-001) |
| ⚠ Partially confirmed | 5 |
| **Need confirm spec?** | **28** (8 High + 13 Medium + 7 Low) |

> **Ưu tiên confirm trước khi viết Test Viewpoints: G-004, G-006 (blocking test data & core flow)**
