import type { SyncRecord } from "./SyncRecord.js";
export interface SyncConflict {
 readonly recordId: string; readonly local: SyncRecord; readonly remote: SyncRecord;
 readonly reason: "divergent-update" | "delete-update" | "checksum-mismatch";
}
