import assert from "node:assert/strict";
import test from "node:test";

import {
  GraphIntegrityError,
  InMemoryGraphProvider,
  InMemoryGraphStore,
  KnowledgeGraphEngine,
  graphNodeToSearchDocument,
} from "../src/index.js";
import {
  CancellationNone,
} from "@knowledgeos/kernel";

const nodes = [
  {
    id: "a",
    type: "concept",
    label: "A",
    properties: {},
  },
  {
    id: "b",
    type: "concept",
    label: "B",
    properties: {},
  },
  {
    id: "c",
    type: "concept",
    label: "C",
    properties: {},
  },
];

test("edge requires existing nodes", async () => {
  const store = new InMemoryGraphStore();

  await store.upsertNode(nodes[0]!);

  await assert.rejects(
    () =>
      store.upsertEdge({
        id: "edge:1",
        type: "relates-to",
        sourceId: "a",
        targetId: "missing",
        directed: true,
        properties: {},
      }),
    GraphIntegrityError,
  );
});

test("neighbors returns connected nodes", async () => {
  const store = new InMemoryGraphStore();

  for (const node of nodes) {
    await store.upsertNode(node);
  }

  await store.upsertEdge({
    id: "edge:1",
    type: "relates-to",
    sourceId: "a",
    targetId: "b",
    directed: true,
    properties: {},
  });

  const neighbors = await store.neighbors({
    nodeId: "a",
    direction: "out",
  });

  assert.deepEqual(
    neighbors.map((node) => node.id),
    ["b"],
  );
});

test("bfs traversal returns paths by depth", async () => {
  const store = new InMemoryGraphStore();

  for (const node of nodes) {
    await store.upsertNode(node);
  }

  await store.upsertEdge({
    id: "edge:1",
    type: "relates-to",
    sourceId: "a",
    targetId: "b",
    directed: true,
    properties: {},
  });

  await store.upsertEdge({
    id: "edge:2",
    type: "relates-to",
    sourceId: "b",
    targetId: "c",
    directed: true,
    properties: {},
  });

  const paths = await store.traverse({
    startNodeId: "a",
    strategy: "bfs",
    maxDepth: 2,
  });

  assert.equal(paths.length, 2);
  assert.deepEqual(
    paths[1]?.nodes.map((node) => node.id),
    ["a", "b", "c"],
  );
});

test("removing node removes related edges", async () => {
  const store = new InMemoryGraphStore();

  for (const node of nodes.slice(0, 2)) {
    await store.upsertNode(node);
  }

  await store.upsertEdge({
    id: "edge:1",
    type: "relates-to",
    sourceId: "a",
    targetId: "b",
    directed: true,
    properties: {},
  });

  await store.removeNode("b");

  assert.equal(
    await store.getEdge("edge:1"),
    undefined,
  );
});

test("engine follows kernel lifecycle", async () => {
  const engine =
    new KnowledgeGraphEngine(
      new InMemoryGraphProvider(),
    );

  const context = {
    cancellation: CancellationNone,
    metadata: {},
  };

  await engine.initialize(context);
  await engine.start(context);

  await engine.upsertNode(nodes[0]!);
  await engine.upsertNode(nodes[1]!);
  await engine.upsertEdge({
    id: "edge:1",
    type: "relates-to",
    sourceId: "a",
    targetId: "b",
    directed: true,
    properties: {},
  });

  assert.equal(
    (await engine.neighbors({
      nodeId: "a",
      direction: "out",
    })).length,
    1,
  );

  await engine.stop(context);
  await engine.dispose(context);
});

test("graph node projects to search document", () => {
  const document =
    graphNodeToSearchDocument(
      {
        id: "a",
        type: "concept",
        label: "Knowledge",
        properties: {
          description: "Personal knowledge",
        },
      },
      "2026-08-03T00:00:00.000Z",
    );

  assert.equal(document.title, "Knowledge");
  assert.equal(document.metadata.type, "concept");
});

test("undirected edge exposes both directions", async () => {
  const store = new InMemoryGraphStore();

  for (const node of nodes.slice(0, 2)) {
    await store.upsertNode(node);
  }

  await store.upsertEdge({
    id: "edge:1",
    type: "similar",
    sourceId: "a",
    targetId: "b",
    directed: false,
    properties: {},
  });

  assert.equal(
    (await store.neighbors({
      nodeId: "b",
      direction: "out",
    })).length,
    1,
  );
});
