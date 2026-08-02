import assert from "node:assert/strict";
import {
  AiConversationMemoryService,
  InMemoryAiConversationRepository,
} from "../dist/index.js";

const repository =
  new InMemoryAiConversationRepository();
const service =
  new AiConversationMemoryService(
    repository,
    {
      nowIso() {
        return "2026-08-01T00:00:00.000Z";
      },
    },
  );

await service.create({
  conversationId: "conversation:1",
  ownerId: "owner:1",
  title: "Test",
});

await service.append(
  "owner:1",
  "conversation:1",
  {
    messageId: "message:1",
    role: "user",
    content: "hello",
    createdAt: "2026-08-01T00:00:00.000Z",
    metadata: {},
  },
);

assert.equal(
  (
    await repository.get(
      "owner:1",
      "conversation:1",
    )
  ).messages.length,
  1,
);

console.log(JSON.stringify({
  flow: "ai-conversation-memory",
  status: "passed",
}));
