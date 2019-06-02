import fs from 'fs';
const Module = require('module'); // Reasons:tm:
import path from 'path';
import vm from 'vm';

interface ModuleMap {
  [index: string]: NodeModule;
}

function createModule(filename: string, parent: NodeModule): NodeModule {
  const mod = new Module(filename, parent);
  mod.require = undefined;
  return mod;
}

export default function secureRequire(
  this: any,
  specifier: string,
  permittedModules?: string[],
  context?: vm.Context,
  cache?: ModuleMap
): Object | undefined {
  if (!specifier || specifier === '') throw new Error();
  if (!context || !vm.isContext(context)) context = vm.createContext();
  if (!permittedModules || !Array.isArray(permittedModules))
    permittedModules = Module.builtinModules;
  cache = cache || Object.create(null);

  // If a NativeModule is required, not much can be done.
  // TODO: Talk to people about exposing the NativeModule class so that these
  // could be handled.
  if (permittedModules!.indexOf(specifier) > -1) {
    return require(specifier);
  }

  // TODO: Check if this resolves perfectly or if it should resolve relative to
  // the parent.
  // module = module.parent
  const filename: string = Module._resolveFilename(specifier, module, false);
  const cached = cache![filename];
  if (cached) {
    return cached.exports;
  }

  const newModule = createModule(filename, module);
  cache![filename] = newModule;
  let threw = true;
  try {
    secureLoad(newModule, filename, context, permittedModules!, cache!);
    threw = false;
  } finally {
    if (threw) delete cache![filename];
  }
  return newModule.exports;
}

function secureLoad(
  newModule: any,
  filename: string,
  context: vm.Context,
  permittedModules: string[],
  cache: ModuleMap
) {
  const dirname = path.dirname(filename);
  const src = fs.readFileSync(filename, 'utf8');
  const compiled = vm.compileFunction(
    src,
    ['exports', 'require', 'module', '__filename', '__dirname'],
    { filename, parsingContext: context }
  );
  compiled.call(
    newModule.exports,
    newModule.exports,
    (id: any) => secureRequire(id, permittedModules, context, cache),
    newModule,
    filename,
    dirname
  );
}
