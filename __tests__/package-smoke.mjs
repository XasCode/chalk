import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import process from 'node:process';
import { test } from 'node:test';

const require = createRequire(import.meta.url);

test('CommonJS entry warns and retains the Chalk API', () => {
  const warnings = [];
  const originalEmitWarning = process.emitWarning;
  process.emitWarning = (...args) => warnings.push(args);

  try {
    const chalk = require('@xascode/chalk');
    assert.equal(typeof chalk.Chalk, 'function');
    assert.equal(new chalk.Chalk({ level: 1 }).red('test'), '\u001B[31mtest\u001B[39m');
    assert.ok(warnings.some(([message, options]) =>
      String(message).includes('CommonJS/UMD entry is deprecated') &&
      options?.code === 'DEP_XASCODE_CHALK_CJS' &&
      options?.type === 'DeprecationWarning'));
  } finally {
    process.emitWarning = originalEmitWarning;
  }
});

test('ESM entry exposes Chalk without a CommonJS deprecation warning', async () => {
  const warnings = [];
  const originalEmitWarning = process.emitWarning;
  process.emitWarning = (...args) => warnings.push(args);

  try {
    const chalk = await import('@xascode/chalk');
    assert.equal(typeof chalk.Chalk, 'function');
    assert.equal(new chalk.Chalk({ level: 1 }).red('test'), '\u001B[31mtest\u001B[39m');
    assert.equal(warnings.some(([, options]) => options?.code === 'DEP_XASCODE_CHALK_CJS'), false);
  } finally {
    process.emitWarning = originalEmitWarning;
  }
});
