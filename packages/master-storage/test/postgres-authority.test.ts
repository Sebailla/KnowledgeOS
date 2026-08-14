import assert from "node:assert/strict";
import test from "node:test";

import {
  checksumMigration,
  reconcileOperation,
  AuthorityReconciler,
  type JournalOperation,
  MigrationRunner,
  catalogMetadataMigration,
  acquisitionReceiptMigration,
  PostgresAcquisitionReceiptRepository,
  ingestJournalMigration,
  PostgresIngestJournal,
  type SqlClient,
} from "../src/index.js";

test("catalog metadata migration keeps legacy descriptors non-browseable until registered", () => {
  assert.equal(catalogMetadataMigration.up.includes("title text NULL"), true);
  assert.equal(catalogMetadataMigration.up.includes("knowledge_object_id text NULL"), true);
  assert.equal(catalogMetadataMigration.up.includes("authors jsonb NULL"), true);
});

class FakeSqlClient implements SqlClient {
  public readonly statements: string[] = [];
  public applied = new Map<string, string>();
  public readonly acquisitionReceipts = new Map<string, Record<string, unknown>>();
  public readonly ingestOperations = new Map<string, Record<string, unknown>>();

  public async query<T extends object = Record<string, unknown>>(
    text: string,
    values: readonly unknown[] = [],
  ): Promise<{ readonly rows: readonly T[] }> {
    this.statements.push(text);

    if (text.includes("SELECT id, checksum FROM schema_migrations")) {
      return { rows: [...this.applied].map(([id, checksum]) => ({ id, checksum } as unknown as T)) };
    }

    if (text.includes("INSERT INTO schema_migrations")) {
      this.applied.set(String(values[0]), String(values[1]));
    }

    if (text.includes("INSERT INTO master_acquisition_receipts")) {
      const key = `${values[0]}\u0000${values[1]}`;
      const existing = this.acquisitionReceipts.get(key);
      if (existing) return { rows: [] };
      const row = {
        request_fingerprint: String(values[2]),
        acquisition_id: String(values[3]),
        idempotency_key: String(values[1]),
        manifest: JSON.parse(String(values[7])),
      };
      this.acquisitionReceipts.set(key, row);
      return { rows: [row as unknown as T] };
    }

    if (text.includes("FROM master_acquisition_receipts")) {
      const row = this.acquisitionReceipts.get(`${values[0]}\u0000${values[1]}`);
      return { rows: row ? [row as unknown as T] : [] };
    }

    if (text.includes("INSERT INTO master_ingest_operations")) {
      const existing = [...this.ingestOperations.values()].find((row) => row.content_fingerprint === values[6]);
      if (existing) return { rows: [] };
      const row = { operation_id: String(values[0]), correlation_id: String(values[1]), idempotency_key: String(values[2]), publication_id: String(values[3]), version_id: String(values[4]), knowledge_object_id: String(values[5]), content_fingerprint: String(values[6]), state: "staged" };
      this.ingestOperations.set(row.operation_id, row);
      return { rows: [row as unknown as T] };
    }

    if (text.includes("UPDATE master_ingest_operations")) {
      const row = this.ingestOperations.get(String(values[0]));
      if (row) row.state = String(values[1]);
      return { rows: [] };
    }

    if (text.includes("FROM master_ingest_operations WHERE content_fingerprint")) {
      const row = [...this.ingestOperations.values()].find((candidate) => candidate.content_fingerprint === values[0]);
      return { rows: row ? [row as unknown as T] : [] };
    }

    if (text.includes("FROM master_ingest_operations WHERE operation_id")) {
      const row = this.ingestOperations.get(String(values[0]));
      return { rows: row ? [row as unknown as T] : [] };
    }

    return { rows: [] };
  }
}

test("migration runner records an applied migration with its checksum", async () => {
  const client = new FakeSqlClient();
  const migration = { id: "0001_initial", up: "CREATE TABLE publications (id text);", down: "DROP TABLE publications;" };

  await new MigrationRunner(client).apply([migration]);

  assert.equal(client.applied.get(migration.id), checksumMigration(migration));
  assert.equal(client.statements.includes("BEGIN"), true);
  assert.equal(client.statements.includes("COMMIT"), true);
});

test("migration runner rejects a checksum mismatch instead of reapplying", async () => {
  const client = new FakeSqlClient();
  const migration = { id: "0001_initial", up: "CREATE TABLE publications (id text);", down: "DROP TABLE publications;" };
  client.applied.set(migration.id, "sha256:wrong");

  await assert.rejects(() => new MigrationRunner(client).apply([migration]), /checksum mismatch/);
});

test("migration runner rejects an unknown applied migration outcome", async () => {
  const client = new FakeSqlClient();
  client.applied.set("unknown", "sha256:anything");

  await assert.rejects(() => new MigrationRunner(client).apply([]), /unknown migration/);
});

test("reconciliation promotes catalog state after an interrupted file promotion", () => {
  const operation: JournalOperation = {
    operationId: "operation:1",
    publicationId: "publication:1",
    versionId: "version:1",
    state: "staged",
    fingerprint: "sha256:one",
  };

  assert.equal(reconcileOperation(operation, { staged: false, published: true, catalog: false }), "promote-catalog");
});

test("reconciliation preserves orphan and mismatch evidence without deletion", () => {
  const operation: JournalOperation = {
    operationId: "operation:1",
    publicationId: "publication:1",
    versionId: "version:1",
    state: "cataloged",
    fingerprint: "sha256:one",
  };

  assert.equal(reconcileOperation(operation, { staged: false, published: false, catalog: true }), "report-orphan");
  assert.equal(reconcileOperation(operation, { staged: false, published: true, catalog: true, fingerprint: "sha256:other" }), "report-mismatch");
});

test("recovery retains an interrupted operation as evidence instead of deleting it", async () => {
  const operation: JournalOperation = {
    operationId: "operation:interrupted",
    publicationId: "publication:1",
    versionId: "version:1",
    state: "promoted",
    fingerprint: "sha256:one",
  };
  const recorded: JournalOperation[] = [];
  const reconciler = new AuthorityReconciler(
    { inspect: async () => ({ staged: false, published: false, catalog: true }) },
    { record: async (value) => { recorded.push(value); } },
  );

  const result = await reconciler.recover(operation);

  assert.equal(result, "report-orphan");
  assert.equal(recorded[0]?.state, "reconciliation-required");
});

test("acquisition receipt migration is checksum-protected and records its unique subject key", async () => {
  const client = new FakeSqlClient();
  await new MigrationRunner(client).apply([acquisitionReceiptMigration]);

  assert.equal(client.applied.get(acquisitionReceiptMigration.id), checksumMigration(acquisitionReceiptMigration));
  assert.equal(acquisitionReceiptMigration.up.includes("master_acquisition_receipts"), true);
  assert.equal(acquisitionReceiptMigration.up.includes("PRIMARY KEY (subject, idempotency_key)"), true);
});

test("acquisition receipts replay matching requests and reject changed semantics", async () => {
  const repository = new PostgresAcquisitionReceiptRepository(new FakeSqlClient());
  const request = {
    subject: "operator:one",
    idempotencyKey: "request:one",
    publicationId: "publication:one",
    versionId: "version:one",
    targetLocalLibraryId: "local-library:one",
  };
  const manifest = {
    protocolVersion: "v1" as const,
    publicationId: request.publicationId as never,
    knowledgeObjectId: "knowledge-object:one" as never,
    versionId: request.versionId as never,
    contentFingerprint: "sha256:one",
    byteLength: 1,
    mediaType: "application/pdf",
  };

  const first = await repository.accept(request, manifest);
  const replay = await repository.accept(request, manifest);
  assert.equal(JSON.stringify(replay), JSON.stringify(first));
  await assert.rejects(
    () => repository.accept({ ...request, targetLocalLibraryId: "local-library:two" }, manifest),
    /conflict/,
  );
});


test("ingest journal migration records durable states and protects a unique fingerprint claim", async () => {
  const client = new FakeSqlClient();
  await new MigrationRunner(client).apply([ingestJournalMigration]);
  assert.equal(ingestJournalMigration.up.includes("master_ingest_operations"), true);
  assert.equal(ingestJournalMigration.up.includes("UNIQUE (content_fingerprint)"), true);

  const journal = new PostgresIngestJournal(client);
  const [first, concurrent] = await Promise.all([
    journal.begin({ operationId: "ingest-operation:one", correlationId: "correlation:one", idempotencyKey: "ingest-key:one", publicationId: "publication:one", versionId: "version:one", knowledgeObjectId: "knowledge-object:one", contentFingerprint: "sha256:one" }),
    journal.begin({ operationId: "ingest-operation:two", correlationId: "correlation:two", idempotencyKey: "ingest-key:two", publicationId: "publication:two", versionId: "version:two", knowledgeObjectId: "knowledge-object:two", contentFingerprint: "sha256:one" }),
  ]);
  await journal.transition(first.operationId, "validated");

  assert.equal(first.operationId, "ingest-operation:one");
  assert.equal(concurrent.operationId, first.operationId);
  assert.equal((await journal.find(first.operationId))?.state, "validated");
});
