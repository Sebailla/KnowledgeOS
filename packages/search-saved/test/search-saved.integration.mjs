import assert from "node:assert/strict";
import {
  InMemorySavedSearchRepository,
  InMemorySearchHistoryRepository,
  SavedSearchService,
} from "../dist/index.js";

const saved =
  new InMemorySavedSearchRepository();
const history =
  new InMemorySearchHistoryRepository();

const service =
  new SavedSearchService(
    saved,
    history,
    {
      nowIso() {
        return "2026-08-01T00:00:00.000Z";
      },
    },
  );

await service.create({
  savedSearchId:
    "saved:1",
  ownerId:
    "owner:1",
  name:
    "Recent cardiology papers",
  query:
    "tag:cardiology kind:publication",
  rankingProfile:
    "recency",
  live:
    true,
});

await service.recordExecution({
  historyId:
    "history:1",
  ownerId:
    "owner:1",
  savedSearchId:
    "saved:1",
  query:
    "tag:cardiology kind:publication",
  rankingProfile:
    "recency",
  resultCount:
    12,
  durationMilliseconds:
    42,
});

assert.equal(
  (
    await saved.list(
      "owner:1",
    )
  )[0].lastExecutedAt,
  "2026-08-01T00:00:00.000Z",
);

assert.equal(
  (
    await history.listRecent(
      "owner:1",
      10,
    )
  ).length,
  1,
);

console.log(JSON.stringify({
  flow:
    "saved-search-history-execution",
  status:
    "passed",
}));
