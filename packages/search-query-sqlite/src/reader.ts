import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";
import {
  compileSearchQuery,
} from "@knowledgeos/search-query";
import type {
  SearchFacetResult,
  SearchQuery,
} from "@knowledgeos/search-query";

export interface AdvancedSearchResult {
  readonly searchDocumentId: string;
  readonly title: string;
  readonly kind: string;
  readonly language?: string;
  readonly source?: string;
  readonly snippet: string;
  readonly rank: number;
}

export interface AdvancedSearchResponse {
  readonly results:
    readonly AdvancedSearchResult[];
  readonly facets:
    readonly SearchFacetResult[];
  readonly total:
    number;
}

export class SqliteAdvancedSearchReader {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async search(
    query: SearchQuery,
  ): Promise<AdvancedSearchResponse> {
    const compiled =
      compileSearchQuery(
        query.root,
      );

    const predicates = [
      "d.deleted = 0",
      ...compiled.whereSql.map(
        (sql) => `d.${sql}`,
      ),
    ];

    if (compiled.ftsMatch) {
      predicates.push(
        "search_documents_fts match ?",
      );
    }

    if (
      query.kinds.length > 0
    ) {
      predicates.push(
        `d.kind in (${query.kinds
          .map(() => "?")
          .join(", ")})`,
      );
    }

    const where =
      predicates.length > 0
        ? `where ${predicates.join(" and ")}`
        : "";

    const parameters = [
      ...compiled.parameters,
      ...(compiled.ftsMatch
        ? [compiled.ftsMatch]
        : []),
      ...query.kinds,
    ];

    const result =
      await this.sql.execute<SqliteRow>(
        `
          select
            d.search_document_id,
            d.title,
            d.kind,
            d.language,
            d.source,
            case
              when ? <> ''
              then snippet(
                search_documents_fts,
                2,
                '<mark>',
                '</mark>',
                ' … ',
                20
              )
              else substr(d.body, 1, 240)
            end as snippet,
            case
              when ? <> ''
              then bm25(
                search_documents_fts,
                0.0,
                3.0,
                1.0,
                0.7,
                0.7
              )
              else 0
            end as rank
          from search_documents d
          join search_documents_fts
            on search_documents_fts.search_document_id =
               d.search_document_id
          ${where}
          order by rank asc, d.updated_at desc
          limit ?
          offset ?
        `,
        [
          compiled.ftsMatch,
          compiled.ftsMatch,
          ...parameters,
          query.limit,
          query.offset,
        ],
      );

    const count =
      await this.sql.execute<SqliteRow>(
        `
          select count(*) as total
          from search_documents d
          join search_documents_fts
            on search_documents_fts.search_document_id =
               d.search_document_id
          ${where}
        `,
        parameters,
      );

    return {
      results:
        result.rows.map(
          (row) => ({
            searchDocumentId:
              String(
                row.search_document_id,
              ),
            title:
              String(row.title),
            kind:
              String(row.kind),
            ...(row.language == null
              ? {}
              : {
                  language:
                    String(row.language),
                }),
            ...(row.source == null
              ? {}
              : {
                  source:
                    String(row.source),
                }),
            snippet:
              String(row.snippet),
            rank:
              Number(row.rank),
          }),
        ),
      facets:
        await this.facets(
          where,
          parameters,
        ),
      total:
        Number(
          count.rows[0]?.total ?? 0,
        ),
    };
  }

  private async facets(
    where: string,
    parameters:
      readonly unknown[],
  ): Promise<
    readonly SearchFacetResult[]
  > {
    const fields = [
      "kind",
      "language",
      "source",
    ] as const;

    const results:
      SearchFacetResult[] = [];

    for (const field of fields) {
      const rows =
        await this.sql.execute<SqliteRow>(
          `
            select
              coalesce(
                d.${field},
                ''
              ) as value,
              count(*) as count
            from search_documents d
            join search_documents_fts
              on search_documents_fts.search_document_id =
                 d.search_document_id
            ${where}
            group by d.${field}
            order by count desc, value asc
          `,
          parameters,
        );

      results.push({
        field,
        buckets:
          rows.rows
            .map(
              (row) => ({
                value:
                  String(row.value),
                count:
                  Number(row.count),
              }),
            )
            .filter(
              (bucket) =>
                bucket.value.length > 0,
            ),
      });
    }

    return results;
  }
}
