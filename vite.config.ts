import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import * as vitest from 'vitest';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

import lodash from 'lodash';
import builtinModules from 'builtin-modules';
import commonjsExternals from 'vite-plugin-commonjs-externals';
import pkg from './package.json';

const {escapeRegExp} = lodash;

const externals = [
	'child_process',
	'node:process',
	'node:os',
	'node:tty',
	...builtinModules,
	...Object.keys(pkg.dependencies).map(
		name => new RegExp('^' + escapeRegExp(name) + '(\\/.+)?$'),
	),
];

export default defineConfig({
	build: {
		lib: {
			entry: resolve(dirname(fileURLToPath(import.meta.url)), 'source/index.js'),
		},
		rollupOptions: {
			output: [
				{
					format: 'umd',
					name: 'chalk',
					entryFileNames(_chunk) {
						return '[name].js';
					},
					exports: 'named',
				},
				{
					format: 'es',
				},
			],
		},
	},
	optimizeDeps: {
		exclude: externals as string[],
	},
	plugins: [
		dts(),
		commonjsExternals({
			externals,
		}),
	],
	test: {
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'json', 'html', 'lcov'],
		},
	},
});
