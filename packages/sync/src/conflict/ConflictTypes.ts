import type { SyncEntityType, SyncOperation } from "../protocol/Types.js";

export type ConflictKind =
  | "version" | "sequence" | "checksum"
  | "delete-vs-update" | "concurrent-update";
export type ConflictStatus = "pending" | "resolved" | "ignored" | "merged";
export type ResolutionStrategy =
  | "last-write-wins" | "merge-bookmarks" | "merge-annotations"
  | "keep-local" | "keep-remote" | "manual" | "ignore";

export interface SyncConflictRecord {
  readonly id: string;
  readonly entityType: SyncEntityType;
  readonly entityId: string;
  readonly kind: ConflictKind;
  readonly status: ConflictStatus;
  readonly local: SyncOperation;
  readonly remote: SyncOperation;
  readonly suggestedStrategy: ResolutionStrategy;
  readonly createdAt: string;
  readonly resolvedAt?: string;
  readonly resolution?: ResolutionStrategy;
  readonly result?: unknown;
}

export interface ConflictPreview {
  readonly conflictId: string;
  readonly automatic: boolean;
  readonly strategy: ResolutionStrategy;
  readonly localPayload: unknown;
  readonly remotePayload: unknown;
  readonly mergedPayload?: unknown;
  readonly reason: string;
}
