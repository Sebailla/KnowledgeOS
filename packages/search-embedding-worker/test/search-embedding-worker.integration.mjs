import assert from "node:assert/strict";
import {
  DeterministicLocalEmbeddingProvider,
} from "@knowledgeos/search-embedding";
import {
  InMemorySearchEmbeddingDocumentSourceRepository,
  InMemorySearchEmbeddingJobRepository,
} from "@knowledgeos/search-embedding-jobs";
import {
  SearchEmbeddingWorker,
} from "../dist/index.js";

const jobs =
  new InMemorySearchEmbeddingJobRepository();

await jobs.enqueue([{
  jobId:
    "job:worker-1",
  searchDocumentId:
    "search:worker-1",
  modelId:
    "deterministic-local-v1",
  contentFingerprint:
    "sha256:worker",
  status:
    "queued",
  attempts:
    0,
  maximumAttempts:
    3,
  priority:
    10,
  availableAt:
    "2026-08-01T00:00:00.000Z",
  createdAt:
    "2026-08-01T00:00:00.000Z",
  updatedAt:
    "2026-08-01T00:00:00.000Z",
}]);

const documents =
  new InMemorySearchEmbeddingDocumentSourceRepository();

documents.seed({
  searchDocumentId:
    "search:worker-1",
  text:
    "myocardial infarction",
  contentFingerprint:
    "sha256:worker",
});

const stored = [];

const clock = {
  nowIso() {
    return "2026-08-01T00:01:00.000Z";
  },
  addMilliseconds(
    iso,
    milliseconds,
  ) {
    return new Date(
      Date.parse(iso) +
      milliseconds,
    ).toISOString();
  },
};

const result =
  await new SearchEmbeddingWorker(
    jobs,
    documents,
    new DeterministicLocalEmbeddingProvider(
      64,
      clock,
    ),
    {
      async upsert(
        embedding,
      ) {
        stored.push(
          embedding,
        );
      },
    },
    clock,
  ).runBatch({
    limit:
      10,
    leaseId:
      "lease:worker-1",
    leaseMilliseconds:
      60_000,
    retryDelayMilliseconds:
      5_000,
  });

assert.equal(
  result.completed,
  1,
);
assert.equal(
  stored.length,
  1,
);
assert.equal(
  (
    await jobs.get(
      "job:worker-1",
    )
  ).status,
  "completed",
);

console.log(JSON.stringify({
  flow:
    "embedding-worker-lease-batch-store-complete",
  status:
    "passed",
}));
