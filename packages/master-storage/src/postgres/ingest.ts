import type { IngestOperationStatusV1 } from "@knowledgeos/contracts";
import type { AuthoritativeIngestRecord, AuthoritativeIngestRepository, AuthoritativeIngestState } from "../ingest.js";
import type { SqlClient } from "./client.js";

interface Row {
  readonly operation_id: string; readonly subject: string; readonly correlation_id: string; readonly idempotency_key: string; readonly request_fingerprint: string;
  readonly publication_id: string; readonly version_id: string; readonly knowledge_object_id: string; readonly source_item_id: string; readonly metadata: AuthoritativeIngestRecord["metadata"] | string;
  readonly content_fingerprint: string; readonly relative_path: string; readonly state: AuthoritativeIngestState;
}

/** PostgreSQL implementation: only `registered` operations receive public metadata. */
export class PostgresAuthoritativeIngestRepository implements AuthoritativeIngestRepository {
  public constructor(private readonly client: SqlClient) {}

  public async claim(record: AuthoritativeIngestRecord): Promise<AuthoritativeIngestRecord> {
    const inserted = await this.client.query<Row>(
      "INSERT INTO master_ingest_operations (operation_id, subject, correlation_id, idempotency_key, request_fingerprint, publication_id, version_id, knowledge_object_id, source_item_id, metadata, content_fingerprint, relative_path, state) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12,'staged') ON CONFLICT DO NOTHING RETURNING operation_id, subject, correlation_id, idempotency_key, request_fingerprint, publication_id, version_id, knowledge_object_id, source_item_id, metadata, content_fingerprint, relative_path, state",
      [record.operationId, record.subject, record.correlationId, record.idempotencyKey, record.requestFingerprint, record.publicationId, record.versionId, record.knowledgeObjectId, record.sourceItemId, JSON.stringify(record.metadata), record.contentFingerprint, record.relativePath],
    );
    const row = inserted.rows[0] ?? (await this.client.query<Row>(
      "SELECT operation_id, subject, correlation_id, idempotency_key, request_fingerprint, publication_id, version_id, knowledge_object_id, source_item_id, metadata, content_fingerprint, relative_path, state FROM master_ingest_operations WHERE subject = $1 AND idempotency_key = $2 OR content_fingerprint = $3 ORDER BY created_at LIMIT 1",
      [record.subject, record.idempotencyKey, record.contentFingerprint],
    )).rows[0];
    if (!row) throw new Error("Ingest claim was not persisted.");
    return recordFrom(row);
  }

  public async transition(operationId: string, state: AuthoritativeIngestState): Promise<void> {
    await this.client.query("UPDATE master_ingest_operations SET state = $2, updated_at = now() WHERE operation_id = $1", [operationId, state]);
  }

  public async register(record: AuthoritativeIngestRecord): Promise<void> {
    await this.client.query("BEGIN");
    try {
      await this.client.query("INSERT INTO master_publications (publication_id, version_id, source_item_id, media_type, byte_length, content_fingerprint, relative_path, knowledge_object_id, title, authors, provenance, accepted_metadata_provenance) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12::jsonb) ON CONFLICT (publication_id, version_id) DO UPDATE SET source_item_id=EXCLUDED.source_item_id, media_type=EXCLUDED.media_type, byte_length=EXCLUDED.byte_length, content_fingerprint=EXCLUDED.content_fingerprint, relative_path=EXCLUDED.relative_path, knowledge_object_id=EXCLUDED.knowledge_object_id, title=EXCLUDED.title, authors=EXCLUDED.authors, provenance=EXCLUDED.provenance, accepted_metadata_provenance=EXCLUDED.accepted_metadata_provenance", [record.publicationId, record.versionId, record.sourceItemId, record.metadata.declaredMediaType, record.metadata.byteLength, record.contentFingerprint, record.relativePath, record.knowledgeObjectId, record.metadata.title, JSON.stringify(record.metadata.authors), JSON.stringify({ originalFilename: record.metadata.originalFilename, correlationId: record.correlationId }), JSON.stringify(record.metadata.acceptedProvenance ?? {})]);
      await this.client.query("UPDATE master_ingest_operations SET state = 'registered', updated_at = now() WHERE operation_id = $1", [record.operationId]);
      await this.client.query("COMMIT");
    } catch (error) { await this.client.query("ROLLBACK"); throw error; }
  }

  public async hide(operationId: string): Promise<void> {
    await this.client.query("UPDATE master_publications SET knowledge_object_id = NULL, title = NULL, authors = NULL WHERE (publication_id, version_id) = (SELECT publication_id, version_id FROM master_ingest_operations WHERE operation_id = $1)", [operationId]);
  }

  public async status(operationId: string): Promise<IngestOperationStatusV1 | undefined> {
    const row = (await this.client.query<Row>("SELECT operation_id, subject, correlation_id, idempotency_key, request_fingerprint, publication_id, version_id, knowledge_object_id, source_item_id, metadata, content_fingerprint, relative_path, state FROM master_ingest_operations WHERE operation_id = $1", [operationId])).rows[0];
    return row ? { operationId: row.operation_id, state: row.state, ...(row.state === "registered" ? { outcome: "registered" as const } : {}) } : undefined;
  }

  public async incomplete(): Promise<readonly AuthoritativeIngestRecord[]> {
    const result = await this.client.query<Row>("SELECT operation_id, subject, correlation_id, idempotency_key, request_fingerprint, publication_id, version_id, knowledge_object_id, source_item_id, metadata, content_fingerprint, relative_path, state FROM master_ingest_operations WHERE state <> 'rejected'");
    return result.rows.map(recordFrom);
  }
}

function recordFrom(row: Row): AuthoritativeIngestRecord { return { operationId: row.operation_id, subject: row.subject, correlationId: row.correlation_id, idempotencyKey: row.idempotency_key, requestFingerprint: row.request_fingerprint, publicationId: row.publication_id, versionId: row.version_id, knowledgeObjectId: row.knowledge_object_id, sourceItemId: row.source_item_id, metadata: typeof row.metadata === "string" ? JSON.parse(row.metadata) : row.metadata, contentFingerprint: row.content_fingerprint, relativePath: row.relative_path, state: row.state }; }
