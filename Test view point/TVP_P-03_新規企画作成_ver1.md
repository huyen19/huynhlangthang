# TVP_P-03_新規企画作成_ver1.md

| Mục | Nội dung |
|---|---|
| **File** | TVP_P-03_新規企画作成_ver1.md |
| **Màn hình** | P-03 — 新規企画作成 |
| **URL** | `/plan/new` |
| **Tài liệu tham chiếu** | Requirements/P-03/P-03_新規企画作成.md · D-00_Message definition.md · 共通仕様_vi.md |
| **UI Mock** | Requirement/画面一覧_image/P-03_新規企画作成.png (FM資材管理システム_画面UIデザイン一覧表.md P-03行) |
| **Tổng số TVP** | 57 |

---

| ID TVP | Sub-section | Feature | TVP Description | Test Type | Priority | Method test |
|--------|-------------|---------|-----------------|-----------|----------|-------------|
| **SECTION 1 — INITIAL STATE (データ読み込み前)** |
| TVP-001 | UI | Page title | 画面タイトル「企画新規登録」が正しく表示される | UI | High | Manual |
| TVP-002 | UI | Upload instruction text | アップロード案内文 (No.2) が表示される。表示文言は Figma／実装に合わせること `[⚠️ Need Confirm: Figmaの文言確認]` | UI | Medium | Manual |
| TVP-003 | UI | Template download button | 「テンプレートダウンロード」ボタンが表示される | UI | Medium | Manual |
| TVP-004 | UI | File input button | 「ファイル参照」ボタンが表示される | UI | Medium | Manual |
| TVP-005 | UI | データ読み込み button — disabled state | ファイル未選択時、「データ読み込み」ボタンが **disabled** 状態になっている（クリック不可）(G-001) | UI | Critical | Manual |
| TVP-006 | UI | Initial hidden elements | 初期表示時、プレビュー (No.6)・「この企画を削除する」(No.7)・「登録する」(No.8)・エラー一覧 (No.9) は非表示 | UI | High | Manual |
| TVP-007 | UI | No cancel/back button | キャンセル・戻るボタンが存在しない (G-003) | UI | Low | Manual |
| **SECTION 2 — テンプレートダウンロード** |
| TVP-008 | Functional | Template download — success | 「テンプレートダウンロード」クリック → テンプレート Excel ファイルがダウンロードされる | Functional | Medium | Manual |
| TVP-009 | UI | Template button state | データ読み込み後もテンプレートダウンロードボタンが引き続き表示・操作可能 | UI | Low | Manual |
| **SECTION 3 — ファイル参照 (File Selection)** |
| TVP-010 | Functional | File selection via dialog | 「ファイル参照」クリック → OS ファイル選択ダイアログが開く | Functional | High | Manual |
| TVP-011 | Functional | File name display after selection | ファイル選択確定後、ファイル名が画面上に表示される (No.4 備考) `[⚠️ Need Confirm: 表示位置・truncate 有無 — G-028]` | Functional | Medium | Manual |
| TVP-012 | Functional | データ読み込み enabled after file selection | ファイル選択後、「データ読み込み」ボタンが enabled になる | Functional | Critical | Manual |
| TVP-013 | Functional | Drag & drop file upload | ドラッグ＆ドロップでファイルをアップロード領域に投下できる (G-004) | Functional | Medium | Manual |
| TVP-014 | Validation | File format rejection | `[⚠️ Need Confirm: 許可形式未定義 — G-013]` 非許可ファイル形式 (例: .txt, .pdf) をドラッグ or 参照した場合 → エラーまたは拒否される | Validation | High | Manual |
| TVP-015 | Validation | File size limit | `[⚠️ Need Confirm: サイズ上限未定義 — G-013]` 上限サイズを超えるファイル選択時にエラーが発生する | Validation | High | Manual |
| **SECTION 4 — データ読み込み処理** |
| TVP-016 | Functional | データ読み込み — happy path (all valid rows) | 有効な Excel ファイル選択 → 「データ読み込み」クリック → 読込成功 → プレビュー (No.6)・「この企画を削除する」(No.7)・「登録する」(No.8) が表示、エラー一覧 (No.9) は非表示 | Functional | Critical | Manual |
| TVP-017 | Functional | データ読み込み — failure (all rows invalid) | 全行がエラーの Excel → 読込失敗 → エラー一覧 (No.9) のみ表示、プレビュー・No.7・No.8 は非表示 | Functional | Critical | Manual |
| TVP-018 | Functional | Mixed result (valid + invalid rows) | 一部の行が有効、一部がエラーの Excel → 有効行はプレビュー表示、エラーはアップロード領域のエラーメッセージに表示。両エリアが同時に表示される (G-005) | Functional | Critical | Manual |
| TVP-019 | System Behavior | Double submit prevention | 「データ読み込み」処理中に再度クリックできない（二重押下防止 No.5） | User Behavior | High | Manual |
| TVP-020 | System Behavior | Loading state during 読み込み | 処理中に loading 状態を示す UI (spinner 等) が表示される `[⚠️ Need Confirm: UI詳細 — G-027]` | UI | Medium | Manual |
| TVP-021 | Functional | Re-load with new file | プレビュー表示後に別ファイルを選択して「データ読み込み」→ 旧プレビューが即座に消え、新しいロード結果に置き換わる (G-002) | Functional | High | Manual |
| TVP-022 | Functional | Re-load fails after preview | プレビュー表示後に無効ファイルで再読込 → エラー表示、旧プレビューは復元されない (G-002) | Functional | High | Manual |
| **SECTION 5 — ファイル Validation (File Level — Layer A)** |
| TVP-023 | Validation | Empty file (0 bytes) | 0 バイトのファイルをアップロード → エラーが表示される | Validation | High | Manual |
| TVP-024 | Validation | Header only, no data rows | ヘッダー行のみのファイル (データ行 0) → `[⚠️ Need Confirm: エラー or 合計0件でプレビュー? — G-023]` | Validation | High | Manual |
| TVP-025 | Validation | File size at max boundary | `[⚠️ Need Confirm: max 未定義 — G-013]` 上限ちょうどのサイズのファイル → 読込成功 | Validation | Medium | Manual |
| TVP-026 | Validation | File size exceeds max | `[⚠️ Need Confirm: max 未定義 — G-013]` 上限+1 バイトのファイル → エラーメッセージ表示 | Validation | High | Manual |
| TVP-027 | Validation | Row count at max boundary | `[⚠️ Need Confirm: 最大行数未定義 — G-013]` 最大行数ちょうどのファイル → 読込成功 | Validation | Medium | Manual |
| TVP-028 | Validation | Row count exceeds max | `[⚠️ Need Confirm: 最大行数未定義 — G-013]` 最大行数+1 行のファイル → エラーまたは拒否 | Validation | High | Manual |
| **SECTION 6 — ファイル Validation (Format/Structure Level — Layer B/C)** |
| TVP-029 | Validation | Wrong file format | 非 Excel 形式 (.txt, .csv 等) のファイル → エラー表示、プレビュー非表示 `[⚠️ Need Confirm: 許可形式 — G-013]` | Validation | High | Manual |
| TVP-030 | Validation | Missing required column | テンプレートの必須列が欠如したファイル → エラー一覧に欠如列が表示される `[⚠️ Need Confirm: 必須列一覧 — G-014, G-015]` | Validation | High | Manual |
| TVP-031 | Validation | Extra columns beyond template | テンプレートに存在しない余分な列を含むファイル → `[⚠️ Need Confirm: スキップ or エラー? — G-014]` | Edge Case | Medium | Manual |
| TVP-032 | Validation | Wrong column header name | ヘッダー行の列名が正しくないファイル → エラー表示 | Validation | Medium | Manual |
| **SECTION 7 — データ Validation (Data Level — Layer D / 配送センターID)** |
| TVP-033 | Validation | 配送センターID — valid ID (exists in master) | Excel の配送センターID がマスタに存在 → テキスト完全一致で照合 OK → 当該行がプレビューに表示 | Validation | Critical | Manual |
| TVP-034 | Validation | 配送センターID — not in master | Excel の配送センターID がマスタに存在しない → 当該行はプレビューに表示されない (§5) | Validation | Critical | Manual |
| TVP-035 | Validation | 配送センターID — partial match rejected | 配送センターID が部分一致のみ (例: マスタに "DC001" があるが Excel に "DC00" 入力) → 照合失敗、当該行非表示 (テキスト完全一致ルール) | Validation | High | Manual |
| TVP-036 | Validation | 配送センターID — case sensitivity | 配送センターID の大文字・小文字が異なる場合の照合挙動 `[⚠️ Need Confirm: 大文字小文字区別有無 — §5「テキスト完全一致」の解釈]` | Validation | Medium | Manual |
| TVP-037 | Validation | 配送センターID — empty/blank | Excel の配送センターID が空白の行 → エラー一覧に表示または行スキップ | Validation | High | Manual |
| TVP-038 | Validation | 数量 — validation rules | `[⚠️ Need Confirm: 数量の validation rule — G-019]` 数量が空、0、負値、非数値の各ケースの挙動 | Validation | High | Manual |
| TVP-039 | Validation | Other fields (エリア, パターン, 概要) | `[⚠️ Need Confirm: 他フィールドの validation rule — G-008, G-009]` エリアID・パターンID・概要のマスタ照合またはフォーマット検証 | Validation | High | Manual |
| **SECTION 8 — エラー一覧 (Error Display)** |
| TVP-040 | UI | エラー一覧 display format | エラー一覧テーブルの列 (行番号・項目名・エラー理由等) が正しく表示される `[⚠️ Need Confirm: 列定義・ソート順 — G-017]` | UI | Medium | Manual |
| TVP-041 | Edge Case | Large number of errors | ファイルに多数のエラー行がある場合 (例: 500 行エラー) のエラー一覧の表示・分ページ挙動 `[⚠️ Need Confirm: 分ページ有無 — G-017]` | Edge Case | Medium | Manual |
| TVP-042 | Negative | Error message codes | 各エラー種別に D-00 の正しいメッセージコードが表示される `[⚠️ Need Confirm: メッセージコードマッピング — G-018]` | Negative | High | Manual |
| **SECTION 9 — プレビュー表示 (No.6)** |
| TVP-043 | UI | Preview table columns | プレビューテーブルに正しい列 (エリア, 配送センターID, 配送センター名称, パターン, 概要, 数量 等) が表示される `[⚠️ Need Confirm: 全列リスト・順序 — G-015]` | UI | High | Manual |
| TVP-044 | UI | 合計数 calculation | プレビューに「合計数」が表示され、表示データに基づいて再計算される `[⚠️ Need Confirm: 合計数の計算ロジック (行数 or 数量合計) — G-011]` | UI | High | Manual |
| TVP-045 | Data | Preview shows only valid rows | マスタ照合 OK の行のみプレビューに表示; NG 行はプレビュー外 | Data | Critical | Manual |
| TVP-046 | Data | DB ↔ UI mapping (preview) | プレビューのデータが Excel から正しく読み取られ、各列の値が正確に表示される | Data | High | Manual |
| TVP-047 | Edge Case | Large preview data (pagination) | 大量の有効行がある場合 `[⚠️ Need Confirm: 分ページ有無・件数/ページ — G-026]` のプレビュー表示 | Edge Case | Medium | Manual |
| **SECTION 10 — 登録する (No.8)** |
| TVP-048 | Functional | 登録する — success | プレビュー有効状態で「登録する」クリック → 本登録完了 → P-01 企画詳細 (`/plan/{id}`) へ遷移 | Functional | Critical | Manual |
| TVP-049 | UI | 登録する button position | 「登録する」ボタンがフッター右側に表示される (No.8 備考) | UI | Medium | Manual |
| TVP-050 | UI | 登録する active only after success load | 「登録する」ボタンはプレビュー有効時のみ活性化 (No.8 バリデーション) | UI | High | Manual |
| TVP-051 | User Behavior | Double submit prevention (登録する) | 「登録する」処理中に再度クリックできない（二重送信防止 No.8） | User Behavior | High | Manual |
| **SECTION 11 — この企画を削除する (No.7)** |
| TVP-052 | Functional | Delete plan — confirmation dialog | 「この企画を削除する」クリック → 確認ダイアログが表示される `[⚠️ Need Confirm: ダイアログのタイトル・本文・ボタン文言 — G-029]` | Functional | High | Manual |
| TVP-053 | Functional | Delete plan — confirmed | 確認ダイアログで確認 → ドラフトデータが DB から削除 → T-01 企画の一覧 (TOP) へ遷移 (G-006, G-025) | Functional | High | Manual |
| TVP-054 | Functional | Delete plan — cancelled | 確認ダイアログでキャンセル → 削除処理なし、画面はプレビュー状態のまま | Functional | Medium | Manual |
| TVP-055 | UI | Delete button position | 「この企画を削除する」ボタンがフッター左側に表示される (No.7 備考) | UI | Medium | Manual |
| **SECTION 12 — データ永続化 & ライフサイクル** |
| TVP-056 | Data | Draft saved on successful load | データ読み込み成功時、データが DB にドラフトとして保存される (G-006) | Data | Critical | Manual |
| TVP-057 | Data | Draft deleted on navigation away | タブを閉じる・リフレッシュ・navigate away → ドラフトが DB から削除される; `/plan/new` 再アクセス時に initial state が表示される (G-007) | Data | High | Manual |
| **SECTION 13 — ネットワーク・エラーハンドリング** |
| TVP-058 | System Behavior | API timeout during データ読み込み | データ読み込み中にネットワークタイムアウト → エラーメッセージ表示 (toast/modal — 共通UIに合わせる) `[⚠️ Need Confirm: toast か modal か、timeout 閾値 — G-022]` | System Behavior | High | Manual |
| TVP-059 | System Behavior | Master API unavailable | 配送センターマスタ API がタイムアウト/エラーの場合 → 処理挙動とエラー表示 `[⚠️ Need Confirm: cancel or skip validation — G-020]` | System Behavior | High | Manual |
| TVP-060 | System Behavior | 登録する API failure (4xx/5xx) | 「登録する」クリック後に API がエラーを返す → エラーメッセージ表示、画面を閉じない | System Behavior | High | Manual |
| **SECTION 14 — セキュリティ** |
| TVP-061 | Security | SQL injection in file content | Excel 内にSQL injection 文字列 (`' OR 1=1--`) を含む行 → サニタイズされ、DB に影響しない | Security | High | Manual |
| TVP-062 | Security | XSS in file content | Excel 内に XSS payload (`<script>alert(1)</script>`) を含む行 → エスケープ/拒否され、UI に実行されない | Security | High | Manual |
| TVP-063 | Security | Unauthorized access | 「管理・物流」以外のロールのユーザーが `/plan/new` にアクセス → アクセス拒否または適切なリダイレクト `[⚠️ Need Confirm: 物流 role の権限詳細 — G-033]` | Security | High | Manual |
| **SECTION 15 — ユーザーインタラクション (User Behavior)** |
| TVP-064 | User Behavior | Refresh after preview | プレビュー表示後にページリフレッシュ → ドラフト削除 → `/plan/new` が initial state で表示される (G-007) | User Behavior | High | Manual |
| TVP-065 | User Behavior | Browser back after 登録 | 「登録する」成功後に P-01 から Browser Back → `/plan/new` は initial state (draft 削除済み) (G-024, G-007) | User Behavior | Medium | Manual |
| TVP-066 | User Behavior | File cancel in dialog | OS ダイアログでキャンセルした場合、ファイル選択状態が変更されない | User Behavior | Low | Manual |
| **SECTION 16 — 同時実行 (Concurrency)** |
| TVP-067 | Concurrency | Multiple users create plan simultaneously | 複数ユーザーが同時に `/plan/new` から企画作成 → データ競合・race condition が発生しない `[⚠️ Need Confirm: locking strategy — G-032]` | Edge Case | Medium | Manual |

---

## TVP Checklist — 18 mục

| # | Checklist Category | Trạng thái | Ghi chú |
|---|-------------------|-----------|---------|
| 1 | FUNCTIONAL (Happy Path) | ✔ | TVP-016, TVP-017, TVP-018, TVP-048, TVP-053 |
| 2 | INPUT VALIDATION (Field Level) | ✔ | TVP-023〜TVP-039 — Excel file validation & field-level (配送センターID, 数量, 他フィールドは Need Confirm) |
| 3 | BOUNDARY VALUE (BVA) | ✔ | TVP-025〜TVP-028 (file size/row count BVA); G-013 回答待ちのため exact value は Need Confirm |
| 4 | NEGATIVE CASE | ✔ | TVP-017, TVP-023, TVP-026, TVP-028〜TVP-032, TVP-034, TVP-037〜TVP-038, TVP-042 |
| 5 | USER BEHAVIOR (Real-world) | ✔ | TVP-064, TVP-065, TVP-066, TVP-019, TVP-051 |
| 6 | SYSTEM BEHAVIOR | ✔ | TVP-058, TVP-059, TVP-060 |
| 7 | DATA INTEGRITY | ✔ | TVP-045, TVP-046, TVP-056, TVP-057 |
| 8 | DB ↔ UI DATA MAPPING | ✔ | TVP-046 (preview mapping); TVP-044 (合計数) |
| 9 | INTEGRATION (API) | ✔ | TVP-059, TVP-060 — spec に API 言及あり (§5 マスタ照合・登録) |
| 10 | SECURITY (Basic) | ✔ | TVP-061, TVP-062, TVP-063 |
| 11 | UX/UI | ✔ | TVP-001〜TVP-007, TVP-040, TVP-043, TVP-044, TVP-049, TVP-050, TVP-055 |
| 12 | STATE & FLOW | ✔ | TVP-006, TVP-012, TVP-016, TVP-017, TVP-018, TVP-050, TVP-054 |
| 13 | CONCURRENCY (Advanced) | ✔ | TVP-019, TVP-051, TVP-067 |
| 14 | DATA LIFECYCLE | ✔ | TVP-056, TVP-057 (draft create/delete); TVP-052〜TVP-053 (delete) |
| 15 | SEARCH / FILTER / SORT | ✔ | N/A — 画面に検索・フィルター・ソート機能なし |
| 16 | PAGINATION / LARGE DATA | ✔ | TVP-047, TVP-041 — spec 未確定 (Need Confirm G-026, G-017) |
| 17 | CROSS-FIELD VALIDATION | ✔ | TVP-039 (パターン＞概要 関係 — G-008, G-009 Need Confirm) |
| 18 | IMPORT / EXPORT | ✔ | TVP-008 (template download), TVP-023〜TVP-039 (file import layers A〜E) |

---

## ⚠️ Các điểm cần làm rõ trước khi hoàn thiện TVP

| # | TVP ID liên quan | Nội dung cần xác nhận | Lý do không thể tự suy diễn |
|---|-----------------|----------------------|------------------------------|
| 1 | TVP-002 | アップロード案内文の具体的な表示文言 (No.2) | Spec ghi "Figmaに合わせる" — Figma未確認 (G-004 補足) |
| 2 | TVP-014, TVP-015, TVP-025, TVP-026, TVP-027, TVP-028, TVP-029 | ファイルの許可形式 (.xlsx/.xls/.csv 等)、最大サイズ (MB)、最大行数 | G-013: spec 参照先 BasicDesign/TOBE/DB に定義 — 未読 |
| 3 | TVP-011 | ファイル名表示位置・長い名前の truncate 挙動・キャンセル時の表示 | G-028 未回答 |
| 4 | TVP-024 | ヘッダーのみ (データ行 0) のファイル: エラー表示 or 合計数 0 でプレビュー表示？ | G-023 未回答 |
| 5 | TVP-030, TVP-031, TVP-032 | テンプレートの全必須列・オプション列・カラム順序 | G-014, G-015 未回答 |
| 6 | TVP-036 | 配送センターID 照合: 大文字小文字区別有無 | §5「テキスト完全一致」の解釈が曖昧 |
| 7 | TVP-038 | 数量フィールドの validation rule (必須・数値型・最大値・0/負値) | G-019 未回答 |
| 8 | TVP-039 | エリアID / パターンID / 概要 のマスタ照合または format validation の有無 | G-008, G-009 未回答 |
| 9 | TVP-040, TVP-041, TVP-042 | エラー一覧の列定義・ソート順・分ページ有無; 各エラー種別の D-00 メッセージコード | G-017, G-018 未回答 |
| 10 | TVP-043 | プレビューテーブルの完全な列リストと表示順序 | G-015 未回答 |
| 11 | TVP-044 | 合計数の計算ロジック (行数 or 数量合計 or 他) | G-011 未回答 |
| 12 | TVP-047 | プレビューの分ページ: 有無・件数/ページ (共通仕様 15/30/50 適用？) | G-026 未回答 |
| 13 | TVP-052 | 「この企画を削除する」確認ダイアログのタイトル・本文・ボタン文言・D-00 メッセージコード | G-029 未回答 |
| 14 | TVP-058 | データ読み込みタイムアウト時: toast か modal か; timeout 閾値 (秒); retry 有無 | G-022 未回答 |
| 15 | TVP-059 | 配送センターマスタ API が応答しない場合の挙動 (cancel / skip validation / エラー表示) | G-020 未回答 |
| 16 | TVP-063 | 「物流」ロールのみのユーザーが P-03 にアクセスした場合の挙動; 権限なし時のリダイレクト先 | G-033 未回答 |
| 17 | TVP-067 | 同時多重アクセス時の locking 戦略 (optimistic / pessimistic) の有無 | G-032 未回答 |
| 18 | TVP-020 | 処理中 loading UI: Flowbite Spinner 使用有無; ボタン disabled + spinner か overlay か | G-027 未回答 |

---

## Lịch sử tạo file

| Phiên bản | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.0 | 2026-05-06 | Tạo mới | HuyenNTK1 |
