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
  documentSqliteMigrations,
  SqliteParsedDocumentRepository,
} from "../dist/index.js";

const root = await mkdtemp(join(tmpdir(), "knowledgeos-document-"));
const path = join(root, "documents.sqlite");

try {
  const database = new NodeSqliteDatabase({ path });
  database.migrate([
    ...localLibraryMigrations,
    ...documentSqliteMigrations,
  ]);

  const repository =
    new SqliteParsedDocumentRepository(database);

  await repository.save({
    documentId: "doc:1",
    source: {
      sourceId: "source:1",
      uri: "a.md",
      format: "markdown",
      mimeType: "text/markdown",
      sizeBytes: 1,
      contentFingerprint: "x",
      importedAt: "2026-08-01T00:00:00.000Z",
    },
    title: "A",
    blocks: [],
    assets: [],
    metadata: {},
    createdAt: "2026-08-01T00:00:00.000Z",
  });

  assert.equal(
    (await repository.get("doc:1")).title,
    "A",
  );

  database.close();

  console.log(JSON.stringify({
    flow: "document-sqlite-persistence",
    status: "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
