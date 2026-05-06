# Phân tích Gap Spec & Q&A — M-01 Quản lý Client

## 1. Thông tin chung
- **Màn hình đối tượng**: M-01 Quản lý Client (Danh sách), M-01-cud Quản lý Client (Thêm/Sửa/Xóa)
- **Tài liệu tham chiếu**:
    - [M-01_クライアント情報一覧_JP.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Requirements/M-01/M-01_%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E6%83%85%E5%A0%B1%E4%B8%80%E8%A6%A7_JP.md)
    - [M-01-cud_クライアント（追加・編集・削除）_JP.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Requirements/M-01/M-01-cud_%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%EF%BC%88%E8%BF%BD%E5%8A%A0%E3%83%BB%E7%B7%A8%E9%9B%86%E3%83%BB%E5%89%8A%E9%99%A4%EF%BC%89_JP.md)
    - [M-01_クライアント管理（一覧）.png](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Requirements/design%20M-01/M-01_%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E7%AE%A1%E7%90%86%EF%BC%88%E4%B8%80%E8%A6%A7%EF%BC%89.png)
    - [M-01-cud_クライアント管理_編集.png](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Requirements/design%20M-01/M-01-cud_%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E7%AE%A1%E7%90%86_%E7%B7%A8%E9%9B%86.png)
- **Ngày tạo**: 22/04/2026
- **Người thực hiện**: Senior QA Lead

---

## 2. Danh sách Q&A

| Gap ID | Category | Mô tả Gap | Mức độ rủi ro | Câu hỏi làm rõ |
| --- | --- | --- | --- | --- |
| G-001 | UI/UX | Tiêu đề màn hình danh sách (M-01) không nhất quán. Spec ghi là 「クライアント管理（一覧）」 nhưng Mockup hiển thị là 「クライアント一覧」. | Low | Tiêu đề chính thức của màn hình là gì? |
| G-002 | UI/UX | Nhãn (label) hiển thị trạng thái không nhất quán giữa Spec, Mockup và giữa các màn hình.<br>Spec: 「稼働 / 停止」<br>Mockup (M-01): 「稼動中 / 休止中」<br>Mockup (M-01-cud): 「稼働 / 停止」 | Medium | Vui lòng thống nhất văn phong hiển thị trạng thái. Nên dùng cặp từ nào? (Lưu ý: Chữ Hán của "Kado" cũng đang bị dùng lẫn lộn giữa 「稼動」 và 「稼働」) |
| G-003 | UI/UX | Label lựa chọn các flag (Sử dụng Store Master...) không nhất quán.<br>Spec: 「あり / なし」<br>Mockup: 「する / しない」 | Medium | Label của Radio button nên sử dụng theo Spec hay theo Mockup? |
| G-004 | Functional | Trong Mockup (M-01-cud) có thêm mục 「配送センター（使用する / 使用しない）」 mà Spec chưa định nghĩa. | High | Vui lòng định nghĩa chi tiết chức năng cho item này (ảnh hưởng khi chọn 'Không sử dụng', map vào cột nào trong DB...). Mục này liên kết với cột nào của bảng m_clients? |
| G-005 | Functional | Luồng chuyển hướng đến màn hình đăng ký mới (Create) chưa được định nghĩa rõ.<br>Spec: Ghi là "Không hỗ trợ: Thanh tìm kiếm, filter..." và không nhắc tới nút Create.<br>Mockup: Có nút 「＋」 màu xanh ở góc trên bên phải table. | High | Nút 「＋」 trong Mockup có phải là nút để chuyển đến màn hình đăng ký mới (/client/new) không? |
| G-006 | Functional | Điều kiện hiển thị phân trang (Pagination) còn mơ hồ.<br>Spec: 「Chỉ hiển thị phân trang từ trang thứ 2 trở đi」 | Medium | Câu này có nghĩa là "Ẩn phân trang nếu dữ liệu chỉ có 1 trang" hay là "Luôn hiển thị nhưng chỉ active khi có từ 2 trang trở lên"? |
| G-007 | UI/UX | Về format tiêu đề màn hình chỉnh sửa (M-01-cud).<br>Mockup hiển thị là 「クライアント編集 (id=1)」. | Low | Việc hiển thị ID hệ thống (id=1) cho người dùng cuối trên tiêu đề màn hình có đúng spec không? Thông thường hệ thống sẽ hiển thị Tên Client. |
| G-008 | Data | Validate tên Client (No.2) ghi là "Cho phép ký tự Full-width/Half-width; cho phép ký tự đặc biệt" nhưng không có định nghĩa danh sách ký tự cấm. | Medium | Dự án có bộ ký tự cấm (Prohibited characters) chung nào không? (Spec có nhắc đến D-20, cần xác nhận đã có định nghĩa chưa). |
| G-009 | Business Logic | Về kiểm tra ràng buộc khi xóa Client (§5).<br>Khi BE từ chối xóa, màn hình sẽ hiển thị message nào? | Medium | Có phải sẽ hiển thị MSG-022 「関連データが存在するため削除できません。」 (D-00) không? |
| G-010 | Validation | Về giới hạn ký tự tên Client.<br>Spec: 「1〜100 ký tự (sau khi trim)」 | Medium | Giới hạn 100 ký tự này áp dụng cho cả tiếng Nhật (Full-width) phải không? Hay có giới hạn theo Byte? (DBML đang để varchar(255)). |

---

## 3. Thống kê phân tích
- **Tổng số Gap**: 10
- **Mức độ rủi ro**:
    - **High**: 2
    - **Medium**: 6
    - **Low**: 2
- **Category**:
    - **UI/UX**: 5
    - **Functional**: 3
    - **Data**: 1
    - **Business Logic**: 1
    - **Validation**: 1
