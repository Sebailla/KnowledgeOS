import type {
  AiToolDefinition,
} from "@knowledgeos/ai-contracts";

export interface AiToolExecutionContext {
  readonly ownerId: string;
  readonly conversationId: string;
  readonly scopes: readonly string[];
}

export interface AiTool {
  readonly definition:
    AiToolDefinition;
  readonly requiredScope: string;

  execute(
    context:
      AiToolExecutionContext,
    input:
      Readonly<Record<string, unknown>>,
  ): Promise<unknown>;
}
