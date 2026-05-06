Description: Tạo Test Case từ Tài liệu Yêu cầu
---
name: create-testcase
description: Tạo test case từ tài liệu yêu cầu
---

# Command: Tạo Test Case từ Tài liệu Yêu cầu

## Mô tả
Tạo test case chi tiết từ tài liệu yêu cầu (TVP/Spec) và lưu vào đường dẫn chỉ định. 

## Cú pháp
```
/create-testcase <requirement_path> <tvp_path> <output_path>
```

## Tham số

| Tham số | Bắt buộc | Mô tả |
|---|---|---|
| `requirement_path` | Có | Đường dẫn đến tài liệu yêu cầu (Spec/SRS/UI/BasicDesign) |
| `tvp_path` | Có | Đường dẫn đến file Test View Point (TVP) |
| `output_path` | Có | Đường dẫn file markdown để lưu test case sau khi tạo |

## Ví dụ sử dụng
```
/create-testcase benefits-document/VN/D-14_BasicDesign/BenefitsApplicationList.md benefits-document/VN/D-40_Testing/TVP/TVP_BenefitsApplicationList_ver1.md benefits-document/VN/D-40_Testing/TestCase/TCs_BenefitsApplicationList_ver2.md
```

---

## Hướng dẫn thực thi (Agent follow this)

Khi command này được gọi với 3 tham số `$ARGUMENTS`:
- **param1** = `requirement_path` — tài liệu yêu cầu đầu vào (Spec/SRS/UI/BasicDesign)
- **param2** = `tvp_path` — file Test View Point (TVP) chỉ định các điểm kiểm thử
- **param3** = `output_path` — đường dẫn file output lưu test case

### Bước 1 — Đọc Skill
Đọc và tuân thủ toàn bộ hướng dẫn trong skill file:
`.agents\skills\testcase-creater\SKILL.md`

### Bước 2 — Đọc tài liệu yêu cầu và TVP
Đọc song song hai file:
- `param1` (requirement_path) — nội dung Spec / SRS / UI / BasicDesign làm tài liệu gốc
- `param2` (tvp_path) — file TVP để xác định các test view point và phạm vi kiểm thử

### Bước 3 — Tạo Test Case
Áp dụng đầy đủ skill `testcase-creater` để sinh test case từ nội dung đã đọc ở Bước 2:
- Phân tích từng TVP
- Áp dụng các kỹ thuật thiết kế kiểm thử
- Tạo đầy đủ: Normal / Negative / Boundary / Validation / Edge / Integration scenarios
- Đảm bảo output format đúng chuẩn (bảng markdown với đủ 9 cột)

### Bước 4 — Lưu kết quả
Lưu toàn bộ test case vào file tại `param3` (output_path).

Kiểm tra điều kiện dựa trên tài liệu đầu vào `param1` và `param2`:
- Nếu file output đã tồn tại nhưng được tạo từ **khác** `param1` hoặc `param2` so với lần trước → **tạo mới file** theo định dạng: `TCs_<tên tài liệu gốc>_<version>.md`
  - Lấy tên tài liệu gốc từ `param2` (bỏ phần `TVP_` prefix và extension)
  - Tự động tăng version (ví dụ: nếu `ver1` đã tồn tại thì dùng `ver2`, v.v.)
  - Thông báo cho người dùng biết tên file mới được tạo
- Nếu file output đã tồn tại và được tạo từ **cùng** `param1` và `param2` → **cập nhật (update) trực tiếp** vào file đó
- Nếu file chưa tồn tại → **tạo mới file** tại đường dẫn `param3`

- Thêm header: tên file, ngày tạo, link tài liệu tham chiếu

### Bước 5 — Báo cáo kết quả
Sau khi hoàn thành, thông báo:
- Tổng số TC đã tạo
- Đường dẫn file output
- Các điểm cần confirm spec (nếu có)
