import assert from "node:assert/strict";
import { LibraryIntegrityChecker } from "../dist/index.js";

const issues = new LibraryIntegrityChecker().check(
  [],
  [{
    relationshipId: "rel:1",
    ownerId: "owner:1",
    fromObjectId: "missing:1",
    toObjectId: "missing:2",
    type: "reference",
    createdAt: "2026-08-01T00:00:00.000Z",
  }],
);

assert.deepEqual(
  issues.map((issue) => issue.code),
  ["broken-relationship-source", "broken-relationship-target"],
);

console.log(JSON.stringify({
  flow: "library-integrity",
  status: "passed",
}));
