#!/usr/bin/env node
// Uploads a single file to Backlog space/attachment endpoint.
// Usage: node upload-attachment.mjs --file=<path> [--config=<path>] [--mcp=<path>]
// Stdout: { "id": 123, "name": "file.png", "size": 4567 }
// Auth priority: BACKLOG_API_KEY env var → .mcp.json mcpServers.backlog.env.BACKLOG_API_KEY

import { readFileSync } from 'fs';
import { basename, resolve } from 'path';
import { parseArgs } from 'util';

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    file:   { type: 'string' },
    config: { type: 'string', default: '.claude/skills/log-bugs/backlog.config.json' },
    mcp:    { type: 'string', default: '.mcp.json' },
  },
  strict: true,
});

if (!values.file) {
  console.error('Error: --file=<path> is required');
  process.exit(1);
}

const config = JSON.parse(readFileSync(values.config, 'utf8'));

// Resolve API key: env var → .mcp.json
let apiKey = process.env.BACKLOG_API_KEY;
if (!apiKey) {
  try {
    const mcp = JSON.parse(readFileSync(values.mcp, 'utf8'));
    apiKey = mcp?.mcpServers?.backlog?.env?.BACKLOG_API_KEY;
  } catch {
    // .mcp.json not found or invalid — will fail below
  }
}

if (!apiKey) {
  console.error('Error: BACKLOG_API_KEY not found in env var or .mcp.json');
  process.exit(1);
}

const baseUrl = config.spaceKey.startsWith('http')
  ? config.spaceKey
  : `https://${config.spaceKey}`;

const url = `${baseUrl}/api/v2/space/attachment?apiKey=${encodeURIComponent(apiKey)}`;

const formData = new FormData();
const blob = new Blob([readFileSync(resolve(values.file))]);
formData.append('file', blob, basename(values.file));

const res = await fetch(url, { method: 'POST', body: formData });
const body = await res.text();

if (!res.ok) {
  console.error(`Upload failed [${res.status}]: ${body}`);
  process.exit(1);
}

const data = JSON.parse(body);
console.log(JSON.stringify({ id: data.id, name: data.name, size: data.size }));
