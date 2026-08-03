import type {
  SearchEmbeddingJob,
  SearchEmbeddingJobBatch,
  SearchEmbeddingDocumentSource,
} from "./model.js";

export interface SearchEmbeddingJobRepository {
  enqueue(
    jobs:
      readonly SearchEmbeddingJob[],
  ): Promise<void>;

  leaseBatch(
    modelId: string,
    limit: number,
    leaseId: string,
    leasedUntil: string,
    nowIso: string,
  ): Promise<SearchEmbeddingJobBatch>;

  complete(
    jobId: string,
    updatedAt: string,
  ): Promise<void>;

  fail(
    jobId: string,
    error: string,
    availableAt: string,
    updatedAt: string,
  ): Promise<void>;

  cancel(
    jobId: string,
    updatedAt: string,
  ): Promise<void>;

  get(
    jobId: string,
  ): Promise<SearchEmbeddingJob | undefined>;
}

export interface SearchEmbeddingDocumentSourceRepository {
  get(
    searchDocumentId: string,
  ): Promise<SearchEmbeddingDocumentSource | undefined>;
}

export interface SearchEmbeddingStateRepository {
  getFingerprint(
    searchDocumentId: string,
    modelId: string,
  ): Promise<string | undefined>;

  deleteByModel(
    modelId: string,
  ): Promise<number>;
}
