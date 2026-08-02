import type {
  SearchChangeEventRepository,
  SearchLiveSubscriptionRepository,
  SearchSnapshotRepository,
} from "./contracts.js";
import type {
  SearchResultDelta,
} from "./model.js";
import {
  calculateSearchResultDelta,
} from "./delta.js";

export interface LiveSearchExecutor {
  executeSavedSearch(
    ownerId: string,
    savedSearchId: string,
  ): Promise<readonly string[]>;
}

export interface LiveSearchClock {
  nowIso(): string;
}

export class LiveSearchService {
  public constructor(
    private readonly events:
      SearchChangeEventRepository,
    private readonly subscriptions:
      SearchLiveSubscriptionRepository,
    private readonly snapshots:
      SearchSnapshotRepository,
    private readonly executor:
      LiveSearchExecutor,
    private readonly clock:
      LiveSearchClock,
  ) {}

  async refresh(
    subscriptionId: string,
    eventLimit: number,
  ): Promise<
    SearchResultDelta | undefined
  > {
    const subscription =
      await this.subscriptions.get(
        subscriptionId,
      );

    if (
      !subscription ||
      !subscription.active
    ) {
      return undefined;
    }

    const events =
      await this.events.listAfter(
        subscription.lastSequence,
        eventLimit,
      );

    if (events.length === 0) {
      return undefined;
    }

    const toSequence =
      events.reduce(
        (maximum, event) =>
          Math.max(
            maximum,
            event.sequence,
          ),
        subscription.lastSequence,
      );

    const previous =
      await this.snapshots.getLatest(
        subscriptionId,
      );

    const currentIds =
      await this.executor.executeSavedSearch(
        subscription.ownerId,
        subscription.savedSearchId,
      );

    const delta =
      calculateSearchResultDelta({
        subscriptionId,
        fromSequence:
          subscription.lastSequence,
        toSequence,
        previous:
          previous?.resultIds ?? [],
        current:
          currentIds,
      });

    const now =
      this.clock.nowIso();

    await this.snapshots.save({
      subscriptionId,
      sequence:
        toSequence,
      resultIds:
        [...currentIds],
      createdAt:
        now,
    });

    await this.subscriptions.save({
      ...subscription,
      lastSequence:
        toSequence,
      updatedAt:
        now,
    });

    return delta;
  }
}
