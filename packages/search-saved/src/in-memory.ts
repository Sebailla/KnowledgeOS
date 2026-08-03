import type {
  SavedSearchRepository,
  SearchHistoryRepository,
} from "./contracts.js";
import type {
  SavedSearch,
  SearchHistoryEntry,
} from "./model.js";

export class InMemorySavedSearchRepository
implements SavedSearchRepository {
  private readonly values =
    new Map<string, SavedSearch>();

  private key(
    ownerId: string,
    savedSearchId: string,
  ): string {
    return `${ownerId}::${savedSearchId}`;
  }

  async get(
    ownerId: string,
    savedSearchId: string,
  ) {
    return this.values.get(
      this.key(
        ownerId,
        savedSearchId,
      ),
    );
  }

  async save(
    value: SavedSearch,
  ): Promise<void> {
    this.values.set(
      this.key(
        value.ownerId,
        value.savedSearchId,
      ),
      value,
    );
  }

  async list(ownerId: string) {
    return [
      ...this.values.values(),
    ]
      .filter(
        (value) =>
          value.ownerId ===
          ownerId,
      )
      .sort(
        (a, b) =>
          b.updatedAt.localeCompare(
            a.updatedAt,
          ),
      );
  }

  async delete(
    ownerId: string,
    savedSearchId: string,
  ): Promise<boolean> {
    return this.values.delete(
      this.key(
        ownerId,
        savedSearchId,
      ),
    );
  }
}

export class InMemorySearchHistoryRepository
implements SearchHistoryRepository {
  private readonly values:
    SearchHistoryEntry[] = [];

  async append(
    entry: SearchHistoryEntry,
  ): Promise<void> {
    this.values.push(entry);
  }

  async listRecent(
    ownerId: string,
    limit: number,
  ) {
    return this.values
      .filter(
        (value) =>
          value.ownerId ===
          ownerId,
      )
      .sort(
        (a, b) =>
          b.executedAt.localeCompare(
            a.executedAt,
          ),
      )
      .slice(0, limit);
  }
}
