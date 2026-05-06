# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: M-02
- **Tên màn hình**: Quản lý thông tin khu vực (エリア) — Danh sách
- **URL (dự kiến)**: `/area`
- **Mục đích**: Quản lý (xem, thêm, sửa, xóa) thông tin **khu vực (エリア)** địa lý theo từng **khách hàng**. Thao tác thêm / sửa / xóa thực hiện trên cùng URL bằng **Drawer** (không chuyển màn) — **CRUD nhẹ**. Chi tiết xem **M-02-cud**.
- **Hình thức CRUD**: **CRUD nhẹ** (danh sách trên màn hình này; CUD trên Drawer)
- **Mật độ hiển thị (Density)**: **Tiêu chuẩn (Standard)**
- **Quyền truy cập**: Chỉ vai trò **Quản trị（管理）**
- **Tổng quan**: Bảng danh sách, nút thao tác (thêm / mở Drawer chỉnh sửa), phân trang, kèm **lọc (tìm kiếm)** và **sắp xếp**.

## 2. Bố cục màn hình

[https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=190-20442&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1](https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=190-20442&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1)

**Cấu trúc khối (từ trên xuống)**

1. **Tiêu đề màn hình**: Quản lý thông tin khu vực — Danh sách
2. **Khu lọc**
   - **ID khu vực**: ô nhập văn bản
   - **Tên khách hàng**: chọn từ dropdown (master khách hàng **M-01**)
   - **Tên trung tâm phân phối**: chọn từ pulldown (master trung tâm phân phối **M-03**; cách chọn phạm vi tương tự dropdown tên khách hàng)
   - **Tìm / Lọc** (có bố trí nút hay không tuân theo chuẩn UI dự án)
3. **Thanh công cụ**: **Thêm** (mở Drawer ở chế độ tạo mới = **M-02-cud**)
4. **Bảng danh sách**: Các cột theo mục 3. **Mọi cột đều cho phép sắp xếp** (icon sort trên tất cả cột, luôn hiển thị)
5. **Phân trang**: theo tài liệu **chung (common)** (mặc định **50** bản ghi/trang; có đổi kích thước trang hay không cũng theo common). **Chỉ hiển thị điều khiển phân trang từ trang thứ 2 trở đi**
6. **Drawer (M-02-cud)**: khi thêm hoặc chỉnh sửa, trượt vào từ phải (hoặc cạnh theo quy ước UI). Giữ route `/area`. Có thể mở thẳng Drawer bằng query (deep link):
   - Tạo mới: `/area?drawer=area&mode=new`
   - Sửa: `/area?drawer=area&mode=edit&id={area_id}`

## 3. Danh sách phần tử UI

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc kiểm tra | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Tiêu đề màn hình | Văn bản (tĩnh) | Tiêu đề màn hình danh sách | - | - | - |
| 2 | ID khu vực (lọc) | Ô nhập (text) | Lọc theo ID khu vực trên UI (DB: `m_areas.area_code`) | **Khi thay đổi:** giữ nội dung nhập. **Khi chạy tìm kiếm:** loại khoảng trắng đầu/cuối, tìm **khớp toàn bộ** chuỗi sau khi trim | Trước khi gửi: bỏ khoảng trắng đầu/cuối. Sau trim mà rỗng thì **không** áp dụng điều kiện này | - |
| 3 | Tên khách hàng (lọc) | Hộp chọn | Chọn từ master khách hàng **M-01**. **Loại bản ghi đã xóa logic**; trạng thái **tạm dừng** vẫn có trong danh sách chọn | **Khi thay đổi:** giữ lựa chọn | - | Rỗng = không lọc theo khách hàng |
| 4 | Tên trung tâm (lọc) | Hộp chọn | Chọn từ master trung tâm phân phối **M-03** (cách lấy phạm vi tương tự mục 3) | **Khi thay đổi:** giữ lựa chọn | - | Rỗng = không lọc theo trung tâm |
| 5 | Tìm / Lọc | Nút (hoặc tương đương) | Thực thi điều kiện lọc | **Khi nhấn:** gửi điều kiện lọc (có thể tự áp dụng theo chuẩn dự án) | - | Có bố trí theo chuẩn UI dự án |
| 6 | Thêm | Nút | Mở Drawer đăng ký khu vực mới | **Khi nhấn:** mở **M-02-cud** (Drawer) chế độ tạo mới (vẫn ở `/area`) | - | - |
| 7 | Bảng danh sách khu vực | Bảng | Hiển thị khu vực **chưa xóa logic** thỏa lọc (`deleted_at IS NULL`) | - | - | - |
| 7-1 | Cột ID khu vực | Cột bảng | Hiển thị `area_code` | **Khi nhấn header:** sắp xếp theo cột này (tăng / giảm / bỏ tùy chuẩn UI) | - | - |
| 7-2 | Cột tên khu vực | Cột bảng | Hiển thị `name` | **Khi nhấn header:** sắp xếp theo cột này | - | - |
| 7-3 | Cột tên khách hàng | Cột bảng | Tên khách hàng từ `m_clients` | **Khi nhấn header:** sắp xếp theo cột này | - | - |
| 7-4 | Sửa | Nút (trên dòng) | Chỉnh sửa dòng trên Drawer | **Khi nhấn:** mở **M-02-cud** (Drawer) ở chế độ sửa, nạp bản ghi tương ứng | - | Không chuyển màn hình toàn trang |
| 8 | Phân trang | Phân trang | Theo **chung (common)** (mặc định **50** bản ghi/trang; thay đổi kích thước theo common). **Chỉ hiển thị từ trang thứ 2** | **Khi đổi trang:** tải lại trang tương ứng, giữ lọc và sort | - | - |

## 4. Hành động và chuyển màn hình

| Hành động | Kích hoạt | Nội dung xử lý | Màn hình đích |
| --- | --- | --- | --- |
| Hiển thị ban đầu | Truy cập `/area` | Tải trang 1 (**cỡ trang** theo tài liệu common; mặc định **50** bản/trang). Sắp xếp mặc định: **ID khu vực (`area_code`) tăng dần**. Chưa áp dụng lọc (theo chuẩn dự án, lọc khi người dùng chạy tìm kiếm). Chỉ bản ghi `deleted_at IS NULL` | - |
| Lọc | Thực thi Tìm / Lọc | Điều kiện: ID (khớp toàn bộ), khách hàng, trung tâm — nối **AND**. Bỏ qua điều kiện chưa nhập (rỗng sau trim) / chưa chọn. Về trang 1 | - |
| Sắp xếp | Nhấn header cột bất kỳ | Cập nhật điều kiện sort, về trang 1 và tải lại | - |
| Thêm | Nhấn Thêm | Mở Drawer đăng ký mới | -（cùng màn hình **M-02-cud**） |
| Sửa | Nhấn Sửa trên dòng | Mở Drawer, hiển thị dữ liệu tương ứng | -（cùng màn hình **M-02-cud**） |
| Đóng Drawer | Hủy / Lưu thành công / Đóng (theo **M-02-cud**) | Đóng Drawer; nếu có thay đổi dữ liệu thì tải lại danh sách | - |
| Phân trang | Thao tác chọn trang | Tải lại trang đích, giữ lọc và sort | - |

## 5. Bổ sung

### Sắp xếp và phân trang

- **Sắp xếp mặc định khi vào màn hình**: **ID khu vực (`area_code`) tăng dần**
- **Sắp xếp**: **Mọi cột đều có thể sắp xếp** (icon sort hiển thị trên tất cả cột)
- **Cỡ trang / phân trang**: theo tài liệu **chung (common)** (mặc định **50** bản ghi/trang; chi tiết thay đổi theo common)
- **Hiển thị điều khiển phân trang**: từ **trang thứ 2** trở đi

### Tìm kiếm / Lọc

- **ID khu vực**: sau trim, khớp toàn bộ với `area_code`
- **Tên khách hàng**: chọn từ master (**loại bản ghi xóa logic**; trạng thái tạm dừng vẫn trong danh sách chọn)
- **Tên trung tâm**: chọn từ **M-03** (phạm vi chọn tương tự tên khách hàng ở trên)

### Dữ liệu nguồn và ảnh chụp màn hình dữ liệu (bảng danh sách)

Tham chiếu DB: `m_areas`（`BasicDesign/TOBE/DB/m_areas_DB基本設計.md`）

| Cột hiển thị | Bảng | Cột DB (ví dụ) | Ghi chú |
| --- | --- | --- | --- |
| ID khu vực | `m_areas` | `area_code` | ID hiển thị trên UI |
| Tên khu vực | `m_areas` | `name` | - |
| Tên khách hàng | `m_clients` | tên hiển thị | FK `client_id` |

### Chính sách xóa (tham chiếu)

- Không xóa từ màn danh sách. Xóa tại **M-02-cud** (Drawer) qua **hộp thoại xác nhận** rồi **xóa logic** — xem **`M-02-cud_エリア（追加・編集・削除）_VN.md`**

### Xử lý lỗi

- Lỗi tải danh sách / mạng: theo **D-00** hoặc chuẩn UI (ví dụ toast đỏ)
- Danh sách rỗng: trạng thái rỗng theo hướng dẫn UI chung

### Yêu cầu phi chức năng (hiệu năng)

- Mục tiêu tham khảo: tải một trang danh sách **dưới 3 giây** (quy mô do PM xác định)

### GAP (đối chiếu tài liệu chung)

- Bản dịch này theo mã nguồn **D-14 画面仕様書** (JP). Tài liệu **`共通仕様_vi.md`** quy định mặc định **30** bản ghi/trang; bản JP màn hình này nêu **50**. Cần thống nhất theo quyết định dự án (common / PM).

---

**Lịch sử phiên bản**

| Ngày | Phiên bản | Nội dung | Người phụ trách |
| --- | --- | --- | --- |
| 2026-04-24 | 1.0 | Tạo bản dịch từ D-14 画面仕様書 (M-02) — git HEAD; bổ sung hàng 5 (Tìm/Lọc); đối chiếu 共通仕様 về cỡ trang (GAP) | TungNT2 |

