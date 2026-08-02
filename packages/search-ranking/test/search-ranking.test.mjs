import assert from "node:assert/strict";
import {
  ExplainableSearchRanker,
  getSearchRankingProfile,
} from "../dist/index.js";

const ranker =
  new ExplainableSearchRanker();

const result =
  ranker.score(
    {
      lexicalScore:
        0.8,
      titleMatch:
        true,
      exactPhraseMatch:
        true,
      updatedAt:
        "2026-07-25T00:00:00.000Z",
      kind:
        "publication",
      fuzzyApplied:
        false,
    },
    getSearchRankingProfile(
      "precision",
    ),
    new Date(
      "2026-08-01T00:00:00.000Z",
    ),
  );

assert.equal(
  result.finalScore > 4,
  true,
);

assert.equal(
  result.contributions.some(
    (value) =>
      value.signal ===
      "exact-phrase",
  ),
  true,
);

console.log(JSON.stringify({
  flow:
    "search-ranking-profiles-explanation",
  status:
    "passed",
}));
