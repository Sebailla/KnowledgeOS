import type { SearchDocument } from "../model/SearchDocument.js";
import type { SearchQuery } from "../model/SearchQuery.js";
import type { SearchResult } from "../model/SearchResult.js";

export interface SearchIndex {
  upsert(document: SearchDocument): Promise<void>;
  remove(documentId: string): Promise<boolean>;
  get(documentId: string): Promise<SearchDocument | undefined>;
  search(query: SearchQuery): Promise<SearchResult>;
  clear(): Promise<void>;
}
