export type SearchMaintenanceJobKind =
  | "reindex"
  | "embed"
  | "optimize"
  | "cleanup"
  | "statistics"
  | "vacuum";

export interface SearchMaintenanceJob {
  readonly jobId: string;
  readonly kind: SearchMaintenanceJobKind;
  readonly priority: number;
  readonly scheduledAt: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export class SearchMaintenanceScheduler {
  private readonly jobs = new Map<string, SearchMaintenanceJob>();

  schedule(job: SearchMaintenanceJob): void {
    this.jobs.set(job.jobId, job);
  }

  cancel(jobId: string): boolean {
    return this.jobs.delete(jobId);
  }

  next(nowIso: string): SearchMaintenanceJob | undefined {
    return [...this.jobs.values()]
      .filter((job) => job.scheduledAt <= nowIso)
      .sort(
        (a, b) =>
          b.priority - a.priority ||
          a.scheduledAt.localeCompare(b.scheduledAt) ||
          a.jobId.localeCompare(b.jobId),
      )[0];
  }

  complete(jobId: string): void {
    this.jobs.delete(jobId);
  }

  size(): number {
    return this.jobs.size;
  }
}
