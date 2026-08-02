import type {
  SearchCheckpointRepository,
  SearchDocument,
  SearchDocumentRepository,
  SearchIndexCheckpoint,
  SearchUnitOfWork,
} from "@knowledgeos/search-domain";
import type {
  SqliteExecutor,
  SqliteRow,
  SqliteTransactionManager,
} from "@knowledgeos/local-library-sqlite";

function fromRow(
  row: SqliteRow,
): SearchDocument {
  return {
    searchDocumentId:
      String(row.search_document_id),
    knowledgeObjectId:
      row.knowledge_object_id as never,
    ...(row.publication_id == null
      ? {}
      : {
          publicationId:
            row.publication_id as never,
        }),
    ...(row.version_id == null
      ? {}
      : {
          versionId:
            row.version_id as never,
        }),
    kind:
      row.kind as SearchDocument["kind"],
    title:
      String(row.title),
    body:
      String(row.body),
    ...(row.language == null
      ? {}
      : {
          language:
            String(row.language),
        }),
    tags:
      JSON.parse(
        String(row.tags_json),
      ),
    authors:
      JSON.parse(
        String(row.authors_json),
      ),
    ...(row.source == null
      ? {}
      : {
          source:
            String(row.source),
        }),
    ...(row.created_at == null
      ? {}
      : {
          createdAt:
            String(row.created_at),
        }),
    updatedAt:
      String(row.updated_at),
    deleted:
      Boolean(row.deleted),
    metadata:
      JSON.parse(
        String(row.metadata_json),
      ),
  };
}

export class SqliteSearchDocumentRepository
implements SearchDocumentRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async get(
    searchDocumentId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_documents
          where search_document_id = ?
        `,
        [searchDocumentId],
      );

    const row = result.rows[0];
    return row ? fromRow(row) : undefined;
  }

  async upsert(
    document: SearchDocument,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into search_documents (
          search_document_id,
          knowledge_object_id,
          publication_id,
          version_id,
          kind,
          title,
          body,
          language,
          tags_json,
          authors_json,
          source,
          created_at,
          updated_at,
          deleted,
          metadata_json
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(search_document_id)
        do update set
          knowledge_object_id = excluded.knowledge_object_id,
          publication_id = excluded.publication_id,
          version_id = excluded.version_id,
          kind = excluded.kind,
          title = excluded.title,
          body = excluded.body,
          language = excluded.language,
          tags_json = excluded.tags_json,
          authors_json = excluded.authors_json,
          source = excluded.source,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at,
          deleted = excluded.deleted,
          metadata_json = excluded.metadata_json
      `,
      [
        document.searchDocumentId,
        document.knowledgeObjectId,
        document.publicationId ?? null,
        document.versionId ?? null,
        document.kind,
        document.title,
        document.body,
        document.language ?? null,
        JSON.stringify(document.tags),
        JSON.stringify(document.authors),
        document.source ?? null,
        document.createdAt ?? null,
        document.updatedAt,
        document.deleted ? 1 : 0,
        JSON.stringify(document.metadata),
      ],
    );

    await this.sql.execute(
      `
        delete from search_documents_fts
        where search_document_id = ?
      `,
      [document.searchDocumentId],
    );

    await this.sql.execute(
      `
        insert into search_documents_fts (
          search_document_id,
          title,
          body,
          tags,
          authors
        ) values (?, ?, ?, ?, ?)
      `,
      [
        document.searchDocumentId,
        document.title,
        document.body,
        document.tags.join(" "),
        document.authors.join(" "),
      ],
    );
  }

  async delete(
    searchDocumentId: string,
  ): Promise<void> {
    await this.sql.execute(
      `
        delete from search_documents_fts
        where search_document_id = ?
      `,
      [searchDocumentId],
    );

    await this.sql.execute(
      `
        delete from search_documents
        where search_document_id = ?
      `,
      [searchDocumentId],
    );
  }
}

export class SqliteSearchCheckpointRepository
implements SearchCheckpointRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async get(
    consumerId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_index_checkpoints
          where consumer_id = ?
        `,
        [consumerId],
      );

    const row = result.rows[0];

    return row
      ? {
          consumerId:
            String(row.consumer_id),
          lastSequence:
            Number(row.last_sequence),
          updatedAt:
            String(row.updated_at),
        }
      : undefined;
  }

  async save(
    checkpoint:
      SearchIndexCheckpoint,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into search_index_checkpoints (
          consumer_id,
          last_sequence,
          updated_at
        ) values (?, ?, ?)
        on conflict(consumer_id)
        do update set
          last_sequence = excluded.last_sequence,
          updated_at = excluded.updated_at
      `,
      [
        checkpoint.consumerId,
        checkpoint.lastSequence,
        checkpoint.updatedAt,
      ],
    );
  }
}

export class SqliteSearchUnitOfWork
implements SearchUnitOfWork {
  public constructor(
    private readonly transactions:
      SqliteTransactionManager,
  ) {}

  async run<T>(
    work: () => Promise<T>,
  ): Promise<T> {
    return this.transactions.run(
      async () => work(),
    );
  }
}

export const searchSqliteMigrations = [
  {
    id:
      "0006_search_index",
    sql: `
      create table if not exists search_documents (
        search_document_id text primary key,
        knowledge_object_id text not null,
        publication_id text,
        version_id text,
        kind text not null,
        title text not null,
        body text not null,
        language text,
        tags_json text not null,
        authors_json text not null,
        source text,
        created_at text,
        updated_at text not null,
        deleted integer not null,
        metadata_json text not null
      );

      create index if not exists idx_search_documents_knowledge_object
        on search_documents(
          knowledge_object_id,
          kind,
          updated_at
        );

      create virtual table if not exists search_documents_fts
      using fts5(
        search_document_id unindexed,
        title,
        body,
        tags,
        authors,
        tokenize = 'unicode61 remove_diacritics 2'
      );

      create table if not exists search_index_checkpoints (
        consumer_id text primary key,
        last_sequence integer not null,
        updated_at text not null
      );
    `,
  },
] as const;
