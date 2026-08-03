import assert from "node:assert/strict";
import {
  SqliteLocalPublicationRepository,
  SqliteLocalStatisticsRepository,
  localLibraryMigrations,
} from "../dist/index.js";

class FakeSqlite {
  constructor() {
    this.rows = new Map();
  }

  async execute(sql, parameters = []) {
    if (
      sql.includes(
        "insert into local_publications",
      )
    ) {
      const key =
        `${parameters[0]}::${parameters[1]}`;
      this.rows.set(key, {
        local_library_id:
          parameters[0],
        publication_id:
          parameters[1],
        knowledge_object_id:
          parameters[2],
        version_id:
          parameters[3],
        source_item_id:
          parameters[4],
        title:
          parameters[5],
        media_type:
          parameters[6],
        byte_length:
          parameters[7],
        content_fingerprint:
          parameters[8],
        relative_path:
          parameters[9],
        acquisition_status:
          parameters[10],
        readable_offline:
          parameters[11],
        pinned:
          parameters[12],
        last_accessed_at:
          parameters[13],
        acquired_at:
          parameters[14],
      });
      return { rows: [], changes: 1 };
    }

    if (
      sql.includes(
        "where local_library_id = ?"
      ) &&
      sql.includes(
        "and publication_id = ?"
      )
    ) {
      const row =
        this.rows.get(
          `${parameters[0]}::${parameters[1]}`,
        );
      return {
        rows: row ? [row] : [],
        changes: 0,
      };
    }

    if (
      sql.includes(
        "count(*) as publication_count"
      )
    ) {
      const values = [
        ...this.rows.values(),
      ].filter(
        (row) =>
          row.local_library_id ===
          parameters[0],
      );
      return {
        rows: [{
          publication_count:
            values.length,
          offline_publication_count:
            values.filter(
              (row) =>
                row.readable_offline === 1,
            ).length,
          pinned_publication_count:
            values.filter(
              (row) =>
                row.pinned === 1,
            ).length,
          offline_bytes:
            values.reduce(
              (sum, row) =>
                sum +
                (
                  row.readable_offline === 1
                    ? row.byte_length
                    : 0
                ),
              0,
            ),
        }],
        changes: 0,
      };
    }

    return { rows: [], changes: 0 };
  }
}

const sql = new FakeSqlite();
const repository =
  new SqliteLocalPublicationRepository(sql);

await repository.save({
  localLibraryId:
    "local-library:sqlite",
  publicationId:
    "publication:sqlite-1",
  knowledgeObjectId:
    "knowledge-object:sqlite-1",
  versionId:
    "version:sqlite-1",
  sourceItemId:
    "source-item:sqlite-1",
  title:
    "SQLite Local Publication",
  mediaType:
    "application/pdf",
  byteLength:
    1024,
  contentFingerprint:
    "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  relativePath:
    "objects/aa/aa/object",
  acquisitionStatus:
    "available",
  readableOffline:
    true,
  pinned:
    false,
});

const loaded = await repository.get(
  "local-library:sqlite",
  "publication:sqlite-1",
);
assert.equal(
  loaded.title,
  "SQLite Local Publication",
);

const statistics =
  await new SqliteLocalStatisticsRepository(
    sql,
  ).calculate(
    "local-library:sqlite",
  );

assert.equal(
  statistics.publicationCount,
  1,
);
assert.equal(
  statistics.offlineBytes,
  1024,
);
assert.equal(
  localLibraryMigrations.length,
  1,
);

console.log(JSON.stringify({
  flow:
    "sqlite-local-repository-statistics-migrations",
  status: "passed",
}));
