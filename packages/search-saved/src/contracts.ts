import type {
  SavedSearch,
  SearchHistoryEntry,
} from "./model.js";

export interface SavedSearchRepository {
  get(
    ownerId: string,
    savedSearchId: string,
  ): Promise<SavedSearch | undefined>;

  save(
    value: SavedSearch,
  ): Promise<void>;

  list(
    ownerId: string,
  ): Promise<readonly SavedSearch[]>;

  delete(
    ownerId: string,
    savedSearchId: string,
  ): Promise<boolean>;
}

export interface SearchHistoryRepository {
  append(
    entry: SearchHistoryEntry,
  ): Promise<void>;

  listRecent(
    ownerId: string,
    limit: number,
  ): Promise<readonly SearchHistoryEntry[]>;
}
