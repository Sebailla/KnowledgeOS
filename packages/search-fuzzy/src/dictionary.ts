export interface SearchDictionaryEntry {
  readonly term: string;
  readonly frequency: number;
}

export interface SearchDictionary {
  suggest(
    term: string,
    maximumDistance: number,
    limit: number,
  ): Promise<
    readonly SearchDictionaryEntry[]
  >;
}

export class InMemorySearchDictionary
implements SearchDictionary {
  public constructor(
    private readonly entries:
      readonly SearchDictionaryEntry[],
  ) {}

  async suggest(
    term: string,
    maximumDistance: number,
    limit: number,
  ) {
    const {
      levenshteinDistance,
    } = await import("./distance.js");

    return this.entries
      .map(
        (entry) => ({
          entry,
          distance:
            levenshteinDistance(
              term,
              entry.term,
            ),
        }),
      )
      .filter(
        (value) =>
          value.distance <=
          maximumDistance,
      )
      .sort(
        (a, b) =>
          a.distance - b.distance ||
          b.entry.frequency -
            a.entry.frequency ||
          a.entry.term.localeCompare(
            b.entry.term,
          ),
      )
      .slice(0, limit)
      .map(
        (value) =>
          value.entry,
      );
  }
}
