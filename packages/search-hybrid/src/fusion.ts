import type {
  HybridSearchResult,
  HybridSearchWeights,
  LexicalCandidate,
  SemanticCandidate,
} from "./model.js";

export class ReciprocalRankFusion {
  fuse(
    lexical:
      readonly LexicalCandidate[],
    semantic:
      readonly SemanticCandidate[],
    weights:
      HybridSearchWeights,
  ): readonly HybridSearchResult[] {
    if (
      weights.reciprocalRankConstant < 1
    ) {
      throw new Error(
        "reciprocalRankConstant must be positive",
      );
    }

    const values =
      new Map<
        string,
        {
          lexicalScore: number;
          semanticScore: number;
          reciprocalRankScore: number;
        }
      >();

    lexical.forEach(
      (candidate, index) => {
        const current =
          values.get(
            candidate.searchDocumentId,
          ) ?? {
            lexicalScore: 0,
            semanticScore: 0,
            reciprocalRankScore: 0,
          };

        values.set(
          candidate.searchDocumentId,
          {
            ...current,
            lexicalScore:
              candidate.score,
            reciprocalRankScore:
              current.reciprocalRankScore +
              weights.lexical /
              (
                weights.reciprocalRankConstant +
                index +
                1
              ),
          },
        );
      },
    );

    semantic.forEach(
      (candidate, index) => {
        const current =
          values.get(
            candidate.searchDocumentId,
          ) ?? {
            lexicalScore: 0,
            semanticScore: 0,
            reciprocalRankScore: 0,
          };

        values.set(
          candidate.searchDocumentId,
          {
            ...current,
            semanticScore:
              candidate.score,
            reciprocalRankScore:
              current.reciprocalRankScore +
              weights.semantic /
              (
                weights.reciprocalRankConstant +
                index +
                1
              ),
          },
        );
      },
    );

    return [
      ...values.entries(),
    ]
      .map(
        ([searchDocumentId, value]) => ({
          searchDocumentId,
          ...value,
        }),
      )
      .sort(
        (a, b) =>
          b.reciprocalRankScore -
            a.reciprocalRankScore ||
          b.semanticScore -
            a.semanticScore ||
          b.lexicalScore -
            a.lexicalScore ||
          a.searchDocumentId.localeCompare(
            b.searchDocumentId,
          ),
      );
  }
}
