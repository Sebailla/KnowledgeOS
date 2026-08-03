import assert from "node:assert/strict";
import {
  BreadthFirstTraversal,
  DepthFirstTraversal,
  InMemoryKnowledgeGraphTraversalReader,
  ShortestPathTraversal,
  WeightedGraphTraversal,
} from "../dist/index.js";

const reader =
  new InMemoryKnowledgeGraphTraversalReader();

reader.seed(
  "graph:1",
  "A",
  [
    {
      nodeId: "B",
      edgeId: "A-B",
      relationshipType:
        "references",
      weight: 0.9,
      direction: "outgoing",
    },
    {
      nodeId: "C",
      edgeId: "A-C",
      relationshipType:
        "mentions",
      weight: 0.5,
      direction: "outgoing",
    },
  ],
);

reader.seed(
  "graph:1",
  "B",
  [{
    nodeId: "D",
    edgeId: "B-D",
    relationshipType:
      "derived-from",
    weight: 0.8,
    direction: "outgoing",
  }],
);

reader.seed(
  "graph:1",
  "C",
  [{
    nodeId: "D",
    edgeId: "C-D",
    relationshipType:
      "similar-to",
    weight: 0.4,
    direction: "outgoing",
  }],
);

const bfs =
  await new BreadthFirstTraversal(
    reader,
  ).traverse(
    "graph:1",
    "A",
    {
      maximumDepth: 2,
      direction: "outgoing",
      includeStart: true,
    },
  );

assert.deepEqual(
  bfs.map(
    (value) => value.nodeId,
  ),
  ["A", "B", "C", "D"],
);

const dfs =
  await new DepthFirstTraversal(
    reader,
  ).traverse(
    "graph:1",
    "A",
    {
      maximumDepth: 2,
      direction: "outgoing",
      includeStart: false,
    },
  );

assert.equal(
  dfs[0].nodeId,
  "B",
);

const path =
  await new ShortestPathTraversal(
    reader,
  ).find(
    "graph:1",
    "A",
    "D",
    {
      maximumDepth: 3,
      direction: "outgoing",
    },
  );

assert.deepEqual(
  path.nodeIds,
  ["A", "B", "D"],
);

const weighted =
  await new WeightedGraphTraversal(
    reader,
  ).traverse(
    "graph:1",
    "A",
    {
      maximumDepth: 2,
      direction: "outgoing",
      decayPerDepth: 0.8,
      minimumScore: 0.1,
    },
  );

assert.equal(
  weighted.find(
    (value) =>
      value.nodeId === "D",
  ).parentNodeId,
  "B",
);

console.log(JSON.stringify({
  flow:
    "knowledge-graph-bfs-dfs-path-weighted",
  status:
    "passed",
}));
