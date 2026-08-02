export interface Engine {
  readonly id:string;
  readonly name:string;
  readonly version:string;
  initialize():Promise<void>;
  start():Promise<void>;
  stop():Promise<void>;
  dispose():Promise<void>;
}
