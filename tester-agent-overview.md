# Tester Agent — Sơ đồ tổng quan

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TESTER MANUAL AGENT                          │
│              Điều phối toàn bộ testing workflow                     │
└─────────────────────────────────────────────────────────────────────┘
                               │
          Có thể vào từ bất kỳ bước nào (nếu có output bước trước)
                               │
    ╔══════════════════════════▼══════════════════════════╗
    ║  BƯỚC 1 │ write-test-viewpoints                     ║
    ║  8 góc nhìn: Functional / Boundary / Negative /     ║
    ║  State / RBAC / Data Integrity / UX / Integration   ║
    ║  Kiểm tra độ phủ 18 mục — output: bảng TVP         ║
    ╚══════════════════════════╦══════════════════════════╝
                               ║
                         [GATE ①] ◄─── User review & approve
                               ║
    ╔══════════════════════════▼══════════════════════════╗
    ║  BƯỚC 2 │ write-manual-tests                        ║
    ║  Sinh TC chuẩn từ TVP — đủ chi tiết để viết E2E    ║
    ╚══════════════════════════╦══════════════════════════╝
                               ║
                         [GATE ②] ◄─── User review & approve
                               ║
    ╔══════════════════════════▼══════════════════════════╗
    ║  BƯỚC 2b │ gen-tc-html                [TÙY CHỌN]   ║
    ║  Sinh HTML tracker để tester chạy tay trên browser  ║
    ╚════════════════╦═════════════════════════╦══════════╝
                     ║                         ║
   [click "Export XLS"]             [click "Export JSON"]
                     ║                         ║
    ╔════════════════▼════════════╗             ║
    ║  BƯỚC 2c          [TÙY CHỌN]║             ║
    ║  Export TC to Excel         ║             ║
    ║  for DEV self-test          ║             ║
    ╚═════════════════════════════╝             ║
                                               ║
    ╔══════════════════════════════════════════▼══════════╗
    ║  BƯỚC 3 │ sync-tc-results                           ║
    ║  Đồng bộ JSON report → cột Result (Auto / Manual)  ║
    ║  trong TC markdown theo TC ID                       ║
    ╚══════════════════════════╦══════════════════════════╝
                               ║
                         [GATE ③] ◄─── User review & approve
                               ║
                    ┌──────────┴──────────┐
                    │  Nếu có App Bug      │
         ╔══════════▼══════════╗  ╔═══════▼═══════════╗
         ║  BƯỚC 4 │ log-bugs  ║  ║  (Bỏ qua nếu     ║
         ║  → Backlog qua MCP  ║  ║   không có bug)   ║
         ║  sidecar JSON       ║  ╚═══════════════════╝
         ║  tránh log trùng    ║
         ╚══════════╦══════════╝
                    ║
              [GATE ④] ◄── User review danh sách bug đã tạo
                    ║
       [Tester click "Export XLS" trong HTML tracker]
                    ║
    ╔═══════════════▼═════════════════════════════════╗
    ║  BƯỚC 5 │ Export test result to Excel           ║
    ║  Xuất kết quả test → file .xls                  ║
    ║  Lưu vào test_result_export_xls_send_customer/  ║
    ╚═════════════════════════════════════════════════╝
```

## Output Structure

```
D-40_Testing/
  <subsystem>/                 ← mdm, benefits, staffing…
    <ScreenID_screen-name>/
      test_qa_clear_spec/      ← Gap analysis & Q&A
      test_viewpoint/          ← Bước 1
      test_cases_manual/       ← Bước 2  (.md)
      test_cases_manual_html/  ← Bước 2b (.html tracker)
      cr_analysis/             ← CR impact artifacts
      evidence/                ← Screenshot/video theo TC-ID
      report/                  ← playwright-report/
      test_result_export_json/ ← JSON export từ HTML tracker
      test_result_export_xls_send_customer/
```

## Guardrails cứng

- sync-tc-results: chỉ đọc JSON report, KHÔNG tự sửa TC
- Cài MCP backlog để có thể kết nối và log bug trực tiếp → Xem hướng dẫn tại tài liệu [https://docs.google.com/document/d/1Xm6rfLECua8xrZCgBQ2VS85PfCjU6C2wZXm6fVBWbIM/edit?tab=t.xis0o7iamiae](https://docs.google.com/document/d/1Xm6rfLECua8xrZCgBQ2VS85PfCjU6C2wZXm6fVBWbIM/edit?tab=t.xis0o7iamiae) 
- Chú ý: Khi chạy test manual để log bug đính kèm đúng ảnh theo TC fail thì cần lưu tên evidence đúng theo format : 
  - <TC ID>.*  → lưu trong thư mục evidence  
  Ví dụ: TC-HMCM-S01-003.png , TC-HMCM-S02-004-failed.jpg

- Cách sử dụng agent qua prompt như sau: 
       @tester.agent.md  <công việc cần làm> cho tài liệu/testcase,.... <đường dẫn file input đầu vào>
      **Mô tả thêm mong muốn, yêu cầu khác <nếu cần> 
 Ví dụ : @tester.agent.md write test view point cho tài liệu 
 BD: <path>
 UI: <path>
Chú ý: Thực tế khi chạy agent thì sẽ có nhiều GATE hơn (do có phần auto script nhưng chưa public phần này nên tạm thời bỏ qua và yêu cầu agent làm theo các step như trên sơ đồ

- Cũng có thể gọi trực tiếp skill cần làm /write-test-viewpoints cho tài liệu/testcase,.... <đường dẫn file input đầu vào>
