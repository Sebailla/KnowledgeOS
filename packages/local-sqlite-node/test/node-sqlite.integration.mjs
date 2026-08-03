import assert from "node:assert/strict";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  localLibraryMigrations,
  SqliteLocalPublicationRepository,
} from "@knowledgeos/local-library-sqlite";
import {
  NodeSqliteDatabase,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-sqlite-node-"),
);
const path = join(root, "local-library.sqlite");

try {
  const database =
    new NodeSqliteDatabase({ path });

  database.migrate(
    localLibraryMigrations,
  );

  const repository =
    new SqliteLocalPublicationRepository(
      database,
    );

  await database.run(async () => {
    await repository.save({
      localLibraryId:
        "local-library:node-sqlite",
      publicationId:
        "publication:node-sqlite-1",
      knowledgeObjectId:
        "knowledge-object:node-sqlite-1",
      versionId:
        "version:node-sqlite-1",
      sourceItemId:
        "source-item:node-sqlite-1",
      title:
        "Persistent Node SQLite",
      mediaType:
        "application/pdf",
      byteLength:
        2048,
      contentFingerprint:
        "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      relativePath:
        "objects/aa/aa/a",
      acquisitionStatus:
        "available",
      readableOffline:
        true,
      pinned:
        false,
    });
  });

  await assert.rejects(
    () =>
      database.run(async () => {
        await repository.save({
          localLibraryId:
            "local-library:node-sqlite",
          publicationId:
            "publication:rollback",
          knowledgeObjectId:
            "knowledge-object:rollback",
          versionId:
            "version:rollback",
          sourceItemId:
            "source-item:rollback",
          title:
            "Rollback",
          mediaType:
            "application/pdf",
          byteLength:
            1,
          contentFingerprint:
            "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
          relativePath:
            "objects/bb/bb/b",
          acquisitionStatus:
            "available",
          readableOffline:
            true,
          pinned:
            false,
        });
        throw new Error("rollback");
      }),
  );

  assert.equal(
    await repository.get(
      "local-library:node-sqlite",
      "publication:rollback",
    ),
    undefined,
  );

  database.close();

  const reopened =
    new NodeSqliteDatabase({ path });
  const reopenedRepository =
    new SqliteLocalPublicationRepository(
      reopened,
    );

  const loaded =
    await reopenedRepository.get(
      "local-library:node-sqlite",
      "publication:node-sqlite-1",
    );

  assert.equal(
    loaded.title,
    "Persistent Node SQLite",
  );

  reopened.checkpoint();
  reopened.close();

  console.log(JSON.stringify({
    flow:
      "node-sqlite-migrate-transaction-rollback-reopen",
    status: "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
