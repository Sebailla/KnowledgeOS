import type { Engine, EngineContext } from "@knowledgeos/kernel";
import type { ConflictResolver } from "./contracts/ConflictResolver.js";
import type { SyncProvider } from "./contracts/SyncProvider.js";
import type { SyncSession } from "./contracts/SyncSession.js";
import { DefaultConflictResolver } from "./DefaultConflictResolver.js";
import type { ChangeSet } from "./model/ChangeSet.js";
import { defaultSyncPolicy, type SyncPolicy } from "./model/SyncPolicy.js";
import { SyncPlanner } from "./SyncPlanner.js";
export interface SyncRunResult { readonly conflicts:number; readonly appliedLocally:number; readonly appliedRemotely:number; }
export class SyncEngine implements Engine {
 readonly id='sync';readonly name='Sync Engine';readonly version='1.0.0';readonly dependencies=['storage','library'] as const;private session:SyncSession|undefined;private running=false;
 constructor(private readonly provider:SyncProvider,private readonly planner=new SyncPlanner(),private readonly resolver:ConflictResolver=new DefaultConflictResolver(),private readonly policy:SyncPolicy=defaultSyncPolicy){}
 async initialize(c:EngineContext):Promise<void>{c.cancellation.throwIfCancellationRequested();this.session=await this.provider.openSession();}
 async start(c:EngineContext):Promise<void>{c.cancellation.throwIfCancellationRequested();if(!this.session)throw new Error('Sync Engine must be initialized before start.');this.running=true;}
 async stop(_c:EngineContext):Promise<void>{this.running=false;} async dispose(_c:EngineContext):Promise<void>{await this.session?.close();await this.provider.close();this.session=undefined;this.running=false;}
 async synchronize():Promise<SyncRunResult>{if(!this.running)throw new Error('Sync Engine is not running.');const s=this.requireSession();const plan=this.planner.plan(await s.captureLocal(),await s.captureRemote());const rl: import('./model/SyncRecord.js').SyncRecord[]=[];const rr: import('./model/SyncRecord.js').SyncRecord[]=[];
  for(const c of plan.conflicts){const x=await this.resolver.resolve(c,this.policy);(x===c.remote?rl:rr).push(x);}
  const lc:ChangeSet={created:plan.localChanges.created,updated:[...plan.localChanges.updated,...rl],deleted:plan.localChanges.deleted};
  const rc:ChangeSet={created:plan.remoteChanges.created,updated:[...plan.remoteChanges.updated,...rr],deleted:plan.remoteChanges.deleted};
  await s.applyLocal(lc);await s.applyRemote(rc);return{conflicts:plan.conflicts.length,appliedLocally:count(lc),appliedRemotely:count(rc)};
 }
 private requireSession():SyncSession{if(!this.session)throw new Error('Sync session is unavailable.');return this.session;}
}
function count(c:ChangeSet):number{return c.created.length+c.updated.length+c.deleted.length;}
