# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: L-04
- **Tên màn hình**: Hoàn tất gửi email đặt lại mật khẩu（パスワード再設定／メール送信完了）
- **URL**: `**/login/reset/requested`（theo bảng UI design L-04）
- **Phân loại**: **Xác thực（認証）**
- **Mục đích**:
  - Thông báo cho người dùng rằng email chứa liên kết **đặt lại mật khẩu** đã được **gửi thành công** sau khi xử lý tại **L-03**.
  - Đồng thời đóng vai trò **dự phòng (fallback)**: nếu **không nhận được email**, người dùng có thể **nhập lại địa chỉ email ngay trên màn hình này** để **yêu cầu gửi lại**.
- **Mật độ hiển thị (Density)**: **Compact**
- **Quyền truy cập **: Tài khoản có quyền **Quản lý（管理）** và **Hậu cần / Logistics（物流）**

## 2. Bố cục màn hình

[https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=174-3909&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1](https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=174-3909&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1)

- **UI chung**: Thương hiệu và nền thống nhất với `共通仕様.md` và nhóm màn hình đăng nhập **L-01**.

**Cấu trúc khối (từ trên xuống)**

1. **Tiêu đề lớn (hoàn tất)**: **「メールを送信しました」** — bản hiển thị tiếng Việt có thể dùng: **「Đã gửi email」** (hoặc câu tương đương theo Figma / chuỗi hệ thống).
2. **Câu hướng dẫn (tĩnh)**:

- Yêu cầu người dùng **nhấp liên kết trong email** để đặt lại mật khẩu **trong vòng 24 giờ** (thống nhất với thời hạn trong nội dung email tại **L-03**).
- Nếu **không nhận được email** hoặc **thất lạc**, có thể **yêu cầu gửi lại** qua **biểu mẫu** bên dưới; có thể kèm nhắc kiểm tra thư mục spam / thư rác nếu thiết kế có.
- Hiển thị rõ cho người dùng quy tắc **giới hạn gửi lại mỗi 1 phút** (cùng tài khoản / cùng địa chỉ email) đã chốt tại **L-03** (thời gian chờ còn lại hoặc nội dung cố định — thống nhất với **L-03** và Figma).

1. **Form**:

- Ô nhập **địa chỉ email** (dùng cho **gửi lại**).
- Nút **「送信する」** (**Gửi**).

1. **Đăng nhập**: Liên kết / nút **quay lại màn hình đăng nhập** — chuyển tới **L-01**.

## 3. Danh sách phần tử UI


| No. | Tên phần tử             | Loại           | Mô tả                                                                                                                                | Hành vi khi thao tác                                                                                                                                                                                                      | Quy tắc kiểm tra                                                         | Ghi chú                                                            |
| --- | ----------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 1   | Tiêu đề hoàn tất        | Văn bản (tĩnh) | Thể hiện đã gửi email thành công — 「メールを送信しました」                                                                                      | -                                                                                                                                                                                                                         | -                                                                        | -                                                                  |
| 2   | Câu hướng dẫn           | Văn bản (tĩnh) | Hiển thị nội dung hướng dẫn thời hạn hữu hạn của link là **24 giờ**, giải thích **giới hạn 1 phút** mới có thể gửi lại mail cho user | -                                                                                                                                                                                                                         | -                                                                        | -                                                                  |
| 3   | Địa chỉ email           | Ô nhập         | Nhập email để **yêu cầu gửi lại** khi cần                                                                                            | Trước khi gửi, loại bỏ khoảng trắng đầu/cuối; **sau khi loại bỏ mà rỗng thì coi là chưa nhập**. Xử lý phía người dùng sau khi gửi thành công **theo cùng nguyên tắc ẩn danh hóa như L-03** (không lộ đã đăng ký hay chưa) | Bắt buộc（trống → MSG-001, tên mục là 「メールアドレス」）. Sai định dạng → MSG-004 | Logic gửi lại và giới hạn tần suất **giống L-03**                  |
| 4   | 「送信する」（Gửi）             | Nút            | Gửi yêu cầu **gửi lại email**                                                                                                        | **Khi nhấn:** kiểm tra theo bảng; gọi API xử lý **cùng loại với L-03**. Thành công: **ở lại L-04** và hiển thị toast message: 再設定メールを再送しました。                                                                              | -                                                                        | Trạng thái nút (kích hoạt / vô hiệu) **thống nhất GAP-001 / L-03** |
| 5   | Quay lại đăng nhập      | Liên kết / nút | Về màn hình đăng nhập                                                                                                                | **Khi nhấn:** chuyển **L-01**                                                                                                                                                                                             | -                                                                        | -                                                                  |
| 6   | Vùng hiển thị thông báo | Văn bản (động) | Nơi hiển thị thông tin lỗi thông tin đã nhập của form                                                                                | Cập nhật khi có sự kiện                                                                                                                                                                                                   | -                                                                        | -                                                                  |


## 4. Hành động và chuyển màn hình


| Hành động              | Kích hoạt                                       | Nội dung xử lý                                                                                      | Màn hình đích                                      |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Hiển thị ban đầu       | Chuyển từ **L-03** sau khi gửi email thành công | Hiển thị nội dung hoàn tất, hướng dẫn 24 giờ / 1 phút, form trống hoặc giữ email theo thiết kế      | -                                                  |
| Yêu cầu gửi lại        | Nhấn **「送信する」**                                 | Cùng quy tắc nghiệp vụ **L-03** (gồm **khoảng cách tối thiểu 1 phút** giữa các lần gửi có hiệu lực) | Thành công: Hiển thị toast message: 再設定メールを再送しました。 |
| Về đăng nhập           | Nhấn liên kết quay lại đăng nhập                | -                                                                                                   | **L-01**                                           |
| Truy cập trực tiếp URL | Mở `/login/reset/requested`                     | Theo thiết kế phiên: điều hướng tới **L-01** nếu không đủ điều kiện phiên / token                   | **L-01**                                           |


---

**Lịch sử chỉnh sửa**


| Ngày | Phiên bản | Nội dung chỉnh sửa | Người phụ trách |
| ---- | --------- | ------------------ | --------------- |


