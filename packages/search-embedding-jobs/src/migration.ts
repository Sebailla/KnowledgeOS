import type {
  SearchEmbeddingJobRepository,
  SearchEmbeddingStateRepository,
} from "./contracts.js";
import type {
  SearchEmbeddingJob,
} from "./model.js";

export class SearchEmbeddingModelMigrationService {
  public constructor(
    private readonly state:
      SearchEmbeddingStateRepository,
    private readonly jobs:
      SearchEmbeddingJobRepository,
  ) {}

  async migrate(
    input: {
      readonly fromModelId: string;
      readonly toModelId: string;
      readonly documents:
        readonly {
          readonly searchDocumentId: string;
          readonly contentFingerprint: string;
        }[];
      readonly nowIso: string;
    },
  ): Promise<{
    readonly removedEmbeddings: number;
    readonly queuedJobs: number;
  }> {
    const removedEmbeddings =
      await this.state.deleteByModel(
        input.fromModelId,
      );

    const jobs:
      SearchEmbeddingJob[] =
      input.documents.map(
        (document) => ({
          jobId:
            `${input.toModelId}:${document.searchDocumentId}:${document.contentFingerprint}`,
          searchDocumentId:
            document.searchDocumentId,
          modelId:
            input.toModelId,
          contentFingerprint:
            document.contentFingerprint,
          status:
            "queued",
          attempts:
            0,
          maximumAttempts:
            5,
          priority:
            100,
          availableAt:
            input.nowIso,
          createdAt:
            input.nowIso,
          updatedAt:
            input.nowIso,
        }),
      );

    await this.jobs.enqueue(
      jobs,
    );

    return {
      removedEmbeddings,
      queuedJobs:
        jobs.length,
    };
  }
}
