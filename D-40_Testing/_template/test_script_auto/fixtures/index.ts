/**
 * fixtures/index.ts — Entry point duy nhất cho tất cả test files.
 *
 * Import trong test:
 *   import { test, expect } from '../fixtures';
 *
 * Bao gồm: auth token injection + auto evidence screenshot (TC ID naming)
 */
export { test, expect } from './evidence.fixture';
