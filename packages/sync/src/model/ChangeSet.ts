import type { SyncRecord } from "./SyncRecord.js";
export interface ChangeSet { readonly created: readonly SyncRecord[]; readonly updated: readonly SyncRecord[]; readonly deleted: readonly SyncRecord[]; }
