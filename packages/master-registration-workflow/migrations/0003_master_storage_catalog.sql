begin;

create table if not exists master_storage_objects (
  publication_id text not null,
  version_id text not null,
  source_item_id text not null unique,
  content_fingerprint text not null,
  byte_length bigint not null check (byte_length >= 0),
  relative_path text not null,
  media_type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (publication_id, version_id),
  unique (content_fingerprint, relative_path),
  foreign key (publication_id)
    references master_publications(publication_id),
  foreign key (version_id)
    references master_publication_versions(version_id)
);

create index if not exists idx_master_storage_fingerprint
  on master_storage_objects(content_fingerprint);

commit;
