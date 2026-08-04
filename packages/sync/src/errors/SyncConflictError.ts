import { SyncError } from "./SyncError.js";
export class SyncConflictError extends SyncError {
  public constructor(message: string) { super(message, "SYNC_CONFLICT"); }
}
