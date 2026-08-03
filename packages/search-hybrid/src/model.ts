export interface LexicalCandidate {
  readonly searchDocumentId: string;
  readonly score: number;
}

export interface SemanticCandidate {
  readonly searchDocumentId: string;
  readonly score: number;
}

export interface HybridSearchResult {
  readonly searchDocumentId: string;
  readonly lexicalScore: number;
  readonly semanticScore: number;
  readonly reciprocalRankScore: number;
}

export interface HybridSearchWeights {
  readonly lexical: number;
  readonly semantic: number;
  readonly reciprocalRankConstant: number;
}
