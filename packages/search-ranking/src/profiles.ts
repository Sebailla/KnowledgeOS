import type {
  SearchRankingProfile,
  SearchRankingProfileName,
} from "./model.js";

const profiles:
  Readonly<Record<
    SearchRankingProfileName,
    SearchRankingProfile
  >> = {
    balanced: {
      name:
        "balanced",
      lexicalWeight:
        1,
      titleBoost:
        1.5,
      recencyWeight:
        0.15,
      personalKnowledgeBoost:
        0.25,
      exactPhraseBoost:
        0.75,
      fuzzyPenalty:
        0.2,
    },
    precision: {
      name:
        "precision",
      lexicalWeight:
        1.4,
      titleBoost:
        2,
      recencyWeight:
        0.05,
      personalKnowledgeBoost:
        0.1,
      exactPhraseBoost:
        1.2,
      fuzzyPenalty:
        0.4,
    },
    recency: {
      name:
        "recency",
      lexicalWeight:
        0.8,
      titleBoost:
        1.2,
      recencyWeight:
        0.8,
      personalKnowledgeBoost:
        0.2,
      exactPhraseBoost:
        0.5,
      fuzzyPenalty:
        0.15,
    },
    personal: {
      name:
        "personal",
      lexicalWeight:
        0.9,
      titleBoost:
        1,
      recencyWeight:
        0.2,
      personalKnowledgeBoost:
        1.5,
      exactPhraseBoost:
        0.5,
      fuzzyPenalty:
        0.15,
    },
  };

export function getSearchRankingProfile(
  name:
    SearchRankingProfileName,
): SearchRankingProfile {
  return profiles[name];
}
