# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: M-02-cud
- **Tên màn hình**: Khu vực（エリア）— Thêm / Sửa / Xóa（Drawer）（エリア（追加・編集・削除））
- **URL (dự kiến)**: Drawer nhúng trên **M-02**（`/area`） và hỗ trợ deep link:
  - Thêm mới: `/area?drawer=area&mode=new`
  - Chỉnh sửa: `/area?drawer=area&mode=edit&id={area_id}`
- **Mục đích**: Cho phép **tạo mới**, **chỉnh sửa**, **xóa mềm** bản ghi khu vực trong **Master khu vực** theo từng khách hàng; thao tác thực hiện trên **Drawer** trượt ngang（**軽量CRUD**）.
- **Mật độ hiển thị (Density)**: **Tiêu chuẩn (Standard)**（đồng bộ với **M-02**）
- **Quyền truy cập**: Chỉ tài khoản có vai trò **Quản lý（管理）**
- **Tổng quan**: Form trong Drawer gồm **Tên khu vực**, **ID khu vực**, **Tên khách hàng（select）**; cuối Drawer có **Lưu**, **Hủy**; **Xóa**（màu đỏ）kèm **hộp thoại xác nhận** trước khi **xóa mềm**.

## 2. Bố cục màn hình

[https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=190-20442&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1](https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=190-20442&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1)

**Cấu trúc khối trong Drawer**

1. **Tiêu đề Drawer**: phân biệt **エリア新規登録 Thêm mới** / **エリア編集（ID=）**
2. **Form**

- **Tên khu vực（エリア名）**: ô nhập text
- **ID khu vực（エリアID）**: ô nhập; **tập ký tự**: **半角英数字**（chữ và số half-width）— map DB: `area_code`; **chỉnh sửa ID sau khi tạo**: **không** cho phép — theo `m_areas` DB設計）
- **Tên khách hàng（クライアント名）**: **dropdown** nguồn **Master khách hàng（M-01 / `m_clients`）**; gán khu vực thuộc khách hàng nào

3. **Khu vực xóa（chỉ chế độ sửa）**: nút **Xóa（削除）** màu đỏ
4. **Thanh chân Drawer**: nút **Lưu（保存）**, **Hủy（キャンセル）**

## 3. Danh sách phần tử UI

| No. | Tên phần tử    | Loại                    | Mô tả                                                 | Hành vi khi thao tác                                                                                     | Quy tắc kiểm tra                                                                                               | Ghi chú                                                                           |
| --- | -------------- | ----------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 1   | Tiêu đề Drawer | Văn bản (tĩnh)          | Tiêu đề theo chế độ Thêm / Sửa                        | -                                                                                                        | -                                                                                                              | -                                                                                 |
| 2   | Tên khu vực    | Ô nhập (text)           | エリア名（`name`）                                    | **Khi thay đổi:** giữ giá trị; **khi Lưu:** trim đầu/cuối; sau trim rỗng → chưa nhập                     | **Bắt buộc**; độ dài tối đa **100** ký tự（theo `m_areas.name`）; **ký tự cho phép**: theo kiểm tra **Common** | -                                                                                 |
| 3   | ID khu vực     | Ô nhập (text / numeric) | エリアID（`area_code`）                               | **Khi mở Sửa:** **read-only**（không cho sửa ID đã tạo）; **Khi Thêm mới:** cho nhập                     | **Bắt buộc**; tối đa **20** ký tự（DB）; **半角英数字**（0–9, A–Z, a–z half-width）                            | **Unique** theo cặp（`client_id`, `area_code`）trong phạm vi bản ghi chưa xóa mềm |
| 4   | Tên khách hàng | Dropdown                | Danh sách khách hàng đã đăng ký **Master khách hàng** | **Khi thay đổi:** giữ lựa chọn                                                                           | **Bắt buộc**                                                                                                   | **Không** hiển thị khách **đã xóa mềm（削除済）**; **tạm dừng（停止）**           |
| 5   | Xóa            | Nút（đỏ / destructive） | Chỉ hiển thị ở chế độ **Sửa**（bản ghi đã tồn tại）   | **Khi nhấn:** hiển thị **Hộp thoại xác nhận xóa**; chỉ khi người dùng xác nhận mới gọi xử lý **xóa mềm** | -                                                                                                              | Xóa mềm: `deleted_at`                                                             |
| 6   | Lưu            | Nút                     | Ghi nhận tạo mới / cập nhật                           | **Khi nhấn:** validate → gọi API; thành công: đóng Drawer, làm mới **M-02**, toast **MSG-025**           | -                                                                                                              | **楽観的ロック**（`updated_at`）— xem bổ sung                                     |
| 7   | Hủy            | Nút                     | Đóng Drawer không lưu                                 | **Khi nhấn:** đóng Drawer（**không** xác nhận khi có chỉnh sửa chưa lưu）                                | -                                                                                                              | -                                                                                 |

### Hộp thoại xác nhận xóa（bắt buộc）

| Thao tác    | Nội dung hộp thoại                                                             | Nút                                   |
| ----------- | ------------------------------------------------------------------------------ | ------------------------------------- |
| Xóa khu vực | 「Tiêu đề: エリアの削除 Nội dung: 本当にこのエリアを削除してもよろしいですか？ | キャンセル **Hủy** / 削除する **Xóa** |

## 4. Hành động và chuyển màn hình

| Hành động         | Kích hoạt                               | Nội dung xử lý                                                                                                                                                                  | Màn hình đích |
| ----------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Mở Drawer（Thêm） | Từ **M-02** nhấn **Thêm**               | Form trống / mặc định; `area_code` cho phép nhập                                                                                                                                | -             |
| Mở Drawer（Sửa）  | Từ **M-02** nhấn **Sửa** trên một dòng  | Nạp chi tiết theo `id` bản ghi; `area_code` **read-only**                                                                                                                       | -             |
| Lưu（tạo mới）    | Nhấn **Lưu**                            | Validate; insert `m_areas`; đóng Drawer; refresh list                                                                                                                           | -             |
| Lưu（cập nhật）   | Nhấn **Lưu**                            | Validate; update; kiểm tra **楽観的ロック**; đóng Drawer; refresh                                                                                                               | -             |
| Hủy               | Nhấn **Hủy**                            | Đóng Drawer（không xác nhận）                                                                                                                                                   | -             |
| Xóa（xóa mềm）    | Nhấn **Xóa** → xác nhận trong hộp thoại | Cập nhật `deleted_at`; đóng Drawer; refresh **M-02**; nếu còn **配送センター** hoặc **店舗**（chưa xóa mềm）tham chiếu: báo lỗi, không xóa — **D-00**（thông báo chuẩn Master） | -             |

## 5. Bổ sung

### Dữ liệu nguồn

- Bảng chính: **`m_areas`**（`BasicDesign/TOBE/DB/m_areas_DB基本設計.md`）.
- Dropdown khách hàng: **`m_clients`**（Master **M-01**）.

### Ràng buộc duy nhất

- **`(client_id, area_code)`** unique trong phạm vi bản ghi **chưa xóa mềm**（index `uk_m_areas_client_area_code`）. Trùng → hiển thị: `指定されたエリアIDとクライアントの組み合わせは既に登録されています。`（**D-00**）.

### Ràng buộc xóa dữ liệu（Master Data — chung）

- **Không xóa được** nếu tồn tại **dữ liệu khác đang tham chiếu** tới bản ghi đích（`deleted_at IS NULL`）— **配送センター** và **店舗**. Hệ thống **chặn** thao tác **xóa mềm**（論理削除）.
- **Thông báo lỗi**: **MSG-022**（**D-00**）`関連データが存在するため削除できません。`
- **Xác nhận trước khi xóa**: nhấn **Xóa** **không** thực thi ngay — luôn hiển thị **確認ダイアログ**; chỉ sau khi người dùng xác nhận mới gọi API **xóa mềm**.

### Xóa mềm và tham chiếu（エリア）

- **Xóa mềm**: set `deleted_at`; bản ghi không hiển thị trên **M-02** thông thường.
- **Trước khi xóa**: **bắt buộc** hộp thoại xác nhận（yêu cầu nghiệp vụ）— xem **Ràng buộc xóa dữ liệu（Master Data — chung）**.
- **Tham chiếu đang hiệu lực — không cho xóa エリア** khi còn một trong các quan hệ sau:
  - **配送センター（`m_distribution_centers`）**: còn bản ghi **chưa xóa mềm** có `area_id` trỏ tới エリア này.
  - **店舗（`m_stores`）**: còn bản ghi **chưa xóa mềm** có `area_id` trỏ tới エリア này.
- BE từ chối xóa; hiển thị lỗi theo **D-00**（cùng họ thông báo “có dữ liệu liên quan” như ví dụ chung）.

### Cập nhật đồng thời（楽観的ロック）

- Khi **Lưu**, server kiểm tra phiên bản（`updated_at`）. Xung đột: không ghi đè; trả lỗi; người dùng tải lại — **MSG-020**（**D-00**）.

### Xử lý lỗi và cách hiển thị

- **Validation**: dưới ô tương ứng, inline（đỏ）.
- **Xác nhận xóa**: dialog（cảnh báo / vàng theo guideline）.
- **Lỗi hệ thống / mạng / trùng / tham chiếu**: toast（đỏ）hoặc theo **D-00**.

### Nhật ký kiểm toán（audit log）

- Ghi **Lưu**（tạo/cập nhật）, **Xóa mềm**（người thực hiện, thời điểm, định danh bản ghi）theo **common-document** khi dự án có đặc tả.

---

## 6. 改訂履歴

| 日付 | バージョン | 改訂内容 | 担当者 |
| --- | --- | --- | --- |
| 2026-04-17 | 1.0 | 新規作成 | TungNT2 |
