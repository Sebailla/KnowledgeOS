import type {
  ContentFingerprint,
  KnowledgeObjectId,
  LocalLibraryId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  LocalPublicationRecord,
  LocalPublicationRepository,
} from "@knowledgeos/local-library";
import type {
  SqliteExecutor,
  SqliteRow,
} from "./contracts.js";

function fromRow(
  row: SqliteRow,
): LocalPublicationRecord {
  return {
    localLibraryId:
      row.local_library_id as LocalLibraryId,
    publicationId:
      row.publication_id as PublicationId,
    knowledgeObjectId:
      row.knowledge_object_id as KnowledgeObjectId,
    versionId:
      row.version_id as VersionId,
    sourceItemId:
      row.source_item_id as SourceItemId,
    title:
      String(row.title),
    mediaType:
      String(row.media_type),
    byteLength:
      Number(row.byte_length),
    contentFingerprint:
      row.content_fingerprint as ContentFingerprint,
    relativePath:
      String(row.relative_path),
    acquisitionStatus:
      row.acquisition_status as LocalPublicationRecord["acquisitionStatus"],
    readableOffline:
      Boolean(row.readable_offline),
    pinned:
      Boolean(row.pinned),
    ...(row.last_accessed_at == null
      ? {}
      : {
          lastAccessedAt:
            String(row.last_accessed_at),
        }),
    ...(row.acquired_at == null
      ? {}
      : {
          acquiredAt:
            String(row.acquired_at),
        }),
  };
}

export class SqliteLocalPublicationRepository
implements LocalPublicationRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async get(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
  ) {
    const result = await this.sql.execute<SqliteRow>(
      `
        select *
        from local_publications
        where local_library_id = ?
          and publication_id = ?
      `,
      [
        localLibraryId,
        publicationId,
      ],
    );
    const row = result.rows[0];
    return row ? fromRow(row) : undefined;
  }

  async getVersion(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
    versionId: VersionId,
  ) {
    const result = await this.sql.execute<SqliteRow>(
      `
        select *
        from local_publications
        where local_library_id = ?
          and publication_id = ?
          and version_id = ?
      `,
      [
        localLibraryId,
        publicationId,
        versionId,
      ],
    );
    const row = result.rows[0];
    return row ? fromRow(row) : undefined;
  }

  async save(
    value: LocalPublicationRecord,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into local_publications (
          local_library_id,
          publication_id,
          knowledge_object_id,
          version_id,
          source_item_id,
          title,
          media_type,
          byte_length,
          content_fingerprint,
          relative_path,
          acquisition_status,
          readable_offline,
          pinned,
          last_accessed_at,
          acquired_at
        ) values (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        on conflict(local_library_id, publication_id)
        do update set
          knowledge_object_id = excluded.knowledge_object_id,
          version_id = excluded.version_id,
          source_item_id = excluded.source_item_id,
          title = excluded.title,
          media_type = excluded.media_type,
          byte_length = excluded.byte_length,
          content_fingerprint = excluded.content_fingerprint,
          relative_path = excluded.relative_path,
          acquisition_status = excluded.acquisition_status,
          readable_offline = excluded.readable_offline,
          pinned = excluded.pinned,
          last_accessed_at = excluded.last_accessed_at,
          acquired_at = excluded.acquired_at
      `,
      [
        value.localLibraryId,
        value.publicationId,
        value.knowledgeObjectId,
        value.versionId,
        value.sourceItemId,
        value.title,
        value.mediaType,
        value.byteLength,
        value.contentFingerprint,
        value.relativePath,
        value.acquisitionStatus,
        value.readableOffline ? 1 : 0,
        value.pinned ? 1 : 0,
        value.lastAccessedAt ?? null,
        value.acquiredAt ?? null,
      ],
    );
  }

  async list(
    localLibraryId: LocalLibraryId,
  ) {
    const result = await this.sql.execute<SqliteRow>(
      `
        select *
        from local_publications
        where local_library_id = ?
        order by publication_id asc
      `,
      [localLibraryId],
    );
    return result.rows.map(fromRow);
  }

  async delete(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
  ): Promise<void> {
    await this.sql.execute(
      `
        delete from local_publications
        where local_library_id = ?
          and publication_id = ?
      `,
      [
        localLibraryId,
        publicationId,
      ],
    );
  }
}
