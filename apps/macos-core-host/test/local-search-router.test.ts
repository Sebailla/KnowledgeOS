import assert from "node:assert/strict";
import test from "node:test";

import {
  createInMemoryCore,
} from "@knowledgeos/core";
import {
  CoreRouter,
} from "../src/router.js";

test("local search returns ranked results", async () => {
  const result =
    await new CoreRouter(
      createInMemoryCore(),
    ).dispatch(
      "search.query",
      {
        query: "knowledge graph",
        page: 1,
        pageSize: 10,
      },
    ) as {
      readonly total: number;
      readonly items:
        readonly { readonly id: string }[];
    };

  assert.equal(result.total, 2);
  assert.equal(
    result.items[0]?.id,
    "publication:knowledge-graphs",
  );
});

test("local search provides suggestions", async () => {
  const result =
    await new CoreRouter(
      createInMemoryCore(),
    ).dispatch(
      "search.suggest",
      {
        query: "arch",
      },
    ) as {
      readonly suggestions:
        readonly string[];
    };

  assert.equal(
    result.suggestions.includes(
      "architecture",
    ),
    true,
  );
});
