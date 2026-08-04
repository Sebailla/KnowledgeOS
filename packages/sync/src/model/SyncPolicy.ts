export interface SyncPolicy { readonly sourceOfTruth: "remote" | "local" | "manual"; readonly maxAttempts: number; readonly retryDelayMilliseconds: number; readonly batchSize: number; }
export const defaultSyncPolicy: SyncPolicy = { sourceOfTruth: "remote", maxAttempts: 3, retryDelayMilliseconds: 0, batchSize: 100 };
