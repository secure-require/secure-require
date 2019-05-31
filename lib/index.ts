import * as fs from 'fs';
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

  // TODO: Resolve specifier to an actual filename
  const filename = path.resolve(__dirname, specifier);
  const dirname = path.dirname(filename);
  const src = fs.readFileSync(filename, 'utf8');
  const fn = vm.compileFunction(
    src,
    ['exports', 'require', 'module', '__filename', '__dirname'],
    { filename, parsingContext: context }
  );

  // TODO: Make this simpler
  // TODO: Once this is simpler, upstream that change to core
  const exports = this.exports;
  const thisValue = exports;
  const module = this;
  fn.call(thisValue, exports, secureRequire, module, filename, dirname);
  return this.exports;
}
