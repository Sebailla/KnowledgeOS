import assert from "node:assert/strict";
import test from "node:test";

import {
  InMemoryLeasedJobRepository,
  type ProcessingJobRequest,
} from "../src/index.js";

const request: ProcessingJobRequest = {
  operationId: "operation:processing-1",
  correlationId: "correlation:processing-1",
  publicationId: "publication:processing-1",
  versionId: "version:processing-1",
};

test("expired lease resumes from the durable checkpoint with a new lease", async () => {
  const jobs = new InMemoryLeasedJobRepository();
  await jobs.enqueue(request);
  const first = await jobs.claim("worker:one", new Date("2026-08-10T00:00:00.000Z"), 1_000);
  assert.equal(first?.operationId, request.operationId);
  await jobs.checkpoint(first!.leaseId!, "validated", new Date("2026-08-10T00:00:00.100Z"));

  const resumed = await jobs.claim("worker:two", new Date("2026-08-10T00:00:01.000Z"), 1_000);
  assert.equal(resumed?.checkpoint, "validated");
  assert.equal(resumed?.correlationId, request.correlationId);
  assert.equal(resumed?.leaseOwner, "worker:two");
});

test("duplicate retry preserves one operation and completed jobs cannot be reclaimed", async () => {
  const jobs = new InMemoryLeasedJobRepository();
  const first = await jobs.enqueue(request);
  const repeated = await jobs.enqueue({ ...request, correlationId: "correlation:retry" });
  assert.equal(first.operationId, repeated.operationId);
  assert.equal(repeated.correlationId, request.correlationId);

  const lease = await jobs.claim("worker:one", new Date("2026-08-10T00:00:00.000Z"), 1_000);
  await jobs.complete(lease!.leaseId!, new Date("2026-08-10T00:00:00.100Z"));
  assert.equal(await jobs.claim("worker:two", new Date("2026-08-10T00:00:02.000Z"), 1_000), undefined);
});

test("a stale lease cannot checkpoint or complete a job after recovery", async () => {
  const jobs = new InMemoryLeasedJobRepository();
  await jobs.enqueue(request);
  const original = await jobs.claim("worker:one", new Date("2026-08-10T00:00:00.000Z"), 1_000);
  const replacement = await jobs.claim("worker:two", new Date("2026-08-10T00:00:01.000Z"), 1_000);

  await assert.rejects(
    () => jobs.checkpoint(original!.leaseId!, "promoted", new Date("2026-08-10T00:00:01.100Z")),
    /lease/,
  );
  await jobs.complete(replacement!.leaseId!, new Date("2026-08-10T00:00:01.100Z"));
  await assert.rejects(
    () => jobs.complete(replacement!.leaseId!, new Date("2026-08-10T00:00:01.200Z")),
    /lease/,
  );
});
