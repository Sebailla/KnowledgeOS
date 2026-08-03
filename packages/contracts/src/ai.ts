import type {
  IdentityReference,
  PrivacyClass,
  ProviderId,
} from "@knowledgeos/domain-types";
import type { Command } from "./command.js";
import type { Query } from "./query.js";

export interface AskKnowledgeQuestionPayload {
  readonly question: string;
  readonly contextReferences: readonly IdentityReference[];
  readonly privacyClass: PrivacyClass;
  readonly localOnly?: boolean;
  readonly preferredProviderId?: ProviderId;
}

export type AskKnowledgeQuestionCommand = Command<
  "ai.ask-knowledge-question",
  AskKnowledgeQuestionPayload
>;

export type GetAvailableModelsQuery = Query<
  "ai.get-available-models",
  { readonly capability?: string; readonly localOnly?: boolean }
>;
