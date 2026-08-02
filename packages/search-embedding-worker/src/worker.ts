import type {
  SearchEmbeddingProvider,
} from "@knowledgeos/search-embedding";
import type {
  SearchEmbeddingDocumentSourceRepository,
  SearchEmbeddingJobRepository,
} from "@knowledgeos/search-embedding-jobs";

export interface SearchEmbeddingSink {
  upsert(
    embedding:
      Awaited<
        ReturnType<
          SearchEmbeddingProvider["embed"]
        >
      >[number],
  ): Promise<void>;
}

export interface EmbeddingWorkerClock {
  nowIso(): string;
  addMilliseconds(
    iso: string,
    milliseconds: number,
  ): string;
}

export class SearchEmbeddingWorker {
  public constructor(
    private readonly jobs:
      SearchEmbeddingJobRepository,
    private readonly documents:
      SearchEmbeddingDocumentSourceRepository,
    private readonly provider:
      SearchEmbeddingProvider,
    private readonly sink:
      SearchEmbeddingSink,
    private readonly clock:
      EmbeddingWorkerClock,
  ) {}

  async runBatch(
    input: {
      readonly limit: number;
      readonly leaseId: string;
      readonly leaseMilliseconds: number;
      readonly retryDelayMilliseconds: number;
    },
  ): Promise<{
    readonly leased: number;
    readonly completed: number;
    readonly failed: number;
  }> {
    const now =
      this.clock.nowIso();

    const batch =
      await this.jobs.leaseBatch(
        this.provider.modelId,
        input.limit,
        input.leaseId,
        this.clock.addMilliseconds(
          now,
          input.leaseMilliseconds,
        ),
        now,
      );

    let completed = 0;
    let failed = 0;

    for (const job of batch.jobs) {
      try {
        const source =
          await this.documents.get(
            job.searchDocumentId,
          );

        if (!source) {
          throw new Error(
            "Search Document source not found",
          );
        }

        if (
          source.contentFingerprint !==
          job.contentFingerprint
        ) {
          throw new Error(
            "Search Document fingerprint changed",
          );
        }

        const [embedding] =
          await this.provider.embed([
            {
              searchDocumentId:
                source.searchDocumentId,
              text:
                source.text,
              contentFingerprint:
                source.contentFingerprint,
            },
          ]);

        if (!embedding) {
          throw new Error(
            "Embedding provider returned no result",
          );
        }

        await this.sink.upsert(
          embedding,
        );

        await this.jobs.complete(
          job.jobId,
          this.clock.nowIso(),
        );

        completed += 1;
      } catch (error) {
        failed += 1;

        await this.jobs.fail(
          job.jobId,
          error instanceof Error
            ? error.message
            : "unknown-error",
          this.clock.addMilliseconds(
            this.clock.nowIso(),
            input.retryDelayMilliseconds,
          ),
          this.clock.nowIso(),
        );
      }
    }

    return {
      leased:
        batch.jobs.length,
      completed,
      failed,
    };
  }
}
