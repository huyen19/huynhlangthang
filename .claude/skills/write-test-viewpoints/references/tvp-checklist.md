# MINDSET

Hãy suy nghĩ như:

* Một người dùng thực (để tìm lỗi)
* Một hacker (để phá vỡ hệ thống)
* Một nhà thiết kế hệ thống (để dự đoán các sự cố)

# Checklist
---

# 1. FUNCTIONAL (HAPPY PATH)

[ ] Flow chính đã được xác định đầy đủ
[ ] Có ít nhất 1 test case cho happy path
[ ] Kết quả output đúng business logic
[ ] Không có bước nào trong flow bị bỏ sót

---

# 2. INPUT VALIDATION (FIELD LEVEL)

For EACH input field:

[ ] Required / Optional đã được xác định
[ ] Kiểm tra input rỗng ("", null)
[ ] Kiểm tra chỉ chứa khoảng trắng
[ ] Đúng data type (string, number, email, date...)
[ ] Format đúng (regex/pattern)
[ ] Độ dài min / max
[ ] Ký tự đặc biệt
[ ] Giá trị ngoài danh sách (invalid enum)
[ ] **Fullwidth / halfwidth** — nếu field liên quan đến ký tự Nhật: test nhập số/ký tự fullwidth (vd: `１２３`, `ＡＢ`)
[ ] **One TVP per field per flow** — mỗi field có 1 TVP validation riêng trong mỗi luồng (Create / Edit / Import); KHÔNG gộp nhiều field vào 1 TVP dù rules giống nhau; KHÔNG dùng mô tả "cùng rules Create" hay "giống màn hình X" làm thay thế
[ ] **Format rule isolation** — nếu format có nhiều quy tắc riêng (vd: vị trí 1-2 chữ hoa, vị trí 3-4 số), mỗi quy tắc phải có TVP vi phạm riêng biệt (không gộp nhiều vi phạm vào 1 TVP)
[ ] **Optional field blank accepted** — field optional phải có TVP kiểm tra bỏ trống → lưu thành công (không lỗi)

---

# 3. BOUNDARY VALUE (BVA)

[ ] Min value
[ ] Min - 1
[ ] Max value
[ ] Max + 1
[ ] Boundary combination giữa nhiều field

---

# 4. NEGATIVE CASE

[ ] Input sai format
[ ] Thiếu dữ liệu
[ ] Dữ liệu không hợp lệ
[ ] Logic sai (ví dụ: ngày kết thúc < ngày bắt đầu)
[ ] System không crash khi lỗi
[ ] Error message đúng và rõ ràng

---

# 5. USER BEHAVIOR (REAL-WORLD)

[ ] User nhập sai rồi sửa lại
[ ] User click liên tục (double click)
[ ] User refresh giữa chừng
[ ] User back/forward browser
[ ] User copy/paste dữ liệu lạ
[ ] User bỏ dở giữa flow

---

# 6. SYSTEM BEHAVIOR

[ ] Xử lý khi API fail
[ ] Xử lý khi network chậm / timeout
[ ] Không crash UI
[ ] Có thông báo lỗi hợp lý
[ ] Retry / fallback (nếu có)

---

# 7. DATA INTEGRITY

[ ] Data được lưu đúng DB
[ ] Không bị mất dữ liệu
[ ] Không duplicate record
[ ] Update đúng field
[ ] Transaction consistency

---

# 8. DB ↔ UI DATA MAPPING

For EACH field displayed on screen or exported to file:

[ ] Mapping giá trị trên UI với các cột trong DB
[ ] Giá trị hiển thị trên UI đúng với giá trị lưu trong DB (không bị transform sai hoặc mất dữ liệu)
[ ] Format transformation đúng spec
[ ] Enum / Status label mapping đúng chiều 
[ ] NULL / empty value hiển thị đúng placeholder theo spec (「-」 / rỗng / N/A — theo từng cột)
[ ] DB có data 
[ ] Round-trip save → reload → display: tất cả fields hiển thị đúng sau khi lưu, không có cột bị sót hoặc bị format sai
[ ] Modal pre-load khi chỉnh sửa: giá trị load vào form đúng DB-format theo spec modal (không bị chèn thêm format của UI display)

---

# 9. INTEGRATION (API) : Apply nếu tài liệu có mô tả API

[ ] API request đúng format
[ ] API response đúng schema
[ ] Xử lý khi API trả lỗi (4xx, 5xx)
[ ] Xử lý khi thiếu field trong response

---

# 10. SECURITY (BASIC)

[ ] SQL Injection (' OR 1=1--')
[ ] XSS (<script>alert(1)</script>)
[ ] Input không hợp lệ bị reject
[ ] Không truy cập trái phép
[ ] Không lộ thông tin nhạy cảm

---

# 11. UX/UI

[ ] Loại input (radio, checkbox, selectbox, textbox, dropdownlist, select2) đúng thiết kế
[ ] Label, text, placeholders đúng tài liệu thiết kế
[ ] Font-size, font-color, icons đúng thiết kế
[ ] Error message rõ ràng
[ ] Highlight đúng field lỗi
[ ] Button enable/disable đúng
[ ] Loading state hiển thị đúng
[ ] Không gây hiểu nhầm cho user
[ ] **List screen — Column header**: label/tên cột hiển thị đúng theo spec (bao gồm cả cột có ký tự Nhật)
[ ] **List screen — Action column**: cột thao tác hiển thị đúng button (edit / delete / view...) trên mỗi row
[ ] **Dropdown / Select**: hiển thị đúng danh sách option; giá trị mặc định đúng theo spec

---

# 12. STATE & FLOW

[ ] Trạng thái trước/sau đúng
[ ] Không cho phép action sai state
[ ] Flow transition hợp lệ
[ ] Không bị lặp hoặc skip trạng thái

---

# 13. CONCURRENCY (ADVANCED)

[ ] Double submit
[ ] Nhiều user thao tác cùng lúc
[ ] Conflict data update
[ ] Không bị overwrite sai

---

# 14. DATA LIFECYCLE

[ ] Create → Read → Update → Delete (CRUD)
[ ] Soft delete / hard delete
[ ] Data retention (lưu bao lâu)
[ ] Data rollback

# 15. SEARCH / FILTER / SORT

[ ] Search đúng kết quả (partial match / exact match theo spec)
[ ] Case insensitive — tìm chữ thường ra chữ hoa và ngược lại (nếu spec cho phép)
[ ] **Halfwidth / fullwidth (Japanese text)** — tìm kiếm bằng halfwidth katakana / fullwidth katakana; kết quả trả về theo đúng mô tả spec (không tự giả định — phải đọc spec trước khi viết TVP)
[ ] Filter kết hợp AND nhiều điều kiện
[ ] Sort đúng thứ tự
[ ] **Validate input field tìm kiếm**: max length, ký tự hợp lệ
[ ] **Dropdown filter**: hiển thị đúng danh sách option; mỗi option lọc đúng kết quả
[ ] **Label button** Search / Reset / Clear đúng theo spec
[ ] Ô tìm kiếm rỗng = không thêm điều kiện lọc
[ ] Trim whitespace đầu/cuối trước khi lọc
[ ] **Search reset về trang 1**: sau khi click Search, danh sách luôn trở về trang 1

# 16. PAGINATION / LARGE DATA

[ ] Page size đúng cấu hình (vd: 20 bản ghi/trang)
[ ] **Hiển thị UI phân trang**: số trang hiện tại, tổng số trang, tổng bản ghi
[ ] **Điều hướng Next page** — click chuyển sang trang tiếp theo
[ ] **Điều hướng Previous page** — click quay về trang trước
[ ] **Jump to page N** — nhảy đến trang bất kỳ
[ ] Last page không bị missing data
[ ] Giữ nguyên điều kiện tìm kiếm khi điều hướng phân trang

# 17. CROSS-FIELD VALIDATION

[ ] Validation giữa nhiều field
[ ] Field A ảnh hưởng Field B
[ ] Combination invalid giữa các field
[ ] Conditional required field

---

# 18. IMPORT / EXPORT : Apply nếu màn hình có chức năng xuất hoặc nhập file

## Export (CSV / Excel)

[ ] **Tên file**: tên file xuất đúng format/convention theo spec
[ ] **Header cột**: label đúng thứ tự và đúng tên theo spec file (có thể khác label UI)
[ ] **Format từng cột**: format trong file theo spec file — phân biệt rõ với format hiển thị UI (hai format có thể khác nhau)
[ ] **Encoding**: UTF-8 BOM hoặc encoding theo spec (mở bằng Excel không bị vỡ ký tự)
[ ] **NULL / empty field**: hiển thị blank hay `—` theo spec
[ ] **Số lượng bản ghi**: file xuất chứa toàn bộ bản ghi khớp điều kiện, không bị giới hạn bởi phân trang UI
[ ] **Thứ tự bản ghi**: thứ tự dòng trong file khớp với thứ tự hiển thị trên màn hình
[ ] **0 kết quả**: khi không có dữ liệu, file chỉ có dòng header (không lỗi)
[ ] **Không chứa soft-deleted**: bản ghi đã xóa logic không xuất hiện trong file

## Import (CSV / Excel)

[ ] **Tiền kiểm tra file**: định dạng (.csv/.xlsx), encoding, kích thước tối đa
[ ] **Preview dữ liệu**: hiển thị đúng số cột, đúng nội dung trước khi import
[ ] **Validate từng cột**: required, format, max length, enum values — theo đúng spec từng cột
[ ] **Rollback on error**: nếu có dòng lỗi → rollback toàn bộ transaction, không partial import
[ ] **Thông báo lỗi**: hiển thị số dòng lỗi và nội dung lỗi cụ thể
[ ] **Import thành công**: data được lưu đúng DB; round-trip verify từng field sau khi import
[ ] **Bỏ qua dòng trống / header**: dòng trống và dòng header không được nhập vào DB
[ ] **Giới hạn số dòng**: test cận giới hạn (vd: 1000 dòng) và vượt giới hạn

---

# FINAL VALIDATION

[ ] Mỗi TVP đã cover đầy đủ checklist (bao gồm #18 nếu màn hình có import/export)
[ ] Mỗi TVP có đủ: Positive + Negative + Boundary
[ ] Test cases không bị trùng logic
[ ] Mỗi test case là atomic (1 behavior)
[ ] Expected result rõ ràng, measurable
[ ] Có thể automation (steps rõ, có data, có locator nếu cần)

---

# OUTPUT EXPECTATION

Sau khi hoàn thành danh sách kiểm tra này:

* Tạo các quan điểm kiểm thử đầy đủ
* Mở rộng thành các trường hợp kiểm thử chi tiết
* Đảm bảo độ bao phủ 100% từ danh sách kiểm tra

---


