import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

export interface SearchTextResult {
  readonly searchDocumentId: string;
  readonly title: string;
  readonly snippet: string;
  readonly rank: number;
}

export class SqliteFtsSearchReader {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async search(
    query: string,
    limit: number,
  ): Promise<
    readonly SearchTextResult[]
  > {
    if (
      !query.trim()
    ) {
      return [];
    }

    const result =
      await this.sql.execute<SqliteRow>(
        `
          select
            search_document_id,
            title,
            snippet(
              search_documents_fts,
              2,
              '<mark>',
              '</mark>',
              ' … ',
              16
            ) as snippet,
            bm25(
              search_documents_fts,
              0.0,
              3.0,
              1.0,
              0.5,
              0.5
            ) as rank
          from search_documents_fts
          where search_documents_fts match ?
          order by rank asc
          limit ?
        `,
        [
          query,
          limit,
        ],
      );

    return result.rows.map(
      (row) => ({
        searchDocumentId:
          String(
            row.search_document_id,
          ),
        title:
          String(row.title),
        snippet:
          String(row.snippet),
        rank:
          Number(row.rank),
      }),
    );
  }
}
