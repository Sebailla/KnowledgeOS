import assert from "node:assert/strict";
import { InMemoryLibraryJournal } from "../dist/index.js";

const journal = new InMemoryLibraryJournal();

await journal.append([{
  eventId: "event:1",
  transactionId: "tx:1",
  ownerId: "owner:1",
  sequence: 1,
  type: "object-created",
  objectId: "object:1",
  occurredAt: "2026-08-01T00:00:00.000Z",
  payload: {},
}]);

assert.equal(
  (await journal.listAfter("owner:1", 0)).length,
  1,
);

console.log(JSON.stringify({
  flow: "library-journal",
  status: "passed",
}));
