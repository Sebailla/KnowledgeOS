export type SearchRankingProfileName =
  | "balanced"
  | "precision"
  | "recency"
  | "personal";

export interface SearchRankingProfile {
  readonly name:
    SearchRankingProfileName;
  readonly lexicalWeight: number;
  readonly titleBoost: number;
  readonly recencyWeight: number;
  readonly personalKnowledgeBoost: number;
  readonly exactPhraseBoost: number;
  readonly fuzzyPenalty: number;
}

export interface SearchRankingSignals {
  readonly lexicalScore: number;
  readonly titleMatch: boolean;
  readonly exactPhraseMatch: boolean;
  readonly updatedAt?: string;
  readonly kind: string;
  readonly fuzzyApplied: boolean;
}

export interface SearchScoreExplanation {
  readonly finalScore: number;
  readonly contributions:
    readonly {
      readonly signal: string;
      readonly value: number;
      readonly weighted: number;
    }[];
}
