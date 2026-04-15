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
[ ] File xuất (CSV / Excel): format của từng cột theo spec file — phân biệt rõ với format hiển thị UI (hai format có thể khác nhau)
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

[ ] Search đúng kết quả
[ ] Case insensitive
[ ] Filter kết hợp
[ ] Sort đúng thứ tự

# 16. PAGINATION / LARGE DATA

[ ] Page size
[ ] Next / previous
[ ] Last page
[ ] Không missing data

# 17. CROSS-FIELD VALIDATION

[ ] Validation giữa nhiều field
[ ] Field A ảnh hưởng Field B
[ ] Combination invalid giữa các field
[ ] Conditional required field

---

# FINAL VALIDATION

[ ] Mỗi TVP đã cover đầy đủ checklist
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


