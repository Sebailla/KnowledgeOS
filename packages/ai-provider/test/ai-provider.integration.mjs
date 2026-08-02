import assert from "node:assert/strict";
import {
  AiProviderRegistry,
  DeterministicAiProvider,
} from "../dist/index.js";

const provider =
  new DeterministicAiProvider({
    nowIso() {
      return "2026-08-01T00:00:00.000Z";
    },
  });

const registry =
  new AiProviderRegistry();
registry.register(provider);

const response =
  await registry
    .get("deterministic-local")
    .generate({
      conversationId: "conversation:1",
      modelId: "deterministic-v1",
      messages: [{
        messageId: "message:1",
        role: "user",
        content: "hello world",
        createdAt: "2026-08-01T00:00:00.000Z",
        metadata: {},
      }],
      tools: [],
      temperature: 0,
      maximumOutputTokens: 128,
      stream: false,
    });

assert.equal(response.content, "Echo: hello world");
assert.equal((await registry.health()).length, 1);

console.log(JSON.stringify({
  flow: "ai-provider-registry-generation",
  status: "passed",
}));
