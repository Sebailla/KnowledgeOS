import assert from "node:assert/strict";
import { InMemorySyncTransport } from "../dist/index.js";

const transport = new InMemorySyncTransport();

await transport.push({
  batchId: "batch:1",
  ownerId: "owner:1",
  sourceReplicaId: "nas:1",
  fromSequence: 0,
  toSequence: 1,
  createdAt: "2026-08-01T00:00:00.000Z",
  changes: [{
    changeId: "change:1",
    ownerId: "owner:1",
    replicaId: "nas:1",
    sequence: 1,
    kind: "object-upsert",
    entityId: "object:1",
    version: 1,
    payload: {},
    occurredAt: "2026-08-01T00:00:00.000Z",
  }],
});

const batch = await transport.pull(
  "owner:1",
  "mac:1",
  { replicaId: "nas:1", sequence: 0 },
  10,
);

assert.equal(batch.changes.length, 1);

console.log(JSON.stringify({
  flow: "sync-transport-push-pull",
  status: "passed",
}));
