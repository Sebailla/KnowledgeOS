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
  SqliteSearchDocumentRepository,
} from "@knowledgeos/search-sqlite";
import {
  parseSearchQuery,
} from "@knowledgeos/search-query";
import {
  SqliteAdvancedSearchReader,
} from "../dist/index.js";

const root =
  await mkdtemp(
    join(
      tmpdir(),
      "knowledgeos-query-sqlite-",
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
      "search:query-1",
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
      "Myocardial infarction emergency care.",
    language:
      "en",
    tags:
      ["cardiology"],
    authors:
      ["Jane Doe"],
    source:
      "PubMed",
    updatedAt:
      "2026-01-01T00:00:00.000Z",
    deleted:
      false,
    metadata:
      {},
  });

  await documents.upsert({
    searchDocumentId:
      "search:query-2",
    knowledgeObjectId:
      "knowledge-object:2",
    kind:
      "personal-knowledge",
    title:
      "note",
    body:
      "Cardiology follow-up note.",
    language:
      "en",
    tags:
      ["cardiology"],
    authors:
      [],
    source:
      "Local",
    updatedAt:
      "2026-02-01T00:00:00.000Z",
    deleted:
      false,
    metadata:
      {},
  });

  const query =
    parseSearchQuery(
      'cardiology kind:publication updated:[2025-01-01 TO 2026-12-31]',
      {
        limit:
          10,
      },
    );

  const response =
    await new SqliteAdvancedSearchReader(
      database,
    ).search(query);

  assert.equal(
    response.total,
    1,
  );
  assert.equal(
    response.results[0].kind,
    "publication",
  );

  const kindFacet =
    response.facets.find(
      (facet) =>
        facet.field === "kind",
    );

  assert.deepEqual(
    kindFacet.buckets,
    [{
      value:
        "publication",
      count:
        1,
    }],
  );

  database.close();

  console.log(JSON.stringify({
    flow:
      "advanced-query-filters-range-facets",
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
