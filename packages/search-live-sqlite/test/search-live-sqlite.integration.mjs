import assert from "node:assert/strict";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import {
  tmpdir,
} from "node:os";
import {
  join,
} from "node:path";
import {
  NodeSqliteDatabase,
} from "@knowledgeos/local-sqlite-node";
import {
  localLibraryMigrations,
} from "@knowledgeos/local-library-sqlite";
import {
  searchLiveSqliteMigrations,
  SqliteSavedSearchRepository,
  SqliteSearchChangeEventRepository,
  SqliteSearchLiveSubscriptionRepository,
  SqliteSearchSnapshotRepository,
} from "../dist/index.js";
import {
  LiveSearchService,
} from "@knowledgeos/search-live";

const root =
  await mkdtemp(
    join(
      tmpdir(),
      "knowledgeos-search-live-",
    ),
  );

const path =
  join(
    root,
    "live.sqlite",
  );

try {
  const database =
    new NodeSqliteDatabase({
      path,
    });

  database.migrate([
    ...localLibraryMigrations,
    ...searchLiveSqliteMigrations,
  ]);

  const saved =
    new SqliteSavedSearchRepository(
      database,
    );
  const events =
    new SqliteSearchChangeEventRepository(
      database,
    );
  const subscriptions =
    new SqliteSearchLiveSubscriptionRepository(
      database,
    );
  const snapshots =
    new SqliteSearchSnapshotRepository(
      database,
    );

  await saved.save({
    savedSearchId:
      "saved:sqlite",
    ownerId:
      "owner:1",
    name:
      "Live cardiology",
    query:
      "tag:cardiology",
    rankingProfile:
      "balanced",
    live:
      true,
    createdAt:
      "2026-08-01T00:00:00.000Z",
    updatedAt:
      "2026-08-01T00:00:00.000Z",
  });

  await subscriptions.save({
    subscriptionId:
      "subscription:sqlite",
    ownerId:
      "owner:1",
    savedSearchId:
      "saved:sqlite",
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
      "embedding-updated",
    searchDocumentId:
      "search:1",
    occurredAt:
      "2026-08-01T00:01:00.000Z",
  });

  const delta =
    await new LiveSearchService(
      events,
      subscriptions,
      snapshots,
      {
        async executeSavedSearch() {
          return ["search:1"];
        },
      },
      {
        nowIso() {
          return "2026-08-01T00:02:00.000Z";
        },
      },
    ).refresh(
      "subscription:sqlite",
      100,
    );

  assert.deepEqual(
    delta.added,
    ["search:1"],
  );

  database.close();

  const reopened =
    new NodeSqliteDatabase({
      path,
    });

  const latest =
    await new SqliteSearchSnapshotRepository(
      reopened,
    ).getLatest(
      "subscription:sqlite",
    );

  assert.equal(
    latest.sequence,
    1,
  );

  reopened.close();

  console.log(JSON.stringify({
    flow:
      "sqlite-saved-live-subscription-snapshot-reopen",
    status:
      "passed",
  }));
} finally {
  await rm(
    root,
    {
      recursive: true,
      force: true,
    },
  );
}
