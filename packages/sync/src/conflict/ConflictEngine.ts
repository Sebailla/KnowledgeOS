import type { SyncOperation } from "../protocol/Types.js";
import type { ConflictRepository } from "./InMemoryConflictRepository.js";
import type { ConflictPreview, ResolutionStrategy, SyncConflictRecord } from "./ConflictTypes.js";

export class ConflictEngine {
  public constructor(private readonly repository: ConflictRepository, private readonly now: () => string = () => new Date().toISOString()) {}

  public async detect(local: SyncOperation, remote: SyncOperation): Promise<SyncConflictRecord | undefined> {
    if (local.entityId !== remote.entityId || local.entityType !== remote.entityType) return undefined;
    if (local.checksum === remote.checksum) return undefined;
    const kind = local.operationType === "delete" || remote.operationType === "delete"
      ? "delete-vs-update" : local.sequence === remote.sequence ? "concurrent-update" : "sequence";
    const suggestedStrategy = strategyFor(local.entityType);
    const conflict: SyncConflictRecord = {
      id: `conflict:${local.operationId}:${remote.operationId}`,
      entityType: local.entityType,
      entityId: local.entityId,
      kind,
      status: "pending",
      local,
      remote,
      suggestedStrategy,
      createdAt: this.now(),
    };
    await this.repository.save(conflict);
    return conflict;
  }

  public async preview(id: string): Promise<ConflictPreview> {
    const conflict = await this.require(id);
    const strategy = conflict.suggestedStrategy;
    const mergedPayload = merge(strategy, conflict.local.payload, conflict.remote.payload);
    return {
      conflictId: id,
      automatic: strategy !== "manual",
      strategy,
      localPayload: conflict.local.payload,
      remotePayload: conflict.remote.payload,
      ...(mergedPayload !== undefined ? { mergedPayload } : {}),
      reason: reasonFor(conflict.entityType, strategy),
    };
  }

  public async resolve(id: string, strategy?: ResolutionStrategy): Promise<SyncConflictRecord> {
    const conflict = await this.require(id);
    if (conflict.status !== "pending") return conflict;
    const selected = strategy ?? conflict.suggestedStrategy;
    const result = merge(selected, conflict.local.payload, conflict.remote.payload);
    const resolved: SyncConflictRecord = {
      ...conflict,
      status: selected.startsWith("merge-") ? "merged" : selected === "ignore" ? "ignored" : "resolved",
      resolution: selected,
      resolvedAt: this.now(),
      ...(result !== undefined ? { result } : {}),
    };
    await this.repository.save(resolved);
    return resolved;
  }

  public async ignore(id: string): Promise<SyncConflictRecord> { return this.resolve(id, "ignore"); }
  public list(status?: SyncConflictRecord["status"]) { return this.repository.list(status); }
  public get(id: string) { return this.repository.get(id); }

  private async require(id: string): Promise<SyncConflictRecord> {
    const conflict = await this.repository.get(id);
    if (!conflict) throw new Error(`Conflict '${id}' was not found.`);
    return conflict;
  }
}

function strategyFor(type: SyncOperation["entityType"]): ResolutionStrategy {
  switch (type) {
    case "reading-position": return "last-write-wins";
    case "bookmark": return "merge-bookmarks";
    case "annotation": return "merge-annotations";
    default: return "manual";
  }
}
function reasonFor(type: SyncOperation["entityType"], strategy: ResolutionStrategy): string {
  if (type === "reading-position") return "Reading position is ephemeral and safely resolved by timestamp.";
  if (strategy === "merge-bookmarks") return "Bookmark payloads are set-like and can be unioned.";
  if (strategy === "merge-annotations") return "Non-overlapping annotation fields can be merged; overlapping fields prefer remote.";
  return "This entity requires an explicit user decision.";
}
function asRecord(value: unknown): Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string,unknown> : {}; }
function merge(strategy: ResolutionStrategy, local: unknown, remote: unknown): unknown {
  switch (strategy) {
    case "last-write-wins": return remote;
    case "keep-local": return local;
    case "keep-remote": return remote;
    case "merge-bookmarks": {
      const l = Array.isArray(local) ? local : [local]; const r = Array.isArray(remote) ? remote : [remote];
      return [...new Map([...l,...r].map(v => [JSON.stringify(v),v])).values()];
    }
    case "merge-annotations": return { ...asRecord(local), ...asRecord(remote) };
    case "manual": case "ignore": return undefined;
  }
}
