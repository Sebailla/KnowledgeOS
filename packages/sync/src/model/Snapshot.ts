import type { SyncRecord } from "./SyncRecord.js";
export interface Snapshot { readonly sourceId: string; readonly capturedAt: string; readonly records: readonly SyncRecord[]; }
