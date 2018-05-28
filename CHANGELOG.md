### 1.1.8

- handle undefined and null more gracefully and log a warning in the console.

### 1.1.5

- allow HTML and natural text to pass as-is for a more lenient translate directive (allowing conditional translation within child components -- pass a key and have it translate, or pass an already translated string and have it display).

### 1.1.1 - 1.1.4

- `umd` build integration with `rollup`.

## 1.1.0

- change `[translateParams]` `@Input` to be the same name as the directive name for a more concise interface (ie. now `[translate]="{param: 'value'}"`)
- `setLanguage` is now `setOverride` - to better describe what it does ('language' can be assumed, so it's unnecessary).

### 1.0.2

- Revert initial setup from RxJS 6 to allow more universal application (with a forecast of moving the RxJS 6 in a version `2.0.0`).

### 1.0.1

- minor format updates.
