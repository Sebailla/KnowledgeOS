import assert from "node:assert/strict";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import {
  tmpdir,
} from "node:os";
import {
  join,
} from "node:path";
import {
  NodeSqliteDatabase,
} from "@knowledgeos/local-sqlite-node";
import {
  localLibraryMigrations,
} from "@knowledgeos/local-library-sqlite";
import {
  searchEmbeddingJobsSqliteMigrations,
  SqliteSearchEmbeddingJobRepository,
} from "../dist/index.js";

const root =
  await mkdtemp(
    join(
      tmpdir(),
      "knowledgeos-embedding-jobs-",
    ),
  );

const path =
  join(
    root,
    "jobs.sqlite",
  );

try {
  const database =
    new NodeSqliteDatabase({
      path,
    });

  database.migrate([
    ...localLibraryMigrations,
    ...searchEmbeddingJobsSqliteMigrations,
  ]);

  const repository =
    new SqliteSearchEmbeddingJobRepository(
      database,
    );

  await repository.enqueue([{
    jobId:
      "job:1",
    searchDocumentId:
      "search:1",
    modelId:
      "model:v1",
    contentFingerprint:
      "sha256:1",
    status:
      "queued",
    attempts:
      0,
    maximumAttempts:
      3,
    priority:
      10,
    availableAt:
      "2026-08-01T00:00:00.000Z",
    createdAt:
      "2026-08-01T00:00:00.000Z",
    updatedAt:
      "2026-08-01T00:00:00.000Z",
  }]);

  const batch =
    await repository.leaseBatch(
      "model:v1",
      10,
      "lease:1",
      "2026-08-01T00:10:00.000Z",
      "2026-08-01T00:01:00.000Z",
    );

  assert.equal(
    batch.jobs.length,
    1,
  );
  assert.equal(
    batch.jobs[0].status,
    "running",
  );

  await repository.complete(
    "job:1",
    "2026-08-01T00:02:00.000Z",
  );

  assert.equal(
    (
      await repository.get(
        "job:1",
      )
    ).status,
    "completed",
  );

  database.close();

  console.log(JSON.stringify({
    flow:
      "sqlite-embedding-job-lease-complete",
    status:
      "passed",
  }));
} finally {
  await rm(
    root,
    {
      recursive: true,
      force: true,
    },
  );
}
