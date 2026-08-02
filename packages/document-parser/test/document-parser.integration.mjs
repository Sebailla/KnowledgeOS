import assert from "node:assert/strict";
import {
  DefaultDocumentParserRegistry,
  PlainTextDocumentParser,
  detectDocumentFormat,
} from "../dist/index.js";

assert.equal(detectDocumentFormat("application/pdf", "x"), "pdf");
assert.equal(detectDocumentFormat("text/plain", "a.txt"), "text");

const registry = new DefaultDocumentParserRegistry();
registry.register(new PlainTextDocumentParser());

const parsed = await registry.resolve("markdown").parse({
  documentId: "doc:1",
  sourceUri: "note.md",
  mimeType: "text/markdown",
  bytes: new TextEncoder().encode("# Title\nBody"),
  importedAt: "2026-08-01T00:00:00.000Z",
});

assert.equal(parsed.blocks[0].type, "heading");
assert.equal(parsed.blocks[1].text, "Body");

console.log(JSON.stringify({
  flow: "document-format-detection-parser-registry",
  status: "passed",
}));
