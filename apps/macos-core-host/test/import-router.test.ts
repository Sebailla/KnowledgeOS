import assert from "node:assert/strict";
import test from "node:test";

import {
  createInMemoryCore,
} from "@knowledgeos/core";
import {
  CoreRouter,
} from "../src/router.js";
import {
  createHash,
} from "node:crypto";
import {
  mkdtemp,
  mkdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { StagedSourceResolver } from "../src/stagedSourceResolver.js";

const request = (capability: string, sha256: string) => ({
  contractVersion: 2 as const,
  operationId: "operation-1",
  idempotencyKey: "key-1",
  source: { kind: "staged-file" as const, capability },
  name: "notes.md",
  byteLength: 5,
  sha256,
});

test("rejects legacy, missing-version, bytes, and path requests", async () => {
  const router = new CoreRouter(createInMemoryCore());
  for (const params of [
    { name: "notes.md", content: "bytes" },
    { contractVersion: 1, name: "notes.md", content: "bytes" },
    { contractVersion: 2, source: { kind: "staged-file", capability: "x" }, path: "/tmp/x" },
    { contractVersion: 2, source: { kind: "staged-file", capability: "x" }, bytes: "bytes" },
  ]) {
    await assert.rejects(() => router.dispatch("import.start", params));
  }
});

test("queues a validated source until its idempotent explicit release", async () => {
  const root = await mkdtemp(join(tmpdir(), "knowledgeos-import-"));
  const capability = "valid-capability-token";
  const entry = join(root, capability);
  const source = join(entry, "source");
  const digest = createHash("sha256").update("hello").digest("hex");
  await mkdir(entry);
  await writeFile(source, "hello", "utf8");
  const resolver = new StagedSourceResolver(root);
  const router = new CoreRouter(createInMemoryCore(), resolver);
  try {
    const queued = await router.dispatch("import.start", request(capability, digest)) as { state: string; leaseId: string };
    assert.equal(queued.state, "ProcessingQueued");
    assert.equal(resolver.leaseCount(), 1);
    await router.dispatch("import.release", { leaseId: queued.leaseId });
    await router.dispatch("import.release", { leaseId: queued.leaseId });
    assert.equal(resolver.leaseCount(), 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("fails closed for invalid staged sources without transferring ownership", async () => {
  const root = await mkdtemp(join(tmpdir(), "knowledgeos-import-"));
  const capability = "capability-token";
  const entry = join(root, capability);
  const source = join(entry, "source");
  const digest = createHash("sha256").update("hello").digest("hex");
  await mkdir(entry);
  await writeFile(source, "hello", "utf8");
  const resolver = new StagedSourceResolver(root, () => new Date("2026-08-07T00:00:00.000Z"));
  try {
    for (const mutate of [
      async () => request("../escape", digest),
      async () => { await rm(source, {}); await symlink("/etc/passwd", source); return request(capability, digest); },
      async () => { await rm(source, {}); await mkdir(source); return request(capability, digest); },
      async () => request(capability, "0".repeat(64)),
      async () => { await rm(source, {}); await writeFile(source, "hello"); await writeFile(join(entry, "metadata.json"), "{"); return request(capability, digest); },
      async () => { await rm(join(entry, "metadata.json"), { force: true }); await writeFile(join(entry, "metadata.json"), JSON.stringify({ expiresAt: "2020-01-01T00:00:00.000Z" })); return request(capability, digest); },
    ]) {
      const invalid = await mutate();
      await assert.rejects(() => resolver.accept(invalid));
      assert.equal(resolver.leaseCount(), 0);
      await rm(source, { recursive: true, force: true });
      await writeFile(source, "hello");
    }
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("fails closed when the source is swapped to a symlink after validation", async () => {
  const root = await mkdtemp(join(tmpdir(), "knowledgeos-import-"));
  const capability = "swap-capability-token";
  const entry = join(root, capability);
  const source = join(entry, "source");
  const digest = createHash("sha256").update("hello").digest("hex");
  await mkdir(entry);
  await writeFile(source, "hello", "utf8");
  const resolver = new StagedSourceResolver(root, () => new Date(), async (validatedSource) => {
    assert.equal(validatedSource, source);
    await rm(validatedSource);
    await symlink("/etc/passwd", validatedSource);
  });
  try {
    await assert.rejects(() => resolver.accept(request(capability, digest)));
    assert.equal(resolver.leaseCount(), 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});
