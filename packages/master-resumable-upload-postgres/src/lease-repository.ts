import type {
  SqlExecutor,
  SqlRow,
} from "@knowledgeos/infrastructure-postgres";

export interface CompletionLease {
  readonly sessionId: string;
  readonly ownerId: string;
  readonly expiresAt: string;
}

export interface UploadCompletionLeaseRepository {
  tryAcquire(
    sessionId: string,
    ownerId: string,
    expiresAt: string,
  ): Promise<boolean>;
  renew(
    sessionId: string,
    ownerId: string,
    expiresAt: string,
  ): Promise<boolean>;
  release(
    sessionId: string,
    ownerId: string,
  ): Promise<void>;
  get(
    sessionId: string,
  ): Promise<CompletionLease | undefined>;
}

export class PostgresUploadCompletionLeaseRepository
implements UploadCompletionLeaseRepository {
  public constructor(
    private readonly sql: SqlExecutor,
  ) {}

  async tryAcquire(
    sessionId: string,
    ownerId: string,
    expiresAt: string,
  ): Promise<boolean> {
    const result = await this.sql.query<SqlRow>(
      `
        insert into master_upload_completion_leases (
          session_id,
          owner_id,
          expires_at
        ) values ($1, $2, $3)
        on conflict (session_id)
        do update set
          owner_id = excluded.owner_id,
          expires_at = excluded.expires_at
        where master_upload_completion_leases.expires_at < now()
        returning session_id
      `,
      [sessionId, ownerId, expiresAt],
    );

    return result.rowCount === 1;
  }

  async renew(
    sessionId: string,
    ownerId: string,
    expiresAt: string,
  ): Promise<boolean> {
    const result = await this.sql.query(
      `
        update master_upload_completion_leases
        set expires_at = $3
        where session_id = $1
          and owner_id = $2
      `,
      [sessionId, ownerId, expiresAt],
    );

    return result.rowCount === 1;
  }

  async release(
    sessionId: string,
    ownerId: string,
  ): Promise<void> {
    await this.sql.query(
      `
        delete from master_upload_completion_leases
        where session_id = $1
          and owner_id = $2
      `,
      [sessionId, ownerId],
    );
  }

  async get(
    sessionId: string,
  ): Promise<CompletionLease | undefined> {
    const result = await this.sql.query<SqlRow>(
      `
        select session_id,
               owner_id,
               expires_at
        from master_upload_completion_leases
        where session_id = $1
      `,
      [sessionId],
    );

    const row = result.rows[0];
    return row
      ? {
          sessionId: String(row.session_id),
          ownerId: String(row.owner_id),
          expiresAt: String(row.expires_at),
        }
      : undefined;
  }
}
