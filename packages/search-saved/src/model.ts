export interface SavedSearch {
  readonly savedSearchId: string;
  readonly ownerId: string;
  readonly name: string;
  readonly query: string;
  readonly rankingProfile:
    | "balanced"
    | "precision"
    | "recency"
    | "personal";
  readonly live: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastExecutedAt?: string;
}

export interface SearchHistoryEntry {
  readonly historyId: string;
  readonly ownerId: string;
  readonly query: string;
  readonly rankingProfile: string;
  readonly resultCount: number;
  readonly executedAt: string;
  readonly durationMilliseconds: number;
}
