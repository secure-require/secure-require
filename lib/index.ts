import * as fs from 'fs';
const mod = require('module'); // Reasons:tm:
import * as path from 'path';
import * as vm from 'vm';

export default function secureRequire(
  this: any,
  specifier: string,
  permittedModules?: Array<string>,
  context?: vm.Context
): Object | undefined {
  if (!specifier || specifier === '') throw new Error();
  if (!context || !vm.isContext(context)) context = vm.createContext();
  if (!permittedModules || !Array.isArray(permittedModules))
    permittedModules = mod.builtinModules;

  // If a NativeModule is required, not much can be done.
  // TODO: Talk to people about exposing the NativeModule class so that these
  // could be handled.
  if (permittedModules!.indexOf(specifier) > -1) {
    return require(specifier);
  }

  // TODO: Check if this resolves perfectly or if it should resolve relative to
  // the parent.
  // module = module.parent
  const filename = mod.Module._resolveFilename(specifier, module, false);
  const newModule = new mod.Module(filename, module);
  const dirname = path.dirname(filename);
  const src = fs.readFileSync(filename, 'utf8');
  const fn = vm.compileFunction(
    src,
    ['exports', 'require', 'module', '__filename', '__dirname'],
    { filename, parsingContext: context }
  );

  fn.call(
    newModule.exports,
    newModule.exports,
    (id: any) => secureRequire(id, permittedModules, context),
    newModule,
    filename,
    dirname
  );
  return newModule.exports;
}
