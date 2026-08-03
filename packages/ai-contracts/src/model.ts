export type AiRole =
  | "system"
  | "user"
  | "assistant"
  | "tool";

export interface AiMessage {
  readonly messageId: string;
  readonly role: AiRole;
  readonly content: string;
  readonly createdAt: string;
  readonly toolCallId?: string;
  readonly metadata:
    Readonly<Record<string, string | number | boolean>>;
}

export interface AiToolCall {
  readonly toolCallId: string;
  readonly toolName: string;
  readonly arguments:
    Readonly<Record<string, unknown>>;
}

export interface AiUsage {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly totalTokens: number;
}

export interface AiGenerationRequest {
  readonly conversationId: string;
  readonly modelId: string;
  readonly messages: readonly AiMessage[];
  readonly tools: readonly AiToolDefinition[];
  readonly temperature: number;
  readonly maximumOutputTokens: number;
  readonly stream: boolean;
}

export interface AiGenerationResponse {
  readonly responseId: string;
  readonly modelId: string;
  readonly content: string;
  readonly toolCalls: readonly AiToolCall[];
  readonly finishReason:
    | "stop"
    | "length"
    | "tool-calls"
    | "cancelled"
    | "error";
  readonly usage: AiUsage;
  readonly createdAt: string;
}

export interface AiStreamChunk {
  readonly responseId: string;
  readonly sequence: number;
  readonly delta: string;
  readonly done: boolean;
  readonly finishReason?:
    AiGenerationResponse["finishReason"];
}

export interface AiToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly inputSchema:
    Readonly<Record<string, unknown>>;
}

export interface AiProviderHealth {
  readonly providerId: string;
  readonly status:
    | "available"
    | "degraded"
    | "unavailable";
  readonly models: readonly string[];
}
