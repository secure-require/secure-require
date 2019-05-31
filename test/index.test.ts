import strictRequire from '../lib';

test('strictRequire should work', () => {
  const strictFs = strictRequire('../jest.config.js');
  const fs = require('../jest.config.js');
  expect(strictFs).toBe(fs);
});
