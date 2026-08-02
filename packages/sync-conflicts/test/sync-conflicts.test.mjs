import assert from "node:assert/strict";
import {
  LastWriterWinsResolver,
  SyncConflictDetector,
} from "../dist/index.js";

const local = {
  changeId: "local",
  ownerId: "owner:1",
  replicaId: "mac:1",
  sequence: 2,
  kind: "object-upsert",
  entityId: "object:1",
  version: 2,
  contentHash: "sha256:a",
  payload: {},
  occurredAt: "2026-08-01T00:00:02.000Z",
};

const remote = {
  ...local,
  changeId: "remote",
  replicaId: "nas:1",
  sequence: 3,
  contentHash: "sha256:b",
  occurredAt: "2026-08-01T00:00:03.000Z",
};

const conflict =
  new SyncConflictDetector({
    nowIso() {
      return "2026-08-01T00:01:00.000Z";
    },
  }).detect(local, remote);

assert.equal(conflict.reason, "hash-diverged");
assert.equal(
  new LastWriterWinsResolver().resolve(conflict).changeId,
  "remote",
);

console.log(JSON.stringify({
  flow: "sync-conflict-detection-resolution",
  status: "passed",
}));
