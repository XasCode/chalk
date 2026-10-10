# Changelog

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
