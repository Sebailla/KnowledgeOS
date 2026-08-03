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
  librarySqliteMigrations,
  SqliteLibraryRepository,
} from "../dist/index.js";

const root = await mkdtemp(join(tmpdir(), "knowledgeos-library-"));
const path = join(root, "library.sqlite");

try {
  const database = new NodeSqliteDatabase({ path });
  database.migrate([
    ...localLibraryMigrations,
    ...librarySqliteMigrations,
  ]);

  const repository = new SqliteLibraryRepository(database);

  await repository.saveObject({
    identity: {
      objectId: "object:1",
      ownerId: "owner:1",
      type: "document",
    },
    logicalPath: "/a.pdf",
    title: "A",
    contentHash: "sha256:a",
    version: 1,
    tags: [],
    metadata: {},
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  });

  assert.equal(
    (await repository.loadState("owner:1")).objects.length,
    1,
  );

  database.close();

  console.log(JSON.stringify({
    flow: "library-sqlite-persistence",
    status: "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
