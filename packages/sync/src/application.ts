import type { ContentFingerprint, LocalLibraryId, PublicationId, VersionId } from "@knowledgeos/domain-types";
import type { SyncPlan, TransferCheckpoint } from "./model.js";
import type { TransferCheckpointRepository } from "./checkpoints.js";
export interface SyncTransport { download(publicationId:PublicationId,versionId:VersionId,offset:number):AsyncIterable<Uint8Array>; }
export interface SyncBlobWriter { append(transferId:string,offset:number,bytes:Uint8Array):Promise<void>; verify(transferId:string,expected:ContentFingerprint,expectedLength:number):Promise<boolean>; commit(transferId:string,localLibraryId:LocalLibraryId,publicationId:PublicationId,versionId:VersionId):Promise<void>; }
export interface SyncRunClock { nowIso():string; }
export class MasterToLocalSyncService {
  public constructor(private readonly checkpoints:TransferCheckpointRepository,private readonly transport:SyncTransport,private readonly blobs:SyncBlobWriter,private readonly clock:SyncRunClock){}
  async execute(plan:SyncPlan,localLibraryId:LocalLibraryId):Promise<readonly TransferCheckpoint[]> {
    const results:TransferCheckpoint[]=[];
    for(const initial of plan.transfers){
      let current=(await this.checkpoints.get(initial.transferId))??initial;
      for await(const chunk of this.transport.download(current.publicationId,current.versionId,current.receivedBytes)){
        await this.blobs.append(current.transferId,current.receivedBytes,chunk);
        current={...current,receivedBytes:current.receivedBytes+chunk.byteLength,state:"transferring",updatedAt:this.clock.nowIso()};
        await this.checkpoints.save(current);
      }
      current={...current,state:"verifying",updatedAt:this.clock.nowIso()}; await this.checkpoints.save(current);
      if(!(await this.blobs.verify(current.transferId,current.expectedFingerprint,current.expectedByteLength))) { current={...current,state:"failed",updatedAt:this.clock.nowIso()}; await this.checkpoints.save(current); results.push(current); continue; }
      await this.blobs.commit(current.transferId,localLibraryId,current.publicationId,current.versionId);
      current={...current,state:"completed",updatedAt:this.clock.nowIso()}; await this.checkpoints.save(current); results.push(current);
    }
    return results;
  }
}
