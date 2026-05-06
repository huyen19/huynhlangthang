# Guide: Xử lý GAP giữa Mockup và Spec

Áp dụng khi phát hiện **sự khác biệt (GAP) giữa nội dung mockup (UI Mock) và nội dung spec (D-14)**.

---

## Quy tắc xử lý

1. **Spec luôn được ưu tiên** — lấy thông tin từ spec làm cơ sở chính xác để viết TC.
2. **Ghi nhận GAP rõ ràng** — thêm comment vào cột Expected Result:
   > ⚠️ GAP: Mockup hiển thị [X], nhưng Spec quy định [Y] → ưu tiên theo Spec.
3. **KHÔNG được viết TC dựa trên mockup** nếu mockup mâu thuẫn với spec, trừ khi có hướng dẫn rõ ràng khác từ người dùng.
4. **Liệt kê tất cả GAP phát hiện được** vào một bảng tổng hợp ở đầu phần output (trước các TC), theo mẫu:

| # | Vị trí | Mockup hiển thị | Spec quy định | Quyết định |
|---|--------|-----------------|---------------|------------|
| 1 | [TVP/Field/Button] | [nội dung mockup] | [nội dung spec] | Theo Spec |

> ✅ Nếu không có GAP nào: ghi `> ✅ Không phát hiện GAP giữa Mockup và Spec.` trước phần TC.
