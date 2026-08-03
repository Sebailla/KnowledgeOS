import type {
  SearchEmbeddingJob,
} from "./model.js";
import type {
  SearchEmbeddingStateRepository,
} from "./contracts.js";

export interface EmbeddingPlannerClock {
  nowIso(): string;
}

export class SearchEmbeddingJobPlanner {
  public constructor(
    private readonly state:
      SearchEmbeddingStateRepository,
    private readonly clock:
      EmbeddingPlannerClock,
  ) {}

  async plan(
    input: {
      readonly searchDocumentId: string;
      readonly modelId: string;
      readonly contentFingerprint: string;
      readonly priority?: number;
      readonly maximumAttempts?: number;
    },
  ): Promise<SearchEmbeddingJob | undefined> {
    const current =
      await this.state.getFingerprint(
        input.searchDocumentId,
        input.modelId,
      );

    if (
      current ===
      input.contentFingerprint
    ) {
      return undefined;
    }

    const now =
      this.clock.nowIso();

    return {
      jobId:
        `${input.modelId}:${input.searchDocumentId}:${input.contentFingerprint}`,
      searchDocumentId:
        input.searchDocumentId,
      modelId:
        input.modelId,
      contentFingerprint:
        input.contentFingerprint,
      status:
        "queued",
      attempts:
        0,
      maximumAttempts:
        input.maximumAttempts ?? 5,
      priority:
        input.priority ?? 0,
      availableAt:
        now,
      createdAt:
        now,
      updatedAt:
        now,
    };
  }
}
