export interface Bm25Document {
  readonly documentId: string;
  readonly terms: readonly string[];
}

export interface Bm25Parameters {
  readonly k1: number;
  readonly b: number;
}

export class Bm25Index {
  private readonly documents = new Map<string, readonly string[]>();

  constructor(
    private readonly parameters: Bm25Parameters = { k1: 1.2, b: 0.75 },
  ) {
    if (parameters.k1 <= 0 || parameters.b < 0 || parameters.b > 1) {
      throw new Error("Invalid BM25 parameters");
    }
  }

  upsert(document: Bm25Document): void {
    this.documents.set(document.documentId, [...document.terms]);
  }

  remove(documentId: string): boolean {
    return this.documents.delete(documentId);
  }

  search(queryTerms: readonly string[]): readonly {
    readonly documentId: string;
    readonly score: number;
  }[] {
    const docs = [...this.documents.entries()];
    if (docs.length === 0) return [];

    const avgLength =
      docs.reduce((sum, [, terms]) => sum + terms.length, 0) / docs.length;

    return docs
      .map(([documentId, terms]) => ({
        documentId,
        score: queryTerms.reduce(
          (sum, term) => sum + this.scoreTerm(term, terms, docs, avgLength),
          0,
        ),
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.documentId.localeCompare(b.documentId));
  }

  private scoreTerm(
    term: string,
    terms: readonly string[],
    docs: readonly [string, readonly string[]][],
    avgLength: number,
  ): number {
    const frequency = terms.filter((value) => value === term).length;
    if (frequency === 0) return 0;

    const documentFrequency =
      docs.filter(([, documentTerms]) => documentTerms.includes(term)).length;
    const idf = Math.log(
      1 + (docs.length - documentFrequency + 0.5) / (documentFrequency + 0.5),
    );

    const denominator =
      frequency +
      this.parameters.k1 *
        (1 - this.parameters.b + this.parameters.b * (terms.length / avgLength));

    return idf * ((frequency * (this.parameters.k1 + 1)) / denominator);
  }
}
