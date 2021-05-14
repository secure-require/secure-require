import fs from 'fs';
const Module = require('module'); // Reasons:tm:
import path from 'path';
import vm from 'vm';

interface ModuleMap {
  [index: string]: NodeModule;
}

interface StringIndexedObject {
  [index: string]: Object;
}

function createModule(filename: string, parent: NodeModule): NodeModule {
  const mod = new Module(filename, parent);
  mod.require = undefined;
  mod.constructor = null;
  return mod;
}

export default function secureRequire(
  specifier: string,
  permittedModules?: string[],
  context?: vm.Context,
  cache?: ModuleMap
): Object | undefined {
  if (!specifier || specifier === '') throw new Error();
  if (!context || !vm.isContext(context)) context = vm.createContext();
  if (!permittedModules || !Array.isArray(permittedModules))
    permittedModules = Module.builtinModules;
  let parent;
  if (cache === undefined) {
    cache = Object.create(null);
    parent = module.parent;
  }

  // If a NativeModule is required, not much can be done.
  // TODO: Talk to people about exposing the NativeModule class so that these
  // could be handled.
  if (permittedModules!.indexOf(specifier) > -1) {
    if (specifier === 'module') throw new Error('Cannot require Module class.');
    const exp = require(specifier);

    const validator = {
      get(target: StringIndexedObject, key: string): Object | undefined {
        const res = Reflect.get(target, key);
        if (res === undefined) return undefined;
        const desc = Object.getOwnPropertyDescriptor(target, key)!;
        const { writable, configurable } = desc;
        const nonPrimitive = typeof res === 'object' && res !== null;
        if (nonPrimitive && writable && configurable) {
          return new Proxy(res, validator);
        } else {
          return res;
        }
      },
      set() {
        throw new Error('Cannot set properties in core modules.');
      }
    };
    const proxy = new Proxy(exp, validator);
    return proxy;
  }

  const filename: string = Module._resolveFilename(
    specifier,
    parent || module,
    false
  );
  
  if (filename.endsWith('.node')) {
    return null;
  }

  const cached = cache![filename];
  if (cached) {
    return cached.exports;
  }

  const newModule = createModule(filename, parent || module);
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
  newModule: NodeModule,
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
    (id: string) => secureRequire(id, permittedModules, context, cache),
    newModule,
    filename,
    dirname
  );
}
