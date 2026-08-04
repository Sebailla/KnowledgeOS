declare module "node:test" {
  type TestFunction = (
    name: string,
    fn: () => void | Promise<void>,
  ) => void;

  const test: TestFunction;
  export default test;
}

declare module "node:assert/strict" {
  interface Assert {
    equal(
      actual: unknown,
      expected: unknown,
    ): void;
    rejects(
      block: () => Promise<unknown>,
      error?: new (...args: never[]) => Error,
    ): Promise<void>;
  }

  const assert: Assert;
  export default assert;
}

declare module "node:fs/promises" { export function mkdtemp(prefix:string):Promise<string>; export function readFile(path:string,encoding:string):Promise<string>; export function rm(path:string,options?:unknown):Promise<void>; export function writeFile(path:string,data:string,encoding:string):Promise<void>; }
declare module "node:os" { export function tmpdir():string; }
declare module "node:path" { export function join(...paths:string[]):string; }

declare module "node:fs/promises" { export function mkdtemp(prefix:string):Promise<string>; export function readFile(path:string,encoding:string):Promise<string>; export function rm(path:string,options?:unknown):Promise<void>; export function writeFile(path:string,data:string,encoding:string):Promise<void>; }
declare module "node:os" { export function tmpdir():string; }
declare module "node:path" { export function join(...paths:string[]):string; }
