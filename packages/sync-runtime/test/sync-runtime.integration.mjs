import assert from "node:assert/strict";
import {
  InMemorySyncTransport,
} from "@knowledgeos/sync-transport";
import {
  SyncRuntime,
} from "../dist/index.js";

const changes = [];
const cursors = new Map();
const conflicts = [];
const applied = new Map();

const repository = {
  async appendChange(change) {
    if (!changes.some((value) => value.changeId === change.changeId)) {
      changes.push(change);
    }
  },
  async listAfter(ownerId, replicaId, sequence, limit) {
    return changes
      .filter(
        (change) =>
          change.ownerId === ownerId &&
          change.replicaId === replicaId &&
          change.sequence > sequence,
      )
      .sort((a, b) => a.sequence - b.sequence)
      .slice(0, limit);
  },
  async saveCursor(ownerId, targetReplicaId, cursor) {
    cursors.set(
      `${ownerId}:${targetReplicaId}:${cursor.replicaId}`,
      cursor,
    );
  },
  async getCursor(ownerId, targetReplicaId, sourceReplicaId) {
    return (
      cursors.get(
        `${ownerId}:${targetReplicaId}:${sourceReplicaId}`,
      ) ?? {
        replicaId: sourceReplicaId,
        sequence: 0,
      }
    );
  },
  async saveConflict(conflict) {
    conflicts.push(conflict);
  },
};

const transport =
  new InMemorySyncTransport();

await transport.push({
  batchId: "batch:remote",
  ownerId: "owner:1",
  sourceReplicaId: "nas:1",
  fromSequence: 0,
  toSequence: 1,
  createdAt: "2026-08-01T00:00:00.000Z",
  changes: [{
    changeId: "change:remote:1",
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

const runtime =
  new SyncRuntime(
    repository,
    transport,
    {
      async current(ownerId, entityId) {
        return applied.get(`${ownerId}:${entityId}`);
      },
      async apply(change) {
        applied.set(
          `${change.ownerId}:${change.entityId}`,
          change,
        );
      },
    },
    {
      nowIso() {
        return "2026-08-01T00:01:00.000Z";
      },
    },
  );

const result =
  await runtime.pullAndApply({
    ownerId: "owner:1",
    localReplicaId: "mac:1",
    remoteReplicaId: "nas:1",
    limit: 10,
  });

assert.deepEqual(
  result.appliedChangeIds,
  ["change:remote:1"],
);
assert.equal(result.cursor.sequence, 1);

console.log(JSON.stringify({
  flow: "sync-runtime-pull-apply",
  status: "passed",
}));
