export type UnifiedSearchMode =
  | "lexical"
  | "semantic"
  | "hybrid"
  | "graph";

export interface UnifiedSearchRequest {
  readonly query: string;
  readonly mode: UnifiedSearchMode;
  readonly rankingProfile:
    | "balanced"
    | "precision"
    | "recency"
    | "personal";
  readonly limit: number;
  readonly offset: number;
  readonly includeFacets: boolean;
  readonly includeExplanation: boolean;
}

export interface UnifiedSearchResult {
  readonly searchDocumentId: string;
  readonly title: string;
  readonly snippet?: string;
  readonly kind: string;
  readonly finalScore: number;
  readonly lexicalScore?: number;
  readonly semanticScore?: number;
  readonly graphScore?: number;
  readonly explanation?: unknown;
}

export interface UnifiedSearchResponse {
  readonly query: string;
  readonly mode: UnifiedSearchMode;
  readonly results:
    readonly UnifiedSearchResult[];
  readonly total: number;
  readonly facets?: readonly unknown[];
  readonly expandedTerms?: readonly string[];
  readonly durationMilliseconds: number;
}

export interface UnifiedSearchHealth {
  readonly lexical: "available" | "unavailable";
  readonly semantic: "available" | "unavailable";
  readonly graph: "available" | "unavailable";
  readonly live: "available" | "unavailable";
}
