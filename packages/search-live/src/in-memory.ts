import type {
  SearchChangeEventRepository,
  SearchLiveSubscriptionRepository,
  SearchSnapshotRepository,
} from "./contracts.js";
import type {
  SearchChangeEvent,
  SearchLiveSubscription,
  SearchResultSnapshot,
} from "./model.js";

export class InMemorySearchChangeEventRepository
implements SearchChangeEventRepository {
  private readonly values:
    SearchChangeEvent[] = [];

  async append(
    event: SearchChangeEvent,
  ): Promise<void> {
    this.values.push(event);
    this.values.sort(
      (a, b) =>
        a.sequence - b.sequence,
    );
  }

  async listAfter(
    sequence: number,
    limit: number,
  ) {
    return this.values
      .filter(
        (value) =>
          value.sequence >
          sequence,
      )
      .slice(0, limit);
  }
}

export class InMemorySearchLiveSubscriptionRepository
implements SearchLiveSubscriptionRepository {
  private readonly values =
    new Map<string, SearchLiveSubscription>();

  async get(
    subscriptionId: string,
  ) {
    return this.values.get(
      subscriptionId,
    );
  }

  async save(
    value: SearchLiveSubscription,
  ): Promise<void> {
    this.values.set(
      value.subscriptionId,
      value,
    );
  }

  async listActive() {
    return [
      ...this.values.values(),
    ].filter(
      (value) =>
        value.active,
    );
  }
}

export class InMemorySearchSnapshotRepository
implements SearchSnapshotRepository {
  private readonly values =
    new Map<string, SearchResultSnapshot[]>();

  async getLatest(
    subscriptionId: string,
  ) {
    const list =
      this.values.get(
        subscriptionId,
      ) ?? [];

    return [...list]
      .sort(
        (a, b) =>
          b.sequence - a.sequence,
      )[0];
  }

  async save(
    snapshot: SearchResultSnapshot,
  ): Promise<void> {
    const list =
      this.values.get(
        snapshot.subscriptionId,
      ) ?? [];

    list.push(snapshot);
    this.values.set(
      snapshot.subscriptionId,
      list,
    );
  }
}
