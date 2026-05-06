---
description: Tạo Q&A Spec từ tài liệu yêu cầu
---

# Command: Tạo Q&A Spec từ Tài liệu Yêu cầu

## Mô tả
Phân tích tài liệu yêu cầu và giao diện UI như một Senior QA Lead để xác định gap, rủi ro và tạo danh sách câu hỏi làm rõ (Q&A), sau đó lưu vào đường dẫn chỉ định.

## Cú pháp
```
/create-testQ&A <requirement_path> <ui_path> <output_path>
```

## Tham số

| Tham số | Bắt buộc | Mô tả |
|---|---|---|
| `requirement_path` | Có | Đường dẫn đến tài liệu yêu cầu (Spec/SRS/FR/BasicDesign) |
| `ui_path` | Có | Đường dẫn đến tài liệu mô tả giao diện UI (Screen Spec/UI Design) |
| `output_path` | Có | Đường dẫn file markdown để lưu danh sách Q&A sau khi tạo |

## Ví dụ sử dụng
```
/create-testQ&A benefits-document/VN/D-14_BasicDesign/BenefitsApplicationList.md benefits-document/VN/D-14_BasicDesign/UI_BenefitsApplicationList.md benefits-document/VN/D-40_Testing/Q&A_Spec/Q&A_BenefitsApplicationList_ver1.md
```

---

## Hướng dẫn thực thi (Agent follow this)

Khi command này được gọi với 3 tham số `$ARGUMENTS`:
- **param1** = `requirement_path` — tài liệu yêu cầu đầu vào (Spec/SRS/FR/BasicDesign)
- **param2** = `ui_path` — tài liệu mô tả giao diện UI (Screen Spec/UI Design)
- **param3** = `output_path` — đường dẫn file output lưu danh sách Q&A

### Bước 1 — Đọc Skill
Đọc và tuân thủ toàn bộ hướng dẫn trong skill file:
`.agents\skills\test-Q&A\SKILL.md`

### Bước 2 — Đọc tài liệu đầu vào
Đọc song song hai file:
- `param1` (`requirement_path`) — nội dung Spec / SRS / FR / BasicDesign làm tài liệu gốc để phân tích logic nghiệp vụ, quy tắc xử lý và luồng chức năng
- `param2` (`ui_path`) — tài liệu UI/Screen Spec để phân tích gap về UI/UX, behavior trên giao diện, error message và user action

### Bước 3 — Phân tích Gap và Tạo Q&A
Áp dụng đầy đủ skill `test-qa-spec-review` để phân tích nội dung đã đọc ở Bước 2:
- Phân tích theo đủ 8 category: Functional / Business Logic / Data / Validation / Integration / Edge Case / UI-UX / Non-functional
- Xác định các gap: thiếu sót, không rõ ràng, mâu thuẫn, rủi ro
- Đặt câu hỏi làm rõ cụ thể, actionable cho từng gap
- Đánh giá Risk level: High / Medium / Low cho từng gap
- Ưu tiên gap có Risk = High trước

### Bước 4 — Lưu kết quả
Kiểm tra điều kiện dựa trên tài liệu đầu vào `param1` (`requirement_path`) và `param2` (`ui_path`):
- Nếu file `output_path` **chưa tồn tại**: tạo mới file và ghi toàn bộ danh sách Q&A
- Nếu file `output_path` **đã tồn tại** (cùng bộ input `param1` + `param2`): **bổ sung (append)** các Q&A mới vào cuối file, không xóa nội dung cũ
- Thêm header: tên file, ngày tạo, link tài liệu tham chiếu

### Bước 5 — Báo cáo kết quả
Sau khi hoàn thành, thông báo:
- Tổng số gap / câu hỏi đã tạo
- Phân bổ theo Risk level (High / Medium / Low)
- Phân bổ theo Category (8 category)
- Đường dẫn file output
