import type { SyncConflict } from "../model/SyncConflict.js";
import type { SyncRecord } from "../model/SyncRecord.js";
import type { SyncPolicy } from "../model/SyncPolicy.js";
export interface ConflictResolver { resolve(conflict: SyncConflict, policy: SyncPolicy): Promise<SyncRecord>; }
