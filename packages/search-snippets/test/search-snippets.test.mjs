import assert from "node:assert/strict";
import { SearchSnippetGenerator } from "../dist/index.js";

const generator = new SearchSnippetGenerator();
const snippet = generator.generate(
  "This paper discusses acute heart failure and treatment.",
  ["heart failure"],
  60,
);

assert.equal(snippet.text.includes("heart failure"), true);
assert.equal(generator.highlight(snippet).includes("<mark>heart failure</mark>"), true);

console.log(JSON.stringify({ flow: "snippet-highlight", status: "passed" }));
