# D-14 Đặc tả màn hình

## 1. Tổng quan

- **Màn hình ID**: P-04
- **Tên màn hình**: Plan Edit Screen/企画編集画面
- **URL**: `/plan/{{id}}/edit`
- **Mục đích**: Màn hình chỉnh sửa để xác nhận thuộc tính của plan hiện có, upload lại phiếu yêu cầu（ghi đè）, xóa, v.v. Giả định chuyển từ **P-01**. Các thao tác **thay đổi dữ liệu gốc** như upload lại phiếu yêu cầu chỉ được phép khi **trạng thái của plan（header）** nằm trong phạm vi cho phép（§5「企画ステータスと編集可否」）。**Vùng preview chỉ để tham chiếu**; nếu nội dung sai thì xử lý bằng **upload lại phiếu yêu cầu**, không sửa trực tiếp trên ô preview（§5「プレビューと再アップロード」）。

## 2. Bố cục màn hình

> [!NOTE]
> Tham khảo bố cục: `Requirement/画面一覧_image/P-04_企画編集.png`

- Hiển thị thông tin định danh plan, **preview** của phiếu yêu cầu hiện tại（**read-only**）hoặc meta information.
- **Chỉ preview**. Nếu sai nội dung thì sửa bằng **upload lại**（§5）。
- Thao tác upload lại, lưu, xóa（modal xác nhận）。

## 3. Danh sách phần tử UI

Giả định dùng **cùng phần tử** với mục「**3. UI要素一覧**」của **`P-03_新規企画作成.md`**（**3.1** và **3.2 Sau khi nhấn Data Load/データ読み込み**）。

- **Phần riêng của màn hình chỉnh sửa**: các thao tác thay đổi dữ liệu gốc như **File Select/ファイル参照**・**Data Load/データ読み込み**・**Register/登録する**（lưu/phản ánh）tuân theo **§5「企画ステータスと編集可否」**; ngoài trạng thái **未対応** thì phải disable hoặc không cho thực thi（theo **Figma**/**D-00**）。
- Cách xử lý **Delete This Plan/この企画を削除する** xem §5「論理削除」。
- **Preview Display/プレビュー表示**（tương đương No.6 của P-03）chỉ tham chiếu. Khi sai dữ liệu phải đổi file bằng **File Select/ファイル参照** -> chạy lại **Data Load/データ読み込み** để upload lại（§5）。

## 4. Hành động và chuyển màn hình

Giả định cùng luồng với mục「**4. アクションと画面遷移**」của **`P-03_新規企画作成.md`**. URL của màn hình này là **`/plan/{{id}}/edit`**（P-04）。

- Ở **hiển thị ban đầu**, mở giao diện tương đương P-03 trong context của **plan hiện có**.
- Hành vi sau khi **xóa plan** xem §5「論理削除」（chuyển tới **T-01**, không hiển thị plan đó trong danh sách）。

## 5. Bổ sung

### Trạng thái plan và khả năng chỉnh sửa（phiếu yêu cầu/dữ liệu gốc）

Trước khi cho phép thao tác chỉnh sửa làm thay đổi dữ liệu gốc（upload lại phiếu yêu cầu v.v.）, hệ thống phải kiểm tra **trạng thái plan**（trạng thái tổng hợp của **plan（header）**, dùng cùng giá trị nghiệp vụ như danh sách **T-01**）。Mã nội bộ/mục DB dùng để判定 phải đồng bộ với **`BasicDesign/TOBE/DB`**。

| Phân loại | Trạng thái（ví dụ tên hiển thị） | Mô tả | Upload lại phiếu yêu cầu v.v. |
| --- | --- | --- | --- |
| **Cho phép** | **未対応** | Plan mới chỉ được đăng ký trên HBLAB, **chưa liên kết sang SATO**（chưa gửi dữ liệu xuống hệ dưới） | **Cho phép** |
| **Cấm** | **進行中** | **Đã liên kết sang SATO**（giả định sau khi gọi API nhóm **PcInspection**） | **Cấm**（disable thao tác hoặc báo lỗi khi nhấn. Message theo **D-00** hoặc **要確認**） |
| **Cấm** | **配送中** | **Đã phát hành Waybill No.（số vận đơn）** | **Cấm** |
| **Cấm** | **配達完了** | **Đã giao đến nơi nhận** | **Cấm** |
| **Cấm** | **完了** | **Trạng thái hoàn tất nghiệp vụ cuối cùng** | **Cấm** |

- Các thao tác chỉ xem hoặc thao tác không phụ thuộc trạng thái có hay không: **要確認**.
- Nếu có nhánh định nghĩa trạng thái theo charter v.v., phải đồng bộ với định nghĩa ở **P-01/T-01**。

### Preview và upload lại

- **Chỉ preview（read-only）**: danh sách kết quả import không chỉnh sửa trực tiếp trên màn hình. Giống preview ở P-03, không cho sửa trực tiếp trong cell.
- **Khi nội dung sai**: thực hiện **upload lại**. Chỉ định lại file request đúng（xlsx/csv）ở **File Select/ファイル参照**, rồi chạy **Data Load/データ読み込み** để re-validate/cập nhật preview.
- **Register/登録する**（lưu）phản ánh đăng ký chính thức dựa trên nội dung preview đã được kiểm tra sau upload lại（chi tiết theo P-03 §4・§5）。

### 「Delete This Plan/この企画を削除する」（xóa logic）

- Khi thực hiện **Delete This Plan/この企画を削除する**（giả định cùng UI như P-03）, plan sẽ **không bị xóa vật lý** mà xử lý theo **xóa logic**（set cờ xóa/thời điểm xóa logic v.v. vào DB. Mục vật lý tham chiếu `BasicDesign/TOBE/DB`）。
- Plan đã **xóa logic** sẽ **không hiển thị** ở **Plan List（T-01）**（đồng nhất chính sách loại trừ khỏi danh sách như điều kiện 「完了した企画を表示」 của T-01）。
- Dialog xác nhận/message thành công/màn hình đích（T-01）tuân theo định nghĩa action của P-03, đồng thời đảm bảo ngữ nghĩa ở màn hình này là **xóa = xóa logic**。

### Khác

- Message tham chiếu **`D-00_Message definition.md`**.
- **Tham chiếu DB**: chuẩn dữ liệu ở **`BasicDesign/TOBE/DB`**（`テーブル一覧.md` và các DB basic design tương ứng）. Trong tài liệu này chỉ ghi **logic entity.logic item**, còn tên bảng/cột vật lý giao cho DB detailed design（cùng chính sách với P-03）. Chi tiết UI/thao tác tham chiếu **`P-03_新規企画作成.md`**. Tuy nhiên các mục §5 về **判定 trạng thái**, **xóa logic**, **preview và upload lại** là phần bổ sung riêng cho **P-04**.

## 6. Lịch sử sửa đổi

| Ngày | Phiên bản | Nội dung sửa đổi | Người phụ trách |
| --- | --- | --- | --- |
| 2026-04-17 | 1.0 | Tạo mới | HieuNT1 |
| 2026-04-29 | — | §5: chuẩn hóa tên logic DB; điều kiện cho upload lại theo **trạng thái plan**（chỉ **未対応** được phép）; **xóa = xóa logic** | - |
| 2026-04-29 | — | **Chỉ preview**; khi sai thì xử lý bằng **upload lại**（§1・§2・§3・§5） | - |
