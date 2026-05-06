# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: M-03-cud
- **Tên màn hình**: Trung tâm phân phối（配送センター）— Thêm / Sửa / Xóa（配送センター（追加・編集・削除））
- **URL (dự kiến)**: Màn hình **trang đầy đủ** có route riêng — **Tạo mới**: **`/center/new`**; **Chỉnh sửa**: **`/center/{{id}}/edit`**.
- **Mục đích**: Cho phép **tạo mới**, **chỉnh sửa**, **xóa mềm** bản ghi **Master trung tâm phân phối（配送センター）**; nhập địa chỉ, liên hệ; **tự động điền địa chỉ** theo mã bưu điện. **Không** dùng **Drawer**; luồng tương tự pattern **M-01-cud**（form trên URL riêng）.
- **Mật độ hiển thị (Density)**: **Tiêu chuẩn (Standard)**（đồng bộ **M-03**）
- **Quyền truy cập**: Chỉ tài khoản có vai trò **Quản lý（管理）**
- **Tổng quan**: **Form toàn trang**: **Tên trung tâm**, **Khách hàng（select）**, **Khu vực（select, phụ thuộc khách hàng）**, **ID trung tâm**, **Mã bưu điện**（+ **自動入力**）, **Tỉnh/Thành**, **Địa chỉ chi tiết**, **Số điện thoại**; **thanh thao tác**（cuối form hoặc cố định theo layout chung）: nút **Lưu（保存）**, **Hủy（キャンセル）**; **Xóa**（chỉ chế độ sửa）kèm **hộp thoại xác nhận（確認ダイアログ）** bắt buộc trước khi xóa.

## 2. Bố cục màn hình

https://www.figma.com/proto/fxs8HnfOQBD1fPpnIkvu63/FM?node-id=252-12539&t=rOyaQMQNr9ChwQqE-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=99%3A32334&show-proto-sidebar=1

**Cấu trúc khối màn hình**

1. **Tiêu đề / breadcrumb**: Ngữ cảnh **配送センター新規登録 Thêm mới** / **配送センター編集（ID=） Chỉnh sửa**; có thể có liên kết quay về **M-03**（`/center`）
2. **Form**
   - **Tên trung tâm（配送センター名）**: ô nhập text（`name`）
   - **Tên khách hàng（クライアント名）**: dropdown — nguồn **Master khách hàng（M-01 / `m_clients`）**; **không hiển thị** khách hàng **đã xóa mềm** hoặc **tạm dừng（停止）**
   - **Tên khu vực（エリア名）**: dropdown — **chỉ** các khu vực **thuộc（liên kết）** khách hàng đã chọn（`m_areas` với `client_id` trùng — tham chiếu **M-02**）
   - **ID trung tâm（配送センターID）**: ô nhập text — map DB **`center_code`**（半角英数字・**新規時のみ編集可**; **編集時は変更不可** — `m_distribution_centers_DB基本設計.md`）
   - **Mã bưu điện（郵便番号）**: bắt buộc; định dạng **`999-9999`**（**3 chữ số + dấu gạch ngang + 4 chữ số**）; có nút / sự kiện **自動入力**: sau khi nhập mã hợp lệ, hệ thống tra cứu và **tự động điền** thông tin địa chỉ（nguồn tra cứu: **要確認**）
   - **Tỉnh/Thành phố（都道府県）**: dropdown（danh mục tỉnh thành JP — **要確認** nguồn master）
   - **Địa chỉ chi tiết（住所）**: ô nhập text（`address`）
   - **Số điện thoại（電話番号）**: ô nhập text（`phone`、任意; quy tắc theo `共通仕様_vi.md`）
3. **Khu vực xóa（chỉ chế độ sửa）**: nút **Xóa（削除）**（**chỉ hiển thị** khi sửa bản ghi đã tồn tại）
4. **Thanh thao tác**: **Lưu（保存）**, **Hủy（キャンセル）**（đặt **cuối form**）

**Logic phụ thuộc khách hàng → khu vực**

- **Khi đổi khách hàng**: **reset** lựa chọn **Tên khu vực** ngay sau khi chọn khách hàng; nạp lại dropdown khu vực theo `client_id` mới; nếu khu vực cũ không còn trong danh sách thì xóa chọn.

## 3. Danh sách phần tử UI

| No. | Tên phần tử              | Loại                       | Mô tả                                                | Hành vi khi thao tác                                                                                                                                        | Quy tắc kiểm tra                                                                                            | Ghi chú                                                                                                                  |
| --- | ------------------------ | -------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | Tiêu đề màn hình         | Văn bản (tĩnh)             | Thêm mới / Chỉnh sửa trung tâm phân phối             | -                                                                                                                                                           | -                                                                                                           | -                                                                                                                        |
| 2   | Tên trung tâm            | Ô nhập (text)              | 配送センター名（`name`）                             | **Khi thay đổi:** giữ giá trị; **khi Lưu:** trim; sau trim rỗng → chưa nhập                                                                                 | **Bắt buộc**; độ dài **1–100** ký tự（sau trim）; cho phép **full-width / half-width** chữ và số; cho phép ký tự đặc biệt（đồng bộ quy tắc tên theo **M-01-cud** / **D-20**） | D-00                                                                                                                     |
| 3   | Tên khách hàng           | Dropdown                   | クライアント名 — master **M-01**                     | **Khi thay đổi:** **reset** lựa chọn khu vực; nạp lại danh sách khu vực theo khách hàng mới                                                                 | **Bắt buộc**                                                                                                | **Không hiển thị** khách hàng **đã xóa mềm** hoặc **tạm dừng（停止）**                                                    |
| 4   | Tên khu vực              | Dropdown                   | エリア名 — chỉ **m_areas** của **client_id** đã chọn | **Khi thay đổi:** giữ lựa chọn                                                                                                                              | **Bắt buộc**                                                                                                | Ràng buộc tham chiếu thống nhất DB（`area_id`）                                                                          |
| 5   | ID trung tâm             | Ô nhập (text)              | 配送センターID（`center_code`）                      | **Thêm mới:** cho nhập; **Sửa:** **read-only**（không đổi mã sau khi tạo）                                                                                  | **Bắt buộc**; tối đa **20**; **半角英数字**（DB設計）                                                       | **Unique** theo cặp（`client_id`, `center_code`）trong phạm vi bản ghi chưa xóa mềm — **要確認** với bản ghi đã 論理削除 |
| 6   | Mã bưu điện              | Ô nhập (formatted)         | 郵便番号（`postal_code`）                            | **Khi blur / nút 自動入力 / quy ước dự án:** gọi tra cứu; **tự động điền** tỉnh và địa chỉ（chi tiết ở mục 7）                                              | **Bắt buộc**; format **`999-9999`**; độ dài tối đa **10**（DB）                                             | -                                                                                                                        |
| 7   | Tự động điền（郵便番号） | Nút hoặc tích hợp vào blur | Kích hoạt tra cứu theo mã bưu điện                   | **Khi nhấn / kích hoạt:** validate format mã → gọi dịch vụ tra cứu; **auto-fill tất cả thông tin lấy được**（chi tiết ở mục 7）                             | -                                                                                                           | Nếu tra cứu thất bại: thông báo — **D-00**（xem `MSG-024`）                                                              |
| 8   | Tỉnh/Thành phố           | Dropdown                   | 都道府県（`prefecture`）                             | **Khi chọn:** giữ giá trị; có thể bị ghi đè bởi auto-fill（nếu tra cứu có tỉnh hợp lệ）                                                                      | **Bắt buộc**                                                                                                | Danh mục JP: **要確認** master nguồn（cố định / API）                                                                     |
| 9   | Địa chỉ chi tiết         | Ô nhập (text)              | 住所（`address`）                                    | **Khi thay đổi:** giữ giá trị; **khi Lưu:** trim                                                                                                            | **Bắt buộc**（theo DB設計）; tối đa **255**                                                                 | Có thể được bổ sung bởi auto-fill                                                                                        |
| 10  | Số điện thoại            | Ô nhập (text)              | 電話番号（`phone`）                                  | **Khi thay đổi:** giữ giá trị; trim                                                                                                                         | **Tùy chọn**; tối đa **20**; sau khi loại bỏ `+`, `-` và khoảng trắng: **10 hoặc 11 chữ số**, bắt đầu bằng **0**（`共通仕様_vi.md`） | -                                                                                                                        |
| 11  | Xóa                      | Nút（destructive）         | Chỉ chế độ **Sửa**（không hiển thị khi tạo mới）     | **Khi nhấn:** hiển thị **Hộp thoại xác nhận xóa**; chỉ khi xác nhận mới thực hiện **xóa mềm**                                                               | -                                                                                                           | `deleted_at`                                                                                                             |
| 12  | Lưu                      | Nút                        | 保存                                                 | **Khi nhấn:** validate → API create/update; thành công: toast và **quay về M-03**（`/center`）                                                              | -                                                                                                           | **楽観的ロック**（`updated_at` / `MSG-020`）                                                                              |
| 13  | Hủy                      | Nút                        | キャンセル                                           | **Khi nhấn:** **không** hiển thị hộp thoại xác nhận dù có chỉnh sửa chưa lưu; điều hướng về **M-03**（`/center`）                                           | -                                                                                                           | -                                                                                                                        |

### Hộp thoại xác nhận xóa（bắt buộc）

| Thao tác                | Nội dung hộp thoại（gợi ý）                                                                                                        | Nút                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Xóa trung tâm phân phối | 「Bạn có chắc muốn xóa trung tâm phân phối này không? Thao tác là **xóa mềm**; bản ghi sẽ không còn trên danh sách thông thường.」 | **Hủy** / **Xóa**（文言 chính thức: **D-00**） |

## 4. Hành động và chuyển màn hình

| Hành động                | Kích hoạt                                        | Nội dung xử lý                                                                                                              | Màn hình đích                                 |
| ------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Hiển thị ban đầu（Thêm） | Vào `/center/new`                                | Form trống / mặc định; `center_code` cho phép nhập                                                                          | -                                             |
| Hiển thị ban đầu（Sửa）  | Vào `/center/{{id}}/edit`                        | Nạp chi tiết theo `id`; `center_code` **read-only**; hiển thị nút **Xóa**（chỉ chế độ sửa）                                 | -                                             |
| Lưu（tạo mới）           | Nhấn **Lưu**                                     | Validate; insert `m_distribution_centers`; **thành công: quay về M-03** + hiển thị toast/info                               | **M-03** — `/center`                          |
| Lưu（cập nhật）          | Nhấn **Lưu**                                     | Validate; update; **楽観的ロック**; **thành công: quay về M-03** + hiển thị toast/info                                      | **M-03** — `/center`                          |
| Hủy                      | Nhấn **Hủy**                                     | **Không** hỏi xác nhận; quay **M-03**                                                                                       | **M-03** — `/center`                          |
| Xóa（xóa mềm）           | Nhấn **Xóa** → xác nhận trong **確認ダイアログ** | Set `deleted_at`; quay **M-03**; nếu còn **tham chiếu đang hiệu lực**（ví dụ `m_stores`）: từ chối — **D-00**               | **M-03** sau khi xóa thành công               |

## 5. Bổ sung

### Dữ liệu nguồn

- Bảng chính: **`m_distribution_centers`**（`BasicDesign/TOBE/DB/m_distribution_centers_DB基本設計.md`）.
- Dropdown khách hàng: **`m_clients`**（**M-01**）.
- Dropdown khu vực: **`m_areas`**（**M-02**）, lọc theo `client_id` đã chọn.

### Auto-fill địa chỉ theo 郵便番号（自動入力）

- Khi tra cứu **thành công**: **auto-fill tất cả thông tin lấy được**.
  - Trường **都道府県**（tỉnh/thành）: điền vào field **Tỉnh/Thành phố（都道府県）**.
  - Các thông tin địa chỉ còn lại（thành phố, quận/huyện, số nhà… tùy dữ liệu trả về）: **ghép chuỗi** và điền vào field **Địa chỉ chi tiết（住所）**.
- Khi tra cứu **thất bại**（lỗi hệ thống / không tìm thấy / dịch vụ không khả dụng）: hiển thị **MSG-024**（D-00）.
- Nguồn tra cứu: **要確認**（xem **GAP-201**）.

### Ràng buộc duy nhất

- **`(client_id, center_code)`** unique trong phạm vi bản ghi **chưa xóa mềm**（index `uk_m_distribution_centers_client_center_code`）. Trùng → báo lỗi **MSG-010**（**D-00**; `{項目名}` = `配送センターID`）. Trùng với bản ghi **đã** xóa mềm: **要確認**（DB備考）.

### Ràng buộc tham chiếu `area_id` ↔ `client_id`

- `area_id` phải trỏ tới `m_areas` có **cùng** `client_id` với bản ghi Center（DB **補足**）. Vi phạm → lỗi server / validate.

### Ràng buộc xóa dữ liệu（Master Data — chung）

- **Không xóa được** nếu tồn tại **dữ liệu khác đang tham chiếu** tới bản ghi đích（`deleted_at IS NULL`）. Hệ thống **chặn** **xóa mềm**（論理削除）.
- **Thông báo lỗi**: **MSG-022**（**D-00**）`関連データが存在するため削除できません。`
- Với **配送センター**: hiển thị theo message trên (không xóa được do còn tham chiếu); phần **chi tiết tham chiếu**（nếu cần hiển thị）do BE/BA thống nhất.
- **Xác nhận trước khi xóa**: nhấn **Xóa** **không** thực thi ngay — luôn **確認ダイアログ** trước **xóa mềm**.

### Xóa mềm và tham chiếu（配送センター）

- **Trước khi xóa**: **bắt buộc** **確認ダイアログ**（yêu cầu nghiệp vụ）— xem **Ràng buộc xóa dữ liệu（Master Data — chung）**.
- **Xóa mềm**: `deleted_at`; không hiển thị trên **M-03** thông thường.
- **Tham chiếu đang hiệu lực — không cho xóa 配送センター** khi còn một trong các quan hệ sau:
  - **Khách hàng（`m_clients`） — 一か所**: khách hàng đang cấu hình **送り先設定＝一か所**（`destination_setting` tương ứng giá trị **一か所** — xem **D-20** / **M-01-cud**）và **Center** này được chọn làm **固定出荷先センター**（cột FK lưu ID center theo thiết kế **D-20** — **要確認** nếu tên cột chưa cố định trong bản DB tại repo）.
  - **店舗（`m_stores`）**: còn bản ghi **chưa xóa mềm** có `distribution_center_id` trỏ tới Center này（trung tâm phân phối mặc định / gán cho cửa hàng）.
- BE từ chối xóa; mã **D-00**.


### Cập nhật đồng thời（楽観的ロック）

- Khi **Lưu**, server kiểm tra `updated_at`. Xung đột: không ghi đè; trả lỗi; người dùng tải lại — **MSG-020**（**D-00**）.

### Quyền

| Thao tác                            | Quản lý（管理） | Vai trò khác |
| ----------------------------------- | --------------- | ------------ |
| Truy cập **M-03-cud**, Lưu, Xóa mềm | Có              | Không        |

### Xử lý lỗi và cách hiển thị

- **Validation**: dưới ô tương ứng, inline（đỏ）.
- **Xác nhận xóa**: dialog（cảnh báo / vàng theo guideline）.
- **Lỗi hệ thống / mạng / trùng / tham chiếu / auto-fill**: toast（đỏ）hoặc **D-00**.

### Nhật ký kiểm toán（audit log）

- Ghi **Lưu**（tạo/cập nhật）, **Xóa mềm**（người thực hiện, thời điểm, định danh bản ghi）theo **common-document** khi dự án có đặc tả.

### GAP

- **GAP-201** — Nguồn tra cứu 郵便番号（API nội bộ / bên thứ ba）.
- **GAP-202** — Master 都道府県（danh sách cố định / API）.

---

## 6. 改訂履歴

| 日付 | バージョン | 改訂内容 | 担当者 |
| --- | --- | --- | --- |
| 2026-04-17 | 1.0 | 新規作成 | TungNT2 |
