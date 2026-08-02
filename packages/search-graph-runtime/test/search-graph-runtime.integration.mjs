import assert from "node:assert/strict";
import {
  InMemorySearchGraphRepository,
} from "@knowledgeos/search-graph";
import {
  GraphAwareSearchRuntime,
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
]) {
  await graph.upsertNode(node);
}

await graph.upsertEdge({
  edgeId: "A-B",
  fromNodeId: "A",
  toNodeId: "B",
  type: "annotates",
  weight: 1,
  directed: false,
  metadata: {},
});

const documentToNode =
  new Map([
    ["search:A", "A"],
    ["search:B", "B"],
  ]);

const nodeToDocument =
  new Map([
    ["A", "search:A"],
    ["B", "search:B"],
  ]);

const results =
  await new GraphAwareSearchRuntime(
    graph,
    {
      async nodeIdForSearchDocument(
        id,
      ) {
        return documentToNode.get(id);
      },
      async searchDocumentIdForNode(
        id,
      ) {
        return nodeToDocument.get(id);
      },
    },
  ).expand([
    {
      searchDocumentId:
        "search:A",
      lexicalScore:
        1,
      semanticScore:
        0.8,
    },
  ]);

assert.equal(
  results.some(
    (result) =>
      result.searchDocumentId ===
      "search:B" &&
      result.graphScore > 0,
  ),
  true,
);

assert.equal(
  results.find(
    (result) =>
      result.searchDocumentId ===
      "search:B",
  ).explanation.reasons[0]
    .relationship,
  "annotates",
);

console.log(JSON.stringify({
  flow:
    "graph-aware-hybrid-ranking-explanation",
  status:
    "passed",
}));
