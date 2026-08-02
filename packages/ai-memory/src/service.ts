import type {
  AiMessage,
} from "@knowledgeos/ai-contracts";
import type {
  AiConversationRepository,
} from "./contracts.js";
import type {
  AiConversation,
} from "./model.js";

export interface AiMemoryClock {
  nowIso(): string;
}

export class AiConversationMemoryService {
  public constructor(
    private readonly repository:
      AiConversationRepository,
    private readonly clock:
      AiMemoryClock,
  ) {}

  async create(
    input: {
      readonly conversationId: string;
      readonly ownerId: string;
      readonly title: string;
    },
  ): Promise<AiConversation> {
    const now =
      this.clock.nowIso();

    const conversation: AiConversation = {
      conversationId:
        input.conversationId,
      ownerId:
        input.ownerId,
      title:
        input.title.trim(),
      messages:
        [],
      createdAt:
        now,
      updatedAt:
        now,
    };

    await this.repository.save(
      conversation,
    );
    return conversation;
  }

  async append(
    ownerId: string,
    conversationId: string,
    message: AiMessage,
  ): Promise<AiConversation> {
    const conversation =
      await this.repository.get(
        ownerId,
        conversationId,
      );

    if (!conversation) {
      throw new Error(
        `Conversation not found: ${conversationId}`,
      );
    }

    if (
      conversation.messages.some(
        (value) =>
          value.messageId ===
          message.messageId,
      )
    ) {
      return conversation;
    }

    const updated: AiConversation = {
      ...conversation,
      messages: [
        ...conversation.messages,
        message,
      ],
      updatedAt:
        this.clock.nowIso(),
    };

    await this.repository.save(updated);
    return updated;
  }
}
