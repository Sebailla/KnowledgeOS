import type {
  ParsedDocument,
} from "@knowledgeos/document-contracts";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

export class SqliteParsedDocumentRepository {
  constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async save(
    document: ParsedDocument,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into parsed_documents (
          document_id,
          source_json,
          title,
          language,
          blocks_json,
          assets_json,
          metadata_json,
          created_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(document_id)
        do update set
          source_json = excluded.source_json,
          title = excluded.title,
          language = excluded.language,
          blocks_json = excluded.blocks_json,
          assets_json = excluded.assets_json,
          metadata_json = excluded.metadata_json,
          created_at = excluded.created_at
      `,
      [
        document.documentId,
        JSON.stringify(document.source),
        document.title ?? null,
        document.language ?? null,
        JSON.stringify(document.blocks),
        JSON.stringify(document.assets),
        JSON.stringify(document.metadata),
        document.createdAt,
      ],
    );
  }

  async get(
    documentId: string,
  ): Promise<ParsedDocument | undefined> {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from parsed_documents
          where document_id = ?
        `,
        [documentId],
      );

    const row = result.rows[0];
    if (!row) return undefined;

    return {
      documentId: String(row.document_id),
      source: JSON.parse(String(row.source_json)),
      ...(row.title == null ? {} : { title: String(row.title) }),
      ...(row.language == null ? {} : { language: String(row.language) }),
      blocks: JSON.parse(String(row.blocks_json)),
      assets: JSON.parse(String(row.assets_json)),
      metadata: JSON.parse(String(row.metadata_json)),
      createdAt: String(row.created_at),
    };
  }
}

export const documentSqliteMigrations = [
  {
    id: "0015_document_engine",
    sql: `
      create table if not exists parsed_documents (
        document_id text primary key,
        source_json text not null,
        title text,
        language text,
        blocks_json text not null,
        assets_json text not null,
        metadata_json text not null,
        created_at text not null
      );

      create index if not exists idx_parsed_documents_created
        on parsed_documents(created_at);
    `,
  },
] as const;
