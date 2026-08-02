import type {
  AiConversationRepository,
  AiConversationSummaryRepository,
} from "./contracts.js";
import type {
  AiConversation,
  AiConversationSummary,
} from "./model.js";

export class InMemoryAiConversationRepository
implements AiConversationRepository {
  private readonly values =
    new Map<string, AiConversation>();

  private key(
    ownerId: string,
    conversationId: string,
  ): string {
    return `${ownerId}::${conversationId}`;
  }

  async get(
    ownerId: string,
    conversationId: string,
  ) {
    return this.values.get(
      this.key(
        ownerId,
        conversationId,
      ),
    );
  }

  async save(
    conversation: AiConversation,
  ): Promise<void> {
    this.values.set(
      this.key(
        conversation.ownerId,
        conversation.conversationId,
      ),
      conversation,
    );
  }

  async list(
    ownerId: string,
    limit: number,
  ) {
    return [
      ...this.values.values(),
    ]
      .filter(
        (value) =>
          value.ownerId ===
          ownerId,
      )
      .sort(
        (a, b) =>
          b.updatedAt.localeCompare(
            a.updatedAt,
          ),
      )
      .slice(0, limit);
  }
}

export class InMemoryAiConversationSummaryRepository
implements AiConversationSummaryRepository {
  private readonly values =
    new Map<string, AiConversationSummary[]>();

  async getLatest(
    conversationId: string,
  ) {
    return (
      this.values.get(
        conversationId,
      ) ?? []
    )
      .slice()
      .sort(
        (a, b) =>
          b.createdAt.localeCompare(
            a.createdAt,
          ),
      )[0];
  }

  async save(
    summary: AiConversationSummary,
  ): Promise<void> {
    const values =
      this.values.get(
        summary.conversationId,
      ) ?? [];
    values.push(summary);
    this.values.set(
      summary.conversationId,
      values,
    );
  }
}
