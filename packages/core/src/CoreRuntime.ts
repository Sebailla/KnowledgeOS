import type { Engine, EngineContext } from "@knowledgeos/kernel";
export type CoreRuntimeState = "created"|"initialized"|"running"|"stopped"|"disposed";
export class CoreRuntime {
 private state:CoreRuntimeState="created";
 public constructor(private readonly engines:readonly Engine[]){assertUnique(this.engines);assertDependencies(this.engines);}
 public get currentState():CoreRuntimeState{return this.state;}
 public listEngines():readonly Engine[]{return [...this.engines];}
 public async initialize(context:EngineContext):Promise<void>{this.require("created");for(const e of this.engines)await e.initialize(context);this.state="initialized";}
 public async start(context:EngineContext):Promise<void>{this.require("initialized");for(const e of this.engines)await e.start(context);this.state="running";}
 public async stop(context:EngineContext):Promise<void>{this.require("running");for(const e of [...this.engines].reverse())await e.stop(context);this.state="stopped";}
 public async dispose(context:EngineContext):Promise<void>{if(this.state==="disposed")return;for(const e of [...this.engines].reverse())await e.dispose(context);this.state="disposed";}
 private require(expected:CoreRuntimeState):void{if(this.state!==expected)throw new Error(`Core runtime state '${this.state}' expected '${expected}'.`);}
}
function assertUnique(engines:readonly Engine[]):void{const ids=engines.map(e=>e.id);if(new Set(ids).size!==ids.length)throw new Error("Duplicate engine ids.");}
function assertDependencies(engines:readonly Engine[]):void{const ids=new Set(engines.map(e=>e.id));for(const e of engines)for(const dep of e.dependencies ?? [])if(!ids.has(dep))throw new Error(`Engine '${e.id}' requires missing dependency '${dep}'.`);}
