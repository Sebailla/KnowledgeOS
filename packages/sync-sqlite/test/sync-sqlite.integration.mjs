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
  SqliteSyncRepository,
  syncSqliteMigrations,
} from "../dist/index.js";

const root =
  await mkdtemp(
    join(tmpdir(), "knowledgeos-sync-"),
  );
const path = join(root, "sync.sqlite");

try {
  const database =
    new NodeSqliteDatabase({ path });

  database.migrate([
    ...localLibraryMigrations,
    ...syncSqliteMigrations,
  ]);

  const repository =
    new SqliteSyncRepository(database);

  await repository.appendChange({
    changeId: "change:1",
    ownerId: "owner:1",
    replicaId: "mac:1",
    sequence: 1,
    kind: "object-upsert",
    entityId: "object:1",
    version: 1,
    payload: {},
    occurredAt: "2026-08-01T00:00:00.000Z",
  });

  assert.equal(
    (
      await repository.listAfter(
        "owner:1",
        "mac:1",
        0,
        10,
      )
    ).length,
    1,
  );

  await repository.saveCursor(
    "owner:1",
    "nas:1",
    {
      replicaId: "mac:1",
      sequence: 1,
    },
  );

  assert.equal(
    (
      await repository.getCursor(
        "owner:1",
        "nas:1",
        "mac:1",
      )
    ).sequence,
    1,
  );

  database.close();

  console.log(JSON.stringify({
    flow: "sync-sqlite-persistence",
    status: "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
