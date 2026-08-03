import type {
  LocalLibraryId,
} from "@knowledgeos/domain-types";
import type {
  SqliteExecutor,
  SqliteRow,
} from "./contracts.js";

export interface LocalLibraryStatistics {
  readonly publicationCount: number;
  readonly offlinePublicationCount: number;
  readonly pinnedPublicationCount: number;
  readonly offlineBytes: number;
}

export class SqliteLocalStatisticsRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async calculate(
    localLibraryId: LocalLibraryId,
  ): Promise<LocalLibraryStatistics> {
    const result = await this.sql.execute<SqliteRow>(
      `
        select
          count(*) as publication_count,
          sum(case when readable_offline = 1 then 1 else 0 end)
            as offline_publication_count,
          sum(case when pinned = 1 then 1 else 0 end)
            as pinned_publication_count,
          sum(case when readable_offline = 1 then byte_length else 0 end)
            as offline_bytes
        from local_publications
        where local_library_id = ?
      `,
      [localLibraryId],
    );

    const row = result.rows[0] ?? {};

    return {
      publicationCount:
        Number(row.publication_count ?? 0),
      offlinePublicationCount:
        Number(row.offline_publication_count ?? 0),
      pinnedPublicationCount:
        Number(row.pinned_publication_count ?? 0),
      offlineBytes:
        Number(row.offline_bytes ?? 0),
    };
  }
}
