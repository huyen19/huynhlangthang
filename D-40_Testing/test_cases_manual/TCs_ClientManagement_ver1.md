# TCs_ClientManagement_ver1.md

| Mục | Nội dung |
|---|---|
| **File** | TCs_ClientManagement_ver1.md |
| **Màn hình** | M-01 — クライアント管理 |
| **Tài liệu tham chiếu** | [M-01_JP.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Requirements/M-01/M-01_%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E6%83%85%E5%A0%B1%E4%B8%80%E8%A6%A7_JP.md), [M-01-cud_JP.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Requirements/M-01/M-01-cud_%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%EF%BC%88%E8%BF%BD%E5%8A%A0%E3%83%BB%E7%B7%A8%E9%9B%86%E3%83%BB%E5%89%8A%E9%99%A4%EF%BC%89_JP.md) |
| **TVP tham chiếu** | [TVP_ClientManagement_ver1.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Test%20view%20point/TVP_ClientManagement_ver1.md) |
| **Tổng số TC** | 168 |

---

## Bảng Test Case Chi tiết (FULL VIETNAMESE - 168 TCs)

| TC ID | TVP ID | Module | Test Description | Preconditions | Test Steps | Test Data | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|---|---|---|
| **TC-LIST-001** | TVP-001 | M-01 | Kiểm tra tổng quan UI | Admin đăng nhập | Mở danh sách | N/A | Hiển thị tiêu đề và bảng đúng Spec | UI | Low |
| **TC-LIST-002** | TVP-006 | M-01 | Kiểm tra phân trang | Dữ liệu > 50 dòng | Xem cuối bảng | N/A | Thành phân trang hiển thị đúng | Pagination | Medium |
| **TC-ADD-003** | TVP-009 | M-01-add | [クライアント名] Kiểm tra giá trị mặc định | Màn hình Thêm mới | Quan sát trường | N/A | Trường để trống | Functional | Medium |
| **TC-ADD-004** | TVP-009 | M-01-add | [クライアント名] Kiểm tra để trống | Màn hình Thêm mới | Xóa & Nhấn Lưu | '' | Lỗi: MSG-001 (Bắt buộc) | Validation | High |
| **TC-ADD-005** | TVP-009 | M-01-add | [クライアント名] Kiểm tra toàn khoảng trắng | Màn hình Thêm mới | Nhập Space & Lưu | '   ' | Lỗi: MSG-001 (Bắt buộc) | Validation | High |
| **TC-ADD-006** | TVP-009 | M-01-add | [クライアント名] Chữ Nhật (Full-width) | Màn hình Thêm mới | Nhập chữ Nhật & Lưu | あいうえお | Lưu thành công | Validation | Medium |
| **TC-ADD-007** | TVP-009 | M-01-add | [クライアント名] Tiếng Việt | Màn hình Thêm mới | Nhập tiếng Việt & Lưu | Công ty A | Lưu thành công | Validation | Medium |
| **TC-ADD-008** | TVP-009 | M-01-add | [クライアント名] Dạng số | Màn hình Thêm mới | Nhập số & Lưu | 123456 | Lưu thành công | Validation | Low |
| **TC-ADD-009** | TVP-009 | M-01-add | [クライアント名] Ký tự đặc biệt | Màn hình Thêm mới | Nhập biểu tượng & Lưu | @#$%^&* | Lưu thành công | Validation | Medium |
| **TC-ADD-010** | TVP-009 | M-01-add | [クライアント名] Biên - Max length | Màn hình Thêm mới | Nhập 100 ký tự | 100 | Lưu thành công | Validation | Medium |
| **TC-ADD-011** | TVP-009 | M-01-add | [クライアント名] Biên - Quá Max | Màn hình Thêm mới | Paste 101 ký tự | 101 | Chặn nhập hoặc báo lỗi MSG-003 | Validation | High |
| **TC-ADD-012** | TVP-009 | M-01-add | [クライアント名] Bảo mật - XSS | Màn hình Thêm mới | Nhập script tag | <script> | Xử lý chuỗi thuần, không chạy script | Security | High |
| **TC-ADD-013** | TVP-009 | M-01-add | [クライアント名] Bảo mật - SQLi | Màn hình Thêm mới | Nhập SQL payload | OR 1=1 | Xử lý chuỗi thuần, không lỗi query | Security | High |
| **TC-ADD-014** | TVP-009 | M-01-add | [クライアント名] Kiểm tra trùng tên | Màn hình Thêm mới | Nhập tên đã có | Duplicate | Lỗi: MSG-005 (Trùng lặp) | Validation | High |
| **TC-ADD-015** | TVP-012 | M-01-add | [稼働状況] Kiểm tra giá trị mặc định | Màn hình Thêm mới | Quan sát UI | N/A | Đúng theo Spec | Functional | Medium |
| **TC-ADD-016** | TVP-012 | M-01-add | [稼働状況] Thay đổi lựa chọn | Màn hình Thêm mới | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-ADD-017** | TVP-012 | M-01-add | [稼働状況] Lưu thay đổi | Màn hình Thêm mới | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-ADD-018** | TVP-013 | M-01-add | [店舗マスタ利用] Kiểm tra giá trị mặc định | Màn hình Thêm mới | Quan sát UI | N/A | Đúng theo Spec | Functional | Medium |
| **TC-ADD-019** | TVP-013 | M-01-add | [店舗マスタ利用] Thay đổi lựa chọn | Màn hình Thêm mới | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-ADD-020** | TVP-013 | M-01-add | [店舗マスタ利用] Lưu thay đổi | Màn hình Thêm mới | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-ADD-021** | TVP-013 | M-01-add | [資材マスタ利用] Kiểm tra giá trị mặc định | Màn hình Thêm mới | Quan sát UI | N/A | Đúng theo Spec | Functional | Medium |
| **TC-ADD-022** | TVP-013 | M-01-add | [資材マスタ利用] Thay đổi lựa chọn | Màn hình Thêm mới | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-ADD-023** | TVP-013 | M-01-add | [資材マスタ利用] Lưu thay đổi | Màn hình Thêm mới | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-ADD-024** | TVP-013 | M-01-add | [パレット用ラベル印刷] Kiểm tra giá trị mặc định | Màn hình Thêm mới | Quan sát UI | N/A | Đúng theo Spec | Functional | Medium |
| **TC-ADD-025** | TVP-013 | M-01-add | [パレット用ラベル印刷] Thay đổi lựa chọn | Màn hình Thêm mới | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-ADD-026** | TVP-013 | M-01-add | [パレット用ラベル印刷] Lưu thay đổi | Màn hình Thêm mới | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-ADD-027** | TVP-014 | M-01-add | [配送センター] Kiểm tra giá trị mặc định | Màn hình Thêm mới | Quan sát UI | N/A | Đúng theo Spec | Functional | Medium |
| **TC-ADD-028** | TVP-014 | M-01-add | [配送センター] Thay đổi lựa chọn | Màn hình Thêm mới | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-ADD-029** | TVP-014 | M-01-add | [配送センター] Lưu thay đổi | Màn hình Thêm mới | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-ADD-030** | TVP-015 | M-01-add | [配送方法] Kiểm tra giá trị mặc định | Màn hình Thêm mới | Quan sát UI | N/A | Đúng theo Spec | Functional | Medium |
| **TC-ADD-031** | TVP-015 | M-01-add | [配送方法] Thay đổi lựa chọn | Màn hình Thêm mới | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-ADD-032** | TVP-015 | M-01-add | [配送方法] Lưu thay đổi | Màn hình Thêm mới | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-ADD-033** | TVP-015 | M-01-add | [運送会社] Kiểm tra giá trị mặc định | Màn hình Thêm mới | Quan sát UI | N/A | Đúng theo Spec | Functional | Medium |
| **TC-ADD-034** | TVP-015 | M-01-add | [運送会社] Thay đổi lựa chọn | Màn hình Thêm mới | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-ADD-035** | TVP-015 | M-01-add | [運送会社] Lưu thay đổi | Màn hình Thêm mới | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-ADD-036** | TVP-018 | M-01-add | [送り先設定] Kiểm tra giá trị mặc định | Màn hình Thêm mới | Quan sát UI | N/A | Đúng theo Spec | Functional | Medium |
| **TC-ADD-037** | TVP-018 | M-01-add | [送り先設定] Thay đổi lựa chọn | Màn hình Thêm mới | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-ADD-038** | TVP-018 | M-01-add | [送り先設定] Lưu thay đổi | Màn hình Thêm mới | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-ADD-039** | TVP-018 | M-01-add | [送り先(一か所)] Kiểm tra giá trị mặc định | Màn hình Thêm mới | Quan sát UI | N/A | Đúng theo Spec | Functional | Medium |
| **TC-ADD-040** | TVP-018 | M-01-add | [送り先(一か所)] Thay đổi lựa chọn | Màn hình Thêm mới | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-ADD-041** | TVP-018 | M-01-add | [送り先(一か所)] Lưu thay đổi | Màn hình Thêm mới | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-EDIT-042** | TVP-009 | M-01-edit | [クライアント名] Kiểm tra load dữ liệu | Màn hình Chỉnh sửa | Quan sát trường | Dữ liệu DB | Hiển thị đúng dữ liệu cũ từ DB | Functional | High |
| **TC-EDIT-043** | TVP-009 | M-01-edit | [クライアント名] Kiểm tra để trống | Màn hình Chỉnh sửa | Xóa & Nhấn Lưu | '' | Lỗi: MSG-001 (Bắt buộc) | Validation | High |
| **TC-EDIT-044** | TVP-009 | M-01-edit | [クライアント名] Kiểm tra toàn khoảng trắng | Màn hình Chỉnh sửa | Nhập Space & Lưu | '   ' | Lỗi: MSG-001 (Bắt buộc) | Validation | High |
| **TC-EDIT-045** | TVP-009 | M-01-edit | [クライアント名] Chữ Nhật (Full-width) | Màn hình Chỉnh sửa | Nhập chữ Nhật & Lưu | あいうえお | Lưu thành công | Validation | Medium |
| **TC-EDIT-046** | TVP-009 | M-01-edit | [クライアント名] Tiếng Việt | Màn hình Chỉnh sửa | Nhập tiếng Việt & Lưu | Công ty A | Lưu thành công | Validation | Medium |
| **TC-EDIT-047** | TVP-009 | M-01-edit | [クライアント名] Dạng số | Màn hình Chỉnh sửa | Nhập số & Lưu | 123456 | Lưu thành công | Validation | Low |
| **TC-EDIT-048** | TVP-009 | M-01-edit | [クライアント名] Ký tự đặc biệt | Màn hình Chỉnh sửa | Nhập biểu tượng & Lưu | @#$%^&* | Lưu thành công | Validation | Medium |
| **TC-EDIT-049** | TVP-009 | M-01-edit | [クライアント名] Biên - Max length | Màn hình Chỉnh sửa | Nhập 100 ký tự | 100 | Lưu thành công | Validation | Medium |
| **TC-EDIT-050** | TVP-009 | M-01-edit | [クライアント名] Biên - Quá Max | Màn hình Chỉnh sửa | Paste 101 ký tự | 101 | Chặn nhập hoặc báo lỗi MSG-003 | Validation | High |
| **TC-EDIT-051** | TVP-009 | M-01-edit | [クライアント名] Bảo mật - XSS | Màn hình Chỉnh sửa | Nhập script tag | <script> | Xử lý chuỗi thuần, không chạy script | Security | High |
| **TC-EDIT-052** | TVP-009 | M-01-edit | [クライアント名] Bảo mật - SQLi | Màn hình Chỉnh sửa | Nhập SQL payload | OR 1=1 | Xử lý chuỗi thuần, không lỗi query | Security | High |
| **TC-EDIT-053** | TVP-009 | M-01-edit | [クライアント名] Kiểm tra trùng tên | Màn hình Chỉnh sửa | Nhập tên đã có | Duplicate | Lỗi: MSG-005 (Trùng lặp) | Validation | High |
| **TC-EDIT-054** | TVP-012 | M-01-edit | [稼働状況] Kiểm tra load dữ liệu | Màn hình Chỉnh sửa | Quan sát UI | Dữ liệu DB | Hiển thị đúng trạng thái từ DB | Functional | High |
| **TC-EDIT-055** | TVP-012 | M-01-edit | [稼働状況] Thay đổi lựa chọn | Màn hình Chỉnh sửa | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-EDIT-056** | TVP-012 | M-01-edit | [稼働状況] Lưu thay đổi | Màn hình Chỉnh sửa | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-EDIT-057** | TVP-013 | M-01-edit | [店舗マスタ利用] Kiểm tra load dữ liệu | Màn hình Chỉnh sửa | Quan sát UI | Dữ liệu DB | Hiển thị đúng trạng thái từ DB | Functional | High |
| **TC-EDIT-058** | TVP-013 | M-01-edit | [店舗マスタ利用] Thay đổi lựa chọn | Màn hình Chỉnh sửa | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-EDIT-059** | TVP-013 | M-01-edit | [店舗マスタ利用] Lưu thay đổi | Màn hình Chỉnh sửa | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-EDIT-060** | TVP-013 | M-01-edit | [資材マスタ利用] Kiểm tra load dữ liệu | Màn hình Chỉnh sửa | Quan sát UI | Dữ liệu DB | Hiển thị đúng trạng thái từ DB | Functional | High |
| **TC-EDIT-061** | TVP-013 | M-01-edit | [資材マスタ利用] Thay đổi lựa chọn | Màn hình Chỉnh sửa | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-EDIT-062** | TVP-013 | M-01-edit | [資材マスタ利用] Lưu thay đổi | Màn hình Chỉnh sửa | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-EDIT-063** | TVP-013 | M-01-edit | [パレット用ラベル印刷] Kiểm tra load dữ liệu | Màn hình Chỉnh sửa | Quan sát UI | Dữ liệu DB | Hiển thị đúng trạng thái từ DB | Functional | High |
| **TC-EDIT-064** | TVP-013 | M-01-edit | [パレット用ラベル印刷] Thay đổi lựa chọn | Màn hình Chỉnh sửa | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-EDIT-065** | TVP-013 | M-01-edit | [パレット用ラベル印刷] Lưu thay đổi | Màn hình Chỉnh sửa | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-EDIT-066** | TVP-014 | M-01-edit | [配送センター] Kiểm tra load dữ liệu | Màn hình Chỉnh sửa | Quan sát UI | Dữ liệu DB | Hiển thị đúng trạng thái từ DB | Functional | High |
| **TC-EDIT-067** | TVP-014 | M-01-edit | [配送センター] Thay đổi lựa chọn | Màn hình Chỉnh sửa | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-EDIT-068** | TVP-014 | M-01-edit | [配送センター] Lưu thay đổi | Màn hình Chỉnh sửa | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-EDIT-069** | TVP-015 | M-01-edit | [配送方法] Kiểm tra load dữ liệu | Màn hình Chỉnh sửa | Quan sát UI | Dữ liệu DB | Hiển thị đúng trạng thái từ DB | Functional | High |
| **TC-EDIT-070** | TVP-015 | M-01-edit | [配送方法] Thay đổi lựa chọn | Màn hình Chỉnh sửa | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-EDIT-071** | TVP-015 | M-01-edit | [配送方法] Lưu thay đổi | Màn hình Chỉnh sửa | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-EDIT-072** | TVP-015 | M-01-edit | [運送会社] Kiểm tra load dữ liệu | Màn hình Chỉnh sửa | Quan sát UI | Dữ liệu DB | Hiển thị đúng trạng thái từ DB | Functional | High |
| **TC-EDIT-073** | TVP-015 | M-01-edit | [運送会社] Thay đổi lựa chọn | Màn hình Chỉnh sửa | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-EDIT-074** | TVP-015 | M-01-edit | [運送会社] Lưu thay đổi | Màn hình Chỉnh sửa | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-EDIT-075** | TVP-018 | M-01-edit | [送り先設定] Kiểm tra load dữ liệu | Màn hình Chỉnh sửa | Quan sát UI | Dữ liệu DB | Hiển thị đúng trạng thái từ DB | Functional | High |
| **TC-EDIT-076** | TVP-018 | M-01-edit | [送り先設定] Thay đổi lựa chọn | Màn hình Chỉnh sửa | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-EDIT-077** | TVP-018 | M-01-edit | [送り先設定] Lưu thay đổi | Màn hình Chỉnh sửa | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-EDIT-078** | TVP-018 | M-01-edit | [送り先(一か所)] Kiểm tra load dữ liệu | Màn hình Chỉnh sửa | Quan sát UI | Dữ liệu DB | Hiển thị đúng trạng thái từ DB | Functional | High |
| **TC-EDIT-079** | TVP-018 | M-01-edit | [送り先(一か所)] Thay đổi lựa chọn | Màn hình Chỉnh sửa | Chọn option khác | N/A | Lựa chọn thay đổi chính xác | UI | Medium |
| **TC-EDIT-080** | TVP-018 | M-01-edit | [送り先(一か所)] Lưu thay đổi | Màn hình Chỉnh sửa | Chọn & Nhấn Lưu | N/A | Dữ liệu mới được cập nhật vào DB | Data | High |
| **TC-ACT-081** | TVP-022 | M-01-edit | Chức năng Xóa - Click | Màn hình Edit | Nhấn nút Xóa | N/A | Hiển thị Modal MSG-011 | Action | High |
| **TC-ACT-082** | TVP-023 | M-01-edit | Chức năng Xóa - Xác nhận | Modal đang mở | Nhấn OK | N/A | Xóa thành công (delete_flag=1) | Action | High |
| **TC-ACT-083** | TVP-024 | M-01-edit | Chức năng Xóa - Ràng buộc | Có dữ liệu liên quan | Thực hiện xóa | Data | Lỗi: MSG-022 | Action | High |
| **TC-ACT-084** | TVP-021 | M-01-cud | Chức năng Hủy - Click | Đã sửa dữ liệu | Nhấn Hủy | N/A | Hiển thị Modal MSG-020 | Action | Medium |
| **TC-ACT-085** | TVP-020 | M-01-edit | Xung đột dữ liệu - Lock | 2 người dùng | Lưu sau | N/A | Lỗi: MSG-002 | Data | High |
