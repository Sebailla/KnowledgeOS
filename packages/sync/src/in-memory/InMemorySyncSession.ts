import type { SyncSession } from "../contracts/SyncSession.js";
import type { ChangeSet } from "../model/ChangeSet.js";
import type { Snapshot } from "../model/Snapshot.js";
import type { SyncRecord } from "../model/SyncRecord.js";
export class InMemorySyncSession implements SyncSession {
 private closed=false; public constructor(private readonly local=new Map<string,SyncRecord>(),private readonly remote=new Map<string,SyncRecord>(),private readonly now:()=>string=()=>new Date().toISOString()){}
 async captureLocal():Promise<Snapshot>{this.assertOpen();return{sourceId:'local',capturedAt:this.now(),records:[...this.local.values()]};}
 async captureRemote():Promise<Snapshot>{this.assertOpen();return{sourceId:'remote',capturedAt:this.now(),records:[...this.remote.values()]};}
 async applyLocal(c:ChangeSet):Promise<void>{this.assertOpen();apply(this.local,c);} async applyRemote(c:ChangeSet):Promise<void>{this.assertOpen();apply(this.remote,c);} async close():Promise<void>{this.closed=true;}
 seedLocal(rs:readonly SyncRecord[]):void{for(const r of rs)this.local.set(r.id,r);} seedRemote(rs:readonly SyncRecord[]):void{for(const r of rs)this.remote.set(r.id,r);} private assertOpen():void{if(this.closed)throw new Error('Sync session is closed.');}
}
function apply(target:Map<string,SyncRecord>,c:ChangeSet):void{for(const r of [...c.created,...c.updated])target.set(r.id,r);for(const r of c.deleted)target.delete(r.id);}
