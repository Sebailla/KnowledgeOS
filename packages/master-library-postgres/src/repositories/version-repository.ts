import type {
  ContentFingerprint,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  FingerprintIndex,
  MasterPublicationVersion,
  MasterPublicationVersionRepository,
} from "@knowledgeos/master-library";
import type {
  SqlExecutor,
  SqlRow,
} from "@knowledgeos/infrastructure-postgres";
import { versionFromRow } from "../row-mappers.js";

export class PostgresMasterPublicationVersionRepository
implements MasterPublicationVersionRepository, FingerprintIndex {
  public constructor(private readonly sql: SqlExecutor) {}

  async get(
    id: VersionId,
  ): Promise<MasterPublicationVersion | undefined> {
    const result = await this.sql.query<SqlRow>(
      `
        select version_id,
               publication_id,
               sequence,
               source_item_id,
               content_fingerprint,
               parent_version_ids,
               label
        from master_publication_versions
        where version_id = $1
      `,
      [id],
    );
    const row = result.rows[0];
    return row ? versionFromRow(row) : undefined;
  }

  async listByPublication(
    id: PublicationId,
  ): Promise<readonly MasterPublicationVersion[]> {
    const result = await this.sql.query<SqlRow>(
      `
        select version_id,
               publication_id,
               sequence,
               source_item_id,
               content_fingerprint,
               parent_version_ids,
               label
        from master_publication_versions
        where publication_id = $1
        order by sequence asc
      `,
      [id],
    );
    return result.rows.map(versionFromRow);
  }

  async save(
    value: MasterPublicationVersion,
  ): Promise<void> {
    await this.sql.query(
      `
        insert into master_publication_versions (
          version_id,
          publication_id,
          sequence,
          source_item_id,
          content_fingerprint,
          parent_version_ids,
          label
        ) values (
          $1, $2, $3, $4, $5, $6::jsonb, $7
        )
        on conflict (version_id)
        do update set
          sequence = excluded.sequence,
          source_item_id = excluded.source_item_id,
          content_fingerprint = excluded.content_fingerprint,
          parent_version_ids = excluded.parent_version_ids,
          label = excluded.label
      `,
      [
        value.versionId,
        value.publicationId,
        value.sequence,
        value.sourceItemId,
        value.contentFingerprint,
        JSON.stringify(value.parentVersionIds),
        value.label ?? null,
      ],
    );
  }

  async findPublicationVersion(
    fingerprint: ContentFingerprint,
  ): Promise<MasterPublicationVersion | undefined> {
    const result = await this.sql.query<SqlRow>(
      `
        select version_id,
               publication_id,
               sequence,
               source_item_id,
               content_fingerprint,
               parent_version_ids,
               label
        from master_publication_versions
        where content_fingerprint = $1
      `,
      [fingerprint],
    );
    const row = result.rows[0];
    return row ? versionFromRow(row) : undefined;
  }

  async indexPublicationVersion(
    _value: MasterPublicationVersion,
  ): Promise<void> {
    // The unique content_fingerprint index is maintained by PostgreSQL.
  }
}
