import type { PublicationId } from "@knowledgeos/domain-types";
import type {
  MasterAsset,
  MasterAssetRepository,
} from "@knowledgeos/master-library";
import type {
  SqlExecutor,
  SqlRow,
} from "@knowledgeos/infrastructure-postgres";
import { assetFromRow } from "../row-mappers.js";

export class PostgresMasterAssetRepository
implements MasterAssetRepository {
  public constructor(private readonly sql: SqlExecutor) {}

  async listByPublication(
    id: PublicationId,
  ): Promise<readonly MasterAsset[]> {
    const result = await this.sql.query<SqlRow>(
      `
        select asset_id,
               publication_id,
               media_type,
               byte_length,
               content_fingerprint,
               role
        from master_assets
        where publication_id = $1
        order by asset_id asc
      `,
      [id],
    );
    return result.rows.map(assetFromRow);
  }

  async save(value: MasterAsset): Promise<void> {
    await this.sql.query(
      `
        insert into master_assets (
          asset_id,
          publication_id,
          media_type,
          byte_length,
          content_fingerprint,
          role
        ) values ($1, $2, $3, $4, $5, $6)
        on conflict (asset_id)
        do update set
          media_type = excluded.media_type,
          byte_length = excluded.byte_length,
          content_fingerprint = excluded.content_fingerprint,
          role = excluded.role
      `,
      [
        value.assetId,
        value.publicationId,
        value.mediaType,
        value.byteLength,
        value.contentFingerprint,
        value.role,
      ],
    );
  }
}
