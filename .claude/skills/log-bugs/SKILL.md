---
name: log-bugs
description: Đọc FAIL TCs từ HTML tracker export JSON + TC markdown, hiển thị danh sách để tester chọn, tạo bug report chuẩn ISTQB lên Backlog qua MCP, và ghi nhận issue key vào sidecar JSON để tránh log trùng lần sau.
metadata:
  version: "1.0"
  author: QCTeam
  lastUpdate: "2026-05-07"
  input: "D-40_Testing/<feature>/test_cases_manual/ (TC .md) + test_result_export_json/ (export *_results_*.json)"
  output: "Backlog issues được tạo + log_bugs_state.json cập nhật"
---

# Skill: Log Bugs to Backlog

## Dùng khi

- Sau khi tester đánh kết quả FAIL trên HTML tracker và export JSON
- Muốn tạo bug report lên Backlog tự động
- Muốn track TC nào đã được log để không log lại lần sau

## Không dùng khi

- Chưa export JSON từ HTML tracker (yêu cầu tester export trước)
- Chưa có Backlog config (yêu cầu tạo `.claude/skills/log-bugs/backlog.config.json`)

---

## Các bước thực hiện

### Bước 1 — Xác định đầu vào

Hỏi user (nếu chưa cung cấp):
1. **Feature folder**: đường dẫn tới `D-40_Testing/<feature>/`
2. **Environment**: môi trường đang test (e.g., `staging`, `localhost:3001`) — nếu không cung cấp, dùng giá trị từ config

Đọc config từ `.claude/skills/log-bugs/backlog.config.json`:
```json
{
  "spaceKey": "your-space",
  "projectKey": "PROJECT_KEY",
  "defaultEnvironment": "staging"
}
```
Nếu file config không tồn tại → thông báo lỗi và hướng dẫn tạo (xem cuối skill).

### Bước 2 — Đọc file đầu vào

**[A] TC Markdown file** — trong `<feature-folder>/test_cases_manual/`:
- Tìm file `.md` duy nhất (bỏ qua `log_bugs_state.json`)
- Parse bảng markdown → trích xuất tất cả TC với các cột:
  `TC ID | TVP ID | Sub-section | Test Description | Preconditions | Test Steps | Test Data | Expected Result | Note | Result (Manual) | Actual | Result (Auto) | Priority | Test Type`
- Build map: `tcId → { tvpId, subSection, description, preconditions, steps, data, expected, priority, type }`
- **Lưu ý**: Cột header match theo tên (case-insensitive), không phụ thuộc thứ tự

**[B] Export JSON file** — trong `<feature-folder>/test_result_export_json/`:
- Tìm file khớp pattern `*_results_*.json`
- Nếu có nhiều file → dùng file mới nhất (theo tên timestamp)
- Nếu không có file → thông báo:
  ```
  ⚠️  Chưa tìm thấy export JSON trong test_result_export_json/.
  Vui lòng: Mở HTML tracker → click "Export JSON" → lưu vào test_result_export_json/
  ```
  Dừng lại và chờ user.
- Parse `state` field: `{ [tcId]: { status, actual, note } }`

**[C] Sidecar file** `log_bugs_state.json`:
- Nếu không tồn tại → khởi tạo `{ "logged": {} }`
- Parse `logged` field: `{ [tcId]: "issueKey" }`

### Bước 3 — Tổng hợp FAIL candidates

Merge 3 nguồn dữ liệu:
- **FAIL candidates** = TCs thỏa mãn **đồng thời**:
  1. `state[tcId].status === "fail"` (từ export JSON)
  2. `tcId` KHÔNG có trong `logged` (từ sidecar)

Nếu không có candidate nào:
- Nếu có FAIL TCs nhưng tất cả đã logged → báo: `Tất cả FAIL TCs đã được log. Xem log_bugs_state.json để tra cứu issue key.`
- Nếu không có FAIL TC nào → báo: `Không tìm thấy FAIL TC nào trong export JSON.`

### Bước 4 — Hiển thị danh sách để chọn (Plan A)

In danh sách có đánh số, sắp xếp theo Priority (Critical → High → Medium → Low):

```
Tìm thấy X FAIL TCs chưa được log — <feature-name>:

  [1] TC-XXX-001 [High]   — <Test Description>
        Actual: <actual result>

  [2] TC-XXX-003 [Medium] — <Test Description>
        Actual: <actual result>

  [3] TC-XXX-007 [High]   — <Test Description>
        Actual: <actual result>

Project: <projectKey> | Environment: <environment>

Log which? (all / 1,3 / cancel):
```

Chờ input từ user:
- `all` → chọn tất cả
- `1,3` (hoặc `1 3`) → chọn theo index
- `cancel` / `c` / Enter rỗng → dừng lại

### Bước 5 — Fetch metadata Backlog (1 lần)

Gọi MCP tools để lấy ID cần thiết:

```
mcp__backlog__get_project(projectIdOrKey=<projectKey>)
  → lấy: id (projectId)

mcp__backlog__get_issue_types(projectIdOrKey=<projectKey>)
  → tìm type có name = "Defect" → issueTypeId
  → nếu không có "Defect" → tìm "Bug" → nếu vẫn không có → báo lỗi và liệt kê các type hiện có

mcp__backlog__get_priorities()
  → build priority map:
    "Critical" → id có name "高" hoặc "Highest" hoặc "Critical"
    "High"     → id có name "高" hoặc "High"
    "Medium"   → id có name "中" hoặc "Normal" hoặc "Medium"
    "Low"      → id có name "低" hoặc "Low"
  → fallback: nếu không match → dùng priority "Normal"
```

### Bước 5.5 — Upload evidence files (mỗi TC)

Với mỗi TC đã chọn, thực hiện **trước** khi gọi `add_issue`:

1. Glob `<feature-folder>/evidence/` tìm file khớp pattern `*{tcId}*` (case-insensitive)
   - Bao gồm cả screenshot (`.png`, `.jpg`) và video (`.webm`, `.mp4`)
2. Nếu tìm thấy file(s) → upload từng file tuần tự:
   ```bash
   node ".claude/skills/log-bugs/scripts/upload-attachment.mjs" \
     --file="<evidence-file-path>" \
     --config=".claude/skills/log-bugs/backlog.config.json"
   ```
   Parse stdout JSON → thu thập `{ id, name }` vào `attachments[]`
   - Phân loại sau khi upload: `imageAttachments` (`.png`, `.jpg`) và `videoAttachments` (`.webm`, `.mp4`)
   Nếu upload lỗi → log warning, tiếp tục (không block tạo issue), ghi chú vào summary
3. Nếu không tìm thấy file → `attachments = []`, `imageAttachments = []`, `videoAttachments = []`

> **Rendering trong Backlog**:
> - Image: `#image(filename.png)` → render inline trong description
> - Video: Backlog không hỗ trợ inline video — file `.webm`/`.mp4` được đính kèm dưới dạng attachment; liệt kê tên file trong description để người xem biết cần click vào attachment tab để xem.

### Bước 6 — Tạo bug issue cho từng TC đã chọn

Với mỗi TC trong danh sách đã chọn, gọi `mcp__backlog__add_issue`:

**Summary** (tối đa 255 ký tự):
```
[<tcId>] <description>
```

**Description** (ISTQB format, Backlog markdown):
```markdown
"Environment"
<environment>

## Severity
<map từ priority: Critical→Blocker / High→Critical / Medium→Major / Low→Minor>

## TC Reference
- **TC ID**: <tcId>
- **TVP ID**: <tvpId hoặc N/A>
- **Test Type**: <type>
- **Priority**: <priority>

## Preconditions
<preconditions — thay `<br>` bằng xuống dòng>

## Steps to Reproduce
<steps — thay `<br>` bằng xuống dòng>

## Test Data
<data hoặc N/A>

## Expected Result
<expected — thay `<br>` bằng xuống dòng>

## Actual Resul
<actual từ export JSON>

## Evidence
<Nếu imageAttachments không rỗng>:
#image(<image-filename-1>)
#image(<image-filename-2>)
<Nếu videoAttachments không rỗng>:
**Video recording**: <video-filename-1>, <video-filename-2> (xem trong tab Attachments)
<Nếu attachments rỗng>:

## Evidence folder
`<feature-folder>/evidence/`
Không tìm thấy file khớp `*<tcId>*` — vui lòng attach screenshot/video thủ công
```

**Fields truyền vào add_issue**:
- `projectId`: từ Bước 5
- `summary`: `[{tcId}] {description}` (truncate nếu > 255 chars)
- `issueTypeId`: Defect ID từ Bước 5
- `priorityId`: mapped từ TC priority
- `description`: format trên (đã bao gồm `#image()` nếu có evidence)
- `attachmentId`: `[id, ...]` từ Bước 5.5 (bỏ qua nếu rỗng)

**Xử lý lỗi**: Nếu `add_issue` thất bại → log lỗi, tiếp tục với TC kế tiếp, ghi nhận vào summary.

### Bước 7 — Cập nhật sidecar JSON (Plan B)

Sau mỗi issue được tạo thành công, đọc lại và cập nhật `log_bugs_state.json` **ngay lập tức** (không đợi hết loop):

```json
{
  "logged": {
    "TC-XXX-001": "MDM-42",
    "TC-XXX-003": "MDM-45"
  },
  "lastRun": "2026-05-07T10:30:00Z"
}
```

Dùng **Write tool** (không dùng Edit) để ghi toàn bộ file sau mỗi update.

### Bước 8 — In summary

```
## Bug Log Summary — <feature-name>

| TC ID | Priority | Issue Key | URL | Status |
|---|---|---|---|---|
| TC-XXX-001 | High | MDM-42 | https://<spaceKey>.backlog.com/view/MDM-42 | ✅ Created |
| TC-XXX-003 | Medium | MDM-45 | https://<spaceKey>.backlog.com/view/MDM-45 | ✅ Created |
| TC-XXX-007 | High | — | API error: ... | ❌ Failed |

**Created**: 2  |  **Failed**: 1  |  **Skipped (already logged)**: 3

Sidecar đã cập nhật: test_cases_manual/log_bugs_state.json
```

---

## Tạo Config File

Nếu `.claude/skills/log-bugs/backlog.config.json` chưa tồn tại, tạo file với nội dung:

```json
{
  "spaceKey": "YOUR_SPACE_KEY",
  "projectKey": "YOUR_PROJECT_KEY",
  "defaultEnvironment": "staging"
}
```

Hướng dẫn user điền:
- `spaceKey`: subdomain Backlog của tổ chức (e.g., nếu URL là `myteam.backlog.com` thì `spaceKey = "myteam"`)
- `projectKey`: key của Backlog project (e.g., `MDM`, `STAFFING`)
- `defaultEnvironment`: môi trường mặc định khi không truyền argument

> **API Key**: script upload đọc tự động từ `.mcp.json` (`mcpServers.backlog.env.BACKLOG_API_KEY`) — không cần thêm vào config file này.

---

## Quy tắc quan trọng

- **Không tạo duplicate**: luôn kiểm tra sidecar trước khi tạo issue
- **Cập nhật sidecar ngay lập tức** sau mỗi issue tạo thành công — không batch cuối
- **Không modify TC markdown** — sidecar `log_bugs_state.json` là nguồn tracking duy nhất
- **Actual Result bắt buộc**: nếu TC FAIL mà `actual` rỗng → hiển thị cảnh báo trong danh sách nhưng vẫn cho phép chọn (ghi "Actual: (chưa nhập)" vào description)
- **Evidence**: tự động upload file khớp `*{tcId}*` từ `evidence/` qua script → đính kèm vào issue; nếu không tìm thấy file → ghi đường dẫn folder vào description và nhắc tester attach thủ công
- **Priority fallback**: nếu TC không có priority hoặc giá trị lạ → map sang "Normal" của Backlog

---

## Route tiếp theo

| Sau /log-bugs | Hành động |
|---|---|
| Tất cả TCs đã log | Gọi `/write-test-report` để tổng hợp sprint report |
| Còn TC FAIL chưa có evidence | Nhắc tester upload screenshot vào Backlog issue |
| Muốn xem lại đã log gì | Đọc `test_cases_manual/log_bugs_state.json` |
