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
  personalKnowledgeMigrations,
} from "@knowledgeos/personal-knowledge-sqlite";
import {
  personalKnowledgeSyncMigrations,
  SqlitePersonalKnowledgeConflictRepository,
  SqlitePersonalKnowledgeReplicaRepository,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-pk-sync-sqlite-"),
);
const path = join(root, "sync.sqlite");

try {
  const database =
    new NodeSqliteDatabase({ path });

  database.migrate([
    ...localLibraryMigrations,
    ...personalKnowledgeMigrations,
    ...personalKnowledgeSyncMigrations,
  ]);

  const replicas =
    new SqlitePersonalKnowledgeReplicaRepository(
      database,
    );
  const conflicts =
    new SqlitePersonalKnowledgeConflictRepository(
      database,
    );

  const item = {
    itemId: "pk:sqlite-sync",
    ownerId: "user:1",
    knowledgeObjectId:
      "knowledge-object:1",
    type: "note",
    body: "body",
    tags: [],
    revision: 2,
    deleted: false,
    createdAt:
      "2026-08-01T00:00:00.000Z",
    updatedAt:
      "2026-08-01T00:01:00.000Z",
  };

  await replicas.save({
    item,
    vector: {
      mac: 2,
      iphone: 1,
    },
    deviceId: "mac",
  });

  await conflicts.save({
    conflictId:
      "pk:sqlite-sync:2:2",
    itemId:
      "pk:sqlite-sync",
    baseRevision:
      1,
    local:
      item,
    remote: {
      ...item,
      body:
        "remote body",
    },
    state:
      "conflict",
    detectedAt:
      "2026-08-01T00:02:00.000Z",
  });

  database.close();

  const reopened =
    new NodeSqliteDatabase({ path });

  const loaded =
    await new SqlitePersonalKnowledgeReplicaRepository(
      reopened,
    ).get(
      "pk:sqlite-sync",
      "mac",
    );

  assert.equal(
    loaded.vector.mac,
    2,
  );

  const open =
    await new SqlitePersonalKnowledgeConflictRepository(
      reopened,
    ).listOpen();

  assert.equal(open.length, 1);

  reopened.close();

  console.log(JSON.stringify({
    flow:
      "personal-knowledge-replica-conflict-sqlite-reopen",
    status:
      "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
