import * as fs from 'fs';
const module = require('module'); // Reasons:tm:
import * as path from 'path';
import * as vm from 'vm';

export default function secureRequire(
  this: any,
  specifier: string,
  context?: vm.Context
): Object {
  if (!specifier || specifier === '') throw new Error();
  if (!context || !vm.isContext(context)) {
    context = vm.createContext();
  }

  // If a NativeModule is required, not much can be done.
  // TODO: Talk to people about exposing the NativeModule class so that these
  // could be handled.
  if (module.builtinModules.indexOf(specifier) > -1) {
    return require(specifier);
  }

  const filename = module.Module._resolveFilename(specifier, this, false);
  const dirname = path.dirname(filename);
  const src = fs.readFileSync(filename, 'utf8');
  const fn = vm.compileFunction(
    src,
    ['exports', 'require', 'module', '__filename', '__dirname'],
    { filename, parsingContext: context }
  );

  // TODO: Make this simpler
  // TODO: Once this is simpler, upstream that change to core
  const exp = this.exports;
  const thisValue = exp;
  const mod = this;
  fn.call(thisValue, exp, secureRequire, mod, filename, dirname);
  return this.exports;
}
