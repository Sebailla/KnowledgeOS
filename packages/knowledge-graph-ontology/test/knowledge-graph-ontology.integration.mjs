import assert from "node:assert/strict";
import {
  KnowledgeGraphOntologyValidator,
  OntologyHierarchy,
  OntologyInheritanceResolver,
  OntologyTaxonomy,
} from "../dist/index.js";

const types = [
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
  {
    typeId: "document",
    label: "Document",
    abstract: false,
    parentTypeIds: ["entity"],
    properties: [{
      propertyId: "mimeType",
      valueType: "string",
      required: true,
      multiple: false,
      inherited: true,
    }],
    version: 1,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    typeId: "paper",
    label: "Paper",
    abstract: false,
    parentTypeIds: ["document"],
    properties: [{
      propertyId: "doi",
      valueType: "identifier",
      required: false,
      multiple: false,
      inherited: true,
    }],
    version: 1,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
];

const hierarchy =
  new OntologyHierarchy(types);

assert.equal(
  hierarchy.isAssignable(
    "paper",
    "entity",
  ),
  true,
);

assert.deepEqual(
  hierarchy.ancestors("paper"),
  ["document", "entity"],
);

const properties =
  new OntologyInheritanceResolver(
    types,
  ).effectiveProperties(
    "paper",
  );

assert.deepEqual(
  properties.map(
    (property) =>
      property.propertyId,
  ),
  ["doi", "mimeType", "name"],
);

const validator =
  new KnowledgeGraphOntologyValidator();

assert.deepEqual(
  validator.validateNodeTypes(
    types,
  ),
  [],
);

const taxonomy =
  new OntologyTaxonomy([
    {
      taxonomyId: "topics",
      termId: "cardiology",
      label: "Cardiology",
      synonyms: ["heart medicine"],
      metadata: {},
    },
  ]);

assert.equal(
  taxonomy.resolve(
    "topics",
    "heart medicine",
  ).termId,
  "cardiology",
);

console.log(JSON.stringify({
  flow:
    "ontology-hierarchy-inheritance-taxonomy-validation",
  status:
    "passed",
}));
