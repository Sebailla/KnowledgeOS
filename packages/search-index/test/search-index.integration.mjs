import assert from "node:assert/strict";
import {
  IncrementalSearchIndexPipeline,
  InMemorySearchCheckpointRepository,
  InMemorySearchCommandRepository,
  InMemorySearchDocumentRepository,
  PassthroughSearchUnitOfWork,
  SearchDocumentExtractor,
} from "../dist/index.js";

const extractor =
  new SearchDocumentExtractor();

const publication =
  extractor.fromPublication({
    searchDocumentId:
      "search:publication-1",
    knowledgeObjectId:
      "knowledge-object:1",
    publicationId:
      "publication:1",
    versionId:
      "version:1",
    title:
      "  Acute  Coronary Syndrome ",
    text:
      " Myocardial infarction and ischemic heart disease. ",
    tags:
      ["cardiology", "research", "cardiology"],
    authors:
      ["Author A"],
    updatedAt:
      "2026-08-01T00:00:00.000Z",
  });

const commands =
  new InMemorySearchCommandRepository();
const documents =
  new InMemorySearchDocumentRepository();
const checkpoints =
  new InMemorySearchCheckpointRepository();

await commands.append([
  {
    operation:
      "upsert",
    document:
      publication,
    sequence:
      1,
    occurredAt:
      "2026-08-01T00:00:00.000Z",
  },
]);

const result =
  await new IncrementalSearchIndexPipeline(
    commands,
    documents,
    checkpoints,
    new PassthroughSearchUnitOfWork(),
    {
      nowIso() {
        return "2026-08-01T00:01:00.000Z";
      },
    },
  ).run(
    "search-indexer",
    100,
  );

assert.equal(
  result.processed,
  1,
);
assert.equal(
  result.lastSequence,
  1,
);

const indexed =
  await documents.get(
    publication.searchDocumentId,
  );

assert.equal(
  indexed.title,
  "Acute Coronary Syndrome",
);
assert.deepEqual(
  indexed.tags,
  ["cardiology", "research"],
);

console.log(JSON.stringify({
  flow:
    "search-extraction-incremental-index-checkpoint",
  status:
    "passed",
}));
