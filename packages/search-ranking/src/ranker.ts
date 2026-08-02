import type {
  SearchRankingProfile,
  SearchRankingSignals,
  SearchScoreExplanation,
} from "./model.js";

function recencyScore(
  updatedAt: string | undefined,
  now: Date,
): number {
  if (!updatedAt) return 0;

  const timestamp =
    Date.parse(updatedAt);

  if (!Number.isFinite(timestamp)) {
    return 0;
  }

  const days =
    Math.max(
      0,
      (
        now.getTime() -
        timestamp
      ) /
      86_400_000,
    );

  return 1 / (1 + days / 30);
}

export class ExplainableSearchRanker {
  score(
    signals:
      SearchRankingSignals,
    profile:
      SearchRankingProfile,
    now: Date,
  ): SearchScoreExplanation {
    const values = [
      {
        signal:
          "lexical",
        value:
          signals.lexicalScore,
        weighted:
          signals.lexicalScore *
          profile.lexicalWeight,
      },
      {
        signal:
          "title-match",
        value:
          signals.titleMatch ? 1 : 0,
        weighted:
          signals.titleMatch
            ? profile.titleBoost
            : 0,
      },
      {
        signal:
          "exact-phrase",
        value:
          signals.exactPhraseMatch ? 1 : 0,
        weighted:
          signals.exactPhraseMatch
            ? profile.exactPhraseBoost
            : 0,
      },
      {
        signal:
          "recency",
        value:
          recencyScore(
            signals.updatedAt,
            now,
          ),
        weighted:
          recencyScore(
            signals.updatedAt,
            now,
          ) *
          profile.recencyWeight,
      },
      {
        signal:
          "personal-knowledge",
        value:
          signals.kind ===
          "personal-knowledge"
            ? 1
            : 0,
        weighted:
          signals.kind ===
          "personal-knowledge"
            ? profile
                .personalKnowledgeBoost
            : 0,
      },
      {
        signal:
          "fuzzy-penalty",
        value:
          signals.fuzzyApplied
            ? 1
            : 0,
        weighted:
          signals.fuzzyApplied
            ? -profile.fuzzyPenalty
            : 0,
      },
    ];

    const finalScore =
      values.reduce(
        (sum, value) =>
          sum + value.weighted,
        0,
      );

    return {
      finalScore,
      contributions:
        values,
    };
  }
}
