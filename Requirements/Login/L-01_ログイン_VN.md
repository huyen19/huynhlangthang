# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: L-01
- **Tên màn hình**: Trang đăng nhập
- **URL**: /login
- **Mục đích (yêu cầu)**: Thực hiện **xác thực (đăng nhập)** vào hệ thống — **ログインページ** (trang đăng nhập).
- **Mật độ hiển thị (yêu cầu)**: **Compact**
- **Đối tượng sử dụng / quyền (yêu cầu)**: Dự kiến người dùng có quyền **quản lý（管理）** và **hậu cần / logistics（物流）**.
- **Tổng quan**: Người dùng xác thực vào hệ thống bằng **ID đăng nhập** và **mật khẩu**. Khi lỗi kiểm tra đầu vào hoặc xác thực thất bại, hiển thị thông báo. Khi thành công, chuyển sang màn hình tiếp theo (OTP, v.v.). Có **đường dẫn đặt lại mật khẩu**.
- **2FA**: Bật/tắt xác thực hai yếu tố theo từng user; màn hình này chỉ nhập và kiểm tra **ID đăng nhập** và **mật khẩu**.

## 2. Bố cục màn hình

Bố cục màn hình **như hình minh họa dưới đây**.
https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=99-32334&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1

- **UI chung**: Nền gradient, v.v. theo `共通仕様.md`.

**Cấu trúc khối (từ trên xuống, tương ứng hình)**

1. **Header / thương hiệu**: Tiêu đề cố định hiển thị tên hệ thống (ví dụ: KREO 販促資材出荷管理システム)
2. **Vùng form**: Nhập ID đăng nhập, mật khẩu, vùng hiển thị thông báo lỗi
3. **Thao tác**: Nút 「ログイン」, liên kết 「パスワードを忘れた方はこちら」

**Thành phần UI chính (yêu cầu)**: Trọng tâm màn hình là **Form**, gồm **Input** (ID đăng nhập, mật khẩu) và **Button** (「ログイン」, v.v.).

## 3. Danh sách phần tử UI

| No. | Tên phần tử        | Loại           | Mô tả                              | Hành vi khi thao tác                                                                                | Quy tắc kiểm tra                                                                                                                                                    | Ghi chú                                        |
| --- | ------------------ | -------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | Tiêu đề hệ thống   | Văn bản (tĩnh) | Hiển thị tên sản phẩm              | -                                                                                                   | -                                                                                                                                                                   |                                                |
| 2   | ID đăng nhập       | Ô nhập         | Nhập định danh người dùng          | Trước khi kiểm tra, loại bỏ khoảng trắng đầu/cuối; **sau khi loại bỏ mà rỗng thì coi là chưa nhập** | **Bắt buộc** (trống → **MSG-001**, tên mục là 「ログインID」). **Định dạng email**. **Độ dài tối đa: 50 ký tự**.                                                     | Mặc định trống. **FE / BE: kiểm tra**          |
| 3   | Mật khẩu           | Ô nhập         | Nhập mật khẩu (hiển thị che)       | Hiển thị che trên màn hình (ví dụ: ●)                                                               | **Bắt buộc** (trống → **MSG-001**, tên mục là 「パスワード」). Trước khi kiểm tra, loại bỏ khoảng trắng đầu/cuối; **sau khi loại bỏ mà rỗng thì coi là chưa nhập**. | Mặc định trống. **Kiểm tra FE và BE**          |
| 4   | Vùng thông báo lỗi | Văn bản (động) | Hiển thị lỗi validation / xác thực | Cập nhật khi có lỗi; bình thường ẩn hoặc xóa                                                        | -                                                                                                                                                                   |                                                |
| 5   | Đăng nhập          | Nút            | Thực hiện xác thực                 | **Khi nhấn:** bắt đầu xử lý đăng nhập như mục dưới                                                  | **Vô hiệu (xám)** cho đến khi các mục bắt buộc hợp lệ                                                                                                               |
| 6   | Quên mật khẩu      | Nút (liên kết) | Luồng đặt lại mật khẩu             | **Khi nhấn:** chuyển **L-03 Đặt lại mật khẩu**.                                                     | -                                                                                                                                                                   |                                                |

## 4. Hành động và chuyển màn hình

| Hành động           | Kích hoạt                             | Nội dung xử lý                                                                                 | Màn hình đích                                                                                                                                                                               |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hiển thị ban đầu    | Hiển thị màn hình                     | ID đăng nhập và mật khẩu trống. Vùng thông báo xóa. Nút đăng nhập vô hiệu (chưa nhập bắt buộc) | -                                                                                                                                                                                           |
| Thực hiện đăng nhập | Nhấn 「ログイン」                     | Phía client kiểm tra validation, sau đó BE kiểm tra validation và xử lý xác thực.              | Thành công: **2FA ON** → chuyển **L-02 Màn hình nhập OTP đăng nhập** (xác nhận OTP thành công → **T-01 Danh sách kế hoạch**). **2FA OFF** → chuyển thẳng **T-01 Danh sách kế hoạch**. Thất bại: hiển thị **MSG-003**, giữ nguyên ID và mật khẩu đã nhập. |
| Đặt lại mật khẩu    | Nhấn 「パスワードを忘れた方はこちら」 | Chuyển sang luồng đặt lại                                                                      | **L-03 Đặt lại mật khẩu**                                                                                                                                                                   |

## 5. Bổ sung

### Xử lý lỗi

- **Validation (bắt buộc, định dạng):** Ngay **dưới** ô tương ứng, hoặc trong vùng thông báo, inline (đỏ) với nội dung thông báo
- **Xác thực thất bại:** **MSG-003**. Wording tiếng Nhật: **「ログインIDまたはパスワードが正しくありません」** (khớp `D-00`). **Phán định BE**
- **Lỗi mạng:** Theo yêu cầu — toast hoặc inline (wording / mã theo **D-00** bổ sung hoặc **GAP**)

**Cách hiển thị**

- **Validation:** Dưới ô nhập hoặc vùng thông báo, inline (đỏ)
- **Lỗi xác thực:** Vùng thông báo hoặc inline (đỏ) — **MSG-003** (chuẩn wording như trên)
- **Mạng và các lỗi khác:** **Toast** phía trên màn hình (lỗi đỏ, thông tin xanh; khoảng 3 giây tự ẩn, hoặc theo **D-00**)

### Lỗi xác thực / validation và phân chia FE / BE

| Nội dung                                              | FE (client)               | BE (server)                                                            |
| ----------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------- |
| Kiểm tra ID đăng nhập (bắt buộc, email, max 50)       | Thực hiện (trước khi gửi) | Kiểm tra lại cùng quy tắc                                              |
| Kiểm tra bắt buộc mật khẩu                            | Thực hiện (trước khi gửi) | Kiểm tra lại cùng quy tắc                                              |
| Khớp ID + mật khẩu, cho phép đăng nhập                | -                         | Thực hiện                                                              |
| Số lần nhập sai mật khẩu liên tiếp, lockout           | -                         | Thực hiện                                                              |
| Quyết định 2FA, gửi email OTP                         | -                         | Thực hiện                                                              |

### Xác thực hai bước (2FA) và chuyển màn (yêu cầu)

- **2FA BẬT (ON)**: Khi ID và mật khẩu **đúng**, gửi email chứa **OTP** tới địa chỉ email đã đăng ký; chuyển sang **L-02 Màn hình nhập OTP đăng nhập**. Khi **xác nhận OTP thành công** thì chuyển sang **T-01 Danh sách kế hoạch**.
- **2FA TẮT (OFF)**: Khi ID và mật khẩu **đúng**, hoàn tất đăng nhập **không** qua nhập OTP; chuyển thẳng sang **T-01 Danh sách kế hoạch**.

### Mẫu nội dung email（mã xác thực đăng nhập / 2FA BẬT）

Khi tại **L-01** ID và mật khẩu **đúng** và user đó **bật 2FA**, hệ thống gửi email **OTP đăng nhập** tới email đã đăng ký. **Tiêu đề và nội dung** bản tiếng Nhật chốt như sau; `{{…}}` được thay khi gửi.

**件名（tiêu đề）**

```text
【KREO販促資材出荷管理システム】ログイン認証コードのご案内
```

**本文**

```text
{{ユーザー名}} 様
いつも「販促資材出荷管理システム」をご利用いただきありがとうございます。 ログインを完了するには、以下の認証コードを入力してください。

■認証コード: {{OTP_CODE}}
※認証コードの有効期限は、発行から24時間です
※有効期限が切れた場合は、画面上の「認証コードを再送信する」から再度お手続きください

────────────────────────────
【ご注意】
・このコードはログイン時に一度のみ有効です。
・本メールに覚えがない場合は、お手数ですが本メールを破棄してください。
・第三者にこのコードを教えないようご注意ください。
```

| Placeholder      | Ý nghĩa                                                    |
| ---------------- | ---------------------------------------------------------- |
| `{{ユーザー名}}` | Tên trong lời chào（theo định nghĩa BE）                   |
| `{{OTP_CODE}}`   | Mã OTP đăng nhập（độ dài / định dạng: **L-02**, **D-00**） |

- **Thời hạn hiệu lực**: Theo văn bản mail là **24 giờ kể từ lúc phát hành**（thống nhất **MSG-014** / **D-00**）. Khác với **cooldown gửi lại trên màn hình**（**60 giây**／**MSG-016**）.
- Cụm 「認証コードを再送信する」phải **khớp** với wording thao tác trên **L-02**.

### Khóa tài khoản (nhập sai mật khẩu liên tiếp)

Với **cùng một ID đăng nhập (tài khoản)**, nếu **nhập sai mật khẩu 5 lần liên tiếp** thì **trong 30 phút** từ chối đăng nhập tài khoản đó (lockout). Số lần sai được đếm **theo từng tài khoản**.

- **Phán định / bộ đếm:** do **BE**. Điều kiện reset số lần sai: hết thời gian khóa, đăng nhập thành công, hoàn tất đặt lại mật khẩu.
- **Hiển thị:** khi lockout dùng **MSG-021**. Phân biệt rõ với **MSG-003** khi triển khai.

### Yêu cầu phi chức năng (hiệu năng)

- Mục tiêu thời gian phản hồi yêu cầu xác thực do **tài liệu NFR** hoặc **common-document** định nghĩa (chưa có thì thỏa thuận với PM). Mục tiêu tham khảo: **dưới 3 giây**.

### Nhật ký kiểm toán (audit log)

- Việc ghi nhận đăng nhập thành công / thất bại tuân theo chính sách bảo mật và **common-document**. Ghi định danh người thực hiện (ID đăng nhập, v.v.), kết quả, mốc thời gian. **Chi tiết bổ sung khi có đặc tả audit log** (chưa rõ → **GAP-004**).

### GAP

- **GAP-001** — Độ dài tối đa ID đăng nhập, ký tự cấm (mã điều khiển, v.v.). Trần độ dài mật khẩu và thống nhất với màn đăng ký (L-03, v.v.)
- **GAP-002** — Nội dung ghi audit log (lần thử đăng nhập) và thời hạn lưu trữ
