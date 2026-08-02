import assert from "node:assert/strict";
import { DocumentNormalizer } from "../dist/index.js";

const normalized = new DocumentNormalizer().normalize({
  documentId: "doc:1",
  source: {
    sourceId: "source:1",
    uri: "sample.md",
    format: "markdown",
    mimeType: "text/markdown",
    sizeBytes: 1,
    contentFingerprint: "x",
    importedAt: "2026-08-01T00:00:00.000Z",
  },
  blocks: [{
    blockId: "b:1",
    type: "heading",
    text: "  Hello   World  ",
    order: 4,
    metadata: {},
  }],
  assets: [],
  metadata: {},
  createdAt: "2026-08-01T00:00:00.000Z",
});

assert.equal(normalized.title, "Hello World");
assert.equal(normalized.blocks[0].order, 0);

console.log(JSON.stringify({
  flow: "document-normalization",
  status: "passed",
}));
