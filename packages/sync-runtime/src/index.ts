import type {
  SyncApplyResult,
  SyncBatch,
  SyncChange,
  SyncCursor,
  SyncTransport,
} from "@knowledgeos/sync-contracts";
import {
  SyncConflictDetector,
} from "@knowledgeos/sync-conflicts";
import {
  SyncBatchPlanner,
} from "@knowledgeos/sync-planner";

export interface SyncRuntimeRepository {
  appendChange(change: SyncChange): Promise<void>;
  listAfter(
    ownerId: string,
    replicaId: string,
    sequence: number,
    limit: number,
  ): Promise<readonly SyncChange[]>;
  saveCursor(
    ownerId: string,
    targetReplicaId: string,
    cursor: SyncCursor,
  ): Promise<void>;
  getCursor(
    ownerId: string,
    targetReplicaId: string,
    sourceReplicaId: string,
  ): Promise<SyncCursor>;
  saveConflict(
    conflict: import("@knowledgeos/sync-contracts").SyncConflict,
  ): Promise<void>;
}

export interface SyncChangeApplier {
  current(
    ownerId: string,
    entityId: string,
  ): Promise<SyncChange | undefined>;
  apply(change: SyncChange): Promise<void>;
}

export interface SyncRuntimeClock {
  nowIso(): string;
}

export class SyncRuntime {
  private readonly planner =
    new SyncBatchPlanner();

  constructor(
    private readonly repository:
      SyncRuntimeRepository,
    private readonly transport:
      SyncTransport,
    private readonly applier:
      SyncChangeApplier,
    private readonly clock:
      SyncRuntimeClock,
  ) {}

  async push(
    input: {
      readonly ownerId: string;
      readonly localReplicaId: string;
      readonly remoteReplicaId: string;
      readonly batchId: string;
      readonly limit: number;
    },
  ): Promise<SyncBatch | undefined> {
    const cursor =
      await this.repository.getCursor(
        input.ownerId,
        input.remoteReplicaId,
        input.localReplicaId,
      );

    const changes =
      await this.repository.listAfter(
        input.ownerId,
        input.localReplicaId,
        cursor.sequence,
        input.limit,
      );

    const batch =
      this.planner.plan({
        batchId: input.batchId,
        ownerId: input.ownerId,
        sourceReplicaId:
          input.localReplicaId,
        cursor,
        changes,
        limit: input.limit,
        createdAt: this.clock.nowIso(),
      });

    if (!batch) return undefined;

    await this.transport.push(batch);

    await this.repository.saveCursor(
      input.ownerId,
      input.remoteReplicaId,
      {
        replicaId:
          input.localReplicaId,
        sequence:
          batch.toSequence,
      },
    );

    return batch;
  }

  async pullAndApply(
    input: {
      readonly ownerId: string;
      readonly localReplicaId: string;
      readonly remoteReplicaId: string;
      readonly limit: number;
    },
  ): Promise<SyncApplyResult> {
    const cursor =
      await this.repository.getCursor(
        input.ownerId,
        input.localReplicaId,
        input.remoteReplicaId,
      );

    const batch =
      await this.transport.pull(
        input.ownerId,
        input.localReplicaId,
        cursor,
        input.limit,
      );

    if (!batch) {
      return {
        appliedChangeIds: [],
        skippedChangeIds: [],
        conflicts: [],
        cursor,
      };
    }

    const applied: string[] = [];
    const skipped: string[] = [];
    const conflicts:
      import("@knowledgeos/sync-contracts").SyncConflict[] = [];

    const detector =
      new SyncConflictDetector(
        this.clock,
      );

    for (const remote of batch.changes) {
      const local =
        await this.applier.current(
          remote.ownerId,
          remote.entityId,
        );

      const conflict =
        local
          ? detector.detect(
              local,
              remote,
            )
          : undefined;

      if (conflict) {
        await this.repository.saveConflict(
          conflict,
        );
        conflicts.push(conflict);
        skipped.push(remote.changeId);
        continue;
      }

      await this.applier.apply(remote);
      await this.repository.appendChange(remote);
      applied.push(remote.changeId);
    }

    const nextCursor = {
      replicaId:
        input.remoteReplicaId,
      sequence:
        batch.toSequence,
    };

    await this.repository.saveCursor(
      input.ownerId,
      input.localReplicaId,
      nextCursor,
    );

    return {
      appliedChangeIds: applied,
      skippedChangeIds: skipped,
      conflicts,
      cursor: nextCursor,
    };
  }
}
