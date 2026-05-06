# Test View Point — M-01 Quản lý Client

| Mục | Nội dung |
|---|---|
| File | TVP_ClientManagement_ver1.md |
| Ngày tạo | 22/04/2026 |
| Tài liệu tham chiếu | [M-01_JP.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Requirements/M-01/M-01_%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E6%83%85%E5%A0%B1%E4%B8%80%E8%A6%A7_JP.md), [M-01-cud_JP.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Requirements/M-01/M-01-cud_%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%EF%BC%88%E8%BF%BD%E5%8A%A0%E3%83%BB%E7%B7%A8%E9%9B%86%E3%83%BB%E5%89%8A%E9%99%A4%EF%BC%89_JP.md), [TS_ClientManagement_ver1.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/TestStrategy/TS_ClientManagement_ver1.md) |

---

## 1. Lịch sử tạo file
| Phiên bản | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.0 | 2026-04-22 | Tạo mới | Senior QA Lead |

---

## 2. Bảng Quan điểm Kiểm thử (TVP)

| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-001** | M-01 | List Display | Kiểm tra hiển thị tiêu đề màn hình. [⚠️ Mock≠Spec: follow Spec: クライアント管理（一覧）] | UI | Low |
| **TVP-002** | M-01 | List Display | Kiểm tra hiển thị các cột ID, クライアント名称, ステータス, 編集. | UI | Medium |
| **TVP-003** | M-01 | List Display | Kiểm tra hiển thị Badge trạng thái. [⚠️ Need Confirm]: Nhãn là 稼働/停止 (Spec) hay 稼動中/休止中 (Mockup). | UI | Medium |
| **TVP-004** | M-01 | List Display | Kiểm tra hiển thị nút 「＋」 để chuyển sang màn hình đăng ký mới. [⚠️ Need Confirm]: Nút này chưa có trong Spec. | Functional | High |
| **TVP-005** | M-01 | List Display | Kiểm tra nút 「編集」 chuyển sang màn hình M-01-cud với đúng ID tương ứng. | Functional | High |
| **TVP-006** | M-01 | Pagination | Kiểm tra hiển thị phân trang khi dữ liệu vượt quá 50 records. | Pagination | Medium |
| **TVP-007** | M-01 | Pagination | Kiểm tra ẩn/hiện phân trang khi dữ liệu <= 50 records. [⚠️ Need Confirm]: Định nghĩa "từ trang 2 trở đi". | Pagination | Medium |
| **TVP-008** | M-01-cud | Form UI | Kiểm tra hiển thị tiêu đề màn hình (Thêm mới/Chỉnh sửa). [⚠️ Need Confirm]: Có hiển thị (id=X) như mockup? | UI | Low |
| **TVP-009** | M-01-cud | Validation | Kiểm tra `クライアント名` (No.2): bắt buộc nhập (MSG-001). | Validation | High |
| **TVP-010** | M-01-cud | Validation | Kiểm tra `クライアント名` (No.2): giới hạn 100 ký tự (sau khi trim). | Validation | Medium |
| **TVP-011** | M-01-cud | Validation | Kiểm tra `クライアント名` (No.2): [⚠️ Need Confirm] danh sách ký tự cấm (D-20). | Validation | Medium |
| **TVP-012** | M-01-cud | Business Logic | Kiểm tra `稼働状況` (No.3): trạng thái mặc định khi thêm mới (稼働). | Functional | Medium |
| **TVP-013** | M-01-cud | Business Logic | Kiểm tra các Group Flag (No.4,5,6): nhãn lựa chọn. [⚠️ Need Confirm]: あり/なし (Spec) hay する/しない (Mockup). | UI | Medium |
| **TVP-014** | M-01-cud | Business Logic | Kiểm tra mục 「配送センター」 (Sử dụng/Không sử dụng). [⚠️ Need Confirm]: Chưa có trong Spec. | Functional | High |
| **TVP-015** | M-01-cud | Business Logic | Kiểm tra `配送方法` (No.8): khi chọn `運送会社` thì hiển thị dropdown chọn Cty vận chuyển (No.8.1). | Functional | High |
| **TVP-016** | M-01-cud | Business Logic | Kiểm tra `配送方法` (No.8): khi chọn `チャーター利用` thì ẩn dropdown (No.8.1). | Functional | High |
| **TVP-017** | M-01-cud | Business Logic | Kiểm tra `送り先設定` (No.9): khi chọn `各センター` / `各店舗` thì ẩn dropdown (No.9.1). | Functional | High |
| **TVP-018** | M-01-cud | Business Logic | Kiểm tra `送り先設定` (No.9): khi chọn `一か所` thì hiển thị dropdown chọn Center (No.9.1). | Functional | High |
| **TVP-019** | M-01-cud | Action | Kiểm tra chức năng 「保存」 (No.12): lưu mới thành công và redirect về M-01. | Functional | High |
| **TVP-020** | M-01-cud | Action | Kiểm tra chức năng 「保存」 (No.12): hiển thị MSG-002 khi có xung đột (Optimistic Lock). | Functional | High |
| **TVP-021** | M-01-cud | Action | Kiểm tra chức năng 「キャンセル」 (No.10): confirm modal (MSG-020) và redirect về M-01. | Functional | Medium |
| **TVP-022** | M-01-cud | Action | Kiểm tra chức năng 「削除」 (No.11): confirm modal (MSG-011). | Functional | High |
| **TVP-023** | M-01-cud | Data Lifecycle | Kiểm tra chức năng 「削除」 (No.11): xóa logic thành công (update `delete_flag`, `delete_at`, `delete_by`). | Data | High |
| **TVP-024** | M-01-cud | Data Lifecycle | Kiểm tra chức năng 「削除」 (No.11): [⚠️ Need Confirm] MSG-022 khi Client đang được tham chiếu. | Data | High |

---

## 3. Thinking Approach Checklist

| # | Checklist Category | Trạng thái | Ghi chú |
|---|-------------------|-----------|---------|
| 1 | FUNCTIONAL (Happy Path) | ✔ | Đã cover luồng Thêm/Sửa/Xóa. |
| 2 | INPUT VALIDATION (Field Level) | ✔ | Đã cover Client Name (bắt buộc, độ dài). |
| 3 | BOUNDARY VALUE (BVA) | ✔ | Đã cover boundary cho Client Name (100 char). |
| 4 | NEGATIVE CASE | ✔ | Đã cover trùng lặp/xung đột data (G-020). |
| 5 | USER BEHAVIOR (Real-world) | ✔ | Đã cover Cancel action và Confirm modal. |
| 6 | SYSTEM BEHAVIOR | ✔ | Đã cover Redirect sau khi hành động. |
| 7 | DATA INTEGRITY | ✔ | Đã cover logic delete và referential integrity check. |
| 8 | DB ↔ UI DATA MAPPING | ✔ | Đã cover mapping các flag từ UI xuống DB. |
| 9 | INTEGRATION (API) | ✔ | Chưa cover do tài liệu không mô tả API cụ thể. |
| 10 | SECURITY (Basic) | ✖ | **Bổ sung TVP-025** về phân quyền (Admin-only). |
| 11 | UX/UI | ✔ | Đã cover tính nhất quán label/tiêu đề (Gaps). |
| 12 | STATE & FLOW | ✔ | Đã cover conditional display cho Radio/Dropdown. |
| 13 | CONCURRENCY (Advanced) | ✔ | Đã cover Optimistic Lock (MSG-002). |
| 14 | DATA LIFECYCLE | ✔ | Đã cover Soft delete. |
| 15 | SEARCH / FILTER / SORT | ✖ | N/A (Spec ghi rõ không hỗ trợ Search/Filter/Sort). |
| 16 | PAGINATION / LARGE DATA | ✔ | Đã cover logic hiển thị pagination. |
| 17 | CROSS-FIELD VALIDATION | ✔ | Đã cover sự phụ thuộc giữa 配送方法 và Dropdown liên quan. |

### Bổ sung TVP thiếu sót:
| ID TVP | Module | Feature | TVP Description | Test Type | Priority |
|---|---|---|---|---|---|
| **TVP-025** | M-01 | Authority | Kiểm tra truy cập màn hình: chỉ cho phép user có quyền ADMIN. User khác redirect về Dashboard. | Security | High |

---

## 4. ⚠️ Các điểm cần làm rõ trước khi hoàn thiện TVP

| # | TVP ID liên quan | Nội dung cần xác nhận | Lý do không thể tự suy diễn |
|---|-----------------|----------------------|------------------------------|
| 1 | TVP-003, TVP-013 | Thống nhất nhãn (label) cho trạng thái và các Flag. | Tránh inconsistency giữa Spec và UI thực tế. |
| 2 | TVP-004, TVP-014 | Xác nhận chức năng nút 「＋」 và trường 「配送センター」. | Những item này có trong Mockup nhưng thiếu trong Spec văn bản. |
| 3 | TVP-007 | Điều kiện ẩn hiện Pagination chính xác. | Spec ghi mơ hồ về trang thứ 2. |
| 4 | TVP-011 | Bộ ký tự cấm (D-20) cho Client Name. | Cần để thiết kế data test validation. |
