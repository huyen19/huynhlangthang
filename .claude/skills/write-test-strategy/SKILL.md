---
name: write-test-strategy
description: Phân tích tài liệu dự án và sinh Test Strategy Document — bao gồm mục tiêu kiểm thử, đánh giá rủi ro, phạm vi, approach, test data, và automation strategy.
metadata:
  version: "1.0"
  author: QCLead
  lastUpdate: "2026-05-01"
  input: "tài liệu dự án / spec / design doc / requirements"
  output: "D-40_Testing/<subsystem>/test_strategy/TEST_STRATEGY_<ABBR>.md"
---

# Skill: Test Strategy Document

## Dùng skill này khi

- Bắt đầu một dự án hoặc sprint mới cần định hình chiến lược kiểm thử
- Cần đánh giá rủi ro tổng thể trước khi phân bổ test effort
- Cần tài liệu chiến lược kiểm thử cho stakeholder hoặc team lead review

## Không dùng skill này khi

- Đã có test strategy, chỉ cần viết test viewpoints → dùng `write-test-viewpoints`
- Chỉ cần viết test case cụ thể → dùng `write-manual-tests`
- Chỉ cần script tự động → dùng `write-e2e-script`

---

## Đầu vào

Một trong các dạng sau:
- Tài liệu yêu cầu (requirements / BRD / FRD)
- Basic design hoặc detail design
- Mô tả hệ thống / module

---

## Quy trình phân tích (bắt buộc đủ 10 bước)

### 1. Tổng quan hệ thống

- Hệ thống là gì và mục đích chính?
- Các luồng nghiệp vụ quan trọng nhất?

### 2. Các mục tiêu kiểm thử chính

Xác định các module/tính năng quan trọng nhất CẦN được kiểm thử.  
Tập trung vào các lĩnh vực có tác động kinh doanh cao nhất.

Output dạng bảng:

| ID | Priority | Module / Tính năng | Lý do |
|----|----------|--------------------|-------|

### 3. Đánh giá rủi ro

Xác định các rủi ro hàng đầu theo 4 nhóm:

- **Business risk** — ảnh hưởng tới nghiệp vụ
- **Data risk** — tính toàn vẹn, chính xác của dữ liệu
- **Integration risk** — điểm tích hợp giữa các service / module
- **Technical risk** — nợ kỹ thuật, độ phức tạp, công nghệ mới

Với mỗi rủi ro cung cấp: Impact (High/Medium/Low) và lý do tại sao quan trọng.

### 4. Test Scope

- **In scope:** những gì phải kiểm thử
- **Out of scope:** những gì có thể loại trừ (kèm lý do)

### 5. Test Approach (Core Strategy)

Định nghĩa theo:
- **Test levels:** Unit / Integration / System / UAT
- **Test types:** Functional / API / Data / Integration / Performance (nếu có)

Tập trung vào CẦN KIỂM TRA CÁI GÌ và NƠI NÀO cần đặt nỗ lực.

### 6. Test Focus Areas

Highlight:
- Critical logic
- Complex validation
- Edge cases
- High-risk data scenarios

### 7. Test Data Strategy

- Key data cần chuẩn bị
- Edge case quan trọng
- Data dependencies giữa các module

### 8. Automation Strategy

- Những gì nên tự động hóa (ROI cao: regression, smoke, happy path)
- Những gì nên thực hiện thủ công (exploratory, UAT, one-off)

### 9. Entry / Exit Criteria

Đơn giản và thực tế:
- **Entry:** điều kiện để bắt đầu kiểm thử
- **Exit:** điều kiện để kết thúc / release

### 10. Gaps & Questions

Liệt kê các điểm còn thiếu hoặc chưa rõ ảnh hưởng đến hiệu quả kiểm thử.  
Nếu không rõ — đừng giả định, hãy nêu ra như rủi ro hoặc câu hỏi.

---

## Output format

```
1. System Overview
2. Key Test Targets
3. Risk Assessment
4. Test Scope
5. Test Approach
6. Test Focus Areas
7. Test Data Strategy
8. Automation Strategy
9. Entry / Exit Criteria
10. Gaps & Questions
```

## Output path

`D-40_Testing/<subsystem>/test_strategy/TEST_STRATEGY_<ABBR>.md`

- `<subsystem>`: tên app viết thường — `benefits`, `mdm`, `staffing`, `attendance`, `inventory`, `education`, `license`, `mypage`
- `<ABBR>`: viết tắt viết hoa của tên module — ví dụ `MDM`, `BENEFITS`, `STAFFING`

Sau khi sinh xong nội dung, **lưu file vào đúng path trên** bằng Write tool.

---

## Guidelines

- Ngắn gọn và thiết thực
- Tập trung vào kiểm thử dựa trên rủi ro
- Tránh lý thuyết không cần thiết
- Ưu tiên các quyết định kiểm thử thực tế
- Không giả định khi thiếu thông tin — nêu rõ trong mục Gaps & Questions
