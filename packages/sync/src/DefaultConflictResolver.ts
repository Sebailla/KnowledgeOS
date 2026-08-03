import type { ConflictResolver } from "./contracts/ConflictResolver.js";
import { SyncConflictError } from "./errors/SyncConflictError.js";
import type { SyncConflict } from "./model/SyncConflict.js";
import type { SyncPolicy } from "./model/SyncPolicy.js";
import type { SyncRecord } from "./model/SyncRecord.js";
export class DefaultConflictResolver implements ConflictResolver {
 public async resolve(conflict: SyncConflict, policy: SyncPolicy): Promise<SyncRecord> {
  if(policy.sourceOfTruth==='remote')return conflict.remote; if(policy.sourceOfTruth==='local')return conflict.local;
  throw new SyncConflictError(`Conflict '${conflict.recordId}' requires manual resolution.`);
 }
}
