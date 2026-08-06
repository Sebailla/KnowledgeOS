declare module "node:fs/promises" { export function mkdir(path:string,options?:{recursive?:boolean}):Promise<void>; export function writeFile(path:string,data:Uint8Array):Promise<void>; export function rename(oldPath:string,newPath:string):Promise<void>; }
declare module "node:path" { export function join(...parts:string[]):string; }
declare module "node:crypto" { export function createHash(name:string):{update(data:Uint8Array):any;digest(encoding:"hex"):string}; }
