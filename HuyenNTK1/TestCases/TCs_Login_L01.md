# TCs_Login_ver1.2.md

| Mục | Nội dung |
|---|---|
| **File** | TCs_Login_L01.md |
| **Màn hình** | L-01 — ログインページ |
| **Tài liệu tham chiếu** | L-01_ログイン_JP.md |
| **TVP tham chiếu** | N/A (Dựa trực tiếp trên Spec) |
| **UI Mock** | Screenshot_1.png |
| **Tổng số TC** | 36 |

### ⚠️ GAP Analysis
| # | Vị trí | Mockup hiển thị | Spec quy định | Quyết định |
|---|--------|-----------------|---------------|------------|
| 1 | Transition | N/A | GAP-001: Chưa chốt chuyển về L-02 hay T-01 | Ưu tiên L-02 (theo luồng 2FA ON) |
| 2 | ID Format | N/A | GAP-002: Chưa chốt max length/ký tự cấm | Test theo rule "Half-width alphanumeric/hyphen". Độ dài test giả định Max=255. |
| 3 | Lockout MSG | N/A | GAP-005: Chưa chốt mã MSG cho lockout | Note warning nếu không rõ MSG |

---

### 9.1 Bảng test case

| TC ID | TVP ID | Module | Test Description | Preconditions | Test Steps | Test Data | Expected Result | Type | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-L01-UI-001 | N/A | GUI | Kiểm tra hiển thị tổng thể layout màn hình | 1. Mở trình duyệt<br>2. Truy cập /login | 1. Đối chiếu màn hình thực tế với UI Mockup (Screenshot_1.png) | N/A | 1. Layout chia làm 3 block: Header/Brand, Form Area, Operation<br>2. Background tuân thủ `共通仕様.md` (gradient) | GUI | Medium |
| TC-L01-UI-002 | N/A | GUI | Kiểm tra hiển thị Hệ thống Title (ヘッダー) | 1. Truy cập màn hình | 1. Quan sát phần Header | N/A | 1. Hiển thị đúng tên hệ thống: 「KREO 販促資材出荷管理システム」<br>2. Vị trí cố định (固定タイトル) | GUI | Low |
| TC-L01-UI-003 | N/A | GUI | Kiểm tra hiển thị label field ログインID | 1. Truy cập màn hình | 1. Quan sát textbox ログインID | N/A | 1. Hiển thị Label là 「ログインID」<br>2. Placeholder/Giá trị mặc định là trống | GUI | Medium |
| TC-L01-UI-004 | N/A | GUI | Kiểm tra chức năng Hide Password (Mặc định) | 1. Truy cập màn hình | 1. Nhập ký tự vào textbox パスワード | N/A | 1. Ký tự nhập vào bị ẩn thành dấu chấm/sao (伏字 - ví dụ: ●)<br>2. Biểu tượng con mắt hiển thị ở trạng thái "Hide" (gạch ngang) | GUI | High |
| TC-L01-UI-005 | N/A | GUI | Kiểm tra chức năng Unhide Password | 1. Đã nhập ký tự vào Password | 1. Click vào biểu tượng con mắt (Eye icon) trong trường Password | PW: pass123 | 1. Ký tự hiển thị thành dạng Text rõ ràng (Plaintext)<br>2. Biểu tượng con mắt chuyển sang trạng thái "Hiển thị" (không có gạch chéo) | GUI | Medium |
| TC-L01-UI-006 | N/A | GUI | Kiểm tra toggle Hide/Unhide Password liên tục | 1. Password đang ở trạng thái Unhide (Plaintext) | 1. Click vào biểu tượng con mắt thêm lần nữa | PW: pass123 | 1. Ký tự chuyển lại thành ký tự ẩn (●)<br>2. Biểu tượng con mắt quay về trạng thái "Hide" | GUI | Medium |
| TC-L01-UI-007 | N/A | GUI | Kiểm tra hiển thị nút ログイン | 1. Truy cập màn hình | 1. Quan sát nút ログイン khi chưa nhập liệu | N/A | 1. Nút hiển thị đúng Label 「ログイン」<br>2. Trạng thái mặc định là xám (グレーアウト) | GUI | Medium |
| TC-L01-UI-008 | N/A | GUI | Kiểm tra link chuyển trang quên mật khẩu | 1. Truy cập màn hình | 1. Quan sát link 「パスワードを忘れた方はこちら」 | N/A | 1. Hiển thị dưới dạng Button (Link)<br>2. Text hiển thị đúng như spec quy định | GUI | Low |
| TC-L01-UI-009 | N/A | GUI | Kiểm tra vị trí hiển thị lỗi Inline Validation | 1. Để trống ID/PW | 1. Trigger validation<br>2. Xem vị trí báo lỗi | N/A | 1. Thông báo lỗi hiển thị ngay **DƯỚI** (直下) input field tương ứng<br>2. Màu chữ là màu Đỏ (赤) | GUI | Medium |
| TC-L01-VAL-001 | N/A | Validation | [ID] Kiểm tra Required (Để trống) | 1. Truy cập màn hình | 1. Tab qua trường ID không nhập gì<br>2. Nhập Password hợp lệ<br>3. Chuyển focus ra ngoài | ID: (Empty)<br>PW: pass123 | 1. Nút 「ログイン」 ở trạng thái disable (非活性)<br>2. Hiển thị lỗi MSG-001 cho ログインID | Function | High |
| TC-L01-VAL-002 | N/A | Validation | [ID] Kiểm tra Required (Nhập toàn khoảng trắng) | 1. Truy cập màn hình | 1. Nhập toàn khoảng trắng (Space/Tab) vào ID<br>2. Nhập Password hợp lệ<br>3. Chuyển focus ra ngoài | ID: "   "<br>PW: pass123 | 1. Theo spec: trim xong tính là rỗng<br>2. Nút 「ログイン」 disable<br>3. Hiển thị lỗi MSG-001 cho ログインID | Function | High |
| TC-L01-VAL-003 | N/A | Validation | [ID] Kiểm tra Format (Ký tự hợp lệ) | 1. Truy cập màn hình | 1. Nhập ký tự Half-width alphanumeric/hyphen<br>2. Chuyển focus ra ngoài | ID: user-123_AB | 1. Không hiển thị lỗi validation cho trường ID | Function | High |
| TC-L01-VAL-004 | N/A | Validation | [ID] Kiểm tra Format (Ký tự KHÔNG hợp lệ - Full-width/Symbol) | 1. Truy cập màn hình | 1. Nhập ký tự tiếng Nhật/Full width/Symbol cấm<br>2. Chuyển focus ra ngoài | ID: ユーザー１, us@er# | 1. Nút 「ログイン」 disable<br>2. Hiển thị thông báo lỗi định dạng không hợp lệ | Function | Medium |
| TC-L01-VAL-005 | N/A | Validation | [ID] Kiểm tra Boundary (Max length) - GAP-002 | 1. Truy cập màn hình | 1. Nhập chuỗi dài đúng bằng giới hạn Max (VD: 255 ký tự)<br>2. Nhập chuỗi Max + 1 ký tự | ID: 255 chars / 256 chars | 1. Max: Chấp nhận nhập không báo lỗi<br>2. Max+1: Chặn không cho nhập thêm HOẶC báo lỗi vượt quá độ dài permitted | Function | Low |
| TC-L01-VAL-006 | N/A | Validation | [PW] Kiểm tra Required (Để trống) | 1. Truy cập màn hình | 1. Nhập ID hợp lệ<br>2. Để trống Password<br>3. Chuyển focus ra ngoài | ID: user01<br>PW: (Empty) | 1. Nút 「ログイン」 ở trạng thái disable (非活性)<br>2. Hiển thị lỗi MSG-001 cho パスワード | Function | High |
| TC-L01-VAL-007 | N/A | Validation | [PW] Kiểm tra Required (Nhập toàn khoảng trắng) | 1. Truy cập màn hình | 1. Nhập ID hợp lệ<br>2. Nhập toàn khoảng trắng vào Password<br>3. Chuyển focus | ID: user01<br>PW: "   " | 1. Theo spec: trim xong tính là rỗng<br>2. Nút 「ログイン」 disable<br>3. Hiển thị lỗi MSG-001 cho パスワード | Function | High |
| TC-L01-VAL-008 | N/A | Validation | [PW] Kiểm tra Boundary (Max length) - GAP-002 | 1. Truy cập màn hình | 1. Nhập password dài tối đa được phép (theo L-03/GAP-002)<br>2. Nhập password dài hơn mức cho phép | PW: Max char / Max + 1 | 1. Max: Chấp nhận nhập<br>2. Max+1: Chặn/Báo lỗi vượt quá độ dài | Function | Low |
| TC-L01-FNC-001 | N/A | Auth | Kiểm tra nút Login chuyển trạng thái Active | 1. Truy cập màn hình | 1. Nhập cả ID và PW hợp lệ form<br>2. Quan sát nút Login | N/A | 1. Nút 「ログイン」 chuyển từ trạng thái Xám (disable) sang trạng thái có thể click (Active) | Function | High |
| TC-L01-FNC-002 | N/A | Auth | Kiểm tra Trim khoảng trắng khi Login thực tế | 1. Nhập thông tin | 1. Nhập ID/Password có chứa khoảng trắng thừa ở ĐẦU và CUỐI<br>2. Click 「ログイン」 | ID: " user01 "<br>PW: " pass123 " | 1. Hệ thống tự động trim khoảng trắng 2 đầu trước khi gửi request xác thực<br>2. Đăng nhập thành công giống không có khoảng trắng | Function | Medium |
| TC-L01-FNC-003 | N/A | Auth | Kiểm tra Login thành công (2FA ON) | 1. User đã có account hợp lệ<br>2. 2FA đang ở trạng thái ON | 1. Nhập ID/Password đúng<br>2. Click 「ログイン」 | N/A | 1. Chuyển hướng sang màn hình L-02 ログインOTP入力画面<br>2. Hệ thống gửi email OTP cho user | Function | High |
| TC-L01-FNC-004 | N/A | Auth | Kiểm tra Login thành công (2FA OFF) | 1. User đã có account hợp lệ<br>2. 2FA OFF | 1. Nhập ID/Password đúng<br>2. Click 「ログイン」 | N/A | 1. Chuyển hướng thẳng vào trang chính (T-01 企画一覧) | Function | High |
| TC-L01-FNC-005 | N/A | Auth | Kiểm tra Login thất bại (Sai ID/PW) | 1. User nhập thông tin không khớp | 1. Nhập ID/Password sai<br>2. Click 「ログイン」 | ID đúng / PW sai | 1. Hiển thị MSG-003: 「ログインIDまたはパスワードが正しくありません」<br>2. Dữ liệu trên form giữ nguyên | Function | High |
| TC-L01-FNC-006 | N/A | Auth | Kiểm tra Login khi Network Error | 1. Mất kết nối | 1. Điền thông tin<br>2. Click 「ログイン」 | N/A | 1. Hiển thị Toast thông báo đỏ ở cạnh trên (Top Toast)<br>2. Lỗi D-00 hoặc Timeout Error | Function | Medium |
| TC-L01-EML-001 | N/A | Email | Kiểm tra NĐ/Người nhận (Recipient) của Email OTP | 1. User có 2FA ON, email là `userA@test.com` | 1. Login thành công<br>2. Mở hệ thống mail server/inbox nhận | N/A | 1. Email OTP gửi chính xác tới địa chỉ `userA@test.com`<br>2. Không gửi nhầm sang admin hay user khác | Function | High |
| TC-L01-EML-002 | N/A | Email | Kiểm tra chi tiết Content/Template của Email OTP | 1. Có email OTP gửi về thành công | 1. Mở email ra và đối chiếu với Spec | N/A | 1. Title đúng: `【KREO販促資材出荷管理システム】ログイン認証コードのご案内`<br>2. Placeholder `{{ユーザー名}}` hiển thị đúng Tên user<br>3. Chứa mã `{{OTP_CODE}}`<br>4. Các câu text cảnh báo hiển thị đúng y hệt spec | Function | Medium |
| TC-L01-EML-003 | N/A | Email | Kiểm tra không có Link chuyển hướng trong Email | 1. Đang mở email OTP | 1. Kiểm tra toàn bộ text trong email | N/A | 1. Không tồn tại bất kỳ Hyperlink nào (chỉ yêu cầu copy code)<br>2. Nếu ứng dụng mail tự bắt link (như phone number), thì không phải lỗi của hệ thống | Function | Low |
| TC-L01-NAV-001 | N/A | Navigation | Link Quên mật khẩu | 1. Đang ở màn hình | 1. Click 「パスワードを忘れた方はこちら」 | N/A | 1. Chuyển hướng tới màn hình L-03 パスワードの再設定 | Function | Medium |
| TC-L01-SEC-001 | N/A | Security | HTML DOM Hidden attribute | 1. F12 Inspector | 1. Đổi input type="password" thành type="text" | N/A | 1. Payload gửi đi vẫn bị mã hóa, an toàn bảo mật trên frontend HTML. | Security | Low |
| TC-L01-SEC-002 | N/A | Security | Lockout - Sai dưới 5 lần | 1. Account hợp lệ | 1. Nhập sai Password 4 lần liên tiếp<br>2. Lần thứ 5 nhập đúng | N/A | 1. Không bị khoá tài khoản<br>2. Đăng nhập thành công lần 5. | Security | High |
| TC-L01-SEC-003 | N/A | Security | Lockout - Sai đúng 5 lần | 1. Account bị sai pass 4 lần | 1. Nhập sai Password lần thứ 5 | N/A | 1. Tài khoản lập tức bị khoá trong 30 phút<br>2. Hiển thị Error message khóa (GAP-005) | Security | High |
| TC-L01-SEC-004 | N/A | Security | Login account Lockout bằng PW đúng | 1. Account bị khoá | 1. Nhập lại PW ĐÚNG | N/A | 1. Vẫn bị từ chối truy cập<br>2. Vẫn báo tài khoản đang bị khoá. | Security | High |
| TC-L01-SEC-005 | N/A | Security | Auto-Reset Lockout | 1. Account vừa bị Lockout | 1. Chờ qua 30 phút<br>2. Đăng nhập đúng | N/A | 1. Đăng nhập thành công<br>2. Bộ đếm fail được reset. | Security | High |
| TC-L01-SEC-006 | N/A | Security | Lockout tính trên Account | 1. Account A Lockout | 1. Lấy Account B nhập sai 1 lần | N/A | 1. Account B log fail counter=1, không bị ảnh hưởng bởi Acc A | Security | Medium |
| TC-L01-SEC-007 | N/A | Security | Audit Log - Success Login | 1. Đăng nhập thành công | 1. Kiểm tra Backend Log / DB | N/A | 1. Ghi nhận UserID, Timestamp, Action=Login_Success | Security | Low |
| TC-L01-SEC-008 | N/A | Security | Audit Log - Fail Login | 1. Đăng nhập thất bại | 1. Kiểm tra Backend Log / DB | N/A | 1. Ghi nhận UserID, Timestamp, Action=Login_Fail | Security | Low |
| TC-L01-SEC-009 | N/A | Security | SQL Injection & XSS | 1. Form Login | 1. Payload SQL ` ' OR 1=1 -- `<br>2. `<script>alert(1)</script>` | N/A | 1. Chặn request hoặc báo sai ID/PW<br>2. XSS không render thành HTMl script. | Security | High |

---

#### Lịch sử tạo file 

| Phiên bản | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.0 | 2026-04-15 | Tạo file tổng hợp Testcase L-01 (UI, Function, Security, Email OTP) | Antigravity AI |
