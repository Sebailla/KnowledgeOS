import assert from "node:assert/strict";
import {
  AiToolRegistry,
  KnowledgeSearchAiTool,
} from "../dist/index.js";

const registry =
  new AiToolRegistry();

registry.register(
  new KnowledgeSearchAiTool(
    async (ownerId, query) => ({
      ownerId,
      query,
    }),
  ),
);

const result =
  await registry.execute(
    {
      ownerId: "owner:1",
      conversationId: "conversation:1",
      scopes: ["search:read"],
    },
    "knowledge_search",
    {
      query: "heart failure",
    },
  );

assert.equal(result.query, "heart failure");

console.log(JSON.stringify({
  flow: "ai-tool-registry-authorization",
  status: "passed",
}));
