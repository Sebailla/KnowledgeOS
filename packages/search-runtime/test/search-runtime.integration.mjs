import assert from "node:assert/strict";
import {
  InMemorySearchDictionary,
  SearchQueryExpansionService,
} from "@knowledgeos/search-fuzzy";
import {
  parseSearchQuery,
} from "@knowledgeos/search-query";
import {
  SearchRuntime,
} from "../dist/index.js";

const runtime =
  new SearchRuntime(
    {
      async search() {
        return [
          {
            searchDocumentId:
              "search:2",
            title:
              "Recent note",
            kind:
              "personal-knowledge",
            updatedAt:
              "2026-07-31T00:00:00.000Z",
            lexicalScore:
              0.6,
            titleMatch:
              false,
            exactPhraseMatch:
              false,
            fuzzyApplied:
              true,
          },
          {
            searchDocumentId:
              "search:1",
            title:
              "Myocardial Infarction",
            kind:
              "publication",
            updatedAt:
              "2026-06-01T00:00:00.000Z",
            lexicalScore:
              0.9,
            titleMatch:
              true,
            exactPhraseMatch:
              true,
            fuzzyApplied:
              false,
          },
        ];
      },
    },
    new SearchQueryExpansionService(
      new InMemorySearchDictionary([
        {
          term:
            "myocardial",
          frequency:
            100,
        },
      ]),
      {},
    ),
  );

const response =
  await runtime.execute(
    parseSearchQuery(
      "myocadial",
    ),
    "precision",
    new Date(
      "2026-08-01T00:00:00.000Z",
    ),
  );

assert.equal(
  response.results[0]
    .searchDocumentId,
  "search:1",
);

assert.equal(
  response.expandedTerms.includes(
    "myocardial",
  ),
  true,
);

console.log(JSON.stringify({
  flow:
    "search-runtime-expansion-ranking-explanation",
  status:
    "passed",
}));
