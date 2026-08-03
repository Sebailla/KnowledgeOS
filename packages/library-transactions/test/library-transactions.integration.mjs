import assert from "node:assert/strict";
import {
  LibraryTransactionEngine,
} from "../dist/index.js";

const engine = new LibraryTransactionEngine();

const result = engine.apply(
  {
    objects: [],
    relationships: [],
    sequence: 0,
  },
  {
    transactionId: "tx:1",
    ownerId: "owner:1",
    createdAt: "2026-08-01T00:00:00.000Z",
    operations: [{
      kind: "create",
      object: {
        identity: {
          objectId: "object:1",
          ownerId: "owner:1",
          type: "document",
        },
        logicalPath: "/a.pdf",
        title: "A",
        contentHash: "sha256:a",
        version: 1,
        tags: [],
        metadata: {},
        createdAt: "2026-08-01T00:00:00.000Z",
        updatedAt: "2026-08-01T00:00:00.000Z",
      },
    }],
  },
);

assert.equal(result.state.objects.length, 1);
assert.equal(result.events[0].type, "object-created");
assert.equal(result.state.sequence, 1);

console.log(JSON.stringify({
  flow: "library-transaction-commit-events",
  status: "passed",
}));
