import type {
  SearchQuery,
} from "@knowledgeos/search-query";
import type {
  SearchRankingProfileName,
  SearchScoreExplanation,
} from "@knowledgeos/search-ranking";
import {
  ExplainableSearchRanker,
  getSearchRankingProfile,
} from "@knowledgeos/search-ranking";
import type {
  SearchQueryExpansionService,
} from "@knowledgeos/search-fuzzy";

export interface SearchRuntimeResult {
  readonly searchDocumentId: string;
  readonly title: string;
  readonly kind: string;
  readonly updatedAt?: string;
  readonly lexicalScore: number;
  readonly titleMatch: boolean;
  readonly exactPhraseMatch: boolean;
  readonly fuzzyApplied: boolean;
}

export interface SearchRuntimeReader {
  search(
    query: SearchQuery,
  ): Promise<
    readonly SearchRuntimeResult[]
  >;
}

export interface SearchRuntimeResponse {
  readonly results:
    readonly (
      SearchRuntimeResult & {
        readonly score:
          SearchScoreExplanation;
      }
    )[];
  readonly expandedTerms:
    readonly string[];
}

export class SearchRuntime {
  private readonly ranker =
    new ExplainableSearchRanker();

  public constructor(
    private readonly reader:
      SearchRuntimeReader,
    private readonly expansion:
      SearchQueryExpansionService,
  ) {}

  async execute(
    query: SearchQuery,
    profileName:
      SearchRankingProfileName,
    now: Date,
  ): Promise<SearchRuntimeResponse> {
    const lexical =
      await this.reader.search(
        query,
      );

    const rawTerms =
      query.raw
        .split(/\s+/)
        .map(
          (value) =>
            value.replace(
              /^[-+()"]+|[-+()"]+$/g,
              "",
            ),
        )
        .filter(
          (value) =>
            value.length >= 4 &&
            !value.includes(":"),
        );

    const expansions =
      await Promise.all(
        rawTerms.map(
          (term) =>
            this.expansion.expand(
              term,
            ),
        ),
      );

    const expandedTerms = [
      ...new Set(
        expansions.flatMap(
          (value) =>
            value.alternatives.map(
              (alternative) =>
                alternative.term,
            ),
        ),
      ),
    ];

    const profile =
      getSearchRankingProfile(
        profileName,
      );

    const ranked =
      lexical
        .map(
          (result) => ({
            ...result,
            score:
              this.ranker.score(
                {
                  lexicalScore:
                    result.lexicalScore,
                  titleMatch:
                    result.titleMatch,
                  exactPhraseMatch:
                    result.exactPhraseMatch,
                  ...(result.updatedAt
                    ? {
                        updatedAt:
                          result.updatedAt,
                      }
                    : {}),
                  kind:
                    result.kind,
                  fuzzyApplied:
                    result.fuzzyApplied,
                },
                profile,
                now,
              ),
          }),
        )
        .sort(
          (a, b) =>
            b.score.finalScore -
              a.score.finalScore ||
            a.searchDocumentId
              .localeCompare(
                b.searchDocumentId,
              ),
        );

    return {
      results:
        ranked,
      expandedTerms,
    };
  }
}
