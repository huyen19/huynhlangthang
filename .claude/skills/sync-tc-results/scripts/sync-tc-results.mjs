#!/usr/bin/env node
/**
 * sync-tc-results.mjs
 *
 * Đồng bộ kết quả test ngược lại vào file TC markdown.
 *
 * Usage:
 *   # Manual: đọc JSON export từ HTML tracker → update cột Result (Manual)
 *   node sync-tc-results.mjs --source=manual --results=<path>.json --tc=<path>.md
 *
 *   # Auto: đọc Playwright JSON report → update cột Result (Auto)
 *   node sync-tc-results.mjs --source=auto --report=<playwright-results.json> --tc=<path>.md
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, basename } from 'path';

// ─── CLI args ────────────────────────────────────────────────────────────────
const params = {};
for (const arg of process.argv.slice(2)) {
  const eq = arg.indexOf('=');
  if (eq > 0) {
    params[arg.slice(2, eq)] = arg.slice(eq + 1);
  } else {
    params[arg.replace(/^--/, '')] = true;
  }
}

const { source, results, report, tc } = params;

if (!source || !tc) {
  console.error('Usage:');
  console.error('  node sync-tc-results.mjs --source=manual --results=<json> --tc=<md>');
  console.error('  node sync-tc-results.mjs --source=auto   --report=<playwright-results.json> --tc=<md>');
  process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const TC_RE = /^TC-[A-Za-z0-9][A-Za-z0-9_-]{2,}$/;
const TC_EXTRACT_RE = /TC-[A-Za-z0-9][A-Za-z0-9_-]{2,}/;

/**
 * Phát hiện index cột trong header markdown table theo tên cột (case-insensitive).
 * Trả về -1 nếu không tìm thấy.
 */
function findColIndex(headerLine, ...colNames) {
  const cells = headerLine.split('|').slice(1, -1).map(c => c.trim().toLowerCase());
  for (const name of colNames) {
    const idx = cells.findIndex(c => c === name.toLowerCase());
    if (idx !== -1) return idx;
  }
  return -1;
}

/**
 * Tìm dòng header của markdown table trong file.
 * Nếu truyền requiredCol, trả về table header đầu tiên có chứa cột đó (case-insensitive).
 * Nếu không truyền, trả về table header đầu tiên trong file.
 */
function findTableHeader(lines, requiredCol = null) {
  for (let i = 0; i < lines.length - 1; i++) {
    const cur = lines[i].trim();
    const next = lines[i + 1].trim();
    if (cur.startsWith('|') && /^\|[\s|:-]+\|$/.test(next)) {
      if (requiredCol === null) return { line: cur, lineIndex: i };
      const cells = cur.split('|').slice(1, -1).map(c => c.trim().toLowerCase());
      if (cells.includes(requiredCol.toLowerCase())) {
        return { line: cur, lineIndex: i };
      }
    }
  }
  return null;
}

/**
 * Cập nhật một cell trong dòng markdown table theo TC ID và colIndex (0-based từ TC ID).
 * Trả về dòng đã sửa, hoặc null nếu TC ID không match.
 */
function updateRowColumn(line, tcId, colIndex, value) {
  const cells = line.split('|');
  // cells[0] = '' (trước |), cells[1] = col0 (TC ID), ..., cells[n] = '' (sau |)
  const firstCell = cells[1]?.trim();
  if (firstCell !== tcId) return null;

  const cellArrayIdx = colIndex + 1; // +1 vì cells[0] = ''
  if (cellArrayIdx >= cells.length - 1) return null; // index vượt quá số cột

  cells[cellArrayIdx] = ' ' + value + ' ';
  return cells.join('|');
}

/**
 * Đọc và cập nhật file TC markdown.
 * tcUpdates: Map<tcId, value>
 * colIndex: 0-based column index tính từ TC ID
 */
function applyUpdatesToMd(mdPath, tcUpdates, colIndex) {
  const content = readFileSync(resolve(mdPath), 'utf-8');
  const lines = content.split('\n');

  // Validate: tìm header TC (có cột "TC ID") và kiểm tra colIndex hợp lệ
  const header = findTableHeader(lines, 'TC ID');
  if (!header) {
    console.error('ERROR: Không tìm thấy markdown table header có cột "TC ID" trong file:', mdPath);
    process.exit(1);
  }

  const headerCells = header.line.split('|').slice(1, -1);
  const colCount = headerCells.length;
  if (colIndex >= colCount) {
    console.error(`ERROR: colIndex=${colIndex} vượt quá số cột (${colCount}) trong file: ${mdPath}`);
    console.error(`Header: ${header.line}`);
    process.exit(1);
  }

  let updatedCount = 0;
  let notFoundIds = [];

  for (const [tcId, value] of tcUpdates) {
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim().startsWith('|')) continue;
      if (/^\s*\|[\s|:-]+\|\s*$/.test(line)) continue; // separator

      const updated = updateRowColumn(line, tcId, colIndex, value);
      if (updated !== null) {
        lines[i] = updated;
        updatedCount++;
        found = true;
        break;
      }
    }
    if (!found) notFoundIds.push(tcId);
  }

  writeFileSync(resolve(mdPath), lines.join('\n'), 'utf-8');
  return { updatedCount, notFoundIds };
}

// ─── Manual sync ─────────────────────────────────────────────────────────────
function mapManualStatus(status) {
  const map = {
    pass: 'PASS', fail: 'FAIL', impact: 'IMPACT',
    notrun: 'Not Run', open: 'Open', skip: 'Skip',
  };
  return map[String(status || '').toLowerCase()] || String(status || '');
}

function syncManual() {
  if (!results) {
    console.error('ERROR: --results=<json> là bắt buộc khi --source=manual');
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(resolve(results), 'utf-8'));
  // Hỗ trợ 2 format: { state: { tcId: { status } } } hoặc { tcId: { status } }
  const state = raw.state && typeof raw.state === 'object' ? raw.state : raw;

  // Đọc header để tìm colIndex của "Result (Manual)" hoặc "Status"
  const mdContent = readFileSync(resolve(tc), 'utf-8');
  const lines = mdContent.split('\n');
  const header = findTableHeader(lines, 'TC ID');
  if (!header) {
    console.error('ERROR: Không tìm thấy markdown table header có cột "TC ID" trong:', tc);
    process.exit(1);
  }
  const colIndex = findColIndex(header.line, 'Result (Manual)', 'Status');
  if (colIndex === -1) {
    console.error('ERROR: Không tìm thấy cột "Result (Manual)" hoặc "Status" trong header:');
    console.error(' ', header.line);
    process.exit(1);
  }

  const updates = new Map();
  for (const [tcId, entry] of Object.entries(state)) {
    if (!TC_RE.test(tcId)) continue;
    const value = mapManualStatus(entry.status);
    if (!value) continue;
    updates.set(tcId, value);
  }

  const { updatedCount, notFoundIds } = applyUpdatesToMd(tc, updates, colIndex);

  console.log(`[Manual sync] ${basename(tc)}`);
  console.log(`  Cột target : "${header.line.split('|').slice(1, -1)[colIndex].trim()}" (index ${colIndex})`);
  console.log(`  Updated    : ${updatedCount} TC`);
  if (notFoundIds.length > 0) {
    console.log(`  Not found  : ${notFoundIds.length} TC`);
    for (const id of notFoundIds) console.log(`    - ${id}`);
  }
}

// ─── Auto sync ───────────────────────────────────────────────────────────────
function mapAutoStatus(test) {
  // test.status = 'expected' | 'unexpected' | 'skipped' | 'flaky'
  if (test.status === 'expected') return 'PASS';
  if (test.status === 'unexpected') return 'FAIL';
  if (test.status === 'skipped') return 'Skip';
  // fallback: kiểm tra results[0].status
  const r = test.results && test.results[0];
  if (!r) return '';
  if (r.status === 'passed') return 'PASS';
  if (r.status === 'failed' || r.status === 'timedOut') return 'FAIL';
  if (r.status === 'skipped' || r.status === 'interrupted') return 'Skip';
  return '';
}

function extractPlaywrightResults(reportData) {
  const results = new Map();

  function walkSuites(suites) {
    if (!Array.isArray(suites)) return;
    for (const suite of suites) {
      walkSuites(suite.suites);
      if (!Array.isArray(suite.specs)) continue;
      for (const spec of suite.specs) {
        // TC ID có thể ở spec.title hoặc test.title
        const titles = [spec.title, ...(spec.tests || []).map(t => t.title || '')];
        let tcId = null;
        for (const title of titles) {
          const m = String(title || '').match(TC_EXTRACT_RE);
          if (m) { tcId = m[0]; break; }
        }
        if (!tcId) continue;

        // Lấy kết quả từ tests[0]
        const test = spec.tests && spec.tests[0];
        if (!test) continue;
        const value = mapAutoStatus(test);
        if (value) results.set(tcId, value);
      }
    }
  }

  walkSuites(reportData.suites);
  return results;
}

function syncAuto() {
  if (!report) {
    console.error('ERROR: --report=<playwright-results.json> là bắt buộc khi --source=auto');
    process.exit(1);
  }

  const reportData = JSON.parse(readFileSync(resolve(report), 'utf-8'));
  const autoResults = extractPlaywrightResults(reportData);

  if (autoResults.size === 0) {
    console.warn('WARNING: Không tìm thấy TC ID nào trong Playwright report.');
    console.warn('Kiểm tra: test title có chứa TC ID dạng TC-XXX-S01-001 không?');
    process.exit(0);
  }

  // Đọc header để tìm colIndex của "Result (Auto)"
  const mdContent = readFileSync(resolve(tc), 'utf-8');
  const lines = mdContent.split('\n');
  const header = findTableHeader(lines, 'TC ID');
  if (!header) {
    console.error('ERROR: Không tìm thấy markdown table header có cột "TC ID" trong:', tc);
    process.exit(1);
  }
  const colIndex = findColIndex(header.line, 'Result (Auto)');
  if (colIndex === -1) {
    console.error('ERROR: Không tìm thấy cột "Result (Auto)" trong header.');
    console.error('Hãy cập nhật file TC sang format 14 cột trước khi sync auto.');
    console.error('Header hiện tại:', header.line);
    process.exit(1);
  }

  const { updatedCount, notFoundIds } = applyUpdatesToMd(tc, autoResults, colIndex);

  const passCount = [...autoResults.values()].filter(v => v === 'PASS').length;
  const failCount = [...autoResults.values()].filter(v => v === 'FAIL').length;
  const skipCount = [...autoResults.values()].filter(v => v === 'Skip').length;

  console.log(`[Auto sync] ${basename(tc)}`);
  console.log(`  Cột target : "Result (Auto)" (index ${colIndex})`);
  console.log(`  From report: ${autoResults.size} TC (${passCount} PASS, ${failCount} FAIL, ${skipCount} Skip)`);
  console.log(`  Updated    : ${updatedCount} TC`);
  if (notFoundIds.length > 0) {
    console.log(`  Not found  : ${notFoundIds.length} TC`);
    for (const id of notFoundIds) console.log(`    - ${id}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
if (source === 'manual') {
  syncManual();
} else if (source === 'auto') {
  syncAuto();
} else {
  console.error(`ERROR: --source phải là "manual" hoặc "auto", nhận được: "${source}"`);
  process.exit(1);
}
