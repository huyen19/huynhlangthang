# TVP_T-01_企画一覧TOP.md

| Mục | Nội dung |
|-----|----------|
| **File** | TVP_T-01_企画一覧TOP_ver1.md |
| **Màn hình** | T-01 — 企画一覧（トップ）/ Danh sách Kế hoạch — Trang chủ |
| **Tài liệu tham chiếu** | `Requirements/T-01/T-01_企画一覧（トップ）_VN.md` · `Test Strategy/TS_T-01_企画一覧TOP_ver1.md` · `Test Q&A/Q&A_T-01_企画一覧TOP_ver1.md` |
| **UI Mock** | `Requirements/T-01/T01.png` |
| **Tổng số TVP** | 85 |

---

## Bước 1 — Mục tiêu kiểm thử

| Module | Feature | Key Functionalities |
|--------|---------|---------------------|
| FM資材管理システム | T-01 企画一覧（TOP） | Initial load, Filter/Search (6 tiêu chí AND), Sort (3 cột), Pagination, Badge trạng thái (2 luồng), Navigation P-01, Access control, Error handling, Data mapping |

---

## Bước 2–5 — Bảng TVP

| ID TVP | Sub-section | Feature | TVP Description | Test Type | Priority | Method test |
|--------|-------------|---------|-----------------|-----------|----------|-------------|
| **SECTION 1 — HIỂN THỊ BAN ĐẦU (INITIAL LOAD)** |
| TVP-001 | UI | Page title | Tiêu đề màn hình hiển thị đúng「企画一覧」— verify static text theo spec §1 | UI | High | Manual |
| TVP-002 | UI | Filter field labels | Khu vực lọc hiển thị đủ 6 label đúng: 「クライアント」「展開期間」「出荷予定日」「納品予定日」「ステータス」và label ô keyword theo spec §3 | UI | High | Manual |
| TVP-003 | UI | Table column headers | Bảng danh sách hiển thị đủ các header cột: ID, 企画名, クライアント, 展開期間, 出荷予定日, 納品予定日, ステータス (và cột thao tác nếu có) — đúng thứ tự theo spec §3 | UI | High | Manual |
| TVP-004 | UI | Sort icon on header | 3 header cột sortable (ID, 出荷予定日, 納品予定日) hiển thị icon sort; các cột không sort (企画名, クライアント, 展開期間, ステータス) không có icon sort và không phản hồi click | UI | Medium | Manual |
| TVP-005 | Functional | Initial load — list display | Vào `/` (sau đăng nhập) → danh sách kế hoạch được tải; sort mặc định được áp dụng [⚠️ Need Confirm GAP-708 — Q&A G-003]; filter area ở trạng thái trống; trang 1 được hiển thị | Functional | Critical | E2E |
| TVP-006 | Functional | Initial load — filter state | Khi vào màn hình lần đầu, tất cả filter fields ở trạng thái rỗng/mặc định; dropdown クライアント không chọn; dropdown ステータス hiển thị mặc định [⚠️ Need Confirm G-009 — hiển thị toàn bộ hay có filter mặc định] | Functional | High | Manual |
| **SECTION 2 — LỌC / TÌM KIẾM (FILTER / SEARCH)** |
| TVP-007 | UI | Filter apply button | Nút áp dụng bộ lọc hiển thị đúng nhãn theo spec (GAP-702); [⚠️ Need Confirm G-021 — nhãn「検索」/「絞り込む」/text khác] | UI | Medium | Manual |
| TVP-008 | Functional | Filter mechanism | Cơ chế áp dụng lọc: khi nhấn nút Tìm → danh sách được tải lại với điều kiện đã nhập [⚠️ Need Confirm G-002 — submit-on-button vs auto-apply; TVP này giả định submit-on-button] | Functional | High | E2E |
| TVP-009 | Functional | Filter by クライアント — happy path | Chọn một クライアント từ dropdown → chỉ hiển thị kế hoạch của khách hàng đó; số bản ghi khớp với DB | Functional | Critical | E2E |
| TVP-010 | Functional | Filter by クライアント — soft-deleted excluded | Dropdown クライアント không chứa bản ghi đã xóa mềm (soft-deleted); verify bằng DB so sánh danh sách option với master table | Data | High | Manual |
| TVP-011 | Functional | Filter by クライアント — suspended included | Dropdown クライアント hiển thị bản ghi khách hàng tạm dừng (停止中); chọn → kế hoạch liên quan vẫn hiển thị [⚠️ Need Confirm G-019 — có indicator "(停止中)" không] | Functional | High | Manual |
| TVP-012 | Functional | Filter by 展開期間 — happy path | Nhập khoảng ngày hợp lệ → danh sách trả về kế hoạch có 展開期間 khớp theo quy tắc [⚠️ Need Confirm G-004/GAP-704 — intersect/within/contains; TVP cần được cập nhật sau khi confirm] | Functional | Critical | E2E |
| TVP-013 | Functional | Filter by 展開期間 — only start date | Nhập chỉ ngày bắt đầu (để trống ngày kết thúc) → behavior theo spec §3 phần tử #3 (ô trống = không áp dụng điều kiện) | Functional | Medium | Manual |
| TVP-014 | Functional | Filter by 出荷予定日 — happy path | Chọn một ngày cụ thể → chỉ hiển thị kế hoạch có 出荷予定日 đúng ngày đó; verify bằng DB | Functional | High | E2E |
| TVP-015 | Functional | Filter by 出荷予定日 — empty | Để trống 出荷予定日 → không áp dụng điều kiện lọc này; kết quả không bị giới hạn theo ngày | Functional | Medium | Manual |
| TVP-016 | Functional | Filter by 納品予定日 — happy path | Chọn một ngày cụ thể → chỉ hiển thị kế hoạch có 納品予定日 đúng ngày đó; verify bằng DB | Functional | High | E2E |
| TVP-017 | Functional | Filter by ステータス — each value | Chọn lần lượt từng giá trị (未対応/進行中/配送中/配達完了/完了) → chỉ hiển thị kế hoạch có đúng trạng thái đó; 5 test cases riêng biệt | Functional | Critical | E2E |
| TVP-018 | Functional | Filter by ステータス — default/all | Dropdown ステータス ở trạng thái mặc định (rỗng / "全て") → không lọc theo trạng thái; tất cả kế hoạch hiển thị [⚠️ Need Confirm G-018 — có option "全て" không] | Functional | High | Manual |
| TVP-019 | Functional | Filter by keyword — name partial match | Nhập một phần tên kế hoạch → trả về kế hoạch có tên chứa chuỗi đã nhập [⚠️ Need Confirm G-011/GAP-706 — partial match confirmed?] | Functional | Critical | E2E |
| TVP-020 | Functional | Filter by keyword — ID match | Nhập ID kế hoạch (số) → trả về đúng kế hoạch có ID đó [⚠️ Need Confirm G-011 — exact match hay partial; G-029 — ID format] | Functional | Critical | E2E |
| TVP-021 | Functional | Filter by keyword — trim whitespace | Nhập "  テスト  " (khoảng trắng đầu/cuối) → trim trước khi query; kết quả như nhập "テスト" không có khoảng trắng | Functional | Medium | Manual |
| TVP-022 | Validation | Filter 展開期間 — end < start | Nhập 展開期間 với ngày kết thúc < ngày bắt đầu → hiển thị lỗi inline bên dưới ô; nút Tìm bị disabled hoặc không gửi request [⚠️ Need Confirm G-016 — error message cụ thể và vị trí hiển thị] | Validation | High | Manual |
| TVP-023 | Validation | Filter keyword — max length | Nhập N+1 ký tự vào ô keyword (N = max length) → bị chặn nhập thêm hoặc hiển thị lỗi [⚠️ Need Confirm G-012/GAP-705 — max length chưa xác định; mark AMBIGUOUS] | Validation | Medium | Manual |
| TVP-024 | Negative | Filter — no matching result | Áp dụng filter không có kết quả nào → hiển thị empty state (theo spec §Xử lý lỗi); không hiện bảng trống không có message | Negative | High | E2E |
| TVP-025 | Negative | Filter keyword — SQL injection | Nhập `' OR 1=1--` vào ô keyword → hệ thống không crash; không trả về toàn bộ records; không lỗi JS | Negative | High | Manual |
| TVP-026 | Negative | Filter keyword — XSS | Nhập `<script>alert(1)</script>` vào ô keyword → không execute script; hiển thị như chuỗi thường hoặc bị reject | Negative | High | Manual |
| TVP-027 | Negative | Filter keyword — spaces only | Nhập "   " (chỉ khoảng trắng) → sau trim rỗng → không áp dụng điều kiện keyword; kết quả giống như để trống | Negative | Medium | Manual |
| TVP-028 | Negative | Filter — API error during search | Nhấn Tìm → API trả về lỗi (5xx) → hiển thị toast lỗi đỏ theo spec §Xử lý lỗi; UI không crash | Negative | High | Manual |
| TVP-029 | Functional | AND logic — 2 filters combined | Kết hợp クライアント + ステータス → chỉ hiển thị bản ghi thỏa cả 2 điều kiện (AND); verify bằng DB count | Functional | Critical | E2E |
| TVP-030 | Functional | AND logic — 展開期間 + keyword combined | Kết hợp 展開期間 date range + keyword → chỉ hiển thị bản ghi thỏa cả 2 (AND) | Functional | High | Manual |
| TVP-031 | Functional | AND logic — Decision Table (pairwise) | Test 4 tổ hợp đại diện: (1) クライアント=có giá trị, ステータス=rỗng → lọc theo A; (2) クライアント=rỗng, ステータス=có giá trị → lọc theo B; (3) cả 6 filter có giá trị → lọc AND tất cả; (4) tất cả rỗng → không filter, trả về tất cả | Functional | High | Manual |
| TVP-032 | Functional | Pagination reset after filter | Sau khi apply filter → danh sách reset về trang 1 (không giữ trang hiện tại) | Functional | High | E2E |
| TVP-033 | Functional | Filter state kept on pagination | Sau khi filter và chuyển trang → điều kiện filter vẫn được giữ; trang 2+ trả về kết quả theo cùng điều kiện lọc | Functional | High | E2E |
| TVP-034 | Edge Case | Keyword — Japanese fullwidth/halfwidth | Nhập ký tự tiếng Nhật fullwidth (全角) vào keyword → kết quả đúng theo spec [⚠️ Need Confirm G-011 — có normalize fullwidth/halfwidth không] | Edge Case | Medium | Manual |
| TVP-035 | Edge Case | Filter 展開期間 — same start/end date | Nhập ngày bắt đầu = ngày kết thúc → hợp lệ; trả về kế hoạch theo quy tắc match [⚠️ Need Confirm G-004] | Edge Case | Medium | Manual |
| **SECTION 3 — SẮP XẾP (SORT)** |
| TVP-036 | Functional | Sort by ID — ASC | Click header「ID」lần 1 → sort tăng dần; icon ▲ active; verify thứ tự bản ghi từ nhỏ đến lớn | Functional | High | E2E |
| TVP-037 | Functional | Sort by ID — DESC | Click header「ID」lần 2 → sort giảm dần; icon ▼ active; verify thứ tự bản ghi từ lớn đến nhỏ | Functional | High | E2E |
| TVP-038 | Functional | Sort by 出荷予定日 — ASC/DESC | Click header「出荷予定日」→ toggle ASC/DESC; thứ tự bản ghi khớp với giá trị ngày tăng dần/giảm dần | Functional | High | E2E |
| TVP-039 | Functional | Sort by 納品予定日 — ASC/DESC | Click header「納品予定日」→ toggle ASC/DESC; thứ tự bản ghi khớp với giá trị ngày tăng dần/giảm dần | Functional | High | E2E |
| TVP-040 | Functional | Default sort on load | Khi vào màn hình, danh sách áp dụng sort mặc định đúng [⚠️ Need Confirm G-003/GAP-708 — cột và chiều sort mặc định chưa xác định] | Functional | High | Manual |
| TVP-041 | Functional | Non-sortable columns | Click vào header「企画名」「クライアント」「展開期間」「ステータス」→ danh sách không thay đổi thứ tự; không có icon sort trên các cột này | Functional | Medium | Manual |
| TVP-042 | Functional | Sort + filter combination | Sort theo 出荷予定日 ASC + filter ステータス=進行中 → kết quả vừa đúng filter vừa đúng thứ tự sort | Functional | High | E2E |
| TVP-043 | Edge Case | Sort with NULL values | Sort 出荷予定日 hoặc 納品予定日 khi có bản ghi null → NULL values xếp đầu hoặc cuối (nhất quán) [⚠️ Need Confirm G-024 — NULLS FIRST/LAST chưa xác định] | Edge Case | Medium | Manual |
| TVP-044 | Edge Case | Single-sort behavior | Đang sort theo ID → click header 出荷予定日 → chỉ sort theo 出荷予定日; sort ID bị cleared [⚠️ Need Confirm G-025/GAP-709 — single vs multi-sort; TVP này theo single-sort intent của spec] | Edge Case | Medium | Manual |
| **SECTION 4 — PHÂN TRANG (PAGINATION)** |
| TVP-045 | UI | Pagination UI display | Phân trang hiển thị đúng format theo spec: số trang hiện tại, tổng trang, và/hoặc tổng số bản ghi [⚠️ Need Confirm G-022/GAP-701 — format và cỡ trang chưa xác định] | UI | Medium | Manual |
| TVP-046 | Functional | Next page navigation | Click trang tiếp theo → tải dữ liệu trang 2; filter và sort được giữ nguyên | Functional | High | E2E |
| TVP-047 | Functional | Previous page navigation | Từ trang 2, click trang trước → tải lại trang 1; filter và sort được giữ nguyên | Functional | High | E2E |
| TVP-048 | Functional | Jump to specific page | Click số trang bất kỳ (nếu có) → tải đúng trang đó; data không bị missing | Functional | Medium | Manual |
| TVP-049 | Functional | Last page — no missing data | Vào trang cuối → hiển thị đúng số bản ghi còn lại (không đủ cỡ trang → partial page); không lỗi | Functional | High | Manual |
| TVP-050 | Functional | Filter state kept on next page | Sau khi filter và chuyển trang 2 → điều kiện filter vẫn active; bản ghi trang 2 vẫn match filter | Functional | High | E2E |
| TVP-051 | Data | Total records count vs DB | Tổng số bản ghi hiển thị trên UI (pagination info) khớp với số record trong DB thỏa điều kiện filter hiện tại | Data | High | Manual |
| **SECTION 5 — BADGE TRẠNG THÁI (STATUS)** |
| TVP-052 | Functional | Normal flow — 未対応 badge | Kế hoạch mới đăng ký (非Charter) → badge hiển thị「未対応」; màu đúng guideline [⚠️ Need Confirm G-020 — màu chưa xác định] | Functional | Critical | Manual |
| TVP-053 | Functional | Normal flow — 進行中 badge | Kế hoạch đã truyền xuống SATO (非Charter) → badge「進行中」 | Functional | Critical | Manual |
| TVP-054 | Functional | Normal flow — 配送中 badge | Kế hoạch đã phát hành 送り状No. (非Charter) → badge「配送中」 | Functional | Critical | Manual |
| TVP-055 | Functional | Normal flow — 配達完了 badge | Đơn vị vận chuyển báo hoàn thành (非Charter) → badge「配達完了」; badge này KHÔNG xuất hiện trong luồng Charter | Functional | Critical | Manual |
| TVP-056 | Functional | Normal flow — 完了 badge | Sau 5 ngày kể từ 配達完了 (非Charter) → badge「完了」[⚠️ Need Confirm G-010 — calendar days hay business days; timezone] | Functional | High | Manual |
| TVP-057 | Functional | Charter flow — badge 配達完了 NOT shown | Kế hoạch Charter ở bất kỳ giai đoạn nào → badge「配達完了」KHÔNG bao giờ xuất hiện [⚠️ Need Confirm G-006/GAP-712 — trường phân biệt Charter trong DB chưa xác định; không thể tạo test data] | Functional | Critical | Manual |
| TVP-058 | Functional | Charter flow — 完了 after 配送中 | Kế hoạch Charter: sau 5 ngày kể từ「配送中」→ tự động chuyển「完了」(không qua 配達完了) [⚠️ Need Confirm G-006/GAP-712, G-007/GAP-713] | Functional | Critical | Manual |
| TVP-059 | Functional | Badge label mapping | Badge hiển thị đúng nhãn tiếng Nhật: 未対応/進行中/配送中/配達完了/完了; không bị typo, không dịch sai | UI | High | Manual |
| TVP-060 | Functional | Filter by ステータス → badge consistency | Filter ステータス=配送中 → tất cả bản ghi trong kết quả hiển thị badge「配送中」; không có bản ghi badge khác lọt qua | Functional | High | E2E |
| TVP-061 | State | State machine — no manual transition on T-01 | Màn T-01 chỉ hiển thị trạng thái; không có action nào cho phép thay đổi trạng thái từ màn này; tất cả transitions là automatic | Functional | High | Manual |
| **SECTION 6 — ĐIỀU HƯỚNG SANG P-01** |
| TVP-062 | Functional | Click row → navigate to P-01 | Click vào toàn dòng kế hoạch → điều hướng sang màn P-01 với đúng 企画ID ✅ Confirmed (G-001) | Functional | Critical | E2E |
| TVP-063 | Functional | Click ID cell → navigate to P-01 | Click vào giá trị ô ID → điều hướng sang P-01 với đúng 企画ID ✅ Confirmed (G-001) | Functional | Critical | E2E |
| TVP-064 | Functional | Click 企画名 → navigate to P-01 | Click vào giá trị ô 企画名 → điều hướng sang P-01 với đúng 企画ID ✅ Confirmed (G-001) | Functional | Critical | E2E |
| TVP-065 | Functional | Correct 企画ID passed to P-01 | Khi điều hướng sang P-01, URL hoặc context chứa đúng 企画ID của dòng đã click; P-01 load đúng chi tiết kế hoạch | Functional | Critical | E2E |
| **SECTION 7 — PHÂN QUYỀN TRUY CẬP** |
| TVP-066 | Security | Role 管理 — access granted | User có vai trò「管理」đăng nhập → truy cập `/` thành công; danh sách kế hoạch hiển thị bình thường | Security | Critical | E2E |
| TVP-067 | Security | Role 物流 — access granted | User có vai trò「物流」đăng nhập → truy cập `/` thành công; danh sách hiển thị bình thường | Security | Critical | E2E |
| TVP-068 | Security | Other roles — access denied | User với vai trò không phải 管理/物流 cố truy cập `/` → bị từ chối; redirect về login hoặc trang lỗi [⚠️ Need Confirm G-033 — redirect về đâu; validate ở tầng nào] | Security | Critical | Manual |
| **SECTION 8 — XỬ LÝ LỖI / SYSTEM BEHAVIOR** |
| TVP-069 | System Behavior | Network error — toast display | Khi tải danh sách bị lỗi mạng → hiển thị toast đỏ (theo spec §Xử lý lỗi); UI không crash; nội dung toast theo D-00_Message definition.md | System Behavior | High | Manual |
| TVP-070 | System Behavior | Empty list — empty state | DB không có kế hoạch nào (hoặc filter không match) → hiển thị empty state; không hiện bảng trống; message rõ ràng | System Behavior | High | E2E |
| TVP-071 | System Behavior | Session expire during operation | Session hết hạn khi đang thao tác (nhấn Tìm hoặc chuyển trang) → hệ thống redirect hoặc thông báo lỗi [⚠️ Need Confirm G-026 — redirect về login hay toast trước?] | System Behavior | High | Manual |
| TVP-072 | System Behavior | Integration failure (SATO down) | SATO hoặc hệ thống cấp cao down → badge trạng thái xử lý theo fallback [⚠️ Need Confirm G-008 — cached value hay unknown state hay toast?] | System Behavior | High | Manual |
| TVP-073 | System Behavior | Loading indicator | Khi đang tải danh sách (sau filter, sort, page change) → hiển thị loading indicator (spinner/skeleton) [⚠️ Need Confirm G-030 — loại indicator chưa xác định] | System Behavior | Medium | Manual |
| **SECTION 9 — DATA INTEGRITY / DB ↔ UI MAPPING** |
| TVP-074 | Data | ID column — DB mapping | Cột ID trên UI khớp với khóa 企画ID trong DB; không bị swap với record khác; không bị truncated | Data | Critical | Manual |
| TVP-075 | Data | 企画名 column — DB mapping | Cột 企画名 hiển thị đúng tên kế hoạch từ DB; ký tự tiếng Nhật không bị corrupt | Data | Critical | Manual |
| TVP-076 | Data | クライアント column — active client | Cột クライアント hiển thị tên khách hàng active; tên khớp với giá trị trong bảng master クライアント | Data | High | Manual |
| TVP-077 | Data | クライアント column — soft-deleted after plan created | Kế hoạch liên kết với khách hàng đã bị soft-delete → cột クライアント hiển thị theo quy tắc đã confirm [⚠️ Need Confirm G-014 — snapshot/placeholder/""/text khác] | Data | Medium | Manual |
| TVP-078 | Data | 展開期間 column — format display | Cột 展開期間 hiển thị đúng format ngày (từ–đến) [⚠️ Need Confirm G-013/GAP-707 — format "YYYY/MM/DD〜YYYY/MM/DD" hay khác] | Data | Medium | Manual |
| TVP-079 | Data | 展開期間 column — null display | Kế hoạch có 展開期間 = null → cột hiển thị placeholder đúng spec (「-」hay rỗng) [⚠️ Need Confirm G-023] | Data | Medium | Manual |
| TVP-080 | Data | 出荷予定日 column — format and null | 出荷予定日 hiển thị đúng format ngày theo chuẩn UI dự án; khi null → hiển thị placeholder đúng | Data | Medium | Manual |
| TVP-081 | Data | 納品予定日 column — format and null | 納品予定日 hiển thị đúng format ngày; khi null → placeholder đúng | Data | Medium | Manual |
| TVP-082 | Data | ステータス column — enum mapping | Giá trị trạng thái trong DB map đúng sang badge label tiếng Nhật trên UI; không bị hiển thị raw enum value | Data | Critical | Manual |
| TVP-083 | Data | Round-trip verify | Mở danh sách → click vào kế hoạch → vào P-01 → back về T-01: tất cả cột hiển thị đúng như trước khi navigate | Data | High | E2E |
| **SECTION 10 — USER BEHAVIOR** |
| TVP-084 | User Behavior | Double click row | Double-click vào một dòng → navigate sang P-01 chỉ một lần (không mở 2 tab hoặc navigate 2 lần) | User Behavior | Medium | Manual |
| TVP-085 | User Behavior | Browser back from P-01 | Từ P-01 nhấn Back browser → quay lại T-01; danh sách hiển thị lại [⚠️ ASSUMPTION — filter/sort/page state có được khôi phục không chưa xác định trong spec] | User Behavior | Medium | Manual |
| TVP-086 | User Behavior | Page refresh mid-operation | Đang nhập filter rồi F5 (refresh) → filter bị reset; danh sách tải lại từ đầu (hoặc URL giữ state nếu có) [⚠️ Need Confirm G-032 — URL có encode state không] | User Behavior | Low | Manual |
| **SECTION 11 — CONCURRENCY** |
| TVP-087 | Concurrency | Multiple users view simultaneously | 2 user 管理 mở T-01 cùng lúc → cả hai thấy danh sách đúng; không có data conflict | Concurrency | Low | Manual |
| TVP-088 | Concurrency | Status update while viewing | Trạng thái kế hoạch thay đổi (do batch/SATO) trong khi user đang xem T-01 → sau khi refresh/next action, badge được cập nhật đúng | Concurrency | Medium | Manual |

---

## Bước 6 — TVP Coverage Checklist (18 mục)

| # | Checklist Category | Trạng thái | Ghi chú |
|---|-------------------|-----------|---------|
| 1 | FUNCTIONAL (Happy Path) | ✔ | TVP-005, TVP-009, TVP-014, TVP-016, TVP-019, TVP-036–039, TVP-046–050, TVP-062–065 |
| 2 | INPUT VALIDATION (Field Level) | ✔ | T-01 không có form Create/Edit. Validation áp dụng cho filter fields: TVP-022 (date range), TVP-023 (keyword max length) |
| 3 | BOUNDARY VALUE (BVA) | ✔ | TVP-023 (keyword length boundary), TVP-035 (同日 date range), TVP-043 (NULL sort boundary) |
| 4 | NEGATIVE CASE | ✔ | TVP-024 (no result), TVP-025 (SQL injection), TVP-026 (XSS), TVP-027 (spaces-only), TVP-028 (API error) |
| 5 | USER BEHAVIOR (Real-world) | ✔ | TVP-084 (double click), TVP-085 (browser back), TVP-086 (refresh) |
| 6 | SYSTEM BEHAVIOR | ✔ | TVP-069 (network error), TVP-070 (empty state), TVP-071 (session expire), TVP-072 (SATO down), TVP-073 (loading) |
| 7 | DATA INTEGRITY | ✔ | TVP-074–083, TVP-051 (total count vs DB) |
| 8 | DB ↔ UI DATA MAPPING | ✔ | TVP-074–082 (column by column mapping), TVP-083 (round-trip) |
| 9 | INTEGRATION (API) | ✔ | TVP-028 (API error), TVP-072 (SATO integration failure), TVP-088 (state sync) — spec không mô tả API contract nên không test API schema trực tiếp |
| 10 | SECURITY (Basic) | ✔ | TVP-025 (SQL injection), TVP-026 (XSS), TVP-066–068 (access control by role) |
| 11 | UX/UI | ✔ | TVP-001 (title), TVP-002 (filter labels), TVP-003 (column headers), TVP-004 (sort icon), TVP-007 (button label), TVP-059 (badge labels) |
| 12 | STATE & FLOW | ✔ | TVP-052–061 (state machine 2 luồng), TVP-061 (no manual transition on T-01) |
| 13 | CONCURRENCY (Advanced) | ✔ | TVP-087 (multi-user), TVP-088 (state update while viewing) |
| 14 | DATA LIFECYCLE | ✔ | T-01 không có chức năng xóa/khôi phục. Covered partial: TVP-077 (soft-deleted client display sau khi plan tạo) |
| 15 | SEARCH / FILTER / SORT | ✔ | TVP-008–035 (filter/search đầy đủ theo guide-function-search.md: F/I/N/V/E/D categories), TVP-036–044 (sort) |
| 16 | PAGINATION / LARGE DATA | ✔ | TVP-045–051 (page navigation, filter keep, count verify) |
| 17 | CROSS-FIELD VALIDATION | ✔ | TVP-022 (date range end ≥ start), TVP-029–031 (AND logic giữa filter fields) |
| 18 | IMPORT / EXPORT | ✔ | T-01 không có chức năng import/export theo spec. Nếu có export sau này → cần TVP riêng (G-035 trong Q&A) |

> **Tất cả 18 mục đã được cover. Không có ✖ nào bị bỏ sót.**

---

## ⚠️ Các điểm cần làm rõ trước khi hoàn thiện TVP

| # | TVP ID liên quan | Gap ID (Q&A T-01) | Nội dung cần xác nhận | Lý do không thể tự suy diễn |
|---|-----------------|-------------------|----------------------|------------------------------|
| 1 | TVP-057, TVP-058 | **G-006 / GAP-712** | Trường phân biệt kế hoạch Charter trong DB (tên cột, kiểu, giá trị) | Không tạo được test data Charter → không validate badge Charter flow |
| 2 | TVP-012 | **G-004 / GAP-704** | Quy tắc so khớp 展開期間: intersect/within/contains? | Expected result TVP-012 hoàn toàn phụ thuộc vào quy tắc này |
| 3 | TVP-008 | **G-002 / GAP-702** | Cơ chế áp dụng lọc: submit-on-button hay auto-apply? | Steps TC sẽ khác hoàn toàn giữa 2 mechanism |
| 4 | TVP-005, TVP-040 | **G-003 / GAP-708** | Sort mặc định khi vào màn hình (cột + chiều) | Không thể assert kết quả initial load |
| 5 | TVP-022 | **G-016** | Error message cụ thể và vị trí hiển thị khi date range sai | Không biết expected text để verify |
| 6 | TVP-023 | **G-012 / GAP-705** | Max length ô keyword | Không thể viết BVA test case |
| 7 | TVP-056, TVP-058 | **G-010** | "5 ngày" = calendar hay business days? Timezone? | Test case 5-day boundary sẽ sai nếu assumption sai |
| 8 | TVP-068 | **G-033** | Unauthorized access redirect về đâu? | Expected result không rõ |
| 9 | TVP-071 | **G-026** | Session expire behavior: redirect ngay hay toast rồi redirect? | Expected result sequence không rõ |
| 10 | TVP-072 | **G-008** | SATO down fallback: cached value, unknown, hay toast? | Expected result T-01 không xác định được |
| 11 | TVP-078, TVP-079 | **G-013 / GAP-707** | Format hiển thị 展開期間 trên bảng | Expected text không rõ |
| 12 | TVP-077 | **G-014** | クライアント soft-deleted → cột hiển thị gì? | Expected value không có trong spec |
| 13 | TVP-045 | **G-022 / GAP-701** | Cỡ trang mặc định + format pagination UI | Không assert được số dòng/trang và UI info text |
| 14 | TVP-018 | **G-018** | Dropdown ステータス có option "全て" không? | Mặc định filter state không rõ |
| 15 | TVP-085 | **G-032** | URL encode filter/sort/page state? | Browser back behavior phụ thuộc vào URL strategy |

---

## Lịch sử tạo file

| Phiên bản | Ngày | Nội dung | Người tạo |
|-----------|------|----------|-----------|
| 1.0 | 2026-05-04 | Tạo mới | HuyenNTK1 |
