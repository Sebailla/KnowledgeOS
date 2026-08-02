import assert from "node:assert/strict";
import { SyncBatchPlanner } from "../dist/index.js";

const batch = new SyncBatchPlanner().plan({
  batchId: "batch:1",
  ownerId: "owner:1",
  sourceReplicaId: "mac:1",
  cursor: { replicaId: "mac:1", sequence: 0 },
  changes: [
    {
      changeId: "change:2",
      ownerId: "owner:1",
      replicaId: "mac:1",
      sequence: 2,
      kind: "object-upsert",
      entityId: "object:2",
      version: 1,
      payload: {},
      occurredAt: "2026-08-01T00:00:02.000Z",
    },
    {
      changeId: "change:1",
      ownerId: "owner:1",
      replicaId: "mac:1",
      sequence: 1,
      kind: "object-upsert",
      entityId: "object:1",
      version: 1,
      payload: {},
      occurredAt: "2026-08-01T00:00:01.000Z",
    },
  ],
  limit: 10,
  createdAt: "2026-08-01T00:01:00.000Z",
});

assert.deepEqual(
  batch.changes.map((change) => change.sequence),
  [1, 2],
);
assert.equal(batch.toSequence, 2);

console.log(JSON.stringify({
  flow: "sync-batch-planning",
  status: "passed",
}));
