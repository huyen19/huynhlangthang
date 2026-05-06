# Q&A — P-03 新規企画作成

| Mục             | Nội dung                  |
| --------------- | ------------------------- |
| Màn hình        | P-03 新規企画作成         |
| URL             | `/plan/new`               |
| Tài liệu tham chiếu | P-03_新規企画作成.md / D-00_Message definition.md / 共通仕様_vi.md |
| Người tạo       | HuyenNTK1                 |
| Ngày tạo        | 2026-05-06                |
| Phiên bản       | ver1                      |

---

## Gap Analysis Table

> **Chú thích trạng thái**: ✅ Đã có câu trả lời · ❓ Chờ làm rõ

| Gap ID | Category | Gap Description | Risk | Clarification Question | Answer |
| --- | --- | --- | --- | --- | --- |
| G-001 ✅ | Functional | Spec mô tả ファイル参照 cho phép chọn file, nhưng không định nghĩa rõ: hành vi khi người dùng nhấn **データ読み込み** mà chưa chọn file — chỉ hiện message hay disable button? | High | Khi chưa chọn file mà nhấn **データ読み込み**: button bị disable (không click được) hay vẫn click được nhưng hiện thông báo lỗi? Nếu hiện thông báo, dùng message code nào? | Button **データ読み込み** bị **disable** khi chưa chọn file. |
| G-002 ✅ | Functional | Sau khi preview thành công, nếu người dùng chọn file mới rồi nhấn **データ読み込み** lại → preview cũ bị thay thế. Nhưng spec không nói rõ: preview cũ có bị xóa ngay lập tức không, hay chỉ xóa khi load mới thành công? | High | Khi re-load file mới: preview cũ biến mất ngay khi nhấn button, hay chỉ thay thế sau khi load mới hoàn tất thành công? Nếu load lần 2 thất bại, preview lần 1 có còn hiển thị không? | Khi chọn file mới và nhấn **データ読み込み**: **xóa preview cũ ngay**. Nếu file mới bị lỗi → hiển thị error, preview cũ đã bị xóa (không phục hồi lại). |
| G-003 ✅ | Functional | Spec không định nghĩa button **キャンセル** hoặc **戻る** cho trạng thái initial (trước khi load file). Người dùng truy cập `/plan/new` nhưng muốn quay lại không có cách nào được mô tả. | Medium | Màn hình P-03 có button **キャンセル** hay **戻る** không? Nếu có, nhấn vào sẽ chuyển đến màn hình nào? | **Không có** button キャンセル / 戻る. |
| G-004 ✅ | Functional | Drag & drop được gợi ý trong No.2 (「ドラッグ＆ドロップ等」) nhưng spec ghi "Figma・実装の文言に合わせる" — không có mô tả hành vi cụ thể. | Medium | Drag & drop có được hỗ trợ không? Nếu có: (1) Kéo file vào vùng nào? (2) Kéo sai định dạng hiện lỗi gì? (3) Kéo nhiều file cùng lúc xử lý thế nào? | **Hỗ trợ drag & drop** file vào vùng upload. _(Các điểm chi tiết: lỗi khi kéo sai định dạng, kéo nhiều file — cần xác nhận thêm)_ |
| G-005 ✅ | Functional | Spec §3.2(2) ghi: thành công hiển thị No.6/7/8, thất bại hiển thị No.9. Nhưng không định nghĩa trường hợp **mixed result** — một số dòng hợp lệ, một số dòng lỗi. | High | Nếu file có cả dòng hợp lệ lẫn dòng lỗi: (1) Preview dòng hợp lệ và đồng thời hiển thị error list? (2) Hay coi toàn bộ là thất bại? | **Mixed result được hỗ trợ**: dòng hợp lệ → hiển thị trong **vùng preview**; dòng lỗi → hiển thị **message error tại vùng upload file**. Cả hai khu vực cùng hiển thị đồng thời. |
| G-006 ✅ | Functional | **「この企画を削除する」** xuất hiện sau khi load thành công. Spec ghi xóa "プレビュー中の企画（下書き／取込結果に紐づくデータ）" nhưng không rõ: dữ liệu đã được lưu vào DB chưa tại thời điểm load thành công? | High | Sau khi **データ読み込み** thành công, dữ liệu có được lưu tạm vào DB dưới dạng draft không? | **Lưu vào DB** khi **データ読み込み** thành công (tồn tại dưới dạng draft/bản tạm). |
| G-007 ✅ | Functional | Không có mô tả hành vi khi người dùng **đóng tab / refresh trình duyệt** giữa chừng (sau preview nhưng chưa **登録する**). | Medium | Nếu người dùng refresh hoặc đóng tab sau khi preview thành công: dữ liệu draft bị xóa tự động không? Khi mở lại `/plan/new` hệ thống có phục hồi trạng thái không? | Khi **rời khỏi màn hình** (đóng tab, navigate away, refresh) → **xóa draft** khỏi DB. Mở lại `/plan/new` sẽ là màn hình trạng thái initial. |
| G-008 ❓ | Business Logic | §5 ghi chỉ validate **配送センターID** đối chiếu với master. Không đề cập validate các trường khác (エリア, パターン, 概要, 数量...) với master/format. | High | Ngoài 配送センターID, hệ thống còn đối chiếu master hoặc validate format cho những trường nào khác trong Excel? (Ví dụ: エリアID có đối chiếu エリアマスタ không? パターンID có validate không?) | |
| G-009 ❓ | Business Logic | Spec ghi "パターン＞概要の関係を踏まえる" nhưng không định nghĩa rule: nếu trong Excel, 概要 thuộc パターン X nhưng パターン X không tồn tại trong master → xử lý thế nào? | High | Quan hệ パターン＞概要 được validate thế nào? Nếu 概要 gắn với một パターン không tồn tại/không hợp lệ thì dòng đó bị reject hay toàn bộ file thất bại? | |
| G-010 ❓ | Business Logic | Spec ghi "西日本[DNP]を除いた状態の原稿を読み込ませる想定" — không rõ đây là quy trình vận hành (người dùng tự lọc trước khi upload) hay hệ thống tự động filter. | High | 西日本[DNP] exclusion: (1) Đây là nghiệp vụ của người dùng (upload file đã bỏ sẵn)? (2) Hay hệ thống tự detect và loại bỏ các dòng 西日本[DNP]? (3) Nếu file vẫn chứa dòng 西日本[DNP], hệ thống xử lý thế nào — báo lỗi hay silently ignore? | |
| G-011 ❓ | Business Logic | **合計数** trên preview được "再計算" nhưng không định nghĩa: tổng của trường nào? Tổng số hàng (row count) hay tổng giá trị cột 数量? | Medium | **合計数** trên preview được tính như thế nào? (1) Là tổng số dòng hợp lệ trong preview? (2) Hay là tổng giá trị cột 数量? (3) Hay là một công thức khác? | |
| G-012 ❓ | Business Logic | Sau khi **登録する** thành công → chuyển đến P-01 với `plan_id`. Không có rule về duplicate plan — cùng file upload 2 lần có tạo 2 plan riêng biệt không? | Medium | Nếu người dùng upload cùng một file Excel 2 lần và nhấn **登録する** cả 2 lần: hệ thống có kiểm tra trùng lặp không? Nếu có, tiêu chí trùng lặp là gì? | |
| G-013 ❓ | Data | Spec No.4 ghi: "拡張子・サイズ・形式は `BasicDesign/TOBE/DB` および運用で定義" — file format, size limit không được định nghĩa trong spec này. | High | File upload chấp nhận định dạng nào (`.xlsx`, `.xls`, `.csv`, hay khác)? Giới hạn dung lượng file là bao nhiêu (MB)? Giới hạn số dòng tối đa trong file là bao nhiêu? | |
| G-014 ❓ | Data | Template download (No.3): spec không mô tả tên file, format, cấu trúc cột của template. | Medium | Template Excel download có cấu trúc cột như thế nào? Tên file download là gì? Các cột required/optional trong template? Header row có cố định không? | |
| G-015 ❓ | Data | Preview table có các cột "エリア、配送センター（ID／名称）、パターン、概要、数量等" — "等" không rõ còn cột nào khác. | Medium | Preview table hiển thị đầy đủ những cột nào? Có cột nào ngoài: エリア, 配送センターID, 配送センター名称, パターン, 概要, 数量? Thứ tự cột như thế nào? | |
| G-016 ✅ | Data | Spec không định nghĩa khi nào dữ liệu được persist vào DB trong luồng: file upload → data load → preview → register. | High | Dữ liệu được lưu vào DB tại thời điểm nào: (a) Khi nhấn **データ読み込み** (lưu draft)? (b) Chỉ khi nhấn **登録する** (commit)? Nếu (a), draft có expiry time không? | Xem G-006: **lưu vào DB** khi **データ読み込み** thành công. _(Draft expiry time — cần xác nhận thêm)_ |
| G-017 ❓ | Validation | Spec §5 ghi validation errors hiển thị trong **エラー一覧** nhưng không định nghĩa format: cột nào (行番号, 項目名, エラー理由)? Sort order? Có phân trang không? | Medium | **エラー一覧** hiển thị những cột gì và theo format nào? Nếu file có 500 dòng lỗi, danh sách có phân trang không? Message code nào trong D-00 áp dụng cho các loại lỗi đọc file? | |
| G-018 ❓ | Validation | D-00 không có message code nào định nghĩa cho: file sai định dạng, file quá dung lượng, file rỗng (không có data row), cột bắt buộc thiếu trong Excel. | High | Các trường hợp lỗi sau dùng message code nào: (1) File sai định dạng (không phải Excel/CSV)? (2) File vượt giới hạn dung lượng? (3) File upload rỗng (0 data rows)? (4) Thiếu cột bắt buộc trong Excel? Cần thêm message vào D-00 không? | |
| G-019 ❓ | Validation | Spec không định nghĩa validation cho trường 数量: có phải số nguyên dương không? Giá trị 0 hoặc âm có được không? | Medium | Cột 数量 trong Excel có validation rule gì: (1) Bắt buộc điền? (2) Chỉ số nguyên dương? (3) Giá trị tối đa? Nếu 数量 = 0 hoặc âm thì xử lý thế nào? | |
| G-020 ❓ | Integration | Spec §5 ghi hệ thống đối chiếu **配送センターマスタ** khi load file, nhưng không mô tả: dữ liệu master được lấy từ API nào, khi nào? Nếu master API timeout → xử lý thế nào? | High | Khi đối chiếu 配送センターID với master: (1) Hệ thống gọi API real-time hay dùng cache? (2) Nếu master API không phản hồi (timeout/error) → hiển thị lỗi gì? Load process bị cancel hay chỉ skip validation? | |
| G-021 ❓ | Integration | Template download: spec không định nghĩa endpoint hay nguồn file template (static file hay generated dynamically). | Low | File template Excel được lấy từ đâu: static file trên server hay được generate động? Nếu generate động, dữ liệu nào được pre-fill? | |
| G-022 ❓ | Integration | Spec §5 ghi "ネットワーク・タイムアウト時はエラーハンドリング（トースト／モーダル等は共通UIに合わせる）" nhưng không rõ: dùng toast hay modal, và timeout threshold là bao lâu. | Medium | Khi load file bị timeout: (1) Dùng toast hay modal thống nhất (§4.1 共通仕様)? (2) Timeout threshold là bao nhiêu giây? (3) Có cho phép retry không? | |
| G-023 ❓ | Edge Case | Người dùng upload file Excel rỗng (chỉ có header, không có data row) → behavior không được định nghĩa. | Medium | Nếu file Excel chỉ có header row, không có data row: (1) Hệ thống hiển thị lỗi gì? (2) Hay hiển thị preview rỗng với 合計数 = 0 và cho phép **登録する**? | |
| G-024 ✅ | Edge Case | Sau khi **登録する** thành công và chuyển sang P-01, nếu người dùng nhấn **Back** trên trình duyệt quay lại `/plan/new`: behavior không định nghĩa. | Medium | Nếu người dùng nhấn Back sau khi đăng ký thành công và quay lại `/plan/new`: màn hình reset về initial state? Hay vẫn hiển thị preview cũ? | Xem G-007: rời khỏi màn hình → **xóa draft**. Quay lại `/plan/new` sẽ là initial state. |
| G-025 ✅ | Edge Case | Spec không định nghĩa hành vi khi **「この企画を削除する」** được nhấn ngay sau khi load thành công lần đầu, khi chưa có `plan_id` (chưa đăng ký vào DB). | High | **「この企画を削除する」** được hiển thị sau khi load thành công. Button này thực chất làm gì? Clear preview state hay xóa DB record? Confirmation dialog hiển thị text gì? | Xem G-006: dữ liệu đã **lưu vào DB** khi load thành công → button này gọi **API xóa draft** khỏi DB. _(Confirmation dialog text — cần xác nhận thêm)_ |
| G-026 ❓ | Edge Case | Spec không đề cập giới hạn số dòng trong preview. File có 10,000+ dòng hợp lệ → preview render thế nào? | Medium | Preview table có giới hạn số dòng hiển thị không? Nếu có phân trang: số dòng/trang là bao nhiêu? Có áp dụng quy tắc phân trang từ 共通仕様 (15/30/50) không? | |
| G-027 ❓ | UI/UX | Spec No.5 ghi "処理中は二重押下防止" nhưng không mô tả UI state khi đang xử lý: button disabled? Loading spinner? | Low | Trong khi **データ読み込み** đang xử lý: (1) Button đổi thành disabled + spinner? (2) Có loading overlay không? (Áp dụng Flowbite Spinner từ 共通仕様?) | |
| G-028 ❓ | UI/UX | Spec No.4 ghi "ファイル名を表示" sau khi chọn file nhưng không mô tả: hiển thị ở đâu, format thế nào, và khi xóa file thì hiển thị gì. | Low | Tên file sau khi chọn hiển thị ở đâu? Nếu tên file quá dài có truncate không? Nếu người dùng cancel chọn file thì hiển thị gì? | |
| G-029 ❓ | UI/UX | **「この企画を削除する」** confirmation dialog: spec ghi "確認文言は要件に従う" nhưng không định nghĩa text cụ thể. | Medium | Confirmation dialog khi nhấn **「この企画を削除する」**: (1) Title là gì? (2) Body text là gì? (3) Button labels? (4) Dùng message code nào từ D-00? | |
| G-030 ❓ | UI/UX | Spec không định nghĩa thứ tự hiển thị giữa phần upload area (No.1-5) và phần preview (No.6-8) sau khi load thành công. Upload area có còn hiển thị phía trên preview không? | Low | Sau khi load thành công, layout màn hình: Upload area (No.1-5) vẫn hiển thị phía trên + preview bên dưới? Hay upload area thu gọn? | |
| G-031 ❓ | Non-functional | Không có yêu cầu về performance cho quá trình **データ読み込み** (file parsing + master validation). File lớn có thể mất nhiều thời gian. | Medium | Có SLA về thời gian xử lý **データ読み込み** không? Ví dụ: file 1000 dòng phải hoàn thành trong bao nhiêu giây? Nếu vượt threshold có hiển thị warning không? | |
| G-032 ❓ | Non-functional | Spec không đề cập concurrent access: 2 người dùng cùng upload và register cùng một thời điểm — có race condition không? | Low | Nhiều người dùng cùng tạo plan mới đồng thời có gây vấn đề gì không? Có cần xử lý optimistic/pessimistic lock cho luồng tạo plan mới không? | |
| G-033 ❓ | Non-functional | Spec không định nghĩa quyền hạn chi tiết: "管理・物流" nhưng không rõ user chỉ có quyền **物流** có được truy cập `/plan/new` không, và behavior khi không có quyền. | Medium | User với role **物流** có toàn quyền trên P-03 như role **管理** không? Khi user không có quyền truy cập `/plan/new`, redirect về đâu và hiển thị gì? | |

---

## Tóm tắt theo Risk Level

| Risk | Số lượng Gap | Gap IDs |
| ---- | ------------ | ------- |
| **High** | 11 | G-001, G-005, G-006, G-008, G-009, G-010, G-013, G-016, G-018, G-020, G-025 |
| **Medium** | 17 | G-002, G-003, G-004, G-007, G-011, G-012, G-014, G-015, G-017, G-019, G-022, G-023, G-024, G-026, G-029, G-031, G-033 |
| **Low** | 5 | G-021, G-027, G-028, G-030, G-032 |

## Tiến độ trả lời

| Trạng thái | Số lượng | Gap IDs |
| --- | --- | --- |
| ✅ Đã có câu trả lời | 9 | G-001, G-002, G-003, G-004, G-005, G-006, G-007, G-016, G-024, G-025 |
| ❓ Chờ làm rõ | 24 | G-008 ~ G-015, G-017 ~ G-023, G-026 ~ G-033 |

---

## Checklist phân tích

- [x] Phân tích đủ 8 category
- [x] Mỗi gap có Gap ID duy nhất
- [x] Risk được đánh giá (High / Medium / Low)
- [x] Câu hỏi làm rõ cụ thể, actionable
- [x] Ưu tiên gap có Risk = High trước
- [x] Không tự giả định logic bị thiếu
