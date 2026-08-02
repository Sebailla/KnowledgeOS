import assert from "node:assert/strict";
import { DeterministicSearchReranker } from "../dist/index.js";

const results = new DeterministicSearchReranker().rerank("heart failure", [
  { documentId: "a", baseScore: 1, title: "Heart Failure", content: "clinical" },
  { documentId: "b", baseScore: 1.2, title: "Other", content: "unrelated" },
]);

assert.equal(results[0].documentId, "a");
assert.equal(results[0].contributions.titleExact, 1.5);

console.log(JSON.stringify({ flow: "deterministic-reranking", status: "passed" }));
