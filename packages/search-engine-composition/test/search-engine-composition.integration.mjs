import assert from "node:assert/strict";
import { ConsolidatedSearchEngine } from "../dist/index.js";

const engine = new ConsolidatedSearchEngine();
engine.upsert({
  documentId: "paper:1",
  title: "Heart Failure Treatment",
  content: "A clinical review of heart failure therapies.",
  kind: "publication",
  personalBoost: 0.5,
});
engine.upsert({
  documentId: "note:1",
  title: "Aquarium Notes",
  content: "Marine coral maintenance.",
  kind: "note",
});

const results = engine.search("heart failure");
assert.equal(results[0].documentId, "paper:1");
assert.equal(results[0].snippet.includes("<mark>heart</mark>"), true);
assert.equal(results[0].explanation.personal, 0.5);

console.log(JSON.stringify({
  flow: "consolidated-search-engine",
  status: "passed",
}));
