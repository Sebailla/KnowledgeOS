import type {
  ScheduledSyncJob,
} from "./model.js";
import {
  AsyncSemaphore,
} from "./semaphore.js";

export interface SyncJobExecutor {
  execute(
    planId: string,
  ): Promise<void>;
}

export class SyncScheduler {
  private readonly jobs =
    new Map<string, ScheduledSyncJob>();
  private readonly semaphore:
    AsyncSemaphore;

  public constructor(
    maximumConcurrency: number,
    private readonly executor:
      SyncJobExecutor,
  ) {
    this.semaphore =
      new AsyncSemaphore(
        maximumConcurrency,
      );
  }

  enqueue(
    job: ScheduledSyncJob,
  ): void {
    const existing =
      this.jobs.get(job.jobId);

    if (
      existing &&
      existing.status !== "failed" &&
      existing.status !== "cancelled"
    ) {
      return;
    }

    this.jobs.set(
      job.jobId,
      job,
    );
  }

  pause(jobId: string): void {
    const job =
      this.jobs.get(jobId);
    if (!job) return;

    this.jobs.set(jobId, {
      ...job,
      status: "paused",
    });
  }

  cancel(jobId: string): void {
    const job =
      this.jobs.get(jobId);
    if (!job) return;

    this.jobs.set(jobId, {
      ...job,
      status: "cancelled",
    });
  }

  list(): readonly ScheduledSyncJob[] {
    return [
      ...this.jobs.values(),
    ].sort(
      (a, b) =>
        b.priority - a.priority ||
        a.enqueuedAt.localeCompare(
          b.enqueuedAt,
        ),
    );
  }

  async drain(): Promise<void> {
    const runnable =
      this.list().filter(
        (job) =>
          job.status === "queued",
      );

    await Promise.all(
      runnable.map(
        async (job) => {
          const release =
            await this.semaphore.acquire();

          try {
            const current =
              this.jobs.get(job.jobId);

            if (
              !current ||
              current.status !== "queued"
            ) {
              return;
            }

            this.jobs.set(
              job.jobId,
              {
                ...current,
                status: "running",
                attempts:
                  current.attempts + 1,
              },
            );

            await this.executor.execute(
              current.planId,
            );

            const latest =
              this.jobs.get(job.jobId);

            if (
              latest?.status ===
              "running"
            ) {
              this.jobs.set(
                job.jobId,
                {
                  ...latest,
                  status: "completed",
                },
              );
            }
          } catch {
            const latest =
              this.jobs.get(job.jobId);
            if (latest) {
              this.jobs.set(
                job.jobId,
                {
                  ...latest,
                  status: "failed",
                },
              );
            }
          } finally {
            release();
          }
        },
      ),
    );
  }
}
