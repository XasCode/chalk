import { test, expect } from 'vitest';
import chalk from '../source/index.js';
const e = {
	is: (a, b) => (expect(a).toBe(b)),
}

// TODO: Do this when ESM supports loader hooks
// Spoof supports-color
// require('./_supports-color')(__dirname, {
// 	stdout: {
// 		level: 0,
// 		hasBasic: false,
// 		has256: false,
// 		has16m: false
// 	},
// 	stderr: {
// 		level: 0,
// 		hasBasic: false,
// 		has256: false,
// 		has16m: false
// 	}
// });

test('colors can be forced by using chalk.level', t => {
	chalk.level = 1;
	e.is(chalk.green('hello'), '\u001B[32mhello\u001B[39m');
});
