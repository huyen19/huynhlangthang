# Guide: Search / Filter / Sort Test Coverage

Dùng khi viết TC cho màn hình có **keyword search**, **filter**, hoặc **sort**.

---

## Checklist coverage theo Test Type

### UI / Functional

| # | Kịch bản cần cover | Ghi chú |
|---|-------------------|---------|
| F-01 | Verify static text: label của search/filter fields, tên nút, placeholder | → Test Type: **UI** |
| F-02 | Trạng thái mặc định khi trang load: search field rỗng, filter về mặc định | → Test Type: **UI** |
| F-03 | Nhập keyword / chọn filter hợp lệ → danh sách cập nhật đúng | Happy path → Test Type: **Functional** |
| F-04 | Xóa / reset filter → danh sách trở về trạng thái ban đầu | → Test Type: **Functional** |
| F-05 | Hủy thao tác filter (nếu có nút Cancel / click ngoài) → filter không thay đổi | Nếu UI có cancel → Test Type: **Functional** |

### Integration

| # | Kịch bản cần cover | Ghi chú |
|---|-------------------|---------|
| I-01 | Phân trang reset về trang 1 sau khi apply filter mới | |
| I-02 | Giữ filter state khi chuyển trang — kết quả ở trang 2+ vẫn bị lọc theo điều kiện đã chọn | |
| I-03 | Sort kết hợp với filter → kết quả phản ánh đúng cả hai điều kiện | Nếu có cả sort lẫn filter |

### Negative

| # | Kịch bản cần cover | Test Type | Ghi chú |
|---|-------------------|-----------|---------|
| N-01 | Filter / keyword không khớp bất kỳ bản ghi nào → empty state + đúng message | **Negative** | |
| N-02 | Lỗi khi tải kết quả search → error state hiển thị, có nút retry | **Negative** | |
| N-03 | Nhập ký tự đặc biệt, SQL injection, XSS vào keyword → không crash, không lỗi JS | **Negative** | |

### Validation

| # | Kịch bản cần cover | Test Type | Ghi chú |
|---|-------------------|-----------|---------|
| V-01 | Nhập sai format vào filter field có format rule (vd: date, number) → inline error | **Validation** | Nếu field có validate |
| V-02 | Vượt maxlength của keyword / filter field → bị block hoặc cắt bớt | **Validation** | Nếu field có maxlength |

### Edge Case

| # | Kịch bản cần cover | Test Type | Ghi chú |
|---|-------------------|-----------|---------|
| E-01 | Keyword có khoảng trắng đầu/cuối — trim hay tìm chính xác? | **Edge Case** | Confirm với spec |
| E-02 | Case sensitivity: "ABC" vs "abc" — kết quả có khác không? | **Edge Case** | Confirm với spec |
| E-03 | Keyword chỉ toàn khoảng trắng → behavior? | **Edge Case** | |
| E-04 | Kết hợp nhiều filter cùng lúc → kết quả theo AND logic | **Edge Case** | Dùng Decision Table bên dưới |

### Data

| # | Kịch bản cần cover | Test Type | Ghi chú |
|---|-------------------|-----------|---------|
| D-01 | Input chứa ký tự đặc biệt ngôn ngữ (tiếng Nhật, Unicode...) | **Data** | Nếu dự án đa ngôn ngữ |
| D-02 | Dữ liệu hiển thị trên danh sách khớp với giá trị thực trong DB | **Data** | Query DB để xác nhận |
| D-03 | Filter theo điều kiện X → chỉ hiển thị bản ghi có giá trị X trong DB, không lọt bản ghi khác | **Data** | |
| D-04 | Tổng số bản ghi hiển thị (total count / pagination) khớp với số record trong DB thỏa điều kiện filter | **Data** | |
| D-05 | Thứ tự sort trên UI khớp với thứ tự dữ liệu khi query DB theo cùng field | **Data** | Nếu có sort |
| D-06 | Partial match (tìm kiếm gần đúng) — kết quả UI khớp với kết quả LIKE query trong DB | **Data** | Nếu search partial |

---

## Matrix filter combination (Decision Table)

Khi màn hình có từ 2 filter trở lên, tạo bảng tổ hợp để đảm bảo cover AND logic:

| Filter A | Filter B | Kết quả kỳ vọng |
|----------|----------|-----------------|
| Có giá trị | Rỗng | Chỉ lọc theo A |
| Rỗng | Có giá trị | Chỉ lọc theo B |
| Có giá trị | Có giá trị | Lọc theo A AND B |
| Rỗng | Rỗng | Không filter → trả về tất cả (hoặc trang mặc định) |

> Mở rộng bảng cho 3+ filter nếu cần — dùng pairwise để giảm số TC khi quá nhiều tổ hợp.

---

## Quy tắc Expected Result cho TC search/filter

1. **Ghi số lượng bản ghi** kết quả nếu dữ liệu test được kiểm soát:
   - ✅ `Danh sách hiển thị 3 bản ghi khớp filter`
   - ❌ `Danh sách cập nhật`

2. **Empty state**: ghi chính xác nội dung message theo spec — không paraphrase

3. **Phân trang**: ghi rõ `pagination reset về page 1` khi apply filter mới

4. **DB mapping**: ghi rõ dữ liệu seed dùng để verify — không check DB nếu test data không được kiểm soát
