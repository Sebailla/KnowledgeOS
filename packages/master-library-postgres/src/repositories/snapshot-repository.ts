import type {
  MasterSnapshot,
  MasterSnapshotRepository,
} from "@knowledgeos/master-library";
import type {
  SqlExecutor,
  SqlRow,
} from "@knowledgeos/infrastructure-postgres";
import { snapshotFromRow } from "../row-mappers.js";

export class PostgresMasterSnapshotRepository
implements MasterSnapshotRepository {
  public constructor(private readonly sql: SqlExecutor) {}

  async get(
    id: string,
  ): Promise<MasterSnapshot | undefined> {
    const result = await this.sql.query<SqlRow>(
      `
        select snapshot_id,
               publication_id,
               publication_version_id,
               metadata_fingerprint,
               asset_fingerprints
        from master_snapshots
        where snapshot_id = $1
      `,
      [id],
    );
    const row = result.rows[0];
    return row ? snapshotFromRow(row) : undefined;
  }

  async save(value: MasterSnapshot): Promise<void> {
    await this.sql.query(
      `
        insert into master_snapshots (
          snapshot_id,
          publication_id,
          publication_version_id,
          metadata_fingerprint,
          asset_fingerprints
        ) values ($1, $2, $3, $4, $5::jsonb)
        on conflict (snapshot_id)
        do update set
          publication_version_id =
            excluded.publication_version_id,
          metadata_fingerprint =
            excluded.metadata_fingerprint,
          asset_fingerprints =
            excluded.asset_fingerprints
      `,
      [
        value.snapshotId,
        value.publicationId,
        value.publicationVersionId,
        value.metadataFingerprint,
        JSON.stringify(value.assetFingerprints),
      ],
    );
  }
}
