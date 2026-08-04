import * as fs from "node:fs/promises";
import { env, cwd } from "node:process";
import { dirname, join } from "node:path";

export type SyncPhase = "idle" | "running" | "paused" | "offline" | "failed";
export interface SyncConflict { readonly id:string; readonly entityType:string; readonly entityId:string; readonly localUpdatedAt:string; readonly remoteUpdatedAt:string; readonly reason:string; }
export interface SyncStatus { readonly phase:SyncPhase; readonly cursor:string; readonly pending:number; readonly uploaded:number; readonly downloaded:number; readonly retryCount:number; readonly lastSyncAt?:string; readonly lastError?:string; readonly conflicts:readonly SyncConflict[]; }
interface PersistedState { readonly version:1; readonly status:SyncStatus; readonly queue:readonly SyncOperation[]; }
export interface SyncOperation { readonly id:string; readonly entityType:"reading-location"|"annotation"|"bookmark"|"workspace"; readonly entityId:string; readonly action:"upsert"|"delete"; readonly payload:unknown; readonly createdAt:string; readonly attempt:number; }

export class SyncCoordinator {
  private state:PersistedState={version:1,status:{phase:"idle",cursor:"0",pending:0,uploaded:0,downloaded:0,retryCount:0,conflicts:[]},queue:[]};
  public constructor(private readonly file:string=join(env.KNOWLEDGEOS_DATA_DIR ?? join(cwd(),'.knowledgeos'),'sync-state.json')){}
  public async initialize():Promise<void>{ try { this.state=JSON.parse(await fs.readFile(this.file,'utf8')) as PersistedState; } catch { await this.persist(); } }
  public status():SyncStatus{return this.state.status;}
  public conflicts():readonly SyncConflict[]{return this.state.status.conflicts;}
  public async enqueue(operation:Omit<SyncOperation,'attempt'>):Promise<void>{this.state={...this.state,queue:[...this.state.queue,{...operation,attempt:0}],status:{...this.state.status,pending:this.state.queue.length+1}};await this.persist();}
  public async start():Promise<SyncStatus>{ if(this.state.status.phase==='running') return this.status(); this.state={...this.state,status:{...this.state.status,phase:'running'}}; await this.persist(); await this.runBatch(); return this.status(); }
  public async pause():Promise<SyncStatus>{this.state={...this.state,status:{...this.state.status,phase:'paused'}};await this.persist();return this.status();}
  public async resume():Promise<SyncStatus>{return this.start();}
  public async cancel():Promise<SyncStatus>{this.state={...this.state,status:{...this.state.status,phase:'idle'}};await this.persist();return this.status();}
  public async setOffline():Promise<SyncStatus>{this.state={...this.state,status:{...this.state.status,phase:'offline'}};await this.persist();return this.status();}
  private async runBatch():Promise<void>{
    const batch=this.state.queue.slice(0,50); const remaining=this.state.queue.slice(batch.length);
    const uploaded=this.state.status.uploaded+batch.length; const cursor=String(Number(this.state.status.cursor)+batch.length);
    this.state={...this.state,queue:remaining,status:{...this.state.status,phase:'idle',cursor,pending:remaining.length,uploaded,downloaded:this.state.status.downloaded,lastSyncAt:new Date().toISOString(),retryCount:0}};
    await this.persist();
  }
  private async persist():Promise<void>{ await fs.mkdir(dirname(this.file),{recursive:true}); const tmp=`${this.file}.tmp`; await fs.writeFile(tmp,JSON.stringify(this.state,null,2),'utf8'); await fs.rename(tmp,this.file); }
}

export const syncCoordinator=new SyncCoordinator();
