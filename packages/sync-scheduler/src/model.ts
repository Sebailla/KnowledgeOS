export type ScheduledSyncStatus =
  | "queued"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export interface ScheduledSyncJob {
  readonly jobId: string;
  readonly planId: string;
  readonly priority: number;
  readonly enqueuedAt: string;
  readonly status: ScheduledSyncStatus;
  readonly attempts: number;
}

export interface RetryPolicy {
  readonly maximumAttempts: number;
  readonly initialDelayMilliseconds: number;
  readonly maximumDelayMilliseconds: number;
  readonly multiplier: number;
}

export interface RetryDecision {
  readonly retry: boolean;
  readonly delayMilliseconds: number;
}
