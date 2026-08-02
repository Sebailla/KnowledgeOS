import assert from "node:assert/strict";
import {
  DeterministicLocalEmbeddingProvider,
} from "@knowledgeos/search-embedding";
import {
  HybridSearchRuntime,
} from "../dist/index.js";

const runtime =
  new HybridSearchRuntime(
    {
      async search() {
        return [
          {
            searchDocumentId:
              "search:lexical-first",
            score:
              1,
          },
          {
            searchDocumentId:
              "search:shared",
            score:
              0.8,
          },
        ];
      },
    },
    {
      async search() {
        return [
          {
            searchDocumentId:
              "search:semantic-first",
            score:
              0.95,
          },
          {
            searchDocumentId:
              "search:shared",
            score:
              0.9,
          },
        ];
      },
    },
    new DeterministicLocalEmbeddingProvider(
      64,
      {
        nowIso() {
          return "2026-08-01T00:00:00.000Z";
        },
      },
    ),
  );

const results =
  await runtime.search(
    "heart attack",
    10,
  );

assert.equal(
  results[0].searchDocumentId,
  "search:shared",
);

assert.equal(
  results[0].lexicalScore >
    0 &&
  results[0].semanticScore >
    0,
  true,
);

console.log(JSON.stringify({
  flow:
    "hybrid-lexical-semantic-reciprocal-rank-fusion",
  status:
    "passed",
}));
