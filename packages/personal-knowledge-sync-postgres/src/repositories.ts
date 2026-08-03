import type { SqlDatabase, SqlExecutor, SqlRow } from "@knowledgeos/infrastructure-postgres";
import type { PersonalKnowledgeReplicaRecord } from "@knowledgeos/personal-knowledge-sync";
import type { RegisteredPersonalKnowledgeDevice, PersonalKnowledgeSyncEvent } from "./model.js";

export class PostgresPersonalKnowledgeDeviceRepository {
  public constructor(private readonly sql: SqlExecutor) {}
  async register(device: RegisteredPersonalKnowledgeDevice): Promise<void> {
    await this.sql.query(`insert into pk_devices(device_id,owner_id,platform,application_version,capabilities,revoked,created_at,last_seen_at)
      values($1,$2,$3,$4,$5::jsonb,$6,$7,$8)
      on conflict(device_id) do update set platform=excluded.platform,application_version=excluded.application_version,
      capabilities=excluded.capabilities,last_seen_at=excluded.last_seen_at`,[
      device.deviceId,device.ownerId,device.platform,device.applicationVersion,JSON.stringify(device.capabilities),device.revoked,device.createdAt,device.lastSeenAt]);
  }
  async get(deviceId:string):Promise<RegisteredPersonalKnowledgeDevice|undefined>{
    const r=await this.sql.query<SqlRow>(`select * from pk_devices where device_id=$1`,[deviceId]); const x=r.rows[0];
    return x?{deviceId:String(x.device_id),ownerId:String(x.owner_id),platform:String(x.platform),applicationVersion:String(x.application_version),capabilities:x.capabilities as string[],revoked:Boolean(x.revoked),createdAt:String(x.created_at),lastSeenAt:String(x.last_seen_at)}:undefined;
  }
  async revoke(ownerId:string,deviceId:string):Promise<boolean>{
    const r=await this.sql.query(`update pk_devices set revoked=true where owner_id=$1 and device_id=$2`,[ownerId,deviceId]); return r.rowCount===1;
  }
}

export class PostgresPersonalKnowledgeEventStore {
  public constructor(private readonly database: SqlDatabase) {}
  async append(ownerId:string,deviceId:string,record:PersonalKnowledgeReplicaRecord,occurredAt:string):Promise<number>{
    const operation=record.item.deleted?"delete":"upsert";
    const r=await this.database.query<SqlRow>(`insert into pk_sync_events(owner_id,device_id,item_id,operation,record_json,occurred_at)
      values($1,$2,$3,$4,$5::jsonb,$6) returning cursor`,[ownerId,deviceId,record.item.itemId,operation,JSON.stringify(record),occurredAt]);
    return Number(r.rows[0]?.cursor);
  }
  async pull(ownerId:string,afterCursor:number,limit:number):Promise<readonly PersonalKnowledgeSyncEvent[]>{
    const r=await this.database.query<SqlRow>(`select * from pk_sync_events where owner_id=$1 and cursor>$2 order by cursor asc limit $3`,[ownerId,afterCursor,limit]);
    return r.rows.map(x=>({cursor:Number(x.cursor),ownerId:String(x.owner_id),deviceId:String(x.device_id),itemId:String(x.item_id),operation:x.operation as PersonalKnowledgeSyncEvent["operation"],record:x.record_json as PersonalKnowledgeReplicaRecord,occurredAt:String(x.occurred_at)}));
  }
  async saveCursor(ownerId:string,deviceId:string,cursor:number,updatedAt:string):Promise<void>{
    await this.database.query(`insert into pk_sync_cursors(owner_id,device_id,last_cursor,updated_at) values($1,$2,$3,$4)
      on conflict(owner_id,device_id) do update set last_cursor=greatest(pk_sync_cursors.last_cursor,excluded.last_cursor),updated_at=excluded.updated_at`,[ownerId,deviceId,cursor,updatedAt]);
  }
}

export const personalKnowledgeSyncPostgresMigrations=[{id:"0013_personal_knowledge_sync_production",checksum:"sha256:pk-sync-production-0013",sql:`
create table if not exists pk_devices(device_id text primary key,owner_id text not null,platform text not null,application_version text not null,capabilities jsonb not null default '[]'::jsonb,revoked boolean not null default false,created_at timestamptz not null,last_seen_at timestamptz not null);
create index if not exists idx_pk_devices_owner on pk_devices(owner_id,revoked);
create table if not exists pk_sync_events(cursor bigserial primary key,owner_id text not null,device_id text not null,item_id text not null,operation text not null,record_json jsonb not null,occurred_at timestamptz not null);
create index if not exists idx_pk_sync_events_owner_cursor on pk_sync_events(owner_id,cursor);
create table if not exists pk_sync_cursors(owner_id text not null,device_id text not null,last_cursor bigint not null default 0,updated_at timestamptz not null,primary key(owner_id,device_id));
create table if not exists pk_refresh_tokens(token_id text primary key,owner_id text not null,device_id text not null,token_hash text not null,expires_at timestamptz not null,revoked_at timestamptz);
create table if not exists pk_sync_audit(audit_id bigserial primary key,owner_id text not null,device_id text not null,action text not null,result text not null,details jsonb not null default '{}'::jsonb,occurred_at timestamptz not null);
`} ] as const;
