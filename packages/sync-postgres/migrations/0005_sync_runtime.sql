begin;
create table if not exists sync_master_manifests(manifest_id text primary key,revision bigint not null,fingerprint text not null,payload jsonb not null,generated_at timestamptz not null);
create table if not exists sync_local_manifests(local_library_id text not null,device_id text not null,revision bigint not null,payload jsonb not null,updated_at timestamptz not null default now(),primary key(local_library_id,device_id));
create table if not exists sync_plans(plan_id text primary key,master_revision bigint not null,local_revision bigint not null,direction text not null,payload jsonb not null,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists sync_transfer_checkpoints(transfer_id text primary key,publication_id text not null,version_id text not null,state text not null,received_bytes bigint not null,expected_byte_length bigint not null,payload jsonb not null,updated_at timestamptz not null);
create table if not exists sync_plan_transfers(plan_id text not null references sync_plans(plan_id) on delete cascade,transfer_id text not null references sync_transfer_checkpoints(transfer_id) on delete cascade,ordinal integer not null,primary key(plan_id,transfer_id));
create table if not exists sync_plan_leases(plan_id text primary key references sync_plans(plan_id) on delete cascade,owner_id text not null,expires_at timestamptz not null);
create index if not exists idx_sync_checkpoint_state on sync_transfer_checkpoints(state,updated_at);
commit;
