import assert from "node:assert/strict";
import {
  AiContextBuilder,
  renderContextPrompt,
} from "../dist/index.js";

const bundle =
  new AiContextBuilder().build([
    {
      contextItemId: "context:1",
      sourceKind: "search",
      sourceId: "search:1",
      title: "Relevant",
      content: "important",
      relevance: 1,
      confidence: 1,
      tokenEstimate: 10,
      metadata: {},
    },
    {
      contextItemId: "context:2",
      sourceKind: "manual",
      sourceId: "manual:1",
      title: "Less relevant",
      content: "secondary",
      relevance: 0.2,
      confidence: 1,
      tokenEstimate: 10,
      metadata: {},
    },
  ], 10);

assert.deepEqual(
  bundle.items.map((item) => item.contextItemId),
  ["context:1"],
);
assert.equal(renderContextPrompt(bundle).includes("important"), true);

console.log(JSON.stringify({
  flow: "ai-context-budget-ranking-rendering",
  status: "passed",
}));
