import type {
  SearchChangeEvent,
  SearchLiveSubscription,
  SearchResultSnapshot,
} from "./model.js";

export interface SearchChangeEventRepository {
  append(
    event: SearchChangeEvent,
  ): Promise<void>;

  listAfter(
    sequence: number,
    limit: number,
  ): Promise<readonly SearchChangeEvent[]>;
}

export interface SearchLiveSubscriptionRepository {
  get(
    subscriptionId: string,
  ): Promise<SearchLiveSubscription | undefined>;

  save(
    value: SearchLiveSubscription,
  ): Promise<void>;

  listActive(): Promise<
    readonly SearchLiveSubscription[]
  >;
}

export interface SearchSnapshotRepository {
  getLatest(
    subscriptionId: string,
  ): Promise<SearchResultSnapshot | undefined>;

  save(
    snapshot: SearchResultSnapshot,
  ): Promise<void>;
}
