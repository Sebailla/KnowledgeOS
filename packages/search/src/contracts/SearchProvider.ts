import type { SearchIndex } from "./SearchIndex.js";

export interface SearchProvider {
  readonly id: string;
  openIndex(name: string): Promise<SearchIndex>;
  close(): Promise<void>;
}
