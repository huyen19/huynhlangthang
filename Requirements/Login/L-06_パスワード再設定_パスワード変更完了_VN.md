# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: L-06
- **Tên màn hình**: Đặt lại mật khẩu / Hoàn tất đổi mật khẩu（パスワード再設定／パスワード変更完了）
- **URL**: `**/login/reset/confirmed`**（theo bảng UI design L-06）
- **Phân loại**: **Xác thực（認証）**
- **Mục đích**:
  - Thông báo cho người dùng rằng **thiết lập lại mật khẩu mới đã hoàn tất thành công**（sau khi xử lý thành công tại **L-05**）.
  - Đóng vai trò **trạm trung chuyển** để người dùng **quay lại màn hình đăng nhập** và đăng nhập bằng **mật khẩu mới** vừa tạo.
- **Mật độ hiển thị (Density)**: **Compact**
- **Quyền truy cập**: Dành cho tài khoản có quyền **Quản lý（管理）** và **Hậu cần / Logistics（物流）**

## 2. Bố cục màn hình

[https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=174-3964&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1](https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=174-3964&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1)

- **UI chung**: Thương hiệu và nền thống nhất với `共通仕様.md` và nhóm màn hình đăng nhập **L-01**.
- Màn hình **tối giản**: chỉ gồm **khối tiêu đề + câu thông báo** và **một nút thao tác duy nhất**（không có biểu mẫu nhập liệu）.

**Cấu trúc khối（từ trên xuống）**

1. **Tiêu đề và câu thông báo**（văn bản tĩnh）:
  - 「パスワードを変更しました。パスワードの変更が完了しました。以下よりログインしてください。」
2. **Nút** **「Đăng nhập」**（ログイン）

## 3. Danh sách phần tử UI


| No. | Tên phần tử                      | Loại          | Mô tả                                                                  | Hành vi khi thao tác                  | Quy tắc kiểm tra | Ghi chú     |
| --- | -------------------------------- | ------------- | ---------------------------------------------------------------------- | ------------------------------------- | ---------------- | ----------- |
| 1   | Tiêu đề / câu thông báo hoàn tất | Văn bản（tĩnh） | Thông báo đã đổi mật khẩu xong và hướng dẫn đăng nhập lại（nội dung §2） | -                                     | -                | -           |
| 2   | 「Đăng nhập」（ログイン）                | Nút           | Chuyển về màn đăng nhập để đăng nhập bằng mật khẩu mới                 | **Khi nhấn:** điều hướng tới **L-01** | -                | Nút primary |


## 4. Hành động và chuyển màn hình


| Hành động        | Kích hoạt                                              | Nội dung xử lý                                                                    | Màn hình đích  |
| ---------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------- | -------------- |
| Hiển thị ban đầu | Chuyển từ **L-05** sau khi **đổi mật khẩu thành công** | Hiển thị đầy đủ tiêu đề / thông báo và nút **「Đăng nhập」**                        | -              |
| Đăng nhập        | Nhấn nút **「Đăng nhập」**                               | Điều hướng người dùng về màn hình đăng nhập ban đầu để đăng nhập với mật khẩu mới | **L-01**（ログイン） |


**Lịch sử chỉnh sửa**


| Ngày | Phiên bản | Nội dung chỉnh sửa | Người phụ trách |
| ---- | --------- | ------------------ | --------------- |


