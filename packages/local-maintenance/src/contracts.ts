export interface LocalMaintenanceTaskResult {
  readonly task:
    | "integrity"
    | "repair"
    | "cache"
    | "checkpoint";
  readonly status:
    | "completed"
    | "skipped"
    | "failed";
  readonly details:
    Readonly<Record<string, unknown>>;
}

export interface LocalMaintenanceClock {
  nowIso(): string;
}
