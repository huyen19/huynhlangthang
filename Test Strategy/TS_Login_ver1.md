---
title: Test Strategy — Login / OTP / Reset Password
screens: L-01, L-02, L-03, L-04, L-05, L-06
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
  - Requirements/D-01_Screens List.md
  - Test Q&A/Q&A_Login_OTP_ResetPassword_VN.md
---

## 1. System Overview

**Hệ thống**: 販促資材出荷管理システム (KREO) — hệ thống quản lý xuất kho vật liệu xúc tiến bán hàng.

**Phạm vi tài liệu này**: Nhóm màn hình xác thực (ログイン・認証) gồm 6 màn hình: L-01 → L-06.

**Luồng nghiệp vụ chính**:

| Luồng | Màn hình | Mô tả |
|-------|----------|-------|
| Login 2FA OFF | L-01 → T-01 | Đăng nhập thẳng không qua OTP |
| Login 2FA ON | L-01 → L-02 → T-01 | Đăng nhập qua xác thực OTP email |
| Quên mật khẩu | L-01 → L-03 → L-04 → L-05 → L-06 | Reset mật khẩu qua email |
| Thiết lập mật khẩu lần đầu | L-03 → L-04 → L-05 → L-06 | Admin tạo user mới, user set password |

**Đối tượng người dùng**: Quyền 管理 (quản lý) và 物流 (logistics).

---

## 2. Key Test Targets

| ID | Priority | Module / Tính năng | Lý do |
|----|----------|--------------------|-------|
| KT-01 | High | L-01: Xác thực ID + Password | Entry point duy nhất vào hệ thống; lỗi ở đây block toàn bộ user |
| KT-02 | High | L-01: Lockout sau 5 lần sai | Security critical; sai logic có thể lock user hợp lệ hoặc không block attacker |
| KT-03 | High | L-02: OTP verify (case-sensitive, 6 ký tự) | 2FA là lớp bảo mật thứ 2; OTP fail = không vào được hệ thống |
| KT-04 | High | L-05: Password format validation (12 ký tự, 4 loại) | Rule phức tạp, dễ implement sai; ảnh hưởng toàn bộ user reset password |
| KT-05 | High | L-05: Token one-time-use + 24h expiry | Security critical; token reuse = lỗ hổng bảo mật |
| KT-06 | High | L-03/L-04: Email anonymization (không lộ email đã đăng ký) | Privacy/security requirement rõ ràng |
| KT-07 | Medium | L-02: OTP resend cooldown 60s | Chống spam; sai logic gây UX xấu hoặc abuse |
| KT-08 | Medium | L-03: Reset mail cooldown 60s + limit 5 lần/giờ | Rate limiting; sai logic gây spam hoặc block user hợp lệ |
| KT-09 | Medium | MSG codes hiển thị đúng màn hình, đúng trigger | Consistency; sai MSG gây confuse user |
| KT-10 | Medium | L-06: Redirect sau reset thành công | Flow completion; sai redirect = user không biết phải làm gì tiếp |

---

## 3. Risk Assessment

### Business Risk

| Risk | Impact | Lý do |
|------|--------|-------|
| Lockout logic sai (G-001) | High | Lock user hợp lệ 30 phút → không làm việc được; hoặc không lock attacker → brute force |
| Email anonymization bị bypass (G-006) | High | Lộ thông tin đăng ký email → vi phạm privacy policy |
| Token reset password reusable (KT-05) | High | Attacker dùng lại link cũ để đổi mật khẩu user |
| Password rule mâu thuẫn MSG-015 vs MSG-019 (G-043/G-048) | High | FE/BE validate khác nhau → user không biết rule nào đúng |

### Data Risk

| Risk | Impact | Lý do |
|------|--------|-------|
| OTP case-sensitive không nhất quán FE/BE | High | User nhập đúng nhưng BE reject → không login được |
| Password hash không đúng (L-05 §5.4) | High | Mật khẩu lưu plaintext → data breach |
| Token binding không rõ (G-018) | Medium | Token không gắn với account → có thể dùng cho account khác |

### Integration Risk

| Risk | Impact | Lý do |
|------|--------|-------|
| Email service SMTP down khi 2FA ON (G-014) | High | User không nhận OTP → không login được, không có fallback |
| API error mapping chưa đầy đủ (G-005) | High | Lỗi BE không map đúng MSG code → hiển thị sai hoặc crash |
| Session management sau OTP (G-027) | Medium | Multi-tab / session override không rõ |

### Technical Risk

| Risk | Impact | Lý do |
|------|--------|-------|
| L-06 spec trống (G-044) | High | Không có spec để implement và test |
| Back navigation từ L-06 về L-05 (G-051) | Medium | Token expired error hiển thị không đúng context |
| Rate limiting theo IP/device chưa có (G-034) | Medium | Không có captcha/rate limit → brute force risk |

---

## 4. Test Scope

### In Scope

- Toàn bộ 6 màn hình L-01 → L-06: functional flow, validation, error handling
- MSG codes: trigger đúng điều kiện, wording đúng D-00
- 2FA ON/OFF flow
- Lockout: trigger, duration, reset conditions
- OTP: generate, verify, resend, cooldown, expiry
- Reset password: email send, token validation, password format, token one-time-use
- Security: email anonymization, password hashing, token expiry
- FE/BE validation consistency

### Out of Scope

- T-01 và các màn hình sau khi login thành công
- Email delivery SLA (phụ thuộc SMTP provider)
- Admin tạo user (màn hình M-08-cud)
- Performance load testing (chưa có SLA chính thức — G-010)
- Accessibility chi tiết (G-036 — pending)

---

## 5. Test Approach

### Test Levels

| Level | Áp dụng cho | Ghi chú |
|-------|-------------|---------|
| System Test | Toàn bộ L-01 → L-06 | Luồng end-to-end, integration với BE/email |
| Integration Test | L-01↔L-02, L-03↔L-04↔L-05↔L-06, API auth | FE↔BE, BE↔Email service |
| UAT | Happy path login, reset password | Với user thực tế quyền 管理/物流 |

### Test Types

| Type | Phạm vi |
|------|---------|
| Functional | Tất cả flow, validation, error handling, MSG codes |
| Security | Email anonymization, token one-time-use, password hash, lockout |
| Negative | Sai credential, OTP sai/hết hạn, token expired/reused, rate limit |
| Boundary | Max length fields, OTP 6 ký tự, lockout counter 4→5, cooldown 59s→60s |
| Regression | Sau mỗi fix bug liên quan auth flow |

---

## 6. Test Focus Areas

### Critical Logic
- Lockout: đếm đúng 5 lần liên tiếp, reset đúng điều kiện (success login / password reset / timeout)
- OTP: case-sensitive verify, one-time-use, 24h expiry, cooldown 60s
- Token reset: one-time-use, 24h expiry, binding với account
- 2FA ON/OFF routing: đúng màn hình đích

### Complex Validation
- Password L-05: min 12 ký tự, phải có uppercase + lowercase + digit + special char (`@$!%*?&`)
- Email format: L-01 (max 50) và L-03/L-04 (MSG-004) — cần thống nhất rule
- OTP format: 6 ký tự, half-width alphanumeric, case-sensitive

### Edge Cases
- OTP resend trong cooldown 60s → MSG-016
- Reset mail gửi lại khi link cũ còn hiệu lực (G-019)
- Truy cập trực tiếp L-02/L-04/L-05 không có session/token hợp lệ
- Back browser từ L-06 về L-05 với token đã dùng
- Paste OTP > 6 ký tự (G-008)
- Password có leading/trailing space (G-013, G-047)

### High-risk Data Scenarios
- Email không tồn tại trong hệ thống → L-03 vẫn redirect L-04 (anonymization)
- Token hết hạn 24h → L-05 hiển thị error đúng
- Lockout user cố đăng nhập → MSG-021, không phải MSG-003
- Password mới trùng password cũ (G-045 — pending confirm)

---

## 7. Test Data Strategy

### Key Data Cần Chuẩn Bị

| Data | Mô tả |
|------|-------|
| User 2FA ON | Account với 2FA bật, email hợp lệ nhận OTP |
| User 2FA OFF | Account với 2FA tắt |
| User chưa có password | Account mới do admin tạo (luồng first-time setup) |
| User bị lock | Account đã bị lockout (hoặc trigger lockout trong test) |
| Token hợp lệ | Token reset password chưa dùng, còn trong 24h |
| Token hết hạn | Token > 24h |
| Token đã dùng | Token đã dùng 1 lần |
| Email không tồn tại | Email chưa đăng ký trong hệ thống |

### Edge Case Data

| Data | Mục đích |
|------|---------|
| Email 50 ký tự (max) | Boundary test L-01 |
| Email 51 ký tự | Boundary test L-01 — expect error |
| OTP đúng nhưng uppercase/lowercase sai | Case-sensitive test L-02 |
| Password đúng 12 ký tự, đủ 4 loại | Boundary pass L-05 |
| Password 11 ký tự | Boundary fail L-05 — MSG-019 |
| Password thiếu 1 loại ký tự | Complexity fail L-05 — MSG-019 |

### Data Dependencies
- Email service phải hoạt động để nhận OTP và reset link
- BE phải expose API để reset lockout counter trong môi trường test
- Token generation phải có cách tạo token expired cho test

---

## 8. Automation Strategy

### Nên Automate (ROI cao)

| Item | Lý do |
|------|-------|
| Happy path login (2FA ON/OFF) | Chạy mỗi regression, stable flow |
| Validation rules (email format, password format, OTP format) | Rule cố định, nhiều boundary case |
| MSG code trigger đúng điều kiện | Dễ automate, dễ regression |
| Token expiry check | Cần time-based test, khó manual |
| Lockout counter (5 lần) | Repetitive, dễ automate |

### Nên Manual

| Item | Lý do |
|------|-------|
| Email nhận thực tế (OTP, reset link) | Phụ thuộc email service, khó assert nội dung |
| UI/UX: error banner position, focus management | Cần visual check |
| Back navigation behavior | Browser-specific behavior |
| First-time password setup flow | Cần admin setup, ít lặp lại |
| Các TC liên quan gap chưa confirm | Spec chưa chốt, dễ thay đổi |

---

## 9. Entry / Exit Criteria

### Entry Criteria
- Spec L-01 → L-05 đã review và sign-off (L-06 cần bổ sung — G-044)
- Môi trường test có email service hoạt động
- API auth endpoints đã deploy và có test account
- D-00 Message definition đã chốt (G-039 — pending)

### Exit Criteria
- 100% TC happy path pass
- 100% TC security critical pass (lockout, token one-time-use, email anonymization)
- 0 bug severity Critical/High còn open
- Các TC liên quan gap pending được mark `[PENDING: G-xxx]` và có sign-off từ BA/Dev trước khi close

---

## 10. Gaps & Questions

### ✅ Đã Confirmed từ Requirement

| Gap | Nội dung | Nguồn |
|-----|----------|-------|
| OTP validity | 24 giờ kể từ lúc phát hành | L-01 email template + MSG-014 |
| OTP case-sensitive | Phân biệt hoa/thường khi verify | L-02 §1 + MSG-014 |
| Cooldown resend OTP | 60 giây / lần | L-02 §3 No.5 |
| Cooldown reset mail | 60 giây / lần | L-03 §1 |
| Email anonymization | Không lộ email đã đăng ký | L-03 §5 Bảo mật |
| Password format L-05 | Min 12 ký tự, uppercase+lowercase+digit+special | L-05 §5.1 |
| Token one-time-use | Dùng một lần, 24h | L-05 §5.4 |
| Password hash | Lưu DB dạng hash | L-05 §5.4 |
| MSG-007 wording | パスワードが一致していません | D-00 No.7 |
| MSG-019 wording | 12文字以上の半角英数字・記号で、大文字・小文字・数字・記号をすべて含めて入力してください。 | D-00 No.19 |
| Lockout rule | 5 lần sai liên tiếp → lock 30 phút | L-01 §5 |

### ⚠ Partially Confirmed

| Gap | Nội dung | Phần còn pending |
|-----|----------|-----------------|
| G-032 | Reset mail limit 5 lần/giờ (tạm thời) | Cách đếm (rolling window?), key theo email hay userId, response khi vượt limit |
| G-018 | Token binding với account | Chi tiết token format, IP/device binding — do BE quyết định |
| G-003 | Điều kiện session hợp lệ để ở L-02 | Cơ chế session cụ thể (cookie/JWT) chưa chốt |

### ❗ Need Confirm Spec — Cần BA/Dev xác nhận trước khi viết TC

| Gap | Category | Nội dung | Impact nếu không confirm |
|-----|----------|----------|--------------------------|
| **G-044** | Functional | **L-06 spec hoàn toàn trống** — không có element list, behavior, error handling | Block viết TC cho L-06 |
| **G-043** | Validation | **Mâu thuẫn rule password**: MSG-015 (L-01, min 8) vs MSG-019 (L-05, min 12) | TC validation password sẽ sai nếu rule không thống nhất |
| **G-048** | UI-UX | **Wording MSG-019 khác nhau** giữa Figma và D-00 (Figma không đề cập uppercase/lowercase) | Implement sai complexity rule |
| **G-047** | UI-UX | **Label ô confirm password L-05** giống ô đầu (`新しいパスワード`) — không có `確認` | TC không phân biệt được 2 ô |
| **G-046** | UI-UX | **L-04 thiếu link quay lại L-01** theo spec nhưng Figma không có | TC navigation L-04 không rõ expected result |
| **G-041** | UI-UX | **Placeholder L-01**: `メールアドレス または ユーザーID` — mâu thuẫn rule email-only | TC validation loginID không rõ rule |
| **G-001** | Business Logic | **Lockout counter reset**: OTP fail có ảnh hưởng counter không? Có lockout riêng cho OTP không? | TC lockout scenario không đầy đủ |
| **G-019** | Business Logic | **Link reset cũ có còn hiệu lực khi resend mail không?** | TC token invalidation không rõ expected |
| **G-045** | Functional | **Mật khẩu mới có được trùng mật khẩu cũ không?** | Thiếu TC negative cho case này |
| **G-005** | Integration | **API error mapping** cho tất cả màn auth chưa có | TC error handling không đầy đủ |
| **G-014** | Functional | **SMTP down khi 2FA ON**: fallback behavior? MSG code? | TC integration failure không rõ expected |
| **G-010** | Non-functional | **SLA/timeout chính thức** cho API auth | TC performance không có baseline |
