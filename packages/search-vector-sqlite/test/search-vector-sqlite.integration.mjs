import assert from "node:assert/strict";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import {
  tmpdir,
} from "node:os";
import {
  join,
} from "node:path";
import {
  NodeSqliteDatabase,
} from "@knowledgeos/local-sqlite-node";
import {
  localLibraryMigrations,
} from "@knowledgeos/local-library-sqlite";
import {
  DeterministicLocalEmbeddingProvider,
} from "@knowledgeos/search-embedding";
import {
  searchVectorSqliteMigrations,
  SqliteSearchEmbeddingRepository,
} from "../dist/index.js";

const root =
  await mkdtemp(
    join(
      tmpdir(),
      "knowledgeos-vector-sqlite-",
    ),
  );

const path =
  join(
    root,
    "vector.sqlite",
  );

try {
  const database =
    new NodeSqliteDatabase({
      path,
    });

  database.migrate([
    ...localLibraryMigrations,
    ...searchVectorSqliteMigrations,
  ]);

  const provider =
    new DeterministicLocalEmbeddingProvider(
      64,
      {
        nowIso() {
          return "2026-08-01T00:00:00.000Z";
        },
      },
    );

  const embeddings =
    await provider.embed([
      {
        searchDocumentId:
          "search:cardiology",
        text:
          "heart attack myocardial infarction",
        contentFingerprint:
          "sha256:a",
      },
      {
        searchDocumentId:
          "search:aquarium",
        text:
          "marine aquarium coral reef",
        contentFingerprint:
          "sha256:b",
      },
    ]);

  const repository =
    new SqliteSearchEmbeddingRepository(
      database,
    );

  for (const embedding of embeddings) {
    await repository.upsert(
      embedding,
    );
  }

  const [query] =
    await provider.embed([
      {
        searchDocumentId:
          "query",
        text:
          "myocardial infarction",
        contentFingerprint:
          "sha256:q",
      },
    ]);

  const results =
    await repository.search(
      provider.modelId,
      query.vector,
      10,
    );

  assert.equal(
    results[0]
      .searchDocumentId,
    "search:cardiology",
  );

  database.close();

  console.log(JSON.stringify({
    flow:
      "sqlite-vector-storage-cosine-ranking",
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
