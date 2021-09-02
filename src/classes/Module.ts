import { NodeVM } from 'vm2';
import { builtinModules } from 'module';
import { Console } from 'console';
import { promises as fs, createWriteStream } from 'fs';
import path from 'path';

interface IPackageJson {
  name: string;
  version: string;
  description: string;
  main: string;
  dependencies?: {[key: string]: string};
  config?: {[key: string]: string};
  softDependency?: {[key: string]: string};
  permissions?: Array<string>;
  modules: Array<string>;
}

export class Module {

  private static modules: Map<string, Module> = new Map<string, Module>();

  private readonly vm: NodeVM;
  private readonly data: IPackageJson;

  private readonly sandbox: {[key: string]: unknown} = {};

  private console: Console;

  private constructor(data: IPackageJson) {

    this.data = data;

    // TODO: own function ?
    const output = createWriteStream(`./outputlog_${data.name}.txt`);
    const error = createWriteStream(`./errlog_${data.name}.txt`);

    this.console = new Console(output, error);

    this.sandbox.console = this.console;

    this.vm = new NodeVM({
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

  public static async createModule(moduleName: string): Promise<Module> {

    // TODO: mayby change ?
    const modulePath = path.dirname(require.resolve(`${moduleName}/package.json`));
    const rawPackageJson = await fs.readFile(path.join(modulePath, 'package.json')).then(buffer => buffer.toString());
    const packageJson = JSON.parse(rawPackageJson) as IPackageJson;

    // TODO: check that the this.data.main file exists
    if (packageJson.permissions?.every(permission => builtinModules.includes(permission))) {
      throw new Error('Nice try Permission not allowed');
    }

    return new this(packageJson);
  }

  public run(): void {
    try {
      this.vm.runFile(require.resolve(this.data.name));
    } catch (error) {
      this.console.error(error);
    }
  }
}
