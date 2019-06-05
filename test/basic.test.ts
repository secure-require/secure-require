import secureRequire from '../lib';

test('01 - Should work with local files', () => {
  const strictFs = secureRequire('../jest.config');
  const fs = require('../jest.config');
  expect(strictFs).toEqual(fs);
});

test('02 - Should work with core modules', () => {
  const strictFs = secureRequire('fs');
  const fs = require('fs');
  expect(strictFs).toEqual(fs);
});

test('03 - Should work with third-party modules', () => {
  const strictAcorn = secureRequire('acorn');
  const acorn = require('acorn');
  expect(JSON.stringify(strictAcorn)).toEqual(JSON.stringify(acorn));
});
