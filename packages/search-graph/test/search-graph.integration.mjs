import assert from "node:assert/strict";
import {
  InMemorySearchGraphRepository,
  SearchGraphCentralityService,
  SearchGraphConnectedComponentsService,
  SearchGraphPathService,
  SearchGraphTraversalService,
} from "../dist/index.js";

const graph =
  new InMemorySearchGraphRepository();

for (const node of [
  {
    nodeId: "A",
    searchDocumentId: "search:A",
    kind: "publication",
    label: "A",
    metadata: {},
  },
  {
    nodeId: "B",
    searchDocumentId: "search:B",
    kind: "note",
    label: "B",
    metadata: {},
  },
  {
    nodeId: "C",
    searchDocumentId: "search:C",
    kind: "publication",
    label: "C",
    metadata: {},
  },
  {
    nodeId: "D",
    searchDocumentId: "search:D",
    kind: "asset",
    label: "D",
    metadata: {},
  },
]) {
  await graph.upsertNode(node);
}

for (const edge of [
  {
    edgeId: "A-B",
    fromNodeId: "A",
    toNodeId: "B",
    type: "references",
    weight: 0.9,
    directed: false,
    metadata: {},
  },
  {
    edgeId: "B-C",
    fromNodeId: "B",
    toNodeId: "C",
    type: "annotates",
    weight: 0.8,
    directed: false,
    metadata: {},
  },
]) {
  await graph.upsertEdge(edge);
}

const traversal =
  await new SearchGraphTraversalService(
    graph,
  ).traverse(
    ["A"],
    {
      maximumDepth: 2,
      minimumScore: 0.1,
      decayPerDepth: 0.8,
    },
  );

assert.equal(
  traversal.some(
    (step) =>
      step.nodeId === "C" &&
      step.depth === 2,
  ),
  true,
);

const path =
  await new SearchGraphPathService(
    graph,
  ).shortestPath(
    "A",
    "C",
    3,
  );

assert.deepEqual(
  path.nodeIds,
  ["A", "B", "C"],
);

const centrality =
  await new SearchGraphCentralityService(
    graph,
  ).calculate();

assert.equal(
  centrality[0].nodeId,
  "B",
);

const components =
  await new SearchGraphConnectedComponentsService(
    graph,
  ).calculate();

assert.deepEqual(
  components.map(
    (component) =>
      component.length,
  ),
  [3, 1],
);

console.log(JSON.stringify({
  flow:
    "graph-traversal-path-centrality-components",
  status:
    "passed",
}));
