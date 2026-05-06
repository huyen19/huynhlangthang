# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: L-05
- **Tên màn hình**: Đặt lại mật khẩu / Thiết lập mật khẩu mới（パスワード再設定／パスワード再設定）
- **URL**: **`/login/reset/confirm?token=...`**
- **Mục đích**: Màn hình để người dùng **thiết lập và lưu mật khẩu mới** sau khi **nhấp liên kết trong email**（luồng từ **L-03** / **L-04**）. Thành công thì chuyển tới **L-06**（màn hoàn tất đổi mật khẩu）.
- **Phân loại**: **Xác thực（認証）**
- **Mật độ hiển thị (Density)**: **Compact**
- **Quyền truy cập**: Dành cho tài khoản có quyền **Quản lý（管理）** và **Hậu cần / Logistics（物流）**

## 2. Bố cục màn hình

Tham chiếu layout:

https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=174-3931&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1

- **UI chung**: Thương hiệu và nền thống nhất với `共通仕様.md` và nhóm màn hình đăng nhập **L-01**.

**Cấu trúc khối (từ trên xuống)**

1. **Tiêu đề / hướng dẫn**（tĩnh）: Nội dung tương ứng 「パスワードの再設定」và gợi ý nhập mật khẩu mới（theo Figma / chuỗi hệ thống）.
2. **Form** gồm:
   - Ô **Mật khẩu mới**（新しいパスワード）.
   - Ô **Nhập lại mật khẩu mới** để xác nhận（確認／再入力）.
   - Nút **「送信する」**（Gửi）.
3. **Vùng thông báo lỗi**（động）: Hiển thị lỗi kiểm tra tại chỗ（chữ đỏ dưới ô hoặc gần form — §5）.
4. Hai ô mật khẩu dùng **ẩn ký tự**（mask）khi nhập.

## 3. Danh sách phần tử UI

| No. | Tên phần tử            | Loại              | Mô tả                                              | Hành vi khi thao tác                                                                                                          | Quy tắc kiểm tra                                                                                                                                   | Ghi chú                |
| --- | ---------------------- | ----------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| 1   | Tiêu đề màn hình       | Văn bản (tĩnh)    | Tiêu đề kiểu 「パスワードの再設定」                | -                                                                                                                             | -                                                                                                                                                  | -                      |
| 2   | Câu hướng dẫn          | Văn bản (tĩnh)    | Gợi ý nhập mật khẩu mới theo chính sách            | -                                                                                                                             | -                                                                                                                                                  | -                      |
| 3   | Mật khẩu mới           | Ô nhập (password) | Nhập mật khẩu mới                                  | Trước khi kiểm tra/gửi: loại bỏ khoảng trắng đầu/cuối; **sau khi loại bỏ mà rỗng thì coi là chưa nhập**. Giữ giá trị khi sửa. | **Bắt buộc**（trống → **MSG-001**, tên mục là 「パスワード」）. Định dạng theo **§5.1**; không thỏa → **MSG-019**（`D-00`）.                       | Lưu DB chỉ bản **băm** |
| 4   | Nhập lại mật khẩu mới  | Ô nhập (password) | Xác nhận khớp với mật khẩu mới                     | Cùng quy tắc trim như ô 3.                                                                                                    | **Bắt buộc**（trống → **MSG-001**）. **Khớp hoàn toàn** với giá trị mật khẩu mới sau khi áp dụng cùng quy tắc chuẩn hóa. Không khớp → **MSG-007**. | Không lưu DB           |
| 5   | 「送信する」（Gửi）    | Nút               | Gửi form, cập nhật mật khẩu                        | **Khi nhấn:** chạy kiểm tra client; hợp lệ thì gọi API cập nhật mật khẩu（token kèm URL）.                                    | -                                                                                                                                                  | Màu primary            |
| 6   | Vùng lỗi từng ô / form | Văn bản (động)    | Thông báo lỗi định dạng / không khớp / token, v.v. | Cập nhật khi lỗi                                                                                                              | -                                                                                                                                                  | Màu **đỏ**（§5.3）     |

## 4. Hành động và chuyển màn hình

| Hành động        | Kích hoạt                  | Nội dung xử lý                                                                                                                                                                                              | Màn hình đích                                                                     |
| ---------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Hiển thị ban đầu | Mở URL có `token` từ email | Kiểm tra `token`（hợp lệ, chưa dùng, trong thời hạn — thống nhất BE）. Hiển thị form trống, xóa thông báo lỗi. Token không hợp lệ: hiển thị màn hình lỗi với nội dung： 再設定URLは有効期限が切れています。 | -                                                                                 |
| Gửi đặt mật khẩu | Nhấn **「送信する」**      | **FE / BE:** kiểm tra định dạng **§5.1**（lỗi → **MSG-019**）và **khớp hai ô**（§5.2）. Gửi API; thành công: vô hiệu hóa token / phiên cũ theo chính sách bảo mật.                                          | Thành công: **L-06**（パスワード再設定／パスワード変更完了）. Lỗi: ở lại **L-05** |

## 5. Bổ sung

### 5.1 Quy tắc định dạng mật khẩu mới（tối thiểu **12** ký tự; lỗi format → **MSG-019**）

- **Độ dài**: Mật khẩu mới phải **ít nhất 12 ký tự**.
- **Tập ký tự**: Dùng ký tự **half-width**（半角）— chữ cái, chữ số và ký tự đặc biệt định nghĩa bên dưới.
- **Phức hợp bắt buộc**: Mật khẩu phải **đồng thời** chứa:
  - ít nhất **một chữ hoa**（A–Z）,
  - ít nhất **một chữ thường**（a–z）,
  - ít nhất **một chữ số**（0–9）,
  - ít nhất **một ký tự đặc biệt**（@$!%\*?&）.

**Thông báo lỗi định dạng**（sai độ dài / thiếu loại ký tự / không đúng tập ký tự — hiển thị inline đỏ）: **`MSG-019`** — văn bản tiếng Nhật theo **`BasicDesign/TOBE/D-00_Message definition.md`**（đối chiếu đúng ký tự, kể cả dấu **。** cuối câu trong bảng tin nhắn）.

### 5.2 Kiểm tra trùng khớp（新パスワード再入力一致チェック）

- So khớp chuỗi sau khi áp dụng **cùng quy tắc chuẩn hóa**（trim đầu cuối; không tự ý thay đổi khác trừ khi spec thêm）giữa ô **Mật khẩu mới** và **Nhập lại mật khẩu mới**.
- Nếu **không khớp hoàn toàn**, hiển thị lỗi chữ đỏ:
  **Tham chiếu D-00**: `MSG-007`（L-05）hiện là 「パスワードが一致していません」

### 5.3 Hiển thị lỗi（định hướng UX）

- Lỗi **định dạng mật khẩu mới**（§5.1）: **MSG-019** — dưới ô **Mật khẩu mới** hoặc vùng thông báo form, **inline（đỏ）**.
- Lỗi **hai ô không khớp**（§5.2）: **MSG-007** — tương tự, inline（đỏ）.
- Lỗi **token**（hết hạn, đã dùng, không hợp lệ）: Dùng màn hình hiển thị lỗi chung của dự án, hiển thị message: **再設定URLは有効期限が切れています。**, thêm link quay lại **L-03**.

### 5.4 Token và bảo mật

- Token trên URL phải **dùng một lần** / có **thời hạn**（thống nhất với email **24 giờ** tại màn **L-03**）.
- Sau khi đổi mật khẩu thành công: **phải lưu mật khẩu vào DB dưới dạng hash**; vô hiệu phiên đăng nhập cũ.

---

**Lịch sử chỉnh sửa**

| Ngày | Phiên bản | Nội dung chỉnh sửa | Người phụ trách |
| ---- | --------- | ------------------ | --------------- |
