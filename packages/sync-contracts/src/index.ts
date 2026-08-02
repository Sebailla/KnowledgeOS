export type SyncChangeKind =
  | "object-upsert"
  | "object-delete"
  | "relationship-upsert"
  | "relationship-delete"
  | "asset-upsert"
  | "asset-delete";

export interface SyncCursor {
  readonly replicaId: string;
  readonly sequence: number;
}

export interface SyncChange {
  readonly changeId: string;
  readonly ownerId: string;
  readonly replicaId: string;
  readonly sequence: number;
  readonly kind: SyncChangeKind;
  readonly entityId: string;
  readonly version: number;
  readonly contentHash?: string;
  readonly payload:
    Readonly<Record<string, unknown>>;
  readonly occurredAt: string;
}

export interface SyncBatch {
  readonly batchId: string;
  readonly ownerId: string;
  readonly sourceReplicaId: string;
  readonly fromSequence: number;
  readonly toSequence: number;
  readonly changes: readonly SyncChange[];
  readonly createdAt: string;
}

export interface SyncConflict {
  readonly conflictId: string;
  readonly ownerId: string;
  readonly entityId: string;
  readonly localChange: SyncChange;
  readonly remoteChange: SyncChange;
  readonly reason:
    | "version-diverged"
    | "delete-update"
    | "hash-diverged"
    | "relationship-diverged";
  readonly detectedAt: string;
}

export interface SyncApplyResult {
  readonly appliedChangeIds: readonly string[];
  readonly skippedChangeIds: readonly string[];
  readonly conflicts: readonly SyncConflict[];
  readonly cursor: SyncCursor;
}

export interface SyncTransport {
  push(batch: SyncBatch): Promise<void>;
  pull(
    ownerId: string,
    targetReplicaId: string,
    cursor: SyncCursor,
    limit: number,
  ): Promise<SyncBatch | undefined>;
}
