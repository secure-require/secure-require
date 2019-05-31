"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = __importDefault(require("../lib"));
test('secureRequire should work with local files', function () {
    var strictFs = lib_1.default('../jest.config.js');
    var fs = require('../jest.config.js');
    expect(strictFs).toEqual(fs);
});
test('secureRequire should work with core modules', function () {
    var strictFs = lib_1.default('fs');
    var fs = require('fs');
    expect(strictFs).toEqual(fs);
});
test('secureRequire should work with third-party modules', function () {
    var strictAcorn = lib_1.default('acorn');
    var acorn = require('acorn');
    expect(JSON.stringify(strictAcorn)).toEqual(JSON.stringify(acorn));
});
test('normal require compiles modules in the same context', function () {
    require('./fixtures/a');
    expect(require('./fixtures/b')).toBe(0);
});
test('secureRequire compiles modules in different contexts', function () {
    lib_1.default('../test/fixtures/a');
    expect(lib_1.default('../test/fixtures/b')).toBe(1);
});
test('secureRequire should not prevent acorn from doing stuff', function () {
    expect(function () { return lib_1.default('acorn', []); }).not.toThrow();
});
test('secureRequire should prevent base from doing stuff', function () {
    expect(function () { return lib_1.default('base', []); }).toThrow();
});
test('secureRequire should not prevent base from doing stuff if permissions are granted', function () {
    expect(function () { return lib_1.default('base', ['util']); }).not.toThrow();
});
