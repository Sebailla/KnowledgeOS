import {Engine} from '../contracts/Engine.js';
export class EngineRegistry{
 private engines=new Map<string,Engine>();
 register(e:Engine){if(this.engines.has(e.id)) throw new Error(`Engine '${e.id}' already registered`); this.engines.set(e.id,e);}
 getAll(){return [...this.engines.values()];}
}
