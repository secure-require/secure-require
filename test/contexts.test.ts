import secureRequire from '../lib';

test('01 - normal require compiles modules in the same context', () => {
  require('./fixtures/a');
  expect(require('./fixtures/b')).toBe(0);
});

test('02 - secureRequire compiles modules in different contexts', () => {
  secureRequire('./fixtures/a');
  expect(secureRequire('./fixtures/b')).toBe(1);
});
