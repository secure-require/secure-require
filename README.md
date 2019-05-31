# secure-require

> A secure require implementation for ECMAScript

Feel more confident running a bunch of untrusted dependencies as a part of your
application or module by allowing said dependency to only use a subset of core
APIs. This allows you to make sure that none of the sub-dependencies try
anything unexpected, no matter which version you upgrade to.

## Features

1. Run each top-level dependency in a separate container.
2. Restrict each dependency to `require` only a subset of core modules.
3. Zero dependencies (duh).

### Installation

```
npm i secure-require
```

### Usage

```js
const secureRequire = require('secure-require');
// Since secure-require doesn't have any dependencies, this should be fine.
safeRequire('acorn', []);
// This should pass since acorn is written without any dependencies or core modules.
safeRequire('base', []);
// This should fail since base requires the util core module.
safeRequire('base', ['util']);
// This should pass since we just allowed base to use the util module. Now, we
// need not worry about base doing anything funny with the filesystem or the
// network. It literally cannot.
```

### License

[MIT](./LICENSE)
