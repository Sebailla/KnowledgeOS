import type {
  SyncChange,
  SyncConflict,
} from "@knowledgeos/sync-contracts";

export interface SyncConflictClock {
  nowIso(): string;
}

export class SyncConflictDetector {
  constructor(
    private readonly clock: SyncConflictClock,
  ) {}

  detect(
    local: SyncChange,
    remote: SyncChange,
  ): SyncConflict | undefined {
    if (
      local.ownerId !== remote.ownerId ||
      local.entityId !== remote.entityId
    ) {
      return undefined;
    }

    const deleteKinds = new Set([
      "object-delete",
      "relationship-delete",
      "asset-delete",
    ]);

    let reason: SyncConflict["reason"] | undefined;

    if (
      deleteKinds.has(local.kind) !==
      deleteKinds.has(remote.kind)
    ) {
      reason = "delete-update";
    } else if (
      local.version === remote.version &&
      local.contentHash &&
      remote.contentHash &&
      local.contentHash !== remote.contentHash
    ) {
      reason = "hash-diverged";
    } else if (
      local.version !== remote.version &&
      local.replicaId !== remote.replicaId
    ) {
      reason = "version-diverged";
    } else if (
      local.kind.startsWith("relationship") &&
      remote.kind.startsWith("relationship") &&
      JSON.stringify(local.payload) !== JSON.stringify(remote.payload)
    ) {
      reason = "relationship-diverged";
    }

    if (!reason) return undefined;

    return {
      conflictId:
        `conflict:${local.changeId}:${remote.changeId}`,
      ownerId: local.ownerId,
      entityId: local.entityId,
      localChange: local,
      remoteChange: remote,
      reason,
      detectedAt: this.clock.nowIso(),
    };
  }
}

export class LastWriterWinsResolver {
  resolve(
    conflict: SyncConflict,
  ): SyncChange {
    return [
      conflict.localChange,
      conflict.remoteChange,
    ].sort(
      (a, b) =>
        b.occurredAt.localeCompare(a.occurredAt) ||
        b.sequence - a.sequence ||
        a.replicaId.localeCompare(b.replicaId),
    )[0]!;
  }
}
