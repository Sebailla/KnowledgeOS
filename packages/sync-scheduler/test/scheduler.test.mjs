import assert from "node:assert/strict";
import {
  ExponentialBackoffPolicy,
  SyncScheduler,
} from "../dist/index.js";

let active = 0;
let maximumObserved = 0;
const completed = [];

const scheduler =
  new SyncScheduler(
    2,
    {
      async execute(planId) {
        active += 1;
        maximumObserved =
          Math.max(
            maximumObserved,
            active,
          );

        await new Promise(
          (resolve) =>
            setTimeout(resolve, 10),
        );

        completed.push(planId);
        active -= 1;
      },
    },
  );

for (const [index, priority] of [
  [1, 1],
  [2, 3],
  [3, 2],
]) {
  scheduler.enqueue({
    jobId: `job:${index}`,
    planId: `plan:${index}`,
    priority,
    enqueuedAt:
      `2026-08-01T00:00:0${index}.000Z`,
    status: "queued",
    attempts: 0,
  });
}

await scheduler.drain();

assert.equal(
  maximumObserved,
  2,
);
assert.equal(
  scheduler.list().every(
    (job) =>
      job.status === "completed",
  ),
  true,
);

const retry =
  new ExponentialBackoffPolicy()
    .decide(
      2,
      {
        maximumAttempts: 5,
        initialDelayMilliseconds: 100,
        maximumDelayMilliseconds: 10_000,
        multiplier: 2,
      },
      0.5,
    );

assert.equal(
  retry.retry,
  true,
);
assert.ok(
  retry.delayMilliseconds >= 200,
);

console.log(JSON.stringify({
  flow:
    "sync-scheduler-priority-concurrency-retry",
  status:
    "passed",
  maximumObserved,
  completed:
    completed.length,
}));
