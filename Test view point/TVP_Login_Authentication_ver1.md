---
title: Test View Point - Login & Authentication Flow
screen: L-01 → L-06
created: 2026-04-21
version: 1.0
references:
  - Requirements/Login/L-01_ログイン_VN.md
  - Requirements/Login/L-02_ログインOTP入力画面_VN.md
  - Requirements/Login/L-03_パスワードの再設定_VN.md
  - Requirements/Login/L-04_パスワード再設定_メール送信完了_VN.md
  - Requirements/Login/L-05_パスワード再設定_パスワード再設定_VN.md
  - Requirements/Login/L-06_パスワード再設定_パスワード変更完了_VN.md
  - Requirements/D-00_Message definition.md
  - Test Strategy/TS_Login_Authentication_ver1.md
  - Figma: https://www.figma.com/design/Vc34OD1eP9RrkQR54if1Ua/1834-design-figma
---

# Test View Point: Login & Authentication Flow

## TVP Table

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|--------|--------|---------|-----------------|-----------|----------|
| TVP-L01-001 | L-01 Login | Happy Path (2FA OFF) | Đăng nhập thành công với ID/password hợp lệ, 2FA OFF → redirect T-01 | Functional | High |
| TVP-L01-002 | L-01 Login | Happy Path (2FA ON) | Đăng nhập thành công với ID/password hợp lệ, 2FA ON → redirect L-02 | Functional | High |
| TVP-L01-003 | L-01 Login | ログインID — Required | ログインID trống → MSG-001 (tên mục「ログインID」) | Validation | High |
| TVP-L01-004 | L-01 Login | ログインID — Email format | ログインID sai format email → validation error [⚠️ Need Confirm: G-041 — email-only hay cả ユーザーID?] | Validation | High |
| TVP-L01-005 | L-01 Login | ログインID — Max length | ログインID tối đa 50 ký tự; browser chặn nhập ký tự thứ 51 | Validation (BVA) | High |
| TVP-L01-006 | L-01 Login | ログインID — Trim | ログインID có leading/trailing space → trim trước validate | Validation | Medium |
| TVP-L01-007 | L-01 Login | パスワード — Required | パスワード trống → MSG-001 (tên mục「パスワード」) | Validation | High |
| TVP-L01-008 | L-01 Login | パスワード — Trim | パスワード chỉ có spaces sau trim → coi là trống → MSG-001 | Validation | Medium |
| TVP-L01-009 | L-01 Login | Auth failure | ID/password sai → MSG-003, giữ nguyên giá trị đã nhập trên form | Functional | High |
| TVP-L01-010 | L-01 Login | Lockout — Trigger | Nhập sai password 5 lần liên tiếp cùng account → MSG-021 (không phải MSG-003) | Functional | High |
| TVP-L01-011 | L-01 Login | Lockout — Duration | Sau lockout 30 phút → login được lại | Functional | High |
| TVP-L01-012 | L-01 Login | Lockout — Counter reset on success | Login thành công → counter reset; sai lại từ đầu mới lock | Functional | High |
| TVP-L01-013 | L-01 Login | Lockout — Counter reset on password reset | Hoàn tất reset password → counter reset | Functional | High |
| TVP-L01-014 | L-01 Login | Lockout — MSG phân biệt | Lockout hiển thị MSG-021, auth fail thường hiển thị MSG-003 — không nhầm lẫn | Functional | High |
| TVP-L01-015 | L-01 Login | Button enable/disable | Nút「ログイン」disable khi chưa nhập đủ bắt buộc; enable khi đủ | UI | Medium |
| TVP-L01-016 | L-01 Login | Error display position | Error validation hiển thị inline đỏ dưới ô; auth fail hiển thị banner đỏ [⚠️ Mock≠Spec: Figma dùng full-width banner, follow Spec] | UI | Medium |
| TVP-L01-017 | L-01 Login | Link quên mật khẩu | Nhấn「パスワードを忘れた方はこちら」→ redirect L-03 | Functional | Medium |
| TVP-L01-018 | L-01 Login | Network error | API timeout/network fail → toast error (theo D-00) | System Behavior | Medium |
| TVP-L01-019 | L-01 Login | Placeholder UI | Placeholder「メールアドレス または ユーザーID」hiển thị đúng | UI | Low |
| TVP-L01-020 | L-01 Login | Double submit | Click「ログイン」liên tục → không gửi request trùng | Concurrency | Medium |
| TVP-L01-021 | L-01 Login | Security — XSS | Nhập `<script>alert(1)</script>` vào ログインID/パスワード → bị reject/escape | Security | High |
| TVP-L01-022 | L-01 Login | Security — SQL Injection | Nhập `' OR 1=1--` vào ログインID → bị reject | Security | High |
| TVP-L01-023 | L-01 Login | パスワード — Format complexity | Nhập password không đủ 4 loại ký tự (hoa, thường, số, ký hiệu) | Validation | High |
| TVP-L01-024 | L-01 Login | パスワード — Length (Min 12) | Nhập password ít hơn 12 ký tự | Validation (BVA) | High |
| TVP-L02-001 | L-02 OTP | Happy Path | Nhập OTP đúng 6 ký tự, đúng case → verify thành công → redirect T-01 | Functional | High |
| TVP-L02-002 | L-02 OTP | OTP — Required | OTP trống → MSG-001 (tên mục「認証コード」) | Validation | High |
| TVP-L02-003 | L-02 OTP | OTP — Exactly 6 chars | OTP 5 ký tự → button disable; 6 ký tự → enable; 7 ký tự → [⚠️ Need Confirm: G-008 — chặn nhập hay báo lỗi?] | Validation (BVA) | High |
| TVP-L02-004 | L-02 OTP | OTP — Case sensitive | OTP đúng nhưng sai case (ví dụ: `abcdef` thay vì `AbCdEf`) → MSG-014 | Functional | High |
| TVP-L02-005 | L-02 OTP | OTP — Wrong code | Nhập OTP sai → MSG-014, ở lại L-02 | Functional | High |
| TVP-L02-006 | L-02 OTP | OTP — Expired | Nhập OTP đúng nhưng đã hết 24h → MSG-014 | Functional | High |
| TVP-L02-007 | L-02 OTP | OTP — Format (半角英数字) | Nhập full-width char hoặc ký tự đặc biệt → MSG-017 hoặc bị chặn | Validation | High |
| TVP-L02-008 | L-02 OTP | OTP — Trim | OTP có leading/trailing space → trim trước validate | Validation | Medium |
| TVP-L02-009 | L-02 OTP | Resend — Success | Nhấn「認証コードを再送信する」→ gửi lại OTP thành công → thông báo tại vùng thông báo (MSG-018) | Functional | High |
| TVP-L02-010 | L-02 OTP | Resend — Cooldown 60s | Nhấn resend lần 2 trong vòng 60s → MSG-016 | Functional | High |
| TVP-L02-011 | L-02 OTP | Resend — After cooldown | Nhấn resend sau đúng 60s → thành công | Functional (BVA) | Medium |
| TVP-L02-012 | L-02 OTP | OTP one-time-use | OTP đã dùng verify thành công → dùng lại OTP đó → MSG-014 | Security | High |
| TVP-L02-013 | L-02 OTP | Direct access | Truy cập `/login/verify-otp` trực tiếp không có session → [⚠️ Need Confirm: G-003 — redirect L-01 hay error?] | State & Flow | High |
| TVP-L02-014 | L-02 OTP | Refresh page | Refresh màn hình L-02 vẫn giữ đúng trạng thái/màn hình hiện tại | State & Flow | Medium |
| TVP-L02-015 | L-02 OTP | Button enable/disable | Nút「ログイン」disable khi OTP < 6 ký tự; enable khi đủ 6 | UI | Medium |
| TVP-L02-016 | L-02 OTP | UI — Headline text | Headline「ご登録のアドレスに認証コードを送信しました」hiển thị đúng | UI | Low |
| TVP-L02-017 | L-02 OTP | Network error | API OTP verify timeout → toast/error message | System Behavior | Medium |
| TVP-L02-018 | L-02 OTP | Paste OTP | User paste chuỗi > 6 ký tự vào ô OTP → [⚠️ Need Confirm: G-008 — cắt 6 hay báo lỗi?] | User Behavior | Medium |
| TVP-L03-001 | L-03 Reset Request | Happy Path | Nhập email hợp lệ đã đăng ký → nhấn「送信する」→ redirect L-04 | Functional | High |
| TVP-L03-002 | L-03 Reset Request | Email không tồn tại | Nhập email chưa đăng ký → vẫn redirect L-04 (không lộ thông tin) | Security | High |
| TVP-L03-003 | L-03 Reset Request | Email — Required | Email trống → MSG-001 (tên mục「メールアドレス」) | Validation | High |
| TVP-L03-004 | L-03 Reset Request | Email — Format | Email sai format → MSG-004 | Validation | High |
| TVP-L03-005 | L-03 Reset Request | Email — Trim | Email có leading/trailing space → trim trước validate | Validation | Medium |
| TVP-L03-006 | L-03 Reset Request | Button enable/disable | Nút「送信する」disable khi email trống; enable khi có nội dung [⚠️ Need Confirm: G-022] | UI | Medium |
| TVP-L03-007 | L-03 Reset Request | Cooldown 60s | Gửi lần 2 trong vòng 60s cùng account → server reject (không gửi email thực) | Functional | High |
| TVP-L03-008 | L-03 Reset Request | Rate limit/giờ | Gửi vượt giới hạn/giờ → server reject nhưng UI vẫn hiển thị success [⚠️ Need Confirm: G-032] | Security | Medium |
| TVP-L03-009 | L-03 Reset Request | Direct access | Truy cập `/login/reset` trực tiếp → hiển thị form bình thường | State & Flow | Low |
| TVP-L03-010 | L-03 Reset Request | Network error | API timeout → toast/error message | System Behavior | Medium |
| TVP-L03-011 | L-03 Reset Request | Email template | Email gửi đi có đúng subject, placeholder `{{ユーザー名}}` và `{{RESET_PASSWORD_URL}}` được thay thế đúng | Integration | High |
| TVP-L04-001 | L-04 Reset Sent | Display | Sau L-03 thành công → L-04 hiển thị title「メールを送信しました」và hướng dẫn 24h/1 phút | Functional | High |
| TVP-L04-002 | L-04 Reset Sent | Resend — Happy Path | Nhập email hợp lệ → nhấn「送信する」→ toast「再設定メールを再送しました。」, ở lại L-04 | Functional | High |
| TVP-L04-003 | L-04 Reset Sent | Resend — Email Required | Email trống → MSG-001 | Validation | High |
| TVP-L04-004 | L-04 Reset Sent | Resend — Email Format | Email sai format → MSG-004 | Validation | High |
| TVP-L04-005 | L-04 Reset Sent | Resend — Cooldown 60s | Resend trong 60s → server reject, UI vẫn success (không lộ) | Security | High |
| TVP-L04-006 | L-04 Reset Sent | Link về L-01 | Không có link quay lại đăng nhập (theo Figma) | Functional | Medium |
| TVP-L04-007 | L-04 Reset Sent | Direct access | Truy cập `/login/reset/requested` trực tiếp không có session → redirect L-01 | State & Flow | Medium |
| TVP-L05-001 | L-05 New Password | Happy Path | Mở URL token hợp lệ → nhập password mới đúng rule + confirm khớp → submit → redirect L-06 | Functional | High |
| TVP-L05-002 | L-05 New Password | Token — Invalid | Mở URL với token không hợp lệ → hiển thị error「再設定URLは有効期限が切れています。」[⚠️ Need Confirm: G-041 — màn riêng/modal/inline?] | Functional | High |
| TVP-L05-003 | L-05 New Password | Token — Expired (24h) | Mở URL với token hết hạn 24h → error tương tự TVP-L05-002 | Functional | High |
| TVP-L05-004 | L-05 New Password | Token — One-time-use | Dùng lại token đã submit thành công → error token invalid | Security | High |
| TVP-L05-005 | L-05 New Password | Password — Required | Ô「新しいパスワード」trống → MSG-001 | Validation | High |
| TVP-L05-006 | L-05 New Password | Password — Min length | Password 11 ký tự → MSG-019; 12 ký tự → valid (BVA) | Validation (BVA) | High |
| TVP-L05-007 | L-05 New Password | Password — Complexity | Thiếu uppercase / lowercase / digit / special char → MSG-019 (4 cases riêng biệt) | Validation | High |
| TVP-L05-008 | L-05 New Password | Password — Special chars | Ký tự đặc biệt ngoài tập `@$!%*?&` → MSG-019 | Validation | High |
| TVP-L05-009 | L-05 New Password | Password — Trim | Password có leading/trailing space → trim trước validate | Validation | Medium |
| TVP-L05-010 | L-05 New Password | Confirm — Required | Ô confirm trống → MSG-001 | Validation | High |
| TVP-L05-011 | L-05 New Password | Confirm — Mismatch | Password mới ≠ confirm → MSG-007 | Validation | High |
| TVP-L05-012 | L-05 New Password | Confirm — Match | Password mới = confirm (sau trim) → valid | Validation | High |
| TVP-L05-013 | L-05 New Password | Password mask | Cả 2 ô hiển thị ký tự ẩn (●) khi nhập | UI | Medium |
| TVP-L05-014 | L-05 New Password | Label ô confirm | Label ô confirm hiển thị đúng [⚠️ Need Confirm: G-047 — `新しいパスワード` hay `新しいパスワード（確認）`?] | UI | Medium |
| TVP-L05-015 | L-05 New Password | Error MSG-019 wording | Wording MSG-019 hiển thị đúng theo D-00 [⚠️ Need Confirm: G-048 — D-00 vs Figma wording] | UI | Medium |
| TVP-L05-016 | L-05 New Password | Session invalidation | Sau reset thành công → tất cả session cũ bị invalidate (ALL devices) | Security | High |
| TVP-L05-017 | L-05 New Password | Password hash | Password lưu DB dưới dạng hash, không plain text | Data Integrity | High |
| TVP-L05-018 | L-05 New Password | Browser back từ L-06 | Sau submit thành công, back về L-05 → token đã dùng → error | State & Flow | Medium |
| TVP-L06-001 | L-06 Success | Display | Sau L-05 thành công → L-06 hiển thị title「パスワードを変更しました」và guide | Functional | High |
| TVP-L06-002 | L-06 Success | Button ログイン | Nhấn button「ログイン」→ redirect L-01 | Functional | High |
| TVP-L06-003 | L-06 Success | Direct access | Truy cập URL L-06 trực tiếp → hiển thị bình thường | State & Flow | Medium |
| TVP-FLOW-001 | Cross-flow | Full flow (2FA OFF) | L-01 login → T-01 (không qua L-02) | Functional | High |
| TVP-FLOW-002 | Cross-flow | Full flow (2FA ON) | L-01 login → L-02 OTP → T-01 | Functional | High |
| TVP-FLOW-003 | Cross-flow | Full reset flow | L-01 → L-03 → L-04 → email link → L-05 → L-06 → L-01 | Functional | High |
| TVP-FLOW-004 | Cross-flow | First-time password setup | Admin tạo user mới → user nhận email → L-05 set password lần đầu → L-06 [⚠️ Need Confirm: G-009] | Functional | High |
| TVP-FLOW-005 | Cross-flow | Lockout + reset | User bị lockout → dùng reset password flow → counter reset → login lại được | Functional | High |

---

## Thinking Approach Checklist

| # | Checklist Category | Trạng thái | Ghi chú |
|---|-------------------|-----------|---------|
| 1 | FUNCTIONAL (Happy Path) | ✔ | TVP-L01-001/002, TVP-L02-001, TVP-L03-001, TVP-L04-001/002, TVP-L05-001, TVP-L06-001/002, TVP-FLOW-001~005 |
| 2 | INPUT VALIDATION (Field Level) | ✔ | TVP-L01-003~008, TVP-L02-002~008, TVP-L03-003~005, TVP-L04-003/004, TVP-L05-005~012 |
| 3 | BOUNDARY VALUE (BVA) | ✔ | TVP-L01-005 (max 50), TVP-L02-003 (6 chars), TVP-L02-011 (60s), TVP-L05-006 (min 12) |
| 4 | NEGATIVE CASE | ✔ | TVP-L01-009/010, TVP-L02-005/006/007, TVP-L03-002/007/008, TVP-L05-002~004/007/008/011 |
| 5 | USER BEHAVIOR (Real-world) | ✔ | TVP-L01-020, TVP-L02-018, TVP-L02-014 (refresh), TVP-L05-018 (back browser) |
| 6 | SYSTEM BEHAVIOR | ✔ | TVP-L01-018, TVP-L02-017, TVP-L03-010 |
| 7 | DATA INTEGRITY | ✔ | TVP-L05-017 (password hash) |
| 8 | DB ↔ UI DATA MAPPING | ✔ | TVP-L03-011 (email template placeholder), TVP-L05-017 (hash vs plain text) |
| 9 | INTEGRATION (API) | ✔ | TVP-L03-011 (email service), TVP-L01-018/TVP-L02-017/TVP-L03-010 (API error handling) |
| 10 | SECURITY (Basic) | ✔ | TVP-L01-021/022 (XSS/SQLi), TVP-L02-012 (OTP one-time), TVP-L03-002/008 (email enumeration), TVP-L05-004/016 (token reuse, session) |
| 11 | UX/UI | ✔ | TVP-L01-015/016/019, TVP-L02-015/016, TVP-L03-006, TVP-L05-013/014/015 |
| 12 | STATE & FLOW | ✔ | TVP-L02-013/014, TVP-L03-009, TVP-L04-007, TVP-L05-018, TVP-L06-003 |
| 13 | CONCURRENCY (Advanced) | ✔ | TVP-L01-020 (double submit) |
| 14 | DATA LIFECYCLE | N/A | Màn hình auth không có CRUD/delete flow |
| 15 | SEARCH / FILTER / SORT | N/A | Màn hình auth không có search/filter |
| 16 | PAGINATION / LARGE DATA | N/A | Màn hình auth không có danh sách/phân trang |
| 17 | CROSS-FIELD VALIDATION | ✔ | TVP-L05-011/012 (password vs confirm match) |

---

## ⚠️ Các điểm cần làm rõ trước khi hoàn thiện TVP

| # | TVP ID liên quan | Nội dung cần xác nhận | Lý do không thể tự suy diễn |
|---|-----------------|----------------------|------------------------------|
| 1 | TVP-L01-004/019 | G-041: ログインID là email-only hay cả ユーザーID? | Placeholder Figma khác spec — ảnh hưởng validation rule |
| 2 | TVP-L02-003/018 | G-008: OTP paste > 6 ký tự → cắt hay báo lỗi? | Spec không nêu behavior khi paste |
| 3 | TVP-L02-013/014 | G-003: Direct access/refresh L-02 không có session → redirect L-01 hay error? | Spec không định nghĩa điều kiện session hợp lệ |
| 4 | TVP-L03-006 | G-022: Nút「送信する」enable khi non-empty hay valid email format? | Spec delegate sang GAP-001 |
| 5 | TVP-L03-008 | G-032: Rate limit resend reset mail — số lần/giờ, rolling window? | Spec ghi "tạm thời 5 lần/giờ, có thể điều chỉnh" |
| 6 | TVP-L04-006 | G-046: L-04 có link quay lại L-01 không? Figma không có | Mâu thuẫn Figma vs spec §3 No.5 |
| 7 | TVP-L05-002 | G-041: Token invalid/expired hiển thị dạng gì (màn riêng/modal/inline)? MSG code? | Spec chỉ nêu wording, không nêu display type |
| 8 | TVP-L05-014 | G-047: Label ô confirm password — `新しいパスワード` hay `新しいパスワード（確認）`? | Figma dùng label giống ô đầu |
| 9 | TVP-L05-015 | G-048: MSG-019 wording — bản D-00 hay bản Figma? | Hai bản khác nhau về complexity rule |
| 10 | TVP-L05-016 | G-042: Session invalidation sau reset — all devices hay chỉ current? | Spec không nêu scope |
| 11 | TVP-L06-003 | G-057: Direct access L-06 → redirect L-01 hay hiển thị bình thường? | Spec L-06 trống |
| 12 | TVP-FLOW-004 | G-009: First-time password setup dùng cùng flow L-03/L-04 hay khác? | Spec nêu 2 luồng nhưng không phân biệt UI |

---

## Lịch sử tạo file

| Phiên bản | Ngày | Nội dung | Người tạo |
|-----------|------|----------|-----------|
| 1.0 | 2026-04-21 | Tạo mới | QCL |
