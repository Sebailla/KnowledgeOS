import assert from "node:assert/strict";
import {
  normalizeSearchTerms,
  normalizeSearchText,
} from "../dist/index.js";

assert.equal(
  normalizeSearchText(
    "  Acute   coronary   syndrome  ",
  ),
  "Acute coronary syndrome",
);

assert.deepEqual(
  normalizeSearchTerms([
    " cardiology ",
    "research",
    "cardiology",
  ]),
  ["cardiology", "research"],
);

console.log(JSON.stringify({
  flow:
    "search-domain-normalization",
  status:
    "passed",
}));
