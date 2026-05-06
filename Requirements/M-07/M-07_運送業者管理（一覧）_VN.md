# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: M-07
- **Tên màn hình**: Quản lý đơn vị vận chuyển / công ty vận tải（運送業者管理）— Danh sách（一覧）
- **URL (dự kiến)**: `/delivery`
- **Mục đích**: Quản lý dữ liệu **Master các công ty vận chuyển**（ví dụ Yamato, Sagawa, v.v.）. Dữ liệu — đặc biệt **mã vận đơn（送り状コード）** — dùng để **liên kết API** và **phát hành mã vận đơn tự động**. Thao tác **Thêm / Sửa / Xóa** thực hiện trên **Drawer**（軽量CRUD）— chi tiết **M-07-cud**.
- **Hình thức CRUD**: **軽量CRUD** — danh sách trên trang chính; CUD trên **Drawer** trượt từ mép màn hình（không chuyển sang URL form đầy trang）.
- **Mật độ hiển thị (Density)**: **Tiêu chuẩn (Standard)**
- **Quyền truy cập**: Chỉ tài khoản có vai trò **Quản lý（管理）**
- **Tổng quan**: **Bảng** danh sách, **nút Thêm** và **nút Sửa**（mở Drawer）, **phân trang**（mặc định **30** dòng/trang）. **Không** có **tìm kiếm / lọc（絞り込み）** và **không** có **sắp xếp cột（ソート）** — khác với nhiều màn Master khác.

## 2. Bố cục màn hình

https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=190-22546&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334

**Cấu trúc khối（từ trên xuống）**

1. **Tiêu đề màn hình**: Quản lý đơn vị vận chuyển / công ty vận tải — danh sách
2. **Thanh công cụ**: Nút **Thêm**（mở **M-07-cud** ở chế độ tạo mới）
3. **Bảng danh sách**: các cột theo mục 3; **không** có header sort; **không** có ô lọc phía trên bảng
4. **Phân trang**: mặc định **30** dòng/trang; hiển thị / ẩn widget phân trang tuân theo common
5. **Drawer（M-07-cud）**: trượt từ cạnh khi **Thêm** hoặc **Sửa**; route vẫn là `/delivery` và hỗ trợ deep link:
   - Thêm mới: `/delivery?drawer=deliveryCompany&mode=new`
   - Chỉnh sửa: `/delivery?drawer=deliveryCompany&mode=edit&id={delivery_company_id}`

## 3. Danh sách phần tử UI

| No. | Tên phần tử                       | Loại            | Mô tả                                                                               | Hành vi khi thao tác                                                             | Quy tắc kiểm tra | Ghi chú                                   |
| --- | --------------------------------- | --------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------- | ----------------------------------------- |
| 1   | Tiêu đề màn hình                  | Văn bản (tĩnh)  | Tiêu đề danh sách đơn vị vận chuyển                                                 | -                                                                                | -                | -                                         |
| 2   | Nút Thêm                          | Nút             | Mở Drawer đăng ký công ty vận chuyển（chế độ tạo mới）                              | **Khi nhấn:** mở **M-07-cud**（Drawer）; không rời `/delivery`                   | -                | -                                         |
| 3   | Bảng danh sách công ty vận chuyển | Bảng            | Các bản ghi **chưa xóa mềm**（`deleted_at IS NULL`）                                | -                                                                                | -                | Xem các cột con                           |
| 3-1 | Cột ID                            | Cột bảng        | Định danh hiển thị: `id`                                                            | **Không** bật sort                                                               | -                | -                                         |
| 3-2 | Cột tên công ty vận chuyển        | Cột bảng        | **企画名称**（ví dụ ヤマト運輸, 佐川急便）— map DB: `name`                           | **Không** bật sort                                                               | -                | -                                         |
| 3-3 | Cột mã vận đơn                    | Cột bảng        | **送り状コード**（ví dụ chuỗi số）— map DB: `waybill_code`                          | **Không** bật sort                                                               | -                | Dùng cho liên kết API / phát hành tự động |
| 3-4 | Nút Sửa                           | Nút (trên dòng) | Mở Drawer chỉnh sửa dòng hiện tại                                                   | **Khi nhấn:** mở **M-07-cud**（Drawer）kèm định danh bản ghi                     | -                | Nhãn JP: **編集**                         |
| 4   | Phân trang                        | Phân trang      | **30** bản ghi / trang mặc định                                                     | **Khi đổi trang:** tải dữ liệu trang tương ứng（**không** có sort/lọc để “giữ”） | -                | Theo common                               |

## 4. Hành động và chuyển màn hình

| Hành động        | Kích hoạt                                               | Nội dung xử lý                                                                                                          | Màn hình đích                        |
| ---------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Hiển thị ban đầu | Vào `/delivery`                                         | Tải **trang 1**; kích thước trang **30**; **không** áp dụng sort; **không** có filter; chỉ bản ghi `deleted_at IS NULL` | -                                    |
| Thêm             | Nhấn **Thêm**                                           | Mở Drawer trống / mặc định cho tạo mới                                                                                  | -（**M-07-cud** trên cùng màn hình） |
| Sửa              | Nhấn **Sửa** trên một dòng                              | Nạp dữ liệu dòng vào Drawer                                                                                             | -（**M-07-cud**）                    |
| Đóng Drawer      | Hủy / Lưu thành công / đóng Drawer（theo **M-07-cud**） | Đóng overlay; làm mới danh sách nếu có thay đổi dữ liệu                                                                 | -                                    |
| Phân trang       | Chọn trang / next / prev                                | Tải dữ liệu trang đích                                                                                                  | -                                    |

## 5. Bổ sung

### Sắp xếp và phân trang

- **Sort**: **không** có — không bật sort trên bất kỳ cột nào.
- **Phân trang**: **30** dòng/trang（mặc định）; việc cho phép đổi cỡ trang tuân theo common.

### Tìm kiếm / Lọc

- **Không có** khu vực tìm kiếm / lọc（絞り込みなし）.

### Dữ liệu nguồn và snapshot（bảng danh sách）

Bảng lưu trữ chính: **`m_delivery_companies`**（`BasicDesign/TOBE/DB/m_delivery_companies_DB基本設計.md`）.

| Cột hiển thị | Bảng                   | Cột DB（gợi ý）                               | Ghi chú                                                        |
| ------------ | ---------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| ID           | `m_delivery_companies` | `id`                                          |                                                                |
| Tên công ty  | `m_delivery_companies` | `name`                                        |                                                                |
| Mã vận đơn   | `m_delivery_companies` | `waybill_code`                                | Có thể NULL trên DB; UI có thể bắt buộc khi Lưu — **M-07-cud** |

### Quyền

| Thao tác                                        | Quản lý（管理） | Vai trò khác |
| ----------------------------------------------- | --------------- | ------------ |
| Truy cập `/delivery`, xem danh sách, phân trang | Có              | Không        |
| Thêm / Sửa / Xóa（qua Drawer **M-07-cud**）     | Có              | Không        |

### Xử lý lỗi và cách hiển thị

- **Lỗi tải danh sách / mạng**: toast（đỏ）hoặc theo **D-00_Message definition.md**.
- **Danh sách rỗng**: empty state theo guideline UI chung.

### Yêu cầu phi chức năng（hiệu năng）

- Mục tiêu tham khảo: tải một trang danh sách **dưới 3 giây**（quy mô do PM định）.

### Liên kết API / phát hành mã vận đơn

- Chi tiết contract API: tài liệu API / tích hợp（ví dụ **SATO社\_クレオ様連携データに関して\_260313.md**）— màn hình chỉ đảm bảo Master `waybill_code` / tên công ty đúng để BE dùng.

### Ràng buộc xóa（tham chiếu）

- Thao tác **xóa** thực hiện trên **M-07-cud**（không trên bảng danh sách）. Quy tắc nghiệp vụ: **không xóa được** nếu công ty vận chuyển đang là **đơn vị vận chuyển mặc định** của một **Client**, hoặc đang **gán** cho **giao kiện hàng / vận đơn** cụ thể — mô tả đầy đủ và xử lý lỗi: **`M-07-cud_運送会社（追加・編集・削除）_VN.md`** mục **「Ràng buộc xóa（運送業者）」**.

### GAP

- (Không còn GAP.)

---

## 6. 改訂履歴

| 日付 | バージョン | 改訂内容 | 担当者 |
| --- | --- | --- | --- |
| 2026-04-17 | 1.0 | 新規作成 | TungNT2 |
