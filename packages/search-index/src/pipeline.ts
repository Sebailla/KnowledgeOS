import type {
  SearchCheckpointRepository,
  SearchCommandRepository,
  SearchDocumentRepository,
  SearchUnitOfWork,
} from "@knowledgeos/search-domain";

export interface SearchIndexClock {
  nowIso(): string;
}

export class IncrementalSearchIndexPipeline {
  public constructor(
    private readonly commands:
      SearchCommandRepository,
    private readonly documents:
      SearchDocumentRepository,
    private readonly checkpoints:
      SearchCheckpointRepository,
    private readonly unitOfWork:
      SearchUnitOfWork,
    private readonly clock:
      SearchIndexClock,
  ) {}

  async run(
    consumerId: string,
    limit: number,
  ): Promise<{
    readonly processed: number;
    readonly lastSequence: number;
  }> {
    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 1000
    ) {
      throw new Error(
        "limit must be between 1 and 1000",
      );
    }

    const checkpoint =
      await this.checkpoints.get(
        consumerId,
      );

    const lastSequence =
      checkpoint?.lastSequence ?? 0;

    const commands =
      await this.commands.listAfter(
        lastSequence,
        limit,
      );

    let nextSequence =
      lastSequence;

    for (const command of commands) {
      if (
        command.sequence <=
        nextSequence
      ) {
        continue;
      }

      await this.unitOfWork.run(
        async () => {
          if (
            command.operation ===
            "delete" ||
            command.document.deleted
          ) {
            await this.documents.delete(
              command.document.searchDocumentId,
            );
          } else {
            await this.documents.upsert(
              command.document,
            );
          }

          await this.checkpoints.save({
            consumerId,
            lastSequence:
              command.sequence,
            updatedAt:
              this.clock.nowIso(),
          });
        },
      );

      nextSequence =
        command.sequence;
    }

    return {
      processed:
        commands.length,
      lastSequence:
        nextSequence,
    };
  }
}
