import process from 'node:process';
import { test, expect } from 'vitest';
import chalk, { Chalk, chalkStderr } from '../source/index.js';
const e = {
	is: (a, b) => (expect(a).toBe(b)),
	not: (a, b) => (expect(a).not.toBe(b))
}

chalk.level = 3;
chalkStderr.level = 3;

console.log('TERM:', process.env.TERM || '[none]');
console.log('platform:', process.platform || '[unknown]');

test('don\'t add any styling when called as the base function', t => {
	e.is(chalk('foo'), 'foo');
});

test('support multiple arguments in base function', t => {
	e.is(chalk('hello', 'there'), 'hello there');
});

test('support automatic casting to string', t => {
	e.is(chalk(['hello', 'there']), 'hello,there');
	e.is(chalk(123), '123');

	e.is(chalk.bold(['foo', 'bar']), '\u001B[1mfoo,bar\u001B[22m');
	e.is(chalk.green(98_765), '\u001B[32m98765\u001B[39m');
});

test('style string', t => {
	e.is(chalk.underline('foo'), '\u001B[4mfoo\u001B[24m');
	e.is(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
	e.is(chalk.bgRed('foo'), '\u001B[41mfoo\u001B[49m');
});

test('support applying multiple styles at once', t => {
	e.is(chalk.red.bgGreen.underline('foo'), '\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39m');
	e.is(chalk.underline.red.bgGreen('foo'), '\u001B[4m\u001B[31m\u001B[42mfoo\u001B[49m\u001B[39m\u001B[24m');
});

test('support nesting styles', t => {
	e.is(
		chalk.red('foo' + chalk.underline.bgBlue('bar') + '!'),
		'\u001B[31mfoo\u001B[4m\u001B[44mbar\u001B[49m\u001B[24m!\u001B[39m',
	);
});

test('support nesting styles of the same type (color, underline, bg)', t => {
	e.is(
		chalk.red('a' + chalk.yellow('b' + chalk.green('c') + 'b') + 'c'),
		'\u001B[31ma\u001B[33mb\u001B[32mc\u001B[39m\u001B[31m\u001B[33mb\u001B[39m\u001B[31mc\u001B[39m',
	);
});

test('reset all styles with `.reset()`', t => {
	e.is(chalk.reset(chalk.red.bgGreen.underline('foo') + 'foo'), '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m');
});

test('support caching multiple styles', t => {
	const { red, green } = chalk.red;
	const redBold = red.bold;
	const greenBold = green.bold;

	e.not(red('foo'), green('foo'));
	e.not(redBold('bar'), greenBold('bar'));
	e.not(green('baz'), greenBold('baz'));
});

test('alias gray to grey', t => {
	e.is(chalk.grey('foo'), '\u001B[90mfoo\u001B[39m');
});

test('support variable number of arguments', t => {
	e.is(chalk.red('foo', 'bar'), '\u001B[31mfoo bar\u001B[39m');
});

test('support falsy values', t => {
	e.is(chalk.red(0), '\u001B[31m0\u001B[39m');
});

test('don\'t output escape codes if the input is empty', t => {
	e.is(chalk.red(), '');
	e.is(chalk.red.blue.black(), '');
});

test('keep Function.prototype methods', t => {
	e.is(Reflect.apply(chalk.grey, null, ['foo']), '\u001B[90mfoo\u001B[39m');
	e.is(chalk.reset(chalk.red.bgGreen.underline.bind(null)('foo') + 'foo'), '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m');
	e.is(chalk.red.blue.black.call(null), '');
});

test('line breaks should open and close colors', t => {
	e.is(chalk.grey('hello\nworld'), '\u001B[90mhello\u001B[39m\n\u001B[90mworld\u001B[39m');
});

test('line breaks should open and close colors with CRLF', t => {
	e.is(chalk.grey('hello\r\nworld'), '\u001B[90mhello\u001B[39m\r\n\u001B[90mworld\u001B[39m');
});

test('properly convert RGB to 16 colors on basic color terminals', t => {
	e.is(new Chalk({ level: 1 }).hex('#FF0000')('hello'), '\u001B[91mhello\u001B[39m');
	e.is(new Chalk({ level: 1 }).bgHex('#FF0000')('hello'), '\u001B[101mhello\u001B[49m');
});

test('properly convert RGB to 256 colors on basic color terminals', t => {
	e.is(new Chalk({ level: 2 }).hex('#FF0000')('hello'), '\u001B[38;5;196mhello\u001B[39m');
	e.is(new Chalk({ level: 2 }).bgHex('#FF0000')('hello'), '\u001B[48;5;196mhello\u001B[49m');
	e.is(new Chalk({ level: 3 }).bgHex('#FF0000')('hello'), '\u001B[48;2;255;0;0mhello\u001B[49m');
});

test('don\'t emit RGB codes if level is 0', t => {
	e.is(new Chalk({ level: 0 }).hex('#FF0000')('hello'), 'hello');
	e.is(new Chalk({ level: 0 }).bgHex('#FF0000')('hello'), 'hello');
});

test('supports blackBright color', t => {
	e.is(chalk.blackBright('foo'), '\u001B[90mfoo\u001B[39m');
});

test('sets correct level for chalkStderr and respects it', t => {
	e.is(chalkStderr.level, 3);
	e.is(chalkStderr.red.bold('foo'), '\u001B[31m\u001B[1mfoo\u001B[22m\u001B[39m');
});

test('keeps function prototype methods', t => {
	e.is(chalk.apply(chalk, ['foo']), 'foo');
	e.is(chalk.bind(chalk, 'foo')(), 'foo');
	e.is(chalk.call(chalk, 'foo'), 'foo');
});
