import type {
  SearchEmbeddingJob,
  SearchEmbeddingJobBatch,
  SearchEmbeddingJobRepository,
} from "@knowledgeos/search-embedding-jobs";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

function fromRow(
  row: SqliteRow,
): SearchEmbeddingJob {
  return {
    jobId:
      String(row.job_id),
    searchDocumentId:
      String(
        row.search_document_id,
      ),
    modelId:
      String(row.model_id),
    contentFingerprint:
      String(
        row.content_fingerprint,
      ),
    status:
      row.status as SearchEmbeddingJob["status"],
    attempts:
      Number(row.attempts),
    maximumAttempts:
      Number(
        row.maximum_attempts,
      ),
    priority:
      Number(row.priority),
    availableAt:
      String(row.available_at),
    createdAt:
      String(row.created_at),
    updatedAt:
      String(row.updated_at),
    ...(row.last_error == null
      ? {}
      : {
          lastError:
            String(row.last_error),
        }),
  };
}

export class SqliteSearchEmbeddingJobRepository
implements SearchEmbeddingJobRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async enqueue(
    jobs:
      readonly SearchEmbeddingJob[],
  ): Promise<void> {
    for (const job of jobs) {
      await this.sql.execute(
        `
          insert into search_embedding_jobs (
            job_id,
            search_document_id,
            model_id,
            content_fingerprint,
            status,
            attempts,
            maximum_attempts,
            priority,
            available_at,
            created_at,
            updated_at,
            last_error,
            lease_id,
            leased_until
          ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, null, null)
          on conflict(job_id) do nothing
        `,
        [
          job.jobId,
          job.searchDocumentId,
          job.modelId,
          job.contentFingerprint,
          job.status,
          job.attempts,
          job.maximumAttempts,
          job.priority,
          job.availableAt,
          job.createdAt,
          job.updatedAt,
          job.lastError ?? null,
        ],
      );
    }
  }

  async leaseBatch(
    modelId: string,
    limit: number,
    leaseId: string,
    leasedUntil: string,
    nowIso: string,
  ): Promise<SearchEmbeddingJobBatch> {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_embedding_jobs
          where model_id = ?
            and status = 'queued'
            and available_at <= ?
          order by priority desc, created_at asc
          limit ?
        `,
        [
          modelId,
          nowIso,
          limit,
        ],
      );

    const jobs =
      result.rows.map(fromRow);

    for (const job of jobs) {
      await this.sql.execute(
        `
          update search_embedding_jobs
          set
            status = 'running',
            attempts = attempts + 1,
            lease_id = ?,
            leased_until = ?,
            updated_at = ?
          where job_id = ?
            and status = 'queued'
        `,
        [
          leaseId,
          leasedUntil,
          nowIso,
          job.jobId,
        ],
      );
    }

    return {
      jobs:
        jobs.map(
          (job) => ({
            ...job,
            status:
              "running",
            attempts:
              job.attempts + 1,
            updatedAt:
              nowIso,
          }),
        ),
      leaseId,
      leasedUntil,
    };
  }

  async complete(
    jobId: string,
    updatedAt: string,
  ): Promise<void> {
    await this.sql.execute(
      `
        update search_embedding_jobs
        set
          status = 'completed',
          updated_at = ?,
          lease_id = null,
          leased_until = null
        where job_id = ?
      `,
      [
        updatedAt,
        jobId,
      ],
    );
  }

  async fail(
    jobId: string,
    error: string,
    availableAt: string,
    updatedAt: string,
  ): Promise<void> {
    await this.sql.execute(
      `
        update search_embedding_jobs
        set
          status = case
            when attempts >= maximum_attempts
            then 'failed'
            else 'queued'
          end,
          last_error = ?,
          available_at = ?,
          updated_at = ?,
          lease_id = null,
          leased_until = null
        where job_id = ?
      `,
      [
        error,
        availableAt,
        updatedAt,
        jobId,
      ],
    );
  }

  async cancel(
    jobId: string,
    updatedAt: string,
  ): Promise<void> {
    await this.sql.execute(
      `
        update search_embedding_jobs
        set
          status = 'cancelled',
          updated_at = ?,
          lease_id = null,
          leased_until = null
        where job_id = ?
      `,
      [
        updatedAt,
        jobId,
      ],
    );
  }

  async get(
    jobId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_embedding_jobs
          where job_id = ?
        `,
        [jobId],
      );

    const row =
      result.rows[0];

    return row
      ? fromRow(row)
      : undefined;
  }
}

export const searchEmbeddingJobsSqliteMigrations = [
  {
    id:
      "0008_search_embedding_jobs",
    sql: `
      create table if not exists search_embedding_jobs (
        job_id text primary key,
        search_document_id text not null,
        model_id text not null,
        content_fingerprint text not null,
        status text not null,
        attempts integer not null,
        maximum_attempts integer not null,
        priority integer not null,
        available_at text not null,
        created_at text not null,
        updated_at text not null,
        last_error text,
        lease_id text,
        leased_until text
      );

      create index if not exists idx_search_embedding_jobs_queue
        on search_embedding_jobs(
          model_id,
          status,
          available_at,
          priority,
          created_at
        );
    `,
  },
] as const;
