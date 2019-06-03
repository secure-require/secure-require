require = module.constructor.prototype.require.bind(module); // OOPS!
require('util');
