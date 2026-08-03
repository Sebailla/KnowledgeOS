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
  searchSqliteMigrations,
  SqliteFtsSearchReader,
  SqliteSearchDocumentRepository,
} from "../dist/index.js";

const root =
  await mkdtemp(
    join(
      tmpdir(),
      "knowledgeos-search-sqlite-",
    ),
  );

const path =
  join(
    root,
    "search.sqlite",
  );

try {
  const database =
    new NodeSqliteDatabase({
      path,
    });

  database.migrate([
    ...localLibraryMigrations,
    ...searchSqliteMigrations,
  ]);

  const documents =
    new SqliteSearchDocumentRepository(
      database,
    );

  await documents.upsert({
    searchDocumentId:
      "search:fts-1",
    knowledgeObjectId:
      "knowledge-object:1",
    publicationId:
      "publication:1",
    versionId:
      "version:1",
    kind:
      "publication",
    title:
      "Acute Coronary Syndrome",
    body:
      "Myocardial infarction is an ischemic heart disease emergency.",
    tags:
      ["cardiology"],
    authors:
      ["Author A"],
    updatedAt:
      "2026-08-01T00:00:00.000Z",
    deleted:
      false,
    metadata:
      {},
  });

  const results =
    await new SqliteFtsSearchReader(
      database,
    ).search(
      "myocardial",
      10,
    );

  assert.equal(
    results.length,
    1,
  );
  assert.equal(
    results[0].title,
    "Acute Coronary Syndrome",
  );
  assert.equal(
    results[0].snippet.includes(
      "<mark>",
    ),
    true,
  );

  database.close();

  console.log(JSON.stringify({
    flow:
      "sqlite-fts5-upsert-search-bm25-snippet",
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
