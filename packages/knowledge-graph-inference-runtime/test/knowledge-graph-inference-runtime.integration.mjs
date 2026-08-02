import assert from "node:assert/strict";
import {
  InMemoryKnowledgeGraphInferenceRepository,
} from "@knowledgeos/knowledge-graph-inference";
import {
  KnowledgeGraphInferenceRuntime,
} from "../dist/index.js";

const repository =
  new InMemoryKnowledgeGraphInferenceRepository();

repository.seedFact({
  graphId: "graph:1",
  edgeId: "edge:A-B",
  fromNodeId: "A",
  toNodeId: "B",
  relationshipTypeId: "cites",
  weight: 0.9,
  derived: false,
});

const runtime =
  new KnowledgeGraphInferenceRuntime(
    repository,
    {
      nowIso() {
        return "2026-08-01T00:01:00.000Z";
      },
    },
  );

await runtime.saveRule({
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

const result =
  await runtime.recompute({
    graphId: "graph:1",
    ontologyId: "ontology:1",
  });

assert.equal(result.generated, 1);

const derived =
  await repository.listDerivedFacts(
    "graph:1",
  );

assert.equal(
  derived[0].fromNodeId,
  "B",
);
assert.equal(
  derived[0].provenance.sourceEdgeIds[0],
  "edge:A-B",
);

console.log(JSON.stringify({
  flow:
    "knowledge-graph-inference-runtime-recompute",
  status:
    "passed",
}));
