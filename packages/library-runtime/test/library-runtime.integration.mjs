import assert from "node:assert/strict";
import { LibraryRuntime } from "../dist/index.js";

const objects = [];
const relationships = [];
const events = [];
const snapshots = [];

const runtime = new LibraryRuntime(
  {
    async loadState() {
      return {
        objects,
        relationships,
        sequence: events.at(-1)?.sequence ?? 0,
      };
    },
    async saveObject(object) {
      const index = objects.findIndex(
        (value) =>
          value.identity.objectId === object.identity.objectId,
      );
      if (index < 0) objects.push(object);
      else objects[index] = object;
    },
    async saveRelationship(relationship) {
      if (
        !relationships.some(
          (value) =>
            value.relationshipId ===
            relationship.relationshipId,
        )
      ) {
        relationships.push(relationship);
      }
    },
    async appendEvents(values) {
      events.push(...values);
    },
    async saveSnapshot(snapshot) {
      snapshots.push(snapshot);
    },
  },
  {
    nowIso() {
      return "2026-08-01T00:10:00.000Z";
    },
  },
);

await runtime.commit({
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
});

const snapshot =
  await runtime.snapshot(
    "owner:1",
    "snapshot:1",
  );

assert.equal(objects.length, 1);
assert.equal(events.length, 1);
assert.equal(snapshot.sequence, 1);
assert.equal(snapshots.length, 1);

console.log(JSON.stringify({
  flow: "library-runtime-commit-snapshot",
  status: "passed",
}));
