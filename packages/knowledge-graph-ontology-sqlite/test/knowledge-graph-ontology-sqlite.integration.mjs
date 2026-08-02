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
  knowledgeGraphOntologySqliteMigrations,
  SqliteKnowledgeGraphOntologyRepository,
} from "../dist/index.js";

const root =
  await mkdtemp(
    join(
      tmpdir(),
      "knowledgeos-kg-ontology-",
    ),
  );

const path =
  join(
    root,
    "ontology.sqlite",
  );

try {
  const database =
    new NodeSqliteDatabase({
      path,
    });

  database.migrate([
    ...localLibraryMigrations,
    ...knowledgeGraphOntologySqliteMigrations,
  ]);

  const repository =
    new SqliteKnowledgeGraphOntologyRepository(
      database,
    );

  await repository.saveNodeType(
    "ontology:1",
    {
      typeId: "entity",
      label: "Entity",
      abstract: true,
      parentTypeIds: [],
      properties: [],
      version: 1,
      createdAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-01T00:00:00.000Z",
    },
  );

  await repository.saveTaxonomyTerm(
    "ontology:1",
    {
      taxonomyId: "topics",
      termId: "cardiology",
      label: "Cardiology",
      synonyms: ["heart medicine"],
      metadata: {},
    },
  );

  assert.equal(
    (
      await repository.listNodeTypes(
        "ontology:1",
      )
    ).length,
    1,
  );

  assert.equal(
    (
      await repository.listTaxonomyTerms(
        "ontology:1",
        "topics",
      )
    )[0].termId,
    "cardiology",
  );

  database.close();

  console.log(JSON.stringify({
    flow:
      "knowledge-graph-ontology-sqlite-persistence",
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
