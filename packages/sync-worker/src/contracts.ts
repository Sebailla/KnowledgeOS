export type SyncExecutionStatus =
  | "pending"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export interface PersistedSyncPlan {
  readonly planId: string;
  readonly status: SyncExecutionStatus;
  readonly transferIds: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PersistedSyncCheckpoint {
  readonly transferId: string;
  readonly planId: string;
  readonly receivedBytes: number;
  readonly totalBytes: number;
  readonly completed: boolean;
  readonly checksumVerified: boolean;
  readonly updatedAt: string;
}

export interface SyncPlanStore {
  getPlan(planId: string): Promise<PersistedSyncPlan | undefined>;
  savePlan(plan: PersistedSyncPlan): Promise<void>;
  getCheckpoint(
    transferId: string,
  ): Promise<PersistedSyncCheckpoint | undefined>;
  saveCheckpoint(
    checkpoint: PersistedSyncCheckpoint,
  ): Promise<void>;
}

export interface SyncPlanLease {
  tryAcquire(
    planId: string,
    ownerId: string,
    expiresAt: string,
  ): Promise<boolean>;
  renew(
    planId: string,
    ownerId: string,
    expiresAt: string,
  ): Promise<boolean>;
  release(
    planId: string,
    ownerId: string,
  ): Promise<void>;
}

export interface SyncTransferExecutor {
  execute(
    checkpoint: PersistedSyncCheckpoint,
    signal: AbortSignal,
  ): Promise<PersistedSyncCheckpoint>;
}

export interface SyncClock {
  nowIso(): string;
  nowMilliseconds(): number;
}
