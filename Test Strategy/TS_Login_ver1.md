---
file: TS_Login_ver1.md
screen: L-01 / L-02 / L-03 / L-04 / L-05 / L-06 — Login & Password Reset
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

# Test Strategy — Login & Password Reset (L-01 → L-06)

---

## 1. System Overview

**Hệ thống**: 販促資材出荷管理システム (KREO) — hệ thống quản lý xuất kho vật liệu xúc tiến bán hàng.

**Phạm vi module này**: Toàn bộ luồng xác thực người dùng gồm 6 màn hình:

| Screen | Tên | Mục đích |
|--------|-----|---------|
| L-01 | ログイン | Đăng nhập bằng ID + password |
| L-02 | OTP入力 | Nhập OTP 2FA (chỉ user bật 2FA) |
| L-03 | パスワードの再設定 | Gửi yêu cầu reset password qua email |
| L-04 | メール送信完了 | Xác nhận đã gửi email + resend |
| L-05 | パスワード再設定 | Nhập mật khẩu mới từ link email |
| L-06 | パスワード変更完了 | Xác nhận đổi mật khẩu thành công |

**Luồng nghiệp vụ chính:**

```
[L-01] → (2FA ON) → [L-02] → [T-01 TOP]
[L-01] → (2FA OFF) → [T-01 TOP]
[L-01] → パスワードを忘れた → [L-03] → [L-04] → (email link) → [L-05] → [L-06] → [L-01]
```

**Đối tượng người dùng**: Quản lý（管理）và Hậu cần（物流）.

---

## 2. Key Test Targets

| ID | Priority | Module / Feature | Lý do |
|----|----------|-----------------|-------|
| KT-01 | High | L-01: Xác thực ID + password | Core entry point, mọi user đều đi qua |
| KT-02 | High | L-01: Lockout sau 5 lần sai | Security critical, ảnh hưởng trực tiếp tài khoản |
| KT-03 | High | L-01 → L-02: Luồng 2FA | Bảo mật 2 lớp, nhiều edge case |
| KT-04 | High | L-02: OTP verify (case-sensitive, 6 ký tự) | Dễ sai nếu không test kỹ hoa/thường |
| KT-05 | High | L-03 → L-04: Gửi reset email (anonymization) | Security: không lộ email đã đăng ký |
| KT-06 | High | L-05: Đặt mật khẩu mới (rule 12 ký tự, 4 loại) | Complex validation, dễ implement sai |
| KT-07 | High | L-05: Token one-time-use + expiry 24h | Security critical |
| KT-08 | Medium | L-02/L-03/L-04: Cooldown 60s resend | Rate limiting, chống spam |
| KT-09 | Medium | L-01: 2FA OFF → direct to T-01 | Happy path quan trọng |
| KT-10 | Medium | L-04: Resend email từ màn hoàn tất | Fallback flow cho user không nhận được mail |
| KT-11 | Low | L-06: Màn xác nhận đổi mật khẩu | Đơn giản nhưng cần verify navigation |

---

## 3. Risk Assessment

### Business Risk

| Risk | Impact | Why it matters |
|------|--------|---------------|
| Lockout sai logic (đếm sai, reset sai) | High | User bị khóa oan hoặc brute-force không bị chặn |
| 2FA bypass (session không đúng) | High | Attacker có thể skip OTP screen |
| Reset password link không invalidate sau dùng | High | Link cũ có thể bị tái sử dụng để chiếm tài khoản |
| Email enumeration qua L-03/L-04 response | High | Lộ thông tin email đã đăng ký |
| Password rule không nhất quán L-01 vs L-05 | High | MSG-015 (min 8) vs MSG-019 (min 12) — **[G-043, G-048 PENDING]** |

### Data Risk

| Risk | Impact | Why it matters |
|------|--------|---------------|
| OTP case-sensitive không được enforce đúng | High | User nhập đúng nhưng bị từ chối hoặc ngược lại |
| Token binding không đúng user/email | High | Token của user A dùng được cho user B |
| Password lưu plaintext thay vì hash | High | Data breach nghiêm trọng |
| `{{ユーザー名}}` null trong email template | Medium | Email gửi ra bị lỗi format — **[G-017 PENDING]** |

### Integration Risk

| Risk | Impact | Why it matters |
|------|--------|---------------|
| SMTP down khi 2FA ON | High | User không nhận được OTP, không đăng nhập được — **[G-014 PENDING]** |
| API auth không trả đúng error code → MSG mapping sai | High | UI hiển thị sai message |
| Reset URL token không match BE validation | Medium | L-05 hiển thị expired error dù link còn hạn |

### Technical Risk

| Risk | Impact | Why it matters |
|------|--------|---------------|
| Cooldown 60s tính phía client thay vì server | High | Dễ bypass bằng cách clear state |
| Session không invalidate sau reset password | High | Old session vẫn active sau đổi mật khẩu |
| Back navigation từ L-06 → L-05 với token đã dùng | Medium | Error state không được handle — **[G-051 PENDING]** |
| L-02 không có back navigation | Medium | User bị kẹt nếu nhập sai email ở L-01 — **[G-043 PENDING]** |

---

## 4. Test Scope

### In Scope

- Toàn bộ luồng L-01 → L-06 (happy path + error path)
- Validation rules: email format, password format (L-01 và L-05), OTP format
- Lockout logic: 5 lần sai / 30 phút
- 2FA flow: OTP gửi, verify, resend, cooldown
- Reset password flow: gửi email, token validity, đặt mật khẩu mới
- Message display: MSG-001/003/004/007/014/016/017/018/019/021
- Security: email anonymization, token one-time-use, session invalidation
- UI behavior: button enable/disable, error display position, trim whitespace

### Out of Scope

- T-01 và các màn hình sau khi đăng nhập thành công
- Admin flow tạo user mới (chỉ test luồng user nhận email thiết lập mật khẩu lần đầu từ L-03)
- Email server infrastructure (chỉ test behavior khi email gửi thành công/thất bại)
- Audit log implementation chi tiết (**[G-026 PENDING]**)
- Performance testing (NFR chưa chốt — **[G-010 PENDING]**)

---

## 5. Test Approach

### Test Levels

| Level | Áp dụng cho |
|-------|------------|
| System Test | Toàn bộ L-01 → L-06, end-to-end flow |
| Integration Test | API auth, OTP verify, reset password API, email trigger |
| UAT | Happy path L-01 (2FA ON/OFF), reset password flow |

### Test Types

| Type | Nội dung |
|------|---------|
| Functional | Tất cả flow chính và error path theo spec |
| Security | Email enumeration, token reuse, session invalidation, brute-force lockout |
| Boundary | OTP 6 ký tự (5/6/7), password min 12 ký tự (11/12/13), max 50 ký tự loginID |
| Negative | Sai password, OTP hết hạn, token đã dùng, email không tồn tại |
| UI/UX | Button state, error message position, trim whitespace, placeholder |

---

## 6. Test Focus Areas

### Critical Logic
- Lockout counter: reset đúng điều kiện (login success / password reset / timeout)
- 2FA session: chỉ cho phép vào L-02 khi có pending session hợp lệ
- Token: one-time-use, expire 24h, invalidate sau dùng
- Password hash: không lưu plaintext

### Complex Validation
- OTP: 6 ký tự, 半角英数字, **phân biệt hoa/thường** — test A≠a
- Password L-05: min 12, phải có uppercase + lowercase + digit + symbol (@$!%*?&)
- Email: format validation FE và BE phải match
- Trim whitespace: áp dụng cho loginID, email, OTP — nhưng **không trim password** nếu password có intentional spaces (**[G-013 PENDING]**)

### Edge Cases
- OTP resend trong cooldown 60s → MSG-016
- Reset email gửi cho email không tồn tại → vẫn show L-04 (anonymization)
- Truy cập trực tiếp L-02/L-04/L-05 không có session/token hợp lệ
- Back browser từ L-06 → L-05 với token đã dùng
- Lockout user cố reset password → vẫn cho phép reset flow

### High-risk Data Scenarios
- Password chứa tất cả ký tự đặc biệt cho phép: `@$!%*?&`
- OTP chứa cả chữ hoa và thường: `aA1bB2`
- Email với `+` và subdomain dài
- Token URL bị modify/truncate

---

## 7. Test Data Strategy

### Key Data Cần Chuẩn Bị

| Loại | Data | Mục đích |
|------|------|---------|
| User 2FA ON | email + password hợp lệ | Test luồng L-01 → L-02 → T-01 |
| User 2FA OFF | email + password hợp lệ | Test luồng L-01 → T-01 trực tiếp |
| User chưa có password | account mới do admin tạo | Test first-time password setup qua L-03 |
| User bị lockout | account đã sai 5 lần | Test MSG-021 và lockout behavior |
| Email không tồn tại | email@nonexistent.com | Test anonymization L-03/L-04 |
| OTP hợp lệ | lấy từ email thực | Test verify thành công |
| OTP hết hạn | OTP > 24h | Test MSG-014 |
| Token reset hợp lệ | từ email reset | Test L-05 thành công |
| Token đã dùng | token sau khi đã reset | Test error state L-05 |
| Token hết hạn | token > 24h | Test error state L-05 |

### Edge Case Data

- Password đúng 12 ký tự: `Abcdef1@ghij`
- Password 11 ký tự (invalid): `Abcdef1@ghi`
- Password thiếu symbol: `Abcdefgh1234`
- OTP uppercase: `ABC123` vs lowercase: `abc123` (phải khác nhau)
- LoginID max 50 ký tự
- LoginID 51 ký tự (invalid)

### Data Dependencies
- Cần môi trường test có SMTP thực hoặc mock email service
- Cần account với 2FA ON và 2FA OFF riêng biệt
- Cần khả năng reset lockout counter giữa các test run

---

## 8. Automation Strategy

### Nên Automate (ROI cao)

| Item | Lý do |
|------|-------|
| Happy path L-01 (2FA OFF) | Chạy mỗi regression, ổn định |
| Validation rules: email format, password format | Rule cố định, dễ parameterize |
| Boundary test: OTP length, password length | Data-driven, nhiều case |
| Lockout counter (5 lần sai) | Cần chạy nhiều lần, tốn thời gian manual |
| Token expiry check | Cần control time, khó test manual |

### Nên Manual

| Item | Lý do |
|------|-------|
| Email nhận thực tế (OTP, reset link) | Phụ thuộc SMTP, khó automate ổn định |
| UI/UX: error position, button state, placeholder | Cần visual verification |
| 2FA flow end-to-end | Phụ thuộc email timing |
| Security: email enumeration | Cần judgment, không chỉ assert response |
| Back navigation behavior | Browser-specific behavior |

---

## 9. Entry / Exit Criteria

### Entry Criteria
- [ ] Môi trường test deploy xong với SMTP mock hoặc real
- [ ] Test data (accounts, tokens) đã được chuẩn bị
- [ ] API spec cho auth/OTP/reset đã có (hoặc mock API sẵn sàng)
- [ ] Các gap **High risk** đã được confirm (xem Section 10)

### Exit Criteria
- [ ] 100% test case cho KT-01 → KT-07 (High priority) đã pass
- [ ] 0 bug severity Critical/High còn open
- [ ] Security test cases (email enumeration, token reuse, session invalidation) đã pass
- [ ] Regression test pass sau mỗi fix

---

## 10. Gaps & Questions

### Chưa Confirmed — `Need confirm spec?`

| Gap | Nội dung | Impact nếu không confirm |
|-----|---------|--------------------------|
| **G-001** | Lockout counter reset tại những sự kiện nào? OTP fail có ảnh hưởng counter không? | Block test case lockout logic |
| **G-004** | OTP validity chính thức (24h?), one-time-use bắt buộc? OTP cũ invalidate khi resend? | Block test case OTP expiry |
| **G-005** | API spec + error code mapping → MSG-xxx cho tất cả màn | Block integration test |
| **G-006** | Email không tồn tại / bị limit / lỗi hệ thống: UI thống nhất thế nào để không leak? | Block security test |
| **G-007** | Rule email hợp lệ thống nhất (RFC level, có cho `+`/IDN không?) | Block validation test |
| **G-009** | First-time password setup: dùng cùng L-03/L-04 hay khác wording/behavior? | Block test case first-time setup |
| **G-013** | Trim whitespace: password có intentional spaces có bị trim không? | Block boundary test password |
| **G-014** | SMTP down khi 2FA ON: hiển thị MSG nào? Có fallback không? | Block test case 2FA error |
| **G-019** | Khi resend reset mail: link cũ còn hiệu lực không? | Block security test token |
| **G-023** | Password rule chính thức: min 12 hay min 8? MSG-015 vs MSG-019 mâu thuẫn | **Block toàn bộ password test** |
| **G-041** | LoginID: email-only hay cả ユーザーID? Placeholder Figma mâu thuẫn spec | Block validation test loginID |
| **G-044** | L-01 spec: L-06 hoàn toàn trống — cần spec đầy đủ | Block test case L-06 |
| **G-046** | L-04: có link quay lại L-01 không? Figma thiếu element này | Block UI test L-04 |
| **G-047** | L-05: label ô confirm password — Figma dùng label giống ô đầu | Block UI test L-05 |
| **G-048** | MSG-019 wording: D-00 vs Figma khác nhau về complexity rule | **Block toàn bộ password reset test** |
| **G-051** | Back navigation từ L-06 → L-05: redirect L-01 hay show error? | Block navigation test |

### Đã Confirmed (từ requirement docs)

| Gap | Nội dung | Nguồn |
|-----|---------|-------|
| ✅ OTP format | 6 ký tự, 半角英数字, phân biệt hoa/thường | L-02 §1, MSG-014, MSG-017 |
| ✅ Cooldown resend OTP | 60 giây / lần, MSG-016 | L-02 §3 No.5 |
| ✅ Lockout rule | 5 lần sai liên tiếp → 30 phút, MSG-021 | L-01 §5 |
| ✅ Reset email anonymization | Không lộ email đã đăng ký, luôn show L-04 | L-03 §5 Bảo mật |
| ✅ Token expiry | 24 giờ kể từ phát hành | L-03 §5 email template, L-05 §5.4 |
| ✅ Password hash | Lưu DB chỉ bản băm | L-05 §3 No.3 |
| ✅ Password rule L-05 | Min 12, uppercase+lowercase+digit+symbol | L-05 §5.1 |
| ✅ MSG-007 wording | パスワードが一致していません | D-00 No.7 |
| ✅ Cooldown reset email | 60 giây / lần | L-03 §5 Giới hạn gửi lại |
