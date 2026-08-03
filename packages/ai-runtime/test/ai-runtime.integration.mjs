import assert from "node:assert/strict";
import {
  AiConversationMemoryService,
  InMemoryAiConversationRepository,
} from "@knowledgeos/ai-memory";
import {
  AiProviderRegistry,
  DeterministicAiProvider,
} from "@knowledgeos/ai-provider";
import {
  AiToolRegistry,
} from "@knowledgeos/ai-tools";
import {
  KnowledgeOsAiRuntime,
} from "../dist/index.js";

const clock = {
  nowIso() {
    return "2026-08-01T00:00:00.000Z";
  },
};

const repository =
  new InMemoryAiConversationRepository();
const memory =
  new AiConversationMemoryService(
    repository,
    clock,
  );

await memory.create({
  conversationId: "conversation:1",
  ownerId: "owner:1",
  title: "AI",
});

const providers =
  new AiProviderRegistry();
providers.register(
  new DeterministicAiProvider(
    clock,
  ),
);

const runtime =
  new KnowledgeOsAiRuntime(
    providers,
    memory,
    new AiToolRegistry(),
    clock,
  );

const response =
  await runtime.generate({
    ownerId: "owner:1",
    conversationId: "conversation:1",
    providerId: "deterministic-local",
    modelId: "deterministic-v1",
    userMessageId: "message:1",
    userContent: "summarize this",
    contextItems: [{
      contextItemId: "context:1",
      sourceKind: "search",
      sourceId: "search:1",
      title: "Paper",
      content: "Clinical content",
      relevance: 1,
      confidence: 1,
      tokenEstimate: 20,
      metadata: {},
    }],
    maximumContextTokens: 100,
    scopes: [],
  });

assert.equal(
  response.content,
  "Echo: summarize this",
);

assert.equal(
  (
    await repository.get(
      "owner:1",
      "conversation:1",
    )
  ).messages.length,
  2,
);

console.log(JSON.stringify({
  flow: "ai-runtime-context-memory-provider",
  status: "passed",
}));
