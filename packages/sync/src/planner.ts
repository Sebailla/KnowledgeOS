import type { LocalManifest, MasterManifest, SyncPlan, TransferCheckpoint } from "./model.js";
import { ManifestDiffService } from "./diff.js";
export interface SyncIdentityGenerator { planId(): string; transferId(): string; }
export interface SyncClock { nowIso(): string; }
export class SyncPlanner {
  public constructor(private readonly ids: SyncIdentityGenerator, private readonly clock: SyncClock, private readonly diff=new ManifestDiffService()) {}
  create(master: MasterManifest, local: LocalManifest): SyncPlan {
    const differences=this.diff.compare(master,local); const now=this.clock.nowIso();
    const transfers: TransferCheckpoint[]=differences.filter(d=>d.state!=="current").map(d=>({transferId:this.ids.transferId(),publicationId:d.master.publicationId,versionId:d.master.versionId,expectedFingerprint:d.master.fingerprint,expectedByteLength:d.master.byteLength,receivedBytes:0,state:"pending",updatedAt:now}));
    return {planId:this.ids.planId(),direction:"master-to-local",masterRevision:master.revision,localRevision:local.revision,transfers,unchanged:differences.length-transfers.length};
  }
}
