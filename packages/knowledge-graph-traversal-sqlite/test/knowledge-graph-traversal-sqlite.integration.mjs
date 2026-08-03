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
  knowledgeGraphSqliteMigrations,
} from "@knowledgeos/knowledge-graph-sqlite";
import {
  SqliteKnowledgeGraphTraversalReader,
} from "../dist/index.js";

const root =
  await mkdtemp(
    join(
      tmpdir(),
      "knowledgeos-kg-traversal-",
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
    ...knowledgeGraphSqliteMigrations,
  ]);

  await database.execute(
    `
      insert into knowledge_graph_nodes (
        graph_id,
        node_id,
        type,
        labels_json,
        properties_json,
        version,
        created_at,
        updated_at,
        deleted_at
      ) values
        (?, ?, ?, ?, ?, ?, ?, ?, null),
        (?, ?, ?, ?, ?, ?, ?, ?, null)
    `,
    [
      "graph:1",
      "A",
      "publication",
      "[]",
      "{}",
      1,
      "2026-08-01T00:00:00.000Z",
      "2026-08-01T00:00:00.000Z",
      "graph:1",
      "B",
      "note",
      "[]",
      "{}",
      1,
      "2026-08-01T00:00:00.000Z",
      "2026-08-01T00:00:00.000Z",
    ],
  );

  await database.execute(
    `
      insert into knowledge_graph_edges (
        graph_id,
        edge_id,
        from_node_id,
        to_node_id,
        type,
        weight,
        directed,
        properties_json,
        version,
        created_at,
        updated_at,
        deleted_at
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, null)
    `,
    [
      "graph:1",
      "A-B",
      "A",
      "B",
      "references",
      0.9,
      1,
      "{}",
      1,
      "2026-08-01T00:00:00.000Z",
      "2026-08-01T00:00:00.000Z",
    ],
  );

  const reader =
    new SqliteKnowledgeGraphTraversalReader(
      database,
    );

  const neighbors =
    await reader.neighbors(
      "graph:1",
      "A",
      "outgoing",
    );

  assert.equal(
    neighbors.length,
    1,
  );
  assert.equal(
    neighbors[0].nodeId,
    "B",
  );

  database.close();

  console.log(JSON.stringify({
    flow:
      "knowledge-graph-sqlite-neighbors",
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
