import assert from "node:assert/strict";
import {
  compileSearchQuery,
  parseSearchQuery,
} from "../dist/index.js";

const parsed =
  parseSearchQuery(
    'title:"acute coronary syndrome" AND tag:cardiology NOT author:"John Doe" updated:[2025-01-01 TO 2026-12-31]',
  );

const compiled =
  compileSearchQuery(
    parsed.root,
  );

assert.equal(
  compiled.ftsMatch.includes(
    'title:"acute coronary syndrome"',
  ),
  true,
);

assert.equal(
  compiled.ftsMatch.includes(
    'tags:"cardiology"',
  ),
  true,
);

assert.equal(
  compiled.ftsMatch.includes(
    'NOT (authors:"John Doe")',
  ),
  true,
);

assert.deepEqual(
  compiled.whereSql,
  [
    "updated_at >= ?",
    "updated_at <= ?",
  ],
);

assert.deepEqual(
  compiled.parameters,
  [
    "2025-01-01",
    "2026-12-31",
  ],
);

const prefix =
  compileSearchQuery(
    parseSearchQuery(
      "myocard*",
    ).root,
  );

assert.equal(
  prefix.ftsMatch,
  '"myocard"*',
);

console.log(JSON.stringify({
  flow:
    "search-query-tokenize-parse-compile",
  status:
    "passed",
}));
