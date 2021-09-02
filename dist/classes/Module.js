"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const vm2_1 = require("vm2");
const module_1 = require("module");
const console_1 = require("console");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class Module {
    constructor(data) {
        this.sandbox = {};
        this.data = data;
        // TODO: own function ?
        const output = (0, fs_1.createWriteStream)(`./outputlog_${data.name}.txt`);
        const error = (0, fs_1.createWriteStream)(`./errlog_${data.name}.txt`);
        this.console = new console_1.Console(output, error);
        this.sandbox.console = this.console;
        this.vm = new vm2_1.NodeVM({
            require: {
                builtin: data.permissions,
                mock: {
                    modulaid: console.log
                }
            },
            sandbox: this.sandbox,
            console: 'off'
        });
        Module.modules.set(data.name, this);
    }
    static async createModule(moduleName) {
        // TODO: mayby change ?
        const modulePath = path_1.default.dirname(require.resolve(`${moduleName}/package.json`));
        const rawPackageJson = await fs_1.promises.readFile(path_1.default.join(modulePath, 'package.json')).then(buffer => buffer.toString());
        const packageJson = JSON.parse(rawPackageJson);
        // TODO: check that the this.data.main file exists
        if (packageJson.permissions?.every(permission => module_1.builtinModules.includes(permission))) {
            throw new Error('Nice try Permission not allowed');
        }
        return new this(packageJson);
    }
    run() {
        try {
            this.vm.runFile(require.resolve(this.data.name));
        }
        catch (error) {
            this.console.error(error);
        }
    }
}
exports.Module = Module;
Module.modules = new Map();
