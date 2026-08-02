export interface RerankCandidate {
  readonly documentId: string;
  readonly baseScore: number;
  readonly title: string;
  readonly content: string;
  readonly updatedAt?: string;
  readonly personalBoost?: number;
}

export interface RerankExplanation {
  readonly documentId: string;
  readonly finalScore: number;
  readonly contributions: Readonly<Record<string, number>>;
}

export class DeterministicSearchReranker {
  rerank(
    query: string,
    candidates: readonly RerankCandidate[],
  ): readonly RerankExplanation[] {
    const normalized = query.toLowerCase().trim();

    return candidates
      .map((candidate) => {
        const titleExact =
          candidate.title.toLowerCase().includes(normalized) ? 1.5 : 0;
        const contentMatch =
          candidate.content.toLowerCase().includes(normalized) ? 0.75 : 0;
        const personal = candidate.personalBoost ?? 0;

        return {
          documentId: candidate.documentId,
          finalScore: candidate.baseScore + titleExact + contentMatch + personal,
          contributions: {
            base: candidate.baseScore,
            titleExact,
            contentMatch,
            personal,
          },
        };
      })
      .sort(
        (a, b) =>
          b.finalScore - a.finalScore ||
          a.documentId.localeCompare(b.documentId),
      );
  }
}
