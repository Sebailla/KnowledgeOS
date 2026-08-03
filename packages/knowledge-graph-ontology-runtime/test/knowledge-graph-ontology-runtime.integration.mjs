import assert from "node:assert/strict";
import {
  InMemoryKnowledgeGraphOntologyRepository,
} from "@knowledgeos/knowledge-graph-ontology";
import {
  KnowledgeGraphOntologyRuntime,
} from "../dist/index.js";

const repository =
  new InMemoryKnowledgeGraphOntologyRepository();

const runtime =
  new KnowledgeGraphOntologyRuntime(
    repository,
  );

await runtime.saveNodeType(
  "ontology:1",
  {
    typeId: "entity",
    label: "Entity",
    abstract: true,
    parentTypeIds: [],
    properties: [{
      propertyId: "name",
      valueType: "string",
      required: true,
      multiple: false,
      inherited: true,
    }],
    version: 1,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
);

await runtime.saveNodeType(
  "ontology:1",
  {
    typeId: "paper",
    label: "Paper",
    abstract: false,
    parentTypeIds: ["entity"],
    properties: [],
    version: 1,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
);

assert.equal(
  await runtime.isAssignable(
    "ontology:1",
    "paper",
    "entity",
  ),
  true,
);

await runtime.saveTaxonomyTerm(
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
    await runtime.resolveTaxonomyTerm(
      "ontology:1",
      "topics",
      "heart medicine",
    )
  ).termId,
  "cardiology",
);

console.log(JSON.stringify({
  flow:
    "knowledge-graph-ontology-runtime-validation-resolution",
  status:
    "passed",
}));
