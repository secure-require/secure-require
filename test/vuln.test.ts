import secureRequire from '../lib';

test('01 - module require should be available inside require but not secureRequire', () => {
  expect(() => secureRequire('../test/fixtures/c')).toThrow();
  expect(() => require('../test/fixtures/c')).not.toThrow();
});

test('02 - module should not be able to pass stuff by setting on core modules', () => {
  expect(() => {
    secureRequire('./fixtures/d/first', ['util', 'fs']);
    secureRequire('./fixtures/d/second', ['util']);
  }).toThrow();
  expect(() => {
    require('./fixtures/d/first');
    require('./fixtures/d/second');
  }).not.toThrow();
});

test('03 - module should not be able to pass stuff by setting on core modules - nested', () => {
  expect(() => {
    secureRequire('./fixtures/f/first', ['util', 'fs']);
    secureRequire('./fixtures/f/second', ['util']);
  }).toThrow();
  expect(() => {
    require('./fixtures/f/first');
    require('./fixtures/f/second');
  }).not.toThrow();
});

test('04 - module should not be able to require the Module class, even if it is permitted', () => {
  expect(() => {
    secureRequire('./fixtures/g', []);
  }).toThrow();
  expect(() => {
    secureRequire('./fixtures/g', ['module']);
  }).toThrow();
  expect(() => {
    require('./fixtures/g');
  }).not.toThrow();
});
