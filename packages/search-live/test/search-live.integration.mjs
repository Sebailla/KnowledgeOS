import assert from "node:assert/strict";
import {
  InMemorySearchChangeEventRepository,
  InMemorySearchLiveSubscriptionRepository,
  InMemorySearchSnapshotRepository,
  LiveSearchService,
} from "../dist/index.js";

const events =
  new InMemorySearchChangeEventRepository();
const subscriptions =
  new InMemorySearchLiveSubscriptionRepository();
const snapshots =
  new InMemorySearchSnapshotRepository();

await subscriptions.save({
  subscriptionId:
    "subscription:1",
  ownerId:
    "owner:1",
  savedSearchId:
    "saved:1",
  lastSequence:
    0,
  active:
    true,
  createdAt:
    "2026-08-01T00:00:00.000Z",
  updatedAt:
    "2026-08-01T00:00:00.000Z",
});

await events.append({
  sequence:
    1,
  kind:
    "document-upserted",
  searchDocumentId:
    "search:1",
  occurredAt:
    "2026-08-01T00:01:00.000Z",
});

let execution = 0;

const service =
  new LiveSearchService(
    events,
    subscriptions,
    snapshots,
    {
      async executeSavedSearch() {
        execution += 1;
        return execution === 1
          ? ["search:1", "search:2"]
          : ["search:2", "search:3"];
      },
    },
    {
      nowIso() {
        return "2026-08-01T00:02:00.000Z";
      },
    },
  );

const first =
  await service.refresh(
    "subscription:1",
    100,
  );

assert.deepEqual(
  first.added,
  ["search:1", "search:2"],
);

await events.append({
  sequence:
    2,
  kind:
    "document-deleted",
  searchDocumentId:
    "search:1",
  occurredAt:
    "2026-08-01T00:03:00.000Z",
});

const second =
  await service.refresh(
    "subscription:1",
    100,
  );

assert.deepEqual(
  second.added,
  ["search:3"],
);
assert.deepEqual(
  second.removed,
  ["search:1"],
);
assert.deepEqual(
  second.retained,
  ["search:2"],
);

console.log(JSON.stringify({
  flow:
    "live-search-events-snapshot-delta",
  status:
    "passed",
}));
