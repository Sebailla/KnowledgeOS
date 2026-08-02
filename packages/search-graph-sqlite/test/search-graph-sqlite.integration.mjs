import assert from "node:assert/strict";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import {
  tmpdir,
} from "node:os";
import {
  join,
} from "node:path";
import {
  NodeSqliteDatabase,
} from "@knowledgeos/local-sqlite-node";
import {
  localLibraryMigrations,
} from "@knowledgeos/local-library-sqlite";
import {
  SearchGraphTraversalService,
} from "@knowledgeos/search-graph";
import {
  searchGraphSqliteMigrations,
  SqliteSearchGraphRepository,
} from "../dist/index.js";

const root =
  await mkdtemp(
    join(
      tmpdir(),
      "knowledgeos-search-graph-",
    ),
  );

const path =
  join(
    root,
    "graph.sqlite",
  );

try {
  const database =
    new NodeSqliteDatabase({
      path,
    });

  database.migrate([
    ...localLibraryMigrations,
    ...searchGraphSqliteMigrations,
  ]);

  const graph =
    new SqliteSearchGraphRepository(
      database,
    );

  await graph.upsertNode({
    nodeId: "A",
    searchDocumentId: "search:A",
    kind: "publication",
    label: "A",
    metadata: {},
  });

  await graph.upsertNode({
    nodeId: "B",
    searchDocumentId: "search:B",
    kind: "note",
    label: "B",
    metadata: {},
  });

  await graph.upsertEdge({
    edgeId: "A-B",
    fromNodeId: "A",
    toNodeId: "B",
    type: "annotates",
    weight: 0.9,
    directed: false,
    metadata: {},
  });

  const traversal =
    await new SearchGraphTraversalService(
      graph,
    ).traverse(
      ["A"],
      {
        maximumDepth: 1,
        minimumScore: 0.1,
        decayPerDepth: 0.8,
      },
    );

  assert.equal(
    traversal.some(
      (step) =>
        step.nodeId === "B",
    ),
    true,
  );

  database.close();

  console.log(JSON.stringify({
    flow:
      "sqlite-graph-storage-neighbor-traversal",
    status:
      "passed",
  }));
} finally {
  await rm(
    root,
    {
      recursive: true,
      force: true,
    },
  );
}
