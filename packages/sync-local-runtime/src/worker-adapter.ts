import type {
  PersistedSyncCheckpoint,
  SyncTransferExecutor,
} from "@knowledgeos/sync-worker";
import type {
  SyncToLocalTransferExecutor,
} from "./executor.js";

export class SyncWorkerLocalTransferAdapter
implements SyncTransferExecutor {
  public constructor(
    private readonly executor:
      SyncToLocalTransferExecutor,
  ) {}

  async execute(
    checkpoint:
      PersistedSyncCheckpoint,
    signal:
      AbortSignal,
  ): Promise<PersistedSyncCheckpoint> {
    const result =
      await this.executor.execute(
        checkpoint.transferId,
        signal,
      );

    return {
      ...checkpoint,
      receivedBytes:
        result.receivedBytes,
      totalBytes:
        result.totalBytes,
      completed:
        result.completed,
      checksumVerified:
        result.checksumVerified,
      updatedAt:
        new Date().toISOString(),
    };
  }
}
