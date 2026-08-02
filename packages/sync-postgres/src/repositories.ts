import type { SqlExecutor, SqlRow } from "@knowledgeos/infrastructure-postgres";
import type { MasterManifest, LocalManifest, SyncPlan, TransferCheckpoint, TransferCheckpointRepository } from "@knowledgeos/sync";
function json<T>(v:unknown):T{return (typeof v==="string"?JSON.parse(v):v) as T;}
export class PostgresSyncManifestRepository {
 constructor(private readonly sql:SqlExecutor){}
 async saveMaster(v:MasterManifest){await this.sql.query(`insert into sync_master_manifests(manifest_id,revision,fingerprint,payload,generated_at) values($1,$2,$3,$4::jsonb,$5) on conflict(manifest_id) do update set revision=excluded.revision,fingerprint=excluded.fingerprint,payload=excluded.payload,generated_at=excluded.generated_at`,[v.manifestId,v.revision,v.fingerprint,JSON.stringify(v),v.generatedAt]);}
 async getMaster(id:string):Promise<MasterManifest|undefined>{const r=await this.sql.query<SqlRow>(`select payload from sync_master_manifests where manifest_id=$1`,[id]);return r.rows[0]?json<MasterManifest>(r.rows[0].payload):undefined;}
 async saveLocal(v:LocalManifest){await this.sql.query(`insert into sync_local_manifests(local_library_id,device_id,revision,payload) values($1,$2,$3,$4::jsonb) on conflict(local_library_id,device_id) do update set revision=excluded.revision,payload=excluded.payload,updated_at=now()`,[v.localLibraryId,v.deviceId,v.revision,JSON.stringify(v)]);}
}
export class PostgresSyncPlanRepository {
 constructor(private readonly sql:SqlExecutor){}
 async save(v:SyncPlan){await this.sql.query(`insert into sync_plans(plan_id,master_revision,local_revision,direction,payload) values($1,$2,$3,$4,$5::jsonb) on conflict(plan_id) do update set payload=excluded.payload,updated_at=now()`,[v.planId,v.masterRevision,v.localRevision,v.direction,JSON.stringify(v)]);}
 async get(id:string):Promise<SyncPlan|undefined>{const r=await this.sql.query<SqlRow>(`select payload from sync_plans where plan_id=$1`,[id]);return r.rows[0]?json<SyncPlan>(r.rows[0].payload):undefined;}
}
export class PostgresTransferCheckpointRepository implements TransferCheckpointRepository {
 constructor(private readonly sql:SqlExecutor){}
 async get(id:string):Promise<TransferCheckpoint|undefined>{const r=await this.sql.query<SqlRow>(`select payload from sync_transfer_checkpoints where transfer_id=$1`,[id]);return r.rows[0]?json<TransferCheckpoint>(r.rows[0].payload):undefined;}
 async save(v:TransferCheckpoint):Promise<void>{await this.sql.query(`insert into sync_transfer_checkpoints(transfer_id,publication_id,version_id,state,received_bytes,expected_byte_length,payload,updated_at) values($1,$2,$3,$4,$5,$6,$7::jsonb,$8) on conflict(transfer_id) do update set state=excluded.state,received_bytes=excluded.received_bytes,payload=excluded.payload,updated_at=excluded.updated_at`,[v.transferId,v.publicationId,v.versionId,v.state,v.receivedBytes,v.expectedByteLength,JSON.stringify(v),v.updatedAt]);}
 async listByPlan(planId:string):Promise<readonly TransferCheckpoint[]>{const r=await this.sql.query<SqlRow>(`select c.payload from sync_plan_transfers p join sync_transfer_checkpoints c on c.transfer_id=p.transfer_id where p.plan_id=$1 order by p.ordinal`,[planId]);return r.rows.map(x=>json<TransferCheckpoint>(x.payload));}
 async attach(planId:string,v:TransferCheckpoint,ordinal:number):Promise<void>{await this.save(v);await this.sql.query(`insert into sync_plan_transfers(plan_id,transfer_id,ordinal) values($1,$2,$3) on conflict(plan_id,transfer_id) do nothing`,[planId,v.transferId,ordinal]);}
}
export class PostgresSyncLeaseRepository {
 constructor(private readonly sql:SqlExecutor){}
 async tryAcquire(planId:string,ownerId:string,expiresAt:string):Promise<boolean>{const r=await this.sql.query(`insert into sync_plan_leases(plan_id,owner_id,expires_at) values($1,$2,$3) on conflict(plan_id) do update set owner_id=excluded.owner_id,expires_at=excluded.expires_at where sync_plan_leases.expires_at<now() returning plan_id`,[planId,ownerId,expiresAt]);return r.rowCount===1;}
 async release(planId:string,ownerId:string){await this.sql.query(`delete from sync_plan_leases where plan_id=$1 and owner_id=$2`,[planId,ownerId]);}
}
