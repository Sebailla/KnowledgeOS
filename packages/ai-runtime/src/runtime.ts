import type {
  AiGenerationResponse,
  AiMessage,
} from "@knowledgeos/ai-contracts";
import type {
  AiContextItem,
} from "@knowledgeos/ai-context";
import {
  AiContextBuilder,
  renderContextPrompt,
} from "@knowledgeos/ai-context";
import type {
  AiConversationMemoryService,
} from "@knowledgeos/ai-memory";
import type {
  AiProviderRegistry,
} from "@knowledgeos/ai-provider";
import type {
  AiToolRegistry,
} from "@knowledgeos/ai-tools";

export interface AiRuntimeClock {
  nowIso(): string;
}

export class KnowledgeOsAiRuntime {
  private readonly contextBuilder =
    new AiContextBuilder();

  public constructor(
    private readonly providers:
      AiProviderRegistry,
    private readonly memory:
      AiConversationMemoryService,
    private readonly tools:
      AiToolRegistry,
    private readonly clock:
      AiRuntimeClock,
  ) {}

  async generate(
    input: {
      readonly ownerId: string;
      readonly conversationId: string;
      readonly providerId: string;
      readonly modelId: string;
      readonly userMessageId: string;
      readonly userContent: string;
      readonly contextItems:
        readonly AiContextItem[];
      readonly maximumContextTokens: number;
      readonly scopes: readonly string[];
    },
  ): Promise<AiGenerationResponse> {
    const userMessage: AiMessage = {
      messageId:
        input.userMessageId,
      role:
        "user",
      content:
        input.userContent,
      createdAt:
        this.clock.nowIso(),
      metadata:
        {},
    };

    const conversation =
      await this.memory.append(
        input.ownerId,
        input.conversationId,
        userMessage,
      );

    const bundle =
      this.contextBuilder.build(
        input.contextItems,
        input.maximumContextTokens,
      );

    const contextPrompt =
      renderContextPrompt(bundle);

    const messages: AiMessage[] = [
      ...(contextPrompt
        ? [{
            messageId:
              `context:${input.userMessageId}`,
            role:
              "system" as const,
            content:
              contextPrompt,
            createdAt:
              this.clock.nowIso(),
            metadata:
              {},
          }]
        : []),
      ...conversation.messages,
    ];

    const provider =
      this.providers.get(
        input.providerId,
      );

    const response =
      await provider.generate({
        conversationId:
          input.conversationId,
        modelId:
          input.modelId,
        messages,
        tools:
          this.tools.definitions(),
        temperature:
          0.2,
        maximumOutputTokens:
          1_024,
        stream:
          false,
      });

    await this.memory.append(
      input.ownerId,
      input.conversationId,
      {
        messageId:
          response.responseId,
        role:
          "assistant",
        content:
          response.content,
        createdAt:
          response.createdAt,
        metadata: {
          modelId:
            response.modelId,
        },
      },
    );

    return response;
  }
}
