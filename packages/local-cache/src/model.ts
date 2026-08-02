import type {
  LocalPublicationRecord,
} from "@knowledgeos/local-library";

export interface LocalCachePolicy {
  readonly maximumOfflineBytes: number;
  readonly minimumFreeBytes: number;
  readonly preserveRecentlyAccessedCount: number;
}

export interface LocalCacheDecision {
  readonly keep:
    readonly LocalPublicationRecord[];
  readonly evict:
    readonly LocalPublicationRecord[];
  readonly projectedOfflineBytes: number;
}
