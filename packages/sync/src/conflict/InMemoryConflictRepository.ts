import type { SyncConflictRecord } from "./ConflictTypes.js";

export interface ConflictRepository {
  save(conflict: SyncConflictRecord): Promise<void>;
  get(id: string): Promise<SyncConflictRecord | undefined>;
  list(status?: SyncConflictRecord["status"]): Promise<readonly SyncConflictRecord[]>;
}

export class InMemoryConflictRepository implements ConflictRepository {
  private readonly records = new Map<string, SyncConflictRecord>();
  public async save(conflict: SyncConflictRecord): Promise<void> { this.records.set(conflict.id, conflict); }
  public async get(id: string): Promise<SyncConflictRecord | undefined> { return this.records.get(id); }
  public async list(status?: SyncConflictRecord["status"]): Promise<readonly SyncConflictRecord[]> {
    return [...this.records.values()].filter(c => status === undefined || c.status === status)
      .sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  }
}
