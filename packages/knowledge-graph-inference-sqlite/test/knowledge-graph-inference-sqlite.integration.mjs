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
  knowledgeGraphInferenceSqliteMigrations,
  SqliteKnowledgeGraphInferenceRepository,
} from "../dist/index.js";

const root =
  await mkdtemp(
    join(tmpdir(), "knowledgeos-kg-inference-"),
  );
const path = join(root, "inference.sqlite");

try {
  const database =
    new NodeSqliteDatabase({ path });

  database.migrate([
    ...localLibraryMigrations,
    ...knowledgeGraphInferenceSqliteMigrations,
  ]);

  const repository =
    new SqliteKnowledgeGraphInferenceRepository(
      database,
    );

  await repository.saveRule({
    ruleId: "rule:inverse",
    ontologyId: "ontology:1",
    kind: "inverse",
    sourceRelationshipTypeIds: ["cites"],
    targetRelationshipTypeId: "cited-by",
    enabled: true,
    priority: 10,
    version: 1,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  });

  await repository.upsertDerivedFact({
    graphId: "graph:1",
    edgeId: "derived:1",
    fromNodeId: "B",
    toNodeId: "A",
    relationshipTypeId: "cited-by",
    weight: 0.9,
    derived: true,
    provenance: {
      ruleId: "rule:inverse",
      sourceEdgeIds: ["edge:1"],
      generatedAt: "2026-08-01T00:01:00.000Z",
      generation: 1,
    },
  });

  assert.equal(
    (
      await repository.listRules("ontology:1")
    ).length,
    1,
  );

  assert.equal(
    (
      await repository.listDerivedFacts("graph:1")
    )[0].provenance.ruleId,
    "rule:inverse",
  );

  database.close();

  console.log(JSON.stringify({
    flow:
      "knowledge-graph-inference-sqlite-rules-derived-provenance",
    status:
      "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
