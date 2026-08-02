import assert from "node:assert/strict";
import {
  InMemorySearchDictionary,
  SearchQueryExpansionService,
  levenshteinDistance,
} from "../dist/index.js";

assert.equal(
  levenshteinDistance(
    "myocardial",
    "myocadial",
  ),
  1,
);

const service =
  new SearchQueryExpansionService(
    new InMemorySearchDictionary([
      {
        term:
          "myocardial",
        frequency:
          100,
      },
      {
        term:
          "myocardium",
        frequency:
          50,
      },
    ]),
    {
      "heart attack": [
        "myocardial infarction",
      ],
    },
  );

const typo =
  await service.expand(
    "myocadial",
  );

assert.equal(
  typo.alternatives[0].term,
  "myocardial",
);

const synonym =
  await service.expand(
    "heart attack",
  );

assert.equal(
  synonym.alternatives.some(
    (value) =>
      value.term ===
      "myocardial infarction",
  ),
  true,
);

console.log(JSON.stringify({
  flow:
    "search-fuzzy-distance-typo-synonym-expansion",
  status:
    "passed",
}));
