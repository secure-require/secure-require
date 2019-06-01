# secure-require

> A secure require implementation for ECMAScript

Feel more confident running a bunch of untrusted dependencies as a part of your
application or module by allowing said dependency to only use a subset of core
APIs. This allows you to make sure that none of the sub-dependencies try
anything unexpected, or are able to alter the global objects of your own application
code, no matter which version you upgrade to.

## Features

1. Full global isolation: Each top-level dependency is run in a separate container.
2. Safely restrict the `require` tree to only a subset of allowed modules, including restricting Node.js core access.
3. Zero dependencies (duh).
4. Uses the same stuff `require` uses behind-the-scenes, so performance dip should be next to none.
5. Supports core, third party and local modules.

### Installation

```
npm i secure-require
```

### Usage

```js
const secureRequire = require('secure-require');
// Since secure-require doesn't have any dependencies, this should be fine.
secureRequire('acorn', []);
// This should pass since acorn is written without any dependencies or core modules.
secureRequire('base', []);
// This should fail since base requires the util core module.
secureRequire('base', ['util']);
// This should pass since we just allowed base to use the util module. Now, we
// need not worry about base doing anything funny with the filesystem or the
// network. It literally cannot.
```

### License

[MIT](./LICENSE)
