import type { SyncSession } from "./SyncSession.js";
export interface SyncProvider { readonly id: string; openSession(): Promise<SyncSession>; close(): Promise<void>; }
