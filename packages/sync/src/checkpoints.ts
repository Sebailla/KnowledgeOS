import type { TransferCheckpoint } from "./model.js";
export interface TransferCheckpointRepository { get(id:string):Promise<TransferCheckpoint|undefined>; save(value:TransferCheckpoint):Promise<void>; listByPlan(planId:string):Promise<readonly TransferCheckpoint[]>; }
export class InMemoryTransferCheckpointRepository implements TransferCheckpointRepository {
  private readonly values=new Map<string,{planId:string;checkpoint:TransferCheckpoint}>();
  async get(id:string){return this.values.get(id)?.checkpoint;}
  async save(value:TransferCheckpoint):Promise<void>{const previous=this.values.get(value.transferId); this.values.set(value.transferId,{planId:previous?.planId??"default",checkpoint:value});}
  async attach(planId:string,value:TransferCheckpoint):Promise<void>{this.values.set(value.transferId,{planId,checkpoint:value});}
  async listByPlan(planId:string){return [...this.values.values()].filter(v=>v.planId===planId).map(v=>v.checkpoint);}
}
export class TransferProgressService {
  advance(checkpoint:TransferCheckpoint,receivedBytes:number,now:string):TransferCheckpoint {
    if(receivedBytes<checkpoint.receivedBytes) throw new Error("Transfer progress cannot move backwards");
    if(receivedBytes>checkpoint.expectedByteLength) throw new Error("Transfer exceeds expected byte length");
    return {...checkpoint,receivedBytes,state:receivedBytes===checkpoint.expectedByteLength?"verifying":"transferring",updatedAt:now};
  }
  complete(checkpoint:TransferCheckpoint,now:string):TransferCheckpoint {
    if(checkpoint.receivedBytes!==checkpoint.expectedByteLength) throw new Error("Transfer is incomplete");
    return {...checkpoint,state:"completed",updatedAt:now};
  }
}
