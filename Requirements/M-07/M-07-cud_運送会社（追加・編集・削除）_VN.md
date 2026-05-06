# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: M-07-cud
- **Tên màn hình**: Công ty vận chuyển — Thêm / Sửa / Xóa（Drawer）（運送会社編集）
- **URL (dự kiến)**: Drawer nhúng trên **M-07**（`/delivery`） và hỗ trợ deep link:
  - Thêm mới: `/delivery?drawer=deliveryCompany&mode=new`
  - Chỉnh sửa: `/delivery?drawer=deliveryCompany&mode=edit&id={delivery_company_id}`
- **Mục đích**: Cho phép **tạo mới**, **cập nhật**, **xóa mềm** bản ghi trong **Master công ty vận chuyển**; thao tác trên **Drawer** trượt ngang. **Mã vận đơn（送り状コード）** phục vụ **liên kết API** và **phát hành mã vận đơn tự động**.
- **Mật độ hiển thị (Density)**: **Tiêu chuẩn (Standard)**（đồng bộ **M-07**）
- **Quyền truy cập**: Chỉ tài khoản có vai trò **Quản lý（管理）**
- **Tổng quan**: Form gồm **Tên công ty**, **Mã vận đơn**; **nút Xóa**（đỏ）chỉ ở chế độ sửa — **bắt buộc** **hộp thoại xác nhận** trước khi xóa mềm; cuối Drawer có **Lưu**, **Hủy**.

## 2. Bố cục màn hình

https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=190-22546&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334

**Cấu trúc khối trong Drawer**

1. **Tiêu đề Drawer**: phân biệt **運送会社新規登録 Thêm mới** / **運送会社編集 Chỉnh sửa**
2. **Form**
   - **Tên công ty（会社名）**: ô nhập **văn bản**（ví dụ ヤマト運輸）— map DB: `name`
   - **Mã vận đơn（送り状コード）**: ô nhập **văn bản**（ví dụ `000999000000`）— map DB: `waybill_code`
3. **Khu vực xóa（chỉ chế độ sửa）**: nút **Xóa（削除）** màu đỏ
4. **Thanh chân Drawer**（góc dưới）: nút **Lưu（保存）**, **Hủy（キャンセル）**

## 3. Danh sách phần tử UI

| No. | Tên phần tử    | Loại                    | Mô tả                          | Hành vi khi thao tác                                                                                          | Quy tắc kiểm tra                                                                                                                                        | Ghi chú                          |
| --- | -------------- | ----------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1   | Tiêu đề Drawer | Văn bản (tĩnh)          | Tiêu đề theo chế độ Thêm / Sửa | -                                                                                                             | -                                                                                                                                                       | -                                |
| 2   | Tên công ty    | Ô nhập (text)           | 会社名（`name`）               | **Khi thay đổi:** giữ giá trị; **khi Lưu:** trim đầu/cuối; sau trim rỗng → chưa nhập                          | **Bắt buộc**; độ dài tối đa **100** ký tự（theo DB hiện tại）; tập ký tự: cho phép **full-width**, **half-width**, **chữ**, **số** và **ký tự đặc biệt** theo quy ước chung（common） | -                                |
| 3   | Mã vận đơn     | Ô nhập (text)           | 送り状コード（`waybill_code`） | **Khi thay đổi:** giữ giá trị; **khi Lưu:** trim đầu/cuối                                                     | **Bắt buộc**; tối đa **64** ký tự（DB）; ký tự: **half-width số (0-9) בלבד**（chỉ cho phép chữ số half-width）                                        | Ví dụ: `000999000000`            |
| 4   | Xóa            | Nút（đỏ / destructive） | Chỉ hiển thị ở chế độ **Sửa**  | **Khi nhấn:** hiển thị **Hộp thoại xác nhận**; chỉ khi người dùng xác nhận mới gọi **xóa mềm**                | -                                                                                                                                                       | Xóa mềm: `deleted_at`            |
| 5   | Lưu            | Nút                     | Ghi nhận tạo mới / cập nhật    | **Khi nhấn:** validate → gọi API; thành công: đóng Drawer, làm mới **M-07**, thông báo（toast: **MSG-031**） | -                                                                                                                                                       | **楽観的ロック**（`updated_at`） |
| 6   | Hủy            | Nút                     | Đóng Drawer không lưu          | **Khi nhấn:** đóng Drawer（không hiển thị xác nhận thay đổi chưa lưu）                                        | -                                                                                                                                                       | -                                |

### Hộp thoại xác nhận xóa（bắt buộc）

| Thao tác               | Nội dung hộp thoại（gợi ý）                                                                                                       | Nút                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Xóa công ty vận chuyển | 「Bạn có chắc muốn xóa công ty vận chuyển này không? Thao tác là **xóa mềm**; dữ liệu sẽ không còn trên danh sách thông thường.」 | **Hủy** / **Xóa**（文言 thống nhất **D-00**） |

- Chuỗi chính thức: đăng ký trong **D-00_Message definition.md** khi có mã thông báo.

## 4. Hành động và chuyển màn hình

| Hành động         | Kích hoạt                               | Nội dung xử lý                                                                                                                                                                                                       | Màn hình đích |
| ----------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Mở Drawer（Thêm） | Từ **M-07** nhấn **Thêm**               | Form trống / mặc định                                                                                                                                                                                                | -             |
| Mở Drawer（Sửa）  | Từ **M-07** nhấn **Sửa** trên một dòng  | Nạp chi tiết theo định danh bản ghi                                                                                                                                                                                  | -             |
| Lưu（tạo mới）    | Nhấn **Lưu**                            | Validate; insert **`m_delivery_companies`**; đóng Drawer; refresh list                                                                                                                                               | -             |
| Lưu（cập nhật）   | Nhấn **Lưu**                            | Validate; update; **楽観的ロック**; đóng Drawer; refresh                                                                                                                                                             | -             |
| Hủy               | Nhấn **Hủy**                            | Đóng Drawer                                                                                                                                                                                                         | -             |
| Xóa（xóa mềm）    | Nhấn **Xóa** → xác nhận trong hộp thoại | Kiểm tra **ràng buộc xóa 運送業者**（mục **「Ràng buộc xóa（運送業者）」**）: nếu vi phạm → báo lỗi **D-00**, không cập nhật `deleted_at`; nếu thỏa điều kiện xóa: xóa mềm, ghi audit; đóng Drawer; refresh **M-07** | -             |

## 5. Bổ sung

### Dữ liệu nguồn

- Bảng chính: **`m_delivery_companies`**（`BasicDesign/TOBE/DB/m_delivery_companies_DB基本設計.md`）.
- Cột trên DB liên quan UI: `id`, `carrier_code`, `name`, `waybill_code`, `deleted_at`, `created_at`, `updated_at`.

### Ràng buộc duy nhất và mã định danh

- **`carrier_code`**: trên DB là **bắt buộc**, **duy nhất** trong phạm vi **bản ghi chưa xóa mềm**（tức `deleted_at IS NULL`）— cho phép **đăng ký lại** cùng mã sau khi bản ghi cũ đã xóa mềm.
- Trùng mã / vi phạm unique → báo lỗi **D-00**（mã cụ thể: **MSG-032**）.

### Ràng buộc xóa（運送業者）

**Không được phép xóa**（xóa mềm）bản ghi **Công ty vận chuyển（運送業者）** nếu thỏa **một trong các** điều kiện sau（tham chiếu **đang hiệu lực** tới `m_delivery_companies.id` hoặc khóa nghiệp vụ tương đương — chi tiết bảng con do D-20 / BE xác định）:

1. **Đơn vị vận chuyển mặc định của Client**: công ty này đang được thiết lập làm **đơn vị vận chuyển mặc định** cho **một Khách hàng（Client）**（ví dụ cấu hình trên **M-01-cud** / master khách hàng — map FK theo thiết kế DB）.
2. **Gán cho giao hàng / vận đơn cụ thể**: công ty này đang được **gán** để thực hiện giao **kiện hàng / vận đơn** cụ thể（ví dụ kế hoạch giao hàng, đơn vận, shipment line

Khi vi phạm: **không** cập nhật `deleted_at`; hiển thị thông báo lỗi nghiệp vụ theo **D-00**（mã cụ thể: **MSG-022**）.

### Xóa mềm và tham chiếu（削除・参照整合性）

- **Xóa mềm**（khi **không** thuộc các trường hợp trên）: set `deleted_at`（và `deleted_by` nếu có）; bản ghi không hiển thị trên **M-07** thông thường.
- **Trước khi xóa**: **bắt buộc** hộp thoại xác nhận（tránh thao tác nhầm）.
- Các ràng buộc **「đơn vị mặc định Client」** và **「gán giao hàng / vận đơn」** là **bắt buộc** đối với nghiệp vụ 運送業者.

### Cập nhật đồng thời（楽観的ロック）

- Khi **Lưu**, server kiểm tra phiên bản（`updated_at`）. Xung đột: không ghi đè; trả lỗi; người dùng tải lại — **D-00**（mã cụ thể: **MSG-033**）.

### Quyền

| Thao tác                | Quản lý（管理） | Vai trò khác |
| ----------------------- | --------------- | ------------ |
| Mở Drawer, Lưu, Xóa mềm | Có              | Không        |

### Xử lý lỗi và cách hiển thị

- **Validation**: dưới ô tương ứng, inline（đỏ）.
- **Xác nhận xóa**: dialog（cảnh báo theo guideline）.
- **Lỗi hệ thống / mạng / trùng / tham chiếu**: toast（đỏ）hoặc **D-00**.

### Nhật ký kiểm toán（audit）

- Ghi **Lưu**（tạo/cập nhật）, **Xóa mềm** — người thực hiện（`created_by`, `updated_by`, `deleted_by` khi schema có）, thời điểm, định danh bản ghi — theo **common-document** / đặc tả audit dự án.

---

## 6. 改訂履歴

| 日付 | バージョン | 改訂内容 | 担当者 |
| --- | --- | --- | --- |
| 2026-04-17 | 1.0 | 新規作成 | TungNT2 |
