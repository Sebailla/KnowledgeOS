import type {
  LibraryItemSummary,
  LibraryPage,
  LibraryQuery,
} from "./LibraryCatalogTypes.js";

export interface LibraryCatalog {
  list(query?: LibraryQuery): Promise<LibraryPage>;
  get(id: string): Promise<LibraryItemSummary | undefined>;
  recent(limit?: number): Promise<readonly LibraryItemSummary[]>;
  favorites(limit?: number): Promise<readonly LibraryItemSummary[]>;
}
