import assert from "node:assert/strict";
import { LibraryRecoveryEngine } from "../dist/index.js";

const result = new LibraryRecoveryEngine().recover(
  {
    snapshotId: "snapshot:1",
    ownerId: "owner:1",
    sequence: 1,
    objects: [],
    relationships: [],
    createdAt: "2026-08-01T00:00:00.000Z",
  },
  [{
    eventId: "event:2",
    transactionId: "tx:2",
    ownerId: "owner:1",
    sequence: 2,
    type: "object-created",
    occurredAt: "2026-08-01T00:01:00.000Z",
    payload: {},
  }],
);

assert.equal(result.finalSequence, 2);
assert.deepEqual(result.replayedEventIds, ["event:2"]);

console.log(JSON.stringify({
  flow: "library-recovery",
  status: "passed",
}));
