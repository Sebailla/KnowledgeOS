import type {
  SearchDictionary,
} from "./dictionary.js";

export interface QueryExpansion {
  readonly original: string;
  readonly alternatives:
    readonly {
      readonly term: string;
      readonly reason:
        | "typo"
        | "synonym"
        | "domain";
      readonly confidence: number;
    }[];
}

export class SearchQueryExpansionService {
  public constructor(
    private readonly dictionary:
      SearchDictionary,
    private readonly synonyms:
      Readonly<Record<string, readonly string[]>>,
  ) {}

  async expand(
    term: string,
  ): Promise<QueryExpansion> {
    const normalized =
      term.normalize("NFKC")
        .toLowerCase()
        .trim();

    const typoCandidates =
      await this.dictionary.suggest(
        normalized,
        normalized.length <= 5 ? 1 : 2,
        5,
      );

    const alternatives = [
      ...typoCandidates
        .filter(
          (candidate) =>
            candidate.term !== normalized,
        )
        .map(
          (candidate) => ({
            term:
              candidate.term,
            reason:
              "typo" as const,
            confidence:
              0.8,
          }),
        ),
      ...(this.synonyms[normalized] ?? [])
        .map(
          (value) => ({
            term:
              value,
            reason:
              "synonym" as const,
            confidence:
              0.9,
          }),
        ),
    ];

    const unique =
      new Map<
        string,
        QueryExpansion["alternatives"][number]
      >();

    for (const alternative of alternatives) {
      const existing =
        unique.get(
          alternative.term,
        );

      if (
        !existing ||
        alternative.confidence >
          existing.confidence
      ) {
        unique.set(
          alternative.term,
          alternative,
        );
      }
    }

    return {
      original:
        normalized,
      alternatives:
        [...unique.values()]
          .sort(
            (a, b) =>
              b.confidence -
                a.confidence ||
              a.term.localeCompare(
                b.term,
              ),
          ),
    };
  }
}
