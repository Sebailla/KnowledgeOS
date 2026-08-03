import type { Migration } from "@knowledgeos/infrastructure-postgres-node";

export const libraryMigrations: readonly Migration[] = [
  {
    id: "0001_initial_library",
    checksum:
      "sha256:knowledgeos-v5-initial-library-schema-0001",
    sql: `
      create table if not exists knowledge_objects (
        id text primary key,
        state jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists source_items (
        id text primary key,
        state jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists publication_versions (
        id text primary key,
        state jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists local_libraries (
        id text primary key,
        state jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists acquisitions (
        id text primary key,
        state jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists annotations (
        id text primary key,
        state jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists knowledgeos_outbox (
        event_id text primary key,
        event_type text not null,
        payload jsonb not null,
        occurred_at timestamptz not null,
        published_at timestamptz
      );

      create index if not exists idx_outbox_unpublished
        on knowledgeos_outbox (occurred_at)
        where published_at is null;
    `,
  },
];
