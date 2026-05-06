# Q&A — M-07 Quản lý công ty vận chuyển（運送業者管理）

|              | Nội dung                                    |
| ------------ | ------------------------------------------- |
| Màn hình     | M-07 / M-07-cud                             |
| Người tạo    | HuyenNTK1                                   |
| Ngày tạo     | 2026-05-05                                  |
| Tài liệu ref | M-07_VN.md, M-07-cud_VN.md, D-00, 共通仕様_vi.md |

---

## Bảng phân tích Gap

| Gap ID | Category | Gap Description | Risk | Clarification Question |
| --- | --- | --- | --- | --- |
| G-001 | Functional | MSG-031, MSG-032, MSG-033 được tham chiếu trong M-07-cud (Lưu thành công, trùng `carrier_code`, 楽観的ロック) nhưng **không tồn tại** trong D-00_Message definition.md (chỉ có tới MSG-024). Không thể test validate message nếu ID chưa đăng ký. | **Confirmed** | ✓ MSG-031, MSG-032, MSG-033 cần lấy từ file message definition đầy đủ. (BV làm rõ: lấy trong file message) |
| G-002 | Functional | `carrier_code` tồn tại trên DB (bắt buộc, unique), được đề cập trong mục Ràng buộc duy nhất, nhưng **không có trường nhập liệu** trên form M-07-cud (chỉ có 2 field: Tên công ty và Mã vận đơn). Không rõ giá trị này được tạo ra bằng cách nào. | High | `carrier_code` được sinh tự động (auto-increment / UUID) hay người dùng nhập? Nếu tự động, quy tắc sinh là gì? Nếu người dùng nhập, tại sao không có field trên UI? |
| G-003 | Functional | Ràng buộc xóa điều kiện 2 bị **cắt đứt** ở cuối câu: *"đang được gán để thực hiện giao kiện hàng / vận đơn cụ thể（ví dụ kế hoạch giao hàng, đơn vận, shipment line"* — không có dấu chấm, câu không hoàn chỉnh, thiếu tên bảng/field cụ thể. | High | Điều kiện ràng buộc xóa số 2 là gì đầy đủ? Cần liệt kê cụ thể: tên bảng, tên cột FK tham chiếu đến `m_delivery_companies.id`, và điều kiện "đang hiệu lực" được xác định thế nào (ví dụ: `deleted_at IS NULL` hay trạng thái đơn hàng trong khoảng nào)? |
| G-004 | Business Logic | MSG-022 trong D-00 được định nghĩa là lỗi **kết nối / tham chiếu chung** (*「関連データが存在するため削除できません」*) nhưng trong M-07-cud mục Ràng buộc xóa, cùng MSG-022 được dùng cho **lỗi vi phạm ràng buộc xóa 運送業者**. Hai ngữ cảnh khác nhau nhưng dùng chung một message ID. | High | Khi vi phạm ràng buộc xóa 運送業者, hệ thống hiển thị MSG-022 nguyên văn hay một message riêng (MSG-032 hoặc ID mới)? Nếu dùng MSG-022, text hiển thị cho user có đủ rõ không? |
| G-005 | Business Logic | Không có định nghĩa thứ tự sắp xếp mặc định cho bảng M-07. Spec ghi "không có sort" nhưng 共通仕様_vi.md mục 5.4 nói *"Ban đầu theo ID tăng dần"*. Không rõ M-07 override common hay tuân theo. | **Confirmed** | ✓ Tuân theo M-07 spec (không có sort, thứ tự mặc định được xác định bởi M-07). (BV làm rõ: lấy theo M-07) |
| G-006 | Data | `waybill_code`: M-07 note *"Có thể NULL trên DB"* nhưng M-07-cud quy tắc kiểm tra ghi **Bắt buộc**. Mâu thuẫn giữa DB schema (nullable) và UI validation (required). Không rõ dữ liệu cũ (null) sẽ hiển thị và xử lý thế nào khi Sửa. | **Clarified** | ✓ `waybill_code` logic: **Create mới**: mặc định null (cho phép để trống) | **Edit**: bắt buộc nhập (không được trống). (BV làm rõ: mặc định tạo mới ban đầu là null còn edit nhập vào thì required) |
| G-007 | Data | Không có định nghĩa **unique constraint** cho `name` (tên công ty vận chuyển). Spec chỉ đề cập unique cho `carrier_code`. Không rõ 2 công ty có thể trùng tên không, và nếu trùng thì hiển thị thế nào trong danh sách (không có sort/search). | Medium | `name` có ràng buộc unique không? Nếu không có, khi danh sách có nhiều dòng cùng tên công ty, đây có phải là nghiệp vụ hợp lệ không? |
| G-008 | Data | Không có định nghĩa **unique constraint** cho `waybill_code`. Không rõ 2 công ty có thể dùng cùng mã vận đơn không — điều này có thể gây lỗi nghiêm trọng khi liên kết API phát hành vận đơn. | Medium | `waybill_code` có ràng buộc unique (trong phạm vi `deleted_at IS NULL`) không? Nếu trùng, dùng message nào? |
| G-009 | Data | Sau khi xóa mềm công ty vận chuyển, các tham chiếu hiện có (đơn vị vận chuyển mặc định của Client, vận đơn đang gán) vẫn giữ FK trỏ vào bản ghi đã xóa mềm. Không có spec về **cascade behavior** hoặc xử lý dữ liệu lịch sử. | Medium | Sau khi xóa mềm công ty vận chuyển, dữ liệu FK ở bảng con (Client default, shipment) được xử lý thế nào? Giữ nguyên FK (bản ghi lịch sử), set NULL, hay xử lý khác? |
| G-010 | Validation | Không có định nghĩa **min-length** cho `waybill_code`. Spec cho phép tối đa 64 ký tự, chỉ half-width số, bắt buộc. Nhưng 1 ký tự `0` có hợp lệ không? Ví dụ trong spec là `000999000000` (12 chữ số) có phải là định dạng chuẩn không? | Medium | `waybill_code` có độ dài tối thiểu bắt buộc không? Định dạng cụ thể từ phía đối tác API là gì (số chữ số cố định hay tùy ý)? |
| G-011 | Validation | Thời điểm trigger validation không được định nghĩa rõ: **on-blur** (khi rời ô) hay **on-submit** (khi nhấn Lưu). Spec chỉ nói "khi Lưu: trim đầu/cuối; sau trim rỗng → chưa nhập" nhưng không nói về realtime validation. Common spec không có quy tắc chung về timing. | Medium | Validation lỗi hiển thị khi nào: realtime (khi gõ), on-blur (khi rời ô nhập), hay chỉ khi nhấn Lưu? Áp dụng thống nhất cho cả 2 trường `name` và `waybill_code`? |
| G-012 | Validation | Khi `waybill_code` không phải là số (ví dụ nhập chữ), message lỗi nào được dùng? MSG-011 (*半角数字で入力してください*) trong D-00 có vẻ phù hợp nhưng spec M-07-cud không liên kết MSG-011 với trường này. | Low | Khi nhập ký tự không phải số vào `waybill_code`, message lỗi hiển thị là gì? Có dùng MSG-011 không? |
| G-013 | Validation | Nội dung hộp thoại xác nhận xóa chỉ là **"gợi ý"** và ghi chú *"chuỗi chính thức đăng ký trong D-00 khi có mã thông báo"*. Tức là message xác nhận xóa chưa được finalize. | Medium | Nội dung chính thức của hộp thoại xác nhận xóa công ty vận chuyển là gì? Đã có message ID trong D-00 chưa? Nếu chưa, khi nào bổ sung? |
| G-014 | Validation | Spec không định nghĩa message toast khi **xóa mềm thành công**. Chỉ có MSG-031 cho Lưu thành công, không có message cho xóa thành công. | Medium | Khi xóa mềm thành công, hệ thống có hiển thị toast thông báo không? Nếu có, dùng message nào (text và ID)? |
| G-015 | Integration | `waybill_code` dùng để **liên kết API phát hành vận đơn tự động**, spec tham chiếu tài liệu *SATO社\_クレオ様連携データに関して\_260313.md* nhưng không mô tả **format bắt buộc** từ phía API đối tác. Validation UI chỉ kiểm tra "half-width số, max 64" — có thể không đủ nếu API yêu cầu format cụ thể hơn. | High | API đối tác yêu cầu `waybill_code` theo format cụ thể nào (số chữ số cố định, prefix bắt buộc, v.v.)? Validation UI hiện tại (half-width số, max 64) có đủ để đảm bảo API không reject không? |
| G-016 | Edge Case | Khi **Drawer đang mở chế độ Sửa** và bản ghi đó **bị xóa mềm bởi user khác** trong lúc này, hành vi khi nhấn Lưu là gì? 楽観的ロック kiểm tra `updated_at` nhưng bản ghi đã xóa (`deleted_at IS NOT NULL`) — không rõ server trả lỗi gì. | Medium | Nếu bản ghi bị xóa mềm bởi user khác trong khi Drawer đang mở, nhấn Lưu sẽ nhận response gì từ server? Hiển thị message nào cho user? |
| G-017 | Edge Case | Xóa mềm rồi tạo lại: spec nói `carrier_code` được phép đăng ký lại sau khi bản ghi cũ đã xóa mềm. Nhưng không rõ `name` và `waybill_code` có được phép trùng với bản ghi đã xóa mềm không. | Medium | Khi tạo mới công ty vận chuyển với cùng `name` hoặc `waybill_code` với một bản ghi đã xóa mềm, hệ thống xử lý thế nào? Unique constraint áp dụng chỉ trên `deleted_at IS NULL` hay toàn bộ? |
| G-018 | Edge Case | Không có spec về hành vi khi nhấn **ra ngoài Drawer** (click outside) hoặc nhấn phím **Escape**: Drawer đóng hay giữ nguyên? Spec chỉ đề cập nút Hủy. | Low | Click outside Drawer hoặc nhấn Escape có đóng Drawer không? Nếu có, hành vi giống nút Hủy (không cảnh báo) hay khác? |
| G-019 | Edge Case | Không có spec về hành vi khi nhấn **Hủy** sau khi đã **nhập/chỉnh sửa dữ liệu** trên form. Spec ghi rõ "không hiển thị xác nhận thay đổi chưa lưu" — có phải đây là intentional behavior? | Low | Khi user đã nhập dữ liệu rồi nhấn Hủy, hệ thống đóng Drawer ngay không có cảnh báo — đây có phải behavior cố ý không? Có nguy cơ mất dữ liệu user vừa nhập không? |
| G-020 | UI/UX | M-07 spec ghi "Không có tìm kiếm / lọc" nhưng không định nghĩa **thứ tự hiển thị** để user dễ tìm bản ghi khi danh sách dài. Nếu có >30 công ty vận chuyển, user phải phân trang để tìm. Không có usability guidance. | Low | Nếu trong tương lai số lượng công ty vận chuyển tăng lên (>100), có kế hoạch bổ sung tìm kiếm không? Hiện tại đây có phải là intentional constraint không? |
| G-021 | UI/UX | Vị trí **nút Xóa (削除)** trong Drawer không được mô tả cụ thể. Spec chỉ nói "Khu vực xóa (chỉ chế độ sửa)" nhưng không nói rõ vị trí (header, body hay footer Drawer), và khoảng cách với nút Lưu/Hủy. | Low | Nút Xóa nằm ở vị trí nào trong Drawer: cùng row với Lưu/Hủy, hay vị trí riêng? Figma node-id=245-5199 có hiển thị layout này không? |
| G-022 | UI/UX | Spec không định nghĩa nội dung **empty state** cho bảng M-07 khi không có công ty vận chuyển nào. Common spec nói "hiển thị message có hướng dẫn tạo mới bản ghi" nhưng không có text/message ID cụ thể cho M-07. | Low | Text empty state trên màn hình M-07 khi không có dữ liệu là gì? Có message ID trong D-00 không? |
| G-023 | Non-functional | Performance target *"tải một trang danh sách dưới 3 giây"* là **"mục tiêu tham khảo"** và ghi chú *"quy mô do PM định"*. Không có: số lượng bản ghi cơ sở để test, điều kiện network (LAN/WAN), hay SLA chính thức. | Low | SLA chính thức cho M-07 là bao nhiêu? Test performance cần dùng dataset bao nhiêu bản ghi? |
| G-024 | Non-functional | Spec đề cập audit log ghi *"Lưu, Xóa mềm... theo common-document / đặc tả audit dự án"* nhưng không link tới document cụ thể. Không rõ audit log bao gồm những field nào, format, và retention policy. | Low | Tài liệu đặc tả audit log cho M-07 là document nào? Field `deleted_by` có trong schema `m_delivery_companies` không (spec ghi "nếu schema có")? |

---

## Tổng hợp theo Priority

### High Risk (cần làm rõ trước khi viết Test Case)

| Gap ID | Vấn đề cốt lõi | Status |
| --- | --- | --- |
| G-001 | MSG-031, MSG-032, MSG-033 chưa có trong D-00 | ✓ Cần lấy từ file message |
| G-002 | `carrier_code` — không có field trên UI, không rõ sinh tự động hay nhập tay | ⏳ Cần làm rõ |
| G-003 | Ràng buộc xóa điều kiện 2 bị cắt đứt, thiếu tên bảng/field | ⏳ Cần làm rõ |
| G-004 | MSG-022 conflict — dùng cho 2 nghĩa khác nhau | ⏳ Cần làm rõ |
| G-005 | Thứ tự sort mặc định M-07 mâu thuẫn với common spec | ✓ Tuân theo M-07 |
| G-006 | `waybill_code` — create null, edit required | ✓ Clarified |
| G-015 | `waybill_code` format từ API đối tác chưa được định nghĩa | ⏳ Cần làm rõ |

### Medium Risk (cần làm rõ trước khi viết TVP)

| Gap ID | Vấn đề cốt lõi |
| --- | --- |
| G-007 | `name` — unique constraint chưa rõ |
| G-008 | `waybill_code` — unique constraint chưa rõ |
| G-009 | Cascade behavior sau xóa mềm |
| G-010 | `waybill_code` — min-length chưa định nghĩa |
| G-011 | Timing validate (on-blur vs on-submit) |
| G-013 | Message xác nhận xóa chưa finalize |
| G-014 | Message toast xóa thành công chưa định nghĩa |
| G-016 | Bản ghi bị xóa mềm trong khi Drawer đang mở |
| G-017 | Unique check sau xóa mềm cho `name` và `waybill_code` |

### Low Risk (có thể làm rõ song song)

| Gap ID | Vấn đề cốt lõi |
| --- | --- |
| G-012 | Message lỗi cho non-numeric `waybill_code` |
| G-018 | Hành vi click outside / Escape |
| G-019 | Hủy khi có dữ liệu chưa lưu (intentional?) |
| G-020 | Usability khi danh sách dài (không có search) |
| G-021 | Vị trí nút Xóa trong Drawer |
| G-022 | Text empty state M-07 |
| G-023 | SLA performance chưa có số cụ thể |
| G-024 | Audit log spec document |
