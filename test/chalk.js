import process from 'node:process';
import {test, expect} from 'vitest';
import chalk, {
	Chalk,
	chalkStderr,
	colorNames,
	modifierNames,
	underlineColorNames,
} from '../source/index.js';

const e = {
	is: (actual, expected) => expect(actual).toBe(expected),
	not: (actual, expected) => expect(actual).not.toBe(expected),
	true: actual => expect(actual).toBe(true),
	false: actual => expect(actual).toBe(false),
};

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

	e.is(chalk.bold(['foo', 'bar']), '\u{1B}[1mfoo,bar\u{1B}[22m');
	e.is(chalk.green(98_765), '\u{1B}[32m98765\u{1B}[39m');
});

test('style string', t => {
	e.is(chalk.underline('foo'), '\u{1B}[4mfoo\u{1B}[24m');
	e.is(chalk.red('foo'), '\u{1B}[31mfoo\u{1B}[39m');
	e.is(chalk.bgRed('foo'), '\u{1B}[41mfoo\u{1B}[49m');
});

test('support applying multiple styles at once', t => {
	e.is(chalk.red.bgGreen.underline('foo'), '\u{1B}[31m\u{1B}[42m\u{1B}[4mfoo\u{1B}[24m\u{1B}[49m\u{1B}[39m');
	e.is(chalk.underline.red.bgGreen('foo'), '\u{1B}[4m\u{1B}[31m\u{1B}[42mfoo\u{1B}[49m\u{1B}[39m\u{1B}[24m');
});

test('support nesting styles', t => {
	e.is(
		chalk.red('foo' + chalk.underline.bgBlue('bar') + '!'),
		'\u{1B}[31mfoo\u{1B}[4m\u{1B}[44mbar\u{1B}[49m\u{1B}[24m!\u{1B}[39m',
	);
});

test('support nesting styles of the same type (color, underline, bg)', t => {
	const nested = chalk.yellow('b' + chalk.green('c') + 'b');
	e.is(
		chalk.red('a' + nested + 'c'),
		'\u{1B}[31ma\u{1B}[33mb\u{1B}[32mc\u{1B}[39m\u{1B}[31m\u{1B}[33mb\u{1B}[39m\u{1B}[31mc\u{1B}[39m',
	);
});

test('reset all styles with `.reset()`', t => {
	e.is(chalk.reset(chalk.red.bgGreen.underline('foo') + 'foo'), '\u{1B}[0m\u{1B}[31m\u{1B}[42m\u{1B}[4mfoo\u{1B}[24m\u{1B}[49m\u{1B}[39mfoo\u{1B}[0m');
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
	e.is(chalk.grey('foo'), '\u{1B}[90mfoo\u{1B}[39m');
});

test('support variable number of arguments', t => {
	e.is(chalk.red('foo', 'bar'), '\u{1B}[31mfoo bar\u{1B}[39m');
});

test('convert multiple arguments the same way regardless of their count', t => {
	const object = {
		valueOf: () => 42,
		toString: () => 'string',
	};

	e.is(chalk.red(null, 'foo'), '\u{1B}[31m foo\u{1B}[39m');
	e.is(chalk.red('foo', undefined), '\u{1B}[31mfoo \u{1B}[39m');
	e.is(chalk.red('foo', object), '\u{1B}[31mfoo string\u{1B}[39m');
	e.is(chalk.red(null, 'foo', 'bar'), '\u{1B}[31m foo bar\u{1B}[39m');
	e.is(chalk.red('foo', object, 'bar'), '\u{1B}[31mfoo string bar\u{1B}[39m');
});

test('support falsy values', t => {
	e.is(chalk.red(0), '\u{1B}[31m0\u{1B}[39m');
});

test('don\'t output escape codes if the input is empty', t => {
	e.is(chalk.red(), '');
	e.is(chalk.red.blue.black(), '');
});

test('keep Function.prototype methods', t => {
	e.is(Reflect.apply(chalk.grey, null, ['foo']), '\u{1B}[90mfoo\u{1B}[39m');
	e.is(chalk.reset(chalk.red.bgGreen.underline.bind(null)('foo') + 'foo'), '\u{1B}[0m\u{1B}[31m\u{1B}[42m\u{1B}[4mfoo\u{1B}[24m\u{1B}[49m\u{1B}[39mfoo\u{1B}[0m');
	e.is(chalk.red.blue.black.call(null), '');
});

test('line breaks should open and close colors', t => {
	e.is(chalk.grey('hello\nworld'), '\u{1B}[90mhello\u{1B}[39m\n\u{1B}[90mworld\u{1B}[39m');
});

test('line breaks should open and close colors with CRLF', t => {
	e.is(chalk.grey('hello\r\nworld'), '\u{1B}[90mhello\u{1B}[39m\r\n\u{1B}[90mworld\u{1B}[39m');
});

test('properly convert RGB to 16 colors on basic color terminals', t => {
	e.is(new Chalk({level: 1}).rgb(255, 0, 0)('hello'), '\u{1B}[91mhello\u{1B}[39m');
	e.is(new Chalk({level: 1}).bgRgb(255, 0, 0)('hello'), '\u{1B}[101mhello\u{1B}[49m');
	e.is(new Chalk({level: 1}).hex('#FF0000')('hello'), '\u{1B}[91mhello\u{1B}[39m');
	e.is(new Chalk({level: 1}).bgHex('#FF0000')('hello'), '\u{1B}[101mhello\u{1B}[49m');
});

test('properly convert RGB to 256 colors on basic color terminals', t => {
	e.is(new Chalk({level: 2}).rgb(255, 0, 0)('hello'), '\u{1B}[38;5;196mhello\u{1B}[39m');
	e.is(new Chalk({level: 2}).bgRgb(255, 0, 0)('hello'), '\u{1B}[48;5;196mhello\u{1B}[49m');
	e.is(new Chalk({level: 3}).rgb(255, 0, 0)('hello'), '\u{1B}[38;2;255;0;0mhello\u{1B}[39m');
	e.is(new Chalk({level: 3}).bgRgb(255, 0, 0)('hello'), '\u{1B}[48;2;255;0;0mhello\u{1B}[49m');
	e.is(new Chalk({level: 2}).hex('#FF0000')('hello'), '\u{1B}[38;5;196mhello\u{1B}[39m');
	e.is(new Chalk({level: 2}).bgHex('#FF0000')('hello'), '\u{1B}[48;5;196mhello\u{1B}[49m');
	e.is(new Chalk({level: 3}).bgHex('#FF0000')('hello'), '\u{1B}[48;2;255;0;0mhello\u{1B}[49m');
});

test('properly convert ANSI 256 to 16 colors on basic color terminals', t => {
	e.is(new Chalk({level: 1}).ansi256(196)('hello'), '\u{1B}[91mhello\u{1B}[39m');
	e.is(new Chalk({level: 1}).bgAnsi256(196)('hello'), '\u{1B}[101mhello\u{1B}[49m');
	e.is(new Chalk({level: 1}).ansi256(2)('hello'), '\u{1B}[32mhello\u{1B}[39m');
	e.is(new Chalk({level: 1}).bgAnsi256(2)('hello'), '\u{1B}[42mhello\u{1B}[49m');
	e.is(new Chalk({level: 1}).ansi256(8)('hello'), '\u{1B}[90mhello\u{1B}[39m');
	e.is(new Chalk({level: 1}).ansi256(232)('hello'), '\u{1B}[30mhello\u{1B}[39m');
	e.is(new Chalk({level: 1}).ansi256(255)('hello'), '\u{1B}[37mhello\u{1B}[39m');
});

test('keep ANSI 256 colors on 256 color and Truecolor terminals', t => {
	e.is(new Chalk({level: 2}).ansi256(196)('hello'), '\u{1B}[38;5;196mhello\u{1B}[39m');
	e.is(new Chalk({level: 2}).bgAnsi256(196)('hello'), '\u{1B}[48;5;196mhello\u{1B}[49m');
	e.is(new Chalk({level: 3}).ansi256(196)('hello'), '\u{1B}[38;5;196mhello\u{1B}[39m');
	e.is(new Chalk({level: 3}).bgAnsi256(196)('hello'), '\u{1B}[48;5;196mhello\u{1B}[49m');
});

test('don\'t emit color codes if level is 0', t => {
	e.is(new Chalk({level: 0}).hex('#FF0000')('hello'), 'hello');
	e.is(new Chalk({level: 0}).bgHex('#FF0000')('hello'), 'hello');
	e.is(new Chalk({level: 0}).ansi256(196)('hello'), 'hello');
	e.is(new Chalk({level: 0}).bgAnsi256(196)('hello'), 'hello');
	e.is(new Chalk({level: 0}).underlineHex('#FF0000')('hello'), 'hello');
	e.is(new Chalk({level: 0}).underlineAnsi256(196)('hello'), 'hello');
	e.is(new Chalk({level: 0}).underlineRed('hello'), 'hello');
	e.is(new Chalk({level: 0}).underlineCurly('hello'), 'hello');
});

test('support extended underline styles', t => {
	e.is(chalk.underlineDouble('foo'), '\u{1B}[4:2mfoo\u{1B}[24m');
	e.is(chalk.underlineCurly('foo'), '\u{1B}[4:3mfoo\u{1B}[24m');
	e.is(chalk.underlineDotted('foo'), '\u{1B}[4:4mfoo\u{1B}[24m');
	e.is(chalk.underlineDashed('foo'), '\u{1B}[4:5mfoo\u{1B}[24m');
});

test('support nesting underline styles', t => {
	e.is(
		chalk.underline(chalk.underlineCurly('a') + 'b'),
		'\u{1B}[4m\u{1B}[4:3ma\u{1B}[24m\u{1B}[4mb\u{1B}[24m',
	);

	e.is(
		chalk.underlineCurly(chalk.underline('a') + 'b'),
		'\u{1B}[4:3m\u{1B}[4ma\u{1B}[24m\u{1B}[4:3mb\u{1B}[24m',
	);
});

test('support underline colors', t => {
	e.is(chalk.underlineRed('foo'), '\u{1B}[58;5;1mfoo\u{1B}[59m');
	e.is(chalk.underlineBlackBright('foo'), '\u{1B}[58;5;8mfoo\u{1B}[59m');
	e.is(chalk.underlineGray('foo'), chalk.underlineBlackBright('foo'));
	e.is(chalk.underlineGrey('foo'), chalk.underlineBlackBright('foo'));
	e.is(
		chalk.red.underlineRed.underlineCurly('foo'),
		'\u{1B}[31m\u{1B}[58;5;1m\u{1B}[4:3mfoo\u{1B}[24m\u{1B}[59m\u{1B}[39m',
	);
});

test('support nesting underline colors', t => {
	e.is(
		chalk.underlineBlue(chalk.underlineRed('a') + 'b'),
		'\u{1B}[58;5;4m\u{1B}[58;5;1ma\u{1B}[59m\u{1B}[58;5;4mb\u{1B}[59m',
	);
});

test('properly downsample underline colors', t => {
	e.is(new Chalk({level: 3}).underlineRgb(255, 0, 0)('hello'), '\u{1B}[58;2;255;0;0mhello\u{1B}[59m');
	e.is(new Chalk({level: 2}).underlineRgb(255, 0, 0)('hello'), '\u{1B}[58;5;196mhello\u{1B}[59m');
	e.is(new Chalk({level: 1}).underlineRgb(255, 0, 0)('hello'), '\u{1B}[58;5;9mhello\u{1B}[59m');
	e.is(new Chalk({level: 3}).underlineHex('#FF0000')('hello'), '\u{1B}[58;2;255;0;0mhello\u{1B}[59m');
	e.is(new Chalk({level: 2}).underlineHex('#FF0000')('hello'), '\u{1B}[58;5;196mhello\u{1B}[59m');
	e.is(new Chalk({level: 1}).underlineHex('#FF0000')('hello'), '\u{1B}[58;5;9mhello\u{1B}[59m');
	e.is(new Chalk({level: 3}).underlineAnsi256(196)('hello'), '\u{1B}[58;5;196mhello\u{1B}[59m');
	e.is(new Chalk({level: 2}).underlineAnsi256(196)('hello'), '\u{1B}[58;5;196mhello\u{1B}[59m');
	e.is(new Chalk({level: 1}).underlineAnsi256(196)('hello'), '\u{1B}[58;5;9mhello\u{1B}[59m');
	e.is(new Chalk({level: 1}).underlineAnsi256(2)('hello'), '\u{1B}[58;5;2mhello\u{1B}[59m');
	e.is(new Chalk({level: 1}).underlineAnsi256(232)('hello'), '\u{1B}[58;5;0mhello\u{1B}[59m');

	// The named underline colors have no basic 16-color form, so they are the same at every level.
	e.is(new Chalk({level: 1}).underlineRed('hello'), '\u{1B}[58;5;1mhello\u{1B}[59m');
	e.is(new Chalk({level: 2}).underlineRed('hello'), '\u{1B}[58;5;1mhello\u{1B}[59m');
});

test('expose the underline style names', t => {
	e.true(modifierNames.includes('underlineCurly'));
	e.true(underlineColorNames.includes('underlineRedBright'));

	// Underline colors are intentionally not part of `colorNames`.
	e.false(colorNames.includes('underlineRed'));
});

test('supports blackBright color', t => {
	e.is(chalk.blackBright('foo'), '\u{1B}[90mfoo\u{1B}[39m');
});

test('sets correct level for chalkStderr and respects it', t => {
	e.is(chalkStderr.level, 3);
	e.is(chalkStderr.red.bold('foo'), '\u{1B}[31m\u{1B}[1mfoo\u{1B}[22m\u{1B}[39m');
});

test('keeps function prototype methods', t => {
	e.is(chalk.apply(chalk, ['foo']), 'foo');
	e.is(chalk.bind(chalk, 'foo')(), 'foo');
	e.is(chalk.call(chalk, 'foo'), 'foo');
});
