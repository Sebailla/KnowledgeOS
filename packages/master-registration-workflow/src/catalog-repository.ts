import type {
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  MasterStorageCatalog,
  StoredPublicationObject,
} from "@knowledgeos/master-storage";
import type {
  SqlExecutor,
  SqlRow,
} from "@knowledgeos/infrastructure-postgres";

function fromRow(row: SqlRow): StoredPublicationObject {
  return {
    publicationId: row.publication_id as PublicationId,
    versionId: row.version_id as VersionId,
    sourceItemId: row.source_item_id as SourceItemId,
    contentFingerprint:
      row.content_fingerprint as StoredPublicationObject["contentFingerprint"],
    byteLength: Number(row.byte_length),
    relativePath: String(row.relative_path),
    mediaType: String(row.media_type),
  };
}

export class PostgresMasterStorageCatalog
implements MasterStorageCatalog {
  public constructor(private readonly sql: SqlExecutor) {}

  async save(
    value: StoredPublicationObject,
  ): Promise<void> {
    await this.sql.query(
      `
        insert into master_storage_objects (
          publication_id,
          version_id,
          source_item_id,
          content_fingerprint,
          byte_length,
          relative_path,
          media_type
        ) values ($1, $2, $3, $4, $5, $6, $7)
        on conflict (publication_id, version_id)
        do update set
          source_item_id = excluded.source_item_id,
          content_fingerprint = excluded.content_fingerprint,
          byte_length = excluded.byte_length,
          relative_path = excluded.relative_path,
          media_type = excluded.media_type,
          updated_at = now()
      `,
      [
        value.publicationId,
        value.versionId,
        value.sourceItemId,
        value.contentFingerprint,
        value.byteLength,
        value.relativePath,
        value.mediaType,
      ],
    );
  }

  async getByVersion(
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<StoredPublicationObject | undefined> {
    const result = await this.sql.query<SqlRow>(
      `
        select publication_id,
               version_id,
               source_item_id,
               content_fingerprint,
               byte_length,
               relative_path,
               media_type
        from master_storage_objects
        where publication_id = $1
          and version_id = $2
      `,
      [publicationId, versionId],
    );
    const row = result.rows[0];
    return row ? fromRow(row) : undefined;
  }

  async getBySourceItem(
    sourceItemId: SourceItemId,
  ): Promise<StoredPublicationObject | undefined> {
    const result = await this.sql.query<SqlRow>(
      `
        select publication_id,
               version_id,
               source_item_id,
               content_fingerprint,
               byte_length,
               relative_path,
               media_type
        from master_storage_objects
        where source_item_id = $1
      `,
      [sourceItemId],
    );
    const row = result.rows[0];
    return row ? fromRow(row) : undefined;
  }

  async listAll(): Promise<readonly StoredPublicationObject[]> {
    const result = await this.sql.query<SqlRow>(
      `
        select publication_id,
               version_id,
               source_item_id,
               content_fingerprint,
               byte_length,
               relative_path,
               media_type
        from master_storage_objects
        order by publication_id, version_id
      `,
    );
    return result.rows.map(fromRow);
  }

  async deleteByVersion(
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<void> {
    await this.sql.query(
      `
        delete from master_storage_objects
        where publication_id = $1
          and version_id = $2
      `,
      [publicationId, versionId],
    );
  }
}
