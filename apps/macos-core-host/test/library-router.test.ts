import assert from "node:assert/strict";
import test from "node:test";

import {
  createInMemoryCore,
} from "@knowledgeos/core";
import {
  CoreRouter,
} from "../src/router.js";

test("library list supports paging", async () => {
  const result =
    await new CoreRouter(
      createInMemoryCore(),
    ).dispatch(
      "library.list",
      {
        page: 1,
        pageSize: 2,
        sort: "title-asc",
      },
    ) as {
      readonly total: number;
      readonly items:
        readonly { readonly title: string }[];
      readonly hasNextPage: boolean;
    };

  assert.equal(result.total, 3);
  assert.equal(result.items.length, 2);
  assert.equal(result.hasNextPage, true);
});

test("library search filters text", async () => {
  const result =
    await new CoreRouter(
      createInMemoryCore(),
    ).dispatch(
      "library.search",
      {
        text: "graph",
      },
    ) as {
      readonly total: number;
      readonly items:
        readonly { readonly id: string }[];
    };

  assert.equal(result.total, 1);
  assert.equal(
    result.items[0]?.id,
    "publication:knowledge-graphs",
  );
});
