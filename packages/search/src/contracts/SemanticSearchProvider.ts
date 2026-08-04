export interface SemanticSearchCandidate {
  readonly documentId: string;
  readonly score: number;
}

export interface SemanticSearchProvider {
  searchByVector(
    vector: readonly number[],
    limit: number,
  ): Promise<readonly SemanticSearchCandidate[]>;
}
