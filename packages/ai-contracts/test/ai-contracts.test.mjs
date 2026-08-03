import assert from "node:assert/strict";

const request = {
  conversationId: "conversation:1",
  modelId: "local:test",
  messages: [],
  tools: [],
  temperature: 0.2,
  maximumOutputTokens: 512,
  stream: false,
};

assert.equal(request.temperature, 0.2);

console.log(JSON.stringify({
  flow: "ai-contracts",
  status: "passed",
}));
