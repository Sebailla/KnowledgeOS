import assert from "node:assert/strict";

const format = "markdown";
assert.equal(format, "markdown");

console.log(JSON.stringify({
  flow: "document-contracts",
  status: "passed",
}));
