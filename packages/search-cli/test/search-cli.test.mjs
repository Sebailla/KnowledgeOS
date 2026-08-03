import assert from "node:assert/strict";
import {
  formatSearchCliResponse,
  parseSearchCliArguments,
} from "../dist/index.js";

const command =
  parseSearchCliArguments([
    "heart",
    "attack",
    "--mode",
    "graph",
    "--profile",
    "precision",
    "--limit",
    "10",
    "--facets",
    "--explain",
    "--format",
    "json",
  ]);

assert.equal(
  command.request.query,
  "heart attack",
);
assert.equal(
  command.request.mode,
  "graph",
);
assert.equal(
  command.request.includeExplanation,
  true,
);

const formatted =
  formatSearchCliResponse(
    {
      query:
        "heart attack",
      mode:
        "hybrid",
      results: [{
        searchDocumentId:
          "search:1",
        title:
          "Myocardial Infarction",
        kind:
          "publication",
        finalScore:
          2.5,
      }],
      total:
        1,
      durationMilliseconds:
        4,
    },
    "table",
  );

assert.equal(
  formatted.includes(
    "Myocardial Infarction",
  ),
  true,
);

console.log(JSON.stringify({
  flow:
    "search-cli-parse-format",
  status:
    "passed",
}));
