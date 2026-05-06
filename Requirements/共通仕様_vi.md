# Đặc tả chung (COMMON RULE)

| Mục             | Nội dung         |
| --------------- | ---------------- |
| Người tạo       | HieuNT1          |
| Ngày tạo        | 2026-04-02 (JST) |
| Người review    | (chưa ghi)       |
| Người phê duyệt | (chưa ghi)       |

---

## 1. Nguyên tắc thiết kế cơ bản (Design Principles)

- **Độ rộng chuẩn**: 1440px
- **Khoảng trắng**: Theo thang 8px (Bội số của 8px) (`p-4`, `gap-4`, v.v.)
- **Mật độ màn hình (Density)**: Tùy loại màn hình, dùng 3 mức **Standard** / **Dense** / **Compact**
- **Màu sắc · theme**
  - **Brand**: Teal-700 (`#0D9488`)
  - **Background**: Gradient tuyến tính dọc (Teal-600 → Slate-800)
  - **Text**: Primary (Gray-900), Secondary (Gray-600)

---

## 2. Cấu trúc bố cục (Layout Structure)

### Thanh bên (Sidebar)

- Trạng thái default: **mở rộng (Expanded)**
- Khi thu gọn: **Off-canvas** (ẩn hoàn toàn). Mở lại bằng menu hamburger
- Menu phân cấp: **bật/tắt bằng cách nhấp**

### Thanh tiêu đề (Header)

- Tuân theo quy tắc hiển thị tên người dùng đăng nhập, vai trò và menu đăng xuất

---

## 3. Hành vi thành phần dùng chung (Component Behaviors)

### CRUD

| Loại      | Điều kiện                             | Hành vi               |
| --------- | ------------------------------------- | --------------------- |
| CRUD nhẹ  | Tối đa 5 trường                       | Drawer (nền Flowbite) |
| CRUD nặng | Từ 6 trường trở lên hoặc tác động lớn | Chuyển màn hình       |

### Bảng danh sách (Table)

- Có thể chọn số lượng hiển thị mỗi trang: **15 / 30 / 50** (mặc định **30**)
- **Sắp xếp**: Ban đầu theo ID tăng dần. Nhấp tiêu đề cột để **tăng dần → giảm dần → không sắp xếp** (lặp vòng)
- **Phân trang**: Hiển thị điều khiển từ trang thứ 2 trở đi
- **Khung tìm kiếm**: Mặc định mở. Tìm kiếm **AND**

---

## 4. Trạng thái & phản hồi dùng chung (Status & Feedback)

- **Xóa dữ liệu**: Tất cả là **xóa logic**. Khi xóa **bắt buộc** có hộp thoại xác nhận
- **Đang tải**: Dùng Flowbite Spinner
- **0 bản ghi**: Hiển thị message có **hướng dẫn tạo mới bản ghi** trên list trống
- **Lỗi kết nối**: Hiển thị **modal thống nhất** theo **mục 4.1**

### 4.1 Modal lỗi kết nối (thống nhất)

| Hạng mục | Nội dung                                                                                      |
| -------- | --------------------------------------------------------------------------------------------- |
| Tiêu đề  | 接続エラー                                                                                    |
| Nội dung | サーバーに接続できませんでした。ネットワーク環境をご確認のうえ、再試行してください。(MSG-022) |
| Nút      | 再試行 Thử lại                                                                                |

---

## 5. Quy tắc validation & nhập liệu

### 5.1 Focus & giới hạn nhập (chung)

- **Focus**: Mọi ô nhập đều hiển thị viền (ring) Teal-500
- **Giới hạn nhập**: Tuân theo quy tắc thống nhất về định nghĩa ký tự half-width, vị trí hiển thị lỗi bắt buộc (dải đỏ, v.v.)

### 5.1.1 Ký tự đặc biệt cho trường dạng tên (text name)

Áp dụng cho các trường dạng **tên** như: tên khách hàng, tên khu vực, tên cửa hàng, tên vận chuyển, tên người dùng hiển thị, v.v.

- **Cho phép ký tự đặc biệt (tối thiểu)**:
  - Khoảng trắng: ` `, `　`
  - Dấu chấm / phẩy: `.`, `,`, `．`, `，`
  - Dấu gạch nối (các biến thể thường gặp trong JP): `-`, `‐`, `‑`, `–`, `—`, `ー`, `－`
  - Dấu ngoặc: `(`, `)`, `（`, `）`
  - Dấu và: `&`, `＆`
  - Dấu gạch chéo: `/`, `／`
  - Dấu chấm giữa: `・`
- **Khi lưu**:
  - Trim khoảng trắng đầu/cuối
  - Khuyến nghị **chuẩn hóa** các biến thể dấu gạch nối về một ký tự thống nhất (ví dụ `-` hoặc `－`)
- **Không cho phép**: ký tự điều khiển (tab, xuống dòng, v.v.) và các ký tự dễ gây rủi ro hiển thị/xử lý như `<`, `>`, `\`

### 5.2 Phân trang (Pagination)

1. Số liên kết số trang hiển thị trên một lần: **tối đa 10**
2. Nếu trang hiện tại **không** nằm trong khúc đầu (ví dụ 1–10), hiển thị **`...`** bên trái. Nhấp sẽ chuyển đến **trang cuối của khúc đó** (ví dụ 10)
3. Nếu trang hiện tại không nằm trong khúc gần cuối, hiển thị **`...`** bên phải. Nhấp sẽ chuyển đến **trang đầu của khúc kế** (ví dụ 21)
4. Ở khúc cuối, nếu chưa đủ 10 trang thì chỉ hiển thị **đúng số trang thực tế**
5. **First / Last**: Chuyển đến trang đầu / trang cuối
6. **Previous / Next**: Chuyển đến trang ngay trước / ngay sau

**Ví dụ vẽ bằng text (tổng 30 trang, mỗi khúc 10 trang: 1–10, 11–20, 21–30)**  
Ký hiệu: `[...]` là trang hiện tại, `...` là nút nhảy khúc.

1. **Đang ở khúc đầu (1–10)**, ví dụ trang 3

`First  Prev   1  2  [3] 4  5  6  7  8  9  10   ...   Next  Last`
`(click ... → 11)`

2. **Đang ở khúc giữa (11–20)**, ví dụ trang 15

`First  Prev   ...  11 12 13 14 [15] 16 17 18 19 20   ...   Next  Last`
`(click ... bên trái → 10)   (click ... bên phải → 21)`

3. **Đang ở khúc cuối (21–30)**, ví dụ trang 28

`First  Prev   ...  21 22 23 24 25 26 27 [28] 29 30        Next  Last`
`(click ... → 10)`

### 5.3 Cửa sổ popup (Popup)

- Trừ hộp thoại thông báo, **mọi popup** đều có thể kéo thanh tiêu đề để di chuyển trên màn hình

### 5.4 Bảng (Table) — cột & sắp xếp

1. Áp dụng cho mọi bảng:
   - Có thể thay đổi độ rộng cột
   - Mọi cột đều có thể sắp xếp (luôn hiển thị icon sắp xếp trên mọi cột)
2. **Quy tắc sắp xếp**
   - Nhấp △: Tăng dần (highlight △)
   - Nhấp ▽: Giảm dần (highlight ▽)
   - Mỗi lúc chỉ sắp xếp **một cột**
   - Nếu giá trị ngang nhau: ưu tiên **thời gian tạo**, sau đó **ID giảm dần** để phân tách
3. Độ rộng bảng cố định. Nếu tổng độ rộng cột vượt độ rộng bảng thì **cuộn ngang**

### 5.5 Vùng nhập ngày (Input date area)

1. Có thể chọn trực tiếp trên lịch
2. Gõ tay:
   - Đúng định dạng `yyyy/MM/dd` thì khi bỏ focus sẽ hiển thị giá trị đã nhập
   - Sai định dạng thì khi bỏ focus **đặt lại trống (Blank)**
3. Có tùy chọn **Today**. Nhấp sẽ điền ngày hiện tại

### 5.6 Tìm kiếm (Search)

Chung cho mọi màn hình tìm kiếm:

- Bỏ qua khác biệt chữ hoa/thường, half-width/full-width
- **Loại bỏ toàn bộ khoảng trắng** trong từ khóa rồi mới tìm
- **Quy tắc hiển thị dữ liệu theo trạng thái (áp dụng cho cả điều kiện lọc và kết quả)**:
  - **Màn hình danh sách (List)**: tại **pulldown điều kiện lọc**, **cho phép hiển thị** các đối tượng **đang tạm dừng** (停止 / INACTIVE) để người dùng có thể tra cứu/lọc.
  - **Màn hình chi tiết (Detail)**: tại **pulldown chọn master/đối tượng liên kết để nhập liệu**, **không hiển thị** các đối tượng **đang tạm dừng** (停止 / INACTIVE).
  - **Không hiển thị** các đối tượng **đã bị xóa mềm** (論理削除) trên màn hình search/list thông thường (mặc định luôn loại trừ, tương đương `deleted_at IS NULL`).

Với **tìm theo Name** (màn hình tìm Namecard) và **popup tìm Person**, ngoài các quy tắc trên còn **loại bỏ ký tự đặc biệt** trước khi tìm

### 5.7 Hiển thị thông báo

Khi hiển thị thông báo trên màn hình, **thêm ID thông báo ở đầu** nội dung

Ví dụ: `[ERR_W001] Đã xảy ra lỗi nghiệp vụ`

※ Không áp dụng cho thông báo chỉ hiển thị trong popup

### 5.8 Hành vi khi truy cập URL

- **Còn phiên đăng nhập**: Hiển thị màn hình tương ứng URL yêu cầu
- **Chưa đăng nhập**: Hiển thị màn hình đăng nhập; sau khi thành công chuyển đến **URL ban đầu**

### 5.8.1 Deep link cho Drawer（軽量CRUD）

Với các màn **danh sách** có thao tác CUD trên **Drawer**（軽量CRUD）, hệ thống biểu diễn trạng thái Drawer bằng **query** trên chính URL danh sách để người dùng có thể bookmark/chia sẻ.

- **Chuẩn URL**
  - **Tạo mới（mở Drawer chế độ new）**: `{listPath}?drawer={drawerId}&mode=new`
  - **Chỉnh sửa（mở Drawer chế độ edit）**: `{listPath}?drawer={drawerId}&mode=edit&id={recordId}`
- **Định nghĩa tham số**
  - `drawer`: định danh Drawer（cố định theo từng màn hình; ví dụ `area`, `pattern`, `material`, `deliveryCompany`, `user`, `operator`）
  - `mode`: `new` / `edit`
  - `id`: bắt buộc khi `mode=edit`（định danh bản ghi）
- **Hành vi**
  - Tham số không hợp lệ（`drawer` không đúng, `mode` sai, thiếu `id` khi `mode=edit`...）: **không mở Drawer**, chỉ hiển thị danh sách; thông báo lỗi bằng **toast theo D-00**.
  - Không tìm thấy bản ghi / không đủ quyền: **không mở Drawer**, quay về danh sách (loại bỏ query) và hiển thị lỗi theo **D-00**.
  - Khi đóng Drawer: loại bỏ các query `drawer`,`mode`,`id` khỏi URL để quay về URL danh sách (khuyến nghị dùng replace để tránh rác history).

### 5.9 Chuyển màn hình chi tiết & lỗi (áp dụng màn chi tiết)

- **Lỗi validation**: Giữ nguyên màn hiện tại, hiển thị lỗi trên cùng màn đó
- **Lỗi quyền, không tìm thấy dữ liệu, v.v.**: **Chuyển hướng về danh sách (List)** và hiển thị thông báo lỗi trên danh sách
- Thao tác **thêm · cập nhật · xóa** ở màn chi tiết phải được **phản ánh trên danh sách** khi người dùng quay lại danh sách

### 5.10 Quy tắc sắp xếp (JIS, v.v.)

- JIS Code
- Level 2: **ID giảm dần**

### 5.11 Định dạng dữ liệu

- **Email**: Tuân theo validation của HTML5 `input type="email"` (tham khảo biểu thức dưới)

  ```
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  ```

- **Số điện thoại**: Sau khi loại bỏ `+`, `-` và khoảng trắng, **10 hoặc 11 chữ số**, bắt đầu bằng **0**

### 5.12 Khác (Others)

- Trường trong DB là null / blank thì trên màn hình hiển thị **Blank**
- Trường có giới hạn `maxlength` thì trên màn hình cũng **giới hạn độ dài ký tự** khi nhập

**改訂履歴**

| 日付       | 版  | 改訂内容                                               | 担当者  |
| ---------- | --- | ------------------------------------------------------ | ------- |
| 2026-04-24 | 1.0 | `共通仕様_vi.md` 準拠の日本文を初版作成。`共通仕様.md` と差分を解消 | TungNT2 |