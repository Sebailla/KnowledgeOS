import type {
  SqlExecutor,
  SqlRow,
} from "@knowledgeos/infrastructure-postgres";

export interface UploadCompletionRecord {
  readonly sessionId: string;
  readonly publicationId: string;
  readonly versionId: string;
  readonly completedAt: string;
}

export interface UploadCompletionRepository {
  get(
    sessionId: string,
  ): Promise<UploadCompletionRecord | undefined>;
  save(
    record: UploadCompletionRecord,
  ): Promise<void>;
}

export class PostgresUploadCompletionRepository
implements UploadCompletionRepository {
  public constructor(
    private readonly sql: SqlExecutor,
  ) {}

  async get(
    sessionId: string,
  ): Promise<UploadCompletionRecord | undefined> {
    const result = await this.sql.query<SqlRow>(
      `
        select session_id,
               publication_id,
               version_id,
               completed_at
        from master_upload_completions
        where session_id = $1
      `,
      [sessionId],
    );

    const row = result.rows[0];
    return row
      ? {
          sessionId: String(row.session_id),
          publicationId: String(row.publication_id),
          versionId: String(row.version_id),
          completedAt: String(row.completed_at),
        }
      : undefined;
  }

  async save(
    record: UploadCompletionRecord,
  ): Promise<void> {
    await this.sql.query(
      `
        insert into master_upload_completions (
          session_id,
          publication_id,
          version_id,
          completed_at
        ) values ($1, $2, $3, $4)
        on conflict (session_id)
        do nothing
      `,
      [
        record.sessionId,
        record.publicationId,
        record.versionId,
        record.completedAt,
      ],
    );
  }
}
