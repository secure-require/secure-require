# secure-require

> A secure require implementation for ECMAScript

![npm](https://img.shields.io/npm/v/secure-require.svg)
[![CircleCI](https://circleci.com/gh/secure-require/secure-require/tree/master.svg?style=svg)](https://circleci.com/gh/secure-require/secure-require/tree/master)

Feel more confident running a bunch of untrusted dependencies as a part of your
application or module by allowing said dependency to only use a subset of core
APIs. This allows you to make sure that none of the sub-dependencies try
anything unexpected, or are able to alter the global objects of your own application
code, no matter which version you upgrade to.

## Notice

I'd like to humbly request you to please refrain from using this module anyplace critical since it hasn't been audited properly and is still undergoing massive changes. You should be able to better rely on it once the v1.x is released.

## Security Model

* Full global isolation: Each top-level dependency is run in a separate container.
* Safely restrict the `require` tree to only a subset of allowed modules, including restricting Node.js core access.

## Features

1. Zero dependencies (wouldn't _that_ be ironic).
2. Uses the same stuff `require` uses behind-the-scenes, so performance dip should be next to none.
3. Supports core, third party and local modules.
4. Cache modules in the same context so that you get *close* to the speed of the original `require` function without losing any of the security guarantees.

## Imposed Restrictions (Incompatibilities)

The following are the security restrictions that are imposed by the function on your dependencies to ensure your safety. In case you disagree with any of these, or have a valid use case for doing any of the following that you believe should be supported, please do not hesitate to reach out.

1. A dependency cannot make use of any core module which isn't whitelisted throughout it's subtree (duh).
2. Since modules are compiled in seperate VM Contexts, monkey-patching globals will not work.
3. When a module requires a core module, they cannot set any property anywhere on that core module.
4. The use of `module.require` is forbidden.
5. No module can require the `Module` class anywhere down the chain.

## Installation

```
npm i secure-require
```

## Usage

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

## License

[MIT](./LICENSE)
