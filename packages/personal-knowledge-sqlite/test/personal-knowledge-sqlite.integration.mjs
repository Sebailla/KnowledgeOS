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
  PersonalKnowledgeService,
} from "@knowledgeos/personal-knowledge";
import {
  personalKnowledgeMigrations,
  SqlitePersonalKnowledgeRepository,
  SqlitePersonalKnowledgeRevisionRepository,
  SqlitePersonalKnowledgeUnitOfWork,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-pk-sqlite-"),
);
const path = join(root, "personal.sqlite");

try {
  const database =
    new NodeSqliteDatabase({ path });

  database.migrate([
    ...localLibraryMigrations,
    ...personalKnowledgeMigrations,
  ]);

  const items =
    new SqlitePersonalKnowledgeRepository(
      database,
    );
  const revisions =
    new SqlitePersonalKnowledgeRevisionRepository(
      database,
    );

  const service =
    new PersonalKnowledgeService(
      items,
      revisions,
      new SqlitePersonalKnowledgeUnitOfWork(
        database,
      ),
      {
        nowIso() {
          return "2026-08-01T00:00:00.000Z";
        },
      },
    );

  const created =
    await service.create({
      itemId:
        "pk:sqlite-1",
      ownerId:
        "user:sqlite",
      knowledgeObjectId:
        "knowledge-object:sqlite",
      type:
        "note",
      body:
        "Persistent note",
      tags:
        ["sqlite"],
    });

  await service.update({
    itemId:
      created.itemId,
    ownerId:
      "user:sqlite",
    expectedRevision:
      1,
    body:
      "Persistent note updated",
  });

  database.close();

  const reopened =
    new NodeSqliteDatabase({ path });
  const reopenedItems =
    new SqlitePersonalKnowledgeRepository(
      reopened,
    );
  const reopenedRevisions =
    new SqlitePersonalKnowledgeRevisionRepository(
      reopened,
    );

  const loaded =
    await reopenedItems.get(
      "pk:sqlite-1",
    );

  assert.equal(
    loaded.body,
    "Persistent note updated",
  );

  const history =
    await reopenedRevisions.list(
      "pk:sqlite-1",
    );

  assert.equal(
    history.length,
    2,
  );

  reopened.close();

  console.log(JSON.stringify({
    flow:
      "personal-knowledge-sqlite-transaction-reopen-history",
    status:
      "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
