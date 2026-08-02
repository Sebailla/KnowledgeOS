import assert from "node:assert/strict";
import { SearchMaintenanceScheduler } from "../dist/index.js";

const scheduler = new SearchMaintenanceScheduler();
scheduler.schedule({
  jobId: "low",
  kind: "cleanup",
  priority: 1,
  scheduledAt: "2026-08-01T00:00:00.000Z",
  payload: {},
});
scheduler.schedule({
  jobId: "high",
  kind: "reindex",
  priority: 10,
  scheduledAt: "2026-08-01T00:00:00.000Z",
  payload: {},
});

assert.equal(scheduler.next("2026-08-01T00:01:00.000Z").jobId, "high");

console.log(JSON.stringify({ flow: "search-maintenance-scheduling", status: "passed" }));
