# Test Strategy — M-01 Quản lý Client

| Mục | Nội dung |
|---|---|
| File | TS_ClientManagement_ver1.md |
| Màn hình | M-01 Quản lý Client (Danh sách / Thêm / Sửa / Xóa) |
| Ngày tạo | 22/04/2026 |
| Phiên bản | 1.0 |
| Tài liệu tham chiếu | [M-01_JP.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Requirements/M-01/M-01_%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E6%83%85%E5%A0%B1%E4%B8%80%E8%A6%A7_JP.md), [M-01-cud_JP.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Requirements/M-01/M-01-cud_%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%EF%BC%88%E8%BF%BD%E5%8A%A0%E3%83%BB%E7%B7%A8%E9%9B%86%E3%83%BB%E5%89%8A%E9%99%A4%EF%BC%89_JP.md), [QA_M-01_ver1.md](file:///c:/Users/HuyenNTK1/OneDrive/Documents/HuyenNTK1/git_hblab/testing/Test%20Q&A/QA_M-01_ClientManagement_ver1.md) |

---

## 1. System Overview
Module **Quản lý Client** là trung tâm quản lý master data khách hàng. Nó lưu trữ các quy tắc nghiệp vụ quan trọng (sử dụng master data nào, phương thức vận chuyển, cấu hình điểm đi/đến) được sử dụng để điều hướng toàn bộ luồng xử lý của hệ thống (Area, Center, Plan).
- **Luồng chính**: Xem danh sách Client → Thêm mới/Chỉnh sửa cấu hình nghiệp vụ → Lưu trữ/Xóa logic.

## 2. Key Test Targets
| ID | Priority | Module/Tính năng | Lý do |
|---|---|---|---|
| T-01 | High | Cấu hình nghiệp vụ (Flags) | Quyết định luồng xử lý của các module khác (Material, Store, Plan). |
| T-02 | High | Chế độ hiển thị Pull-down | Trạng thái "Tạm dừng" phải ẩn Client khỏi các màn hình chọn khác ngay lập tức. |
| T-03 | High | Kiểm tra ràng buộc khi xóa | Ngăn chặn việc xóa Client đang được tham chiếu bởi dữ liệu giao dịch/master khác. |
| T-04 | Medium | Hiển thị danh sách & Phân trang | Đảm bảo hiệu năng load và hiển thị đúng trạng thái badge. |

## 3. Risk Assessment
| Loại rủi ro | Impact | Lý do & Ảnh hưởng |
|---|---|---|
| **Business** | High | Nếu cấu hình Flag (ví dụ: `use_material_master`) sai, toàn bộ luồng tạo Plan sẽ bị lỗi logic. |
| **Data** | Medium | Rủi ro vòng lặp FK (Circular FK) giữa `m_client` và `m_delivery_center` có thể gây lỗi khi insert dữ liệu ban đầu. |
| **Integration** | Medium | Các màn hình master khác (Area, Center) phụ thuộc vào trạng thái `ACTIVE/INACTIVE` của Client. Trễ trong việc cập nhật cache có thể gây sai sót. |
| **Technical** | Medium | Lỗi đồng thời (Optimistic Lock) khi nhiều Admin cùng sửa cấu hình một Client. |

## 4. Test Scope
- **In Scope**:
    - Toàn bộ các trường nhập liệu và validate trong màn hình M-01-cud.
    - Logic hiện/ẩn (Conditional display) cho Carrier/Charter và Điểm đi/đến.
    - Chức năng lưu (Success/Locking conflict).
    - Chức năng xóa logic (Confirmation modal & Referential check).
    - Hiển thị danh sách và Badge trạng thái.
- **Out of Scope**:
    - Kiểm thử hiệu năng hệ thống chịu tải cao (nằm trong phase Load Test chung).
    - Thiết kế giao diện chi tiết không ảnh hưởng chức năng (theo QA Policy).

## 5. Test Approach
- **Test Levels**:
    - **Integration Test**: Kiểm tra liên kết Client ↔ Center/Area/Plan.
    - **System Test**: Kiểm tra toàn bộ luồng từ tạo Client đến khi Client xuất hiện trong dropdown của module khác.
- **Test Types**:
    - **Functional Testing**: Validate logic nghiệp vụ và các flag.
    - **Data Validation**: Kiểm tra dữ liệu lưu đúng vào DB (Table `m_clients`).
    - **UI/UX Testing**: Kiểm tra tính nhất quán của tiêu đề, nhãn và modal confirmation.

## 6. Test Focus Areas
- **Critical Logic**: Kiểm tra sự thay đổi behavior của hệ thống khi bật/tắt các Flag nghiệp vụ.
- **Complex Validation**: Validate trường tên Client (trim, độ dài, ký tự đặc biệt).
- **Edge Cases**: Lưu Client khi session hết hạn hoặc khi dữ liệu đã bị Admin khác xóa.
- **High-risk Data**: Kiểm tra xóa Client đang có Center/Area/Store đang hoạt động.

## 7. Test Data Strategy
- **Key Data**: Bộ data Client hoàn chỉnh với đầy đủ các tổ hợp Flag khác nhau.
- **Edge Cases**:
    - Client có tên dài tối đa 100 ký tự.
    - Client đang được tham chiếu bởi rất nhiều dữ liệu con.
- **Dependencies**: Cần có sẵn dữ liệu Carrier Master (M-07) và Center Master (M-03).

## 8. Automation Strategy
- **Manual**: Các test case về giao diện, modal confirmation, và check badge màu sắc.
- **Automation (API)**: Tự động hóa kiểm tra validate field (max length, bắt buộc) và logic BE (Optimistic lock) để tái sử dụng cho các lần regression sau.

## 9. Entry / Exit Criteria
- **Entry**: Tài liệu spec M-01 đã được confirm các Gap High Risk; Môi trường test đã sẵn sàng với DB schema v3.1.
- **Exit**: 100% test case High/Medium Priority Pass; Không còn bug Critical/Major chưa xử lý.

## 10. Gaps & Questions

### Đã Confirmed
| Gap | Nội dung | Trạng thái |
|---|---|---|
| G-009 | Message khi xóa thất bại do ràng buộc | ✅ Confirmed từ D-00 (MSG-022) |
| G-010 | Giới hạn ký tự tên Client | ✅ Confirmed từ M-01-cud §3 (100 ký tự) |

### Chưa Confirmed — **Need confirm spec?**
| Gap | Nội dung | Impact nếu không confirm |
|---|---|---|
| G-001 | **Tiêu đề màn hình M-01** (Quản lý Client vs Danh sách Client) | Low - Ảnh hưởng tính nhất quán UI |
| G-002 | **Nhãn trạng thái** (稼働/停止 vs 稼動中/休止中) | Medium - Gây bối rối cho người dùng |
| G-003 | **Label của Radio button** (あり/なし vs する/しない) | Medium - Không nhất quán thiết kế |
| G-004 | **Trường "配送センター" (Sử dụng/Không sử dụng)** chưa có trong Spec | High - Thiếu logic nghiệp vụ quan trọng |
| G-005 | **Nút tạo mới (+)** chưa định nghĩa trong Spec | High - Thiếu luồng nghiệp vụ chính |
| G-006 | **Logic ẩn/hiện Phân trang** | Medium - Sai sót UI behavior |
| G-007 | **Hiển thị ID trên tiêu đề** (id=1) | Low - UI/UX không chuyên nghiệp |
| G-008 | **Danh sách ký tự cấm** cho tên Client | Medium - Rủi ro bảo mật/lỗi DB |
