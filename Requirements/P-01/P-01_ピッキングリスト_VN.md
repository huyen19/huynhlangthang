# D-14 Đặc tả màn hình (output format)

## 1. Tổng quan

- **Màn hình liên quan ID**: **P-01**（**Plan Detail (Work Status Check)/企画詳細（作業ステータス確認）**）
- **Vị trí tài liệu**: Tài liệu này **không có URL màn hình**. Tài liệu định nghĩa layout và hạng mục của **file Excel** được tạo bởi toolbar **PickingListDL/ピッキングリストDL** trên **P-01**（§3.2「PickingListDL/ピッキングリストDL」）。
- **Tên file (hình ảnh output)**: Quy tắc implementation và naming theo **P-01** §3.2・§5. Chuẩn format tham chiếu file Excel riêng **`BasicDesign/TOBE/SCREEN/外部ファイル/format-pickinglist.xlsx`**.
- **Định dạng**: **Excel（.xlsx）**。
- **Khổ giấy/trang output (dự kiến)**: **A４ヨコ**（nằm ngang）. Khi in bằng máy in nghiệp vụ, hướng giấy và layout phải theo thiết lập này.

## 2. Bố cục màn hình

Tài liệu này không phải **màn hình trên browser**, mà mô tả layout của **Excel book cấu trúc 1 sheet**. Chuẩn về khổ giấy/hướng giấy là **A４ヨコ**（§1）。

> [!NOTE]
> Chi tiết layout và merge cell tham chiếu **`BasicDesign/TOBE/SCREEN/外部ファイル/format-pickinglist.xlsx`**（Sheet1）. Bên dưới là phần tóm tắt cấu trúc đọc từ file đó.

## 3. Danh sách phần tử UI（vùng/cột trên sheet）

"Phần tử" được hiểu là **block hiển thị/cột trên Excel**.

| No. | Tên phần tử | Loại | Mô tả | Hành vi khi thao tác | Quy tắc validation | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Dòng title/header | Text | クライアント名  クライアント名/企画名　エリア/配送センター (ページ番号) | - | - | - |
| 2 | Plan Name/企画名 | Text | Plan name | - | - | - |
| 3 | Trigger QR/トリガーQR | QR code（hình ảnh） | **Trigger QR/トリガーQR**. Mã phân loại code（3 chữ số）là cố định hệ thống. Việc generate được thực hiện động. | - | - | Vị trí/kích thước tham chiếu **format-pickinglist.xlsx** |
| 4 | Dòng Area/Center（エリア／配送センター） | Text（hiển thị） | **Tên area/tên center** tương ứng | - | - | **Area/エリア**・**Center/配送センター**（tên logic） |
| 5 | Tổng số set | Text/số（hiển thị） | **Tổng số set** của pattern tương ứng hoặc section tương ứng | - | - | Tổng hợp dựa trên **Plan Detail/企画明細** và số lượng import（định nghĩa đồng nhất với **P-01** §3.3・**P-03** §5） |
| 6 | Pattern Name/パターン名 | Text（hiển thị） | Dòng thể hiện tên/định danh của **pattern/パターン** | - | - | **Pattern/パターン**（logic）. Format placeholder "パターン名：＿＿…" theo **format sample** |
| 7 | Số dòng（liên số） | Số（hiển thị） | STT dòng chi tiết | - | - | Đánh số từ 1 |
| 8 | Material ID/資材ID | Text（hiển thị） | Định danh của master **material/資材** | - | - | **資材.資材ID**（logic）※DB: `BasicDesign/TOBE/DB` |
| 9 | Material Name/資材名 | Text（hiển thị） | Tên **material/資材** | - | - | **資材.資材名**（logic） |
| 10 | Kích thước（mm） | Text（hiển thị） | Biểu diễn kích thước material（ví dụ: `11x11x11`） | - | - | Thuộc tính kích thước của **material/資材** hoặc plan detail |
| 11 | Ghi chú（viết tay） | Text（trống） | Cột dùng ghi chú hiện trường. Dự kiến **viết tay sau khi in** | - | - | Theo vận hành máy in nghiệp vụ trong tài liệu FM |

## 4. Hành động và chuyển màn hình

| Hành động | Trigger | Nội dung xử lý | Màn hình đích |
| --- | --- | --- | --- |
| Tạo Excel | Nhấn **PickingListDL/ピッキングリストDL** trên **P-01** | Tạo **Excel** theo đơn vị **area × center × pattern** và DL bằng **zip**（quy trình theo **P-01** §4・§5） | -（lấy file） |
| In | Người dùng in file Excel đã tải bằng máy in nghiệp vụ | Thao tác ngoài hệ thống | - |

## 5. Bổ sung

### Data source（nguồn giá trị output）

| Block/cột | Dữ liệu logic chính | Ghi chú |
| --- | --- | --- |
| Header/title | **plan/企画（ヘッダ）**、**client/クライアント**、**center/配送センター**、**pattern/パターン** | Gắn theo context **P-01**（`plan` ID） |
| Trigger QR/トリガーQR | Mã phân loại code cố định hệ thống（3 chữ số）+ payload generate động | §3 No.3. Chi tiết xác nhận qua implementation và **format-pickinglist.xlsx** |
| Tổng số set/dòng chi tiết | **plan detail/企画明細**、**material/資材**、số lượng import từ phiếu yêu cầu | Cách xử lý **số lượng gồm dự phòng** theo cùng chính sách với **P-01** §3.3 |

### Format sample（xlsx）

- **`BasicDesign/TOBE/SCREEN/外部ファイル/format-pickinglist.xlsx`**

### GAP・Cần xác nhận

- Quy tắc chính thức cho **template variable** của câu header（ngày tháng/chia trang）.

---

## 6. Lịch sử sửa đổi

| Ngày | Phiên bản | Nội dung sửa đổi | Người phụ trách |
| --- | --- | --- | --- |
| 2026-04-29 | 1.0 | Tạo mới | HieuNT1 |

