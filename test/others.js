// These are the tests which won't run with jest
const assert = require('assert');
const { default: secureRequire } = require('../dist');

require('./fixtures/e');
assert.throws(() => {
  secureRequire('./fixtures/e');
});
