---
description: Tạo Test View Point từ tài liệu yêu cầu
---

# Command: Tạo Test View Point từ Tài liệu Yêu cầu

## Mô tả
Tạo Test View Point (TVP) có cấu trúc từ tài liệu yêu cầu và chiến lược kiểm thử (nếu có), sau đó lưu vào đường dẫn chỉ định.

## Cú pháp
```
/create-testviewpoint <requirement_path> [test_strategy_path] <output_path>
```

## Tham số

| Tham số | Bắt buộc | Mô tả |
|---|---|---|
| `requirement_path` | Có | Đường dẫn đến tài liệu yêu cầu (Spec/SRS/UI/BasicDesign) |
| `test_strategy_path` | Không | Đường dẫn đến file Test Strategy. Nếu không cung cấp, TVP sẽ được tạo dựa hoàn toàn vào tài liệu yêu cầu |
| `output_path` | Có | Đường dẫn file markdown để lưu TVP sau khi tạo |

## Ví dụ sử dụng
```
# Có Test Strategy
/create-testviewpoint benefits-document/VN/D-14_BasicDesign/BenefitsApplicationList.md benefits-document/VN/D-40_Testing/TVP/TVP_TStrategy_BenefitsApplicationList_ver1.md benefits-document/VN/D-40_Testing/TVP/TVP_BenefitsApplicationList_ver1.md

# Không có Test Strategy
/create-testviewpoint benefits-document/VN/D-14_BasicDesign/BenefitsApplicationList.md benefits-document/VN/D-40_Testing/TVP/TVP_BenefitsApplicationList_ver1.md
```

---

## Hướng dẫn thực thi (Agent follow this)

Khi command này được gọi với các tham số `$ARGUMENTS`:
- Nếu có **3 tham số**: **param1** = `requirement_path`, **param2** = `test_strategy_path`, **param3** = `output_path`
- Nếu có **2 tham số**: **param1** = `requirement_path`, **param2** = `output_path` (không có test strategy)

### Bước 1 — Đọc Skill
Đọc và tuân thủ toàn bộ hướng dẫn trong skill file:
`.agents\skills\test-view-point\SKILL.md`

### Bước 2 — Đọc tài liệu đầu vào
Đọc song song các file sau:
- `param1` (`requirement_path`) — tài liệu yêu cầu gốc (Spec / SRS / UI / BasicDesign)
- `param2` (`test_strategy_path`) — file Test Strategy *(nếu được cung cấp)* để định hướng phạm vi và chiến lược kiểm thử


### Bước 3 — Tạo Test View Point
Áp dụng đầy đủ skill `test-view-point` để sinh TVP từ nội dung đã đọc ở Bước 2:

- Xác định Module / Feature / Key functionalities từ tài liệu yêu cầu
- Xây dựng các điểm quan sát kiểm thử (UI, Functional, Validation, Data, Integration, Edge case)
- Áp dụng các kỹ thuật thiết kế kiểm thử phù hợp
- Ưu tiên các khu vực rủi ro cao
- Đảm bảo output format đúng chuẩn (bảng markdown với đủ 6 cột: ID TVP | Module | Feature | TVP Description | Test Type | Priority)

### Bước 4 — Lưu kết quả
Lưu toàn bộ TVP vào file tại `output_path` (param cuối).
- Nếu file chưa tồn tại thì tạo mới
- Nếu file đã tồn tại thì **cập nhật nội dung vào file hiện có**
  - Thông báo cho người dùng biết tên file mới được tạo
- Thêm header: tên file, ngày tạo, link tài liệu tham chiếu

### Bước 5 — Báo cáo kết quả
Sau khi hoàn thành, thông báo:
- Tổng số TVP ID đã tạo
- Danh sách Module / Feature đã được cover
- Đường dẫn file output
- Các điểm cần confirm spec (nếu có, đánh dấu **`Need confirm spec?`**)
