# Changelog

## [0.2.0](https://github.com/XasCode/chalk/compare/chalk-v0.1.4...chalk-v0.2.0) (2026-10-10)


### ⚠ BREAKING CHANGES

* remove deprecated aliases and modernize Chalk factory ([#23](https://github.com/XasCode/chalk/issues/23))

### Features

* remove deprecated aliases and modernize Chalk factory ([#23](https://github.com/XasCode/chalk/issues/23)) ([e34def8](https://github.com/XasCode/chalk/commit/e34def8f19dc917ed6b385f0c1ddbdc96f1421d4))

## Changelog

All notable changes to this project are documented here.

This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Removed

- **BREAKING:** Remove the deprecated `modifiers`, `foregroundColors`, `backgroundColors` and `colors` exports, and the deprecated `Modifiers`, `ForegroundColor`, `BackgroundColor` and `Color` types. Use the `*Name`/`*Names` equivalents; see `MIGRATION.md`.

### Changed

- Export `Chalk` as a constructor function instead of a `class`; `new Chalk(options)` is unchanged.
- Emit a Node.js deprecation warning when the CommonJS/UMD entry is loaded; retain the entry and API.
- Require Node.js 22 or newer.
- Enforce strict linting and TypeScript checks.

### Added

- Add package smoke tests for the published entry points.
