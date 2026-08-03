export const localLibraryMigrations = [
  {
    id: "0001_local_library",
    sql: `
      create table if not exists local_publications (
        local_library_id text not null,
        publication_id text not null,
        knowledge_object_id text not null,
        version_id text not null,
        source_item_id text not null,
        title text not null,
        media_type text not null,
        byte_length integer not null check (byte_length >= 0),
        content_fingerprint text not null,
        relative_path text not null,
        acquisition_status text not null,
        readable_offline integer not null,
        pinned integer not null,
        last_accessed_at text,
        acquired_at text,
        primary key(local_library_id, publication_id)
      );

      create index if not exists idx_local_publications_version
        on local_publications(local_library_id, version_id);

      create index if not exists idx_local_publications_offline
        on local_publications(local_library_id, readable_offline);

      create table if not exists local_manifests (
        local_library_id text primary key,
        generated_at text not null,
        payload text not null
      );

      create table if not exists local_settings (
        key text primary key,
        value text not null
      );
    `,
  },
] as const;
