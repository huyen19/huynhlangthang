# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: **P-03**
- **Tên màn hình**: New Plan Create/新規企画作成
- **URL**: `/plan/new`
- **Mục đích**: Trang tạo plan mới hoặc trang import dữ liệu.

## 2. Bố cục màn hình

> [!NOTE]
> Tham khảo bố cục: `Requirement/画面一覧_image/P-03_新規企画作成.png`。

## 3. Danh sách phần tử UI

**No.1~5** hiển thị từ trước khi nhấn **Data Load/データ読み込み**. **No.6 trở đi** được hiển thị thêm sau khi nhấn, tùy theo kết quả（§3.2）。

### 3.1 Trước khi nhấn nút Data Load/データ読み込み

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Screen Title/画面タイトル | Text（tĩnh） | Tiêu đề của màn hình hiện tại | - | - | Văn bản hiển thị: **企画新規登録** |
| 2 | Upload Guide Text/アップロード案内文 | Text（tĩnh） | Câu hướng dẫn thao tác cho vùng upload | - | - | Nội dung kéo-thả v.v. theo **Figma** và wording khi implement |
| 3 | Template Download/テンプレートダウンロード | Button（link） | Tải **template Excel** | Khi click: DL file template do **server generate động** | - | Không chỉ file rỗng tĩnh. Phải là file **generate động** có phản ánh master **area/エリア** mới nhất và master **store pattern/店舗パターン（pattern/パターン）** |
| 4 | File Select/ファイル参照 | File input | Chỉ định file request（**xlsx**/**csv**） | Khi click: mở dialog chọn file của OS. Sau khi chọn xong: hiển thị tên file | **Extension**: **xlsx** hoặc **csv**. **Tối đa 30MB/file**. Nếu vượt quá: **MSG-035**（`D-00_Message definition.md`）. Cột/định dạng khác theo `BasicDesign/TOBE/DB` và rule vận hành | Nhãn nút trên màn hình: **「ファイル参照」**. Sau khi có preview, việc thay file theo Figma/requirement |
| 5 | Data Load/データ読み込み | Button | Phân tích/kiểm tra file（chưa phải đăng ký chính thức） | Khi click: chạy xử lý đọc. Thành công -> §3.2（2）thành công. Thất bại -> §3.2（2）thất bại | Nếu chưa chọn file thì không cho chạy hoặc hiển thị thông báo | Trong lúc xử lý phải chặn nhấn đúp |

### 3.2 Sau khi nhấn nút Data Load/データ読み込み

**（1）Các phần tử giống §3.1（vẫn tiếp tục hiển thị）**

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Screen Title/画面タイトル | Text（tĩnh） | Tiêu đề màn hình | - | - | Giống §3.1（**企画新規登録**） |
| 2 | Upload Guide Text/アップロード案内文 | Text（tĩnh） | Hướng dẫn vùng upload | - | - | Giống §3.1 |
| 3 | Template Download/テンプレートダウンロード | Button（link） | Template Excel **generate động** | Khi click: DL template | - | Giống §3.1 |
| 4 | File Select/ファイル参照 | File input | Chỉ định file request（**xlsx**/**csv**） | Khi click: dialog chọn file. Sau khi chọn xong: hiển thị tên file. Sau khi thay file: chạy lại **Data Load/データ読み込み** để re-validate | Như trên（giới hạn **30MB**・**MSG-035**） | Giống §3.1（nhãn nút「ファイル参照」） |
| 5 | Data Load/データ読み込み | Button | Đọc lại/kiểm tra lại | Khi click: phân tích lại. Thành công -> cập nhật preview, thất bại -> hiển thị danh sách lỗi | Nếu chưa chọn file thì không cho chạy v.v. | Giống §3.1. Trong lúc xử lý phải chặn nhấn đúp |

**（2）Các phần tử hiển thị thêm theo kết quả đọc**

#### Trường hợp đọc thành công（đi tới preview）

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 6 | Preview Display/プレビュー表示 | Table | Danh sách xác nhận dữ liệu sẽ import | Chỉ tham chiếu（read-only） | - | **Hiển thị sau khi Data Load thành công**（sau upload/đọc thành công chuyển sang preview）. Quy tắc dòng/cột/tổng số đưa lên preview theo **§5「Logic xử lý từ đọc file đến preview」** và **§5「Khi nhấn Data Load/データ読み込み」**. Ví dụ cột: **Area/エリア**, **Delivery Center/配送センター**（ID/tên）, **Pattern/パターン**, **概要**, **số lượng** v.v. Thứ tự/cấp mục dựa trên quan hệ **pattern > 概要**. Mục đích tính/hiển thị **tổng số** xem §5「Rule nghiệp vụ preview」. Bản gốc import theo vận hành dự kiến là bản đã loại trừ Tây Nhật［DNP］. Định nghĩa chính thức cột/kiểu/**tên logic** phải đồng nhất với **`BasicDesign/TOBE/DB`** |
| 7 | Delete This Plan/この企画を削除する | Button（footer trái） | Xóa plan đang preview（bản nháp/dữ liệu gắn với kết quả import） | Khi click: hiện dialog xác nhận rồi xử lý xóa. Thành công: chuyển sang **T-01 Plan List (TOP)/企画の一覧（TOP）**（hoặc đóng màn hình hiện tại theo spec） | - | **Sau khi Data Load thành công**, hiển thị ở **bên trái** cùng hàng với **Register/登録する**. Đối tượng xóa/văn bản xác nhận theo requirement. Trong lúc xử lý phải chặn nhấn đúp |
| 8 | Register/登録する | Button（footer phải） | Đăng ký chính thức plan theo nội dung preview | Khi click: xử lý đăng ký. Thành công: chuyển sang **P-01 Plan Detail (Work Status Check)/企画詳細（作業ステータス確認）**（đã cấp **plan ID/企画ID**） | Chỉ active khi preview hợp lệ | **Sau khi Data Load thành công**, hiển thị ở **bên phải** cùng hàng với **Delete This Plan/この企画を削除する**. Trong lúc xử lý phải chặn gửi lặp |

#### Trường hợp đọc thất bại（chỉ hiển thị lỗi）

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 9 | Error List/エラー一覧 | Table/List | Lỗi đọc/validate | Chỉ hiển thị | - | **Hiển thị sau khi đọc thất bại**. Bao gồm số dòng/mục/lý do v.v. Khi thành công thì ẩn hoặc rỗng |

- Khi đọc **thành công**: hiển thị **No.6・7・8**（preview/xóa/đăng ký）và ẩn **No.9**. Khi đọc **thất bại**: hiển thị **No.9** và ẩn **No.6・7・8**.

## 4. Hành động và chuyển màn hình

| Hành động | Trigger | Nội dung xử lý | Màn hình đích |
| --- | --- | --- | --- |
| Hiển thị ban đầu | Mở `/plan/new` | Hiển thị **Screen Title**（企画新規登録）・**Upload Guide Text**・template・**File Select/ファイル参照**・**Data Load/データ読み込み**. Preview・**Delete This Plan/この企画を削除する**・**Register/登録する**・Error List đều ẩn | - |
| Template DL | 「Template Download/テンプレートダウンロード」 | Lấy và tải template file | - |
| Data Load（thành công） | 「Data Load/データ読み込み」~ validate OK | Phân tích file, validate, lấy dữ liệu preview（quy trình theo **§5「Logic xử lý từ đọc file đến preview」**, validate/ngoại lệ theo **§5「Khi nhấn Data Load」**） | **Cùng màn hình**（§3.2（2）thành công, không đổi URL） |
| Data Load（thất bại） | 「Data Load/データ読み込み」~ validate NG | Hiển thị Error List, ẩn preview | Cùng màn hình（§3.2（2）thất bại） |
| Register thành công | Hoàn tất 「Register/登録する」 | Cấp **plan ID/企画ID** và đăng ký chính thức | **P-01 Plan Detail (Work Status Check)/企画詳細（作業ステータス確認）**（ví dụ path: `/plan/{{id}}`） |
| Delete Plan（sau khi đọc） | Hoàn tất 「Delete This Plan/この企画を削除する」 | Xóa dữ liệu plan đang preview | **T-01 Plan List (TOP)/企画の一覧（TOP）**（dialog/API theo requirement） |

## 5. Bổ sung

### Cách ghi tham chiếu DB（tên logic）

- Chuẩn của các data item là **`BasicDesign/TOBE/DB`**（`テーブル一覧.md` và các tài liệu DB cơ bản tương ứng）. Trong tài liệu đặc tả màn hình này chỉ ghi **thực thể logic.tên mục logic**, còn tên bảng/cột vật lý giao cho thiết kế DB chi tiết.

### Logic xử lý từ đọc file đến hiển thị preview

Sau khi nhấn **Data Load/データ読み込み**, hệ thống phân tích file request（**xlsx**/**csv**）và xây dựng dữ liệu preview theo các bước tổng quát bên dưới. Vị trí cột/cấu trúc sheet/các cell mô tả ngoài "資材名"/mức hạt lỗi khi phát sinh là **要確認**. Master tham chiếu ngoài **`BasicDesign/TOBE/DB`** còn gồm master logic tương ứng các màn hình **M-02**（area）, **M-04**（store pattern/pattern）, **M-06**（material）。

**Bước 1: Xác định dòng（判定 pattern）**  
Đọc cột **「資材名」** hoặc text mô tả trong dòng từ Excel request để判定 dòng đó thuộc **pattern/パターン** nào trong hệ thống. Logic判定 dùng **so khớp chuỗi hoàn toàn**（đồng nhất rule đối chiếu ở phần「Khi nhấn Data Load」）。

**Bước 2: Đối chiếu với pattern master/material master**  
Đối chiếu **資材名** v.v. lấy từ Excel với **pattern master** và **material master**. Dòng nào khớp pattern đã đăng ký thì gán **pattern code**（ví dụ **01**, **02**）và hiển thị pattern tương ứng ở **cột đầu** của preview table（tên hoặc code+tên theo **Figma**/**要確認**）。

**Bước 3: Lọc cột area（theo chiều ngang）**  
Duyệt các cột area theo chiều ngang trong request, đối chiếu area code tương ứng với **area master（M-02）**. Chỉ giữ lại các cột tương ứng area code **tồn tại trong master** cho cấu trúc preview（cột không có trong master thì loại bỏ）。

**Bước 4: Trích số lượng, tính lại tổng và hiển thị**  
Trong phạm vi dòng（pattern）và cột（area）được xác định hợp lệ bởi bước 1~3 và rule **đối chiếu delivery center ID** ở phần dưới, trích số lượng theo đơn vị set material v.v. Từ đó **tính lại tổng số** và phản ánh vào preview（cách hiển thị tổng trên màn hình và mục đích kiểm tra vận hành xem §5「Rule nghiệp vụ preview」）。

### Khi nhấn 「Data Load/データ読み込み」

Khi người dùng nhấn **Data Load/データ読み込み**, hệ thống đối chiếu nội dung **xlsx/csv** upload với dữ liệu **đã đăng ký** trong DB（master v.v.）để validate **tính hợp lệ của dữ liệu import**。

- **Kích thước file**: nếu file upload vượt **30MB**, không thực hiện đọc và hiển thị **MSG-035**（`D-00_Message definition.md`）。
- **Quy trình build preview**: sau khi phân tích file, các bước **判定 pattern・đối chiếu master・lọc cột area・trích số lượng・tính lại tổng** tuân theo §5「Logic xử lý từ đọc file đến preview」。
- **Đối chiếu delivery center ID**: xác nhận **delivery center ID/配送センターID** trên request có tồn tại trong **delivery center master** hay không. Chỉ dữ liệu được hệ thống xác nhận hợp lệ ở **cả area master và delivery center master** mới là đối tượng hiển thị preview và **đăng ký chính thức（import）**（áp dụng kết hợp với bước 3 lọc cột area）。Các dòng bị loại/lý do có thể hiển thị ở **Error List/エラー一覧**（chi tiết: **要確認**）。
- **Rule đối chiếu**: so sánh với master bằng **text hoàn toàn trùng khớp**（完全一致文字列）。

### Template Excel（generate động）

- File Excel tải bằng **「Template Download/テンプレートダウンロード」** không chỉ là file tĩnh cố định, mà là **file generate động** phản ánh nội dung mới nhất của **area master** và **store pattern（pattern）master** tại thời điểm generate（chi tiết dropdown/lựa chọn/cấu trúc sheet v.v. là **要確認**）。

### Luồng từ đọc đến đăng ký chính thức

1. Lấy template（tùy chọn）-> chọn request file bằng **File Select/ファイル参照** -> nhấn **Data Load/データ読み込み**。
2. Thành công: xác nhận vận hành tại **Preview Display/プレビュー表示**（số dòng/tổng v.v.）-> tại cuối màn hình chọn **Delete This Plan/この企画を削除する**（trái）hoặc **Register/登録する**（phải）。
3. Thất bại: kiểm tra/sửa theo **Error List/エラー一覧**, thay file hoặc sửa bản gốc rồi đọc lại。

**「Register/登録する」 chỉ khả dụng sau khi đọc thành công**. Việc chỉ chọn file ở **「File Select/ファイル参照」** sẽ chưa đăng ký chính thức（phải qua **Data Load -> preview -> Register**）。

### Khi nhấn 「Register/登録する」（phản ánh dữ liệu preview đã chốt vào DB）

Khi người dùng nhấn **Register/登録する**, hệ thống đăng ký dữ liệu vào các table bên dưới dựa trên nội dung import đã được chốt tại preview。  
Tham chiếu image Excel: [P-03_依頼書.png](https://git.hblab.vn/hb1/kre/1834_psms_design/-/blob/Branch_master/Requirement/%E7%94%BB%E9%9D%A2%E4%B8%80%E8%A6%A7_image/P-03_%E4%BE%9D%E9%A0%BC%E6%9B%B8.png?ref_type=heads)

#### 1. `t_plans`（plan header）

Giữ các thuộc tính chung của toàn bộ kế hoạch xuất hàng, trích từ vùng **header/basic information** của request Excel。

| Mục table（field） | Mục tương ứng trên Excel | Logic/mapping |
| --- | --- | --- |
| `title`（tên plan） | **企画名** | Trích từ cell tiêu đề hoặc vùng tương đương **【基本情報】** |
| `order_no`（Order No.） | **発注No.** | Trích từ vùng thông tin order/identifier trên header |
| `client_id` | **クライアント名** | Lấy chuỗi tên từ Excel, tra **`m_clients`**, set **client ID** tương ứng |
| `deployment_start` / `deployment_end` | **展開期間** | Trích ngày bắt đầu/ngày kết thúc từ vùng triển khai và lưu vào từng cột |
| `scheduled_ship_date` | **出荷予定日** | Trích từ thông tin ngày dự kiến xuất hàng |
| `scheduled_del_date` | **納品予定日** | Trích từ thông tin ngày dự kiến giao hàng |
| `status` | （hệ thống tự động） | Giá trị mặc định ngay sau đăng ký: **`UNPROCESSED`**（hiển thị nghiệp vụ: **未対応**） |

#### 2. `t_plan_materials`（liên kết plan - material/pattern）

Định nghĩa danh sách **material（pattern）** thuộc plan hiện tại. **`plan_id`** liên kết tới khóa chính của `t_plans` vừa được cấp số ở bước trước（trong bảng này lược bỏ）。

| Mục table（field） | Mục tương ứng trên Excel | Logic/mapping |
| --- | --- | --- |
| `material_id` | **資材名**（biểu diễn gồm tên/phiên bản） | Lấy từ dòng tương ứng trong **【販促物情報】**. Đối chiếu **hoàn toàn trùng khớp text** giữa tên material trên Excel và tên trong material master, rồi set `material_id` của dòng master khớp |

#### 3. `t_plan_stores`（liên kết plan - store/delivery center）

Không mapping 1-1 trực tiếp từ một cell cụ thể trên Excel. Dòng dữ liệu được tạo từ kết quả tra ngược/kết hợp theo **area** và master liên quan để xác định **store** và **delivery center**。

| Mục table（field） | Mục tương ứng trên Excel | Logic/mapping |
| --- | --- | --- |
| （đơn vị tạo dòng） | Kết quả từ **cột area** và liên kết master | Xác định **store**/**delivery center** từ **area code**, rồi đăng ký liên kết với `t_plans` |

#### 4. `t_plan_store_materials`（chi tiết số lượng, tương ứng ô lưới preview）

Chi tiết lõi lưu **số lượng kế hoạch** tương ứng với giao điểm **dòng（pattern）× cột（area）** trên preview table。

| Mục table（field） | Mục tương ứng trên Excel | Logic/mapping |
| --- | --- | --- |
| `quantity`（số lượng kế hoạch） | Giá trị số ở ô giao（cùng ý nghĩa với preview） | Đọc giá trị số từ tọa độ tương ứng trên Excel. Là **số lượng bao gồm dự phòng**, dùng giá trị sau khi đã tính lại và chỉ phản ánh các cột hợp lệ（đồng nhất với **bước 4** trong §5「Logic xử lý từ đọc file đến preview」） |

#### 5. `t_pallets`（thông tin pallet cho charter）

Khởi tạo cho client sử dụng **charter delivery/チャーター便**. Các khóa **`plan_id`・store/center liên quan** phải đồng nhất với kết quả đăng ký từ `t_plans` và `t_plan_stores`。

| Mục table（field） | Mục tương ứng trên Excel | Logic/mapping |
| --- | --- | --- |
| `plan_id` / `delivery_center_id` v.v. | （gián tiếp）kết quả từ `t_plans`・`t_plan_stores` | Tạo dòng pallet gắn với **plan** và **delivery center** đã đăng ký |
| `status` | （hệ thống tự động） | Mặc định: **`REGISTERED`** |

Điều kiện tạo record: chỉ tạo khi **`m_clients.use_pallet_label_print`** là **ON**（sử dụng in nhãn pallet）。

### Rule nghiệp vụ hiển thị preview

- **Tổng số**: hiển thị **tổng số đã tính lại** ở **bước 4** của §5「Logic xử lý từ đọc file đến preview」để vận hành có thể đối chiếu tính hợp lệ số lượng/số dòng.

### Quyền

- Giả định: **quản lý / hậu cần**。

### Tham chiếu

- **`D-00_Message definition.md`**: message và wording thông báo。

## 6. Lịch sử sửa đổi

| Ngày | Phiên bản | Nội dung sửa đổi | Người phụ trách |
| --- | --- | --- | --- |
| 2026-04-17 | 1.0 | Tạo mới | HieuNT1 |
