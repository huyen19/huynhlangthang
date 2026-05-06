---
title: Test Strategy - Login & Authentication Flow
screen: L-01 → L-06 (Login, OTP, Password Reset)
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
  - Test Q&A/Q&A_Login_OTP_ResetPassword_VN.md
---

# Test Strategy: Login & Authentication Flow

## 1. System Overview

**Hệ thống:** 販促資材出荷管理システム (KREO Promotional Materials Shipping Management System)

**Module:** Authentication & Access Control (L-01 → L-06)

**Mục đích:** Xác thực người dùng vào hệ thống thông qua:
- Login cơ bản (ID/password)
- 2FA optional (OTP qua email)
- Password reset flow (6 screens)

**Luồng nghiệp vụ quan trọng:**

1. **Login thành công (2FA OFF):** L-01 → T-01 (Dashboard)
2. **Login thành công (2FA ON):** L-01 → L-02 (OTP) → T-01
3. **Password reset:** L-01 → L-03 (Request) → L-04 (Confirmation) → L-05 (Set new password) → L-06 (Success) → L-01
4. **Lockout:** 5 lần sai password trong 30 phút → block login 30 phút

**Đối tượng:** User có quyền 管理 (Admin) và 物流 (Logistics)

---

## 4. Test Scope

### In Scope

| Screen | Phạm vi |
|--------|---------|
| L-01 | Login form validation, authentication, lockout, 2FA routing |
| L-02 | OTP input validation, OTP verify, resend cooldown |
| L-03 | Email input validation, reset request, security (no email leak) |
| L-04 | Resend email, cooldown, link quay lại L-01 |
| L-05 | Token validation, password complexity, confirm match, submit |
| L-06 | Success screen display, navigation về L-01 |
| D-00 | MSG code wording, display position (inline/banner/toast) |
| Email | OTP email template, reset email template, placeholder substitution |

### Out of Scope

- T-01 (Dashboard) — chỉ verify redirect đúng, không test nội dung T-01
- Admin user management (tạo user, assign role)
- Email server infrastructure / SMTP configuration
- Browser compatibility testing (trừ khi có yêu cầu riêng)

---

## 5. Test Approach

### Test Levels

| Level | Áp dụng cho | Ghi chú |
|-------|-------------|---------|
| **System Test** | Toàn bộ L-01 → L-06 | Luồng end-to-end, integration với email service |
| **Integration Test** | L-01↔L-02, L-03↔L-04↔L-05↔L-06, FE↔BE↔Email | API response mapping, session handoff |
| **UAT** | Happy path login, password reset | User acceptance với role 管理 và 物流 |

### Test Types

| Type | Áp dụng cho |
|------|-------------|
| **Functional** | Tất cả screens — validation rules, flow transitions, MSG codes |
| **Security** | Lockout, OTP one-time-use, token expiry, email enumeration prevention |
| **Negative** | Invalid input, expired token, wrong OTP, cooldown violation |
| **Boundary** | Password min 12 chars, loginID max 50 chars, OTP exactly 6 chars, cooldown 60s, lockout 5 lần/30 phút |
| **API** | Login API, OTP verify API, resend OTP API, reset request API, password update API |

---

## 6. Test Focus Areas

### Critical Logic

- **Lockout:** đếm đúng 5 lần liên tiếp, reset counter khi login success / password reset success / hết 30 phút
- **2FA routing:** 2FA ON → L-02; 2FA OFF → T-01 trực tiếp
- **OTP one-time-use:** OTP đã dùng không verify được lần 2
- **Token one-time-use:** reset token đã dùng → error, không cho đổi password lần 2
- **Email enumeration prevention:** L-03/L-04 luôn trả về success flow dù email không tồn tại

### Complex Validation

- **Password complexity (L-05):** min 12 chars + uppercase + lowercase + digit + special char (@$!%*?&) — tất cả 4 điều kiện phải đồng thời thỏa
- **OTP case-sensitive:** `AbCdEf` ≠ `abcdef` — verify phân biệt hoa/thường
- **Email format (L-01, L-03, L-04):** có `@`, domain có `.`, không có space — rule thống nhất FE và BE
- **MSG-015 vs MSG-019 conflict:** L-01 dùng MSG-015 (min 8), L-05 dùng MSG-019 (min 12) — cần confirm rule thống nhất (**G-043**)

### Edge Cases

- OTP nhập đúng nhưng đã hết 24h → MSG-014
- Reset token hết hạn → error screen với link về L-03
- Resend OTP trong cooldown 60s → MSG-016
- Login khi đang bị lockout → MSG-021 (không phải MSG-003)
- Email có leading/trailing space → trim trước validate
- Password có leading/trailing space → trim trước validate (nhưng password có intentional space thì sao? **G-013**)
- Truy cập L-02/L-04/L-05 trực tiếp không có session/token → redirect L-01

### High-Risk Data Scenarios

- User có 2FA ON + email service down → không login được
- User gửi reset email 5 lần/giờ → rate limit (GAP-004, **G-032**)
- Concurrent login requests cùng account → lockout counter race condition
- Reset token cũ còn hiệu lực khi gửi mail mới (**G-019**)

---

## 7. Test Data Strategy

### Key Data Needed

| Data type | Mô tả | Ví dụ |
|-----------|-------|-------|
| Valid user (2FA OFF) | User có password đúng, 2FA tắt | `user1@example.com` / `Password123!` |
| Valid user (2FA ON) | User có password đúng, 2FA bật | `user2@example.com` / `Password123!` |
| Locked user | User đã bị lockout (5 lần sai) | `locked@example.com` |
| User chưa có password | User mới tạo, chưa set password lần đầu | `newuser@example.com` |
| Email không tồn tại | Email chưa đăng ký trong hệ thống | `notfound@example.com` |

### Important Edge Cases

- Email max length (50 chars): `abcdefghij1234567890abcdefghij1234567890@test.com` (đúng 50)
- Email 51 chars: validation fail
- Password min 12 chars: `Abc123!@#$%^` (đúng 12)
- Password 11 chars: validation fail
- OTP exactly 6 chars: `A1b2C3` (case-sensitive)
- OTP 5 chars / 7 chars: validation fail

### Data Dependencies

- L-02 phụ thuộc L-01: cần login success trước mới có session để vào L-02
- L-05 phụ thuộc L-03/L-04: cần có valid token từ email
- Lockout test: cần user có thể reset counter (hoặc tạo user mới mỗi lần test)

---

## 8. Automation Strategy

### Nên Automate (High ROI)

| Scope | Lý do |
|-------|-------|
| **API tests:** Login, OTP verify, reset request, password update | Stable, regression-critical, chạy nhanh |
| **Happy path E2E:** L-01 → T-01 (2FA OFF), L-01 → L-02 → T-01 (2FA ON) | Smoke test, chạy mỗi build |
| **Validation rules:** email format, password complexity, OTP format | Deterministic, nhiều cases |
| **Lockout logic:** 5 lần sai → lock, reset counter | Critical security, cần regression |

### Nên Manual (Low ROI hoặc phức tạp)

| Scope | Lý do |
|-------|-------|
| **Email content verification** | Cần check placeholder substitution, wording, link trong email — khó automate |
| **UI/UX:** error position (inline/banner), focus management, accessibility | Subjective, cần human judgment |
| **Exploratory:** concurrent requests, race condition, browser back/forward | Ad-hoc, không lặp lại |
| **L-06 success screen** | Chỉ display text, không có logic — manual nhanh hơn |

---

## 9. Entry / Exit Criteria

### Entry Criteria

- [ ] Spec L-01 → L-06 đã được approve bởi BA/Dev
- [ ] D-00 Message definition đã có đủ MSG code (MSG-001/003/004/007/014/016/019/021)
- [ ] Test environment có email service hoạt động (hoặc mock email)
- [ ] Test data: ít nhất 2 user (2FA ON/OFF), 1 user lockout, 1 email không tồn tại

### Exit Criteria

- [ ] **100% critical test cases passed** (TT-01 → TT-05)
- [ ] **0 High severity defects open**
- [ ] **Medium/Low defects:** reviewed và accepted bởi PM
- [ ] **Gaps confirmed:** tất cả gap High risk trong Q&A đã được trả lời hoặc có workaround
- [ ] **Regression:** happy path E2E (2FA ON/OFF) passed

---

## 10. Gaps & Questions

### Đã Confirmed (từ D-14 / D-00)

| Gap | Nội dung | Trạng thái |
|-----|----------|------------|
| G-007 (email format) | Rule email: có `@`, domain có `.`, không space — FE+BE validate | ✅ Confirmed từ L-01 §3, L-03 §3 |
| G-008 (OTP format) | OTP 6 ký tự, 半角英数字, case-sensitive | ✅ Confirmed từ L-02 §1, MSG-017 |
| G-023 (password min 12) | L-05 §5.1 chốt min 12 chars + 4 loại ký tự | ✅ Confirmed từ L-05 §5.1, MSG-019 |
| G-018 (reset token) | Token one-time-use, 24h expiry, lưu hash | ✅ Confirmed từ L-05 §5.4 |
| G-006 (security L-03) | Email không tồn tại → vẫn trả về success flow (không leak) | ✅ Confirmed từ L-03 §5 Bảo mật |
| G-015 (OTP cooldown) | Cooldown 60s, MSG-016 khi vi phạm | ✅ Confirmed từ L-02 §3 No.5, D-00 MSG-016 |
| G-020 (resend toast) | Toast "再設定メールを再送しました。" khi resend thành công ở L-04 | ⚠ Partially confirmed — chưa có MSG code trong D-00 |
| G-019 (link cũ khi resend) | Giả định link cũ không mất hiệu lực khi gửi mail mới | ⚠ Partially confirmed — cần xác nhận BE/security |

### Chưa Confirmed — `Need confirm spec?`

| Gap | Nội dung | Impact nếu không confirm |
|-----|----------|--------------------------|
| **G-001** | Lockout counter reset tại sự kiện nào (OTP fail? password change fail?) | Block test case lockout logic |
| **G-004** | OTP validity chính thức: 24h hay khác? OTP cũ bị invalidate khi resend không? | Block test case OTP expiry |
| **G-041** | Placeholder `メールアドレス または ユーザーID` — loginID là email-only hay cả ユーザーID? | Block validation test cases L-01 |
| ~~G-043~~ | ~~MSG-015 vs MSG-019 conflict~~ | ✅ Confirmed: MSG-015 không dùng trong Login flow. MSG-019 (min 12, 4 loại) là rule duy nhất cho L-05. |
| ~~G-044~~ | ~~L-06 spec trống~~ | ✅ Confirmed: L-06 chỉ có title + guide + button ログイン → L-01. Figma là tài liệu tham chiếu đủ. |
| **G-046** | L-04 có link quay lại L-01 không? Figma không có nhưng spec §3 No.5 mô tả có | Block UI test cases L-04 |
| **G-047** | Label ô confirm password L-05: `新しいパスワード` hay `新しいパスワード（確認）`? | Block UI test cases L-05 |
| **G-048** | MSG-019 wording: bản D-00 hay bản Figma? (complexity rule có thể khác nhau) | Block error message test cases L-05 |
| **G-003** | Điều kiện session hợp lệ để ở lại L-02 (refresh/back/direct access) | Block session/navigation test cases |
| **G-032** | Rate limit resend reset mail: số lần/giờ, rolling window hay fixed? | Block rate limit test cases L-03/L-04 |
| **G-005** | API spec (endpoint, error codes, MSG mapping) cho tất cả auth screens | Block API test cases |

---

## 2. Key Test Targets

| ID | Priority | Module/Feature | Lý do |
|----|----------|----------------|-------|
| TT-01 | **Critical** | L-01: Login authentication (ID/password) | Entry point vào hệ thống; nếu fail → toàn bộ user không truy cập được |
| TT-02 | **Critical** | L-01: Lockout mechanism (5 lần/30 phút) | Security critical; sai logic → brute-force attack hoặc lock nhầm user hợp lệ |
| TT-03 | **High** | L-02: OTP verification (2FA) | Bảo mật tăng cường; fail → bypass 2FA hoặc user không login được |
| TT-04 | **High** | L-03/L-04: Password reset request (email không lộ registered status) | Security: không được leak thông tin email đã đăng ký hay chưa |
| TT-05 | **High** | L-05: Password complexity validation (12 chars, 4 types) | Fail → weak password hoặc user không đổi được password |
| TT-06 | **Medium** | L-02: OTP resend cooldown (60s) | UX + anti-spam; fail → spam email hoặc user bị block resend |
| TT-07 | **Medium** | L-05: Token validation (one-time, 24h expiry) | Security: token reuse → unauthorized password change |
| TT-08 | **Medium** | L-01: Email format validation (max 50 chars) | Data integrity; fail → invalid email vào DB |
| TT-09 | **Low** | L-06: Success screen display | UX only; không ảnh hưởng logic |

---

## 3. Risk Assessment

### Business Risk

| Risk | Impact | Why it matters |
|------|--------|----------------|
| **Lockout logic sai → lock nhầm user hợp lệ** | **High** | User không login được → business downtime, support ticket tăng đột biến |
| **2FA bypass (OTP không verify đúng)** | **High** | Unauthorized access → data breach, compliance violation |
| **Password reset leak email registration status** | **High** | Attacker enumerate valid emails → targeted phishing, GDPR violation |
| **Lockout không reset đúng → user bị lock vĩnh viễn** | **Medium** | User phải contact support → bad UX, tăng chi phí vận hành |

### Data Risk

| Risk | Impact | Why it matters |
|------|--------|----------------|
| **Email validation không đủ strict → invalid email vào DB** | **Medium** | Email OTP/reset không gửi được → user không login/reset password được |
| **Password hash không đúng chuẩn** | **High** | Password leak → toàn bộ account bị compromise |
| **OTP/reset token không unique → collision** | **High** | User A nhận token của user B → unauthorized access |

### Integration Risk

| Risk | Impact | Why it matters |
|------|--------|----------------|
| **Email service down → OTP/reset email không gửi được** | **High** | 2FA user không login được; user không reset password được → business impact |
| **Email delay (OTP đến sau 24h)** | **Medium** | OTP expired khi user nhận → bad UX, user phải resend nhiều lần |
| **SMTP rate limit → email bị reject** | **Medium** | User không nhận OTP/reset email → không login/reset được |

### Technical Risk

| Risk | Impact | Why it matters |
|------|--------|----------------|
| **Session management sau OTP success không đúng** | **High** | User verify OTP xong nhưng không vào được T-01 → login fail |
| **Token invalidation không hoạt động (L-05)** | **High** | Token reuse → attacker dùng lại link cũ để đổi password |
| **Lockout counter race condition (concurrent requests)** | **Medium** | 2 request cùng lúc → counter không tăng đúng → lockout không trigger |
| **Browser back từ L-06 → L-05 với token đã dùng** | **Low** | UX confusing nhưng không phải security issue nếu token đã invalid |

---

