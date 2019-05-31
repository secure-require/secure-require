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

test('secureRequire should work with third-party modules', () => {
  const strictAcorn = secureRequire('acorn');
  const acorn = require('acorn');
  expect(JSON.stringify(strictAcorn)).toEqual(JSON.stringify(acorn));
});

test('normal require compiles modules in the same context', () => {
  require('./fixtures/a');
  expect(require('./fixtures/b')).toBe(0);
});

test('secureRequire compiles modules in different contexts', () => {
  secureRequire('../test/fixtures/a');
  expect(secureRequire('../test/fixtures/b')).toBe(1);
});

test('secureRequire should not prevent acorn from doing stuff', () => {
  expect(() => secureRequire('acorn', [])).not.toThrow();
});

test('secureRequire should prevent base from doing stuff', () => {
  expect(() => secureRequire('base', [])).toThrow();
});

test('secureRequire should not prevent base from doing stuff if permissions are granted', () => {
  expect(() => secureRequire('base', ['util'])).not.toThrow();
});
