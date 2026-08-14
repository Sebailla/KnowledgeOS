import assert from "node:assert/strict";
import {
  durableProcessingMigration,
  initialMasterLibraryMigration,
  MigrationRunner,
  PgSqlClient,
  PostgresLeasedJobRepository,
} from "../dist-test/src/index.js";

const databaseUrl = process.env.MASTER_STORAGE_TEST_DATABASE_URL;
const mode = process.env.PROCESSING_WORKER_MODE;

if (!databaseUrl || (mode !== "interrupt" && mode !== "recover")) {
  throw new Error("MASTER_STORAGE_TEST_DATABASE_URL and PROCESSING_WORKER_MODE are required.");
}

const request = {
  operationId: "operation:interrupted-worker-1",
  correlationId: "correlation:interrupted-worker-1",
  publicationId: "publication:interrupted-worker-1",
  versionId: "version:interrupted-worker-1",
};
const client = new PgSqlClient({ connectionString: databaseUrl });
const jobs = new PostgresLeasedJobRepository(client);

try {
  if (mode === "interrupt") {
    await new MigrationRunner(client).apply([
      initialMasterLibraryMigration,
      durableProcessingMigration,
    ]);
    await jobs.enqueue(request);
    const claimed = await jobs.claim(
      "worker:interrupted",
      new Date("2026-08-10T00:00:00.000Z"),
      1_000,
    );
    assert.ok(claimed?.leaseId);
    await jobs.checkpoint(
      claimed.leaseId,
      "validated",
      new Date("2026-08-10T00:00:00.100Z"),
    );
    process.stdout.write("leased-checkpointed\n");
    await new Promise(() => {});
  }

  const resumed = await jobs.claim(
    "worker:recreated",
    new Date("2026-08-10T00:00:01.000Z"),
    1_000,
  );
  assert.equal(resumed?.checkpoint, "validated");
  assert.equal(resumed?.correlationId, request.correlationId);
  await jobs.complete(
    resumed.leaseId,
    new Date("2026-08-10T00:00:01.100Z"),
  );
  assert.equal(
    await jobs.claim("worker:duplicate", new Date("2026-08-10T00:00:02.000Z"), 1_000),
    undefined,
  );
  process.stdout.write("recovered-once\n");
} finally {
  await client.close();
}
