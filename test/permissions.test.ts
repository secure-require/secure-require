import secureRequire from '../lib';

test('01 - secureRequire should not prevent acorn from doing stuff', () => {
  expect(() => secureRequire('acorn', [])).not.toThrow();
});

test('02 - secureRequire should prevent base from doing stuff', () => {
  expect(() => secureRequire('base', [])).toThrow();
});

test('03 - secureRequire should not prevent base from doing stuff if permissions are granted', () => {
  expect(() => secureRequire('base', ['util'])).not.toThrow();
});
