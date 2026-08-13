import type { SqlClient } from "./client.js";

let leaseSequence = 0;

function nextLeaseId(workerId: string, now: Date): string {
  leaseSequence += 1;
  return `${workerId}:${now.getTime()}:${leaseSequence}`;
}

export type ProcessingJobState = "queued" | "leased" | "completed";

export interface ProcessingJobRequest {
  readonly operationId: string;
  readonly correlationId: string;
  readonly publicationId: string;
  readonly versionId: string;
}

export interface ProcessingJob extends ProcessingJobRequest {
  readonly state: ProcessingJobState;
  readonly checkpoint?: string;
  readonly leaseId?: string;
  readonly leaseOwner?: string;
  readonly leaseExpiresAt?: string;
}

export class InvalidProcessingTransitionError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidProcessingTransitionError";
  }
}

function leased(
  job: ProcessingJob,
  leaseId: string,
  now: Date,
): ProcessingJob {
  if (
    job.state !== "leased" ||
    job.leaseId !== leaseId ||
    !job.leaseExpiresAt ||
    new Date(job.leaseExpiresAt) <= now
  ) {
    throw new InvalidProcessingTransitionError(
      "The processing lease is no longer active.",
    );
  }
  return job;
}

export class InMemoryLeasedJobRepository {
  private readonly jobs = new Map<string, ProcessingJob>();

  public async enqueue(request: ProcessingJobRequest): Promise<ProcessingJob> {
    const existing = this.jobs.get(request.operationId);
    if (existing) return existing;

    const job: ProcessingJob = { ...request, state: "queued" };
    this.jobs.set(job.operationId, job);
    return job;
  }

  public async claim(
    workerId: string,
    now: Date,
    leaseDurationMilliseconds: number,
  ): Promise<ProcessingJob | undefined> {
    for (const job of this.jobs.values()) {
      const expired =
        job.state === "leased" &&
        job.leaseExpiresAt !== undefined &&
        new Date(job.leaseExpiresAt) <= now;
      if (job.state !== "queued" && !expired) continue;

      const claimed: ProcessingJob = {
        ...job,
        state: "leased",
        leaseId: nextLeaseId(workerId, now),
        leaseOwner: workerId,
        leaseExpiresAt: new Date(
          now.getTime() + leaseDurationMilliseconds,
        ).toISOString(),
      };
      this.jobs.set(claimed.operationId, claimed);
      return claimed;
    }
    return undefined;
  }

  public async checkpoint(
    leaseId: string,
    checkpoint: string,
    now: Date,
  ): Promise<ProcessingJob> {
    const current = this.findByLease(leaseId);
    const active = leased(current, leaseId, now);
    const updated = { ...active, checkpoint };
    this.jobs.set(updated.operationId, updated);
    return updated;
  }

  public async complete(leaseId: string, now: Date): Promise<ProcessingJob> {
    const current = this.findByLease(leaseId);
    const active = leased(current, leaseId, now);
    const { leaseId: _leaseId, leaseOwner: _leaseOwner, leaseExpiresAt: _leaseExpiresAt, ...rest } = active;
    const completed: ProcessingJob = { ...rest, state: "completed" };
    this.jobs.set(completed.operationId, completed);
    return completed;
  }

  private findByLease(leaseId: string): ProcessingJob {
    for (const job of this.jobs.values()) {
      if (job.leaseId === leaseId) return job;
    }
    throw new InvalidProcessingTransitionError("The processing lease was not found.");
  }
}

interface ProcessingJobRow {
  readonly operation_id: string;
  readonly correlation_id: string;
  readonly publication_id: string;
  readonly version_id: string;
  readonly state: ProcessingJobState;
  readonly checkpoint: string | null;
  readonly lease_id: string | null;
  readonly lease_owner: string | null;
  readonly lease_expires_at: Date | string | null;
}

function fromRow(row: ProcessingJobRow): ProcessingJob {
  return {
    operationId: row.operation_id,
    correlationId: row.correlation_id,
    publicationId: row.publication_id,
    versionId: row.version_id,
    state: row.state,
    ...(row.checkpoint ? { checkpoint: row.checkpoint } : {}),
    ...(row.lease_id ? { leaseId: row.lease_id } : {}),
    ...(row.lease_owner ? { leaseOwner: row.lease_owner } : {}),
    ...(row.lease_expires_at
      ? { leaseExpiresAt: new Date(row.lease_expires_at).toISOString() }
      : {}),
  };
}

export class PostgresLeasedJobRepository {
  public constructor(private readonly client: SqlClient) {}

  public async enqueue(request: ProcessingJobRequest): Promise<ProcessingJob> {
    await this.client.query(
      "INSERT INTO master_processing_jobs (operation_id, correlation_id, publication_id, version_id, state) VALUES ($1, $2, $3, $4, 'queued') ON CONFLICT (operation_id) DO NOTHING",
      [request.operationId, request.correlationId, request.publicationId, request.versionId],
    );
    const result = await this.client.query<ProcessingJobRow>(
      "SELECT operation_id, correlation_id, publication_id, version_id, state, checkpoint, lease_id, lease_owner, lease_expires_at FROM master_processing_jobs WHERE operation_id = $1",
      [request.operationId],
    );
    const row = result.rows[0];
    if (!row) throw new Error("Processing job was not persisted.");
    return fromRow(row);
  }

  public async claim(workerId: string, now: Date, leaseDurationMilliseconds: number): Promise<ProcessingJob | undefined> {
    const leaseId = nextLeaseId(workerId, now);
    const leaseExpiresAt = new Date(now.getTime() + leaseDurationMilliseconds);
    const result = await this.client.query<ProcessingJobRow>(
      "WITH candidate AS (SELECT operation_id FROM master_processing_jobs WHERE state = 'queued' OR (state = 'leased' AND lease_expires_at <= $1) ORDER BY created_at, operation_id FOR UPDATE SKIP LOCKED LIMIT 1) UPDATE master_processing_jobs AS job SET state = 'leased', lease_id = $2, lease_owner = $3, lease_expires_at = $4, updated_at = $1 FROM candidate WHERE job.operation_id = candidate.operation_id RETURNING job.operation_id, job.correlation_id, job.publication_id, job.version_id, job.state, job.checkpoint, job.lease_id, job.lease_owner, job.lease_expires_at",
      [now, leaseId, workerId, leaseExpiresAt],
    );
    const row = result.rows[0];
    return row ? fromRow(row) : undefined;
  }

  public async checkpoint(leaseId: string, checkpoint: string, now: Date): Promise<ProcessingJob> {
    return this.transition(
      "UPDATE master_processing_jobs SET checkpoint = $1, updated_at = $2 WHERE lease_id = $3 AND state = 'leased' AND lease_expires_at > $2 RETURNING operation_id, correlation_id, publication_id, version_id, state, checkpoint, lease_id, lease_owner, lease_expires_at",
      [checkpoint, now, leaseId],
    );
  }

  public async complete(leaseId: string, now: Date): Promise<ProcessingJob> {
    return this.transition(
      "UPDATE master_processing_jobs SET state = 'completed', lease_id = NULL, lease_owner = NULL, lease_expires_at = NULL, updated_at = $1 WHERE lease_id = $2 AND state = 'leased' AND lease_expires_at > $1 RETURNING operation_id, correlation_id, publication_id, version_id, state, checkpoint, lease_id, lease_owner, lease_expires_at",
      [now, leaseId],
    );
  }

  private async transition(query: string, values: readonly unknown[]): Promise<ProcessingJob> {
    const result = await this.client.query<ProcessingJobRow>(query, values);
    const row = result.rows[0];
    if (!row) {
      throw new InvalidProcessingTransitionError(
        "The processing lease is not active for this transition.",
      );
    }
    return fromRow(row);
  }
}

export interface ProcessingJobHandler {
  process(job: ProcessingJob): Promise<void>;
}

export class LeasedProcessingWorker {
  public constructor(
    private readonly jobs: Pick<PostgresLeasedJobRepository, "claim" | "complete">,
    private readonly handler: ProcessingJobHandler,
  ) {}

  public async recover(workerId: string, now: Date, leaseDurationMilliseconds: number): Promise<boolean> {
    const job = await this.jobs.claim(workerId, now, leaseDurationMilliseconds);
    if (!job) return false;
    await this.handler.process(job);
    await this.jobs.complete(job.leaseId!, now);
    return true;
  }
}
