import type { ChangeSet } from "./model/ChangeSet.js";
import type { Snapshot } from "./model/Snapshot.js";
import type { SyncConflict } from "./model/SyncConflict.js";
import type { SyncRecord } from "./model/SyncRecord.js";
export interface SyncPlan { readonly localChanges: ChangeSet; readonly remoteChanges: ChangeSet; readonly conflicts: readonly SyncConflict[]; }
export class SyncPlanner {
 public plan(local: Snapshot, remote: Snapshot): SyncPlan {
  const l=new Map(local.records.map(r=>[r.id,r])); const r=new Map(remote.records.map(x=>[x.id,x]));
  const ids=new Set([...l.keys(),...r.keys()]); const lc:SyncRecord[]=[],lu:SyncRecord[]=[],ld:SyncRecord[]=[]; const rc:SyncRecord[]=[],ru:SyncRecord[]=[],rd:SyncRecord[]=[]; const conflicts:SyncConflict[]=[];
  for(const id of ids){const a=l.get(id),b=r.get(id); if(!a&&b){(b.deleted?ld:lc).push(b);continue;} if(a&&!b){(a.deleted?rd:rc).push(a);continue;} if(!a||!b)continue;
   if(a.version===b.version&&a.checksum===b.checksum&&a.deleted===b.deleted)continue;
   if(a.version===b.version&&a.checksum!==b.checksum){conflicts.push({recordId:id,local:a,remote:b,reason:'checksum-mismatch'});continue;}
   if(a.deleted!==b.deleted){conflicts.push({recordId:id,local:a,remote:b,reason:'delete-update'});continue;}
   if(a.version>b.version)ru.push(a); else if(b.version>a.version)lu.push(b); else conflicts.push({recordId:id,local:a,remote:b,reason:'divergent-update'});
  }
  return {localChanges:{created:lc,updated:lu,deleted:ld},remoteChanges:{created:rc,updated:ru,deleted:rd},conflicts};
 }
}
