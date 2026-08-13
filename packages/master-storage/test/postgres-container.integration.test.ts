import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  initialMasterLibraryMigration,
  durableProcessingMigration,
  catalogMetadataMigration,
  acquisitionReceiptMigration,
  ingestJournalMigration,
  ingestPromotionMigration,
  MigrationRunner,
  PgSqlClient,
  PostgresAcquisitionReceiptRepository,
  PostgresLeasedJobRepository,
  PostgresIngestJournal,
  PostgresAuthoritativeIngestRepository,
  AuthoritativeIngestService,
  PostgresMasterStorageCatalog,
} from "../src/index.js";

const databaseUrl = process.env.MASTER_STORAGE_TEST_DATABASE_URL;

if (databaseUrl) {
  test("containerized PostgreSQL retains migration state across reconnect and rolls back the initial schema", async () => {
    const firstClient = new PgSqlClient({ connectionString: databaseUrl });
    const firstRunner = new MigrationRunner(firstClient);

    await firstRunner.apply([initialMasterLibraryMigration]);
    const catalog = new PostgresMasterStorageCatalog(firstClient);
    const descriptor = {
      publicationId: "publication:container-1",
      versionId: "version:container-1",
      sourceItemId: "knowledge-object:container-1",
      mediaType: "application/pdf",
      byteLength: 42,
      contentFingerprint: "sha256:container-1",
      relativePath: "publications/container-1/content",
    };
    await catalog.save(descriptor);
    await catalog.save(descriptor);
    assert.deepEqual(await catalog.get(descriptor.publicationId, descriptor.versionId), descriptor);
    await firstClient.close();

    const restartedClient = new PgSqlClient({ connectionString: databaseUrl });
    const restartedRunner = new MigrationRunner(restartedClient);
    const repeated = await restartedRunner.apply([initialMasterLibraryMigration]);
    const applied = await restartedClient.query<{ readonly id: string }>(
      "SELECT id FROM schema_migrations WHERE id = $1",
      [initialMasterLibraryMigration.id],
    );

    assert.deepEqual(repeated, []);
    assert.equal(applied.rows[0]?.id, initialMasterLibraryMigration.id);

    await restartedRunner.rollbackInitial(initialMasterLibraryMigration);
    const removed = await restartedClient.query<{ readonly table_name: string }>(
      "SELECT table_name FROM information_schema.tables WHERE table_name = 'master_publications'",
    );
    assert.equal(removed.rows.length, 0);
    await restartedClient.close();
});

if (databaseUrl) {
  test("containerized PostgreSQL resumes an expired processing lease exactly once", async () => {
    const client = new PgSqlClient({ connectionString: databaseUrl });
    await new MigrationRunner(client).apply([
      initialMasterLibraryMigration,
      durableProcessingMigration,
    ]);
    const jobs = new PostgresLeasedJobRepository(client);
    const request = {
      operationId: "operation:container-processing-1",
      correlationId: "correlation:container-processing-1",
      publicationId: "publication:container-processing-1",
      versionId: "version:container-processing-1",
    };
    await jobs.enqueue(request);
    await jobs.enqueue({ ...request, correlationId: "correlation:duplicate" });
    const first = await jobs.claim("worker:one", new Date("2026-08-10T00:00:00.000Z"), 1_000);
    await jobs.checkpoint(first!.leaseId!, "validated", new Date("2026-08-10T00:00:00.100Z"));

    const resumed = await jobs.claim("worker:two", new Date("2026-08-10T00:00:01.000Z"), 1_000);
    assert.equal(resumed?.checkpoint, "validated");
    assert.equal(resumed?.correlationId, request.correlationId);
    await jobs.complete(resumed!.leaseId!, new Date("2026-08-10T00:00:01.100Z"));
    assert.equal(await jobs.claim("worker:three", new Date("2026-08-10T00:00:02.000Z"), 1_000), undefined);
    await assert.rejects(
      () => jobs.complete(first!.leaseId!, new Date("2026-08-10T00:00:02.000Z")),
      /not active/,
    );
    await client.close();
  });
}

if (databaseUrl) {
  test("containerized PostgreSQL reconciles promoted ingest and hides catalog evidence whose bytes disappear", async () => {
    const root = await mkdtemp(join(tmpdir(), "knowledgeos-postgres-ingest-"));
    const client = new PgSqlClient({ connectionString: databaseUrl });
    try {
      await new MigrationRunner(client).apply([initialMasterLibraryMigration, durableProcessingMigration, catalogMetadataMigration, acquisitionReceiptMigration, ingestJournalMigration, ingestPromotionMigration]);
      const service = new AuthoritativeIngestService(new PostgresAuthoritativeIngestRepository(client), root, { maxBytes: 1024 });
      const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]);
      const accepted = await service.accept({ subject: "operator:postgres-recovery", correlationId: "correlation:postgres-recovery", idempotencyKey: `ingest:postgres-recovery:${Date.now()}`, bytes, metadata: { title: "Postgres Recovery", authors: ["Ada"], originalFilename: "postgres.pdf", declaredMediaType: "application/pdf", byteLength: bytes.byteLength }, interruptAfter: "promoted" });
      await service.reconcile();
      assert.equal((await service.status(accepted.operationId))?.state, "registered");
      await rm(join(root, "publications", accepted.publicationId), { recursive: true, force: true });
      await service.reconcile();
      assert.equal((await service.status(accepted.operationId))?.state, "reconciliation-required");
      const visible = await client.query<{ readonly count: string }>("SELECT count(*)::text AS count FROM master_publications WHERE publication_id = $1 AND knowledge_object_id IS NOT NULL", [accepted.publicationId]);
      assert.equal(visible.rows[0]?.count, "0");
    } finally {
      await client.close();
      await rm(root, { recursive: true, force: true });
    }
  });
}

if (databaseUrl) {
  test("containerized PostgreSQL persists a stable acquisition receipt and rejects changed handoff semantics", async () => {
    const client = new PgSqlClient({ connectionString: databaseUrl });
    await new MigrationRunner(client).apply([
      initialMasterLibraryMigration,
      durableProcessingMigration,
      catalogMetadataMigration,
      acquisitionReceiptMigration,
  ingestJournalMigration,
  ingestPromotionMigration,
    ]);
    const receipts = new PostgresAcquisitionReceiptRepository(client);
    const request = {
      subject: "operator:container-1",
      idempotencyKey: "idempotency:container-1",
      publicationId: "publication:container-1",
      versionId: "version:container-1",
      targetLocalLibraryId: "local-library:container-1",
    };
    const manifest = {
      protocolVersion: "v1" as const,
      publicationId: request.publicationId as never,
      knowledgeObjectId: "knowledge-object:container-1" as never,
      versionId: request.versionId as never,
      contentFingerprint: "sha256:container-1",
      byteLength: 42,
      mediaType: "application/pdf",
    };

    const accepted = await receipts.accept(request, manifest);
    const replayed = await receipts.accept(request, manifest);
    assert.deepEqual(replayed, accepted);
    await assert.rejects(
      () => receipts.accept({ ...request, targetLocalLibraryId: "local-library:other-1" }, manifest),
      /conflict/,
    );
    const rows = await client.query<{ readonly count: string }>(
      "SELECT count(*)::text AS count FROM master_acquisition_receipts WHERE subject = $1",
      [request.subject],
    );
    assert.equal(rows.rows[0]?.count, "1");
    await client.close();
  });
}
}


if (databaseUrl) {
  test("containerized PostgreSQL allows only one concurrent ingest fingerprint claim", async () => {
    const client = new PgSqlClient({ connectionString: databaseUrl });
    await new MigrationRunner(client).apply([
      initialMasterLibraryMigration,
      durableProcessingMigration,
      catalogMetadataMigration,
      acquisitionReceiptMigration,
      ingestJournalMigration,
      ingestPromotionMigration,
    ]);
    const journal = new PostgresIngestJournal(client);
    const [first, second] = await Promise.all([
      journal.begin({ operationId: "ingest-operation:container-one", correlationId: "correlation:container-one", idempotencyKey: "ingest-key:container-one", publicationId: "publication:container-one", versionId: "version:container-one", knowledgeObjectId: "knowledge-object:container-one", contentFingerprint: "sha256:ingest-container" }),
      journal.begin({ operationId: "ingest-operation:container-two", correlationId: "correlation:container-two", idempotencyKey: "ingest-key:container-two", publicationId: "publication:container-two", versionId: "version:container-two", knowledgeObjectId: "knowledge-object:container-two", contentFingerprint: "sha256:ingest-container" }),
    ]);
    await journal.transition(first.operationId, "registered");
    assert.equal(second.operationId, first.operationId);
    assert.equal((await journal.find(first.operationId))?.state, "registered");
    const count = await client.query<{ readonly count: string }>("SELECT count(*)::text AS count FROM master_ingest_operations WHERE content_fingerprint = $1", ["sha256:ingest-container"]);
    assert.equal(count.rows[0]?.count, "1");
    await client.close();
  });
}
