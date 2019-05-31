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
