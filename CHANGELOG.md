# 2.0.0

- Upgrade to Angular 6 and RxJS 6 (with pipeable operators)
- Upgrade rollup build configuration to new standard and distribute `AOT`, `esm2015`, `fesm2015`, `esm5` and `umd`
- Revert the leniency of the directive and pipe. This could be a breaking change for those that use the directive or pipe with variables that pass both keys and natural language, or place the directive on a parent element. The directive and pipe no longer allow anything other than keys to pass through, as introducing this ability to pass other content betrays the core tenant of the library: to translate a key to a value. If you have variables that can contain both keys and natural language, you must now split them apart at the template so that the pipe or directive only operate on the key, when passed. The library is less effective at resolving translations without showing the key as a flash of unstyled content without this restriction.

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
