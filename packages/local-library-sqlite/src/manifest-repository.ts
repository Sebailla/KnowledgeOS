import type {
  LocalLibraryId,
} from "@knowledgeos/domain-types";
import type {
  LocalLibraryManifest,
} from "@knowledgeos/local-library";
import type {
  SqliteExecutor,
  SqliteRow,
} from "./contracts.js";

export class SqliteLocalManifestRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async save(
    manifest: LocalLibraryManifest,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into local_manifests (
          local_library_id,
          generated_at,
          payload
        ) values (?, ?, ?)
        on conflict(local_library_id)
        do update set
          generated_at = excluded.generated_at,
          payload = excluded.payload
      `,
      [
        manifest.localLibraryId,
        manifest.generatedAt,
        JSON.stringify(manifest),
      ],
    );
  }

  async get(
    localLibraryId: LocalLibraryId,
  ): Promise<LocalLibraryManifest | undefined> {
    const result = await this.sql.execute<SqliteRow>(
      `
        select payload
        from local_manifests
        where local_library_id = ?
      `,
      [localLibraryId],
    );

    const row = result.rows[0];
    return row
      ? JSON.parse(
          String(row.payload),
        ) as LocalLibraryManifest
      : undefined;
  }
}
