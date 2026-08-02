import type {
  SearchEmbeddingDocumentSourceRepository,
  SearchEmbeddingJobRepository,
  SearchEmbeddingStateRepository,
} from "./contracts.js";
import type {
  SearchEmbeddingDocumentSource,
  SearchEmbeddingJob,
} from "./model.js";

export class InMemorySearchEmbeddingJobRepository
implements SearchEmbeddingJobRepository {
  private readonly jobs =
    new Map<string, SearchEmbeddingJob>();

  async enqueue(
    jobs: readonly SearchEmbeddingJob[],
  ): Promise<void> {
    for (const job of jobs) {
      if (!this.jobs.has(job.jobId)) {
        this.jobs.set(job.jobId, job);
      }
    }
  }

  async leaseBatch(
    modelId: string,
    limit: number,
    leaseId: string,
    leasedUntil: string,
    nowIso: string,
  ) {
    const jobs =
      [...this.jobs.values()]
        .filter(
          (job) =>
            job.modelId === modelId &&
            job.status === "queued" &&
            job.availableAt <= nowIso,
        )
        .sort(
          (a, b) =>
            b.priority - a.priority ||
            a.createdAt.localeCompare(
              b.createdAt,
            ),
        )
        .slice(0, limit)
        .map(
          (job) => {
            const leased = {
              ...job,
              status:
                "running" as const,
              attempts:
                job.attempts + 1,
              updatedAt:
                nowIso,
            };
            this.jobs.set(
              job.jobId,
              leased,
            );
            return leased;
          },
        );

    return {
      jobs,
      leaseId,
      leasedUntil,
    };
  }

  async complete(
    jobId: string,
    updatedAt: string,
  ): Promise<void> {
    const job =
      this.jobs.get(jobId);
    if (!job) return;

    this.jobs.set(jobId, {
      ...job,
      status:
        "completed",
      updatedAt,
    });
  }

  async fail(
    jobId: string,
    error: string,
    availableAt: string,
    updatedAt: string,
  ): Promise<void> {
    const job =
      this.jobs.get(jobId);
    if (!job) return;

    this.jobs.set(jobId, {
      ...job,
      status:
        job.attempts >=
        job.maximumAttempts
          ? "failed"
          : "queued",
      lastError:
        error,
      availableAt,
      updatedAt,
    });
  }

  async cancel(
    jobId: string,
    updatedAt: string,
  ): Promise<void> {
    const job =
      this.jobs.get(jobId);
    if (!job) return;

    this.jobs.set(jobId, {
      ...job,
      status:
        "cancelled",
      updatedAt,
    });
  }

  async get(
    jobId: string,
  ) {
    return this.jobs.get(jobId);
  }
}

export class InMemorySearchEmbeddingDocumentSourceRepository
implements SearchEmbeddingDocumentSourceRepository {
  private readonly values =
    new Map<string, SearchEmbeddingDocumentSource>();

  seed(
    value: SearchEmbeddingDocumentSource,
  ): void {
    this.values.set(
      value.searchDocumentId,
      value,
    );
  }

  async get(
    searchDocumentId: string,
  ) {
    return this.values.get(
      searchDocumentId,
    );
  }
}

export class InMemorySearchEmbeddingStateRepository
implements SearchEmbeddingStateRepository {
  private readonly fingerprints =
    new Map<string, string>();

  private key(
    searchDocumentId: string,
    modelId: string,
  ): string {
    return `${searchDocumentId}::${modelId}`;
  }

  async getFingerprint(
    searchDocumentId: string,
    modelId: string,
  ) {
    return this.fingerprints.get(
      this.key(
        searchDocumentId,
        modelId,
      ),
    );
  }

  seed(
    searchDocumentId: string,
    modelId: string,
    fingerprint: string,
  ): void {
    this.fingerprints.set(
      this.key(
        searchDocumentId,
        modelId,
      ),
      fingerprint,
    );
  }

  async deleteByModel(
    modelId: string,
  ): Promise<number> {
    let removed = 0;

    for (const key of [
      ...this.fingerprints.keys(),
    ]) {
      if (
        key.endsWith(
          `::${modelId}`,
        )
      ) {
        this.fingerprints.delete(
          key,
        );
        removed += 1;
      }
    }

    return removed;
  }
}
