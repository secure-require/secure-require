/// <reference types="node" />
import * as vm from 'vm';
export default function secureRequire(this: any, specifier: string, permittedModules?: Array<string>, context?: vm.Context): Object | undefined;
