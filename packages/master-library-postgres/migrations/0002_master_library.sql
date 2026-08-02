begin;

create table if not exists master_publications (
  publication_id text primary key,
  knowledge_object_id text not null unique,
  title text not null,
  authors jsonb not null default '[]'::jsonb,
  status text not null,
  current_version_id text,
  source_item_ids jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists master_publication_versions (
  version_id text primary key,
  publication_id text not null
    references master_publications(publication_id),
  sequence integer not null,
  source_item_id text not null,
  content_fingerprint text not null unique,
  parent_version_ids jsonb not null default '[]'::jsonb,
  label text,
  created_at timestamptz not null default now(),
  unique(publication_id, sequence)
);

create table if not exists master_assets (
  asset_id text primary key,
  publication_id text not null
    references master_publications(publication_id),
  media_type text not null,
  byte_length bigint not null check (byte_length >= 0),
  content_fingerprint text not null,
  role text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_master_assets_publication
  on master_assets(publication_id);

create table if not exists master_snapshots (
  snapshot_id text primary key,
  publication_id text not null
    references master_publications(publication_id),
  publication_version_id text not null
    references master_publication_versions(version_id),
  metadata_fingerprint text not null,
  asset_fingerprints jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

commit;
