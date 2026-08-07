declare namespace NodeJS {
  interface ReadableStream {}
}

declare module "node:process" {
  export const stdin:
    NodeJS.ReadableStream;
  export const stdout: {
    write(value: string): void;
  };
  export const env: Record<string, string | undefined>;
  export const platform: string;
  export const arch: string;
  export const version: string;
  export function cwd(): string;
}

declare const process: {
  readonly env: Record<string, string | undefined>;
  once(
    event: string,
    listener: () => void,
  ): void;
  exit(code?: number): never;
};

declare module "node:readline" {
  export interface Interface {
    on(
      event: "line",
      listener: (line: string) => void,
    ): void;
    close(): void;
  }

  export function createInterface(
    options: {
      readonly input:
        NodeJS.ReadableStream;
      readonly crlfDelay?: number;
    },
  ): Interface;
}

declare module "node:fs/promises" { export function mkdir(path:string,options?:unknown):Promise<void>; export function readFile(path:string,encoding:string):Promise<string>; export function rename(oldPath:string,newPath:string):Promise<void>; export function copyFile(source:string,destination:string):Promise<void>; export function writeFile(path:string,data:string,encoding:string):Promise<void>; export function access(path:string):Promise<void>; }
declare module "node:path" { export function dirname(path:string):string; export function join(...paths:string[]):string; }
declare const process: { cwd():string; env:Record<string,string|undefined>; once(event:string,listener:()=>void):void; exit(code?:number):never; };

declare module "node:crypto" { export function createHash(algorithm:string): { update(value: Uint8Array | string): { digest(encoding:"hex"):string } }; export function randomUUID():string; }
declare module "node:fs" { export const constants: { O_RDONLY:number; O_NOFOLLOW:number }; }
declare module "node:fs/promises" { export function lstat(path:string):Promise<{isFile():boolean;isSymbolicLink():boolean}>; export function open(path:string,flags:number):Promise<{fd:number;readFile():Promise<Uint8Array>;stat():Promise<{isFile():boolean}>;close():Promise<void>}>; export function rm(path:string,options?:unknown):Promise<void>; export function symlink(target:string,path:string):Promise<void>; }
declare module "node:fs/promises" { export function writeFile(path:string,data:string):Promise<void>; }
declare module "node:path" { export function resolve(...paths:string[]):string; export const sep:string; }

declare module "node:fs/promises" { export function mkdir(path:string,options?:unknown):Promise<void>; export function readFile(path:string,encoding:string):Promise<string>; export function rename(oldPath:string,newPath:string):Promise<void>; export function copyFile(source:string,destination:string):Promise<void>; export function writeFile(path:string,data:string,encoding:string):Promise<void>; export function access(path:string):Promise<void>; }
declare module "node:path" { export function dirname(path:string):string; export function join(...paths:string[]):string; }
declare const process: { cwd():string; env:Record<string,string|undefined>; once(event:string,listener:()=>void):void; exit(code?:number):never; };

declare const process: {
  readonly env:
    Record<string, string | undefined>;
  once(
    event: string,
    listener: () => void,
  ): void;
  exit(code?: number): never;
};

declare const process: {
  readonly env:
    Record<string, string | undefined>;
  readonly platform: string;
  readonly arch: string;
  readonly version: string;
  once(
    event: string,
    listener: () => void,
  ): void;
  exit(code?: number): never;
};
