import assert from "node:assert/strict";
import {
  DefaultDocumentParserRegistry,
  PlainTextDocumentParser,
} from "@knowledgeos/document-parser";
import {
  DocumentProcessingRuntime,
} from "../dist/index.js";

const registry = new DefaultDocumentParserRegistry();
registry.register(new PlainTextDocumentParser());

const stored = [];
const runtime =
  new DocumentProcessingRuntime(
    registry,
    {
      async save(document) {
        stored.push(document);
      },
    },
  );

const result = await runtime.process({
  documentId: "doc:1",
  sourceUri: "sample.md",
  mimeType: "text/markdown",
  bytes: new TextEncoder().encode("# Title\nBody"),
  importedAt: "2026-08-01T00:00:00.000Z",
});

assert.equal(result.title, "Title");
assert.equal(stored.length, 1);

console.log(JSON.stringify({
  flow: "document-processing-runtime",
  status: "passed",
}));
