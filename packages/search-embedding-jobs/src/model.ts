export type EmbeddingJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface SearchEmbeddingJob {
  readonly jobId: string;
  readonly searchDocumentId: string;
  readonly modelId: string;
  readonly contentFingerprint: string;
  readonly status: EmbeddingJobStatus;
  readonly attempts: number;
  readonly maximumAttempts: number;
  readonly priority: number;
  readonly availableAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastError?: string;
}

export interface SearchEmbeddingJobBatch {
  readonly jobs:
    readonly SearchEmbeddingJob[];
  readonly leaseId: string;
  readonly leasedUntil: string;
}

export interface SearchEmbeddingDocumentSource {
  readonly searchDocumentId: string;
  readonly text: string;
  readonly contentFingerprint: string;
}
