import type {
  SyncBatch,
  SyncChange,
  SyncCursor,
} from "@knowledgeos/sync-contracts";

export class SyncBatchPlanner {
  plan(
    input: {
      readonly batchId: string;
      readonly ownerId: string;
      readonly sourceReplicaId: string;
      readonly cursor: SyncCursor;
      readonly changes: readonly SyncChange[];
      readonly limit: number;
      readonly createdAt: string;
    },
  ): SyncBatch | undefined {
    if (!Number.isInteger(input.limit) || input.limit < 1) {
      throw new Error("limit must be positive");
    }

    const selected =
      input.changes
        .filter(
          (change) =>
            change.ownerId === input.ownerId &&
            change.replicaId === input.sourceReplicaId &&
            change.sequence > input.cursor.sequence,
        )
        .sort((a, b) => a.sequence - b.sequence)
        .slice(0, input.limit);

    if (selected.length === 0) return undefined;

    for (let index = 1; index < selected.length; index += 1) {
      if (selected[index]!.sequence <= selected[index - 1]!.sequence) {
        throw new Error("Sync sequences must be strictly increasing");
      }
    }

    return {
      batchId: input.batchId,
      ownerId: input.ownerId,
      sourceReplicaId: input.sourceReplicaId,
      fromSequence: input.cursor.sequence,
      toSequence: selected.at(-1)!.sequence,
      changes: selected,
      createdAt: input.createdAt,
    };
  }
}
