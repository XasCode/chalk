import { test, expect } from 'vitest';
import chalk, { Chalk } from '../source/index.js';
const e = {
	is: (a, b) => (expect(a).toBe(b)),
	not: (a, b) => (expect(a).not.toBe(b)),
	throws: (a, b) => {
		try {
			a();
		} catch (e) {
			expect(e.message).toMatch(b.message);
			return;
		}
	}
}

chalk.level = 1;

test('create an isolated context where colors can be disabled (by level)', t => {
	const instance = new Chalk({ level: 0 });
	e.is(instance.red('foo'), 'foo');
	e.is(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
	instance.level = 2;
	e.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
});

test('the `level` option should be a number from 0 to 3', t => {
	/* eslint-disable no-new */
	e.throws(() => {
		new Chalk({ level: 10 });
	}, { message: /should be an integer from 0 to 3/ });

	e.throws(() => {
		new Chalk({ level: -1 });
	}, { message: /should be an integer from 0 to 3/ });
	/* eslint-enable no-new */
});
