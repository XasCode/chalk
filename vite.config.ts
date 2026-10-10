/// <reference types="vitest" />

import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {defineConfig} from 'vitest/config';
import dts from 'unplugin-dts/vite';

import builtinModules from 'builtin-modules';

const externals = [
	'child_process',
	'node:process',
	'node:os',
	'node:tty',
	...builtinModules,
];

export default defineConfig({
	build: {
		lib: {
			entry: resolve(dirname(fileURLToPath(import.meta.url)), 'source/index.js'),
		},
		rolldownOptions: {
			external: externals,
			output: [
				{
					format: 'umd',
					banner: `if (typeof module !== 'undefined' && module.exports && typeof process !== 'undefined' && typeof process.emitWarning === 'function') { process.emitWarning('@xascode/chalk: The CommonJS/UMD entry is deprecated; migrate to the ESM entry.', { code: 'DEP_XASCODE_CHALK_CJS', type: 'DeprecationWarning' }); }`,
					name: 'chalk',
					entryFileNames(_chunk) {
						return '[name].cjs';
					},
					exports: 'named',
				},
				{
					format: 'es',
					banner: `if (typeof module !== 'undefined' && module.exports && typeof process !== 'undefined' && typeof process.emitWarning === 'function') { process.emitWarning('@xascode/chalk: The CommonJS/UMD entry is deprecated; migrate to the ESM entry.', { code: 'DEP_XASCODE_CHALK_CJS', type: 'DeprecationWarning' }); }`,
				},
			],
		},
	},
	optimizeDeps: {
		exclude: externals as string[],
	},
	plugins: [
		dts(),
	],
	test: {
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'json', 'html', 'lcov'],
			include: ['source'],
			exclude: ['source/vendor', 'source/**/*.d.ts', 'source/**/__tests__/**'],
		},
		environment: 'node',
		testTimeout: 20000,
		include: ['test/**/*.js'],
		exclude: ['test/**/_*.js'],
	},
});
