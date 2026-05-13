# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: **P-01**
- **Tên màn hình**: Plan Detail (Work Status Check)/企画詳細（作業ステータス確認）
- **URL**: `/plan/{{id}}`（`{{id}}` là plan ID）
- **Mục đích**: Hiển thị thẻ theo từng Delivery Center/配送センター theo chiều dọc để xác nhận **số lượng giao hàng・số lượng theo pattern・trạng thái công việc**. **Trạng thái tiến độ công việc** tách định nghĩa theo **trường hợp dùng Charter Delivery/チャーター便** và **trường hợp dùng Delivery Company/運送会社**（chi tiết §3.3, tổng quan ở §3.2）. Từ thanh công cụ thực hiện **Mirror Data DL/鏡データDL**・**Material Label DL/資材ラベルDL**・**Picking List DL/ピッキングリストDL**. Density: **Dense**. Chuyển sang **P-02**（chi tiết theo center）, **P-04**（chỉnh sửa plan）, **P-05**（trạng thái giao hàng）.

## 2. Bố cục màn hình

> [!NOTE]
> Tham khảo bố cục: `Requirement/画面一覧_image/P-01_企画詳細、作業ステータス・配送ステータス確認.png`。

## 3. Danh sách phần tử UI

### 3.1 Plan Header/企画ヘッダ

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Plan Name/企画名 | Text（hiển thị） | Tên plan | - | - | **企画（ヘッダ）.企画名**（logic）※DB: `BasicDesign/TOBE/DB` |
| 2 | Plan No/企画No | Text（hiển thị） | **Plan No** theo nghiệp vụ（hiển thị phía trên màn hình） | - | - | **Đánh số tuần tự từ 1** |
| 3 | Client/クライアント | Text（hiển thị） | Tên client | - | - | **クライアント.クライアント名**（logic）※ như trên |
| 4 | Rollout Period/展開期間 | Text（hiển thị） | Thời gian thực hiện | - | - | **企画（ヘッダ）.展開期間**（từ ngày~đến ngày）※ như trên |
| 5 | Planned Ship Date/出荷予定日 | Text（hiển thị） | Dự kiến xuất hàng | - | - | **企画（ヘッダ）.出荷予定日** ※ như trên |
| 6 | Planned Delivery Date/納品予定日 | Text（hiển thị） | Dự kiến giao hàng | - | - | **企画（ヘッダ）.納品予定日** ※ như trên |
| 7 | Delivery Status/配送ステータス | Button | Trạng thái giao hàng tổng hợp | **Khi click:** chuyển tới màn hình **P-05 Delivery Status/配送ステータス**（`/plan/{{id}}/status` v.v. theo routing chuẩn） | - | **企画（ヘッダ）.配達ステータス** v.v. — **要確認** |
| 8 | Plan Edit/企画編集 | Button | Chỉnh sửa nội dung plan | **Khi click:** chuyển tới **P-04 Plan Edit/企画編集**（`/plan/{{id}}/edit` v.v. theo routing chuẩn） | - | Quyền: §5 |

### 3.2 Operation Toolbar/操作ツールバー

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 9 | Mirror Data DL/鏡データDL | Button | **Tải gộp** mirror data/data gương cho hiện trường/liên kết hệ dưới（§3.2「鏡データDL」） | **Khi click:** bắt đầu xử lý tạo dữ liệu. **Trong lúc tạo** hiển thị animation loading **「生成中」** và chặn nhấn đúp. Xử lý chạy **background**; **sau khi hoàn tất** thông báo + hiển thị trên màn hình（§5）. Sau đó lấy **zip tải gộp** | Phạm vi áp dụng/điều kiện phase: §5 | Khi **Regenerate**: vô hiệu code cũ, phát hành mới CSV/QR（§3.2・§5） |
| 10 | Material Label DL/資材ラベルDL | Button | Tải **label/ラベル** cho material/資材（CSV v.v.）và **QR duy nhất（PNG）** ở dạng **zip**（§3.2「資材ラベルDL」） | **Khi click:** thêm badge trạng thái **「準備中」**. Bắt đầu xử lý tạo dữ liệu. **Trong lúc tạo** hiển thị loading **「生成中」** và chặn nhấn đúp. Sau khi hoàn tất DL **zip**（giả định dùng cùng cách background/thông báo hoàn tất như Mirror Data DL — **要確認**） | Phạm vi áp dụng/điều kiện phase: §5 | Đặc tả file/cấu trúc ZIP/quy tắc đánh số: §3.2. Liên kết máy in: **要確認** |
| 11 | Picking List DL/ピッキングリストDL | Button | **Picking list** tải dạng **zip** với **định dạng Excel**（§3.2「ピッキングリストDL」） | **Khi click:** bắt đầu xử lý tạo dữ liệu. **Trong lúc tạo** hiển thị loading **「生成中」** và chặn nhấn đúp. Sau khi hoàn tất DL **zip**. Trường hợp không có dữ liệu: hiển thị message（**D-00**） | Phạm vi áp dụng/điều kiện phase: §5 | Tham chiếu format: **`BasicDesign/TOBE/SCREEN/P-01_ピッキングリスト.md`** |

---

#### Mirror Data DL/鏡データDL — UI tạo dữ liệu・background・DL gộp

- **Từ lúc click đến lúc hoàn tất**: trong trạng thái tạo dữ liệu hiển thị animation loading **「生成中」**（không cho nhấn đúp cùng nút）。
- **Thời điểm chạy/cách xử lý**: xử lý tạo dữ liệu chạy **background**; **sau khi hoàn tất** thông báo + hiển thị để báo người dùng. Sau đó cho phép **tải gộp**（chi tiết pattern UI theo component dùng chung）。

#### Mirror Data DL/鏡データDL — Chi tiết dữ liệu QR

**Đặc tả QR code（hình dung cấu thành phân tách bằng dấu phẩy）**

Mã phân loại（3 chữ số）＋ Plan No（X chữ số）＋  
Area code（X chữ số）＋ Delivery center code（X chữ số）＋  
Store code（X chữ số）＋ Pattern No（2 chữ số）＋  
Label loại（1 chữ số）＋ Serial No（6 chữ số）

- **Serial No**: đánh số có tiền tố alphabet theo dạng **`a00001` → `a999999` → `b000001`** …（giới hạn số lượng/chữ số: **要確認**）。
- **Kích thước**  
  - **Kích thước tạo ảnh QR**: **350 px**  
  - **Kích thước hiển thị khi in**: **30 mm vuông**

#### Mirror Data DL/鏡データDL — Logic xử lý dữ liệu

- Để phân biệt **mirror data/鏡データ** và **material label/資材ラベル**, **không cần** quy tắc đánh số tách riêng（dùng chung một chính sách đánh số/quản lý）。
- **Khi nhấn nút phát hành**: tự động cấp số duy nhất và lưu DB. Số thứ tự **không vượt qua plan khác**（quản lý duy nhất/tuần tự trong cùng plan, không dùng chung dải số giữa các plan — bảng vật lý: `BasicDesign/TOBE/DB`）。
- **Khi Regenerate/nhấn lại Mirror Data DL**: vô hiệu toàn bộ code cũ, phát hành lại CSV và QR mới（không tái sử dụng bộ cũ）。

#### Mirror Data DL/鏡データDL — Cấu trúc file và naming

**Root zip（ví dụ về nội dung gói tải gộp cuối cùng user nhận）**

- Gộp **29** artifacts（**28 CSV + 1 zip cho QR**）thành **1 zip tải gộp** để DL một lần.
- Phần **QR** là 1 zip chứa nhiều PNG（zip hóa theo cấu trúc thư mục bên dưới）。

**Cấu trúc thư mục/file（placeholder thống nhất khi implement）**

- Ví dụ tên root zip: `{{client-id}}_{{plan-id}}_{{フォルダ数など6桁}}.zip`  
  - `{{client-id}}`: định danh client, `{{plan-id}}`: định danh plan（ký hiệu theo requirement; tên key thực tế: **要確認**）。
- Bên trong zip: theo cấp **Area > Delivery Center > Pattern**, đặt **ảnh QR（PNG）** và **CSV tương ứng**.

**Quy tắc tên file QR（ví dụ）**

- `QR_{{client-id}}_{{plan-id}}_000001.png`  
- `QR_{{client-id}}_{{plan-id}}_000002.png`  
- … tăng tuần tự.

**Khi không có dữ liệu**

- Tạo `{{client-id}}_{{plan-id}}_000000.zip` và **không** chứa PNG. Giả định **có** file Excel（định nghĩa chính thức nội dung: **要確認**）。

#### Material Label DL/資材ラベルDL — UI（準備中・生成中）

- **Khi click**: thêm badge trạng thái **「準備中」**（vị trí theo Figma, ví dụ gần toolbar hoặc gần plan header）。
- **Trong lúc tạo**: hiển thị loading animation **「生成中」**（giống Mirror Data DL）。Sau khi hoàn tất cho phép DL zip.

#### Material Label DL/資材ラベルDL — Artifacts và gói zip

- **1)** Ảnh QR code（PNG）— tạo **duy nhất**  
- **2)** Dữ liệu material label — xuất **CSV**（hoặc **Excel**）  
- Gộp các nội dung trên vào **1 zip** để DL. Hình dung zip chứa **CSV + PNG**（có cấu trúc thư mục）。

#### Material Label DL/資材ラベルDL — Định dạng file và encoding

- **Định dạng file**: **Excel** hoặc **CSV**（bên áp dụng chọn: **要確認**/thống nhất theo vận hành）
- **Encoding**: **UTF-8**

#### Material Label DL/資材ラベルDL — Đánh số và serial（chung với mirror data）

- **Khi phát hành（click nút）**: tự động cấp số duy nhất và lưu DB（quản lý số thứ tự không vượt plan; logic/vật lý: `BasicDesign/TOBE/DB`）。
- Quy tắc biểu diễn **Serial No（6 chữ số）**: **`a00001` ～ `a999999` → `b000001` …**; dùng cùng hệ đánh số với Mirror Data DL.
- **Mirror data** và **material label** **không cần** tách quy tắc đánh số（đồng nhất với §3.2「鏡データDL — データ処理ロジック」）。

#### Material Label DL/資材ラベルDL — Cấu trúc ZIP và naming（giống mirror data）

- Trong zip: chứa **CSV** và **QR（PNG）**. Cấu trúc thư mục/quy tắc tên file **giống Mirror Data DL**（ví dụ `QR_{{client-id}}_{{plan-id}}_000001.png` — xem §3.2 phần naming）。
- Cấp thư mục: giống mirror data, gộp theo **area/center/pattern** thành nhiều folder, rồi nén thành **1 zip**.

#### Picking List DL/ピッキングリストDL

- **Picking list** xuất dạng **Excel**. Tạo file Excel theo đơn vị **area × delivery center × pattern**, gói theo cấp thư mục và DL thành **1 zip**.
- **Trong lúc tạo** hiển thị loading **「生成中」**. **Sau khi hoàn tất** lấy zip（UX tương tự Mirror Data/Material Label DL）。

**Ví dụ cấp thư mục trong zip**

◆ Trường hợp cài đặt M-01 client dùng center（「配送センターを使用する」）

```text
エリア関西/加古川配送センター/パターン01.xlsx
エリア関西/加古川配送センター/パターン02.xlsx
　　：
エリア東北/仙台配送センター/パターン01.xlsx
```

◆ Trường hợp cài đặt M-01 client không dùng center  
（「配送センターを使用しない（未使用コード9999999999（10桁））」）

```text
エリア関西/パターン01.xlsx
エリア関西/パターン02.xlsx
　　：
エリア東北/パターン01.xlsx
エリア東北/パターン02.xlsx
```

- Quy tắc hậu tố/zero-padding v.v.: **要確認**. Tên area/center/pattern theo logic master/plan detail.

### 3.3 Status Bar/ステータスバー

Đây là vùng trạng thái tiến độ hiển thị trong từng thẻ theo center（§3.4）。Khi **dùng delivery company** và **dùng charter** thì cột/trạng thái chuyển khác nhau. Vị trí và label trên layout theo Figma; bên dưới là tóm tắt hiển thị/thao tác theo API nhận được（đồng nhất với §3.2 phần trạng thái tiến độ）。

#### Trường hợp 1: Dùng delivery company/運送業者

**Cột trạng thái 1（tiến độ đếm）**

| Điều kiện chuyển | Nội dung |
| --- | --- |
| Ban đầu | **未着手** |
| Khi trigger QR được đọc và đã nhận API liên quan ít nhất một lần | **未着手** → **カウント中** |
| Khi đã nhận đủ API hoàn tất đếm cho **toàn bộ job**（**1 center × pattern**） | ① **カウント中** → **全件カウント完了**<br>② Bật nút **「送り状印刷」** để có thể nhấn |

**Nút 「送り状印刷」**

| Hạng mục | Nội dung |
| --- | --- |
| **Nhấn** | Gọi **API phát hành vận đơn**（**Yamato: 送り状発行 API**） |
| **Sau khi đã nhấn ít nhất 1 lần** | Đổi trạng thái hiển thị để biểu hiện đã từng nhấn. **Vẫn cho phép nhấn lại**（có cho phép gửi lại/phát hành lại hay không theo API/vận hành） |

**Cột trạng thái 3（kiểm đếm số lượng/liên kết vận đơn）**

| Điều kiện chuyển | Nội dung |
| --- | --- |
| Ban đầu | **数量検品前** |
| Khi trigger QR được đọc và đã nhận API liên quan ít nhất một lần | **数量検品前** → **数量検品中** |
| Khi nhận API xác nhận liên kết vận đơn đã hoàn tất toàn bộ（không lỗi） | **数量検品中** → **数量検品完了**; hiển thị **thời điểm ghi nhận** và **nhân sự kiểm đếm** |
| Khi nhận API báo phán định bất thường | Hiển thị **エラー** cùng **thời gian** và **nhân sự kiểm đếm** |

#### Trường hợp 2: Dùng charter/チャーター

**Cột trạng thái 1（tiến độ đếm）**

| Điều kiện chuyển | Nội dung |
| --- | --- |
| Khi trigger QR được đọc và đã nhận API liên quan ít nhất một lần | **未着手** → **カウント中** |
| **エラー** | Ở bất kỳ trạng thái chính nào, nếu nhận API báo lỗi thì hiển thị lỗi |
| Khi đã nhận đủ API hoàn tất đếm cho toàn bộ job（**1 center × pattern**） | Chuyển sang **全件カウント完了** |

**Cột trạng thái 2**

| Điều kiện chuyển | Nội dung |
| --- | --- |
| Khi trigger QR được đọc và đã nhận API liên quan ít nhất một lần | Chuyển sang **数量検品中** |

**Nút 「パレット数入力」**

| Hạng mục | Nội dung |
| --- | --- |
| **Nhấn** | Mở modal **Pallet Count Input/パレット数入力**. Tài liệu chuẩn: **`BasicDesign/TOBE/SCREEN/P-01_パレット数入力.md`**（tham khảo layout: `Requirement/画面一覧_image/Modal_パレット数入力.png`） |
| **Sau khi đã nhấn ít nhất 1 lần** | Đổi trạng thái hiển thị để biểu hiện đã từng nhấn. **Vẫn cho phép nhấn lại**（mở lại modal） |

---

### 3.4 Delivery Center List/配送センター別一覧

Danh sách có cấu trúc các thẻ theo từng delivery center xếp dọc（tham khảo layout: area tag, center name, **số lượng giao**, **trạng thái**, **grid theo pattern**, nút **詳細**）。Bên dưới liệt kê theo giả định **1 thẻ = 1 delivery center**。

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 12 | Delivery Center List/配送センター別一覧 | Vùng（list） | Hiển thị các thẻ theo đơn vị center, cuộn dọc | Thứ tự/sort: §5 | - | Dữ liệu xuất phát từ **Plan Detail/企画明細**・**Delivery Center/配送センター**（logic）※DB: `BasicDesign/TOBE/DB` |
| 13 | Area Tag/エリアタグ | Tag/Badge | Tên area（ví dụ **関西**） | - | - | Với dòng có **配送センターコード = `9999999999`（10 chữ số/chưa dùng）** thì không gắn area badge; thay vào đó hiển thị area name lớn（§3.4 bổ sung）。Các trường hợp khác dùng **Area/エリア**（logic） |
| 14 | Delivery Center Name/配送センター名 | Text（heading） | Tên center của thẻ hiện tại（ví dụ **加古川配送センター**） | - | - | **配送センター.配送センター名**（logic）. Điều kiện判定 theo **配送センターコード** xem §3.4 bổ sung |
| 15 | Detail/詳細 | Button | Mở màn hình chi tiết theo center của record đó | **Khi click:** chuyển sang **P-02 Plan Detail (By Center)/企画詳細（センターごと）**（`企画明細ID`/`配送センターID` theo routing chuẩn） | - | Văn bản nút cố định: **「詳細」** |
| 16 | Delivery Qty（Summary） | Text（hiển thị） | Hiển thị dạng **納品数：N**, là tổng số lượng giao dự kiến của center đó | - | - | Số lượng **bao gồm dự phòng** nhập từ phiếu yêu cầu; hiển thị tổng（hoặc theo định nghĩa tổng hợp tương ứng）。Chi tiết công thức: **要確認** |
| 18 | Work Status Display/作業ステータス表示 | Badge/Text | Hiển thị **trạng thái chính** và **nhóm phụ**（kiểm đếm số lượng/liên kết）của center đó | **Khi click:** có chuyển màn hình hay không: **要確認** | - | Theo định nghĩa riêng ở **§3.3 Status Bar/ステータスバー**（charter/delivery company）。Tổng quan từ §3.2 |
| 19 | **`01`** | **Hiển thị pattern number** | - | - | - | Thông tin định danh pattern theo phiếu yêu cầu（Excel import）đã nhập ở **P-03** |
| 20 | **`29/29`** mẫu số（phần kế hoạch） | **Số lượng kế hoạch** | - | - | - | Số lượng nhập từ Excel phiếu yêu cầu tại **P-03**, đồng nhất với quan hệ pattern/center trong **企画明細** |
| 21 | **`29/29`** tử số（phần thực tế） | **Số lượng thực tế**（đã đóng gói/đã kiểm） | - | - | - | Dữ liệu thực tế đóng gói nhận từ API Pack của SATO（**`PC_梱包実績送信`**） |
| 22 | **`1個口`** | **Số kiện（đơn vị đóng gói）** | - | - | - | Tính phía hệ thống từ dữ liệu trả về **`PC_梱包実績送信`**（công thức/làm tròn: **要確認**） |

#### §3.4 Bổ sung（layout/dữ liệu）

- **Hiển thị area và delivery center code**  
  - Nếu **配送センターコード = `9999999999`（10 chữ số/chưa dùng）**: không gắn area badge; thay bằng area name hiển thị lớn.  
  - Các trường hợp khác: hiển thị dạng **area tag/badge + delivery center name**.
- **Delivery Qty（No.16）**: lấy từ phiếu yêu cầu, gồm dự phòng. **Số lượng theo pattern** cũng cùng nguyên tắc（import phiếu yêu cầu + gồm dự phòng）。
- Việc判定 **charter/delivery company** phụ thuộc cài đặt client/plan/phiếu yêu cầu — **要確認**。Mỗi card hiển thị UI theo trường hợp 1/2 ở **§3.3**（và tổng quan §3.2）。

## 4. Hành động và chuyển màn hình

| Hành động | Trigger | Nội dung xử lý | Màn hình đích |
| --- | --- | --- | --- |
| Hiển thị ban đầu | Mở `/plan/{{id}}` | Lấy header và danh sách card theo **plan ID**. Thứ tự mặc định: §5 | - |
| Từ danh sách plan | Từ **T-01** v.v. | Giả định đã chuyển vào bằng click dòng tương ứng | **P-01**（chính màn hình này） |
| Delivery Status/配送ステータス | Click nút Delivery Status ở plan header（§3.1 No.7） | Mở màn hình trạng thái giao hàng của plan hiện tại | **P-05 Delivery Status/配送ステータス**（`/plan/{{id}}/status` v.v. theo routing chuẩn） |
| Plan Edit/企画編集 | Click **Plan Edit/企画編集** | - | **P-04 Plan Edit/企画編集** |
| Center Detail/センター別詳細 | Click nút **詳細** ở vùng list（§3.4 No.15） | Truyền `企画明細ID` hoặc `配送センターID` | **P-02 Plan Detail (By Center)/企画詳細（センターごと）** |
| Mirror Data DL/鏡データDL | Click **鏡データDL** | Tạo background -> sau hoàn tất thông báo/hiển thị. Gộp **29** artifacts（**28 CSV + 1 zip QR**）thành 1 zip để DL. Khi regenerate: vô hiệu code cũ và phát hành mới CSV/QR（§3.2・§5） | - |
| Material Label DL/資材ラベルDL | Click **資材ラベルDL** | Hiển thị badge **準備中** -> loading **生成中** -> tạo zip chứa **CSV/Excel（UTF-8）+ QR unique（PNG）** với cùng cấp/naming như mirror data. Quy tắc đánh số dùng chung（§3.2・§5） | - |
| Picking List DL/ピッキングリストDL | Click **ピッキングリストDL** | Tạo file theo đơn vị **area×center×pattern** với định dạng Excel rồi gộp thành **1 zip** để DL. Trong lúc tạo hiển thị loading | - |

## 5. Bổ sung

### Sort và thứ tự hiển thị

- Quy tắc sort/thứ tự list card（theo area code, center name, key thứ tự của plan detail v.v.）: **要確認**
- Thứ tự mặc định khi mở màn hình: **要確認**（ví dụ tăng dần theo key thứ tự của plan detail）

### Phạm vi áp dụng DL trên toolbar

- Theo phase/trạng thái của **charter/delivery company** trong **§3.2/§3.3**, điều khiển hiển thị/kích hoạt cho từng chức năng DL: **Mirror Data/鏡データ**, **Material Label/資材ラベル**, **Picking/ピッキング** — quy tắc chi tiết: **要確認**

### Mirror Data DL/鏡データDL（tạo/vô hiệu/DL）— tương ứng §3.2

- **UI**: sau khi click, trong trạng thái tạo hiển thị loading animation **「生成中」**。Xử lý background; sau khi hoàn tất thông báo/hiển thị để user thực hiện tải gộp.
- **Package**: gộp **29** artifacts（**28 CSV + 1 zip QR**）thành **1 zip tải gộp**。Chi tiết nội dung/cấp/naming/QR spec/trường hợp rỗng（`000000`）tham chiếu §3.2.
- **Đánh số/DB**: mirror và material label không tách quy tắc đánh số. Khi phát hành thì cấp số duy nhất và lưu DB. Số thứ tự quản lý trong cùng plan, không vượt plan.
- **Regenerate/click lại**: vô hiệu toàn bộ code cũ và phát hành mới CSV/QR（không tái sử dụng bộ cũ）。

### Material Label DL/資材ラベルDL（tạo/DL）— tương ứng §3.2

- **UI**: khi click hiển thị badge **準備中**。Trong lúc tạo hiển thị loading **「生成中」**。Background/thông báo hoàn tất giả định cùng cách với Mirror Data DL（**要確認**）。
- **Artifacts**: **① QR unique（PNG）**, **② dữ liệu material label（CSV hoặc Excel）**。Encoding: **UTF-8**。
- **ZIP**: chứa CSV+PNG, cấu trúc folder/naming giống mirror data. Gộp nhiều folder theo area×center×pattern thành 1 zip.
- **Đánh số**: click nút thì cấp số duy nhất + lưu DB. Serial（6 chữ số）theo **`a00001`～`a999999`→`b000001`…** và dùng chung với mirror data. Không vượt plan.

### Picking List DL/ピッキングリストDL（tạo/DL）— tương ứng §3.2

- Cung cấp **picking list định dạng Excel** dưới dạng zip. Tạo Excel theo đơn vị area×center×pattern và gói vào 1 zip（tham chiếu §3.2）。
- **UI**: trong lúc tạo hiển thị loading **「生成中」**。Sau hoàn tất cho phép DL zip.

### Data source và snapshot

| Hiển thị/thao tác | Dữ liệu logic chính（entity） | Ghi chú |
| --- | --- | --- |
| Plan header | **企画（ヘッダ）**, **クライアント** | - |
| Detail/card | **企画明細（theo area/DC/pattern）**, **エリア**, **配送センター**, **パターン** | Số lượng giao/số lượng theo pattern lấy từ phiếu yêu cầu và gồm dự phòng（§3.4） |
| Kiện/vận đơn/đếm | **梱包／個口**, **シリアル資材 trong梱包**（tổng hợp） | Là thành phần tạo nên hiển thị số lượng giao |
| Charter/pallet | **パレット（チャーター）** | Màn hình số pallet: **要確認** |

Tên bảng/cột vật lý chuẩn xem **`BasicDesign/TOBE/DB`**（`テーブル一覧.md` và các file `*_DB基本設計.md`）。Trong đặc tả màn hình chỉ ghi tên logic để không phụ thuộc rename ở DB chi tiết.

### Quyền

- Giả định: **quản lý / hậu cần**

### Validation/message

- Message code tham chiếu **`BasicDesign/TOBE/SCREEN/D-00_Message definition.md`**。

### GAP・要確認

- **GAP-P01-001**: Cần đồng nhất hoàn toàn định nghĩa màn hình giữa hiển thị/kích hoạt toolbar **鏡データDL／資材ラベルDL／ピッキングリストDL** với trạng thái theo **charter/delivery company** trong **§3.2/§3.3** và các thao tác **パレット数入力／送り状印刷**.
- **GAP-P01-004**: Điều kiện chuyển giữa **charter/delivery company**（theo cài đặt client, đơn vị plan）và mapping API ID cho các sự kiện（đếm hoàn tất, kiểm đếm OK, vận đơn, liên kết, lỗi）。
- **GAP-P01-002**: Chốt công thức tổng hợp cho **grid theo pattern**（tử số/mẫu số/số kiện）và **delivery summary**（theo phiếu yêu cầu, gồm dự phòng）。
- **GAP-P01-003**: Chốt chi tiết implement cho mirror data（29 files/zip tải gộp/thông báo hoàn tất BG/vô hiệu code cũ）và material label（badge 準備中/zip CSV・Excel+PNG/UTF-8/cấu trúc thư mục giống mirror data/serial dùng chung）。API vận đơn phía delivery company quản lý ở tài liệu liên kết.

---

## 6. Lịch sử sửa đổi

| Ngày | Phiên bản | Nội dung sửa đổi | Người phụ trách |
| --- | --- | --- | --- |
| 2026-04-17 | 1.0 | Tạo mới | HieuNT1 |

