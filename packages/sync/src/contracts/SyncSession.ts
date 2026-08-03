import type { Snapshot } from "../model/Snapshot.js";
import type { ChangeSet } from "../model/ChangeSet.js";
export interface SyncSession { captureLocal(): Promise<Snapshot>; captureRemote(): Promise<Snapshot>; applyLocal(changes: ChangeSet): Promise<void>; applyRemote(changes: ChangeSet): Promise<void>; close(): Promise<void>; }
