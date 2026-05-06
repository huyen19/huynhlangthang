# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: L-02
- **Tên màn hình**: Màn hình nhập OTP đăng nhập（ログインOTP入力画面）
- **URL**: `**/login/verify-otp`**
- **Mục đích**: Sau khi **L-01** xác thực **ID đăng nhập / mật khẩu** thành công, người dùng nhập **OTP（mã xác thực）** đã gửi qua email theo **xác thực hai yếu tố (2FA)** để hoàn tất xác minh danh tính. Chỉ người dùng bật 2FA mới chuyển sang màn hình này.
**Vai trò (quyền nghiệp vụ)**: **quản lý（管理）**・**hậu cần / logistics（物流）**. Khi kiểm tra thành công, chuyển sang **T-01 Danh sách kế hoạch (TOP)**（企画の一覧（TOP））.
**Mật độ hiển thị**: **Compact**.
- **Yêu cầu OTP（mã xác thực）**: Cố định **6 ký tự**, chỉ **chữ và số Latin nửa độ rộng**（半角英数字）; **phân biệt chữ hoa / chữ thường** khi phát hành và đối chiếu. Nhập đúng chữ hoa/thường như trong email.

## 2. Bố cục màn hình

Bố cục màn hình **như hình minh họa dưới đây**.
[https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=469-252430&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1](https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=469-252430&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1)

- **UI chung**: Thương hiệu và nền thống nhất với `共通仕様.md` và các màn hình thuộc nhóm đăng nhập.

**Cấu trúc khối (từ trên xuống, tương ứng hình)**

1. **Header / thương hiệu**: Tiêu đề cố định (tên hệ thống, v.v.)
2. **Vùng hướng dẫn**: Câu thông báo đã gửi email và hướng dẫn nhập mã xác thực
3. **Form**: Ô nhập mã xác thực, vùng hiển thị lỗi
4. **Phía dưới vùng lỗi**: Liên kết thao tác 「認証コードを再送信する」（gửi lại mã xác thực）
5. **Thao tác**: Nút 「ログイン」

## 3. Danh sách phần tử UI


| No. | Tên phần tử             | Loại           | Mô tả                                                    | Hành vi khi thao tác                                                                                                                                                                                                    | Quy tắc kiểm tra                                       | Ghi chú                                         |
| --- | ----------------------- | -------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| 1   | Tiêu đề hệ thống        | Văn bản (tĩnh) | Hiển thị tên sản phẩm                                    | -                                                                                                                                                                                                                       | -                                                      | -                                               |
| 2   | Câu hướng dẫn đã gửi mã | Văn bản (tĩnh) | Thông báo đã gửi mã xác thực qua email                   | -                                                                                                                                                                                                                       | -                                                      | -                                               |
| 3   | Mã xác thực             | Ô nhập         | Nhập OTP                                                 | Trước khi kiểm tra, loại bỏ khoảng trắng đầu/cuối; **sau khi loại bỏ mà rỗng thì coi là chưa nhập**                                                                                                                     | **Bắt buộc** (trống → **MSG-001**, tên mục là 「認証コード」) | Mặc định trống. Ô nhập theo kiểu chữ/số (Latin) |
| 4   | Vùng hiển thị thông báo | Văn bản (động) | Kiểm tra (validation), lỗi xác thực OTP, lỗi phiên, v.v. | Cập nhật khi có lỗi; bình thường ẩn hoặc xóa                                                                                                                                                                            | -                                                      | -                                               |
| 5   | Gửi lại mã xác thực     | Nút (liên kết) | Yêu cầu gửi lại OTP                                      | **Khi nhấn:** thực hiện gửi lại. **Trong thời gian chờ (cooldown) không cho gửi lại**（**tối đa 1 lần / 60 giây**／**MSG-016**）. Khi thành công, thông báo tại **vùng hiển thị thông báo**                                | -                                                      | -                                               |
| 6   | Đăng nhập               | Nút            | Thực hiện kiểm tra OTP                                   | **Khi nhấn:** sau kiểm tra bắt buộc và định dạng, phía server xác thực OTP（**phân biệt chữ hoa / thường**）. Thành công → chuyển **T-01 Danh sách kế hoạch (TOP)**. Thất bại → hiển thị **MSG-014**, giữ nguyên màn hình | -                                                      | Nút **vô hiệu** cho đến khi nhập đủ **6 ký tự** |


## 4. Hành động và chuyển màn hình


| Hành động          | Kích hoạt                                                         | Nội dung xử lý                                                         | Màn hình đích                                                                              |
| ------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Hiển thị ban đầu   | Ngay sau khi chuyển từ **L-01** / truy cập trực tiếp màn hình này | Mã xác thực trống. Xóa vùng thông báo.                                 | -                                                                                          |
| Thay đổi nhập liệu | Người dùng sửa mã xác thực                                        | Khi đủ **6 ký tự** thì **kích hoạt** nút 「ログイン」; ngược lại **vô hiệu** | -                                                                                          |
| Kiểm tra OTP       | Nhấn 「ログイン」                                                       | Kiểm tra bắt buộc → API xác thực OTP. Thành công → thiết lập phiên     | Thành công: chuyển **T-01 Danh sách kế hoạch (TOP)**. Thất bại: **MSG-014**, cùng màn hình |
| Gửi lại OTP        | Nhấn 「認証コードを再送信する」                                                | API gửi lại                                                            | Cùng màn hình (khi thành công, hiển thị thông báo theo yêu cầu)                            |


## 5. Bổ sung

### Yêu cầu phi chức năng (hiệu năng)

- Thời gian phản hồi mục tiêu cho xác thực OTP và gửi lại: theo **NFR** / **common-document**. Mục tiêu **dưới 3 giây**.

### Nhật ký kiểm toán (audit log)

- Có ghi hay không các sự kiện OTP thành công/thất bại và yêu cầu gửi lại: theo chính sách bảo mật. Nội dung mục và thời hạn lưu: xác định tại **GAP-001**.

### GAP

- **GAP-001** — Nội dung ghi **nhật ký kiểm toán**（xác thực OTP・gửi lại）

---

**Lịch sử chỉnh sửa**


| Ngày | Phiên bản | Nội dung chỉnh sửa | Người phụ trách |
| ---- | --------- | ------------------ | --------------- |


