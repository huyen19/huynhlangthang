# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: **P-05**
- **Tên màn hình**: Delivery Status/配送ステータス
- **URL**: `/plan/status`
- **Mục đích**: Màn hình xác nhận danh sách trạng thái giao hàng theo từng plan. Khi chuyển từ **P-01** hoặc **T-01**, màn hình hiển thị ở trạng thái đã được lọc theo plan tương ứng.

## 2. Bố cục màn hình

> [!NOTE]
> Tham khảo bố cục: `Requirement/画面一覧_image/P-05_配送ステータス.png`.

## 3. Danh sách phần tử UI

Số phần tử được đánh theo thứ tự: **§3.1 Filter/絞り込み**（No.1〜9）→ **§3.2 List Area/一覧部分**（No.10〜16）→ **§3.3 Row Detail (Accordion Expanded)/行詳細（アコーディオン展開時）**（No.17〜20）.

### 3.1 Filter/絞り込み

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Thông tin DB | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Filter Panel/絞り込みパネル | Vùng (form) | Vùng nhập điều kiện lọc | Sau khi nhập từng mục, thực hiện lọc để lấy lại danh sách | - | (Không áp dụng/UI container) | Nhiều điều kiện áp dụng theo AND |
| 2 | Waybill No/送り状No | Textbox | Lọc theo số vận đơn | - | Khớp một phần. Đánh giá sau khi loại bỏ khoảng trắng đầu/cuối | Đối tượng lọc: `出荷個口.送り状No` / `企画店舗配送.送り状No` | Số hiển thị là số vận đơn liên kết với hãng vận chuyển |
| 3 | Plan Name/企画名 | Textbox | Lọc theo tên plan | - | Khớp một phần. Đánh giá sau khi loại bỏ khoảng trắng đầu/cuối | Đối tượng lọc: `企画（ヘッダ）.企画名` | Khi chuyển từ P-01/T-01, giả định đặt sẵn điều kiện ban đầu theo tên plan tương ứng（要確認） |
| 4 | Destination Name/納品先名 | Selectbox | Lọc theo nơi giao (delivery center) | - | Chọn đơn | Đối tượng lọc: `配送センター.配送センター名`（khi chưa chỉ định thì dùng `エリア.エリア名`, mã chưa chỉ định center: `9999999999`（10 ký tự）） | Danh sách lựa chọn theo master delivery center |
| 5 | Planned Delivery Date/配達予定日 | Date picker | Lọc theo ngày dự kiến giao hàng | - | Định dạng ngày theo common spec | Đối tượng lọc: `企画店舗配送.配達予定日` | Điều kiện theo ngày đơn |
| 6 | Status/ステータス | Selectbox | Lọc theo trạng thái giao hàng | - | Chọn đơn | Đối tượng lọc: `企画店舗配送.配送ステータス`（giá trị phản ánh từ API） | Giá trị lấy từ API (ví dụ: 配達中、配達完了、遅延中, v.v.). Hệ giá trị cần xác nhận |
| 7 | Outer Box Serial No/外箱シリアルNo | Textbox | Lọc theo serial thùng ngoài | - | Khớp một phần. Đánh giá sau khi loại bỏ khoảng trắng đầu/cuối | Đối tượng lọc: `出荷個口.外箱シリアルNo` | Khi khớp thì hiển thị dòng con tương ứng + dòng cha（§5） |
| 8 | Material Serial No/資材シリアルNo | Textbox | Lọc theo serial material | - | Khớp một phần. Đánh giá sau khi loại bỏ khoảng trắng đầu/cuối | Đối tượng lọc: `出荷個口資材.資材シリアルNo` | Khi khớp thì hiển thị dòng con tương ứng + dòng cha（§5） |
| 9 | Filter/絞り込み | Nút | Thực thi lọc theo điều kiện nhập | **Khi click:** áp điều kiện để lấy lại danh sách | - | (Không áp dụng/UI action) | Chống click lặp khi đang xử lý |

### 3.2 List Area/一覧部分

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Thông tin DB | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 10 | Accordion Marker/アコーディオン印 | Vùng click (trong dòng) | Vùng thao tác đóng/mở hiển thị chi tiết của dòng cha | **Khi click cột:** chuyển đổi hiển thị accordion | - | (Không áp dụng/UI action) | Icon đầu dòng chỉ là hỗ trợ hiển thị. Hành vi tương đương click cột |
| 11 | Waybill No Column/送り状No列 | Cột bảng | Hiển thị số vận đơn | - | - | Hiển thị: `出荷個口.送り状No` / `企画店舗配送.送り状No` | Dữ liệu từ API hãng vận chuyển. Với charter hoặc trước khi phát hành số thì cho phép hiển thị 「該当なし」 |
| 12 | Destination Name Column/納品先名列 | Cột bảng | Hiển thị tên nơi giao (thông thường: tên delivery center) | - | - | Hiển thị: `配送センター.配送センター名`. Nếu mã chưa chỉ định là `9999999999` thì hiển thị `エリア.エリア名` | **Có thể sort**. Nếu mã chưa chỉ định center=`9999999999`（10 ký tự）thì hiển thị tên area (ví dụ: 関西、九州) |
| 13 | Destination Address Column/納品先住所列 | Cột bảng | Hiển thị địa chỉ nơi giao | - | - | Hiển thị: `配送センター.住所` | Hiển thị theo master địa chỉ |
| 14 | Package Count Column/個口列 | Cột bảng | Hiển thị số package | - | - | Hiển thị: `出荷個口.個口番号`（tổng hợp theo số lượng） | Dòng cha hiển thị tổng package, dòng con hiển thị chi tiết package |
| 15 | Planned Delivery Date Column/配達予定日列 | Cột bảng | Hiển thị ngày dự kiến giao hàng | - | - | Hiển thị: `企画店舗配送.配達予定日` | **Có thể sort** |
| 16 | Status Column/ステータス列 | Badge/Text | Hiển thị trạng thái giao hàng | - | - | Hiển thị: `企画店舗配送.配送ステータス`（giá trị phản ánh từ API） | Hiển thị theo giá trị API. Rule mapping label/màu sắc chưa được khách hàng chốt（要検討）. Trước khi phát hành số / charter thì hiển thị 「該当なし」. **Có thể sort** |

### 3.3 Row Detail (Accordion Expanded)/行詳細（アコーディオン展開時）

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Thông tin DB | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 17 | Package No/個口No | Text | Hiển thị số package | Hiển thị khi mở dòng cha | - | Hiển thị: `出荷個口.個口番号` | Ví dụ hiển thị: `[個口-01]` |
| 18 | Outer Box/外箱 | Text | Hiển thị serial thùng ngoài | Hiển thị khi mở dòng cha | - | Hiển thị: `出荷個口.外箱シリアルNo` | Ví dụ hiển thị: `012345678` |
| 19 | Material Count/資材数 | Text | Hiển thị số lượng material（tổng số material nằm trong package này） | Hiển thị khi mở dòng cha | Số nguyên >= 0 | Hiển thị: tổng số bản ghi của `出荷個口資材` | Ví dụ hiển thị: `86個` |
| 20 | Serial No/シリアルNo | Text (liệt kê) | Liệt kê serial No của material | Hiển thị khi mở dòng cha | Ký tự phân tách là `/` | Hiển thị: `出荷個口資材.資材シリアルNo` | Ví dụ hiển thị: `01234 / 01235 / 01236` |

## 4. Hành động và chuyển màn hình

| Hành động | Trigger | Nội dung xử lý | Màn hình đích |
| --- | --- | --- | --- |
| Hiển thị ban đầu | Mở `/plan/{{id}}/status` | Lấy và hiển thị danh sách giao hàng theo plan ID. Bộ lọc là giá trị ban đầu, accordion ở trạng thái đóng | - |
| Chuyển từ P-01 | Click nút trạng thái giao hàng ở **P-01** | Hiển thị ở trạng thái đã filter theo plan tương ứng | **P-05 配送ステータス** |
| Chuyển từ T-01 | Click cột trạng thái ở **T-01** | Hiển thị ở trạng thái đã filter theo plan tương ứng | **P-05 配送ステータス** |
| Lọc | Click nút Filter/絞り込み | Áp điều kiện theo AND và lấy lại danh sách | - |
| Mở/đóng dòng | Click cột của dòng cha | Hiển thị/ẩn chi tiết package（個口No、外箱、資材数、シリアルNo） | - |
| Sort | Thao tác header cột `納品先名` / `配達予定日` / `配送ステータス` | Sắp xếp tăng/giảm và hiển thị lại | - |

## 5. Bổ sung

### Quy cách lọc/tìm kiếm

- Điều kiện tìm kiếm được áp dụng theo **AND**.
- `外箱シリアルNo` / `資材シリアルNo` dùng **tìm kiếm khớp một phần**.
- Khi khớp theo serial, hiển thị **dòng con khớp và dòng cha của nó**.
- Kết quả khớp serial sẽ highlight vị trí tương ứng（#DFFF00）.

### Hiển thị trạng thái

- `配送ステータス` hiển thị theo giá trị lấy từ API giao hàng.
- Giá trị có thể khác nhau theo từng hãng vận chuyển（ví dụ: 遅延中、荷物受付、センター戻し）.
- Rule chuẩn hóa label hiển thị（mapping từ giá trị API gốc）và màu sắc hiện **chưa được khách hàng chốt（要検討）**.
- Trước khi phát hành số vận đơn hoặc với charter thì hiển thị `該当なし`.

### Sort/ソート

- Cột hỗ trợ sort: **納品先名**、**配達予定日**、**配送ステータス**.

### Quyền

- Giả định: **管理・物流**

### Tham chiếu

- `D-00_Message definition.md`（định nghĩa message）
- `P-01_企画詳細（作業ステータス確認）.md`（nguồn chuyển màn hình）
- `T-01_企画一覧.md`（nguồn chuyển màn hình）

### GAP/Điểm cần xác nhận

- **GAP-P05-001**: Chốt URL chính thức（`/plan/status` và `/plan/{{id}}/status`）.
- **GAP-P05-002**: Tập lựa chọn trạng thái, label hiển thị và quy tắc màu（chuẩn hóa giá trị API theo hãng vận chuyển）.
- **GAP-P05-003**: Quy định thứ tự sort mặc định và vòng lặp khi thao tác header.
- **GAP-P05-004**: Quy cách highlight khi tìm theo serial（cách nhấn mạnh dòng cha/dòng con）.

---

## 6. Lịch sử sửa đổi

| Ngày | Phiên bản | Nội dung sửa đổi | Người phụ trách |
| --- | --- | --- | --- |
| 2026-04-27 | 1.0 | Tạo mới | HieuNT1 |
