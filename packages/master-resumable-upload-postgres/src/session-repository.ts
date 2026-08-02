import type {
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  UploadChunkRecord,
  UploadSession,
  UploadSessionStore,
} from "@knowledgeos/master-resumable-upload";
import type {
  SqlExecutor,
  SqlRow,
} from "@knowledgeos/infrastructure-postgres";

function sessionFromRow(row: SqlRow): UploadSession {
  return {
    sessionId: String(row.session_id),
    status: row.status as UploadSession["status"],
    metadata:
      row.metadata as UploadSession["metadata"],
    chunks: Array.isArray(row.chunks)
      ? row.chunks as readonly UploadChunkRecord[]
      : [],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    ...(row.completed_publication_id === null ||
    row.completed_publication_id === undefined
      ? {}
      : {
          completedPublicationId:
            row.completed_publication_id as PublicationId,
        }),
    ...(row.completed_version_id === null ||
    row.completed_version_id === undefined
      ? {}
      : {
          completedVersionId:
            row.completed_version_id as VersionId,
        }),
  };
}

export interface ChunkBlobStore {
  saveChunk(
    sessionId: string,
    index: number,
    bytes: Uint8Array,
  ): Promise<string>;
  readChunk(
    sessionId: string,
    index: number,
  ): Promise<Uint8Array>;
  deleteSession(sessionId: string): Promise<void>;
}

export class PostgresUploadSessionStore
implements UploadSessionStore {
  public constructor(
    private readonly sql: SqlExecutor,
    private readonly blobs: ChunkBlobStore,
  ) {}

  async create(session: UploadSession): Promise<void> {
    await this.sql.query(
      `
        insert into master_upload_sessions (
          session_id,
          status,
          metadata,
          chunks,
          created_at,
          updated_at,
          completed_publication_id,
          completed_version_id
        ) values (
          $1, $2, $3::jsonb, $4::jsonb, $5, $6, $7, $8
        )
      `,
      [
        session.sessionId,
        session.status,
        JSON.stringify(session.metadata),
        JSON.stringify(session.chunks),
        session.createdAt,
        session.updatedAt,
        session.completedPublicationId ?? null,
        session.completedVersionId ?? null,
      ],
    );
  }

  async get(
    sessionId: string,
  ): Promise<UploadSession | undefined> {
    const result = await this.sql.query<SqlRow>(
      `
        select session_id,
               status,
               metadata,
               chunks,
               created_at,
               updated_at,
               completed_publication_id,
               completed_version_id
        from master_upload_sessions
        where session_id = $1
      `,
      [sessionId],
    );

    const row = result.rows[0];
    return row ? sessionFromRow(row) : undefined;
  }

  async save(session: UploadSession): Promise<void> {
    await this.sql.query(
      `
        update master_upload_sessions
        set status = $2,
            metadata = $3::jsonb,
            chunks = $4::jsonb,
            updated_at = $5,
            completed_publication_id = $6,
            completed_version_id = $7
        where session_id = $1
      `,
      [
        session.sessionId,
        session.status,
        JSON.stringify(session.metadata),
        JSON.stringify(session.chunks),
        session.updatedAt,
        session.completedPublicationId ?? null,
        session.completedVersionId ?? null,
      ],
    );
  }

  async saveChunk(
    sessionId: string,
    record: UploadChunkRecord,
    bytes: Uint8Array,
  ): Promise<void> {
    const path = await this.blobs.saveChunk(
      sessionId,
      record.index,
      bytes,
    );

    await this.sql.query(
      `
        insert into master_upload_chunks (
          session_id,
          chunk_index,
          byte_length,
          checksum,
          storage_path
        ) values ($1, $2, $3, $4, $5)
        on conflict (session_id, chunk_index)
        do update set
          byte_length = excluded.byte_length,
          checksum = excluded.checksum,
          storage_path = excluded.storage_path
      `,
      [
        sessionId,
        record.index,
        record.byteLength,
        record.checksum,
        path,
      ],
    );
  }

  async readChunk(
    sessionId: string,
    index: number,
  ): Promise<Uint8Array> {
    return this.blobs.readChunk(sessionId, index);
  }

  async delete(sessionId: string): Promise<void> {
    await this.blobs.deleteSession(sessionId);
    await this.sql.query(
      `
        delete from master_upload_sessions
        where session_id = $1
      `,
      [sessionId],
    );
  }

  async list(): Promise<readonly UploadSession[]> {
    const result = await this.sql.query<SqlRow>(
      `
        select session_id,
               status,
               metadata,
               chunks,
               created_at,
               updated_at,
               completed_publication_id,
               completed_version_id
        from master_upload_sessions
        order by created_at asc
      `,
    );

    return result.rows.map(sessionFromRow);
  }
}
