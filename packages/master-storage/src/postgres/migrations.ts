import { createHash } from "node:crypto";
import type { SqlClient } from "./client.js";

export interface SqlMigration { readonly id: string; readonly up: string; readonly down: string; }
interface AppliedMigration { readonly id: string; readonly checksum: string; }
export function checksumMigration(migration: SqlMigration): string { return `sha256:${createHash("sha256").update(`${migration.id}\n${migration.up}\n${migration.down}`).digest("hex")}`; }

export class MigrationRunner {
  public constructor(private readonly client: SqlClient) {}
  public async apply(migrations: readonly SqlMigration[]): Promise<readonly string[]> {
    await this.client.query("SELECT pg_advisory_lock(760048611)");
    try {
      await this.client.query("CREATE TABLE IF NOT EXISTS schema_migrations (id text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())");
      const applied = await this.client.query<AppliedMigration>("SELECT id, checksum FROM schema_migrations ORDER BY id");
      const known = new Map(migrations.map((migration) => [migration.id, migration]));
      for (const recorded of applied.rows) {
        const migration = known.get(recorded.id);
        if (!migration) throw new Error(`unknown migration '${recorded.id}' is recorded`);
        if (recorded.checksum !== checksumMigration(migration)) throw new Error(`migration checksum mismatch for '${recorded.id}'`);
      }
      const completed = new Set(applied.rows.map((migration) => migration.id)); const executed: string[] = [];
      for (const migration of migrations) {
        if (completed.has(migration.id)) continue;
        await this.client.query("BEGIN");
        try { await this.client.query(migration.up); await this.client.query("INSERT INTO schema_migrations (id, checksum) VALUES ($1, $2)", [migration.id, checksumMigration(migration)]); await this.client.query("COMMIT"); executed.push(migration.id); }
        catch (error) { await this.client.query("ROLLBACK"); throw error; }
      }
      return executed;
    } finally { await this.client.query("SELECT pg_advisory_unlock(760048611)"); }
  }
  public async rollbackInitial(migration: SqlMigration): Promise<void> {
    await this.client.query("SELECT pg_advisory_lock(760048611)");
    try { await this.client.query("BEGIN"); try { await this.client.query(migration.down); await this.client.query("DELETE FROM schema_migrations WHERE id = $1", [migration.id]); await this.client.query("COMMIT"); } catch (error) { await this.client.query("ROLLBACK"); throw error; } }
    finally { await this.client.query("SELECT pg_advisory_unlock(760048611)"); }
  }
}

export const initialMasterLibraryMigration: SqlMigration = {
  id: "0001_master_library_authority",
  up: "CREATE TABLE master_publications (publication_id text NOT NULL, version_id text NOT NULL, source_item_id text NOT NULL, media_type text NOT NULL, byte_length bigint NOT NULL, content_fingerprint text NOT NULL, relative_path text NOT NULL, provenance jsonb NOT NULL DEFAULT '{}'::jsonb, PRIMARY KEY (publication_id, version_id)); CREATE TABLE master_operations (operation_id text PRIMARY KEY, publication_id text NOT NULL, version_id text NOT NULL, state text NOT NULL, content_fingerprint text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());",
  down: "DROP TABLE IF EXISTS master_operations; DROP TABLE IF EXISTS master_publications;",
};

export const durableProcessingMigration: SqlMigration = {
  id: "0002_master_library_processing",
  up: "CREATE TABLE master_processing_jobs (operation_id text PRIMARY KEY, correlation_id text NOT NULL, publication_id text NOT NULL, version_id text NOT NULL, state text NOT NULL CHECK (state IN ('queued', 'leased', 'completed')), checkpoint text NULL, lease_id text NULL UNIQUE, lease_owner text NULL, lease_expires_at timestamptz NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()); CREATE INDEX master_processing_jobs_claim_idx ON master_processing_jobs (state, lease_expires_at, created_at, operation_id);",
  down: "DROP TABLE IF EXISTS master_processing_jobs;",
};

/**
 * Public catalog fields are intentionally nullable for legacy descriptors.
 * A descriptor becomes browseable only after explicit metadata registration;
 * filesystem paths and source identifiers are never used as surrogate data.
 */
export const catalogMetadataMigration: SqlMigration = {
  id: "0003_master_library_catalog_metadata",
  up: "ALTER TABLE master_publications ADD COLUMN IF NOT EXISTS knowledge_object_id text NULL; ALTER TABLE master_publications ADD COLUMN IF NOT EXISTS title text NULL; ALTER TABLE master_publications ADD COLUMN IF NOT EXISTS authors jsonb NULL; CREATE INDEX IF NOT EXISTS master_publications_browse_idx ON master_publications (publication_id, version_id) WHERE knowledge_object_id IS NOT NULL AND title IS NOT NULL AND authors IS NOT NULL;",
  down: "DROP INDEX IF EXISTS master_publications_browse_idx; ALTER TABLE master_publications DROP COLUMN IF EXISTS authors; ALTER TABLE master_publications DROP COLUMN IF EXISTS title; ALTER TABLE master_publications DROP COLUMN IF EXISTS knowledge_object_id;",
};

/**
 * Operational receipt metadata only: this records an explicit client handoff,
 * never Local Library work or Personal Knowledge.
 */
export const acquisitionReceiptMigration: SqlMigration = {
  id: "0004_master_library_acquisition_receipts",
  up: "CREATE TABLE master_acquisition_receipts (subject text NOT NULL, idempotency_key text NOT NULL, request_fingerprint text NOT NULL, acquisition_id text NOT NULL UNIQUE, publication_id text NOT NULL, version_id text NOT NULL, target_local_library_id text NOT NULL, manifest jsonb NOT NULL, accepted_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (subject, idempotency_key));",
  down: "DROP TABLE IF EXISTS master_acquisition_receipts;",
};

/** Durable ingest evidence remains after retries, recovery, or route rollback. */
export const ingestJournalMigration: SqlMigration = {
  id: "0005_master_library_ingest_journal",
  up: "CREATE TABLE master_ingest_operations (operation_id text PRIMARY KEY, correlation_id text NOT NULL, idempotency_key text NOT NULL, publication_id text NOT NULL, version_id text NOT NULL, knowledge_object_id text NOT NULL, content_fingerprint text NOT NULL, state text NOT NULL CHECK (state IN ('staged', 'validated', 'promoted', 'registered', 'reconciliation-required', 'rejected')), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (content_fingerprint)); CREATE UNIQUE INDEX master_ingest_operations_idempotency_idx ON master_ingest_operations (idempotency_key);",
  down: "DROP TABLE IF EXISTS master_ingest_operations;",
};

/** Completes the PR1 journal with provenance and recovery data required for authoritative promotion. */
export const ingestPromotionMigration: SqlMigration = {
  id: "0006_master_library_ingest_promotion",
  up: "ALTER TABLE master_ingest_operations ADD COLUMN IF NOT EXISTS subject text NOT NULL DEFAULT ''; ALTER TABLE master_ingest_operations ADD COLUMN IF NOT EXISTS request_fingerprint text NOT NULL DEFAULT ''; ALTER TABLE master_ingest_operations ADD COLUMN IF NOT EXISTS source_item_id text NOT NULL DEFAULT ''; ALTER TABLE master_ingest_operations ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb; ALTER TABLE master_ingest_operations ADD COLUMN IF NOT EXISTS relative_path text NOT NULL DEFAULT ''; CREATE UNIQUE INDEX IF NOT EXISTS master_ingest_subject_idempotency_idx ON master_ingest_operations (subject, idempotency_key);",
  down: "DROP INDEX IF EXISTS master_ingest_subject_idempotency_idx; ALTER TABLE master_ingest_operations DROP COLUMN IF EXISTS relative_path; ALTER TABLE master_ingest_operations DROP COLUMN IF EXISTS metadata; ALTER TABLE master_ingest_operations DROP COLUMN IF EXISTS source_item_id; ALTER TABLE master_ingest_operations DROP COLUMN IF EXISTS request_fingerprint; ALTER TABLE master_ingest_operations DROP COLUMN IF EXISTS subject;",
};

/** Per-field evidence labels are additive, reversible, and never contain extracted document content. */
export const acceptedMetadataProvenanceMigration: SqlMigration = {
  id: "0007_master_library_accepted_metadata_provenance",
  up: "ALTER TABLE master_publications ADD COLUMN IF NOT EXISTS accepted_metadata_provenance jsonb NOT NULL DEFAULT '{}'::jsonb;",
  down: "ALTER TABLE master_publications DROP COLUMN IF EXISTS accepted_metadata_provenance;",
};
