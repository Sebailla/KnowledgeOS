import type { SqlClient } from "./client.js";
import { createHash, randomUUID } from "node:crypto";
import type {
  AcquisitionHandoffAcceptedV1,
  AcquisitionManifest,
} from "@knowledgeos/contracts";
export type JournalOperationState = "staged" | "promoted" | "cataloged" | "reconciliation-required";
export interface JournalOperation { readonly operationId: string; readonly publicationId: string; readonly versionId: string; readonly state: JournalOperationState; readonly fingerprint: string; }
export class PostgresOperationJournal { public constructor(private readonly client: SqlClient) {} public async record(operation: JournalOperation): Promise<void> { await this.client.query("INSERT INTO master_operations (operation_id, publication_id, version_id, state, content_fingerprint) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (operation_id) DO UPDATE SET state = EXCLUDED.state, content_fingerprint = EXCLUDED.content_fingerprint, updated_at = now()", [operation.operationId, operation.publicationId, operation.versionId, operation.state, operation.fingerprint]); } }

export interface AcquisitionReceiptRequest {
  readonly subject: string;
  readonly idempotencyKey: string;
  readonly publicationId: string;
  readonly versionId: string;
  readonly targetLocalLibraryId: string;
}

interface AcquisitionReceiptRow {
  readonly request_fingerprint: string;
  readonly acquisition_id: string;
  readonly idempotency_key: string;
  readonly manifest: AcquisitionManifest;
}

export class AcquisitionReceiptConflictError extends Error {
  public constructor() {
    super("Acquisition idempotency key conflicts with a different handoff.");
    this.name = "AcquisitionReceiptConflictError";
  }
}

/** PostgreSQL operational repository for idempotent acquisition handoffs. */
export class PostgresAcquisitionReceiptRepository {
  public constructor(private readonly client: SqlClient) {}

  public async accept(
    request: AcquisitionReceiptRequest,
    manifest: AcquisitionManifest,
  ): Promise<AcquisitionHandoffAcceptedV1> {
    const fingerprint = requestFingerprint(request);
    const inserted = await this.client.query<AcquisitionReceiptRow>(
      "INSERT INTO master_acquisition_receipts (subject, idempotency_key, request_fingerprint, acquisition_id, publication_id, version_id, target_local_library_id, manifest) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb) ON CONFLICT (subject, idempotency_key) DO NOTHING RETURNING request_fingerprint, acquisition_id, idempotency_key, manifest",
      [request.subject, request.idempotencyKey, fingerprint, `acquisition:${randomUUID()}`, request.publicationId, request.versionId, request.targetLocalLibraryId, JSON.stringify(manifest)],
    );
    const row = inserted.rows[0] ?? await this.find(request.subject, request.idempotencyKey);
    if (!row) throw new Error("Acquisition receipt was not persisted.");
    if (row.request_fingerprint !== fingerprint) throw new AcquisitionReceiptConflictError();
    return receiptFromRow(row);
  }

  private async find(subject: string, idempotencyKey: string): Promise<AcquisitionReceiptRow | undefined> {
    const found = await this.client.query<AcquisitionReceiptRow>(
      "SELECT request_fingerprint, acquisition_id, idempotency_key, manifest FROM master_acquisition_receipts WHERE subject = $1 AND idempotency_key = $2",
      [subject, idempotencyKey],
    );
    return found.rows[0];
  }
}

export class InMemoryAcquisitionReceiptRepository {
  private readonly receipts = new Map<string, AcquisitionReceiptRow>();

  public async accept(request: AcquisitionReceiptRequest, manifest: AcquisitionManifest): Promise<AcquisitionHandoffAcceptedV1> {
    const key = `${request.subject}\u0000${request.idempotencyKey}`;
    const fingerprint = requestFingerprint(request);
    const existing = this.receipts.get(key);
    if (existing) {
      if (existing.request_fingerprint !== fingerprint) throw new AcquisitionReceiptConflictError();
      return receiptFromRow(existing);
    }
    const row: AcquisitionReceiptRow = {
      request_fingerprint: fingerprint,
      acquisition_id: `acquisition:${randomUUID()}`,
      idempotency_key: request.idempotencyKey,
      manifest,
    };
    this.receipts.set(key, row);
    return receiptFromRow(row);
  }
}

function requestFingerprint(request: AcquisitionReceiptRequest): string {
  return `sha256:${createHash("sha256").update(JSON.stringify({ publicationId: request.publicationId, versionId: request.versionId, targetLocalLibraryId: request.targetLocalLibraryId })).digest("hex")}`;
}

function receiptFromRow(row: AcquisitionReceiptRow): AcquisitionHandoffAcceptedV1 {
  return {
    receipt: { acquisitionId: row.acquisition_id as never, idempotencyKey: row.idempotency_key, accepted: true },
    manifest: typeof row.manifest === "string" ? JSON.parse(row.manifest) : row.manifest,
  };
}

export type IngestJournalState = "staged" | "validated" | "promoted" | "registered" | "reconciliation-required" | "rejected";

export interface IngestJournalEntry {
  readonly operationId: string;
  readonly correlationId: string;
  readonly idempotencyKey: string;
  readonly publicationId: string;
  readonly versionId: string;
  readonly knowledgeObjectId: string;
  readonly contentFingerprint: string;
  readonly state: IngestJournalState;
}

interface IngestJournalRow {
  readonly operation_id: string;
  readonly correlation_id: string;
  readonly idempotency_key: string;
  readonly publication_id: string;
  readonly version_id: string;
  readonly knowledge_object_id: string;
  readonly content_fingerprint: string;
  readonly state: IngestJournalState;
}

/**
 * PostgreSQL operation journal. The unique fingerprint claim prevents concurrent
 * duplicate source registration before any filesystem promotion begins.
 */
export class PostgresIngestJournal {
  public constructor(private readonly client: SqlClient) {}

  public async begin(entry: Omit<IngestJournalEntry, "state">): Promise<IngestJournalEntry> {
    const inserted = await this.client.query<IngestJournalRow>(
      "INSERT INTO master_ingest_operations (operation_id, correlation_id, idempotency_key, publication_id, version_id, knowledge_object_id, content_fingerprint, state) VALUES ($1, $2, $3, $4, $5, $6, $7, 'staged') ON CONFLICT (content_fingerprint) DO NOTHING RETURNING operation_id, correlation_id, idempotency_key, publication_id, version_id, knowledge_object_id, content_fingerprint, state",
      [entry.operationId, entry.correlationId, entry.idempotencyKey, entry.publicationId, entry.versionId, entry.knowledgeObjectId, entry.contentFingerprint],
    );
    const row = inserted.rows[0] ?? await this.findByFingerprint(entry.contentFingerprint);
    if (!row) throw new Error("Ingest fingerprint claim was not persisted.");
    return ingestEntryFromRow(row);
  }

  public async transition(operationId: string, state: IngestJournalState): Promise<void> {
    await this.client.query(
      "UPDATE master_ingest_operations SET state = $2, updated_at = now() WHERE operation_id = $1",
      [operationId, state],
    );
  }

  public async find(operationId: string): Promise<IngestJournalEntry | undefined> {
    const result = await this.client.query<IngestJournalRow>(
      "SELECT operation_id, correlation_id, idempotency_key, publication_id, version_id, knowledge_object_id, content_fingerprint, state FROM master_ingest_operations WHERE operation_id = $1",
      [operationId],
    );
    return result.rows[0] ? ingestEntryFromRow(result.rows[0]) : undefined;
  }

  private async findByFingerprint(contentFingerprint: string): Promise<IngestJournalRow | undefined> {
    const result = await this.client.query<IngestJournalRow>(
      "SELECT operation_id, correlation_id, idempotency_key, publication_id, version_id, knowledge_object_id, content_fingerprint, state FROM master_ingest_operations WHERE content_fingerprint = $1",
      [contentFingerprint],
    );
    return result.rows[0];
  }
}

function ingestEntryFromRow(row: IngestJournalRow): IngestJournalEntry {
  return {
    operationId: row.operation_id,
    correlationId: row.correlation_id,
    idempotencyKey: row.idempotency_key,
    publicationId: row.publication_id,
    versionId: row.version_id,
    knowledgeObjectId: row.knowledge_object_id,
    contentFingerprint: row.content_fingerprint,
    state: row.state,
  };
}
