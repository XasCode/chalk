import { test, expect } from 'vitest';
import chalk, { Chalk } from '../source/index.js';
const e = {
	is: (a, b) => (expect(a).toBe(b))
}
chalk.level = 1;

test('visible: normal output when level > 0', t => {
	const instance = new Chalk({ level: 3 });
	e.is(instance.visible.red('foo'), '\u001B[31mfoo\u001B[39m');
	e.is(instance.red.visible('foo'), '\u001B[31mfoo\u001B[39m');
});

test('visible: no output when level is too low', t => {
	const instance = new Chalk({ level: 0 });
	e.is(instance.visible.red('foo'), '');
	e.is(instance.red.visible('foo'), '');
});

test('test switching back and forth between level == 0 and level > 0', t => {
	const instance = new Chalk({ level: 3 });
	e.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
	e.is(instance.visible.red('foo'), '\u001B[31mfoo\u001B[39m');
	e.is(instance.red.visible('foo'), '\u001B[31mfoo\u001B[39m');
	e.is(instance.visible('foo'), 'foo');
	e.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');

	instance.level = 0;
	e.is(instance.red('foo'), 'foo');
	e.is(instance.visible('foo'), '');
	e.is(instance.visible.red('foo'), '');
	e.is(instance.red.visible('foo'), '');
	e.is(instance.red('foo'), 'foo');

	instance.level = 3;
	e.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
	e.is(instance.visible.red('foo'), '\u001B[31mfoo\u001B[39m');
	e.is(instance.red.visible('foo'), '\u001B[31mfoo\u001B[39m');
	e.is(instance.visible('foo'), 'foo');
	e.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
});
