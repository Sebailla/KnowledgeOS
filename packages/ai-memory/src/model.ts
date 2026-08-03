import type {
  AiMessage,
} from "@knowledgeos/ai-contracts";

export interface AiConversation {
  readonly conversationId: string;
  readonly ownerId: string;
  readonly title: string;
  readonly messages:
    readonly AiMessage[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly archivedAt?: string;
}

export interface AiConversationSummary {
  readonly conversationId: string;
  readonly summary: string;
  readonly sourceMessageIds:
    readonly string[];
  readonly createdAt: string;
}
