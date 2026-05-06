# Quy tắc xử lý TVP mơ hồ và tự giả định kết quả

**Nguyên tắc bắt buộc**: Khi xây dựng TVP, nếu gặp bất kỳ tình huống nào dưới đây, PHẢI dừng lại và cảnh báo rõ ràng thay vì tự suy diễn.

---

## GAP giữa Mockup (UI) và Spec (tài liệu đặc tả)

Khi phát hiện **sự khác biệt (GAP) giữa nội dung mockup và nội dung spec**:

- **Ưu tiên lấy spec làm cơ sở** để xây dựng TVP — spec là tài liệu yêu cầu chính thức, mockup chỉ là tham khảo UI.
- **Vẫn xây dựng TVP dựa trên spec** mà không đánh dấu `[⚠️ Need Confirm]` hay block TVP.
- **Ghi chú nhẹ** sự khác biệt trong cột TVP Description bằng ký hiệu: `[⚠️ Mock≠Spec: follow Spec]` để người đọc biết cần kiểm tra/fix mockup trước khi test.
- Chỉ chuyển sang `[⚠️ Need Confirm]` nếu **spec cũng không rõ ràng** (tức là cả spec lẫn mockup đều mơ hồ hoặc mâu thuẫn nhau mà không có căn cứ nào để phán quyết).

| Tình huống | Cách xử lý |
|---|---|
| Mockup: `maxlength="50"`, Spec: tối đa 20 ký tự | Viết TVP boundary theo spec (max=20); ghi `[⚠️ Mock≠Spec: follow Spec]` |
| Mockup: không có option「完了」trong filter, Spec: có option「完了」 | Viết TVP kiểm tra option「完了」theo spec; ghi `[⚠️ Mock≠Spec: follow Spec]` |
| Mockup: có nút X, Spec: không đề cập nút X | Bỏ qua nút X trong TVP hoặc ghi `[⚠️ Need Confirm]` vì spec chưa định nghĩa |

---

## Dấu hiệu TVP đang bị mơ hồ

Gắn nhãn `⚠️ AMBIGUOUS` vào TVP khi:

- Đặc tả **không nêu rõ** điều kiện kích hoạt, ngưỡng giá trị, hoặc hành vi cụ thể cần kiểm tra.
- TVP Description chứa các từ chủ quan, không đo lường được: *"hợp lý"*, *"phù hợp"*, *"đủ nhanh"*, *"bình thường"*.
- Tài liệu mô tả nhiều hành vi có thể xảy ra nhưng không chỉ định hành vi nào là đúng.
- Phạm vi kiểm thử phụ thuộc vào logic nghiệp vụ chưa được định nghĩa trong tài liệu.

---

## Dấu hiệu đang tự giả định kết quả

Gắn nhãn `⚠️ ASSUMPTION` vào TVP khi:

- Kết quả mong đợi dự kiến được suy ra từ **kinh nghiệm chung** hoặc **hệ thống tương tự**, không từ tài liệu hiện tại.
- TVP ngụ ý một kết quả cụ thể nhưng tài liệu không xác nhận kết quả đó.
- Hành vi mặc định (default behavior) chưa được tài liệu hóa mà vẫn được đưa vào TVP như đã biết.

---

## Cách xử lý

Khi phát hiện TVP mơ hồ hoặc có giả định, thực hiện theo thứ tự:

1. **Vẫn liệt kê TVP đó** trong bảng đầu ra, kèm nhãn cảnh báo tương ứng.
2. **Ghi chú rõ phần bị mơ hồ hoặc tự giả định** trong cột TVP Description bằng ký hiệu: `[⚠️ Need Confirm]`
3. **Tổng hợp danh sách câu hỏi cần làm rõ** ở cuối output, theo định dạng:

```
## ⚠️ Các điểm cần làm rõ trước khi hoàn thiện TVP

| # | TVP ID liên quan | Nội dung cần xác nhận | Lý do không thể tự suy diễn |
|---|-----------------|----------------------|------------------------------|
| 1 | TVP-XXX         | ...                  | ...                          |
```
