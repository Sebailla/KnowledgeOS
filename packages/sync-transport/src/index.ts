import type {
  SyncBatch,
  SyncCursor,
  SyncTransport,
} from "@knowledgeos/sync-contracts";

export class InMemorySyncTransport
implements SyncTransport {
  private readonly batches: SyncBatch[] = [];

  async push(batch: SyncBatch): Promise<void> {
    if (
      this.batches.some(
        (value) => value.batchId === batch.batchId,
      )
    ) {
      return;
    }

    this.batches.push(batch);
    this.batches.sort(
      (a, b) =>
        a.ownerId.localeCompare(b.ownerId) ||
        a.toSequence - b.toSequence,
    );
  }

  async pull(
    ownerId: string,
    targetReplicaId: string,
    cursor: SyncCursor,
    limit: number,
  ) {
    const changes =
      this.batches
        .filter(
          (batch) =>
            batch.ownerId === ownerId &&
            batch.sourceReplicaId !== targetReplicaId,
        )
        .flatMap((batch) => batch.changes)
        .filter((change) => change.sequence > cursor.sequence)
        .sort((a, b) => a.sequence - b.sequence)
        .slice(0, limit);

    if (changes.length === 0) return undefined;

    return {
      batchId:
        `pull:${targetReplicaId}:${changes.at(-1)!.sequence}`,
      ownerId,
      sourceReplicaId:
        changes[0]!.replicaId,
      fromSequence:
        cursor.sequence,
      toSequence:
        changes.at(-1)!.sequence,
      changes,
      createdAt:
        changes.at(-1)!.occurredAt,
    };
  }
}
