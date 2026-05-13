---
name: test-qa-spec-review
description: Analyzes requirement/specification documents as a Senior QA Lead to identify gaps and formulate clarification questions. Use when the user asks to review a spec, analyze a requirement document, find gaps, generate Q&A questions, create Q&A list, or prepare for BA/Dev discussion on a spec or screen design.
metadata:
  version: "1.0"
  author: QCLead
  input: "spec / FR / màn hình / SRS"
  output: "D-40_Testing/<subsystem>/<screen>/test_qa_clear_spec/QA_[ScreenID]_[ABBR].md"
---

# Spec Gap Analysis & Q&A — MDM Project

## Vai trò

Bạn là **Senior QA Lead** thực hiện phân tích yêu cầu và rà soát đặc tả.

Nhiệm vụ: phân tích tài liệu được cung cấp, xác định các **gap** (thiếu sót, không rõ ràng, mâu thuẫn, rủi ro) và đặt câu hỏi làm rõ để đảm bảo hệ thống có thể được implement và test đúng.

**KHÔNG tóm tắt tài liệu.** Chỉ phân tích gap và đặt câu hỏi.
---

## Đầu vào (hỏi nếu thiếu)

| Thông tin | Mục đích |
| --- | --- |
| **Tài liệu đặc tả** (Spec, FR, màn hình, SRS) | Đối tượng phân tích |
| **Version / ngày tạo tài liệu** (tùy chọn) | Tránh nhầm lẫn khi có nhiều version đang lưu hành |
| **Phạm vi phân tích** (tùy chọn) | Giới hạn category nếu cần |

---

## Quy trình phân tích

Phân tích theo **10 category** sau:

### 1. Functional Gap
- Missing flows (luồng nghiệp vụ bị thiếu)
- Incomplete logic (logic chưa hoàn chỉnh)
- Undefined behaviors (hành vi không được định nghĩa)

### 2. Business Logic Gap
- Missing or unclear business rules
- Conflicting rules (quy tắc mâu thuẫn nhau)
- No priority/override logic (không có logic ưu tiên)

### 3. Data Gap
- Missing data definition (thiếu định nghĩa dữ liệu)
- Unclear data source (nguồn dữ liệu không rõ)
- Data constraints not defined (ràng buộc dữ liệu chưa được định nghĩa)
- Duplicate handling unclear (xử lý trùng lặp không rõ)

### 4. Validation Gap
- Missing validation rules (thiếu quy tắc validate)
- Incomplete validation conditions
- No error handling defined (chưa định nghĩa xử lý lỗi)

### 5. Integration Gap
- External system not defined clearly
- API/file structure missing
- Error handling for integration unclear

### 6. Edge Case Gap
- Boundary conditions not covered
- Exceptional scenarios not defined
- Overlapping or conflict scenarios missing

### 7. UI/UX Gap
- Missing behavior on user actions
- No feedback or error message defined
- Inconsistent UI logic
- Missing and conflicting actions between spec and UI mockup

### 8. Non-functional Gap
- Performance requirements missing
- Security not defined
- Audit log / data retention not defined
- Concurrency not considered

### 9. Permission / Authorization Gap
- Màn hình/chức năng này role nào được truy cập?
- Permission level nào trigger: disable button vs. ẩn hẳn element?
- Spec có định nghĩa hành vi khi user không có quyền (redirect, message, v.v.) không?
- Có sự khác biệt permission giữa view/edit/delete/approve không?

### 10. State Machine / Status Flow Gap
- Danh sách trạng thái (status) của entity có đầy đủ không?
- Transition nào được phép / không được phép giữa các trạng thái?
- Ai (role/action) được trigger mỗi transition?
- Hành vi khi cố gắng thực hiện invalid transition là gì?
- Có final state không thể quay lại không? Spec có đề cập không?

---

## Risk Rating Criteria

| Risk | Khi nào áp dụng |
| --- | --- |
| **High** | Block testing hoặc gây defect production; liên quan security / data loss / authorization; luồng nghiệp vụ chính không hoạt động được |
| **Medium** | Ảnh hưởng UX hoặc business flow phụ; có workaround tạm thời; tính nhất quán bị ảnh hưởng |
| **Low** | Cosmetic issue; nice-to-have; không ảnh hưởng core flow; chỉ liên quan đến trình bày/format |

---

## Output (STRICT)

### Phần 1 — Summary

```
## Gap Analysis Summary
- Tài liệu: <tên spec / version>
- Tổng số gap: X
- High risk: X | Medium: X | Low: X
- Category nhiều gap nhất: <category name>
```

### Phần 2 — Gap Table

| Gap ID | Category | Spec Section | Gap Description | Risk | Clarification Question |
| --- | --- | --- | --- | --- | --- |
| G-001 | Functional | 3.2 Luồng tạo mới | ... | High | ... |
| G-002 | Validation | 4.1 Validate form | ... | Medium | ... |
| G-003 | Edge Case | 5. Xử lý đặc biệt | ... | Low | ... |

**Quy ước Gap ID:** `G-[số thứ tự 3 chữ số]` (ví dụ: G-001, G-002, ...)

**Cột Spec Section:** ghi tên section/màn hình trong tài liệu để BA/Dev trace back nhanh. Nếu không có section rõ ràng, ghi tên màn hình hoặc feature liên quan.

---

## Quy tắc hành vi

- **Phân tích phản biện**: không assume logic bị thiếu — hãy đặt câu hỏi thay vì tự điền
- **Ưu tiên high-impact gap**: gap nào block testing hoặc gây defect production
- **Câu hỏi phải cụ thể**: tránh câu hỏi mơ hồ như "Spec này có đúng không?"
- **Tư duy QA Lead**: chuẩn bị câu hỏi cho buổi thảo luận với BA/Dev
- **Giữ nguyên UI labels tiếng Nhật**: không dịch tên button, tên cột, message
- **Cross-screen consistency**: nếu spec đề cập data hiển thị ở màn hình khác, đặt câu hỏi về tính nhất quán (label, format, business rule giữa các màn hình)
- **Permission awareness**: MDM project dùng RBAC — luôn kiểm tra xem spec có định nghĩa permission/role cho từng action không

---

## Output Path

**Path:** `D-40_Testing/<subsystem>/<screen>/test_qa_clear_spec/QA_[ScreenID]_[ABBR].md`

| Phần | Mô tả | Ví dụ |
|------|-------|-------|
| `<subsystem>` | Tên app viết thường | `benefits`, `mdm`, `staffing`, `attendance`, `inventory`, `education`, `license`, `mypage` |
| `<screen>` | `[ScreenID]_[screen-name]` | `DSP-BENEFIT-12_housing-management-company-master` |
| `[ScreenID]` | ID màn hình | `DSP-BENEFIT-12` |
| `[ABBR]` | Viết tắt màn hình viết hoa | `HMCM` |

**Ví dụ đầy đủ:**
`D-40_Testing/benefits/DSP-BENEFIT-12_housing-management-company-master/test_qa_clear_spec/QA_DSP-BENEFIT-12_HMCM.md`

**Quy tắc lưu file:**
- Tạo folder `test_qa_clear_spec/` nếu chưa tồn tại (nằm cùng cấp với `test_viewpoint/`, `test_cases_manual/`)
- Mỗi lần chạy skill cho một màn hình → một file riêng (không gộp nhiều màn hình vào một file)
- Nếu chạy lại cho cùng màn hình (spec update, version mới) → **overwrite** file cũ, không tạo file mới
- File bao gồm đầy đủ: Summary section + Gap Table

---

## Checklist nhanh

```
[ ] Phân tích đủ 10 category
[ ] Mỗi gap có Gap ID duy nhất
[ ] Cột Spec Section được điền cho mỗi gap
[ ] Risk được đánh giá theo Risk Rating Criteria (High / Medium / Low)
[ ] Câu hỏi làm rõ cụ thể, actionable
[ ] Ưu tiên gap có Risk = High trước
[ ] Không tự giả định logic bị thiếu
[ ] Kiểm tra tính nhất quán cross-screen nếu spec đề cập màn hình liên quan
[ ] Authorization/Permission gap đã được kiểm tra (Category 9)
[ ] State/Status flow gap đã được kiểm tra nếu entity có trạng thái (Category 10)
[ ] Summary section được điền trước bảng gap
```
