import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

export default function strictRequire(
  specifier: string,
  context: vm.Context
): Object {
  if (!specifier || specifier === '') throw new Error();
  if (!context || !vm.isContext(context)) {
    context = vm.createContext();
  }

  // TODO: Resolve specifier to an actual filename
  const filename = specifier;
  const dirname = path.dirname(filename);
  const src = fs.readFileSync(filename, 'utf8');
  const fn = vm.compileFunction(
    src,
    ['exports', 'require', 'module', '__filename', '__dirname'],
    { filename, parsingContext: context }
  );
  return fn.call(exports, exports, strictRequire, module, filename);
}
