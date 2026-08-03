import type {
  AiConversation,
  AiConversationSummary,
} from "./model.js";

export interface AiConversationRepository {
  get(
    ownerId: string,
    conversationId: string,
  ): Promise<AiConversation | undefined>;

  save(
    conversation: AiConversation,
  ): Promise<void>;

  list(
    ownerId: string,
    limit: number,
  ): Promise<readonly AiConversation[]>;
}

export interface AiConversationSummaryRepository {
  getLatest(
    conversationId: string,
  ): Promise<AiConversationSummary | undefined>;

  save(
    summary: AiConversationSummary,
  ): Promise<void>;
}
