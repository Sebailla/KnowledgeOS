import type { AIModel, AIResponse } from "../model.js";

export interface AIContextSource {
  readonly id: string;
  readonly title: string;
  readonly kind: "document" | "search" | "graph" | "annotation";
  readonly excerpt: string;
}

export interface AIConversationMessage {
  readonly id: string;
  readonly role: "system" | "user" | "assistant";
  readonly content: string;
  readonly createdAt: string;
  readonly sources?: readonly AIContextSource[];
}

export interface AIConversation {
  readonly id: string;
  readonly title: string;
  readonly modelId: string;
  readonly messages: readonly AIConversationMessage[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AIRuntimeHealth {
  readonly status: "ready" | "degraded";
  readonly selectedModelId?: string;
  readonly modelCount: number;
  readonly conversationCount: number;
  readonly localOnly: boolean;
}

export class LocalAIRuntime {
  private readonly models = new Map<string, AIModel>();
  private readonly conversations = new Map<string, AIConversation>();
  private selectedModelId: string | undefined;

  public constructor(
    models: readonly AIModel[],
    private readonly generator: (
      modelId: string,
      messages: readonly AIConversationMessage[],
    ) => Promise<AIResponse>,
  ) {
    for (const model of models) this.models.set(model.id, model);
    this.selectedModelId = models.find((model) => model.local)?.id ?? models[0]?.id;
  }

  public listModels(): readonly AIModel[] {
    return [...this.models.values()].sort((a,b)=>a.name.localeCompare(b.name));
  }

  public selectModel(id: string): AIModel {
    const model = this.models.get(id);
    if (!model) throw new Error(`AI model '${id}' was not found.`);
    this.selectedModelId = id;
    return model;
  }

  public health(): AIRuntimeHealth {
    return {
      status: this.models.size ? "ready" : "degraded",
      ...(this.selectedModelId ? { selectedModelId: this.selectedModelId } : {}),
      modelCount: this.models.size,
      conversationCount: this.conversations.size,
      localOnly: [...this.models.values()].every((model)=>model.local),
    };
  }

  public listConversations(): readonly AIConversation[] {
    return [...this.conversations.values()].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  }

  public getConversation(id: string): AIConversation | undefined {
    return this.conversations.get(id);
  }

  public deleteConversation(id: string): boolean {
    return this.conversations.delete(id);
  }

  public async chat(input: {
    readonly conversationId?: string;
    readonly message: string;
    readonly modelId?: string;
    readonly context?: readonly AIContextSource[];
  }): Promise<AIConversation> {
    const now = new Date().toISOString();
    const modelId = input.modelId ?? this.selectedModelId;
    if (!modelId) throw new Error("No AI model is selected.");
    if (!this.models.has(modelId)) throw new Error(`AI model '${modelId}' was not found.`);

    const id = input.conversationId ?? `conversation:${Date.now()}`;
    const current = this.conversations.get(id);
    const user: AIConversationMessage = {
      id: `message:${Date.now()}:user`, role: "user", content: input.message,
      createdAt: now, ...(input.context?.length ? { sources: input.context } : {}),
    };
    const messages = [...(current?.messages ?? []), user];
    const response = await this.generator(modelId, messages);
    const assistant: AIConversationMessage = {
      id: `message:${Date.now()}:assistant`, role: "assistant", content: response.content,
      createdAt: new Date().toISOString(), ...(input.context?.length ? { sources: input.context } : {}),
    };
    const conversation: AIConversation = {
      id,
      title: current?.title ?? input.message.slice(0, 60),
      modelId,
      messages: [...messages, assistant],
      createdAt: current?.createdAt ?? now,
      updatedAt: assistant.createdAt,
    };
    this.conversations.set(id, conversation);
    return conversation;
  }
}
