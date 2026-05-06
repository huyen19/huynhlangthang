# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: M-03
- **Tên màn hình**: Quản lý trung tâm phân phối（配送センター）— Danh sách（配送センター情報管理 — 一覧）
- **URL (dự kiến)**: `/center`
- **Mục đích**: Quản lý **Master trung tâm phân phối / trung tâm giao hàng（配送センター）**: **xem danh sách**, **thêm**, **sửa**, **xóa**（xóa mềm）. Dữ liệu tham chiếu cho các chức năng khác（ví dụ: **Cửa hàng（店舗）**, **企画**, **M-01-cud** nơi gửi một Center, v.v. — theo D-01 / dữ liệu liên quan）.
- **Hình thức CRUD**: **Danh sách（M-03）** và **màn hình form CUD riêng（M-03-cud）** — thao tác **Thêm / Sửa / Xóa** thực hiện trên **trang đầy đủ** có URL riêng（điều hướng từ danh sách）— **không** dùng Drawer. Chi tiết **M-03-cud**.
- **Mật độ hiển thị (Density)**: **Tiêu chuẩn (Standard)**
- **Quyền truy cập**: Chỉ tài khoản có vai trò **Quản lý（管理）**
- **Tổng quan**: **Bảng（Table）**, **nút**（**Thêm** / **Sửa** chuyển sang **M-03-cud**）, **phân trang（Pagination）**; **lọc / tìm kiếm（絞り込み）** và **sắp xếp（Sort）**.

## 2. Bố cục màn hình

https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=190-21494&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1

**Cấu trúc khối（từ trên xuống）**

1. **Tiêu đề màn hình**: Quản lý trung tâm phân phối（配送センター）— danh sách
2. **Khu vực lọc / tìm kiếm（絞り込み）**
   - **ID trung tâm（センターID）**: ô nhập **văn bản**（map theo **`center_code`** trong **`m_distribution_centers`**）.
   - **Tên khách hàng（クライアント名）**: chọn từ **dropdown**（Master khách hàng **M-01** / `m_clients`）.
   - **Tên khu vực（エリア名）**: chọn từ **dropdown**（Master khu vực **M-02** / `m_areas`）— khi đã chọn khách hàng, danh sách được **thu hẹp theo khách hàng**; khi chưa chọn khách hàng thì hiển thị theo danh sách cho phép của master.
   - **Tên trung tâm（配送センター名 / センター名）**: chọn từ **dropdown**（Master trung tâm `m_distribution_centers`）— khi đã chọn khách hàng, danh sách được **thu hẹp theo khách hàng**; khi chưa chọn khách hàng thì hiển thị theo danh sách cho phép của master.
   - Nút **Tìm / Lọc** theo chuẩn UI chung.
3. **Thanh công cụ**: Nút **Thêm**（điều hướng tới **M-03-cud** chế độ tạo mới — URL **`/center/new`**）
4. **Bảng danh sách**: các cột hiển thị theo mục 3; **chỉ cho phép sắp xếp theo 3 cột**: **センターID / クライアントID / エリア名**（chỉ các cột này hiển thị icon sắp xếp）
5. **Phân trang**: cho phép chọn số lượng hiển thị mỗi trang **15 / 30 / 50**（mặc định **30**）; **hiển thị điều khiển phân trang từ trang thứ 2 trở đi**

**Không có**: panel **Drawer** cho CUD trên cùng URL `/center`（CUD dùng **màn hình riêng** **M-03-cud**）.

## 3. Danh sách phần tử UI

| No. | Tên phần tử                 | Loại            | Mô tả                                                                                                                          | Hành vi khi thao tác                                                                                                                                               | Quy tắc kiểm tra                                               | Ghi chú                                                           |
| --- | --------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Tiêu đề màn hình            | Văn bản (tĩnh)  | Tiêu đề danh sách trung tâm phân phối                                                                                          | -                                                                                                                                                                  | -                                                              | -                                                                 |
| 2   | Ô lọc ID trung tâm          | Ô nhập (text)   | Lọc theo **センターID** hiển thị trên UI（thường là `center_code`）                                                            | **Khi thay đổi:** giữ cục bộ; **khi áp dụng lọc:** gửi điều kiện（quy tắc khớp chuỗi theo chuẩn dự án, áp dụng **khớp một phần / contains**）                      | Trim đầu/cuối; sau trim rỗng → **không** áp dụng điều kiện này | Không nhầm với “ID khu vực”; theo yêu cầu UI là **ID trung tâm**  |
| 3   | Dropdown lọc tên khách hàng | Dropdown        | Danh sách từ **Master khách hàng（M-01）**; loại trừ bản ghi không chọn được（chỉ **ẩn bản ghi đã xóa**; không ẩn “tạm dừng”） | **Khi thay đổi:** giữ lựa chọn; **thu hẹp** danh sách dropdown phụ thuộc（khu vực / trung tâm） theo khách hàng; có thể reset giá trị đã chọn nếu không còn hợp lệ | -                                                              | Giá trị rỗng = không lọc theo khách hàng                          |
| 4   | Dropdown lọc tên khu vực    | Dropdown        | **エリア名**（join `m_areas`）; **không hiển thị** bản ghi **đã xóa mềm**; **hiển thị** bản ghi **tạm dừng**（停止）           | **Khi thay đổi:** giữ lựa chọn; kết hợp lọc AND với các điều kiện khác                                                                                             | -                                                              | Khi đã chọn khách hàng: dropdown được **thu hẹp theo khách hàng** |
| 5   | Dropdown lọc tên trung tâm  | Dropdown        | Tên trung tâm（`m_distribution_centers.name`）; **không hiển thị** bản ghi **đã xóa mềm**; **hiển thị** bản ghi **tạm dừng**（停止） | **Khi thay đổi:** giữ lựa chọn; kết hợp lọc AND với các điều kiện khác                                                                                             | -                                                              | Khi đã chọn khách hàng: dropdown được **thu hẹp theo khách hàng** |
| 6   | Nút Tìm / Lọc               | Nút             | Áp dụng điều kiện lọc                                                                                                          | **Khi nhấn:** tải lại danh sách theo điều kiện; **reset về trang 1**                                                                                               | -                                                              | -                                                                 |
| 8   | Nút Thêm                    | Nút             | Chuyển sang màn hình tạo mới                                                                                                   | **Khi nhấn:** điều hướng tới **M-03-cud**（URL **`/center/new`**）                                                                                                 | -                                                              | -                                                                 |
| 9   | Bảng danh sách trung tâm    | Bảng            | Bản ghi **chưa xóa mềm**（`deleted_at IS NULL`）thỏa điều kiện lọc                                                             | -                                                                                                                                                                  | -                                                              | Xem các cột con                                                   |
| 9-1 | Cột ID trung tâm            | Cột bảng        | **センターID**（hiển thị `center_code`）                                                                                       | **Khi nhấn header:** bật/tắt hoặc đổi chiều **sort** theo cột này                                                                                                  | -                                                              |                                                                   |
| 9-2 | Cột ID khách hàng           | Cột bảng        | **クライアントID**（join `m_clients`）                                                                                         | **Khi nhấn header:** sort theo **クライアントID**                                                                                                                  | -                                                              |                                                                   |
| 9-3 | Cột tên khách hàng          | Cột bảng        | **クライアント名**（join `m_clients`）                                                                                         | **Không hỗ trợ sắp xếp**（không hiển thị icon sort trên header）                                                                                                   | -                                                              |                                                                   |
| 9-4 | Cột tên khu vực             | Cột bảng        | **エリア名**（join `m_areas`）                                                                                                 | **Khi nhấn header:** sort theo **tên khu vực（エリア名）**                                                                                                         | -                                                              |                                                                   |
| 9-5 | Cột tên trung tâm           | Cột bảng        | Tên trung tâm（`name`）                                                                                                        | **Không hỗ trợ sắp xếp**（không hiển thị icon sort trên header）                                                                                                   | -                                                              |                                                                   |
| 9-6 | Nút Sửa                     | Nút (trên dòng) | Chuyển sang màn hình chỉnh sửa                                                                                                 | **Khi nhấn:** điều hướng tới **M-03-cud** kèm `id` bản ghi（URL **`/center/{{id}}/edit`**）                                                                        | -                                                              | -                                                                 |
| 10  | Phân trang                  | Phân trang      | Chuyển trang, đổi cỡ trang（**15 / 30 / 50**, mặc định **30**）. **Chỉ hiển thị điều khiển phân trang từ trang thứ 2 trở đi** | **Khi đổi trang / cỡ trang:** tải dữ liệu; **giữ** lọc và sort                                                                                                     | -                                                              |                                                                   |

## 4. Hành động và chuyển màn hình

| Hành động         | Kích hoạt                                                                       | Nội dung xử lý                                                                                                                                                                       | Màn hình đích                            |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| Hiển thị ban đầu  | Vào `/center`                                                                   | Tải trang 1; **sort mặc định theo cột ID tăng dần**; kích thước trang mặc định **30**; chưa áp dụng lọc cho đến khi người dùng kích hoạt（theo chuẩn dự án）; chỉ `deleted_at IS NULL` | -                                        |
| Lọc / Tìm kiếm    | Nhấn nút áp dụng lọc                                                            | Gửi điều kiện **AND**: ID trung tâm（text）, khách hàng（select）, khu vực（select）, tên trung tâm（select）; **reset về trang 1**                                                  | -                                        |
| Sắp xếp           | Nhấn header một trong các cột **センターID / クライアントID / エリア名**        | Gửi yêu cầu sort; **về trang 1**                                                                                                                                                     | -                                        |
| Thêm              | Nhấn **Thêm**                                                                   | Điều hướng tới **M-03-cud**（tạo mới）                                                                                                                                               | **M-03-cud** — URL `/center/new`         |
| Sửa               | Nhấn **Sửa** trên một dòng                                                      | Điều hướng tới **M-03-cud**（sửa）kèm `id`                                                                                                                                           | **M-03-cud** — URL `/center/{{id}}/edit` |
| Quay danh sách    | Từ **M-03-cud**: **Hủy** / **Lưu** thành công / breadcrumb（theo **M-03-cud**） | Tải lại **M-03** nếu cần（sau khi có thay đổi dữ liệu）                                                                                                                              | **M-03** — URL `/center`                 |
| Phân trang        | Chọn trang / next / prev                                                        | Tải trang đích; **giữ** lọc và sort                                                                                                                                                  | -                                        |

## 5. Bổ sung

### Sắp xếp và phân trang

- **Sort**: **chỉ** cho phép sort theo **3 cột**: **センターID / クライアントID / エリア名**（các cột khác **không** hiển thị icon sort）.
- **Sort mặc định**: **ID trung tâm tăng dần**.
- **Khi đổi sort**: **về trang 1**.
- **Phân trang**: cho phép chọn số lượng hiển thị mỗi trang **15 / 30 / 50**（mặc định **30**）; **hiển thị điều khiển phân trang từ trang thứ 2 trở đi**.

### Tìm kiếm / Lọc

- **ID trung tâm**: nhập text（UI: センターID）.
- **Tên khách hàng**: select từ master khách hàng.
- **Tên khu vực**: select; ràng buộc với khách hàng（khi đã chọn khách hàng thì danh sách được thu hẹp theo khách hàng）.
- **Tên trung tâm**: select; ràng buộc với khách hàng（khi đã chọn khách hàng thì danh sách được thu hẹp theo khách hàng）.
- **Kết hợp điều kiện**: **AND** giữa các tiêu chí có giá trị.

### Dữ liệu nguồn và snapshot（bảng danh sách）

DB tham chiếu: **`m_distribution_centers`**（`BasicDesign/TOBE/DB/m_distribution_centers_DB基本設計.md`）.

| Cột hiển thị   | Bảng                     | Cột DB（gợi ý） | Ghi chú            |
| -------------- | ------------------------ | --------------- | ------------------ |
| ID trung tâm   | `m_distribution_centers` | `center_code`   | センターID trên UI |
| ID khách hàng  | `m_clients`              | mã/ID hiển thị  | FK `client_id`     |
| Tên khách hàng | `m_clients`              | tên hiển thị    | -                  |
| Tên khu vực    | `m_areas`                | tên hiển thị    | FK `area_id`       |
| Tên trung tâm  | `m_distribution_centers` | `name`          | -                  |
|                |

### Xóa

- **Xóa** không thực hiện trực tiếp trên bảng danh sách; thực hiện trên **màn hình M-03-cud** kèm **確認ダイアログ** và **xóa mềm** — xem **`M-03-cud_配送センター（追加・編集・削除）_VN.md`**（ràng buộc chung Master + không xóa nếu Center còn được **クライアント（一か所）** hoặc **店舗** tham chiếu）.

### Xử lý lỗi và cách hiển thị

- **Lỗi tải danh sách / mạng**: toast（đỏ）hoặc theo **D-00_Message definition.md**.
- **Danh sách rỗng**: empty state theo guideline UI chung.

### Điều khiển đồng thời（trên màn hình **M-03-cud**）

- Khi **hộp thoại xác nhận xóa** đang mở: không mở thêm dialog nghiệp vụ chồng lấn（pattern chung với các màn form có dialog）.

### Yêu cầu phi chức năng（hiệu năng）

- Mục tiêu tham khảo: tải một trang danh sách **dưới 3 giây**（quy mô tần suất PM xác định）.

---

## 6. 改訂履歴

| 日付 | バージョン | 改訂内容 | 担当者 |
| --- | --- | --- | --- |
| 2026-04-17 | 1.0 | 新規作成 | TungNT2 |
