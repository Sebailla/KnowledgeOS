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
  aiMemorySqliteMigrations,
  SqliteAiConversationRepository,
} from "../dist/index.js";

const root =
  await mkdtemp(
    join(tmpdir(), "knowledgeos-ai-memory-"),
  );
const path = join(root, "memory.sqlite");

try {
  const database =
    new NodeSqliteDatabase({ path });

  database.migrate([
    ...localLibraryMigrations,
    ...aiMemorySqliteMigrations,
  ]);

  const repository =
    new SqliteAiConversationRepository(
      database,
    );

  await repository.save({
    conversationId: "conversation:1",
    ownerId: "owner:1",
    title: "SQLite",
    messages: [],
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  });

  assert.equal(
    (
      await repository.get(
        "owner:1",
        "conversation:1",
      )
    ).title,
    "SQLite",
  );

  database.close();

  console.log(JSON.stringify({
    flow: "ai-memory-sqlite",
    status: "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
