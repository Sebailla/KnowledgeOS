import assert from "node:assert/strict";
import {
  LibraryEventToSyncChangeMapper,
} from "../dist/index.js";

const change =
  new LibraryEventToSyncChangeMapper().map(
    {
      eventId: "event:1",
      transactionId: "tx:1",
      ownerId: "owner:1",
      sequence: 1,
      type: "object-created",
      objectId: "object:1",
      occurredAt: "2026-08-01T00:00:00.000Z",
      payload: {
        version: 1,
      },
    },
    "mac:1",
  );

assert.equal(change.kind, "object-upsert");
assert.equal(change.sequence, 1);

console.log(JSON.stringify({
  flow: "library-event-sync-mapping",
  status: "passed",
}));
