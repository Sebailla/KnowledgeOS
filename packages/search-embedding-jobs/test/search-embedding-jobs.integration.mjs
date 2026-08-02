import assert from "node:assert/strict";
import {
  InMemorySearchEmbeddingJobRepository,
  InMemorySearchEmbeddingStateRepository,
  SearchEmbeddingJobPlanner,
  SearchEmbeddingModelMigrationService,
} from "../dist/index.js";

const state =
  new InMemorySearchEmbeddingStateRepository();
state.seed(
  "search:1",
  "model:v1",
  "sha256:old",
);

const planner =
  new SearchEmbeddingJobPlanner(
    state,
    {
      nowIso() {
        return "2026-08-01T00:00:00.000Z";
      },
    },
  );

assert.equal(
  await planner.plan({
    searchDocumentId:
      "search:1",
    modelId:
      "model:v1",
    contentFingerprint:
      "sha256:old",
  }),
  undefined,
);

const stale =
  await planner.plan({
    searchDocumentId:
      "search:1",
    modelId:
      "model:v1",
    contentFingerprint:
      "sha256:new",
  });

assert.equal(
  stale.status,
  "queued",
);

const jobs =
  new InMemorySearchEmbeddingJobRepository();

const migration =
  await new SearchEmbeddingModelMigrationService(
    state,
    jobs,
  ).migrate({
    fromModelId:
      "model:v1",
    toModelId:
      "model:v2",
    documents: [{
      searchDocumentId:
        "search:1",
      contentFingerprint:
        "sha256:new",
    }],
    nowIso:
      "2026-08-01T00:01:00.000Z",
  });

assert.equal(
  migration.removedEmbeddings,
  1,
);
assert.equal(
  migration.queuedJobs,
  1,
);

console.log(JSON.stringify({
  flow:
    "embedding-stale-detection-model-migration",
  status:
    "passed",
}));
