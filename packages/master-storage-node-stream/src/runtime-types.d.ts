declare module "node:fs" { export function createReadStream(path:string,options?:{start?:number;end?:number}):AsyncIterable<Uint8Array>; }
declare module "node:path" { export function join(...parts:string[]):string; }
