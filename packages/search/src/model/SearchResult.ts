import type { SearchDocument } from "./SearchDocument.js";

export interface SearchHit {
  readonly document: SearchDocument;
  readonly score: number;
  readonly matchedTerms: readonly string[];
}

export interface SearchResult {
  readonly total: number;
  readonly hits: readonly SearchHit[];
}
