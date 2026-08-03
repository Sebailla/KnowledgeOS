import type {
  SavedSearchRepository,
  SearchHistoryRepository,
} from "./contracts.js";
import type {
  SavedSearch,
  SearchHistoryEntry,
} from "./model.js";

export interface SavedSearchClock {
  nowIso(): string;
}

export class SavedSearchService {
  public constructor(
    private readonly saved:
      SavedSearchRepository,
    private readonly history:
      SearchHistoryRepository,
    private readonly clock:
      SavedSearchClock,
  ) {}

  async create(
    input: {
      readonly savedSearchId: string;
      readonly ownerId: string;
      readonly name: string;
      readonly query: string;
      readonly rankingProfile:
        SavedSearch["rankingProfile"];
      readonly live?: boolean;
    },
  ): Promise<SavedSearch> {
    const existing =
      await this.saved.get(
        input.ownerId,
        input.savedSearchId,
      );

    if (existing) {
      throw new Error(
        `Saved search already exists: ${input.savedSearchId}`,
      );
    }

    const now =
      this.clock.nowIso();

    const value: SavedSearch = {
      savedSearchId:
        input.savedSearchId,
      ownerId:
        input.ownerId,
      name:
        input.name.trim(),
      query:
        input.query.trim(),
      rankingProfile:
        input.rankingProfile,
      live:
        input.live ?? false,
      createdAt:
        now,
      updatedAt:
        now,
    };

    if (!value.name || !value.query) {
      throw new Error(
        "Saved search name and query are required",
      );
    }

    await this.saved.save(value);
    return value;
  }

  async recordExecution(
    input: {
      readonly historyId: string;
      readonly ownerId: string;
      readonly savedSearchId?: string;
      readonly query: string;
      readonly rankingProfile: string;
      readonly resultCount: number;
      readonly durationMilliseconds: number;
    },
  ): Promise<SearchHistoryEntry> {
    const now =
      this.clock.nowIso();

    const entry: SearchHistoryEntry = {
      historyId:
        input.historyId,
      ownerId:
        input.ownerId,
      query:
        input.query,
      rankingProfile:
        input.rankingProfile,
      resultCount:
        input.resultCount,
      executedAt:
        now,
      durationMilliseconds:
        input.durationMilliseconds,
    };

    await this.history.append(entry);

    if (input.savedSearchId) {
      const saved =
        await this.saved.get(
          input.ownerId,
          input.savedSearchId,
        );

      if (saved) {
        await this.saved.save({
          ...saved,
          updatedAt:
            now,
          lastExecutedAt:
            now,
        });
      }
    }

    return entry;
  }
}
