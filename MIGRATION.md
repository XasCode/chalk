# Migration Guide

## Unreleased

### Node.js requirement

This package now requires Node.js 22 or newer. Upgrade the runtime used by your application and CI before updating this package.

### CommonJS deprecation

Loading the CommonJS entry with `require('@xascode/chalk')` now emits a `DeprecationWarning` with code `DEP_XASCODE_CHALK_CJS`. The entry and API remain available; no removal version is announced.

Migrate to ESM to avoid the warning:

```js
import { Chalk } from '@xascode/chalk';
```

The ESM entry does not emit the warning.

### Removed deprecated aliases (breaking)

The aliases that were deprecated in favor of the `*Name`/`*Names` exports are removed from both the runtime and the type declarations. Replace them as follows:

| Removed | Use instead |
| --- | --- |
| `modifiers` | `modifierNames` |
| `foregroundColors` | `foregroundColorNames` |
| `backgroundColors` | `backgroundColorNames` |
| `colors` | `colorNames` |
| type `Modifiers` | `ModifierName` |
| type `ForegroundColor` | `ForegroundColorName` |
| type `BackgroundColor` | `BackgroundColorName` |
| type `Color` | `ColorName` |

```js
// Before
import { foregroundColors } from '@xascode/chalk';
// After
import { foregroundColorNames } from '@xascode/chalk';
```

### `Chalk` is now a constructor function

`Chalk` is exported as a function instead of a `class`. `new Chalk(options)` behaves as before and the type declaration is unchanged. `Chalk(options)` without `new` now also works, and `instance instanceof Chalk` is now `true`. Code that relies on `Chalk` being a `class` (for example `class Foo extends Chalk`) must be changed to wrap an instance instead.
