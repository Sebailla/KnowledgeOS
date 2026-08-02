import assert from "node:assert/strict";
import { Bm25Index } from "../dist/index.js";

const index = new Bm25Index();
index.upsert({ documentId: "a", terms: ["heart", "failure", "heart"] });
index.upsert({ documentId: "b", terms: ["marine", "aquarium"] });

const results = index.search(["heart"]);
assert.equal(results[0].documentId, "a");
assert.equal(results[0].score > 0, true);

console.log(JSON.stringify({ flow: "bm25-ranking", status: "passed" }));
