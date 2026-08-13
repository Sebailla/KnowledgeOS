import assert from "node:assert/strict";
import test from "node:test";
import { resolveDescriptorPath } from "../dist/index.js";

test("descriptor paths remain under the publication root", () => {
  assert.equal(resolveDescriptorPath("/library", "publications/a/v1/content"), "/library/publications/a/v1/content");
  assert.throws(() => resolveDescriptorPath("/library", "../secrets/token"), /escapes/);
});
