import assert from "node:assert/strict";
import test from "node:test";

import {
  InMemorySearchIndex,
  InMemorySearchProvider,
  QueryParser,
  SearchEngine,
} from "../src/index.js";
import {
  CancellationNone,
} from "@knowledgeos/kernel";

const documents = [
  {
    id: "doc:1",
    title: "Knowledge Graph Research",
    body: "Graph reasoning and semantic search.",
    metadata: {
      type: "paper",
      year: "2026",
    },
    tags: ["graph", "research"],
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "doc:2",
    title: "Markdown Notes",
    body: "Personal notes about offline first design.",
    metadata: {
      type: "note",
      year: "2025",
    },
    tags: ["notes"],
    updatedAt: "2026-08-02T00:00:00.000Z",
  },
];

test("query parser extracts filters", () => {
  const query = new QueryParser().parse(
    'graph type:paper tag:research',
  );

  assert.equal(query.text, "graph");
  assert.equal(query.filters.length, 2);
});

test("in-memory index performs full-text search", async () => {
  const index = new InMemorySearchIndex();

  for (const document of documents) {
    await index.upsert(document);
  }

  const result = await index.search({
    text: "graph",
    filters: [],
    sort: [
      {
        field: "score",
        direction: "desc",
      },
    ],
    offset: 0,
    limit: 10,
  });

  assert.equal(result.total, 1);
  assert.equal(result.hits[0]?.document.id, "doc:1");
});

test("metadata and tag filters are applied", async () => {
  const index = new InMemorySearchIndex();

  for (const document of documents) {
    await index.upsert(document);
  }

  const query = new QueryParser().parse(
    "type:paper tag:research",
  );

  const result = await index.search(query);

  assert.equal(result.total, 1);
  assert.equal(result.hits[0]?.document.id, "doc:1");
});

test("pagination is deterministic", async () => {
  const index = new InMemorySearchIndex();

  for (const document of documents) {
    await index.upsert(document);
  }

  const result = await index.search({
    text: "",
    filters: [],
    sort: [
      {
        field: "title",
        direction: "asc",
      },
    ],
    offset: 1,
    limit: 1,
  });

  assert.equal(result.total, 2);
  assert.equal(result.hits.length, 1);
});

test("search engine follows lifecycle", async () => {
  const engine =
    new SearchEngine(
      new InMemorySearchProvider(),
    );

  const context = {
    cancellation: CancellationNone,
    metadata: {},
  };

  await engine.initialize(context);
  await engine.start(context);

  await engine.indexDocument(documents[0]!);

  const result = await engine.search("graph");

  assert.equal(result.total, 1);

  await engine.stop(context);
  await engine.dispose(context);
});

test("upsert replaces existing document", async () => {
  const index = new InMemorySearchIndex();

  await index.upsert(documents[0]!);

  await index.upsert({
    ...documents[0]!,
    title: "Updated Title",
  });

  assert.equal(
    (await index.get("doc:1"))?.title,
    "Updated Title",
  );
});

test("remove deletes document", async () => {
  const index = new InMemorySearchIndex();

  await index.upsert(documents[0]!);

  assert.equal(
    await index.remove("doc:1"),
    true,
  );

  assert.equal(
    await index.get("doc:1"),
    undefined,
  );
});
