#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2] || path.join(__dirname, 'TC_DSP-BENEFIT-12_HMCM_v2.md');
const outputPath = process.argv[3] || inputPath.replace(/\.md$/, '.html');

const baseName = path.basename(inputPath).replace(/\.md$/i, '');
const storageKey = 'tc_state__' + baseName.replace(/[^A-Za-z0-9_-]+/g, '_');

const md = fs.readFileSync(inputPath, 'utf8');
const lines = md.split(/\r?\n/);

const titleMatch = md.match(/^# (.+)$/m);
const docTitle = titleMatch ? titleMatch[1].trim() : 'Test Cases';

const screenMatch = md.match(/\*\*Màn hình\*\*\s*\|\s*([^|]+)/);
const screenName = screenMatch ? screenMatch[1].trim() : '';

const versionMatch = md.match(/\*\*Phiên bản TVP\*\*\s*\|\s*([^|]+)/);
const tvpVersion = versionMatch ? versionMatch[1].trim() : '';

const testCases = [];
let currentSection = null;
let currentSubGroup = null;
let inTable = false;
const TC_RE = /^TC-[A-Za-z0-9][A-Za-z0-9_-]{2,}$/;

for (const line of lines) {
  const t = line.trim();

  const sectionMatch = t.match(/^##\s+(.+?)\s*$/);
  if (sectionMatch) {
    currentSection = sectionMatch[1].trim();
    currentSubGroup = null;
    inTable = false;
    continue;
  }
  const subMatch = t.match(/^###\s+(.+)/);
  if (subMatch) {
    currentSubGroup = subMatch[1].trim();
    inTable = false;
    continue;
  }

  if (/^\|\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/.test(t)) {
    inTable = true;
    continue;
  }

  if (t.startsWith('|') && inTable) {
    const cells = t.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());
    if (cells.length >= 13 && TC_RE.test(cells[0])) {
      testCases.push({
        tcId: cells[0],
        tvpId: cells[1],
        subSection: cells[2],
        section: currentSection || '',
        subGroup: currentSubGroup || '',
        description: cells[3],
        preconditions: cells[4],
        steps: cells[5],
        data: cells[6],
        expected: cells[7],
        type: cells[8],
        priority: cells[9],
        actualSpec: cells[10],
        statusSpec: cells[11],
        note: cells[12],
      });
    }
  }
}

console.log(`Parsed ${testCases.length} test cases.`);

function escHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);
let dataJson = JSON.stringify(testCases);
dataJson = dataJson
  .split('</').join('<\\/')
  .split(LS).join('\\u2028')
  .split(PS).join('\\u2029');

const meta = {
  docTitle,
  screenName,
  tvpVersion,
  sourceFile: path.basename(inputPath),
  storageKey,
  total: testCases.length,
  generatedAt: new Date().toISOString(),
};
let metaJson = JSON.stringify(meta);
metaJson = metaJson.split('</').join('<\\/');

const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(docTitle)}</title>
<style>
  *,*::before,*::after { box-sizing: border-box; }
  html,body { margin:0; padding:0; }
  body {
    font-family: -apple-system, "Segoe UI", "Hiragino Sans", "Yu Gothic UI", system-ui, sans-serif;
    background:#f1f5f9; color:#0f172a; line-height:1.45; font-size: 13px;
  }

  /* ============ HEADER ============ */
  header.app-header {
    position: sticky; top: 0; z-index: 60;
    background: linear-gradient(180deg,#ffffff 0%, #fbfdff 100%);
    border-bottom: 1px solid #e2e8f0;
    padding: 10px 16px 8px;
    box-shadow: 0 1px 4px rgba(15,23,42,0.04);
  }
  .header-row { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; flex-wrap:wrap; }
  .header-title h1 { font-size: 15px; font-weight:700; margin:0 0 2px; color:#0f172a; }
  .header-title .sub { font-size: 11.5px; color:#64748b; }
  .header-title .sub b { color:#334155; }

  .stats { display:flex; gap:6px; flex-wrap:wrap; }
  .stat-card {
    background:#fff; border:1px solid #e2e8f0; border-radius:7px;
    padding:5px 11px; min-width:72px; text-align:center;
    transition: transform .12s;
  }
  .stat-card:hover { transform: translateY(-1px); }
  .stat-card .lbl { font-size: 9.5px; color:#64748b; text-transform:uppercase; letter-spacing:.5px; font-weight:600; }
  .stat-card .val { font-size: 16px; font-weight:700; color:#0f172a; line-height:1.1; margin-top:1px; }
  .stat-card .pct { font-size: 9.5px; color:#94a3b8; margin-top:1px; }
  .stat-total   { border-top:3px solid #1e293b; }
  .stat-pass    { border-top:3px solid #10b981; }
  .stat-fail    { border-top:3px solid #ef4444; }
  .stat-impact  { border-top:3px solid #f59e0b; }
  .stat-notrun  { border-top:3px solid #6b7280; }
  .stat-open    { border-top:3px solid #3b82f6; }

  .progress-wrap { margin-top: 8px; display:flex; align-items:center; gap:10px; }
  .progress-bar { flex:1; height:7px; background:#e2e8f0; border-radius:4px; overflow:hidden; display:flex; }
  .progress-bar > span { height:100%; transition: width .3s; }
  .progress-bar .pf-pass    { background:#10b981; }
  .progress-bar .pf-fail    { background:#ef4444; }
  .progress-bar .pf-impact  { background:#f59e0b; }
  .progress-bar .pf-notrun  { background:#6b7280; }
  .progress-text { font-size:11.5px; color:#475569; font-weight:600; min-width:140px; text-align:right; }

  /* ============ FILTER BAR ============ */
  .filter-bar {
    background:#fff; padding:8px 16px;
    border-bottom:1px solid #e2e8f0;
    display:flex; gap:6px; flex-wrap:wrap; align-items:center;
    position: sticky; top: 0; z-index: 50;
  }
  .filter-bar input, .filter-bar select {
    padding: 5px 9px; border:1px solid #cbd5e1; border-radius:5px;
    font-size: 12.5px; font-family:inherit; background:#fff; color:#0f172a;
  }
  .filter-bar input[type="search"] { flex:1; min-width:200px; max-width:380px; }
  .filter-bar input[type="search"]:focus, .filter-bar select:focus {
    outline:none; border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.15);
  }
  .filter-bar .btn {
    padding: 5px 11px; border:1px solid #cbd5e1; background:#fff;
    border-radius:5px; cursor:pointer; font-size:12.5px; color:#0f172a;
    transition: background .12s;
  }
  .filter-bar .btn:hover { background:#f8fafc; }
  .filter-bar .btn-primary { background:#1e40af; color:#fff; border-color:#1e40af; }
  .filter-bar .btn-primary:hover { background:#1e3a8a; }
  .filter-bar .btn-danger { color:#b91c1c; border-color:#fecaca; }
  .filter-bar .btn-danger:hover { background:#fef2f2; }
  .result-count { font-size:11.5px; color:#64748b; margin-left:auto; }

  /* section collapse toggle */
  .section-fold { display:flex; gap:2px; border:1px solid #cbd5e1; border-radius:5px; overflow:hidden; }
  .section-fold button {
    background:#fff; border:none; padding: 5px 9px;
    cursor:pointer; font-size: 11.5px; color:#475569;
    font-family: inherit;
  }
  .section-fold button:hover { background:#f8fafc; }

  /* ============ MAIN ============ */
  main { padding: 12px 16px 60px; }

  .section-block { margin-bottom: 22px; }

  .section-header {
    margin: 0 0 6px;
    padding: 6px 12px;
    background: #1e293b; color: #fff;
    border-radius: 6px 6px 0 0;
    font-size: 13px; font-weight: 600; letter-spacing: .3px;
    display:flex; justify-content:space-between; align-items:center;
    cursor: pointer; user-select: none;
  }
  .section-header .sec-count { font-size: 11.5px; opacity: .85; font-weight: 500; }
  .section-header .toggle-icon {
    display: inline-block; margin-right: 6px; font-size: 14px;
    transition: transform .2s; line-height: 1; flex-shrink: 0;
  }
  .section-block.collapsed .toggle-icon { transform: rotate(-90deg); }
  .section-block.collapsed .table-wrap { display: none; }

  /* subgroup collapse */
  tr.subgroup-row { cursor: pointer; user-select: none; }
  .sg-toggle-icon {
    display: inline-block; margin-right: 5px; font-size: 11px;
    transition: transform .2s; line-height: 1;
  }
  tbody.subgroup-block.collapsed .sg-toggle-icon { transform: rotate(-90deg); }
  tbody.subgroup-block.collapsed tr.tc-row { display: none; }

  .table-wrap {
    background:#fff; border:1px solid #e2e8f0;
    border-top: none; border-radius: 0 0 6px 6px;
    overflow-x: auto;
  }

  table.tc-table {
    width: 100%;
    min-width: 1900px;
    border-collapse: collapse;
    font-size: 12px;
    table-layout: fixed;
  }
  table.tc-table thead th {
    background: #f1f5f9;
    border-bottom: 2px solid #cbd5e1;
    padding: 7px 8px;
    text-align: left;
    font-weight: 700;
    color: #334155;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: .4px;
    position: sticky; top: 0;
    z-index: 5;
    white-space: nowrap;
  }
  table.tc-table tbody td {
    padding: 7px 8px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  table.tc-table tbody tr.subgroup-row td {
    background: #eef2ff;
    color: #3730a3;
    font-weight: 600;
    font-size: 11.5px;
    padding: 5px 10px;
    text-transform: uppercase;
    letter-spacing: .4px;
    border-bottom: 1px solid #c7d2fe;
  }
  table.tc-table tbody tr.tc-row { transition: background .08s; }
  table.tc-table tbody tr.tc-row:hover td { background: #fafbfc; }

  /* row status colors (left border via first cell) */
  tr.tc-row td.col-tcid { border-left: 4px solid #93c5fd; }
  tr.tc-row.s-pass    td.col-tcid { border-left-color: #10b981; }
  tr.tc-row.s-fail    td.col-tcid { border-left-color: #ef4444; }
  tr.tc-row.s-impact  td.col-tcid { border-left-color: #f59e0b; }
  tr.tc-row.s-notrun  td.col-tcid { border-left-color: #6b7280; }
  tr.tc-row.s-open    td.col-tcid { border-left-color: #3b82f6; }

  /* column widths */
  .col-tcid     { width: 130px; }
  .col-tvp      { width: 78px; }
  .col-subsec   { width: 100px; }
  .col-pri      { width: 75px; }
  .col-type     { width: 85px; }
  .col-desc     { width: 220px; }
  .col-pre      { width: 175px; }
  .col-steps    { width: 220px; }
  .col-data     { width: 115px; }
  .col-expected { width: 220px; }
  .col-specnote { width: 180px; }
  .col-status   { width: 105px; }
  .col-actual   { width: 180px; }
  .col-mynote   { width: 160px; }

  /* multi-line content */
  .multi-line > div + div { margin-top: 2px; }
  .muted { color:#94a3b8; }

  /* badges */
  .badge {
    display:inline-block; padding: 1px 6px; border-radius:4px;
    font-size: 10.5px; font-weight:700; white-space:nowrap; line-height:1.5;
  }
  .badge-tc  { background:#1e40af; color:#fff; font-family: ui-monospace, "Cascadia Code", Consolas, monospace; }
  .badge-tvp { background:#6366f1; color:#fff; font-family: ui-monospace, "Cascadia Code", Consolas, monospace; }
  .badge-pri-Critical { background:#dc2626; color:#fff; }
  .badge-pri-High     { background:#ea580c; color:#fff; }
  .badge-pri-Medium   { background:#d97706; color:#fff; }
  .badge-pri-Low      { background:#65a30d; color:#fff; }
  .badge-type { background:#e2e8f0; color:#334155; }

  code.inline-code {
    background:#eef2ff; color:#3730a3;
    padding:1px 5px; border-radius:3px;
    font-family: ui-monospace, Consolas, monospace; font-size: 11px;
  }

  /* status select */
  .status-select {
    width: 100%;
    padding: 4px 6px; border:1px solid #cbd5e1; border-radius:5px;
    font-size: 11.5px; font-weight:700; cursor:pointer;
    font-family: inherit;
  }
  .status-select.s-pass    { background:#d1fae5; color:#065f46; border-color:#10b981; }
  .status-select.s-fail    { background:#fee2e2; color:#991b1b; border-color:#ef4444; }
  .status-select.s-impact  { background:#fef3c7; color:#92400e; border-color:#f59e0b; }
  .status-select.s-notrun  { background:#f3f4f6; color:#374151; border-color:#9ca3af; }
  .status-select.s-open    { background:#eff6ff; color:#1d4ed8; border-color:#3b82f6; }

  /* textareas in cells */
  td textarea {
    width: 100%;
    min-height: 50px;
    padding: 5px 7px;
    border:1px solid #cbd5e1; border-radius: 4px;
    font-size: 11.5px; font-family: inherit;
    resize: vertical;
    background:#fff; color:#0f172a;
    line-height: 1.4;
  }
  td textarea:focus {
    outline:none; border-color:#3b82f6;
    box-shadow:0 0 0 2px rgba(59,130,246,.15);
  }
  /* Note cell: single editable textarea (seeded with spec note on first load) */
  td.col-specnote textarea.note-edit {
    min-height: 60px;
    font-size: 11px;
    line-height: 1.45;
  }
  td.col-specnote textarea.note-edit::placeholder { color:#94a3b8; font-style: italic; }

  /* Actual is required when status = Fail */
  td textarea.required-empty {
    border-color:#ef4444; background:#fef2f2;
    box-shadow: 0 0 0 1px #fecaca inset;
  }
  td textarea.required-empty::placeholder { color:#ef4444; opacity:.85; }
  tr.tc-row.needs-actual td.col-actual::after {
    content: '⚠ Required';
    display: block;
    margin-top: 3px;
    font-size: 10px; font-weight: 700; color: #b91c1c;
  }

  /* hidden */
  .hidden { display:none !important; }

  /* empty state */
  .empty-state {
    text-align:center; padding: 60px 20px; color:#94a3b8; font-size: 14px;
  }

  /* toast */
  .toast {
    position: fixed; bottom: 20px; right: 20px; z-index: 100;
    background: #0f172a; color: #fff;
    padding: 10px 16px; border-radius: 6px;
    font-size: 13px;
    opacity: 0; transform: translateY(8px);
    transition: opacity .2s, transform .2s;
    pointer-events: none;
  }
  .toast.show { opacity:1; transform: translateY(0); }
</style>
</head>
<body>

<header class="app-header">
  <div class="header-row">
    <div class="header-title">
      <h1>${escHtml(docTitle)}</h1>
      <div class="sub">
        ${screenName ? `<b>Màn hình:</b> ${escHtml(screenName)}` : ''}
        ${tvpVersion ? ` &nbsp;·&nbsp; <b>TVP:</b> ${escHtml(tvpVersion)}` : ''}
      </div>
    </div>
    <div class="stats">
      <div class="stat-card stat-total"><div class="lbl">Total</div><div class="val" id="st-total">0</div></div>
      <div class="stat-card stat-pass"><div class="lbl">Pass</div><div class="val" id="st-pass">0</div><div class="pct" id="st-pass-pct">0%</div></div>
      <div class="stat-card stat-fail"><div class="lbl">Fail</div><div class="val" id="st-fail">0</div><div class="pct" id="st-fail-pct">0%</div></div>
      <div class="stat-card stat-impact"><div class="lbl">Impact</div><div class="val" id="st-impact">0</div></div>
      <div class="stat-card stat-notrun"><div class="lbl">Not Run</div><div class="val" id="st-notrun">0</div></div>
      <div class="stat-card stat-open"><div class="lbl">Open</div><div class="val" id="st-open">0</div></div>
    </div>
  </div>
  <div class="progress-wrap">
    <div class="progress-bar">
      <span class="pf-pass"    id="pf-pass"    style="width:0%"></span>
      <span class="pf-fail"    id="pf-fail"    style="width:0%"></span>
      <span class="pf-impact"  id="pf-impact"  style="width:0%"></span>
      <span class="pf-notrun"  id="pf-notrun"  style="width:0%"></span>
    </div>
    <div class="progress-text" id="progress-text">0% tested</div>
  </div>
</header>

<div class="filter-bar">
  <input type="search" id="search" placeholder="🔍 Tìm theo TC ID, mô tả, steps, expected... (phím /)" autocomplete="off">
  <select id="filter-section"><option value="">All sections</option></select>
  <select id="filter-status">
    <option value="">All status</option>
    <option value="open">Open</option>
    <option value="pass">Pass</option>
    <option value="fail">Fail</option>
    <option value="impact">Impact</option>
    <option value="notrun">Not Run</option>
  </select>
  <select id="filter-priority"><option value="">All priority</option></select>
  <select id="filter-type"><option value="">All type</option></select>
  <span class="section-fold" title="Thu gọn / Mở rộng tất cả section">
    <button id="btn-expand-all" type="button">▾ Expand All</button>
    <button id="btn-collapse-all" type="button">▸ Collapse All</button>
  </span>
  <button class="btn btn-primary" id="btn-export">Export JSON</button>
  <button class="btn" id="btn-export-csv">Export XLS</button>
  <button class="btn" id="btn-export-md">Export MD</button>
  <button class="btn" id="btn-import">Import</button>
  <button class="btn btn-danger" id="btn-reset">Reset</button>
  <input type="file" id="import-file" accept=".json" style="display:none">
  <span class="result-count" id="result-count"></span>
</div>

<main id="main"></main>

<div class="toast" id="toast"></div>

<script>
const META = ${metaJson};
const TEST_DATA = ${dataJson};
const STORAGE_KEY = META.storageKey || ('tc_state__' + (META.sourceFile || 'default'));

const STATUS_OPTIONS = [
  { value: 'open',   label: 'Open'    },
  { value: 'pass',   label: 'Pass'    },
  { value: 'fail',   label: 'Fail'    },
  { value: 'impact', label: 'Impact'  },
  { value: 'notrun', label: 'Not Run' },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}
let STATE = loadState();
function getEntry(tcId) {
  if (!STATE[tcId]) STATE[tcId] = { status: 'open', actual: '', userNote: '' };
  return STATE[tcId];
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 1800);
}

function escHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function renderInlineMd(text) {
  if (!text) return '';
  let html = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  html = html.replace(/&lt;br\\s*\\/?&gt;/gi, '\\n');
  html = html.replace(/\`([^\`]+)\`/g, '<code class="inline-code">$1</code>');
  html = html.replace(/\\*\\*([^*]+)\\*\\*/g, '<b>$1</b>');
  return html;
}

function renderMultiline(text) {
  if (!text || !String(text).trim()) return '<span class="muted">—</span>';
  const parts = String(text).split(/<br\\s*\\/?>/i).map(l => l.trim()).filter(Boolean);
  if (parts.length === 0) return '<span class="muted">—</span>';
  if (parts.length === 1) return renderInlineMd(parts[0]);
  return '<div class="multi-line">' + parts.map(l => '<div>' + renderInlineMd(l) + '</div>').join('') + '</div>';
}

const main = document.getElementById('main');

const COLUMNS = [
  { key: 'tcid',     label: 'TC ID',         cls: 'col-tcid' },
  { key: 'tvp',      label: 'TVP',           cls: 'col-tvp' },
  { key: 'subsec',   label: 'Sub-sec',       cls: 'col-subsec' },
  { key: 'desc',     label: 'Description',   cls: 'col-desc' },
  { key: 'pre',      label: 'Preconditions', cls: 'col-pre' },
  { key: 'steps',    label: 'Test Steps',    cls: 'col-steps' },
  { key: 'data',     label: 'Test Data',     cls: 'col-data' },
  { key: 'expected', label: 'Expected',      cls: 'col-expected' },
  { key: 'specnote', label: 'Note',          cls: 'col-specnote' },
  { key: 'status',   label: 'Status',        cls: 'col-status' },
  { key: 'actual',   label: 'Actual',        cls: 'col-actual' },
  { key: 'pri',      label: 'Priority',      cls: 'col-pri' },
  { key: 'type',     label: 'Type',          cls: 'col-type' },
];

function buildFilterOptions() {
  const sectionSet = new Map();
  const prioSet = new Set();
  const typeSet = new Set();
  for (const tc of TEST_DATA) {
    if (tc.section) sectionSet.set(tc.section, true);
    if (tc.priority) prioSet.add(tc.priority);
    if (tc.type) typeSet.add(tc.type);
  }
  const secEl = document.getElementById('filter-section');
  for (const s of sectionSet.keys()) {
    const o = document.createElement('option');
    o.value = s; o.textContent = s.length > 50 ? s.slice(0, 50) + '…' : s;
    secEl.appendChild(o);
  }
  const prioEl = document.getElementById('filter-priority');
  const prioOrder = ['Critical', 'High', 'Medium', 'Low'];
  const prios = [...prioSet].sort((a,b) => {
    const ia = prioOrder.indexOf(a), ib = prioOrder.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  for (const p of prios) {
    const o = document.createElement('option');
    o.value = p; o.textContent = p;
    prioEl.appendChild(o);
  }
  const typeEl = document.getElementById('filter-type');
  for (const t of [...typeSet].sort()) {
    const o = document.createElement('option');
    o.value = t; o.textContent = t;
    typeEl.appendChild(o);
  }
}

function buildLayout() {
  const grouped = new Map();
  for (const tc of TEST_DATA) {
    const sec = tc.section || '(no section)';
    if (!grouped.has(sec)) grouped.set(sec, new Map());
    const sub = tc.subGroup || '';
    const subMap = grouped.get(sec);
    if (!subMap.has(sub)) subMap.set(sub, []);
    subMap.get(sub).push(tc);
  }

  const frag = document.createDocumentFragment();
  for (const [sec, subMap] of grouped) {
    const secCount = [...subMap.values()].reduce((a, arr) => a + arr.length, 0);
    const block = document.createElement('div');
    block.className = 'section-block';
    block.dataset.section = sec;

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = '<span><span class="toggle-icon">▾</span>' + escHtml(sec) + '</span><span class="sec-count">' + secCount + ' TC</span>';
    if (getCollapsedSections().has(sec)) block.classList.add('collapsed');
    header.addEventListener('click', () => {
      const isCollapsed = block.classList.toggle('collapsed');
      const set = getCollapsedSections();
      if (isCollapsed) set.add(sec); else set.delete(sec);
      saveCollapsedSections(set);
    });
    block.appendChild(header);

    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    const table = document.createElement('table');
    table.className = 'tc-table';

    // colgroup for fixed widths
    const colgroup = document.createElement('colgroup');
    for (const c of COLUMNS) {
      const col = document.createElement('col');
      col.className = c.cls;
      colgroup.appendChild(col);
    }
    table.appendChild(colgroup);

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (const c of COLUMNS) {
      const th = document.createElement('th');
      th.className = c.cls;
      th.textContent = c.label;
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    for (const [sub, tcs] of subMap) {
      const tbody = document.createElement('tbody');
      tbody.className = 'subgroup-block';
      tbody.dataset.subgroup = sub || '__none__';
      if (sub) {
        const subRow = document.createElement('tr');
        subRow.className = 'subgroup-row';
        const td = document.createElement('td');
        td.colSpan = COLUMNS.length;
        td.innerHTML = '<span class="sg-toggle-icon">▾</span>' + escHtml(sub);
        const sgKey = sec + '::' + sub;
        tbody.dataset.section = sec;
        if (getCollapsedSubgroups().has(sgKey)) tbody.classList.add('collapsed');
        subRow.addEventListener('click', () => {
          const isCollapsed = tbody.classList.toggle('collapsed');
          const set = getCollapsedSubgroups();
          if (isCollapsed) set.add(sgKey); else set.delete(sgKey);
          saveCollapsedSubgroups(set);
        });
        subRow.appendChild(td);
        tbody.appendChild(subRow);
      }
      for (const tc of tcs) tbody.appendChild(buildRow(tc));
      table.appendChild(tbody);
    }

    wrap.appendChild(table);
    block.appendChild(wrap);
    frag.appendChild(block);
  }

  const empty = document.createElement('div');
  empty.className = 'empty-state hidden';
  empty.id = 'empty-state';
  empty.textContent = 'Không có test case nào khớp với bộ lọc hiện tại.';
  frag.appendChild(empty);

  main.appendChild(frag);
}

function buildRow(tc) {
  const entry = getEntry(tc.tcId);
  const tr = document.createElement('tr');
  tr.className = 'tc-row s-' + entry.status;
  tr.dataset.tcId = tc.tcId;
  tr.dataset.section = tc.section;
  tr.dataset.priority = tc.priority || '';
  tr.dataset.type = tc.type || '';

  // Hoisted ref so the status-change handler can flag the Actual cell.
  let actualTa = null;
  function refreshActualValidation() {
    if (!actualTa) return false;
    const needsActual = entry.status === 'fail' && (!entry.actual || !String(entry.actual).trim());
    actualTa.classList.toggle('required-empty', needsActual);
    tr.classList.toggle('needs-actual', needsActual);
    return needsActual;
  }

  // TC ID
  const c1 = document.createElement('td'); c1.className = 'col-tcid';
  c1.innerHTML = '<span class="badge badge-tc">' + escHtml(tc.tcId) + '</span>';
  tr.appendChild(c1);

  // TVP
  const c2 = document.createElement('td'); c2.className = 'col-tvp';
  c2.innerHTML = tc.tvpId ? '<span class="badge badge-tvp">' + escHtml(tc.tvpId) + '</span>' : '<span class="muted">—</span>';
  tr.appendChild(c2);

  // Sub-section
  const c3 = document.createElement('td'); c3.className = 'col-subsec';
  c3.textContent = tc.subSection || '';
  tr.appendChild(c3);

  // Description
  const c6 = document.createElement('td'); c6.className = 'col-desc';
  c6.innerHTML = renderMultiline(tc.description);
  tr.appendChild(c6);

  // Preconditions
  const c7 = document.createElement('td'); c7.className = 'col-pre';
  c7.innerHTML = renderMultiline(tc.preconditions);
  tr.appendChild(c7);

  // Steps
  const c8 = document.createElement('td'); c8.className = 'col-steps';
  c8.innerHTML = renderMultiline(tc.steps);
  tr.appendChild(c8);

  // Test Data
  const c9 = document.createElement('td'); c9.className = 'col-data';
  c9.innerHTML = renderMultiline(tc.data);
  tr.appendChild(c9);

  // Expected
  const c10 = document.createElement('td'); c10.className = 'col-expected';
  c10.innerHTML = renderMultiline(tc.expected);
  tr.appendChild(c10);

  // Note: single editable textarea seeded with spec note (+ legacy userNote, if any)
  const c11 = document.createElement('td'); c11.className = 'col-specnote';
  if (entry.note === undefined) {
    let seed = '';
    if (tc.note) seed = String(tc.note).replace(/<br\\s*\\/?>/gi, '\\n').trim();
    if (entry.userNote && String(entry.userNote).trim()) {
      seed = (seed ? seed + '\\n\\n' : '') + String(entry.userNote).trim();
    }
    entry.note = seed;
  }
  const noteTa = document.createElement('textarea');
  noteTa.className = 'note-edit';
  noteTa.placeholder = 'Ghi chú...';
  noteTa.value = entry.note;
  noteTa.addEventListener('input', () => {
    entry.note = noteTa.value;
    saveState(STATE);
  });
  c11.appendChild(noteTa);
  tr.appendChild(c11);

  // Status
  const c12 = document.createElement('td'); c12.className = 'col-status';
  const sel = document.createElement('select');
  sel.className = 'status-select s-' + entry.status;
  for (const o of STATUS_OPTIONS) {
    const opt = document.createElement('option');
    opt.value = o.value; opt.textContent = o.label;
    if (o.value === entry.status) opt.selected = true;
    sel.appendChild(opt);
  }
  sel.addEventListener('change', () => {
    const ns = sel.value;
    entry.status = ns;
    sel.className = 'status-select s-' + ns;
    tr.className = 'tc-row s-' + ns;
    saveState(STATE);
    updateStats();
    const needs = refreshActualValidation();
    if (ns === 'fail' && needs) {
      showToast('⚠️ Vui lòng nhập Actual khi Fail');
    }
  });
  c12.appendChild(sel);
  tr.appendChild(c12);

  // Actual
  const c13 = document.createElement('td'); c13.className = 'col-actual';
  actualTa = document.createElement('textarea');
  actualTa.placeholder = 'Kết quả thực tế...';
  actualTa.value = entry.actual || '';
  actualTa.addEventListener('input', () => {
    entry.actual = actualTa.value;
    saveState(STATE);
    refreshActualValidation();
  });
  c13.appendChild(actualTa);
  tr.appendChild(c13);
  // Initial validation pass (e.g. row already loaded as Fail with empty Actual from a previous session)
  refreshActualValidation();

  // Priority (moved to end)
  const cPri = document.createElement('td'); cPri.className = 'col-pri';
  cPri.innerHTML = tc.priority ? '<span class="badge badge-pri-' + escHtml(tc.priority) + '">' + escHtml(tc.priority) + '</span>' : '<span class="muted">—</span>';
  tr.appendChild(cPri);

  // Type (moved to end)
  const cType = document.createElement('td'); cType.className = 'col-type';
  cType.innerHTML = tc.type ? '<span class="badge badge-type">' + escHtml(tc.type) + '</span>' : '<span class="muted">—</span>';
  tr.appendChild(cType);

  return tr;
}

function updateStats() {
  const total = TEST_DATA.length;
  let pass=0, fail=0, impact=0, notrun=0, open=0;
  for (const tc of TEST_DATA) {
    const s = (STATE[tc.tcId] && STATE[tc.tcId].status) || 'open';
    if (s === 'pass') pass++;
    else if (s === 'fail') fail++;
    else if (s === 'impact') impact++;
    else if (s === 'notrun') notrun++;
    else open++;
  }
  const pct = (n) => total === 0 ? 0 : Math.round(n*100/total);
  document.getElementById('st-total').textContent = total;
  document.getElementById('st-pass').textContent = pass;
  document.getElementById('st-fail').textContent = fail;
  document.getElementById('st-impact').textContent = impact;
  document.getElementById('st-notrun').textContent = notrun;
  document.getElementById('st-open').textContent = open;
  document.getElementById('st-pass-pct').textContent = pct(pass) + '%';
  document.getElementById('st-fail-pct').textContent = pct(fail) + '%';
  document.getElementById('pf-pass').style.width = pct(pass) + '%';
  document.getElementById('pf-fail').style.width = pct(fail) + '%';
  document.getElementById('pf-impact').style.width = pct(impact) + '%';
  document.getElementById('pf-notrun').style.width = pct(notrun) + '%';
  const tested = pass + fail + impact + notrun;
  document.getElementById('progress-text').textContent = pct(tested) + '% tested (' + tested + '/' + total + ')';
}

function applyFilter() {
  const q = document.getElementById('search').value.trim().toLowerCase();
  const fSec = document.getElementById('filter-section').value;
  const fStat = document.getElementById('filter-status').value;
  const fPri = document.getElementById('filter-priority').value;
  const fType = document.getElementById('filter-type').value;

  let visible = 0;
  const rows = document.querySelectorAll('tr.tc-row');
  for (const row of rows) {
    const tcId = row.dataset.tcId;
    const tc = TEST_DATA.find(x => x.tcId === tcId);
    if (!tc) continue;
    const status = (STATE[tcId] && STATE[tcId].status) || 'open';

    let show = true;
    if (fSec && tc.section !== fSec) show = false;
    if (fStat && status !== fStat) show = false;
    if (fPri && tc.priority !== fPri) show = false;
    if (fType && tc.type !== fType) show = false;
    if (show && q) {
      const haystack = [
        tc.tcId, tc.tvpId, tc.subSection, tc.section, tc.subGroup,
        tc.description, tc.preconditions, tc.steps, tc.data, tc.expected,
        tc.type, tc.priority, tc.note
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) show = false;
    }
    row.classList.toggle('hidden', !show);
    if (show) visible++;
  }

  // hide subgroup blocks (tbody) when none of their tc-rows are visible
  document.querySelectorAll('tbody.subgroup-block').forEach(tb => {
    const stillVisible = tb.querySelectorAll('tr.tc-row:not(.hidden)').length;
    tb.classList.toggle('hidden', stillVisible === 0);
  });

  // hide section blocks when no visible tbody
  document.querySelectorAll('.section-block').forEach(blk => {
    const stillVisible = blk.querySelectorAll('tr.tc-row:not(.hidden)').length;
    blk.classList.toggle('hidden', stillVisible === 0);
  });

  document.getElementById('result-count').textContent = visible + ' / ' + TEST_DATA.length + ' shown';
  document.getElementById('empty-state').classList.toggle('hidden', visible !== 0);
}

function findFailsMissingActual() {
  return TEST_DATA.filter(tc => {
    const e = STATE[tc.tcId];
    return e && e.status === 'fail' && (!e.actual || !String(e.actual).trim());
  });
}

function confirmExportDespiteMissingActual() {
  const missing = findFailsMissingActual();
  if (missing.length === 0) return true;
  const sample = missing.slice(0, 8).map(tc => '  • ' + tc.tcId).join('\\n');
  const more = missing.length > 8 ? '\\n  …và ' + (missing.length - 8) + ' TC khác' : '';
  return confirm(
    '⚠️ Có ' + missing.length + ' TC Fail nhưng chưa nhập Actual:\\n' +
    sample + more +
    '\\n\\nVẫn tiếp tục export?'
  );
}

function exportJson() {
  if (!confirmExportDespiteMissingActual()) return;
  const payload = {
    meta: META,
    exportedAt: new Date().toISOString(),
    state: STATE,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const ts = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  a.download = (META.sourceFile || 'tc_results').replace(/\\.md$/i,'') + '_results_' + ts + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  showToast('Exported JSON');
}

function exportCsv() {
  if (!confirmExportDespiteMissingActual()) return;

  const COLS = ['TC ID','TVP ID','Sub-section','Description','Preconditions','Test Steps','Test Data','Expected','Note','Status','Actual','Priority','Type'];
  const N = COLS.length;

  // Compute stats
  const total = TEST_DATA.length;
  let pass=0, fail=0, impact=0, notrun=0, open=0;
  for (const tc of TEST_DATA) {
    const s = (STATE[tc.tcId] && STATE[tc.tcId].status) || 'open';
    if (s === 'pass') pass++;
    else if (s === 'fail') fail++;
    else if (s === 'impact') impact++;
    else if (s === 'notrun') notrun++;
    else open++;
  }
  const tested = pass + fail + impact + notrun;
  const pct = (n) => total === 0 ? 0 : Math.round(n*100/total);

  // HTML-escape while preserving <br> tags so Excel renders them as line breaks.
  // Split on <br>, escape each segment, then rejoin with <br>.
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const xlVal = (s) => String(s == null ? '' : s)
    .split(/<br\\s*\\/?>/gi).map(esc).join('<br>');

  // ── Inline styles ──────────────────────────────────────────────────────────
  // Table cell border
  const B  = 'border:1px solid #9DC3E6;padding:5px 7px;vertical-align:top;font-size:11pt;';
  // Column header  — Dark Blue Lighter 50%  (#BDD7EE / #1F3864)
  const H  = 'background:#BDD7EE;color:#1F3864;font-weight:bold;border:1px solid #9DC3E6;padding:6px 8px;font-size:11pt;white-space:nowrap;';
  // Section row    — Orange Lighter 80%     (#FCE4D6 / #833C00)
  const SC = 'background:#FCE4D6;color:#833C00;font-weight:bold;border:1px solid #F4B183;padding:7px 10px;font-size:12pt;';
  // SubGroup row   — subtle blue tint
  const SG = 'background:#EBF3FB;color:#2E74B5;font-weight:600;border:1px solid #BDD7EE;padding:5px 12px;font-size:10.5pt;';
  // Summary cells (no border)
  const SL = 'padding:3px 8px;font-weight:bold;color:#1F3864;font-size:11pt;border:none;';
  const SV = 'padding:3px 8px;font-size:11pt;border:none;';
  // Status cell colours
  const SS = {
    pass:   'background:#D4EDDA;color:#155724;font-weight:600;' + B,
    fail:   'background:#F8D7DA;color:#721C24;font-weight:600;' + B,
    impact: 'background:#FFF3CD;color:#856404;font-weight:600;' + B,
    notrun: 'background:#E2E3E5;color:#383D41;font-weight:600;' + B,
    open:   'background:#CCE5FF;color:#004085;font-weight:600;' + B,
  };

  const mkTd   = (v, st) => '<td style="' + st + '">' + xlVal(v) + '</td>';
  const mkSpan = (v, n, st) => '<td colspan="' + n + '" style="' + st + '">' + xlVal(v) + '</td>';
  const gap    = () => '<tr>' + mkSpan('', N, SV) + '</tr>';

  let body = '';

  // ── Summary section ────────────────────────────────────────────────────────
  body += '<tr>' + mkSpan('📊 TEST RESULT SUMMARY', N,
    'background:#1F3864;color:#fff;font-weight:bold;padding:7px 10px;font-size:13pt;border:none;') + '</tr>';
  body += '<tr>' + mkSpan('Source',        2, SL) + mkSpan(META.sourceFile || '', N-2, SV) + '</tr>';
  if (META.screenName) body += '<tr>' + mkSpan('Màn hình',     2, SL) + mkSpan(META.screenName, N-2, SV) + '</tr>';
  if (META.tvpVersion) body += '<tr>' + mkSpan('Phiên bản TVP',2, SL) + mkSpan(META.tvpVersion, N-2, SV) + '</tr>';
  body += '<tr>' + mkSpan('Exported at',   2, SL) + mkSpan(new Date().toLocaleString('vi-VN'), N-2, SV) + '</tr>';
  body += gap();

  // Status summary table
  body += '<tr>'
    + mkSpan('Status', 1, SL) + mkSpan('Count', 1, SL) + mkSpan('%', 1, SL)
    + mkSpan('', N-3, SV) + '</tr>';
  const sSummary = [
    ['✅ Pass',    pass,   pct(pass)   + '%', 'background:#D4EDDA;color:#155724;padding:3px 8px;border:none;'],
    ['❌ Fail',    fail,   pct(fail)   + '%', 'background:#F8D7DA;color:#721C24;padding:3px 8px;border:none;'],
    ['⚠️ Impact',  impact, pct(impact) + '%', 'background:#FFF3CD;color:#856404;padding:3px 8px;border:none;'],
    ['⬜ Not Run', notrun, pct(notrun) + '%', 'background:#E2E3E5;color:#383D41;padding:3px 8px;border:none;'],
    ['🔵 Open',    open,   pct(open)   + '%', 'background:#CCE5FF;color:#004085;padding:3px 8px;border:none;'],
    ['Total',      total,  '100%',            'font-weight:bold;padding:3px 8px;border:none;'],
  ];
  for (const [lbl, cnt, p, st] of sSummary) {
    body += '<tr>'
      + mkSpan(lbl, 1, st) + mkSpan(cnt, 1, st) + mkSpan(p, 1, st)
      + mkSpan('', N-3, SV) + '</tr>';
  }

  // Failed TCs quick list
  const failedList = TEST_DATA.filter(tc => ((STATE[tc.tcId] && STATE[tc.tcId].status) || 'open') === 'fail');
  if (failedList.length) {
    body += gap();
    body += '<tr>' + mkSpan('❌ FAILED TEST CASES', N,
      'background:#F8D7DA;color:#721C24;font-weight:bold;padding:6px 10px;font-size:11pt;border:none;') + '</tr>';
    body += '<tr>' + mkSpan('TC ID',1,SL) + mkSpan('Description',3,SL) + mkSpan('Actual',N-4,SL) + '</tr>';
    for (const tc of failedList) {
      const e = STATE[tc.tcId] || {};
      body += '<tr>' + mkSpan(tc.tcId,1,SV) + mkSpan(tc.description,3,SV) + mkSpan(e.actual||'',N-4,SV) + '</tr>';
    }
  }

  body += gap();
  body += gap();

  // ── Test cases table ───────────────────────────────────────────────────────
  // Column header row (Dark Blue Lighter 50%)
  body += '<tr>' + COLS.map(c => mkTd(c, H)).join('') + '</tr>';

  // Group by section → subgroup (mirrors HTML layout)
  const grouped = new Map();
  for (const tc of TEST_DATA) {
    const sec = tc.section || '(no section)';
    if (!grouped.has(sec)) grouped.set(sec, new Map());
    const sub = tc.subGroup || '';
    const subMap = grouped.get(sec);
    if (!subMap.has(sub)) subMap.set(sub, []);
    subMap.get(sub).push(tc);
  }

  for (const [sec, subMap] of grouped) {
    const secCount = [...subMap.values()].reduce((a, arr) => a + arr.length, 0);
    // Section header row (Orange Lighter 80%)
    body += '<tr>' + mkSpan('▶  ' + sec + '  (' + secCount + ' TC)', N, SC) + '</tr>';

    for (const [sub, tcs] of subMap) {
      if (sub) body += '<tr>' + mkSpan('    ◆  ' + sub, N, SG) + '</tr>';

      for (const tc of tcs) {
        const e   = STATE[tc.tcId] || { status:'open', actual:'' };
        const sst = SS[e.status] || SS.open;
        const WP  = B + 'white-space:pre-wrap;';
        body += '<tr>'
          + mkTd(tc.tcId,          B)
          + mkTd(tc.tvpId,         B)
          + mkTd(tc.subSection,    B)
          + mkTd(tc.description,   WP + 'min-width:180px;')
          + mkTd(tc.preconditions, WP)
          + mkTd(tc.steps,         WP + 'min-width:180px;')
          + mkTd(tc.data,          B)
          + mkTd(tc.expected,      WP + 'min-width:180px;')
          + mkTd(noteValue(tc, e), B)
          + mkTd(e.status,         sst)
          + mkTd(e.actual || '',   WP)
          + mkTd(tc.priority,      B)
          + mkTd(tc.type,          B)
          + '</tr>';
      }
    }
  }

  // Wrap in Excel-compatible HTML (no external dependency)
  const xls = '<html xmlns:o="urn:schemas-microsoft-com:office:office"'
    + ' xmlns:x="urn:schemas-microsoft-com:office:excel"'
    + ' xmlns="http://www.w3.org/TR/REC-html40">'
    + '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'
    + '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>'
    + '<x:ExcelWorksheet><x:Name>Test Cases</x:Name>'
    + '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>'
    + '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->'
    + '<style>body{font-family:Calibri,Arial,sans-serif;}table{border-collapse:collapse;}td{vertical-align:top;}</style>'
    + '</head><body><table>' + body + '</table></body></html>';

  const blob = new Blob(['\\uFEFF' + xls], { type:'application/vnd.ms-excel;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  const ts = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  a.download = (META.sourceFile || 'tc_results').replace(/\\.md$/i,'') + '_results_' + ts + '.xls';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  showToast('Exported XLS');
}

function csvCell(s) {
  if (s == null) return '""';
  s = String(s).replace(/"/g, '""');
  return '"' + s + '"';
}

function formatStatusMd(s) {
  if (s === 'pass')   return '✅ Pass';
  if (s === 'fail')   return '❌ Fail';
  if (s === 'impact') return '⚠️ Impact';
  if (s === 'notrun') return '⬜ Not Run';
  return '🔵 Open';
}

function mdCell(s) {
  // Preserve existing <br> tags inside spec text; only escape pipes and
  // convert raw newlines (from user textareas) to <br>.
  if (s == null) return '';
  return String(s).replace(/\\|/g, '\\\\|').replace(/\\r?\\n/g, '<br>');
}

// Note value to use in exports — prefer the user-edited entry.note,
// fall back to the original spec note if entry hasn't been seeded yet.
function noteValue(tc, entry) {
  if (entry && entry.note !== undefined) return String(entry.note || '');
  if (tc.note) return String(tc.note).replace(/<br\\s*\\/?>/gi, '\\n');
  return '';
}

function exportMarkdown() {
  if (!confirmExportDespiteMissingActual()) return;
  const total = TEST_DATA.length;
  let pass=0, fail=0, impact=0, notrun=0, open=0;
  for (const tc of TEST_DATA) {
    const s = (STATE[tc.tcId] && STATE[tc.tcId].status) || 'open';
    if (s === 'pass') pass++;
    else if (s === 'fail') fail++;
    else if (s === 'impact') impact++;
    else if (s === 'notrun') notrun++;
    else open++;
  }
  const tested = pass + fail + impact + notrun;
  const pct = (n) => total === 0 ? 0 : Math.round(n*100/total);

  const out = [];
  out.push('# ' + (META.docTitle || 'Test Results') + ' — Test Result Report');
  out.push('');
  out.push('| Mục | Nội dung |');
  out.push('|---|---|');
  if (META.sourceFile) out.push('| **Source** | \`' + META.sourceFile + '\` |');
  if (META.screenName) out.push('| **Màn hình** | ' + META.screenName + ' |');
  if (META.tvpVersion) out.push('| **Phiên bản TVP** | ' + META.tvpVersion + ' |');
  out.push('| **Exported at** | ' + new Date().toISOString() + ' |');
  out.push('| **Tổng TC** | ' + total + ' |');
  out.push('| **Đã test** | ' + tested + ' / ' + total + ' (' + pct(tested) + '%) |');
  out.push('');
  out.push('## 📊 Test Result Summary');
  out.push('');
  out.push('| Status | Count | % |');
  out.push('|---|---:|---:|');
  out.push('| ✅ Pass | ' + pass + ' | ' + pct(pass) + '% |');
  out.push('| ❌ Fail | ' + fail + ' | ' + pct(fail) + '% |');
  out.push('| ⚠️ Impact | ' + impact + ' | ' + pct(impact) + '% |');
  out.push('| ⬜ Not Run | ' + notrun + ' | ' + pct(notrun) + '% |');
  out.push('| 🔵 Open | ' + open + ' | ' + pct(open) + '% |');
  out.push('| **Total** | **' + total + '** | **100%** |');
  out.push('');

  // Failed TCs quick list
  const failed = TEST_DATA.filter(tc => ((STATE[tc.tcId] && STATE[tc.tcId].status) || 'open') === 'fail');
  if (failed.length) {
    out.push('## ❌ Failed Test Cases');
    out.push('');
    for (const tc of failed) {
      const e = STATE[tc.tcId] || {};
      out.push('- **' + tc.tcId + '** — ' + (tc.description || '').replace(/\\r?\\n/g, ' '));
      if (e.actual) out.push('  - Actual: ' + e.actual.replace(/\\r?\\n/g, ' '));
    }
    out.push('');
  }

  // Group rows by section + subgroup, emit table identical to source structure
  const grouped = new Map();
  for (const tc of TEST_DATA) {
    const sec = tc.section || '(no section)';
    if (!grouped.has(sec)) grouped.set(sec, new Map());
    const sub = tc.subGroup || '';
    const subMap = grouped.get(sec);
    if (!subMap.has(sub)) subMap.set(sub, []);
    subMap.get(sub).push(tc);
  }

  for (const [sec, subMap] of grouped) {
    out.push('---');
    out.push('');
    out.push('## ' + sec);
    out.push('');
    for (const [sub, tcs] of subMap) {
      if (sub) {
        out.push('### ' + sub);
        out.push('');
      }
      out.push('| TC ID | TVP ID | Sub-section | Test Description | Preconditions | Test Steps | Test Data | Expected Result | Test Type | Priority | Actual | Status | Note |');
      out.push('|-------|--------|-------------|-----------------|---------------|------------|-----------|-----------------|-----------|----------|--------|--------|------|');
      for (const tc of tcs) {
        const e = STATE[tc.tcId] || { status:'open', actual:'', userNote:'' };
        const cells = [
          tc.tcId,
          tc.tvpId,
          mdCell(tc.subSection),
          mdCell(tc.description),
          mdCell(tc.preconditions),
          mdCell(tc.steps),
          mdCell(tc.data),
          mdCell(tc.expected),
          tc.type,
          tc.priority,
          mdCell(e.actual || tc.actualSpec || ''),
          formatStatusMd(e.status),
          mdCell(noteValue(tc, e)),
        ];
        out.push('| ' + cells.join(' | ') + ' |');
      }
      out.push('');
    }
  }

  const md = out.join('\\n');
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const ts = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  a.download = (META.sourceFile || 'tc_results').replace(/\\.md$/i,'') + '_results_' + ts + '.md';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  showToast('Exported Markdown');
}
function stripHtml(s) {
  if (!s) return '';
  return String(s).replace(/<br\\s*\\/?>/gi, ' ').replace(/<[^>]+>/g, '');
}

// CSV-friendly text: preserve line breaks so Excel renders multi-line cells.
function csvText(s) {
  if (s == null) return '';
  return String(s)
    .replace(/<br\\s*\\/?>/gi, '\\n')
    .replace(/<[^>]+>/g, '');
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data && data.state && typeof data.state === 'object') {
        STATE = data.state;
        saveState(STATE);
        location.reload();
      } else {
        showToast('File JSON không hợp lệ');
      }
    } catch (e) {
      showToast('Lỗi đọc JSON: ' + e.message);
    }
  };
  reader.readAsText(file);
}

function resetAll() {
  if (!confirm('Reset toàn bộ trạng thái test? Tất cả Pass/Fail/Note sẽ bị xóa.')) return;
  STATE = {};
  saveState(STATE);
  location.reload();
}

document.getElementById('search').addEventListener('input', applyFilter);
document.getElementById('filter-section').addEventListener('change', applyFilter);
document.getElementById('filter-status').addEventListener('change', applyFilter);
document.getElementById('filter-priority').addEventListener('change', applyFilter);
document.getElementById('filter-type').addEventListener('change', applyFilter);

document.getElementById('btn-export').addEventListener('click', exportJson);
document.getElementById('btn-export-csv').addEventListener('click', exportCsv);
document.getElementById('btn-export-md').addEventListener('click', exportMarkdown);
document.getElementById('btn-reset').addEventListener('click', resetAll);
document.getElementById('btn-import').addEventListener('click', () => document.getElementById('import-file').click());
document.getElementById('import-file').addEventListener('change', e => {
  if (e.target.files[0]) importJson(e.target.files[0]);
});

const COLLAPSED_KEY = STORAGE_KEY + '__collapsed';
function getCollapsedSections() {
  try {
    const raw = localStorage.getItem(COLLAPSED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) { return new Set(); }
}
function saveCollapsedSections(set) {
  try { localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...set])); } catch (e) {}
}

const COLLAPSED_SUB_KEY = STORAGE_KEY + '__collapsed_sub';
function getCollapsedSubgroups() {
  try {
    const raw = localStorage.getItem(COLLAPSED_SUB_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) { return new Set(); }
}
function saveCollapsedSubgroups(set) {
  try { localStorage.setItem(COLLAPSED_SUB_KEY, JSON.stringify([...set])); } catch (e) {}
}

document.getElementById('btn-collapse-all').addEventListener('click', () => {
  const secs = new Set();
  document.querySelectorAll('.section-block').forEach(blk => {
    blk.classList.add('collapsed');
    secs.add(blk.dataset.section);
  });
  saveCollapsedSections(secs);
  const subs = new Set();
  document.querySelectorAll('tbody.subgroup-block').forEach(tb => {
    if (tb.dataset.subgroup !== '__none__') {
      tb.classList.add('collapsed');
      subs.add(tb.dataset.section + '::' + tb.dataset.subgroup);
    }
  });
  saveCollapsedSubgroups(subs);
});
document.getElementById('btn-expand-all').addEventListener('click', () => {
  document.querySelectorAll('.section-block').forEach(blk => blk.classList.remove('collapsed'));
  saveCollapsedSections(new Set());
  document.querySelectorAll('tbody.subgroup-block').forEach(tb => tb.classList.remove('collapsed'));
  saveCollapsedSubgroups(new Set());
});

document.addEventListener('keydown', e => {
  const tag = (document.activeElement && document.activeElement.tagName) || '';
  if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
    e.preventDefault();
    document.getElementById('search').focus();
  }
});

buildFilterOptions();
buildLayout();
updateStats();
applyFilter();
</script>

</body>
</html>
`;

fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Wrote ${outputPath} (${(html.length/1024).toFixed(1)} KB)`);
