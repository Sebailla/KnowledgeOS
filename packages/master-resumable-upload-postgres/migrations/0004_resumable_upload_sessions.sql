begin;

create table if not exists master_upload_sessions (
  session_id text primary key,
  status text not null,
  metadata jsonb not null,
  chunks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  completed_publication_id text,
  completed_version_id text
);

create index if not exists idx_master_upload_sessions_status_updated
  on master_upload_sessions(status, updated_at);

create table if not exists master_upload_chunks (
  session_id text not null
    references master_upload_sessions(session_id)
    on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  byte_length bigint not null check (byte_length >= 0),
  checksum text not null,
  storage_path text not null,
  created_at timestamptz not null default now(),
  primary key (session_id, chunk_index)
);

create table if not exists master_upload_completion_leases (
  session_id text primary key
    references master_upload_sessions(session_id)
    on delete cascade,
  owner_id text not null,
  expires_at timestamptz not null
);

create index if not exists idx_master_upload_completion_leases_expiry
  on master_upload_completion_leases(expires_at);

create table if not exists master_upload_completions (
  session_id text primary key
    references master_upload_sessions(session_id)
    on delete cascade,
  publication_id text not null,
  version_id text not null,
  completed_at timestamptz not null
);

commit;
