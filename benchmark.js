import { performance } from 'node:perf_hooks';
import chalk from './source/index.js';

const chalkRed = chalk.red;
const chalkBgRed = chalk.bgRed;
const chalkBlueBgRed = chalk.blue.bgRed;
const chalkBlueBgRedBold = chalk.blue.bgRed.bold;
const blueStyledString = 'the fox jumps' + chalk.blue('over the lazy dog') + '!';
const warmupIterations = 10_000;
const iterations = 100_000;
const sampleCount = 5;

const benchmarks = [
	['1 style', () => chalk.red('the fox jumps over the lazy dog')],
	['2 styles', () => chalk.blue.bgRed('the fox jumps over the lazy dog')],
	['3 styles', () => chalk.blue.bgRed.bold('the fox jumps over the lazy dog')],
	['cached: 1 style', () => chalkRed('the fox jumps over the lazy dog')],
	['cached: 2 styles', () => chalkBlueBgRed('the fox jumps over the lazy dog')],
	['cached: 3 styles', () => chalkBlueBgRedBold('the fox jumps over the lazy dog')],
	['cached: 1 style with newline', () => chalkRed('the fox jumps\nover the lazy dog')],
	['cached: 1 style nested intersecting', () => chalkRed(blueStyledString)],
	['cached: 1 style nested non-intersecting', () => chalkBgRed(blueStyledString)],
	['cached: 1 style template literal', () => chalkRed`the fox jumps over the lazy dog`],
	['cached: nested styles template literal', () => chalkRed`the fox {bold jumps} over the {underline lazy} dog`],
];

for (const [name, run] of benchmarks) {
	for (let iteration = 0; iteration < warmupIterations; iteration++) {
		run();
	}

	const samples = [];
	for (let sample = 0; sample < sampleCount; sample++) {
		const start = performance.now();
		for (let iteration = 0; iteration < iterations; iteration++) {
			run();
		}
		samples.push(iterations / ((performance.now() - start) / 1000));
	}

	samples.sort((left, right) => left - right);
	const median = samples[Math.floor(samples.length / 2)];
	console.log(`${name.padEnd(40)} ${Math.round(median).toLocaleString()} ops/sec`);
}
