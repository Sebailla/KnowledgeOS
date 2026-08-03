export interface SearchEmbedding {
  readonly searchDocumentId: string;
  readonly modelId: string;
  readonly dimensions: number;
  readonly vector: readonly number[];
  readonly contentFingerprint: string;
  readonly createdAt: string;
}

export interface SearchEmbeddingRequest {
  readonly searchDocumentId: string;
  readonly text: string;
  readonly contentFingerprint: string;
}

export interface SearchEmbeddingProvider {
  readonly modelId: string;
  readonly dimensions: number;

  embed(
    requests:
      readonly SearchEmbeddingRequest[],
  ): Promise<
    readonly SearchEmbedding[]
  >;
}
