import type {
  AiGenerationRequest,
  AiGenerationResponse,
  AiProvider,
  AiStreamChunk,
} from "@knowledgeos/ai-contracts";

export interface DeterministicAiClock {
  nowIso(): string;
}

export class DeterministicAiProvider
implements AiProvider {
  public readonly providerId =
    "deterministic-local";

  public constructor(
    private readonly clock:
      DeterministicAiClock,
  ) {}

  async generate(
    request: AiGenerationRequest,
  ): Promise<AiGenerationResponse> {
    const lastUser =
      [...request.messages]
        .reverse()
        .find(
          (message) =>
            message.role === "user",
        );

    const content =
      lastUser
        ? `Echo: ${lastUser.content}`
        : "No user message";

    return {
      responseId:
        `response:${request.conversationId}`,
      modelId:
        request.modelId,
      content,
      toolCalls:
        [],
      finishReason:
        "stop",
      usage: {
        inputTokens:
          request.messages.reduce(
            (sum, message) =>
              sum +
              message.content
                .split(/\s+/)
                .filter(Boolean)
                .length,
            0,
          ),
        outputTokens:
          content
            .split(/\s+/)
            .filter(Boolean)
            .length,
        totalTokens:
          0,
      },
      createdAt:
        this.clock.nowIso(),
    };
  }

  async *stream(
    request: AiGenerationRequest,
  ): AsyncIterable<AiStreamChunk> {
    const response =
      await this.generate(request);
    const parts =
      response.content.split(" ");

    for (
      let index = 0;
      index < parts.length;
      index += 1
    ) {
      yield {
        responseId:
          response.responseId,
        sequence:
          index,
        delta:
          `${index === 0 ? "" : " "}${parts[index]}`,
        done:
          index === parts.length - 1,
        ...(index === parts.length - 1
          ? {
              finishReason:
                response.finishReason,
            }
          : {}),
      };
    }
  }

  async health() {
    return {
      providerId:
        this.providerId,
      status:
        "available" as const,
      models: [
        "deterministic-v1",
      ],
    };
  }
}
