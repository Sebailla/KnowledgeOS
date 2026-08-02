import assert from "node:assert/strict";
import {
  InMemorySyncPlanLease,
  InMemorySyncPlanStore,
  SynchronizationWorker,
} from "../dist/index.js";

const store = new InMemorySyncPlanStore();
const lease = new InMemorySyncPlanLease();

await store.savePlan({
  planId: "sync-plan:0001",
  status: "pending",
  transferIds: [
    "sync-transfer:0001",
    "sync-transfer:0002",
  ],
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
});

for (const transferId of [
  "sync-transfer:0001",
  "sync-transfer:0002",
]) {
  await store.saveCheckpoint({
    transferId,
    planId: "sync-plan:0001",
    receivedBytes:
      transferId.endsWith("0001") ? 50 : 0,
    totalBytes: 100,
    completed: false,
    checksumVerified: false,
    updatedAt:
      "2026-08-01T00:00:00.000Z",
  });
}

let now = Date.parse(
  "2026-08-01T00:00:00.000Z",
);

const worker = new SynchronizationWorker(
  store,
  lease,
  {
    async execute(checkpoint) {
      return {
        ...checkpoint,
        receivedBytes: checkpoint.totalBytes,
        completed: true,
        checksumVerified: true,
        updatedAt:
          "2026-08-01T00:01:00.000Z",
      };
    },
  },
  {
    nowIso() {
      return new Date(now).toISOString();
    },
    nowMilliseconds() {
      now += 1000;
      return now;
    },
  },
  {
    ownerId: "sync-worker:server-1",
    leaseMilliseconds: 30_000,
  },
);

const result = await worker.executePlan(
  "sync-plan:0001",
);

assert.equal(result.status, "completed");
assert.equal(result.completedTransfers, 2);

const plan = await store.getPlan(
  "sync-plan:0001",
);
assert.equal(plan.status, "completed");

for (const transferId of plan.transferIds) {
  const checkpoint =
    await store.getCheckpoint(transferId);
  assert.equal(checkpoint.completed, true);
  assert.equal(
    checkpoint.checksumVerified,
    true,
  );
}

console.log(JSON.stringify({
  flow:
    "persistent-sync-plan-worker-resume-complete",
  status: "passed",
  completedTransfers:
    result.completedTransfers,
}));
