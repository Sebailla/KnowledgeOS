export type SyncJobState = "queued" | "running" | "completed" | "failed" | "cancelled";
export interface SyncJob { readonly id: string; readonly createdAt: string; readonly state: SyncJobState; readonly attempts: number; readonly lastError?: string; }
