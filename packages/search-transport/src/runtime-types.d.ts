declare class Buffer extends Uint8Array { static concat(values: readonly Uint8Array[]): Buffer; toString(encoding?:string):string; }
declare module "node:events" { export class EventEmitter { on(name:string,listener:(value:any)=>void):this; emit(name:string,value:any):boolean; off(name:string,listener:(value:any)=>void):this; } }
