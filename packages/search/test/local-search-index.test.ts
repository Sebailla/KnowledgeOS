import assert from "node:assert/strict";
import test from "node:test";

import {
  LocalSearchIndex,
} from "../src/index.js";

const records = [
  {
    id: "document:1",
    title: "KnowledgeOS Architecture",
    body:
      "Offline first knowledge platform with synchronization.",
    kind: "document" as const,
    authors: ["KnowledgeOS Team"],
    tags: ["architecture"],
    availability: "both",
    updatedAt: "2026-08-04",
    metadata: {},
  },
  {
    id: "paper:1",
    title: "Personal Knowledge Graphs",
    body:
      "Semantic relationships between notes and publications.",
    kind: "paper" as const,
    authors: ["Research Library"],
    tags: ["graph"],
    availability: "master-library",
    updatedAt: "2026-08-03",
    metadata: {},
  },
];

test("index ranks title matches", () => {
  const index = new LocalSearchIndex();
  index.rebuild(records);

  const result = index.search({
    text: "knowledge graphs",
  });

  assert.equal(result.total, 2);
  assert.equal(
    result.items[0]?.id,
    "paper:1",
  );
});

test("index supports filters and deletion", () => {
  const index = new LocalSearchIndex();
  index.rebuild(records);
  index.delete("paper:1");

  const result = index.search({
    text: "knowledge",
    kinds: ["document"],
  });

  assert.equal(result.total, 1);
  assert.equal(
    index.status().documentCount,
    1,
  );
});

test("index returns suggestions", () => {
  const index = new LocalSearchIndex();
  index.rebuild(records);

  assert.deepEqual(
    index.suggest("arch"),
    ["architecture", "KnowledgeOS Architecture"],
  );
});
