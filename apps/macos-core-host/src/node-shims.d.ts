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
  export function cwd(): string;
}

declare const process: {
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

declare module "node:fs/promises" { export function mkdir(path:string,options?:unknown):Promise<void>; export function readFile(path:string,encoding:string):Promise<string>; export function rename(oldPath:string,newPath:string):Promise<void>; export function copyFile(source:string,destination:string):Promise<void>; export function writeFile(path:string,data:string,encoding:string):Promise<void>; export function access(path:string):Promise<void>; }
declare module "node:path" { export function dirname(path:string):string; export function join(...paths:string[]):string; }
declare const process: { cwd():string; env:Record<string,string|undefined>; once(event:string,listener:()=>void):void; exit(code?:number):never; };
