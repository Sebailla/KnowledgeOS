import assert from "node:assert/strict";
import { DeterministicOcrEngine } from "../dist/index.js";

const result = await new DeterministicOcrEngine().recognize({
  documentId: "doc:1",
  page: 1,
  imageBytes: new TextEncoder().encode("recognized"),
  languageHints: ["en"],
});

assert.equal(result.text, "recognized");
assert.equal(result.confidence, 1);

console.log(JSON.stringify({
  flow: "document-ocr-contract",
  status: "passed",
}));
