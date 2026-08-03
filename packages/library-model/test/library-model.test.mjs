import assert from "node:assert/strict";
import {
  LibraryObjectValidator,
  canonicalizeLibraryObject,
} from "../dist/index.js";

const object = canonicalizeLibraryObject({
  identity: {
    objectId: "object:1",
    ownerId: "owner:1",
    type: "document",
  },
  logicalPath: "//papers//a.pdf",
  title: "  A   Paper ",
  contentHash: "sha256:a",
  version: 1,
  tags: ["Cardiology", "cardiology"],
  metadata: {},
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
});

assert.equal(object.logicalPath, "/papers/a.pdf");
assert.equal(object.title, "A Paper");
assert.deepEqual(object.tags, ["cardiology"]);
assert.deepEqual(new LibraryObjectValidator().validate(object), []);

console.log(JSON.stringify({
  flow: "library-model-validation-canonicalization",
  status: "passed",
}));
