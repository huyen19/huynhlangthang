---
name: gen-tc-html
description: Tạo file HTML tracker tương tác từ manual test case markdown (.md) bằng cách chạy generator script — output là file .html trong thư mục test_cases_manual_html (sibling của test_cases_manual), mở trực tiếp bằng browser để track Pass/Fail.
metadata:
  version: "1.1"
  author: QCTeam
  lastUpdate: "2026-05-08"
  input: "Đường dẫn file TC markdown (.md)"
  output: "File .html trong thư mục test_cases_manual_html cùng cấp với test_cases_manual (cùng tên file, thay .md → .html)"
---

# Skill: Generate TC HTML

## Dùng skill này khi

- Có file manual test case `.md` và muốn tạo file HTML tracker để chạy tay
- Cần tạo nhanh HTML mà không cần Claude parse lại toàn bộ nội dung
- Muốn cập nhật HTML sau khi đã chỉnh sửa file `.md`

## Không dùng skill này khi

- Chưa có file `.md` → dùng `/write-manual-tests` trước
- File `.md` không dùng format TC table chuẩn (TC ID bắt đầu bằng `TC-`)

## Đầu vào

User cung cấp đường dẫn đến file markdown test case. Có thể là:
- Đường dẫn tương đối từ workspace root: `D-40_Testing/benefits/.../TC_XXX.md`
- Đường dẫn tuyệt đối: `d:\PROJECT\...\TC_XXX.md`
- Tên file ngắn nếu rõ ràng context (agent tự resolve)

## Quy trình

### Bước 1 — Xác định đường dẫn file input

Lấy đường dẫn file markdown từ args của skill hoặc từ nội dung yêu cầu của user.

Nếu user cung cấp đường dẫn tương đối, dùng nguyên như vậy (Node.js sẽ resolve từ CWD = workspace root).

Nếu không rõ file nào, hỏi user trước khi tiếp tục.

### Bước 2 — Tính đường dẫn output và chạy generator script

Tính đường dẫn output HTML bằng cách:
1. Lấy thư mục chứa file input
2. Thay phần `test_cases_manual` cuối cùng trong đường dẫn thư mục bằng `test_cases_manual_html`
3. Dùng cùng tên file, chỉ thay đuôi `.md` → `.html`

Ví dụ:
- Input:  `D-40_Testing/benefits/DSP-BENEFIT-12_housing-management-company-master/test_cases_manual/TC_DSP-BENEFIT-12_HMCM_v2.md`
- Output: `D-40_Testing/benefits/DSP-BENEFIT-12_housing-management-company-master/test_cases_manual_html/TC_DSP-BENEFIT-12_HMCM_v2.html`

Chạy lệnh sau bằng Bash tool từ workspace root (`d:\PROJECT\1848_MDM\1848_FE_Source`):

```bash
node ".claude/skills/gen-tc-html/scripts/gen_tc_html.cjs" "<đường-dẫn-file-md>" "<đường-dẫn-output-html>"
```

Ví dụ:
```bash
node ".claude/skills/gen-tc-html/scripts/gen_tc_html.cjs" \
  "D-40_Testing/benefits/DSP-BENEFIT-12_housing-management-company-master/test_cases_manual/TC_DSP-BENEFIT-12_HMCM_v2.md" \
  "D-40_Testing/benefits/DSP-BENEFIT-12_housing-management-company-master/test_cases_manual_html/TC_DSP-BENEFIT-12_HMCM_v2.html"
```

Script sẽ tự động:
- Parse markdown, nhận diện TC theo regex `TC-[A-Za-z0-9][A-Za-z0-9_-]{2,}`
- Group theo `##` section và `###` subgroup
- Tạo thư mục `test_cases_manual_html` nếu chưa tồn tại
- Sinh file HTML tại đường dẫn output đã chỉ định

### Bước 3 — Báo cáo kết quả

Sau khi script chạy thành công, báo cáo:
- Số test case đã parse được (từ stdout của script)
- Đường dẫn file HTML đã sinh
- Kích thước file HTML

Nếu script lỗi (exit code ≠ 0), hiển thị stderr và dừng.

## Ví dụ output khi thành công

```
Parsed 42 test cases.
Wrote D-40_Testing/benefits/.../test_cases_manual_html/TC_DSP-BENEFIT-12_HMCM_v2.html (185.3 KB)
```

Báo cáo cho user:
- File HTML đã tạo tại: `[đường dẫn .html trong test_cases_manual_html]`
- Tổng TC: 42
- Mở file bằng browser (không cần server) để bắt đầu tracking

## Ràng buộc

- Không sửa nội dung file `.md` — chỉ đọc để sinh HTML
- File HTML output luôn đặt trong thư mục `test_cases_manual_html` (sibling của `test_cases_manual`); thư mục này được tạo tự động nếu chưa tồn tại
- Nếu file `.html` đã tồn tại, script sẽ ghi đè — không cần xác nhận
