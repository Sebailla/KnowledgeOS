import type {
  SearchEmbedding,
} from "@knowledgeos/search-embedding";
import {
  cosineSimilarity,
} from "@knowledgeos/search-embedding";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

export interface VectorSearchResult {
  readonly searchDocumentId: string;
  readonly score: number;
  readonly modelId: string;
}

function embeddingFromRow(
  row: SqliteRow,
): SearchEmbedding {
  return {
    searchDocumentId:
      String(row.search_document_id),
    modelId:
      String(row.model_id),
    dimensions:
      Number(row.dimensions),
    vector:
      JSON.parse(
        String(row.vector_json),
      ),
    contentFingerprint:
      String(
        row.content_fingerprint,
      ),
    createdAt:
      String(row.created_at),
  };
}

export class SqliteSearchEmbeddingRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async upsert(
    embedding:
      SearchEmbedding,
  ): Promise<void> {
    if (
      embedding.vector.length !==
      embedding.dimensions
    ) {
      throw new Error(
        "Embedding dimensions do not match vector length",
      );
    }

    await this.sql.execute(
      `
        insert into search_embeddings (
          search_document_id,
          model_id,
          dimensions,
          vector_json,
          content_fingerprint,
          created_at
        ) values (?, ?, ?, ?, ?, ?)
        on conflict(search_document_id, model_id)
        do update set
          dimensions = excluded.dimensions,
          vector_json = excluded.vector_json,
          content_fingerprint = excluded.content_fingerprint,
          created_at = excluded.created_at
      `,
      [
        embedding.searchDocumentId,
        embedding.modelId,
        embedding.dimensions,
        JSON.stringify(
          embedding.vector,
        ),
        embedding.contentFingerprint,
        embedding.createdAt,
      ],
    );
  }

  async get(
    searchDocumentId: string,
    modelId: string,
  ): Promise<
    SearchEmbedding | undefined
  > {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_embeddings
          where search_document_id = ?
            and model_id = ?
        `,
        [
          searchDocumentId,
          modelId,
        ],
      );

    const row =
      result.rows[0];

    return row
      ? embeddingFromRow(row)
      : undefined;
  }

  async search(
    modelId: string,
    queryVector:
      readonly number[],
    limit: number,
  ): Promise<
    readonly VectorSearchResult[]
  > {
    const rows =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_embeddings
          where model_id = ?
        `,
        [modelId],
      );

    return rows.rows
      .map(
        (row) => {
          const embedding =
            embeddingFromRow(row);

          return {
            searchDocumentId:
              embedding.searchDocumentId,
            modelId:
              embedding.modelId,
            score:
              cosineSimilarity(
                queryVector,
                embedding.vector,
              ),
          };
        },
      )
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.searchDocumentId.localeCompare(
            b.searchDocumentId,
          ),
      )
      .slice(
        0,
        limit,
      );
  }
}

export const searchVectorSqliteMigrations = [
  {
    id:
      "0007_search_embeddings",
    sql: `
      create table if not exists search_embeddings (
        search_document_id text not null,
        model_id text not null,
        dimensions integer not null check (dimensions > 0),
        vector_json text not null,
        content_fingerprint text not null,
        created_at text not null,
        primary key(
          search_document_id,
          model_id
        )
      );

      create index if not exists idx_search_embeddings_model
        on search_embeddings(
          model_id,
          search_document_id
        );
    `,
  },
] as const;
