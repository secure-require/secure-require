"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var mod = require('module'); // Reasons:tm:
var path = __importStar(require("path"));
var vm = __importStar(require("vm"));
function secureRequire(specifier, permittedModules, context) {
    if (!specifier || specifier === '')
        throw new Error();
    if (!context || !vm.isContext(context))
        context = vm.createContext();
    if (!permittedModules || !Array.isArray(permittedModules))
        permittedModules = mod.builtinModules;
    // If a NativeModule is required, not much can be done.
    // TODO: Talk to people about exposing the NativeModule class so that these
    // could be handled.
    if (permittedModules.indexOf(specifier) > -1) {
        return require(specifier);
    }
    // TODO: Check if this resolves perfectly or if it should resolve relative to
    // the parent.
    // module = module.parent
    var filename = mod.Module._resolveFilename(specifier, module, false);
    var newModule = new mod.Module(filename, module);
    var dirname = path.dirname(filename);
    var src = fs.readFileSync(filename, 'utf8');
    var fn = vm.compileFunction(src, ['exports', 'require', 'module', '__filename', '__dirname'], { filename: filename, parsingContext: context });
    fn.call(newModule.exports, newModule.exports, function (id) { return secureRequire(id, permittedModules, context); }, newModule, filename, dirname);
    return newModule.exports;
}
exports.default = secureRequire;
