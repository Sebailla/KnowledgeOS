import type {
  AiGenerationRequest,
  AiGenerationResponse,
  AiProviderHealth,
  AiStreamChunk,
} from "./model.js";

export interface AiProvider {
  readonly providerId: string;

  generate(
    request: AiGenerationRequest,
  ): Promise<AiGenerationResponse>;

  stream(
    request: AiGenerationRequest,
  ): AsyncIterable<AiStreamChunk>;

  health(): Promise<AiProviderHealth>;
}

export interface AiCancellationSignal {
  readonly cancelled: boolean;
  throwIfCancelled(): void;
}
