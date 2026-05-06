# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: L-03
- **Tên màn hình**: Đặt lại mật khẩu（パスワードの再設定）
- **URL**: **`/login/reset`**
- **Mục đích**: Màn hình gửi yêu cầu: người dùng nhập **địa chỉ email** đã đăng ký, hệ thống gửi email chứa **URL dùng một lần** để **đặt lại mật khẩu** hoặc **thiết lập mật khẩu lần đầu**. Giả định **hai luồng nghiệp vụ** sau.
  1. **Quên mật khẩu**: Khi người dùng quên mật khẩu, tại màn hình này nhập địa chỉ email và gửi; hệ thống gửi email kèm liên kết đặt lại.
  2. **Thiết lập mật khẩu lần đầu**: Sau khi quản trị viên tạo người dùng mới (trạng thái **chưa có mật khẩu**), sẽ gửi mail thông báo trong đó có chứa url tới màn hình này để reset mật khẩu lần đầu trước khi login vào hệ thống.
- **Gửi lại email**: Với **cùng một tài khoản / địa chỉ email**, chỉ có thể **gửi lại** yêu cầu email đặt lại mật khẩu **sau mỗi 60 giây** kể từ lần gửi có hiệu lực trước (giới hạn tần suất phía server). Tại **L-04** chỉ hiển thị **sơ lược** thông tin về khoảng cách **60 giây** này; **không** hiển thị giới hạn **số lần trong 1 giờ**（**GAP-004**）.
- **Đối tượng vai trò**: Người dùng **quản lý（管理）** và **hậu cần / logistics（物流）**
- **Mật độ hiển thị**: **Compact**

## 2. Bố cục màn hình

Bố cục màn hình **theo Figma và hình List MH dưới đây**.
https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=174-3846&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1

- **UI chung**: Thương hiệu và nền thống nhất với `共通仕様.md` và nhóm màn hình đăng nhập **L-01**.

**Cấu trúc khối (từ trên xuống, tương ứng hình)**

1. **Header / thương hiệu**: Tiêu đề cố định (tên hệ thống, v.v.)
2. **Vùng hướng dẫn**（tùy chọn）: Mô tả ngắn về đặt lại mật khẩu và gửi email
3. **Form**: Ô **địa chỉ email**, vùng hiển thị thông báo
4. **Thao tác**: Nút **「送信する」**（gửi）

## 3. Danh sách phần tử UI

| No. | Tên phần tử             | Loại           | Mô tả                                                       | Hành vi khi thao tác                                                                                                                                                                                                                                                                | Quy tắc kiểm tra                                                                                | Ghi chú                                                           |
| --- | ----------------------- | -------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Tiêu đề hệ thống        | Văn bản (tĩnh) | Hiển thị tên sản phẩm                                       | -                                                                                                                                                                                                                                                                                   | -                                                                                               | -                                                                 |
| 2   | Câu hướng dẫn           | Văn bản (tĩnh) | Hướng dẫn đặt lại / thiết lập lần đầu qua email（tùy chọn） | -                                                                                                                                                                                                                                                                                   | -                                                                                               | -                                                                 |
| 3   | Địa chỉ email           | Ô nhập         | Nhập email đã đăng ký                                       | Trước khi gửi, loại bỏ khoảng trắng đầu/cuối; **sau khi loại bỏ mà rỗng thì coi là chưa nhập**                                                                                                                                                                                      | **Bắt buộc**（trống → **MSG-001**, tên mục là 「メールアドレス」）. **Định dạng email**（ví dụ `local-part@domain`): không chứa khoảng trắng, có đúng 1 ký tự `@`, phần domain có dấu `.` → **MSG-004** | Chi tiết mức strict của rule “email hợp lệ” nếu cần sẽ chốt theo BE/FE validate. |
| 4   | Vùng hiển thị thông báo | Văn bản (động) | Lỗi kiểm tra (validation), v.v.                             | Cập nhật khi có lỗi. Sau khi gửi thành công thì **chuyển sang L-04**                                                                                                                                                                                                                | -                                                                                               | -                                                                 |
| 5   | 「送信する」（Gửi）     | Nút            | Thực hiện yêu cầu gửi email                                 | **Khi nhấn:** sau kiểm tra bắt buộc và định dạng, gọi API xử lý gửi phía server.**Bất kể đã đăng ký hay chưa**, với người dùng vẫn là **luồng thành công**; sau khi vượt qua kiểm tra, **chuyển sang L-04 Hoàn tất gửi email đặt lại mật khẩu**（パスワード再設定/メール送信完了）. | -                                                                                               | Nút **vô hiệu** cho đến khi có **Địa chỉ email không còn trống**. |

## 4. Hành động và chuyển màn hình

| Hành động          | Kích hoạt                                                                                     | Nội dung xử lý                                                                                                                                                                                                                                                                                                                                                  | Màn hình đích                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Hiển thị ban đầu   | 「パスワードを忘れた方はこちら」trên **L-01** / liên kết trong email / truy cập trực tiếp URL | Địa chỉ email trống. Xóa vùng thông báo                                                                                                                                                                                                                                                                                                                         | -                                                                                               |
| Thay đổi nhập liệu | Người dùng sửa địa chỉ email                                                                  | Cập nhật kích hoạt / vô hiệu nút 「送信する」theo **GAP-001**                                                                                                                                                                                                                                                                                                   | -                                                                                               |
| Yêu cầu gửi email  | Nhấn 「送信する」                                                                             | **FE:** kiểm tra **bắt buộc** và **định dạng email**（theo quy tắc tại §3 No.3; lỗi định dạng → **MSG-004**）. **BE:** kiểm tra tồn tại địa chỉ email.**Chỉ khi tồn tại** mới thực sự gửi email; đồng thời phải thỏa **cooldown 60 giây** và **giới hạn số lần/giờ**（**GAP-004**）. Khi không tồn tại, hoặc khi vượt cooldown / hạn mức giờ, vẫn **xử lý như gửi thành công đối với người dùng**（§5 Bảo mật）. Kiểm toán: **GAP-002** | Coi là thành công: **L-04**（trên L-04 chỉ nhắc cooldown **60 giây**, không hiện hạn mức/giờ）. |

## 5. Bổ sung

### Bảo mật（chống dò địa chỉ email）

- Không để người dùng **suy ra đã đăng ký hay chưa** qua nội dung màn hình hay thông báo sau khi nhập email và nhấn 「送信する」.
- Với địa chỉ **chưa đăng ký**（hoặc không tồn tại trong hệ thống）: **thực tế không gửi email**, nhưng hiển thị **cùng chuyển màn hình hoàn tất như trường hợp đã đăng ký（L-04）**.

### Yêu cầu phi chức năng (hiệu năng)

- Thời gian phản hồi mục tiêu của API gửy: Mục tiêu **dưới 3 giây**.

### Nhật ký kiểm toán (audit log)

- Có ghi hay không và các mục đối với yêu cầu gửi: theo chính sách bảo mật.**GAP-002**

### Giới hạn gửi lại email（đã chốt）

- **Cooldown 60 giây**: Với cùng tài khoản / email, không cho phép gửi lại email đặt lại mật khẩu **trước khi đủ 60 giây** kể từ lần gửi có hiệu lực trước đó（đồng hồ phía server）.
- **Màn hình hoàn thành（L-04）**: Hiển thị **sơ lược** thông tin: chỉ có thể gửi lại sau mỗi **60 giây**（thời gian chờ còn lại hoặc câu cố định — thống nhất **L-04** / Figma）.**Không** hiển thị trên L-04 nội dung về **giới hạn số lần trong một giờ**（xem **GAP-004**）.

### Mẫu nội dung email（パスワード再設定）

- **Phạm vi**: Email gửi khi người dùng yêu cầu đặt lại mật khẩu qua luồng **L-03**（và cùng loại mail đặt lại mật khẩu nếu dùng chung template）. **Bản tiếng Nhật** dưới đây là nội dung chốt; `{{…}}` được thay khi gửi.

**件名（tiêu đề）**

```text
【重要】パスワード再設定のご案内
```

**本文**

```text
{{ユーザー名}} 様

パスワード再設定のご依頼を受け付けました。
下記URLより、パスワードの再設定を行ってください。

▼ パスワード再設定用URL
{{RESET_PASSWORD_URL}}
※有効期限：24時間

※本URLはセキュリティ保護のため、有効期限が設定されています。
※本メールにお心当たりがない場合は、本メールを破棄してください。

────────────────────────────
【ご注意】
・本メールは自動送信されています。
・本メールに記載されたURL以外からパスワードの再設定は行えません。
・パスワードは第三者に知られないよう、厳重に管理してください。
────────────────────────────
```

| Placeholder              | Ý nghĩa                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| `{{ユーザー名}}`         | user name                                                         |
| `{{RESET_PASSWORD_URL}}` | URL một lần để mở màn đặt lại mật khẩu（token: theo thiết kế BE） |

- **Thời hạn hiệu lực**: Theo văn bản mail là **24 giờ**（thống nhất với thời hạn token）; liên quan **GAP-003**（khi gửi lại mail, link trong mail trước có bị vô hiệu hay không）.

### GAP

- **GAP-001** — UX kích hoạt nút 「送信する」（ví dụ: vô hiệu cho đến khi định dạng email hợp lệ so với chỉ kiểm tra khi nhấn）.
- **GAP-002** — Nội dung ghi nhật ký kiểm toán（tiếp nhận yêu cầu, có bao gồm việc đã gửi email thực tế hay không）.
- **GAP-003** — Sau khi **gửi lại** email đặt lại mật khẩu cho một account, **liên kết trong email đặt lại trước đó có được giữ hiệu lực hay không**（hiện tại giả định cần ghi nhận: **link cũ không bị mất hiệu lực** khi có mail mới — cần xác nhận với BE / bảo mật và thống nhất với thời hạn token）.
- **GAP-004** — **Giới hạn tổng số lần gửi** email đặt lại mật khẩu trong **1 giờ**（phạm vi: theo **email / tài khoản** — chốt với BE）. **Tạm thời: 5 lần / 1 giờ**（có thể điều chỉnh sau khi vận hành）. Cách đếm（cửa sổ trượt, múi giờ）và xử lý khi vượt（vẫn không lộ đăng ký email）do BE / bảo mật quyết định. **Màn L-04** chỉ nhắc **cooldown 60 giây**; **không** hiển thị số lần tối đa mỗi giờ cho user.

---

**Lịch sử chỉnh sửa**

| Ngày | Phiên bản | Nội dung chỉnh sửa | Người phụ trách |
| ---- | --------- | ------------------ | --------------- |
| 2026/04/17 | 1.0 | Bổ sung validation định dạng email (MSG-004) cho ô Địa chỉ email | TungNT2 |
