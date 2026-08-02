import assert from "node:assert/strict";
import {
  InMemoryKnowledgeGraphTraversalReader,
} from "@knowledgeos/knowledge-graph-traversal";
import {
  KnowledgeGraphTraversalRuntime,
} from "../dist/index.js";

const reader =
  new InMemoryKnowledgeGraphTraversalReader();

reader.seed(
  "graph:1",
  "A",
  [{
    nodeId: "B",
    edgeId: "A-B",
    relationshipType:
      "references",
    weight: 1,
    direction: "outgoing",
  }],
);

reader.seed(
  "graph:1",
  "B",
  [{
    nodeId: "C",
    edgeId: "B-C",
    relationshipType:
      "mentions",
    weight: 0.8,
    direction: "outgoing",
  }],
);

const runtime =
  new KnowledgeGraphTraversalRuntime(
    reader,
  );

const result =
  await runtime.traverse(
    "graph:1",
    "A",
    {
      mode:
        "weighted",
      maximumDepth:
        2,
      direction:
        "outgoing",
      includeStart:
        true,
    },
  );

assert.equal(
  result.some(
    (value) =>
      value.nodeId === "C",
  ),
  true,
);

const path =
  await runtime.shortestPath(
    "graph:1",
    "A",
    "C",
    {
      maximumDepth:
        3,
      direction:
        "outgoing",
    },
  );

assert.equal(
  path.hopCount,
  2,
);

console.log(JSON.stringify({
  flow:
    "knowledge-graph-traversal-runtime",
  status:
    "passed",
}));
