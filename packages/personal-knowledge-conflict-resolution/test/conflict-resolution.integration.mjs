import assert from "node:assert/strict";
import {
  InMemoryConflictResolutionItemRepository,
  InMemoryConflictResolutionRepository,
  PassthroughConflictResolutionUnitOfWork,
  PersonalKnowledgeConflictResolutionService,
} from "../dist/index.js";

const base = {
  itemId: "pk:resolution-1",
  ownerId: "user:1",
  knowledgeObjectId:
    "knowledge-object:1",
  type: "note",
  body: "base",
  tags: [],
  revision: 1,
  deleted: false,
  createdAt:
    "2026-08-01T00:00:00.000Z",
  updatedAt:
    "2026-08-01T00:00:00.000Z",
};

const conflicts =
  new InMemoryConflictResolutionRepository();
const items =
  new InMemoryConflictResolutionItemRepository();

conflicts.seed({
  conflictId:
    "conflict:resolution-1",
  itemId:
    base.itemId,
  baseRevision:
    1,
  local: {
    ...base,
    body:
      "local body",
    revision:
      2,
  },
  remote: {
    ...base,
    body:
      "remote body",
    revision:
      2,
  },
  state:
    "conflict",
  detectedAt:
    "2026-08-01T00:01:00.000Z",
});

const service =
  new PersonalKnowledgeConflictResolutionService(
    conflicts,
    items,
    new PassthroughConflictResolutionUnitOfWork(),
    {
      nowIso() {
        return "2026-08-01T00:02:00.000Z";
      },
    },
  );

const resolved =
  await service.resolve({
    conflictId:
      "conflict:resolution-1",
    strategy:
      "manual-merge",
    resolvedBy:
      "user:1",
    expectedLocalRevision:
      2,
    expectedRemoteRevision:
      2,
    manualItem: {
      ...base,
      body:
        "merged body",
      tags:
        ["resolved"],
      revision:
        2,
    },
  });

assert.equal(
  resolved.item.body,
  "merged body",
);
assert.equal(
  resolved.item.revision,
  3,
);
assert.equal(
  items.get(base.itemId).body,
  "merged body",
);

console.log(JSON.stringify({
  flow:
    "personal-knowledge-conflict-manual-resolution",
  status:
    "passed",
}));
