# 3. Cấu trúc testcase (STRICT)

Mỗi trường hợp thử nghiệm PHẢI bao gồm:
## 1. TC ID 
- Quy tắc: định danh duy nhất cho mỗi testcase, có cấu trúc rõ ràng
- Format: TC-[Module]-[Number]

## 2. TVP ID 
- Mỗi TC phải map ít nhất 1 TVP
- 1 TVP có thể có nhiều TC

## 3. Module
- Tên module/màn hình mà TC thuộc về.
- Mapping giá trị Module tương ứng với trong file TVP

## 4. Test Description
- Mô tả ngắn gọn, rõ ràng mục tiêu cần test
- Không mô tả step
- Từ nội dung TVP tách TC chi tiết theo từng điều kiện hoặc từng item được liệt kê trong TVP, đảm bảo mỗi điều kiện hoặc mỗi item có ít nhất 1 TC

**Ví dụ TVP - 完了/削除/CSV取込/CSV出力 khả dụng với cả role 担当者 và 上長**
    - Tách thành 8 testcase riêng biệt: mỗi chức năng (完了, 削除, CSV取込, CSV出力) cho từng vai trò (担当者, 上長). Mỗi TC kiểm thử 1 chức năng với 1 vai trò.

## 5. Preconditions 
- Xác định điều kiện tiên quyết của hệ thống để testcase được thực thi đúng logic 
- Quy tắc: Rõ ràng, có thể tái sử dụng, không phụ thuộc step trước đó

## 6. Test Steps 
- Mục đích: Mô tả hành động cụ thể của user/system
- Quy tắc: 1 step = 1 action

## 7. Test Data 
- Xác định dữ liệu dùng cho từng testcase
- Data phải cụ thể
- Dựa vào kinh nghiệm có thể đưa ra giá trị thường hay gặp lỗi
- Data bao gồm các vùng: valid data, invalid data, boundary, duplicate
- Đối với các ô input có thể nhập giá trị cần tách thành các case validate:
   + Loại kí tự: chữ, số, kí tự đặc biệt, Katakana, Hiragana, full-width/ half-width
   + SQL injection, XSS 

## 8. Expected Result 
- Mô tả rõ ràng kết quả cần verify, không mơ hồ
- Cùng nội dung expect result (theo TVP) nhưng thuộc các điều kiện đầu vào khác nhau (precondition) thì tách thành các testcase chi tiết theo từng điều kiện
- Với những testcase không xác định được kết quả mong đợi từ các tài liệu tham chiếu thì điền thông tin theo format: **`[Need confirm Spec?]`**
- Với Test Type :`Data` expect bắt buộc cần mapping với dữ liệu trong DB. Theo format: `table_DB.column`
**Ví dụ : t_benefits_application.employee_cd**

### Nguyên tắc "Một TC — Một Expected Result" (CRITICAL)

**Mỗi testcase chỉ được kiểm tra DUY NHẤT MỘT điều kiện và MỘT kết quả mong đợi.**

❌ **KHÔNG ĐƯỢC** gộp hai trạng thái đối lập vào cùng một TC:
```
# SAI — Expected Result có 2 trạng thái trái ngược:
Expected: "Nút X enabled khi chọn ≥1 đơn; disabled khi selection = 0"

# SAI — Expected Result liệt kê cả before và after như 2 assertions riêng:
Expected: "1. Trước khi chọn: Nút X disabled\n2. Sau khi chọn: Nút X enabled"
```

✅ **PHẢI** tách thành hai TC riêng biệt:
```
TC-A: "Nút X disabled khi không có đơn được chọn"
  Expected: Nút X disabled

TC-B: "Nút X enabled khi chọn ≥1 đơn"
  Expected: Nút X enabled sau khi chọn ≥1 đơn
```

**Quy tắc áp dụng cho các hành vi đối lập phổ biến:**
- `enabled` vs `disabled`
- `visible` vs `hidden`
- `success` vs `error`
- `allowed` vs `blocked`
- `saved` vs `not saved`

**Ngoại lệ hợp lệ:** Ghi nhận trạng thái ban đầu ở **Preconditions** (không phải Expected Result) là chấp nhận được khi trạng thái đó là điều kiện tiên quyết chứ không phải mục tiêu kiểm thử.

**Khi phát hiện một TVP bao gồm nhiều trạng thái đối lập → tách thành nhiều TC, mỗi TC cover một trạng thái.**

## 9. Test Type 
- Bao gồm : UI/Functional / Validation / Integration / Negative / Edge/Data

## 10. Priority 
- Bao gồm: High / Medium / Low
