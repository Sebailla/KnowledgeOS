import assert from "node:assert/strict";
import {
  KnowledgeGraphInferenceConsistencyChecker,
  KnowledgeGraphInferenceEngine,
  KnowledgeGraphInferenceRuleValidator,
} from "../dist/index.js";

const rules = [
  {
    ruleId: "rule:transitive",
    ontologyId: "ontology:1",
    kind: "transitive",
    sourceRelationshipTypeIds: ["parent-of"],
    targetRelationshipTypeId: "ancestor-of",
    enabled: true,
    priority: 10,
    version: 1,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    ruleId: "rule:inverse",
    ontologyId: "ontology:1",
    kind: "inverse",
    sourceRelationshipTypeIds: ["cites"],
    targetRelationshipTypeId: "cited-by",
    enabled: true,
    priority: 5,
    version: 1,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
];

assert.deepEqual(
  new KnowledgeGraphInferenceRuleValidator().validate(rules),
  [],
);

const facts = [
  {
    graphId: "graph:1",
    edgeId: "edge:A-B",
    fromNodeId: "A",
    toNodeId: "B",
    relationshipTypeId: "parent-of",
    weight: 1,
    derived: false,
  },
  {
    graphId: "graph:1",
    edgeId: "edge:B-C",
    fromNodeId: "B",
    toNodeId: "C",
    relationshipTypeId: "parent-of",
    weight: 0.9,
    derived: false,
  },
  {
    graphId: "graph:1",
    edgeId: "edge:P-Q",
    fromNodeId: "P",
    toNodeId: "Q",
    relationshipTypeId: "cites",
    weight: 0.8,
    derived: false,
  },
];

const derived =
  new KnowledgeGraphInferenceEngine({
    nowIso() {
      return "2026-08-01T00:01:00.000Z";
    },
  }).infer(facts, rules);

assert.equal(
  derived.some(
    (fact) =>
      fact.fromNodeId === "A" &&
      fact.toNodeId === "C" &&
      fact.relationshipTypeId === "ancestor-of",
  ),
  true,
);

assert.equal(
  derived.some(
    (fact) =>
      fact.fromNodeId === "Q" &&
      fact.toNodeId === "P" &&
      fact.relationshipTypeId === "cited-by",
  ),
  true,
);

assert.deepEqual(
  new KnowledgeGraphInferenceConsistencyChecker()
    .check(facts, derived),
  [],
);

console.log(JSON.stringify({
  flow:
    "knowledge-graph-inference-rules-provenance-consistency",
  status:
    "passed",
}));
