# Q&A Spec — T-01 企画一覧（トップ）

- **File**: `Q&A_T-01_企画一覧TOP_ver1.md`
- **Ngày tạo**: 2026-05-04
- **Tài liệu tham chiếu**:
  - Requirement: `Requirements/T-01/T-01_企画一覧（トップ）_VN.md`
  - UI: `Requirements/T-01/T01.png`

---

## Danh sách Gap & Câu hỏi làm rõ

| Gap ID | Category | Gap Description | Risk | Clarification Question | Answer |
|--------|----------|-----------------|------|------------------------|--------|
| G-001 | Functional | **GAP-703** — Spec không xác định rõ cơ chế điều hướng sang P-01: click toàn dòng, click cột ID, click cột tên kế hoạch, hay nút riêng (cột 10-8). Mục 3 đề cập cả hai khả năng "click dòng / liên kết nếu có", gây mơ hồ khi implement và test. | High | Người dùng điều hướng sang P-01 bằng cách nào: (a) click toàn dòng, (b) click vào giá trị ID, (c) click vào tên kế hoạch, hay (d) có nút/icon riêng ở cột thao tác 10-8? Nếu click toàn dòng, các phần tử con có click-event riêng (như badge trạng thái) có bị conflict không? | Có thể điều hướng sang P-01 bằng tất cả các cách: click toàn dòng, click ID, click tên kế hoạch, và nút/icon chi tiết (nếu có). |
| G-002 | Functional | **GAP-702** — Cơ chế áp dụng lọc chưa xác định: submit khi nhấn nút, hay auto-apply khi thay đổi giá trị dropdown/date. Phần 3 ghi "kết hợp với nút áp dụng lọc hoặc auto-apply theo chuẩn dự án" — hai hành vi này ảnh hưởng hoàn toàn khác nhau đến test case. | High | Bộ lọc được áp dụng theo cơ chế nào: (a) chỉ khi nhấn nút Tìm/Áp dụng, hay (b) auto-apply ngay khi thay đổi từng trường? Nếu là (a), khi người dùng thay đổi dropdown nhưng chưa nhấn nút, danh sách có thay đổi không? | |
| G-003 | Functional | **GAP-708** — Sort mặc định khi vào màn hình chưa xác định. Phần 4 ghi "áp dụng sort mặc định (GAP-708)" nhưng không chỉ rõ cột nào, chiều nào. Điều này ảnh hưởng đến kết quả hiển thị ban đầu và test case initial load. | High | Sort mặc định khi vào màn T-01 là gì? Ví dụ: ID giảm dần, 出荷予定日 tăng dần? Và sort direction mặc định khi click lần đầu vào một header cột là ASC hay DESC? | |
| G-004 | Business Logic | **GAP-704** — Quy tắc so khớp 展開期間 với date range chưa định nghĩa. Có ít nhất 3 cách hiểu: (a) intersect — kế hoạch có 展開期間 giao với khoảng lọc; (b) within — 展開期間 nằm hoàn toàn trong khoảng lọc; (c) contains — khoảng lọc nằm trong 展開期間. Mỗi cách cho kết quả khác nhau. | High | Khi lọc theo 展開期間 từ ngày A đến ngày B, kế hoạch nào được hiển thị? Ví dụ: kế hoạch có 展開期間 từ 01/01 đến 31/03, lọc từ 15/01 đến 15/02 — kế hoạch này có xuất hiện không? Quy tắc là "giao nhau" (overlap), "nằm trong" (within), hay cách khác? | |
| G-005 | Business Logic | Logic chuyển trạng thái luồng Charter còn thiếu: điều kiện "toàn bộ số lượng đếm gửi thành công lên hệ thống cấp cao **mà không có lỗi**" — nếu chỉ một phần số lượng gửi thành công, hoặc gửi thành công một phần rồi lỗi, trạng thái kế hoạch Charter là gì? | High | Trong luồng Charter, nếu quá trình gửi số lượng lên hệ thống cấp cao thành công một phần (ví dụ: gửi 3/5 item thành công, 2 item lỗi), trạng thái kế hoạch hiển thị là gì trên màn T-01? Có trạng thái trung gian nào không? | |
| G-006 | Business Logic | **GAP-712** — Trường phân biệt kế hoạch Charter trong DB chưa xác định. Màn T-01 hiển thị badge trạng thái khác nhau giữa luồng thường và Charter — nếu không biết trường phân loại, không thể tạo test data và validate badge. | High | Kế hoạch Charter được phân biệt với kế hoạch thường bằng trường nào trong DB? Tên cột, kiểu dữ liệu và giá trị phân biệt (flag boolean, enum, v.v.) là gì? | |
| G-007 | Integration | **GAP-713** — Cơ chế cập nhật trạng thái tự động chưa định nghĩa. Batch job, webhook, hay polling? Tần suất là bao nhiêu? Ảnh hưởng trực tiếp đến testing: nếu batch chạy 1 lần/ngày, không thể test real-time state transition. | High | Trạng thái kế hoạch được cập nhật tự động bằng cơ chế nào: (a) batch job định kỳ (tần suất?), (b) webhook từ hệ thống SATO/cấp cao, hay (c) polling? Cơ chế nào trigger việc chuyển sang "Đang tiến hành", "Đang giao hàng", "Đã giao hàng", "Hoàn thành"? | |
| G-008 | Integration | Khi hệ thống cấp dưới (SATO) hoặc hệ thống cấp cao bị lỗi/down, badge trạng thái trên màn T-01 hiển thị gì? Spec chỉ nói "màn T-01 chỉ hiển thị kết quả" nhưng không đề cập fallback khi nguồn dữ liệu không khả dụng. | High | Nếu hệ thống SATO hoặc hệ thống cấp cao bị down, badge trạng thái trên T-01 hiển thị: (a) giá trị cached cuối cùng, (b) trạng thái lỗi/unknown, hay (c) toast cảnh báo? Có SLA về thời gian sync không? | |
| G-009 | Functional | Hành vi initial load chưa rõ: phần 4 ghi "chưa áp dụng lọc cho đến khi người dùng thao tác（hoặc theo chuẩn dự án）" — mâu thuẫn giữa hai khả năng. Nếu "chưa áp dụng lọc" thì hiển thị tất cả kế hoạch; nếu "theo chuẩn dự án" thì có thể có lọc mặc định. | High | Khi vào màn T-01 lần đầu (sau đăng nhập), danh sách hiển thị: (a) toàn bộ kế hoạch không lọc, hay (b) có điều kiện lọc mặc định nào được áp dụng sẵn (ví dụ: chỉ kế hoạch trong tháng hiện tại, hoặc trạng thái ≠ Hoàn thành)? | |
| G-010 | Business Logic | Quy tắc đếm "5 ngày" để tự động chuyển sang trạng thái "Hoàn thành" chưa rõ: calendar days hay business days? Và thời điểm bắt đầu đếm là 00:00:00 của ngày hôm sau hay chính xác từ timestamp đạt trạng thái trước? | Medium | "5 ngày" để tự động chuyển sang 完了 là calendar days hay business days? Thời điểm đếm bắt đầu từ khi nào: (a) 00:00 ngày tiếp theo, hay (b) đúng timestamp đạt trạng thái 配達完了/配送中 (Charter)? Timezone áp dụng là JST? | |
| G-011 | Data | **GAP-706** — Kiểu khớp khi tìm theo tên kế hoạch vs ID trong cùng một ô text chưa xác định. Tên kế hoạch thường dùng partial match; ID thường cần exact match. Hệ thống có tự phân biệt input là tên hay ID không? | Medium | Khi nhập vào ô tìm kiếm: (a) Nếu nhập số thuần túy, hệ thống tìm theo ID exact match hay partial match cả tên lẫn ID? (b) Nếu nhập chuỗi có chữ, chỉ tìm tên kế hoạch? (c) Có phân biệt hoa/thường không? (d) Có hỗ trợ ký tự đặc biệt (dấu tiếng Nhật, ký tự toàn/bán) không? | |
| G-012 | Data | **GAP-705** — Giới hạn độ dài ô tìm theo tên/ID chưa xác định. Cần biết để thiết kế test case boundary và kiểm tra validation message khi nhập quá dài. | Medium | Ô tìm theo tên kế hoạch hoặc ID giới hạn tối đa bao nhiêu ký tự? Khi nhập vượt giới hạn, hành vi là gì: (a) không cho nhập thêm, (b) cho nhập nhưng hiện lỗi, hay (c) tự cắt bớt? | |
| G-013 | Data | **GAP-707** — Định dạng hiển thị 展開期間 trên bảng chưa xác định. Có nhiều format: "YYYY/MM/DD〜YYYY/MM/DD", "MM/DD〜MM/DD (YYYY)", "YYYY-MM-DD to YYYY-MM-DD", v.v. Ảnh hưởng đến UI test và localization. | Medium | Cột 展開期間 trên bảng hiển thị theo format nào? Ví dụ: "2026/01/01〜2026/03/31" hay "01/01〜03/31" (khi cùng năm), hay format khác? Nếu 展開期間 không có ngày kết thúc (open-ended), hiển thị gì? | |
| G-014 | Data | Cột tên khách hàng trên bảng lấy từ master クライアント — nếu khách hàng đã bị xóa mềm sau khi kế hoạch được tạo, cột này hiển thị gì? Spec chỉ nói dropdown lọc "không hiển thị bản ghi đã xóa mềm" nhưng không đề cập display trên bảng. | Medium | Nếu khách hàng (クライアント) đã bị xóa mềm sau khi kế hoạch được tạo, cột Khách hàng trên bảng T-01 hiển thị: (a) tên cũ (snapshot), (b) placeholder như "Đã xóa", (c) để trống, hay (d) cách khác? | |
| G-015 | Data | **GAP-711** — Timezone chưa xác định cho date picker và hiển thị ngày trên bảng. Nếu user ở timezone khác JST, lọc theo 出荷予定日 = "2026-04-01" có thể trả về kết quả khác nhau tùy timezone. | Medium | Các date picker và dữ liệu ngày trên bảng (出荷予定日, 納品予定日, 展開期間) sử dụng timezone nào: JST cố định, hay timezone của trình duyệt user? Nếu user ở nước ngoài, lọc ngày có bị lệch không? | |
| G-016 | Validation | Validate date range 展開期間: khi người dùng nhập ngày kết thúc < ngày bắt đầu, spec ghi "Ngày kết thúc ≥ ngày bắt đầu (nếu cả hai được nhập)" nhưng không định nghĩa thông báo lỗi cụ thể, vị trí hiển thị, và có block submit không. | Medium | Khi ngày kết thúc < ngày bắt đầu trong bộ lọc 展開期間: (a) Thông báo lỗi cụ thể là gì? (b) Lỗi hiển thị inline dưới ô hay toast? (c) Nút Tìm có bị disabled hay vẫn cho submit nhưng trả về lỗi? | |
| G-017 | Validation | Hành vi khi áp dụng lọc với điều kiện không hợp lệ (date range sai) chưa rõ: hệ thống có block request hay vẫn gửi lên server để server validate? Ảnh hưởng đến test case luồng lỗi. | Medium | Khi nhấn nút Tìm với điều kiện lọc không hợp lệ (ví dụ: date range sai), hành vi là: (a) block client-side, không gửi request, (b) gửi lên server và server trả về lỗi 400, hay (c) hành vi khác? | |
| G-018 | Business Logic | Dropdown ステータス: spec đề cập "5 giá trị nghiệp vụ + 'Tất cả' nếu có" — "nếu có" gây mơ hồ. Cần xác nhận có option "Tất cả"/"全て" không, và giá trị mặc định là gì khi vào màn hình. | Medium | Dropdown lọc ステータス có bao gồm option "Tất cả/全て" không? Giá trị mặc định khi vào màn hình là gì: "Tất cả" hay không chọn gì (rỗng)? Hai hành vi này có khác nhau về kết quả query không? | |
| G-019 | Business Logic | Dropdown クライアント "hiển thị bản ghi tạm dừng để vẫn có thể tra cứu kế hoạch liên quan" — sau khi lọc theo khách hàng tạm dừng và hiển thị kết quả, có thông báo hoặc indicator nào cho biết khách hàng này đang tạm dừng không? | Medium | Khi người dùng lọc theo khách hàng đang ở trạng thái "tạm dừng", danh sách kế hoạch có hiển thị bình thường không? Có indicator/cảnh báo nào cho biết khách hàng đang tạm dừng không (ví dụ: tag "(停止中)" bên cạnh tên)? | |
| G-020 | UI/UX | Badge màu sắc cho từng trạng thái (未対応, 進行中, 配送中, 配達完了, 完了) chưa được định nghĩa trong spec này. Cần guideline UI cụ thể để test visual và accessibility. | Medium | Màu sắc badge cho từng trạng thái là gì? Có tài liệu UI guideline (color tokens, component spec) nào quy định: 未対応=xám, 進行中=xanh, 配送中=cam, 配達完了=lục, 完了=tím (hoặc theo scheme khác) không? | |
| G-021 | UI/UX | **GAP-702** — Nhãn nút áp dụng lọc chưa xác định. Spec ghi "Nút Tìm / áp dụng lọc (theo chuẩn UI chung — GAP-702)". Cần xác nhận: "検索", "絞り込み", "Tìm kiếm" hay "Áp dụng"? Ảnh hưởng đến test verify UI text. | Medium | Nhãn nút áp dụng bộ lọc hiển thị là gì: "検索", "絞り込む", hay text khác? Có thêm nút Reset/Clear bộ lọc không? Nếu có, nhãn là gì? | |
| G-022 | UI/UX | Phân trang UI: spec đề cập "hiển thị tổng số bản ghi nếu UI chung có" — không xác định rõ. Cần biết format pagination: "Trang 1/10", "1-20 of 200 records", hay chỉ nút Prev/Next. | Medium | Phân trang hiển thị thông tin gì: (a) tổng số bản ghi, (b) số trang hiện tại / tổng trang, (c) cả hai, hay (d) chỉ nút điều hướng Prev/Next? **GAP-701**: Cỡ trang mặc định là bao nhiêu (10, 20, 50 dòng/trang)? | |
| G-023 | Edge Case | Khi kế hoạch có 展開期間 null (chưa set) — có hiển thị trong danh sách không? Cột 展開期間 hiển thị gì (để trống, dash "-", "未設定")? Và khi lọc theo 展開期間, kế hoạch null có bao giờ match không? | Medium | Kế hoạch không có 展開期間 (null): (a) Có hiển thị trong danh sách mặc định không? (b) Cột 展開期間 hiển thị gì? (c) Khi lọc theo date range 展開期間, kế hoạch null có xuất hiện trong kết quả không? | |
| G-024 | Edge Case | Khi sort theo 出荷予定日 hoặc 納品予定日 mà có bản ghi null — NULL values xếp ở đầu (NULLS FIRST) hay cuối (NULLS LAST)? Hành vi này không nhất quán giữa các DB engine nếu không có quy định. | Medium | Khi sort theo cột 出荷予定日 hoặc 納品予定日, các kế hoạch có giá trị null ở cột đó được xếp ở đầu danh sách hay cuối? Hành vi có giống nhau cho cả ASC và DESC không? | |
| G-025 | Edge Case | **GAP-709** — Single-sort vs multi-sort: Khi click sort cột mới, sort cũ có bị clear không? Spec ghi "chỉ một tiêu chí sort chính tại một thời điểm (GAP-709 nếu cho phép multi-sort)" — cần xác nhận dứt khoát. | Medium | Hệ thống chỉ hỗ trợ single-sort hay multi-sort? Khi đang sort theo ID, rồi click header 出荷予定日: (a) chỉ sort theo 出荷予定日 (single), hay (b) sort theo 出荷予定日 trước, ID sau (multi)? | |
| G-026 | Edge Case | Session expire khi người dùng đang ở màn T-01 và thực hiện tìm kiếm/phân trang — hệ thống xử lý thế nào? Redirect về login, hay hiển thị toast lỗi? | Medium | Khi session của người dùng hết hạn trong khi đang thao tác trên T-01 (nhấn Tìm kiếm hoặc chuyển trang), hệ thống phản hồi thế nào: (a) redirect ngay về trang login, (b) hiện modal/toast thông báo rồi redirect, hay (c) cách khác? | |
| G-027 | Non-functional | **GAP-701** liên quan đến performance: "tải trang < 3 giây" nhưng cỡ trang mặc định chưa xác định. Với Dense layout nhiều cột, nếu cỡ trang là 100 dòng, mục tiêu 3 giây có còn thực tế không? Cần xác nhận cả hai cùng lúc. | Medium | Mục tiêu < 3 giây áp dụng cho trường hợp nào: (a) cỡ trang mặc định (GAP-701 chưa xác định), hay (b) cỡ trang tối đa? Có giới hạn cỡ trang tối đa người dùng có thể chọn không? | |
| G-028 | Functional | Không có mô tả về nút Reset/Clear bộ lọc. Để xóa bộ lọc, người dùng phải xóa từng ô một? Hay có nút "Xóa tất cả bộ lọc"? Ảnh hưởng đến UX flow và test case. | Low | Có nút "Reset bộ lọc" / "クリア" để xóa toàn bộ điều kiện lọc cùng lúc không? Nếu có, sau khi clear, danh sách có tự refresh không, hay cần nhấn Tìm thêm một lần? | |
| G-029 | Data | Format và cấu trúc của ID kế hoạch chưa xác định: số nguyên tự tăng, UUID, hay có prefix đặc biệt (ví dụ: "企-2026-001")? Ảnh hưởng đến logic tìm kiếm (GAP-706) và test data. | Low | ID kế hoạch (企画ID) có format như thế nào: số nguyên tự tăng, UUID, hay có prefix/format đặc biệt? Điều này ảnh hưởng đến cách hệ thống phân biệt "input là ID" hay "input là tên" khi tìm kiếm. | |
| G-030 | UI/UX | Khi đang loading (sau khi nhấn Tìm hoặc chuyển trang), có hiển thị loading indicator (spinner, skeleton rows, overlay) không? Hay bảng biến mất hoàn toàn rồi hiện lại? | Low | Khi đang tải dữ liệu (sau filter hoặc pagination), UI hiển thị gì: (a) skeleton rows, (b) spinner overlay trên bảng, (c) bảng cũ mờ đi, hay (d) bảng trống? | |
| G-031 | UI/UX | Icon chỉ hướng sort trên header cột: khi một cột đang active sort, icon hiển thị thế nào? Khi cột không active, có hiển thị icon hover không? Cần xác nhận để test visual. | Low | Khi header cột đang sort active, icon hiển thị là ▲/▼ hay mũi tên 2 chiều? Khi hover vào header cột chưa sort, có preview icon không? Khi click lần 3 (sau ASC → DESC), có toggle về "no sort" không? | |
| G-032 | Edge Case | Hành vi khi người dùng mở 2 tab cùng màn T-01 với bộ lọc/sort khác nhau — đây có phải hành vi được chấp nhận không, hay có session conflict? | Low | Nếu người dùng mở màn T-01 ở 2 tab browser khác nhau với bộ lọc khác nhau, hành vi có được chấp nhận không? URL có encode trạng thái bộ lọc/sort/page để share/bookmark không? | |
| G-033 | Non-functional | Security: khi vai trò khác (không phải 管理 hoặc 物流) cố truy cập URL `/`, hệ thống redirect về đâu? Validate quyền ở frontend (route guard) hay backend (API 403), hay cả hai? | Low | Khi người dùng không có quyền (không phải 管理/物流) truy cập `/`, hệ thống: (a) redirect về login, (b) redirect về trang "không có quyền", hay (c) trả về 403/404? Kiểm tra quyền ở tầng nào (frontend route guard, API, hay cả hai)? | |
| G-034 | UI/UX | Khu vực lọc / tìm kiếm: có collapse/expand không? Hay luôn hiển thị cố định? Với Dense layout nhiều row, nếu filter area luôn hiển thị sẽ chiếm nhiều không gian màn hình. | Low | Khu vực lọc (絞り込み検索) có thể collapse/expand bằng toggle không? Hay luôn hiển thị đầy đủ? Trên màn hình nhỏ (laptop 13"), layout Dense + filter area cố định có bị overflow không? | |
| G-035 | Non-functional | Spec không đề cập về export (CSV/Excel). Nếu có yêu cầu export sau này, cần biết ngay để tránh thiếu test case cho chức năng này. | Low | Màn T-01 có chức năng export danh sách ra CSV/Excel không? Nếu có, export theo điều kiện lọc hiện tại hay toàn bộ dữ liệu? | |

---

## Tổng kết

| | |
|---|---|
| **Tổng số gap** | 35 |
| **Risk High** | 9 gaps (G-001 → G-009) |
| **Risk Medium** | 19 gaps (G-010 → G-027) |
| **Risk Low** | 7 gaps (G-028 → G-035) |

### Phân bổ theo Category

| Category | Số gap |
|----------|--------|
| Functional | 6 (G-001, G-002, G-009, G-028, G-029 liên quan) |
| Business Logic | 5 (G-003, G-004, G-005, G-010, G-018, G-019) |
| Data | 5 (G-006, G-011, G-012, G-013, G-014, G-015, G-029) |
| Validation | 2 (G-016, G-017) |
| Integration | 2 (G-007, G-008) |
| Edge Case | 6 (G-023, G-024, G-025, G-026, G-032) |
| UI/UX | 7 (G-020, G-021, G-022, G-030, G-031, G-034) |
| Non-functional | 3 (G-027, G-033, G-035) |

### GAP trong spec đã được đưa vào Q&A

| GAP trong Spec | Gap ID tương ứng |
|----------------|-----------------|
| GAP-701 (cỡ trang) | G-022 |
| GAP-702 (cơ chế lọc) | G-002, G-021 |
| GAP-703 (điều hướng P-01) | G-001 |
| GAP-704 (so khớp 展開期間) | G-004 |
| GAP-705 (độ dài text search) | G-012 |
| GAP-706 (kiểu khớp tìm kiếm) | G-011 |
| GAP-707 (format 展開期間) | G-013 |
| GAP-708 (sort mặc định) | G-003 |
| GAP-709 (single/multi sort) | G-025 |
| GAP-711 (timezone) | G-015 |
| GAP-712 (cờ Charter) | G-006 |
| GAP-713 (cơ chế update trạng thái) | G-007 |
