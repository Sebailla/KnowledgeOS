export interface SyncRecord {
  readonly id: string; readonly version: number; readonly checksum: string;
  readonly modifiedAt: string; readonly deleted: boolean;
  readonly payload: Readonly<Record<string, unknown>>;
}
