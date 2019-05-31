import secureRequire from '../lib';

test('secureRequire should work with local files', () => {
  const strictFs = secureRequire('../jest.config.js');
  const fs = require('../jest.config.js');
  expect(strictFs).toEqual(fs);
});

test('secureRequire should work with core modules', () => {
  const strictFs = secureRequire('fs');
  const fs = require('fs');
  expect(strictFs).toEqual(fs);
});

test('normal require compiles modules in the same context', () => {
  require('./fixtures/a');
  expect(require('./fixtures/b')).toBe(0);
})

test('secureRequire compiles modules in different contexts', () => {
  secureRequire('../test/fixtures/a');
  expect(secureRequire('../test/fixtures/b')).toBe(1);
})
