import assert from "node:assert/strict";
import test from "node:test";
import type {
  BrowseMasterCatalogQuery,
  CreateAnnotationCommand,
  SearchQuery,
} from "../src/index.js";

test("contract types remain structurally serializable", () => {
  const values: readonly unknown[] = [
    {} satisfies Partial<BrowseMasterCatalogQuery>,
    {} satisfies Partial<CreateAnnotationCommand>,
    {} satisfies Partial<SearchQuery>,
  ];
  assert.equal(JSON.stringify(values), "[{},{},{}]");
});
