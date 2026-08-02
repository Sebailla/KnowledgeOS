import assert from "node:assert/strict";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  NodeSqliteDatabase,
} from "@knowledgeos/local-sqlite-node";
import {
  localLibraryMigrations,
} from "@knowledgeos/local-library-sqlite";
import {
  SqliteTransferDescriptorRepository,
  SqliteTransferStateRepository,
  syncLocalSqliteMigrations,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-sync-sqlite-"),
);
const databasePath = join(root, "sync.sqlite");

try {
  const database =
    new NodeSqliteDatabase({
      path: databasePath,
    });

  database.migrate([
    ...localLibraryMigrations,
    ...syncLocalSqliteMigrations,
  ]);

  const descriptors =
    new SqliteTransferDescriptorRepository(
      database,
    );
  const states =
    new SqliteTransferStateRepository(
      database,
    );

  await descriptors.save({
    transferId: "transfer:sqlite-1",
    planId: "plan:sqlite-1",
    localLibraryId:
      "local-library:sqlite",
    publicationId:
      "publication:sqlite-1",
    knowledgeObjectId:
      "knowledge-object:sqlite-1",
    versionId:
      "version:sqlite-1",
    sourceItemId:
      "source-item:sqlite-1",
    title:
      "SQLite Sync Transfer",
    mediaType:
      "application/pdf",
    byteLength:
      4096,
    contentFingerprint:
      "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  });

  await states.save({
    transferId: "transfer:sqlite-1",
    planId: "plan:sqlite-1",
    receivedBytes: 1024,
    totalBytes: 4096,
    completed: false,
    checksumVerified: false,
    temporaryPath:
      "/tmp/transfer.sqlite.part",
    updatedAt:
      "2026-08-01T00:00:00.000Z",
  });

  database.close();

  const reopened =
    new NodeSqliteDatabase({
      path: databasePath,
    });

  const reopenedStates =
    new SqliteTransferStateRepository(
      reopened,
    );

  const loaded =
    await reopenedStates.get(
      "transfer:sqlite-1",
    );

  assert.equal(
    loaded.receivedBytes,
    1024,
  );
  assert.equal(
    loaded.completed,
    false,
  );

  reopened.close();

  console.log(JSON.stringify({
    flow:
      "sqlite-transfer-descriptor-checkpoint-reopen",
    status:
      "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
