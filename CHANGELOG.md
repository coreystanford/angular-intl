### 2.0.1

- add documentation via compodoc

# 2.0.0

- Upgrade to Angular 6 and RxJS 6 (with pipeable operators)
- Upgrade rollup build configuration to new standard and distribute `AOT`, `esm2015`, `fesm2015`, `esm5` and `umd`

### 1.1.8 - 1.1.12

- handle undefined and null more gracefully and log a warning in the console.
- update getFileByName to more rreliably capture the translations by adding the default fallback to the call. This ensures the new file doesn't throw a lot of warnings in the console, thus slowing the app.

### 1.1.5

- Allow HTML and natural text to pass as-is for a more lenient translate directive (allowing conditional translation within child components -- pass a key and have it translate, or pass an already translated string and have it display).

### 1.1.1 - 1.1.4

- `umd` build integration with `rollup`.

## 1.1.0

- Change `[translateParams]` `@Input` to be the same name as the directive name for a more concise interface (ie. now `[translate]="{param: 'value'}"`)
- `setLanguage` is now `setOverride` - to better describe what it does ('language' can be assumed, so it's unnecessary).

### 1.0.2

- Revert initial setup from RxJS 6 to allow more universal application (with a forecast of moving the RxJS 6 in a version `2.0.0`).

### 1.0.1

- Minor format updates.
